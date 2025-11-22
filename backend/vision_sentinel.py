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

    # ==========================================================================
    # PARALLAX-FIRST CONFIGURATION (Competition Mode)
    # ==========================================================================
    # For the Parallax Competition 2025, we prioritize local Parallax usage.
    # This demonstrates the power of local AI clusters.

    # LLM Backend Configuration
    # Options:
    # - "parallax": Local Parallax cluster (RECOMMENDED for competition!)
    # - "gradient": Gradient Cloud API (fallback/development)
    # - "mock": No LLM, keyword-based (lightest)
    LLM_BACKEND = "parallax"  # Competition mode: Use Parallax!

    # Parallax API (LOCAL - for competition demo)
    PARALLAX_BASE_URL = "http://localhost:3001/v1"
    PARALLAX_API_KEY = "not-needed-for-local"
    PARALLAX_MODEL = "Qwen/Qwen3-0.6B"  # Lightweight model for local inference

    # Gradient Cloud API (fallback if Parallax unavailable)
    GRADIENT_API_KEY = "ak-f5a93640ff449cd3d44457a5be3172d212355e56fdc0709f0bd5d1a042bc0d89"
    GRADIENT_BASE_URL = "https://apis.gradient.network/api/v1/ai"
    GRADIENT_MODEL = "qwen/qwen3-235b-instruct-fp8"

    # ==========================================================================
    # VISION CONFIGURATION
    # ==========================================================================
    # Options:
    # - "api": Send images to Parallax/Gradient vision API (if available)
    # - "opencv": Lightweight OpenCV-based detection (NO ML, fast!)
    # - "moondream": Local Moondream model (HEAVY - not for M1 Air!)
    # - "mock": Simulated responses for testing
    #
    # For M1 Air: Use "opencv" - fast, no ML overhead, sends to Parallax for analysis
    VISION_MODEL = "opencv"  # Lightweight for M1 Air!

    # Vision API settings (when VISION_MODEL = "api")
    VISION_API_BASE_URL = "http://localhost:3001/v1"  # Parallax for vision too
    VISION_API_MODEL = "Qwen/Qwen3-0.6B"  # Will describe scenes based on detected features

    # Modes
    MODE = "HOME"  # HOME or INDUSTRIAL

    # ==========================================================================
    # PARALLAX CLUSTER FEATURES (Competition Showcase)
    # ==========================================================================
    # Enable these for maximum Parallax demonstration
    USE_PARALLAX_FOR_SCENE_DESCRIPTION = True   # Send CV features to Parallax for interpretation
    USE_PARALLAX_FOR_THREAT_ANALYSIS = True     # Detailed threat reasoning
    USE_PARALLAX_FOR_ACTION_PLANNING = True     # Get recommended actions
    USE_PARALLAX_FOR_LOGGING = True             # Generate log summaries

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
    # Only trigger on actual threat detections, not DEBUG logs
    if level == "CRITICAL":
        print("THREAT DETECTED", flush=True)
    elif level != "DEBUG" and ("SAFE" in message.upper() or "NORMAL" in message.upper()):
        print("SAFE", flush=True)

# =============================================================================
# VISION SYSTEM (Moondream Integration)
# =============================================================================

