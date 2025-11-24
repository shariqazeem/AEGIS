import sys
import os
import time
from unittest.mock import MagicMock, patch

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock external dependencies BEFORE importing vision_sentinel
sys.modules['ultralytics'] = MagicMock()
sys.modules['transformers'] = MagicMock()
sys.modules['torch'] = MagicMock()
sys.modules['PIL'] = MagicMock()

from backend.vision_sentinel import VisionSystem, config

def test_hybrid_logic():
    print("🧪 Testing Hybrid Vision Logic (Mocked)...")
    
    # Setup mocks
    mock_yolo = MagicMock()
    mock_yolo.names = {0: 'person', 1: 'knife'}
    # Mock YOLO result
    mock_box = MagicMock()
    mock_box.cls = [0]
    mock_box.conf = [0.9]
    mock_box.xyxy = MagicMock()
    mock_box.xyxy.__getitem__.return_value.tolist.return_value = [100, 100, 200, 200]
    
    mock_result = MagicMock()
    mock_result.boxes = [mock_box]
    mock_yolo.return_value = [mock_result]
    
    # Mock Moondream
    mock_moondream = MagicMock()
    mock_moondream.answer_question.return_value = "A person holding a knife."
    
    # Patch the init methods to inject our mocks
    with patch('backend.vision_sentinel.VisionSystem._init_yolo') as mock_init_yolo, \
         patch('backend.vision_sentinel.VisionSystem._init_moondream') as mock_init_moondream:
        
        # Initialize system
        vision = VisionSystem()
        vision.yolo_model = mock_yolo
        vision.moondream_model = mock_moondream
        vision.moondream_tokenizer = MagicMock()
        vision.model_loaded = True
        
        # Force Hybrid Mode
        config.VISION_MODEL = "hybrid"
        config.DEEP_SCAN_INTERVAL = 0.1
        
        # Create dummy frame
        import numpy as np
        frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        
        # Test 1: Initial Scan
        print("\n1. Running Scan 1 (YOLO)...")
        vision.last_deep_scan = time.time() # Reset timer
        desc1 = vision.analyze_frame(frame)
        print(f"   Result: {desc1}")
        
        # Verify YOLO was called
        mock_yolo.assert_called()
        # Verify Moondream was NOT called (timer not expired)
        mock_moondream.answer_question.assert_not_called()
        print("   ✓ YOLO called, Moondream skipped (timer active)")
        
        # Test 2: Force Deep Scan via Timer
        print("\n2. Running Scan 2 (Timer Expired)...")
        vision.last_deep_scan = time.time() - 10.0 # Expire timer
        desc2 = vision.analyze_frame(frame)
        print(f"   Result: {desc2}")
        
        # Verify Moondream WAS called
        mock_moondream.answer_question.assert_called()
        print("   ✓ Moondream called (Deep Scan triggered)")
        
        if "Deep Scan: A person holding a knife" in desc2:
            print("   ✓ Output merged correctly")
        else:
            print("   ❌ Output merge failed")

if __name__ == "__main__":
    test_hybrid_logic()
