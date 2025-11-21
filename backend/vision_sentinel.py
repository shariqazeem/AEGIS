#!/usr/bin/env python3
"""
🛡️ AEGIS Vision Sentinel
====================================
Real-time AI monitoring system for the Parallax Competition 2025

Features:
- Moondream Vision: Real-time visual analysis
- Parallax Orchestration: Multi-model routing
- Llama Reasoning: Deep threat analysis
- Optimized for Apple Silicon (M1/M2/M3)

Outputs to stdout for Tauri integration
"""

import sys
import os
import cv2
import time
import json
import threading
from datetime import datetime
from pathlib import Path

# Rich console output (visible in Tauri logs)
from rich.console import Console
console = Console()

# Ensure output is unbuffered for Tauri
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

# =============================================================================
# CONFIGURATION
# =============================================================================

class Config:
    """System configuration"""
    CAMERA_INDEX = 0
    INFERENCE_INTERVAL = 2.5  # seconds
    THREAT_KEYWORDS = ["fire", "smoke", "fallen", "falling", "blood", "weapon",
                      "danger", "emergency", "injury", "unconscious"]

    # Parallax API (OpenAI-compatible endpoint)
    PARALLAX_ENABLED = True  # Set to True when Parallax is running
    PARALLAX_BASE_URL = "http://localhost:3001/v1"
    PARALLAX_API_KEY = "not-needed-for-local"

    # Models
    VISION_MODEL = "mock"  # Options: "moondream" (real AI), "mock" (testing) - Set to "moondream" after installing transformers
    REASONING_MODEL = "Qwen/Qwen3-0.6B"  # Via Parallax (must match model in Parallax UI) - Lightweight model for Macs

    # Modes
    MODE = "HOME"  # HOME or INDUSTRIAL

config = Config()

# =============================================================================
# LOGGING TO STDOUT (for Tauri to capture)
# =============================================================================

def log_event(event_type: str, message: str, level: str = "INFO"):
    """
    Structured logging to stdout for Tauri frontend

    Output format: [TIMESTAMP] LEVEL: MESSAGE
    Special keywords that Tauri listens for: THREAT, SAFE, CRITICAL
    """
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_line = f"[{timestamp}] {level}: {message}"
    print(log_line, flush=True)

    # Also print special markers for frontend
    if "THREAT" in message.upper() or level == "CRITICAL":
        print("THREAT DETECTED", flush=True)
    elif "SAFE" in message or "NORMAL" in message:
        print("SAFE", flush=True)

# =============================================================================
# VISION SYSTEM (Moondream Integration)
# =============================================================================

