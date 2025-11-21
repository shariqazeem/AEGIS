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
import sys

app = FastAPI(title="AEGIS Video Server")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global configuration - try multiple camera indices
FPS_TARGET = 30
JPEG_QUALITY = 85

def find_camera():
    """Find available camera by trying multiple indices and verifying it's a real camera"""
    logger.info("Searching for available cameras...")

    # On macOS, try using AVFoundation backend explicitly for built-in camera
    # CAP_AVFOUNDATION = 1800
    backends_to_try = [
        cv2.CAP_AVFOUNDATION if hasattr(cv2, 'CAP_AVFOUNDATION') else 0,  # macOS AVFoundation
        cv2.CAP_ANY  # Auto-detect
    ]

    for backend in backends_to_try:
        logger.info(f"Trying backend: {backend}")

        # Try indices 0-3 (usually built-in camera is 0 or 1)
        for index in range(4):
            logger.info(f"  Trying camera index {index}...")

            if backend == cv2.CAP_ANY:
                camera = cv2.VideoCapture(index)
            else:
                camera = cv2.VideoCapture(index, backend)

            if camera.isOpened():
                # Test if we can actually read a frame
                ret, frame = camera.read()
                if ret and frame is not None:
                    # Check if it's a real camera (not screen capture)
                    # Real cameras typically have certain resolutions
                    height, width = frame.shape[:2]

                    # Skip if resolution is too large (likely screen capture)
                    # MacBook cameras are usually 720p (1280x720) or 1080p (1920x1080)
                    if width > 1920 or height > 1080:
                        logger.info(f"  Skipping index {index}: Resolution too high ({width}x{height}) - likely screen capture")
                        camera.release()
                        continue

                    # Check camera backend name (on macOS, built-in camera uses AVFoundation)
                    backend_name = camera.getBackendName() if hasattr(camera, 'getBackendName') else "unknown"

                    logger.success(f"✓ Found working camera at index {index}")
                    logger.info(f"  Resolution: {width}x{height}")
                    logger.info(f"  Backend: {backend_name}")
                    camera.release()
                    return index, backend
                camera.release()

    logger.warning("No suitable camera found")
    return None, cv2.CAP_ANY

def generate_frames():
    """Generate MJPEG stream"""

    # Find camera
    camera_index, backend = find_camera()

    if camera_index is None:
        logger.error("No camera detected!")
        # Generate error frame
        import numpy as np
        blank = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(blank, "NO CAMERA DETECTED", (120, 200),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.putText(blank, "Check System Preferences", (120, 250),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1)
        cv2.putText(blank, "Privacy -> Camera", (180, 290),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1)

        ret, buffer = cv2.imencode('.jpg', blank, [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY])
        frame_bytes = buffer.tobytes()

        while True:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            time.sleep(0.1)
        return

    # Open camera with the detected backend
    if backend == cv2.CAP_ANY:
        camera = cv2.VideoCapture(camera_index)
    else:
        camera = cv2.VideoCapture(camera_index, backend)

    if not camera.isOpened():
        logger.error(f"Failed to open camera at index {camera_index}")
        return

    logger.info(f"✓ Camera streaming on index {camera_index} (backend: {backend})")
    frame_count = 0

    try:
        while True:
            ret, frame = camera.read()
            if not ret:
                logger.warning("Failed to read frame from camera")
                break

            frame_count += 1

            # Add AEGIS overlay with green color (to indicate active)
            cv2.putText(
                frame,
                "AEGIS SENTINEL",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),  # Green color
                2
            )

            # Add frame counter
            cv2.putText(
                frame,
                f"Frame: {frame_count}",
                (frame.shape[1] - 180, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2
            )

            # Add timestamp
            timestamp = time.strftime("%H:%M:%S")
            cv2.putText(
                frame,
                timestamp,
                (10, frame.shape[0] - 10),
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
    camera_index = find_camera()
    return {
        "status": "healthy",
        "camera_available": camera_index is not None,
        "camera_index": camera_index
    }

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
    logger.info("=" * 50)

    # Test camera on startup
    camera_index = find_camera()
    if camera_index is not None:
        logger.success(f"Camera ready on index {camera_index}")
    else:
        logger.warning("No camera detected - check System Preferences → Privacy → Camera")

    logger.info("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
