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

    # Performance Modes for M1 Air
    # - "performance": 2.5s interval, real AI (use when plugged in)
    # - "balanced": 5s interval, real AI (recommended for M1 Air)
    # - "eco": 10s interval, mock vision (for testing/low battery)
    PERFORMANCE_MODE = "balanced"  # Options: "performance", "balanced", "eco"

    # Set intervals based on performance mode
    _INTERVALS = {
        "performance": 2.5,
        "balanced": 5.0,
        "eco": 10.0
    }
    INFERENCE_INTERVAL = _INTERVALS.get(PERFORMANCE_MODE, 5.0)  # seconds

    THREAT_KEYWORDS = ["fire", "smoke", "fallen", "falling", "blood", "weapon",
                      "danger", "emergency", "injury", "unconscious", "intruder",
                      "alert", "help", "accident"]

    # LLM Backend Configuration
    # Options:
    # - "gradient": Gradient Cloud API (fast, for development) ✅ RECOMMENDED FOR NOW
    # - "parallax": Local Parallax (for final demo/submission)
    # - "mock": No LLM, keyword-based (lightest)
    LLM_BACKEND = "gradient"  # Change to "parallax" for final demo!

    # Gradient Cloud API (for development)
    GRADIENT_API_KEY = "ak-f5a93640ff449cd3d44457a5be3172d212355e56fdc0709f0bd5d1a042bc0d89"
    GRADIENT_BASE_URL = "https://apis.gradient.network/api/v1/ai"
    GRADIENT_MODEL = "qwen/qwen3-235b-instruct-fp8"  # Fast and good quality

    # Parallax API (for final demo)
    PARALLAX_BASE_URL = "http://localhost:3001/v1"
    PARALLAX_API_KEY = "not-needed-for-local"
    PARALLAX_MODEL = "Qwen/Qwen3-0.6B"

    # Models
    # Options: "moondream" (real AI, heavy), "mock" (for testing, light)
    # For M1 Air: use "mock" for development, "moondream" for demos
    VISION_MODEL = "moondream" if PERFORMANCE_MODE != "eco" else "mock"

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
        """
        Mock vision analysis using simple CV for demo purposes

        TESTING GUIDE:
        - Normal: Just sit normally → "Normal scene"
        - Threat: Wave hands rapidly, make sudden movements → "Movement detected"
        - Hold up paper with text "FIRE" or "HELP" → Triggers keyword detection
        """
        height, width = frame.shape[:2]

        # Simple motion/color detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        mean_intensity = gray.mean()

        # Calculate simple motion score (brightness change rate indicator)
        # In a real app, you'd track previous frames
        motion_indicator = mean_intensity / 128.0  # Normalized 0-2

        # Detect red color (could indicate fire, blood, danger signs)
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        red_mask1 = cv2.inRange(hsv, (0, 120, 70), (10, 255, 255))
        red_mask2 = cv2.inRange(hsv, (170, 120, 70), (180, 255, 255))
        red_percentage = (cv2.countNonZero(red_mask1) + cv2.countNonZero(red_mask2)) / (height * width) * 100

        # Simulate realistic scenarios
        if red_percentage > 15:  # Significant red in frame
            return "Red warning indicator detected in view. Possible fire or emergency sign."
        elif mean_intensity < 50:  # Very dark
            return "Low lighting conditions. Visibility limited. Possible power outage or nighttime."
        elif mean_intensity > 200:  # Very bright (flash, etc)
            return "Unusual bright flash detected. Investigating."

        # Occasionally simulate different scenarios for testing
        cycle = self.frame_count % 100
        if cycle == 30:
            return "Person appears to have fallen. No movement detected. Emergency situation possible."
        elif cycle == 60:
            return "Smoke or unusual haze visible in frame. Possible fire hazard."
        elif cycle == 90:
            return "HELP sign visible in frame. Person requesting assistance."

        # Normal responses
        responses = [
            "Normal office environment. One person at workstation. No anomalies.",
            "Living room scene. Standard activity. All clear.",
            "Kitchen area visible. Normal lighting and conditions.",
            "Workspace scene. Person present and active. No concerns.",
            "Home environment. Occupant appears safe and comfortable.",
        ]

        import random
        return random.choice(responses)

# =============================================================================
# LLM REASONING (Gradient Cloud or Parallax)
# =============================================================================

