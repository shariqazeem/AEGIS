"""
Quick test script to verify backend setup
Run this before starting development to ensure all dependencies work
"""

import sys

def test_imports():
    """Test all critical imports"""
    print("🧪 Testing Python dependencies...\n")

    tests = [
        ("FastAPI", "fastapi"),
        ("Uvicorn", "uvicorn"),
        ("OpenCV", "cv2"),
        ("PIL/Pillow", "PIL"),
        ("Transformers", "transformers"),
        ("PyTorch", "torch"),
        ("Loguru", "loguru"),
    ]

    failed = []

    for name, module in tests:
        try:
            __import__(module)
            print(f"✅ {name}")
        except ImportError as e:
            print(f"❌ {name} - {e}")
            failed.append(name)

    # Test Apple Silicon specific
    try:
        import mlx
        print(f"✅ MLX (Apple Silicon)")
    except ImportError:
        print(f"⚠️  MLX not found (only works on Apple Silicon)")

    print()

    if failed:
        print(f"❌ {len(failed)} package(s) failed to import")
        print(f"Run: pip install -r requirements.txt")
        return False
    else:
        print("✅ All core dependencies installed!")
        return True

def test_hardware():
    """Test hardware capabilities"""
    print("\n🖥️  Testing hardware...\n")

    # Test PyTorch device
    try:
        import torch
        if torch.backends.mps.is_available():
            print("✅ Metal Performance Shaders (MPS) available")
            print("   Your M1/M2/M3 will be used for AI inference!")
        elif torch.cuda.is_available():
            print("✅ NVIDIA CUDA available")
        else:
            print("⚠️  Using CPU only (inference will be slower)")
    except Exception as e:
        print(f"❌ PyTorch test failed: {e}")

    # Test webcam
    try:
        import cv2
        cam = cv2.VideoCapture(0)
        if cam.isOpened():
            print("✅ Webcam accessible")
            ret, frame = cam.read()
            if ret:
                print(f"   Resolution: {frame.shape[1]}x{frame.shape[0]}")
            cam.release()
        else:
            print("❌ Webcam not accessible")
            print("   Check permissions in System Preferences")
    except Exception as e:
        print(f"❌ Webcam test failed: {e}")

def test_api():
    """Test if API can start"""
    print("\n🌐 Testing API startup...\n")

    try:
        from vision_sentinel import app
        print("✅ FastAPI app imported successfully")
        print("\nYou can now run: python vision_sentinel.py")
    except Exception as e:
        print(f"❌ Failed to import FastAPI app: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("  AEGIS Backend Test Suite")
    print("=" * 50)

    all_passed = True

    all_passed &= test_imports()
    test_hardware()
    test_api()

    print("\n" + "=" * 50)
    if all_passed:
        print("✅ Backend is ready for development!")
        print("\nNext steps:")
        print("1. Copy .env.example to .env")
        print("2. Run: python vision_sentinel.py")
        print("3. Open: http://localhost:8000")
    else:
        print("❌ Some tests failed. Please fix before proceeding.")
        sys.exit(1)
    print("=" * 50)