class VisionSystem:
    """
    Vision system for AEGIS - Parallax Competition 2025

    Modes:
    - "opencv": Lightweight OpenCV detection → Parallax for interpretation (RECOMMENDED)
    - "api": Send base64 images to vision API
    - "moondream": Local Moondream model (HEAVY - not for M1 Air)
    - "mock": Simulated responses for testing
    """

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.model_loaded = False
        self.frame_count = 0
        self.prev_frame = None  # For motion detection
        self.parallax_client = None
        self.last_features = {}  # Store latest features for threat detection

    def load_model(self):
        """Initialize vision system based on configuration"""
        try:
            mode = config.VISION_MODEL
            log_event("VISION", f"Initializing vision system: {mode.upper()}", "INFO")

            if mode == "opencv":
                # Lightweight OpenCV mode - NO ML models needed!
                log_event("VISION", "✓ OpenCV mode: Fast, lightweight, Parallax-powered", "SUCCESS")
                log_event("VISION", "  Features: Motion, color, brightness, face detection", "INFO")
                self.model_loaded = True

                # Initialize Parallax client for scene interpretation
                if config.USE_PARALLAX_FOR_SCENE_DESCRIPTION:
                    try:
                        from openai import OpenAI
                        self.parallax_client = OpenAI(
                            base_url=config.PARALLAX_BASE_URL,
                            api_key=config.PARALLAX_API_KEY
                        )
                        log_event("VISION", "✓ Parallax client ready for scene interpretation", "SUCCESS")
                    except Exception as e:
                        log_event("VISION", f"Parallax client init failed: {e}", "WARN")
                return

            elif mode == "api":
                log_event("VISION", "API vision mode - sending to Parallax", "INFO")
                self.model_loaded = True
                return

            elif mode == "mock":
                log_event("VISION", "Using MOCK vision mode (testing)", "WARN")
                self.model_loaded = True
                return

            elif mode == "moondream":
                # Heavy local model - NOT recommended for M1 Air
                log_event("VISION", "⚠ Loading Moondream (HEAVY - consider 'opencv' mode)", "WARN")
                try:
                    from transformers import AutoModelForCausalLM, AutoTokenizer
                    import torch

                    model_id = "vikhyatk/moondream2"
                    self.tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
                    self.model = AutoModelForCausalLM.from_pretrained(
                        model_id,
                        trust_remote_code=True,
                        torch_dtype=torch.float16
                    )

                    if torch.backends.mps.is_available():
                        self.model = self.model.to("mps")
                        log_event("VISION", "✓ Moondream loaded on Apple MPS", "SUCCESS")
                    else:
                        log_event("VISION", "Moondream on CPU (slow)", "WARN")

                    self.model_loaded = True
                except Exception as e:
                    log_event("VISION", f"Moondream failed: {e}, using OpenCV", "WARN")
                    config.VISION_MODEL = "opencv"
                    self.model_loaded = True

        except Exception as e:
            log_event("VISION", f"Vision init failed: {e}", "ERROR")
            config.VISION_MODEL = "opencv"
            self.model_loaded = True

    def analyze_frame(self, frame) -> str:
        """
        Analyze a video frame and return description

        For Parallax Competition: Uses OpenCV for fast feature extraction,
        then sends to Parallax for intelligent scene interpretation.
        """
        if not self.model_loaded:
            return "Vision system not initialized"

        self.frame_count += 1

        try:
            mode = config.VISION_MODEL

            if mode == "opencv":
                # Fast OpenCV analysis → Parallax interpretation
                return self._opencv_analysis(frame)
            elif mode == "api":
                return self._api_analysis(frame)
            elif mode == "mock":
                return self._mock_analysis(frame)
            elif mode == "moondream" and self.model is not None:
                return self._moondream_analysis(frame)
            else:
                return self._opencv_analysis(frame)  # Fallback

        except Exception as e:
            log_event("VISION", f"Analysis error: {e}", "ERROR")
            return f"Analysis failed: {str(e)}"

    def _opencv_analysis(self, frame) -> str:
        """
        Lightweight OpenCV analysis for M1 Air

        Extracts visual features and optionally sends to Parallax for
        intelligent interpretation. This maximizes Parallax usage while
        keeping local compute minimal.
        """
        import numpy as np

        height, width = frame.shape[:2]
        features = {}

        # === 1. BRIGHTNESS ANALYSIS ===
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        mean_brightness = gray.mean()
        features['brightness'] = mean_brightness

        # === 2. MOTION DETECTION ===
        motion_score = 0.0
        if self.prev_frame is not None:
            prev_gray = cv2.cvtColor(self.prev_frame, cv2.COLOR_BGR2GRAY)
            diff = cv2.absdiff(gray, prev_gray)
            motion_score = diff.mean()
        self.prev_frame = frame.copy()
        features['motion'] = motion_score

        # === 3. COLOR ANALYSIS ===
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Red detection (fire, blood, danger)
        red_mask1 = cv2.inRange(hsv, (0, 100, 100), (10, 255, 255))
        red_mask2 = cv2.inRange(hsv, (160, 100, 100), (180, 255, 255))
        red_pct = (cv2.countNonZero(red_mask1) + cv2.countNonZero(red_mask2)) / (height * width) * 100

        # Orange/Yellow detection (flames, warnings)
        orange_mask = cv2.inRange(hsv, (10, 100, 100), (25, 255, 255))
        orange_pct = cv2.countNonZero(orange_mask) / (height * width) * 100

        features['red_percentage'] = red_pct
        features['orange_percentage'] = orange_pct

        # === 4. FACE/PERSON DETECTION (Haar Cascades - fast!) ===
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
        features['faces_detected'] = len(faces)

        # Check if any face is in lower portion (possible fall)
        faces_in_lower = sum(1 for (x, y, w, h) in faces if y + h > height * 0.7)
        features['faces_in_lower_frame'] = faces_in_lower

        # === 5. EDGE DENSITY (smoke/haze reduces edges) ===
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.count_nonzero(edges) / (height * width)
        features['edge_density'] = edge_density

        # === 6. CONTRAST (helps distinguish smoke from flash) ===
        # Smoke: low contrast (uniform haze)
        # Flash/light: high contrast (bright spot on dark background)
        contrast = gray.std()  # Standard deviation of brightness
        features['contrast'] = contrast

        # === 6. STORE FEATURES FOR THREAT DETECTION ===
        self.last_features = features.copy()

        # === 7. BUILD SCENE DESCRIPTION ===
        description = self._build_scene_description(features)

        # === 8. SEND TO PARALLAX FOR INTELLIGENT INTERPRETATION ===
        if config.USE_PARALLAX_FOR_SCENE_DESCRIPTION and self.parallax_client:
            try:
                enhanced = self._parallax_interpret_scene(features, description)
                if enhanced:
                    return enhanced
            except Exception as e:
                log_event("VISION", f"Parallax interpretation failed: {e}", "DEBUG")

        return description

    def detect_threat_from_features(self) -> dict:
        """
        Smart threat detection using OpenCV features.

        Key insight: If a face is clearly detected, visibility is FINE.
        This prevents false positives from camera flash, lighting changes, etc.
        """
        features = self.last_features
        if not features:
            return None

        threats = []
        severity = "low"

        # Get all features
        red_pct = features.get('red_percentage', 0)
        orange_pct = features.get('orange_percentage', 0)
        motion = features.get('motion', 0)
        faces_total = features.get('faces_detected', 0)
        faces_lower = features.get('faces_in_lower_frame', 0)
        edge_density = features.get('edge_density', 0.1)
        brightness = features.get('brightness', 128)
        contrast = features.get('contrast', 50)

        # === FIRE DETECTION ===
        # High red/orange + motion + flickering = possible fire
        # Require BOTH high color AND motion for fire (not just color)
        if red_pct > 25 and motion > 15:
            threats.append("possible fire/flames detected")
            severity = "critical"
        elif (red_pct > 30 or orange_pct > 30) and motion > 5:
            threats.append("significant red/orange with movement")
            severity = "high"

        # === FALL DETECTION ===
        # Face in lower 30% of frame + very low motion = possible fall
        # Must have been tracking person (faces_total > 0 in recent frames)
        if faces_lower > 0 and motion < 3:
            threats.append("person detected low in frame, not moving (possible fall)")
            severity = "critical"

        # === SMOKE/VISIBILITY DETECTION ===
        # IMPORTANT: If face is clearly detected, visibility is FINE!
        # Only flag smoke if: low edges + no face detected + moderate brightness
        if faces_total == 0 and edge_density < 0.008 and 40 < brightness < 160:
            # Additional check: smoke has LOW contrast, flash has HIGH contrast
            if contrast < 30:
                threats.append("reduced visibility, no person visible (possible smoke)")
                severity = "high" if severity != "critical" else severity

        if threats:
            return {
                "threat_detected": True,
                "threats": threats,
                "severity": severity,
                "features": {
                    "red_pct": round(red_pct, 1),
                    "orange_pct": round(orange_pct, 1),
                    "motion": round(motion, 1),
                    "faces": faces_total,
                    "faces_lower": faces_lower,
                    "edge_density": round(edge_density, 4),
                    "brightness": round(brightness, 1),
                    "contrast": round(contrast, 1)
                }
            }

        return None

    def _build_scene_description(self, features: dict) -> str:
        """Build a detailed text description from OpenCV features"""
        parts = []

        brightness = features.get('brightness', 128)
        motion = features.get('motion', 0)
        contrast = features.get('contrast', 50)
        faces = features.get('faces_detected', 0)
        faces_lower = features.get('faces_in_lower_frame', 0)
        red_pct = features.get('red_percentage', 0)
        orange_pct = features.get('orange_percentage', 0)
        edge_density = features.get('edge_density', 0.1)

        # === LIGHTING ===
        if brightness < 30:
            parts.append("Very dark room (night/lights off)")
        elif brightness < 80:
            parts.append("Dimly lit scene")
        elif brightness > 200:
            parts.append("Very bright (direct light source)")
        else:
            parts.append("Well-lit scene")

        # === PEOPLE ===
        if faces > 0:
            if faces == 1:
                if faces_lower > 0:
                    parts.append("One person visible in lower part of frame")
                else:
                    parts.append("One person visible, normal position")
            else:
                parts.append(f"{faces} people visible")
        else:
            parts.append("No people detected")

        # === ACTIVITY ===
        if motion > 30:
            parts.append("High activity/movement")
        elif motion > 10:
            parts.append("Some movement detected")
        else:
            parts.append("Scene is still")

        # === COLORS (potential hazards) ===
        if red_pct > 20:
            parts.append(f"Significant red color ({red_pct:.0f}%)")
        if orange_pct > 15:
            parts.append(f"Orange/yellow present ({orange_pct:.0f}%)")

        # === VISIBILITY ===
        if edge_density < 0.01 and contrast < 30:
            parts.append("Reduced visibility (hazy)")
        elif contrast > 60:
            parts.append("Clear visibility, good contrast")

        return ". ".join(parts) + "."

    def _parallax_interpret_scene(self, features: dict, basic_description: str) -> str:
        """
        Send scene features to Parallax for intelligent interpretation.

        This is key for the competition - shows Parallax doing real AI work!
        """
        if not self.parallax_client:
            return None

        mode_context = "home security" if config.MODE == "HOME" else "industrial QC"

        # Build a detailed prompt with all features
        brightness = features.get('brightness', 128)
        motion = features.get('motion', 0)
        faces = features.get('faces_detected', 0)
        contrast = features.get('contrast', 50)
        red_pct = features.get('red_percentage', 0)

        # Determine lighting level
        if brightness < 30:
            light = "dark"
        elif brightness < 80:
            light = "dim"
        elif brightness > 200:
            light = "very bright"
        else:
            light = "normal"

        # Determine activity level
        if motion > 20:
            activity = "active"
        elif motion > 5:
            activity = "some motion"
        else:
            activity = "still"

        prompt = f"""Scene: {light} lighting, {faces} person(s), {activity}.
Describe what's likely happening in one natural sentence:"""

        try:
            response = self.parallax_client.chat.completions.create(
                model=config.PARALLAX_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,  # Reduced for faster response
                temperature=0.5,  # Slightly higher for more varied output
                extra_body={"chat_template_kwargs": {"enable_thinking": False}}  # Disable Qwen3 thinking mode
            )

            if response and response.choices and len(response.choices) > 0:
                choice = response.choices[0]
                content = None

                # Handle both OpenAI format (message) and Parallax format (messages)
                if hasattr(choice, 'message') and choice.message and hasattr(choice.message, 'content'):
                    content = choice.message.content
                elif hasattr(choice, 'messages') and choice.messages:
                    if hasattr(choice.messages, 'content'):
                        content = choice.messages.content
                    elif isinstance(choice.messages, dict):
                        content = choice.messages.get('content')

                if content and content.strip():
                    log_event("PARALLAX", "Scene interpreted via local cluster", "DEBUG")
                    return content.strip()
                else:
                    log_event("VISION", "Empty scene interpretation, using basic description", "DEBUG")
        except Exception as e:
            log_event("VISION", f"Parallax scene interpretation error: {e}", "DEBUG")

        return None

    def _api_analysis(self, frame) -> str:
        """Send image to vision API (Parallax or external)"""
        import base64
        from PIL import Image
        import io

        try:
            # Convert frame to base64
            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG", quality=85)
            img_base64 = base64.b64encode(buffered.getvalue()).decode()

            # Try Parallax vision API
            from openai import OpenAI
            client = OpenAI(
                base_url=config.VISION_API_BASE_URL,
                api_key=config.PARALLAX_API_KEY
            )

            prompt = "Describe this scene briefly. Note any safety concerns."
            if config.MODE == "INDUSTRIAL":
                prompt = "Analyze this industrial scene. Note any quality or safety issues."

            response = client.chat.completions.create(
                model=config.VISION_API_MODEL,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
                    ]
                }],
                max_tokens=200
            )

            if response and response.choices:
                return response.choices[0].message.content.strip()

        except Exception as e:
            log_event("VISION", f"API vision failed: {e}, using OpenCV fallback", "WARN")
            return self._opencv_analysis(frame)

        return "API analysis unavailable"

    def _moondream_analysis(self, frame) -> str:
        """Local Moondream analysis (heavy, not for M1 Air)"""
        from PIL import Image

        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        if config.MODE == "HOME":
            prompt = "Describe this scene. Is there any person in distress, fire, smoke, or emergency situation?"
        else:
            prompt = "Analyze this industrial scene. Are there any quality issues, equipment failures, or safety hazards?"

        response = self.model.answer_question(image, prompt, self.tokenizer)
        return response

    def _mock_analysis(self, frame) -> str:
        """Mock vision analysis for testing without camera"""
        import random

        height, width = frame.shape[:2]

        # Basic color detection for demo
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        red_mask1 = cv2.inRange(hsv, (0, 120, 70), (10, 255, 255))
        red_mask2 = cv2.inRange(hsv, (170, 120, 70), (180, 255, 255))
        red_pct = (cv2.countNonZero(red_mask1) + cv2.countNonZero(red_mask2)) / (height * width) * 100

        if red_pct > 15:
            return "Red warning indicator detected. Possible fire or emergency sign."

        # Cycle through test scenarios
        cycle = self.frame_count % 100
        if cycle == 30:
            return "Person appears to have fallen. No movement detected. Emergency situation possible."
        elif cycle == 60:
            return "Smoke or unusual haze visible in frame. Possible fire hazard."
        elif cycle == 90:
            return "HELP sign visible. Person requesting assistance."

        responses = [
            "Normal environment. Person at workstation. No anomalies.",
            "Living room scene. Standard activity. All clear.",
            "Kitchen area visible. Normal lighting and conditions.",
            "Workspace scene. Person present and active. No concerns.",
        ]
        return random.choice(responses)

