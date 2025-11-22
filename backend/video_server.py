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

# Global configuration
FPS_TARGET = 30
JPEG_QUALITY = 85

# Cache camera detection result (avoid re-scanning)
_cached_camera = None
_camera_cache_valid = False

def find_camera(use_cache=True):
    """Find available camera by trying multiple indices and verifying it's a real camera"""
    global _cached_camera, _camera_cache_valid

    # Return cached result if available
    if use_cache and _camera_cache_valid and _cached_camera is not None:
        return _cached_camera

    logger.info("Searching for available cameras...")

    # Store all found cameras and prefer the one most likely to be built-in FaceTime camera
    found_cameras = []

    # On macOS, MUST use AVFoundation backend for built-in camera
    if hasattr(cv2, 'CAP_AVFOUNDATION'):
        backend = cv2.CAP_AVFOUNDATION
        backend_name = "AVFOUNDATION"
    else:
        backend = cv2.CAP_ANY
        backend_name = "ANY"

    logger.info(f"Using backend: {backend_name}")

    # Only try indices 0-1 (MacBook has max 2 cameras, more causes warnings)
    for index in range(2):
        logger.info(f"  Checking camera index {index}...")

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

                    logger.info(f"    Resolution: {width}x{height} (score: {score})")

                    if score > 0:
                        found_cameras.append({
                            'index': index,
                            'backend': backend,
                            'width': width,
                            'height': height,
                            'score': score
                        })
                    else:
                        logger.info(f"    Skipping: likely screen capture")

                camera.release()
        except Exception as e:
            logger.debug(f"  Error checking camera {index}: {e}")
            continue

    # Sort by score (highest first) and return best match
    if found_cameras:
        found_cameras.sort(key=lambda x: x['score'], reverse=True)
        best = found_cameras[0]

        logger.success(f"✓ Selected camera at index {best['index']}")
        logger.info(f"  Resolution: {best['width']}x{best['height']}")
        logger.info(f"  Backend: {backend_name}")

        # Log other cameras found
        if len(found_cameras) > 1:
            logger.info(f"  (Found {len(found_cameras)} total cameras, chose highest scored)")

        # Cache the result
        _cached_camera = (best['index'], best['backend'])
        _camera_cache_valid = True

        return _cached_camera

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
    camera_index, backend = find_camera()
    return {
        "status": "healthy",
        "camera_available": camera_index is not None,
        "camera_index": camera_index,
        "backend": backend if camera_index is not None else None
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
    camera_index, backend = find_camera()
    if camera_index is not None:
        logger.success(f"Camera ready on index {camera_index} (backend: {backend})")
    else:
        logger.warning("No camera detected - check System Preferences → Privacy → Camera")

    logger.info("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