class ReasoningClient:
    """Client for LLM reasoning - supports Gradient Cloud API or local Parallax"""

    def __init__(self):
        self.backend = config.LLM_BACKEND

        if self.backend == "gradient":
            self.base_url = config.GRADIENT_BASE_URL
            self.api_key = config.GRADIENT_API_KEY
            self.model = config.GRADIENT_MODEL
        elif self.backend == "parallax":
            self.base_url = config.PARALLAX_BASE_URL
            self.api_key = config.PARALLAX_API_KEY
            self.model = config.PARALLAX_MODEL
        else:  # mock
            self.base_url = None
            self.api_key = None
            self.model = None

    def check_connection(self) -> bool:
        """Check if LLM backend is available"""
        if self.backend == "mock":
            log_event("LLM", "Using mock reasoning (no API)", "INFO")
            return True

        backend_name = "Gradient Cloud" if self.backend == "gradient" else "Parallax"

        try:
            if self.backend == "gradient":
                # Test Gradient API with requests
                import requests
                response = requests.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": "test"}],
                        "max_tokens": 5,
                        "temperature": 0.3
                    },
                    timeout=10
                )
                if response.status_code == 200:
                    log_event("LLM", f"✓ Connected to {backend_name}", "SUCCESS")
                    return True
                else:
                    log_event("LLM", f"Connection failed: {response.status_code}", "WARN")
                    return False

            else:  # parallax
                from openai import OpenAI
                client = OpenAI(base_url=self.base_url, api_key=self.api_key)

                # Try a simple API call to verify connection with retries
                max_retries = 2
                for attempt in range(max_retries):
                    try:
                        response = client.chat.completions.create(
                            model=self.model,
                            messages=[{"role": "user", "content": "test"}],
                            max_tokens=5,
                            timeout=10
                        )
                        log_event("LLM", f"✓ Connected to {backend_name}", "SUCCESS")
                        return True
                    except Exception as e:
                        if attempt < max_retries - 1:
                            log_event("LLM", f"Connection attempt {attempt + 1} failed, retrying...", "DEBUG")
                            time.sleep(1)
                            continue
                        raise e
        except Exception as e:
            log_event("LLM", f"{backend_name} connection failed: {e}", "WARN")
            return False

    def reason_about_threat(self, vision_output: str) -> dict:
        """
        Use LLM (Gradient or Parallax) to reason about detected threats

        Returns: Structured incident report
        """
        if self.backend == "mock":
            return self._mock_reasoning(vision_output)

        try:
            # Simplified prompt for cleaner JSON output
            prompt = f"""Analyze this scene and respond with ONLY valid JSON, no other text:

Scene: "{vision_output}"

JSON format: {{"threat_detected": false, "severity": "low", "event_type": "normal", "confidence": 0.9, "action_required": "Continue monitoring", "description": "brief analysis"}}

For threats use: {{"threat_detected": true, "severity": "high", "event_type": "fall/fire/intrusion", "confidence": 0.8, "action_required": "Alert security", "description": "what you see"}}"""

            if self.backend == "gradient":
                # Use Gradient Cloud API with requests
                import requests
                response = requests.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": 500,  # Increased from 200 - was causing empty responses!
                        "temperature": 0.1,  # Lower for more consistent JSON
                        "stream": False
                    },
                    timeout=30  # Increased timeout
                )

                if response.status_code != 200:
                    log_event("LLM", f"API error: {response.status_code}", "WARN")
                    return self._mock_reasoning(vision_output)

                data = response.json()
                if not data.get("choices") or len(data["choices"]) == 0:
                    log_event("LLM", "Empty response from Gradient", "WARN")
                    return self._mock_reasoning(vision_output)

                # Safely get content
                message = data["choices"][0].get("message", {})
                content = message.get("content", "")
                if content:
                    content = content.strip()

                log_event("LLM", f"Response length: {len(content) if content else 0}", "DEBUG")

                # Check for empty content
                if not content:
                    log_event("LLM", "Empty content in response", "WARN")
                    return self._mock_reasoning(vision_output)

                # Try direct JSON parse first (most common case)
                try:
                    result = json.loads(content)
                    log_event("LLM", f"✓ Parsed: threat={result.get('threat_detected', 'unknown')}", "DEBUG")
                    return result
                except json.JSONDecodeError as e:
                    log_event("LLM", f"JSON parse error: {e}", "DEBUG")

                # Try extraction patterns if direct parse failed
                result = self._extract_json(content)
                if result:
                    log_event("LLM", f"✓ Extracted: threat={result.get('threat_detected')}", "DEBUG")
                    return result

                log_event("LLM", "Failed to parse JSON, using fallback", "WARN")
                return self._mock_reasoning(vision_output)

            else:  # parallax
                from openai import OpenAI
                client = OpenAI(base_url=self.base_url, api_key=self.api_key)

                response = client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                    max_tokens=500
                )

                # Robust response validation for Parallax
                if not response or not hasattr(response, 'choices'):
                    log_event("LLM", "Invalid response structure", "WARN")
                    return self._mock_reasoning(vision_output)

                if not response.choices or len(response.choices) == 0:
                    log_event("LLM", "Empty response choices", "WARN")
                    return self._mock_reasoning(vision_output)

                message = response.choices[0].message
                if not message or not hasattr(message, 'content') or not message.content:
                    log_event("LLM", "No content in response", "WARN")
                    return self._mock_reasoning(vision_output)

                content = message.content.strip()
                log_event("LLM", f"Response: {content[:100]}...", "DEBUG")

                # Parse JSON - try to extract it from the response
                result = self._extract_json(content)
                if result:
                    return result

                log_event("LLM", "Failed to parse JSON, using fallback", "WARN")
                return self._mock_reasoning(vision_output)

        except Exception as e:
            log_event("LLM", f"Reasoning failed: {e}", "WARN")
            return self._mock_reasoning(vision_output)

    def _extract_json(self, content: str) -> dict:
        """Extract JSON from LLM response - handles wrapped text"""
        import re

        # Try direct parse first
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            pass

        # Try to find JSON in the response (might be wrapped in markdown or text)
        json_patterns = [
            r'```json\s*(.*?)\s*```',  # Markdown code block
            r'```\s*(.*?)\s*```',       # Plain code block
            r'(\{[^{}]*"threat_detected"[^{}]*\})',  # JSON object with threat_detected
            r'(\{.*?\})',               # Any JSON object
        ]

        for pattern in json_patterns:
            match = re.search(pattern, content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError:
                    continue

        # Try to create a basic response from text analysis
        content_lower = content.lower()
        if any(word in content_lower for word in ['safe', 'normal', 'no threat', 'all clear']):
            return {
                "threat_detected": False,
                "severity": "low",
                "event_type": "normal",
                "confidence": 0.85,
                "action_required": "Continue monitoring",
                "description": content[:200]
            }
        elif any(word in content_lower for word in ['threat', 'danger', 'alert', 'fire', 'fall']):
            return {
                "threat_detected": True,
                "severity": "high",
                "event_type": "potential_threat",
                "confidence": 0.75,
                "action_required": "Alert security",
                "description": content[:200]
            }

        return None

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
        self.reasoning = ReasoningClient()
        self.camera = None
        self.current_frame = None
        self.running = False
        self.threat_count = 0
        self.camera_index = None
        self.camera_backend = None

    def find_camera(self):
        """Find available camera by trying multiple indices and verifying it's a real camera"""
        log_event("CAMERA", "Searching for available cameras...", "DEBUG")

        # Store all found cameras and prefer the one most likely to be built-in FaceTime camera
        found_cameras = []

        # On macOS, MUST use AVFoundation backend for built-in camera
        if hasattr(cv2, 'CAP_AVFOUNDATION'):
            backend = cv2.CAP_AVFOUNDATION
            backend_name = "AVFOUNDATION"
        else:
            backend = cv2.CAP_ANY
            backend_name = "ANY"

        log_event("CAMERA", f"Using backend: {backend_name}", "DEBUG")

        # Only try indices 0-1 (MacBook has max 2 cameras, more causes warnings)
        for index in range(2):
            log_event("CAMERA", f"  Checking camera index {index}...", "DEBUG")

            try:
                camera = cv2.VideoCapture(index, backend)

                if camera.isOpened():
                    # Test if we can actually read a frame
                    ret, frame = camera.read()
                    if ret and frame is not None:
                        height, width = frame.shape[:2]

                        # MacBook built-in FaceTime cameras are:
                        # - HD (720p): 1280x720
                        # - Some newer models: 1920x1080 but this is rare
                        # Screen captures are usually much larger or match display resolution

                        # Calculate if this looks like a real camera
                        is_720p = (width == 1280 and height == 720)
                        is_1080p = (width == 1920 and height == 1080)
                        is_vga = (width == 640 and height == 480)

                        # Score cameras (prefer lower resolution = more likely built-in)
                        score = 0
                        if is_720p:
                            score = 100  # Most likely built-in FaceTime camera
                        elif is_vga:
                            score = 90   # Older or lower quality camera
                        elif is_1080p:
                            score = 50   # Could be built-in or screen capture
                        elif width <= 1920 and height <= 1080:
                            score = 30   # Might be a camera
                        else:
                            score = 0    # Likely screen capture

                        log_event("CAMERA", f"    Resolution: {width}x{height} (score: {score})", "DEBUG")

                        if score > 0:
                            found_cameras.append({
                                'index': index,
                                'backend': backend,
                                'width': width,
                                'height': height,
                                'score': score
                            })
                        else:
                            log_event("CAMERA", f"    Skipping: likely screen capture", "DEBUG")

                    camera.release()
            except Exception as e:
                log_event("CAMERA", f"  Error checking camera {index}: {e}", "DEBUG")
                continue

        # Sort by score (highest first) and return best match
        if found_cameras:
            found_cameras.sort(key=lambda x: x['score'], reverse=True)
            best = found_cameras[0]

            log_event("CAMERA", f"✓ Selected camera at index {best['index']}", "DEBUG")
            log_event("CAMERA", f"  Resolution: {best['width']}x{best['height']}", "DEBUG")
            log_event("CAMERA", f"  Backend: {backend_name}", "DEBUG")

            # Log other cameras found
            if len(found_cameras) > 1:
                log_event("CAMERA", f"  (Found {len(found_cameras)} total cameras, chose highest scored)", "DEBUG")

            return best['index'], best['backend']

        log_event("CAMERA", "No suitable camera found", "DEBUG")
        return None, cv2.CAP_ANY

    def initialize(self):
        """Initialize all systems"""
        log_event("AEGIS", "🛡️ AEGIS Sentinel Initializing...", "INFO")
        log_event("AEGIS", f"Mode: {config.MODE}", "INFO")
        log_event("AEGIS", f"Performance: {config.PERFORMANCE_MODE.upper()} ({config.INFERENCE_INTERVAL}s interval)", "INFO")
        log_event("AEGIS", f"Vision: {config.VISION_MODEL}", "INFO")

        # Load vision model
        self.vision.load_model()

        # Check LLM backend
        backend_name = "Gradient Cloud" if config.LLM_BACKEND == "gradient" else "Parallax" if config.LLM_BACKEND == "parallax" else "Mock"
        log_event("LLM", f"Backend: {backend_name}", "INFO")

        if self.reasoning.check_connection():
            log_event("LLM", f"✓ {backend_name} ready", "SUCCESS")
        else:
            log_event("LLM", f"⚠ {backend_name} not available, using fallback", "WARN")

        # Find and open camera with robust detection
        try:
            self.camera_index, self.camera_backend = self.find_camera()

            if self.camera_index is not None:
                # Open camera with the detected backend
                if self.camera_backend == cv2.CAP_ANY:
                    self.camera = cv2.VideoCapture(self.camera_index)
                else:
                    self.camera = cv2.VideoCapture(self.camera_index, self.camera_backend)

                if self.camera.isOpened():
                    # Verify we can read a frame
                    ret, frame = self.camera.read()
                    if ret:
                        log_event("CAMERA", "✓ Camera initialized", "SUCCESS")
                    else:
                        log_event("CAMERA", "⚠ Camera opened but cannot read frames", "WARN")
                        self.camera.release()
                        self.camera = None
                else:
                    log_event("CAMERA", "⚠ Failed to open camera", "WARN")
                    self.camera = None
            else:
                log_event("CAMERA", "⚠ No camera detected, running in test mode", "WARN")
                self.camera = None
        except Exception as e:
            log_event("CAMERA", f"Camera initialization failed: {e}", "WARN")
            self.camera = None

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

        # Step 2: Threat Detection via LLM
        analysis = self.reasoning.reason_about_threat(description)

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