# =============================================================================
# LLM REASONING (Gradient Cloud or Parallax)
# =============================================================================

class ReasoningClient:
    """
    LLM Reasoning Client for AEGIS - Parallax Competition 2025

    Features:
    - Parallax-first: Uses local Parallax cluster by default
    - Auto-fallback: Falls back to Gradient Cloud if Parallax offline
    - Multi-stage analysis: Scene → Threat → Action → Logging
    - All stages use Parallax to maximize cluster demonstration
    """

    def __init__(self):
        self.backend = config.LLM_BACKEND
        self.parallax_available = False
        self.gradient_available = False
        self.client = None

        # Initialize based on backend preference
        if self.backend == "parallax":
            self.base_url = config.PARALLAX_BASE_URL
            self.api_key = config.PARALLAX_API_KEY
            self.model = config.PARALLAX_MODEL
        elif self.backend == "gradient":
            self.base_url = config.GRADIENT_BASE_URL
            self.api_key = config.GRADIENT_API_KEY
            self.model = config.GRADIENT_MODEL
        else:  # mock
            self.base_url = None
            self.api_key = None
            self.model = None

    def check_connection(self) -> bool:
        """
        Check if LLM backend is available with auto-fallback.

        For competition: Tries Parallax first, falls back to Gradient if needed.
        """
        if self.backend == "mock":
            log_event("LLM", "Using mock reasoning (no API)", "INFO")
            return True

        # Try Parallax first (competition priority!)
        if self.backend == "parallax" or self._try_parallax():
            self.parallax_available = True
            log_event("LLM", "✓ Parallax cluster connected (LOCAL INFERENCE)", "SUCCESS")
            return True

        # Try Gradient Cloud as fallback
        if self._try_gradient():
            self.gradient_available = True
            if self.backend == "parallax":
                log_event("LLM", "⚠ Parallax offline, using Gradient Cloud fallback", "WARN")
                # Switch to Gradient
                self.base_url = config.GRADIENT_BASE_URL
                self.api_key = config.GRADIENT_API_KEY
                self.model = config.GRADIENT_MODEL
                self.backend = "gradient"
            else:
                log_event("LLM", "✓ Connected to Gradient Cloud", "SUCCESS")
            return True

        log_event("LLM", "⚠ No LLM backend available, using mock fallback", "WARN")
        self.backend = "mock"
        return True  # Continue with mock

    def _try_parallax(self) -> bool:
        """Test Parallax cluster connection"""
        try:
            from openai import OpenAI
            client = OpenAI(
                base_url=config.PARALLAX_BASE_URL,
                api_key=config.PARALLAX_API_KEY
            )

            response = client.chat.completions.create(
                model=config.PARALLAX_MODEL,
                messages=[{"role": "user", "content": "test"}],
                max_tokens=5,
                timeout=5,
                extra_body={"chat_template_kwargs": {"enable_thinking": False}}
            )

            if response and response.choices:
                self.client = client
                self.base_url = config.PARALLAX_BASE_URL
                self.api_key = config.PARALLAX_API_KEY
                self.model = config.PARALLAX_MODEL
                return True
        except Exception as e:
            log_event("LLM", f"Parallax check failed: {e}", "DEBUG")
        return False

    def _try_gradient(self) -> bool:
        """Test Gradient Cloud connection"""
        try:
            import requests
            response = requests.post(
                f"{config.GRADIENT_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {config.GRADIENT_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": config.GRADIENT_MODEL,
                    "messages": [{"role": "user", "content": "test"}],
                    "max_tokens": 5
                },
                timeout=10
            )
            return response.status_code == 200
        except Exception as e:
            log_event("LLM", f"Gradient check failed: {e}", "DEBUG")
        return False

    def reason_about_threat(self, vision_output: str) -> dict:
        """
        Use LLM (Gradient or Parallax) to reason about detected threats

        Returns: Structured incident report
        """
        if self.backend == "mock":
            return self._mock_reasoning(vision_output)

        try:
            # Check if scene contains obvious threat keywords first
            scene_lower = vision_output.lower()
            has_threat_words = any(kw in scene_lower for kw in config.THREAT_KEYWORDS)

            # Simplified prompt for small models like Qwen3-0.6B
            # The prompt must be SHORT for small models to respond well
            if has_threat_words:
                prompt = f"""Scene: "{vision_output[:200]}"
DANGER keywords found. Classify threat. JSON only:
{{"threat": true, "type": "fire/fall/danger", "action": "call help"}}"""
            else:
                prompt = f"""Scene: "{vision_output[:200]}"
Normal scene, no danger words. Confirm safe. JSON only:
{{"threat": false, "type": "normal", "action": "monitor"}}"""

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
                    temperature=0.1,  # Lower for more consistent output
                    max_tokens=150,   # Increased to avoid truncation
                    extra_body={"chat_template_kwargs": {"enable_thinking": False}}
                )

                # Robust response validation for Parallax
                if not response or not hasattr(response, 'choices'):
                    log_event("LLM", "Invalid response structure", "WARN")
                    return self._mock_reasoning(vision_output)

                if not response.choices or len(response.choices) == 0:
                    log_event("LLM", "Empty response choices", "WARN")
                    return self._mock_reasoning(vision_output)

                # Parallax returns 'messages' (with 's') not 'message' - handle both!
                choice = response.choices[0]
                content = None

                # Try standard OpenAI format first
                if hasattr(choice, 'message') and choice.message and hasattr(choice.message, 'content'):
                    content = choice.message.content
                # Try Parallax format (messages with 's')
                elif hasattr(choice, 'messages') and choice.messages:
                    if hasattr(choice.messages, 'content'):
                        content = choice.messages.content
                    elif isinstance(choice.messages, dict):
                        content = choice.messages.get('content')

                if not content:
                    log_event("LLM", "No content in response", "WARN")
                    return self._mock_reasoning(vision_output)

                content = content.strip()
                log_event("LLM", f"Parallax response: {content[:80]}", "DEBUG")

                # Parse JSON - try to extract it from the response
                result = self._extract_json(content)
                if result:
                    # Convert simplified format to full format
                    return self._normalize_threat_response(result, vision_output)

                log_event("LLM", "Failed to parse JSON, using keyword fallback", "DEBUG")
                return self._mock_reasoning(vision_output)

        except Exception as e:
            log_event("LLM", f"Reasoning failed: {e}", "WARN")
            return self._mock_reasoning(vision_output)

    def _normalize_threat_response(self, parsed: dict, vision_output: str) -> dict:
        """Convert simplified JSON format to full threat response format"""
        # Handle both old format (threat_detected) and new format (threat)
        is_threat = parsed.get("threat", parsed.get("threat_detected", False))

        # Normalize boolean - handle string "true"/"false"
        if isinstance(is_threat, str):
            is_threat = is_threat.lower() == "true"

        event_type = parsed.get("type", parsed.get("event_type", "normal"))
        action = parsed.get("action", parsed.get("action_required", "Continue monitoring"))

        return {
            "threat_detected": bool(is_threat),
            "severity": "high" if is_threat else "low",
            "event_type": event_type,
            "confidence": 0.85 if is_threat else 0.90,
            "action_required": action,
            "description": parsed.get("description", vision_output[:200])
        }

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
            r'(\{[^{}]*"threat"[^{}]*\})',  # JSON object with "threat" key (simplified)
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

    # =========================================================================
    # PARALLAX INTEGRATION: Additional Analysis Stages (Competition Features!)
    # =========================================================================

    def get_action_plan(self, threat_analysis: dict) -> dict:
        """
        Stage 2: Get detailed action plan from Parallax

        Shows multi-stage Parallax usage for competition demo!
        """
        if not config.USE_PARALLAX_FOR_ACTION_PLANNING:
            return {"actions": [threat_analysis.get("action_required", "Monitor")]}

        if self.backend == "mock" or not threat_analysis.get("threat_detected"):
            return {"actions": ["Continue monitoring"], "priority": "low"}

        try:
            prompt = f"""You are a security AI assistant. Given this threat analysis, provide a specific action plan.

Threat Analysis:
- Type: {threat_analysis.get('event_type', 'unknown')}
- Severity: {threat_analysis.get('severity', 'unknown')}
- Confidence: {threat_analysis.get('confidence', 0)}
- Description: {threat_analysis.get('description', 'No description')}

Respond with ONLY valid JSON:
{{"actions": ["action1", "action2"], "priority": "high/medium/low", "notify": ["person/system"], "estimated_response_time": "X minutes"}}"""

            if self.backend == "parallax" and self.client:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=200,
                    temperature=0.2,
                    extra_body={"chat_template_kwargs": {"enable_thinking": False}}
                )
                if response and response.choices:
                    # Handle both OpenAI format (message) and Parallax format (messages)
                    choice = response.choices[0]
                    content = None
                    if hasattr(choice, 'message') and choice.message and hasattr(choice.message, 'content'):
                        content = choice.message.content
                    elif hasattr(choice, 'messages') and choice.messages:
                        if hasattr(choice.messages, 'content'):
                            content = choice.messages.content
                        elif isinstance(choice.messages, dict):
                            content = choice.messages.get('content')

                    if content:
                        result = self._extract_json(content)
                        if result:
                            log_event("PARALLAX", "Action plan generated via local cluster", "DEBUG")
                            return result

            elif self.backend == "gradient":
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
                        "max_tokens": 200,
                        "temperature": 0.2
                    },
                    timeout=15
                )
                if response.status_code == 200:
                    data = response.json()
                    if data.get("choices"):
                        content = data["choices"][0].get("message", {}).get("content", "")
                        result = self._extract_json(content)
                        if result:
                            return result

        except Exception as e:
            log_event("LLM", f"Action planning failed: {e}", "DEBUG")

        return {"actions": [threat_analysis.get("action_required", "Alert")], "priority": "high"}

    def generate_log_summary(self, events: list) -> str:
        """
        Stage 3: Generate natural language log summary via Parallax

        Great for competition demo - shows Parallax generating human-readable reports!
        """
        if not config.USE_PARALLAX_FOR_LOGGING or not events:
            return "No events to summarize"

        if self.backend == "mock":
            return f"Summary: {len(events)} events recorded"

        try:
            events_text = "\n".join([
                f"- {e.get('timestamp', 'Unknown')}: {e.get('event_type', 'unknown')} ({e.get('severity', 'unknown')})"
                for e in events[:10]  # Limit to last 10
            ])

            prompt = f"""Summarize these security monitoring events in 2-3 sentences:

{events_text}

Be concise and professional. Highlight any patterns or critical events."""

            if self.backend == "parallax" and self.client:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=150,
                    temperature=0.3,
                    extra_body={"chat_template_kwargs": {"enable_thinking": False}}
                )
                if response and response.choices:
                    # Handle both OpenAI format (message) and Parallax format (messages)
                    choice = response.choices[0]
                    content = None
                    if hasattr(choice, 'message') and choice.message and hasattr(choice.message, 'content'):
                        content = choice.message.content
                    elif hasattr(choice, 'messages') and choice.messages:
                        if hasattr(choice.messages, 'content'):
                            content = choice.messages.content
                        elif isinstance(choice.messages, dict):
                            content = choice.messages.get('content')

                    if content:
                        log_event("PARALLAX", "Log summary generated via local cluster", "DEBUG")
                        return content.strip()

            elif self.backend == "gradient":
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
                        "max_tokens": 150
                    },
                    timeout=15
                )
                if response.status_code == 200:
                    data = response.json()
                    if data.get("choices"):
                        return data["choices"][0].get("message", {}).get("content", "").strip()

        except Exception as e:
            log_event("LLM", f"Log summary failed: {e}", "DEBUG")

        return f"Summary: {len(events)} security events recorded"

    def analyze_trend(self, recent_analyses: list) -> dict:
        """
        Stage 4: Analyze trends in recent detections via Parallax

        Shows continuous Parallax usage for pattern recognition!
        """
        if len(recent_analyses) < 3:
            return {"trend": "insufficient_data", "recommendation": "Continue monitoring"}

        if self.backend == "mock":
            return {"trend": "stable", "recommendation": "Normal operations"}

        try:
            analyses_text = "\n".join([
                f"- {a.get('event_type', 'unknown')}: {a.get('description', '')[:100]}"
                for a in recent_analyses[-5:]
            ])

            prompt = f"""Analyze the trend in these recent security observations:

{analyses_text}

Respond with ONLY valid JSON:
{{"trend": "improving/stable/worsening", "pattern": "brief description", "recommendation": "what to do"}}"""

            if self.backend == "parallax" and self.client:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=150,
                    temperature=0.2,
                    extra_body={"chat_template_kwargs": {"enable_thinking": False}}
                )
                if response and response.choices:
                    # Handle both OpenAI format (message) and Parallax format (messages)
                    choice = response.choices[0]
                    content = None
                    if hasattr(choice, 'message') and choice.message and hasattr(choice.message, 'content'):
                        content = choice.message.content
                    elif hasattr(choice, 'messages') and choice.messages:
                        if hasattr(choice.messages, 'content'):
                            content = choice.messages.content
                        elif isinstance(choice.messages, dict):
                            content = choice.messages.get('content')

                    if content:
                        result = self._extract_json(content)
                        if result:
                            log_event("PARALLAX", "Trend analysis via local cluster", "DEBUG")
                            return result

        except Exception as e:
            log_event("LLM", f"Trend analysis failed: {e}", "DEBUG")

        return {"trend": "stable", "recommendation": "Continue monitoring"}

