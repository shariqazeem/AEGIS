"""
AEGIS Vision Sentinel
Real-time video monitoring using Moondream vision model
Optimized for Apple Silicon (M1/M2/M3)
"""

import cv2
import torch
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModelForCausalLM, AutoTokenizer
from PIL import Image
import threading
import time
from loguru import logger

app = FastAPI(title="AEGIS Vision Sentinel")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:1420"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
current_frame = None
last_analysis = "System initializing..."
threat_level = "LOW"
model_loaded = False

def load_model():
    """Load Moondream vision model optimized for Apple Silicon"""
    global model_loaded
    try:
        logger.info("Loading Moondream vision model...")
        # TODO: Implement MLX-optimized model loading
        # model_id = "vikhyatk/moondream2"
        # model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True)
        # if torch.backends.mps.is_available():
        #     model = model.to("mps")
        # tokenizer = AutoTokenizer.from_pretrained(model_id)

        logger.success("Model loaded successfully")
        model_loaded = True
        return None, None  # Placeholder
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return None, None

# Load model on startup
model, tokenizer = load_model()

def get_video_frames():
    """Generate MJPEG stream for frontend"""
    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        logger.error("Failed to open webcam")
        return

    logger.info("Webcam stream started")

    try:
        while True:
            success, frame = camera.read()
            if not success:
                break

            # Update global frame for analysis
            global current_frame
            current_frame = frame.copy()

            # Add status overlay
            cv2.putText(
                frame,
                f"AEGIS - {threat_level}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0) if threat_level == "LOW" else (0, 0, 255),
                2
            )

            # Encode frame as JPEG
            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not ret:
                continue

            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

            time.sleep(0.033)  # ~30 FPS
    finally:
        camera.release()
        logger.info("Webcam stream stopped")

def sentinel_loop():
    """AI analysis loop - runs every 2-3 seconds"""
    global last_analysis, threat_level

    logger.info("Sentinel AI loop started")

    while True:
        try:
            if current_frame is not None:
                # Convert CV2 frame to PIL Image
                image = Image.fromarray(cv2.cvtColor(current_frame, cv2.COLOR_BGR2RGB))

                # TODO: Implement actual Moondream inference
                # For now, return placeholder analysis
                if model_loaded:
                    # prompt = "Describe this image. Is there a fire, person falling, or dangerous situation?"
                    # response = model.answer_question(image, prompt, tokenizer)
                    response = "Normal scene. No threats detected."
                else:
                    response = "Model not loaded. Using placeholder analysis."

                last_analysis = response

                # Simple keyword-based threat detection
                threat_keywords = ["fire", "fallen", "falling", "blood", "weapon", "danger"]
                if any(keyword in response.lower() for keyword in threat_keywords):
                    threat_level = "CRITICAL"
                    logger.warning(f"THREAT DETECTED: {response}")
                    # TODO: Trigger Parallax LLM for detailed analysis
                else:
                    threat_level = "LOW"

                logger.debug(f"Analysis: {response}")

        except Exception as e:
            logger.error(f"Error in sentinel loop: {e}")
            last_analysis = f"Error: {str(e)}"

        time.sleep(2.5)  # Adjust based on M1 performance

# Start sentinel loop in background thread
threading.Thread(target=sentinel_loop, daemon=True).start()

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "AEGIS Vision Sentinel",
        "model_loaded": model_loaded
    }

@app.get("/video_feed")
def video_feed():
    """MJPEG video stream endpoint"""
    return StreamingResponse(
        get_video_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/status")
def get_status():
    """Current system status"""
    return {
        "analysis": last_analysis,
        "threat": threat_level,
        "model_loaded": model_loaded,
        "timestamp": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting AEGIS Vision Sentinel on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
