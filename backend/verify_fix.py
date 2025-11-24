import sys
import os
import cv2
import numpy as np
import time

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.vision_sentinel import VisionSystem, config

def test_hybrid_vision():
    print("🧪 Testing Hybrid Vision System...")
    
    # Initialize Vision System
    vision = VisionSystem()
    
    # Force Hybrid Mode
    config.VISION_MODEL = "hybrid"
    config.DEEP_SCAN_INTERVAL = 0.1 # Short interval for testing
    
    print("1. Loading Model (Hybrid)...")
    vision.load_model()
    
    if not vision.model_loaded:
        print("❌ Failed to load hybrid model")
        return
        
    print("✓ Model loaded")
    
    # Create a dummy frame (black image)
    frame = np.zeros((720, 1280, 3), dtype=np.uint8)
    
    # Test 1: Initial Scan (Should be YOLO only)
    print("\n2. Running Initial Scan (YOLO only expected)...")
    desc1 = vision.analyze_frame(frame)
    print(f"   Result: {desc1}")
    
    # Test 2: Force Deep Scan
    print("\n3. Forcing Deep Scan (YOLO + Moondream)...")
    # Set last scan time to past to trigger interval
    vision.last_deep_scan = time.time() - 10.0 
    
    # We expect Moondream to run. Since we don't have a real image, 
    # Moondream might describe the black image or noise.
    # We just want to see if it runs without crashing.
    
    start_time = time.time()
    desc2 = vision.analyze_frame(frame)
    duration = time.time() - start_time
    
    print(f"   Result: {desc2}")
    print(f"   Duration: {duration:.2f}s")
    
    if "Deep Scan" in desc2:
        print("✓ Deep Scan triggered successfully!")
    else:
        print("⚠ Deep Scan NOT triggered (check logs)")

if __name__ == "__main__":
    test_hybrid_vision()