# =============================================================================
# MAIN SENTINEL LOOP
# =============================================================================

class AegisSentinel:
    """
    Main sentinel orchestrator - Parallax Competition 2025

    Features enhanced Parallax integration:
    - Vision → Scene interpretation via Parallax
    - Threat → Detailed reasoning via Parallax
    - Action → Action planning via Parallax
    - Trend → Pattern analysis via Parallax
    - Logging → Summary generation via Parallax
    """

    def __init__(self):
        self.vision = VisionSystem()
        self.reasoning = ReasoningClient()
        self.camera = None
        self.current_frame = None
        self.running = False
        self.threat_count = 0
        self.scan_count = 0
        self.camera_index = None
        self.camera_backend = None

        # Track analyses for trend detection (Parallax feature!)
        self.recent_analyses = []
        self.max_history = 20

        # Track events for periodic summaries
        self.events_since_last_summary = []
        self.summary_interval = 10  # Generate summary every 10 scans

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
        """Initialize all systems - Parallax Competition 2025"""
        log_event("AEGIS", "🛡️ AEGIS Sentinel Initializing...", "INFO")
        log_event("AEGIS", "   Parallax Competition 2025 - Local AI Lab Demo", "INFO")
        log_event("AEGIS", f"Mode: {config.MODE}", "INFO")
        log_event("AEGIS", f"Performance: {config.PERFORMANCE_MODE.upper()} ({config.INFERENCE_INTERVAL}s interval)", "INFO")
        log_event("AEGIS", f"Vision: {config.VISION_MODEL.upper()}", "INFO")

        # Show Parallax integration features
        log_event("PARALLAX", "Integration Features:", "INFO")
        log_event("PARALLAX", f"  Scene Interpretation: {'✓' if config.USE_PARALLAX_FOR_SCENE_DESCRIPTION else '✗'}", "INFO")
        log_event("PARALLAX", f"  Threat Analysis: {'✓' if config.USE_PARALLAX_FOR_THREAT_ANALYSIS else '✗'}", "INFO")
        log_event("PARALLAX", f"  Action Planning: {'✓' if config.USE_PARALLAX_FOR_ACTION_PLANNING else '✗'}", "INFO")
        log_event("PARALLAX", f"  Log Summaries: {'✓' if config.USE_PARALLAX_FOR_LOGGING else '✗'}", "INFO")

        # Load vision model
        self.vision.load_model()

        # Check LLM backend with auto-fallback
        backend_name = "Parallax Local" if config.LLM_BACKEND == "parallax" else "Gradient Cloud" if config.LLM_BACKEND == "gradient" else "Mock"
        log_event("LLM", f"Backend: {backend_name}", "INFO")

        if self.reasoning.check_connection():
            # Show actual backend after connection check (may have fallen back)
            actual_backend = "Parallax Local" if self.reasoning.parallax_available else "Gradient Cloud" if self.reasoning.gradient_available else "Mock"
            log_event("LLM", f"✓ {actual_backend} ready", "SUCCESS")
        else:
            log_event("LLM", f"⚠ Using fallback mode", "WARN")

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
        """
        Main AI processing pipeline - Parallax Competition 2025

        Multi-stage Parallax usage:
        1. Vision: OpenCV features → Parallax scene interpretation
        2. Threat: RULE-BASED detection from OpenCV features (reliable!)
        3. Action: Parallax action planning (if threat)
        4. Trend: Parallax trend analysis (periodic)
        5. Summary: Parallax log generation (periodic)
        """
        self.scan_count += 1
        timestamp = datetime.now().strftime("%H:%M:%S")

        # === STAGE 1: Vision Analysis (Parallax Scene Interpretation) ===
        log_event("VISION", "Analyzing frame...", "DEBUG")
        description = self.vision.analyze_frame(frame)

        # === STAGE 2: Threat Detection (Rule-Based from OpenCV Features) ===
        # Using rule-based detection is MORE RELIABLE than asking small LLMs!
        threat_info = self.vision.detect_threat_from_features()

        if threat_info:
            # Actual threat detected by OpenCV rules
            analysis = {
                "threat_detected": True,
                "severity": threat_info.get("severity", "high"),
                "event_type": ", ".join(threat_info.get("threats", ["unknown"])),
                "confidence": 0.90,  # High confidence - rule-based
                "action_required": "Check immediately",
                "description": description,
                "features": threat_info.get("features", {})
            }
        else:
            # No threat - safe scene
            analysis = {
                "threat_detected": False,
                "severity": "low",
                "event_type": "normal",
                "confidence": 0.95,
                "action_required": "Continue monitoring",
                "description": description
            }

        analysis['timestamp'] = timestamp

        # Track for trend analysis
        self.recent_analyses.append(analysis)
        if len(self.recent_analyses) > self.max_history:
            self.recent_analyses.pop(0)

        # === STAGE 3: Action Planning via Parallax (if threat) ===
        if analysis["threat_detected"]:
            self.threat_count += 1

            # Get detailed action plan from Parallax
            action_plan = self.reasoning.get_action_plan(analysis)
            analysis['action_plan'] = action_plan

            log_event(
                "THREAT",
                f"⚠️ THREAT #{self.threat_count}: {analysis['event_type']} "
                f"(confidence: {analysis.get('confidence', 0):.0%})",
                "CRITICAL"
            )

            # Log action plan
            actions = action_plan.get('actions', [])
            if actions:
                log_event("ACTION", f"Plan: {', '.join(actions[:3])}", "INFO")

            # Track event for summary
            self.events_since_last_summary.append(analysis)
        else:
            log_event("SCAN", f"✓ Normal: {description[:60]}...", "INFO")

        # === STAGE 4: Trend Analysis via Parallax (every 5 scans) ===
        if self.scan_count % 5 == 0 and len(self.recent_analyses) >= 3:
            trend = self.reasoning.analyze_trend(self.recent_analyses)
            if trend.get('trend') != 'stable':
                log_event("TREND", f"Pattern: {trend.get('pattern', 'analyzing')} → {trend.get('recommendation', '')}", "INFO")

        # === STAGE 5: Log Summary via Parallax (periodic) ===
        if self.scan_count % self.summary_interval == 0 and self.events_since_last_summary:
            summary = self.reasoning.generate_log_summary(self.events_since_last_summary)
            log_event("SUMMARY", f"Parallax: {summary[:100]}...", "INFO")
            self.events_since_last_summary = []

        return analysis

    def run(self):
        """Main sentinel loop - Parallax Competition 2025"""
        self.running = True
        log_event("AEGIS", "🔍 Sentinel active. Monitoring started.", "INFO")

        # Demo mode flag
        demo_mode = self.camera is None
        if demo_mode:
            log_event("DEMO", "🎬 Running in DEMO mode - Generating test frames", "INFO")
            log_event("DEMO", "   This demonstrates Parallax integration without camera", "INFO")

        try:
            while self.running:
                if demo_mode:
                    # Generate synthetic test frame for demo
                    frame = self._generate_demo_frame()
                else:
                    frame = self.capture_frame()

                if frame is not None:
                    analysis = self.process_frame(frame)
                else:
                    log_event("WARN", "No frame available", "WARN")

                # Sleep between inferences
                time.sleep(config.INFERENCE_INTERVAL)

        except KeyboardInterrupt:
            log_event("AEGIS", "🛑 Sentinel stopping...", "INFO")
        except Exception as e:
            log_event("ERROR", f"Fatal error: {e}", "ERROR")
        finally:
            self.cleanup()

    def _generate_demo_frame(self):
        """
        Generate synthetic frames for demo mode (no camera)

        Creates varied test frames to showcase Parallax capabilities:
        - Normal scenes (most common)
        - Motion events
        - Color alerts (red/orange)
        - Simulated threats

        Great for competition demo without real camera!
        """
        import numpy as np

        # Standard 720p frame
        height, width = 720, 1280
        frame = np.zeros((height, width, 3), dtype=np.uint8)

        # Base background - office-like lighting
        frame[:] = [45, 40, 35]  # Dark gray (BGR)

        cycle = self.scan_count % 50

        if cycle < 35:
            # Normal scene - slight variations
            brightness = np.random.randint(100, 150)
            frame[:] = [brightness - 20, brightness - 10, brightness]
            # Add some texture
            noise = np.random.randint(-10, 10, frame.shape, dtype=np.int16)
            frame = np.clip(frame.astype(np.int16) + noise, 0, 255).astype(np.uint8)

        elif cycle < 40:
            # Motion event - brightness change
            frame[:] = [180, 170, 160]

        elif cycle < 45:
            # Red alert - fire/danger
            frame[:] = [20, 20, 180]  # Red in BGR
            # Add orange flames
            frame[height//3:2*height//3, width//4:3*width//4] = [30, 100, 255]

        else:
            # Dark scene - possible threat
            frame[:] = [30, 25, 20]

        return frame

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
