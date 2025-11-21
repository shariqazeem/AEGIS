# AEGIS Setup Guide

Complete installation guide for both frontend and backend.

## Prerequisites

### System Requirements
- **macOS** with Apple Silicon (M1/M2/M3) - Recommended
- **8GB RAM minimum** (16GB recommended for smooth performance)
- **Webcam** (built-in or external)
- **Internet connection** (for initial model downloads only)

### Software Requirements
- **Node.js 18+** and npm
- **Python 3.10+**
- **Rust** (for Tauri development)
- **Git**

---

## Part 1: Frontend Setup (Your Work)

### 1.1 Install Rust (Required for Tauri)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 1.2 Install Node Dependencies

```bash
cd frontend
npm install
```

This will install:
- React 18.3
- Tauri 2.0
- Tremor UI components
- Heroicons
- Tailwind CSS

### 1.3 Run Development Server

**Option A: Web-only mode (fastest for development)**
```bash
npm run dev
```
Visit: `http://localhost:3000`

**Option B: Tauri native app (production-like)**
```bash
npm run tauri:dev
```

### 1.4 Build for Production

```bash
npm run tauri:build
```

The native macOS app will be in `src-tauri/target/release/`

---

## Part 2: Backend Setup (AI/Python)

### 2.1 Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
```

### 2.2 Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Note for Apple Silicon:**
- PyTorch will automatically detect and use the Metal Performance Shaders (MPS) backend
- MLX is Apple-optimized and will provide ~3x faster inference than standard PyTorch

### 2.3 Install Parallax

Follow the official guide: https://github.com/GradientHQ/parallax

```bash
# This will be added after Parallax installation
```

### 2.4 Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings (camera index, model paths, etc.)
```

### 2.5 Download Models (First Time Only)

The models will auto-download on first run, but you can pre-download:

```bash
# This will download ~4GB of models
python -c "from transformers import AutoModelForCausalLM; AutoModelForCausalLM.from_pretrained('vikhyatk/moondream2', trust_remote_code=True)"
```

### 2.6 Run Backend Server

```bash
python vision_sentinel.py
```

You should see:
```
INFO: Started server process
INFO: Waiting for application startup.
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000
```

Test it:
- Open `http://localhost:8000` - Should show API status
- Open `http://localhost:8000/video_feed` - Should show webcam stream

---

## Part 3: Running the Full System

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate
python vision_sentinel.py
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

Now visit `http://localhost:3000` - You should see the AEGIS dashboard with live video!

---

## Troubleshooting

### "No module named 'mlx'" on non-M1 Macs
MLX only works on Apple Silicon. On Intel Macs, the backend will fall back to CPU inference (slower).

### Webcam not working
- Check camera permissions in System Preferences → Security & Privacy → Camera
- Try changing `CAMERA_INDEX` in `.env` (usually 0 for built-in, 1 for external)

### "Connection refused" in frontend
- Make sure the backend is running on port 8000
- Check CORS settings in `vision_sentinel.py`

### Slow inference on M1
- Close other heavy apps
- Reduce `FPS_TARGET` in `.env`
- Increase `INFERENCE_INTERVAL` to 5 seconds

---

## Next Steps

1. **Test the Vision Loop**: Verify the webcam stream is working
2. **Integrate Moondream**: Implement actual vision inference
3. **Add Parallax**: Connect multi-model orchestration
4. **Build Reasoning**: Integrate Llama-3.2 for threat analysis
5. **Polish UI**: Customize the dashboard design
6. **Film Demo**: Record the submission video

---

## Competition Submission Checklist

- [ ] Frontend runs smoothly (60 FPS UI)
- [ ] Backend processes video at <3s latency
- [ ] Moondream vision model working
- [ ] Parallax orchestration demonstrated
- [ ] At least one mode fully functional (Home or Industrial)
- [ ] Demo video recorded (<3 minutes)
- [ ] GitHub repo clean and documented
- [ ] Offline mode demonstrated (unplug ethernet!)

---

## Useful Commands

```bash
# Check if MLX is working
python -c "import mlx; print(mlx.__version__)"

# Test webcam
python -c "import cv2; cam = cv2.VideoCapture(0); print('Webcam OK' if cam.isOpened() else 'Webcam FAIL')"

# Monitor GPU usage (M1)
sudo powermetrics --samplers gpu_power

# Check Parallax status
# (will be added after Parallax setup)
```

---

## Resources

- [Tauri Documentation](https://tauri.app/)
- [Tremor UI Components](https://www.tremor.so/)
- [Parallax GitHub](https://github.com/GradientHQ/parallax)
- [Moondream Model](https://huggingface.co/vikhyatk/moondream2)
- [MLX Documentation](https://ml-explore.github.io/mlx/)
