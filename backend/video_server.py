#!/usr/bin/env python3
"""
AEGIS Video Server
==================
Serves webcam stream via HTTP for the Tauri frontend
Runs separately from the sentinel process

Start with: python video_server.py
Access at: http://localhost:8000/video_feed
"""

import cv2
import time
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

app = FastAPI(title="AEGIS Video Server")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global configuration
CAMERA_INDEX = 0
FPS_TARGET = 30
JPEG_QUALITY = 85

def generate_frames():
    """Generate MJPEG stream"""
    camera = cv2.VideoCapture(CAMERA_INDEX)

    if not camera.isOpened():
        logger.error("Failed to open camera")
        # Generate a black frame with error message
        blank = cv2.imread('/dev/null', cv2.IMREAD_COLOR)  # This will fail
        if blank is None:
            import numpy as np
            blank = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(blank, "NO CAMERA DETECTED", (50, 240),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        ret, buffer = cv2.imencode('.jpg', blank, [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY])
        frame_bytes = buffer.tobytes()

        while True:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            time.sleep(0.1)
        return

    logger.info(f"Camera opened successfully (Index: {CAMERA_INDEX})")
    frame_count = 0

    try:
        while True:
            ret, frame = camera.read()
            if not ret:
                logger.warning("Failed to read frame from camera")
                break

            frame_count += 1

            # Add AEGIS overlay
            cv2.putText(
                frame,
                "AEGIS SENTINEL",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0),
                2
            )

            # Add frame counter
            cv2.putText(
                frame,
                f"Frame: {frame_count}",
                (frame.shape[1] - 150, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                1
            )

            # Encode as JPEG
            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY])
            if not ret:
                continue

            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

            # Control FPS
            time.sleep(1.0 / FPS_TARGET)

    finally:
        camera.release()
        logger.info("Camera released")

@app.get("/")
def root():
    """API health check"""
    return {
        "service": "AEGIS Video Server",
        "status": "online",
        "endpoints": {
            "/video_feed": "MJPEG stream",
            "/health": "Health check"
        }
    }

@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/video_feed")
def video_feed():
    """MJPEG video stream endpoint"""
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

if __name__ == "__main__":
    import uvicorn
    logger.info("🎥 Starting AEGIS Video Server on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