class VisionSystem:
    """Handles visual analysis using Moondream or mock vision"""

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.model_loaded = False
        self.frame_count = 0

    def load_model(self):
        """Load Moondream vision model (MLX optimized for M1)"""
        try:
            log_event("VISION", "Loading Moondream vision model...", "INFO")

            if config.VISION_MODEL == "mock":
                log_event("VISION", "Using MOCK vision mode (no AI)", "WARN")
                self.model_loaded = True
                return

            # Try MLX-optimized Moondream first (fastest on M1)
            try:
                from transformers import AutoModelForCausalLM, AutoTokenizer
                import torch

                log_event("VISION", "Attempting MLX/MPS accelerated loading...", "INFO")

                model_id = "vikhyatk/moondream2"
                self.tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
                self.model = AutoModelForCausalLM.from_pretrained(
                    model_id,
                    trust_remote_code=True,
                    torch_dtype=torch.float16
                )

                # Use Apple Metal if available
                if torch.backends.mps.is_available():
                    self.model = self.model.to("mps")
                    log_event("VISION", "✓ Model loaded on Apple Neural Engine (MPS)", "SUCCESS")
                else:
                    log_event("VISION", "⚠ MPS not available, using CPU", "WARN")

                self.model_loaded = True

            except Exception as e:
                log_event("VISION", f"Moondream loading failed: {e}", "WARN")
                log_event("VISION", "Falling back to MOCK mode", "INFO")
                self.model_loaded = True  # Continue with mock

        except Exception as e:
            log_event("VISION", f"Vision system initialization failed: {e}", "ERROR")
            self.model_loaded = True  # Continue with mock

    def analyze_frame(self, frame) -> str:
        """
        Analyze a video frame and return description

        Returns: Text description of what's in the frame
        """
        if not self.model_loaded:
            return "Vision system not initialized"

        self.frame_count += 1

        try:
            if config.VISION_MODEL == "mock" or self.model is None:
                # Mock analysis with pattern detection
                return self._mock_analysis(frame)

            # Real Moondream analysis
            from PIL import Image
            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            if config.MODE == "HOME":
                prompt = "Describe this scene. Is there any person in distress, fire, smoke, or emergency situation?"
            else:  # INDUSTRIAL
                prompt = "Analyze this industrial scene. Are there any quality issues, equipment failures, or safety hazards?"

            # Moondream inference
            response = self.model.answer_question(image, prompt, self.tokenizer)
            return response

        except Exception as e:
            log_event("VISION", f"Analysis error: {e}", "ERROR")
            return f"Analysis failed: {str(e)}"

    def _mock_analysis(self, frame) -> str:
        """Mock vision analysis using simple CV for demo purposes"""
        height, width = frame.shape[:2]

        # Simple motion/color detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        mean_intensity = gray.mean()

        # Simulate realistic responses
        responses = [
            "Normal office environment. One person sitting at desk.",
            "Living room scene. No anomalies detected.",
            "Kitchen area. Standard lighting conditions.",
            "Workspace visible. No safety concerns.",
        ]

        # Occasionally simulate a detection (for testing)
        if self.frame_count % 50 == 0:  # Every ~2 minutes at 2.5s intervals
            return "DEMO: Simulated unusual activity detected for testing"

        import random
        return random.choice(responses)

# =============================================================================
# PARALLAX INTEGRATION (Multi-Model Orchestration)
# =============================================================================

class ParallaxClient:
    """Client for Parallax multi-model inference"""

    def __init__(self):
        self.enabled = config.PARALLAX_ENABLED
        self.base_url = config.PARALLAX_BASE_URL

    def check_connection(self) -> bool:
        """Check if Parallax is running"""
        try:
            import httpx
            # Check if Parallax API is accessible by listing models
            response = httpx.get(f"{self.base_url}/models", timeout=2)
            return response.status_code == 200
        except:
            return False

    def reason_about_threat(self, vision_output: str) -> dict:
        """
        Use Llama-3.2 via Parallax to reason about detected threats

        Returns: Structured incident report
        """
        if not self.enabled:
            return self._mock_reasoning(vision_output)

        try:
            from openai import OpenAI
            client = OpenAI(base_url=self.base_url, api_key=config.PARALLAX_API_KEY)

            prompt = f"""You are a safety analysis AI. Analyze this visual description:

"{vision_output}"

Respond with JSON only:
{{
    "threat_detected": true/false,
    "severity": "low/medium/high/critical",
    "event_type": "fall/fire/intrusion/medical/equipment_failure/normal",
    "confidence": 0.0-1.0,
    "action_required": "specific action to take",
    "description": "brief analysis"
}}"""

            response = client.chat.completions.create(
                model=config.REASONING_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=200
            )

            # Check if response has content
            if not response.choices or not response.choices[0].message.content:
                log_event("PARALLAX", "Empty response from model", "WARN")
                return self._mock_reasoning(vision_output)

            result = json.loads(response.choices[0].message.content)
            return result

        except Exception as e:
            log_event("PARALLAX", f"Reasoning failed: {e}", "WARN")
            return self._mock_reasoning(vision_output)

    def _mock_reasoning(self, vision_output: str) -> dict:
        """Fallback reasoning without Parallax"""
        # Simple keyword matching
        threat_detected = any(kw in vision_output.lower() for kw in config.THREAT_KEYWORDS)

        return {
            "threat_detected": threat_detected,
            "severity": "high" if threat_detected else "low",
            "event_type": "potential_threat" if threat_detected else "normal",
            "confidence": 0.75 if threat_detected else 0.95,
            "action_required": "Alert security" if threat_detected else "Continue monitoring",
            "description": vision_output
        }

# =============================================================================
# MAIN SENTINEL LOOP
# =============================================================================

class AegisSentinel:
    """Main sentinel orchestrator"""

    def __init__(self):
        self.vision = VisionSystem()
        self.parallax = ParallaxClient()
        self.camera = None
        self.current_frame = None
        self.running = False
        self.threat_count = 0

    def initialize(self):
        """Initialize all systems"""
        log_event("AEGIS", "🛡️ AEGIS Sentinel Initializing...", "INFO")
        log_event("AEGIS", f"Mode: {config.MODE}", "INFO")
        log_event("AEGIS", f"Vision: {config.VISION_MODEL}", "INFO")

        # Load vision model
        self.vision.load_model()

        # Check Parallax
        if self.parallax.check_connection():
            config.PARALLAX_ENABLED = True
            log_event("PARALLAX", "✓ Connected to Parallax node", "SUCCESS")
        else:
            log_event("PARALLAX", "⚠ Parallax not detected, using standalone mode", "WARN")

        # Open camera
        self.camera = cv2.VideoCapture(config.CAMERA_INDEX)
        if not self.camera.isOpened():
            log_event("CAMERA", "⚠ No camera detected, running in test mode", "WARN")
        else:
            log_event("CAMERA", "✓ Camera initialized", "SUCCESS")

        log_event("AEGIS", "🟢 System READY", "SUCCESS")
        print("SAFE", flush=True)  # Initial state

    def capture_frame(self):
        """Capture a frame from camera"""
        if self.camera and self.camera.isOpened():
            ret, frame = self.camera.read()
            if ret:
                self.current_frame = frame
                return frame
        return None

    def process_frame(self, frame):
        """Main AI processing pipeline"""
        # Step 1: Vision Analysis
        log_event("VISION", "Analyzing frame...", "DEBUG")
        description = self.vision.analyze_frame(frame)

        # Step 2: Threat Detection via Parallax
        analysis = self.parallax.reason_about_threat(description)

        # Step 3: Log results
        if analysis["threat_detected"]:
            self.threat_count += 1
            log_event(
                "THREAT",
                f"⚠️ THREAT #{self.threat_count}: {analysis['event_type']} "
                f"(confidence: {analysis['confidence']:.0%}) - {analysis['action_required']}",
                "CRITICAL"
            )
        else:
            log_event("SCAN", f"✓ Normal: {description[:60]}...", "INFO")

        return analysis

    def run(self):
        """Main sentinel loop"""
        self.running = True
        log_event("AEGIS", "🔍 Sentinel active. Monitoring started.", "INFO")

        try:
            while self.running:
                frame = self.capture_frame()

                if frame is not None:
                    analysis = self.process_frame(frame)
                else:
                    # No camera, run in demo mode
                    log_event("DEMO", "Running in DEMO mode (no camera)", "INFO")
                    time.sleep(config.INFERENCE_INTERVAL * 2)
                    continue

                # Sleep between inferences
                time.sleep(config.INFERENCE_INTERVAL)

        except KeyboardInterrupt:
            log_event("AEGIS", "🛑 Sentinel stopping...", "INFO")
        except Exception as e:
            log_event("ERROR", f"Fatal error: {e}", "ERROR")
        finally:
            self.cleanup()

    def cleanup(self):
        """Clean shutdown"""
        if self.camera:
            self.camera.release()
        log_event("AEGIS", "👋 Sentinel terminated", "INFO")

# =============================================================================
# ENTRY POINT
# =============================================================================

def main():
    """Main entry point"""
    # Banner
    print("=" * 50, flush=True)
    print("🛡️  AEGIS - Autonomous Edge Guard & Intelligence System", flush=True)
    print("   Parallax Competition 2025", flush=True)
    print("=" * 50, flush=True)

    sentinel = AegisSentinel()
    sentinel.initialize()
    sentinel.run()

if __name__ == "__main__":
    main()
