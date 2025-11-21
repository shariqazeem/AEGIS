# 🛡️ AEGIS Installation Guide

**Complete setup guide for the Parallax Competition 2025**

---

## System Requirements

- **macOS** with Apple Silicon (M1/M2/M3) - Recommended
- **8GB RAM minimum** (16GB recommended)
- **Webcam** (built-in or external)
- **Python 3.10+**
- **Node.js 18+**
- **Rust** (for Tauri)

---

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
# Install Python dependencies
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install Node dependencies
cd ..
npm install
```

### 2. Run the System

**Terminal 1 - Video Server:**
```bash
cd backend
source venv/bin/activate
python video_server.py
```

**Terminal 2 - AI Sentinel:**
```bash
cd backend
source venv/bin/activate
python vision_sentinel.py
```

**Terminal 3 - Frontend:**
```bash
npm run tauri dev
```

---

## Full Installation (With Parallax)

### Step 1: Install Parallax

Parallax is the distributed inference engine that powers AEGIS.

```bash
# Install Parallax (follow official guide)
# Visit: https://github.com/GradientHQ/parallax

# For macOS with Apple Silicon:
curl -fsSL https://raw.githubusercontent.com/GradientHQ/parallax/main/install.sh | bash

# Or build from source:
git clone https://github.com/GradientHQ/parallax.git
cd parallax
# Follow build instructions
```

### Step 2: Start Parallax Node

```bash
# Start the Parallax scheduler
parallax run

# This will:
# - Start a node at http://localhost:3001
# - Provide a web UI for model selection
# - Create an OpenAI-compatible API endpoint
```

### Step 3: Download AI Models

**Via Parallax UI:**
1. Open http://localhost:3001
2. Select models:
   - Vision: `moondream2` (1.8B params)
   - Reasoning: `meta-llama/Llama-3.2-3B-Instruct`

**Or manually via Python:**
```bash
cd backend
source venv/bin/activate

# Download Moondream
python -c "from transformers import AutoModelForCausalLM; AutoModelForCausalLM.from_pretrained('vikhyatk/moondream2', trust_remote_code=True)"

# This downloads ~4GB of models (first time only)
```

### Step 4: Configure AEGIS

Edit `backend/vision_sentinel.py`:

```python
# Around line 45-50
config.VISION_MODEL = "moondream"  # Use real Moondream
config.PARALLAX_ENABLED = True     # Enable Parallax routing
config.MODE = "HOME"                # or "INDUSTRIAL"
```

### Step 5: Run AEGIS

```bash
# Terminal 1: Parallax (if not already running)
parallax run

# Terminal 2: Video Server
cd backend && source venv/bin/activate
python video_server.py

# Terminal 3: AI Sentinel
cd backend && source venv/bin/activate
python vision_sentinel.py

# Terminal 4: Frontend
npm run tauri dev
```

---

## Running Modes

### Development Mode (Web UI)
```bash
npm run dev
# Open http://localhost:1420
```

### Native App Mode (Tauri)
```bash
npm run tauri dev
# Native macOS window opens
```

### Production Build
```bash
npm run tauri build
# Creates native .app in src-tauri/target/release/
```

---

## System Architecture

```
┌─────────────────────────────────────────────┐
│          Tauri Native App (Frontend)        │
│  - React UI                                 │
│  - Spawns Python sentinel as sidecar       │
│  - Displays video from HTTP server         │
└────────────┬────────────────────────────────┘
             │
             ├── Connects to ──────────────────┐
             │                                  │
┌────────────▼──────────────┐   ┌──────────────▼─────────────┐
│   Video Server (Port 8000) │   │  Sentinel Process (stdout) │
│   - Serves webcam MJPEG    │   │  - Moondream Vision        │
│   - FastAPI HTTP server    │   │  - Parallax Orchestration  │
└────────────────────────────┘   │  - Llama Reasoning         │
                                 └──────────────┬─────────────┘
                                                │
                                                │ Connects to
                                                │
                               ┌────────────────▼──────────────┐
                               │   Parallax Node (Port 3001)   │
                               │   - Multi-model inference     │
                               │   - Dynamic routing           │
                               │   - MLX/MPS optimization      │
                               └───────────────────────────────┘
```

---

## Troubleshooting

### "No camera detected"
- Check System Preferences → Security & Privacy → Camera
- Verify camera works: `python -c "import cv2; print(cv2.VideoCapture(0).isOpened())"`

### "Parallax not detected"
- Ensure `parallax run` is running in a separate terminal
- Check http://localhost:3001 is accessible
- AEGIS will fallback to standalone mode without Parallax

### "Model loading failed"
- On non-M1 Macs, MLX won't work. Models will use CPU (slower)
- Reduce resolution or use `config.VISION_MODEL = "mock"` for testing

### "Video server connection refused"
- Ensure `python video_server.py` is running
- Check port 8000 isn't blocked: `lsof -i :8000`

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run tauri dev
```

---

## Competition Demo Checklist

- [ ] Parallax running (`parallax run`)
- [ ] Models downloaded (Moondream + Llama-3.2)
- [ ] Video server showing webcam (`http://localhost:8000/video_feed`)
- [ ] Sentinel outputting logs
- [ ] Frontend connected to both services
- [ ] **Unplug ethernet** to prove offline operation!
- [ ] Test threat detection (show "fire" image to camera)
- [ ] Record demo video (<3 minutes)

---

## Performance Tuning (M1/M2/M3)

### For 8GB RAM systems:
```python
# In vision_sentinel.py
config.INFERENCE_INTERVAL = 5.0  # Slower inference
config.VISION_MODEL = "mock"      # Use mock until Parallax ready
```

### For 16GB+ RAM systems:
```python
config.INFERENCE_INTERVAL = 2.0   # Fast inference
config.VISION_MODEL = "moondream" # Full AI vision
```

### Monitor Performance:
```bash
# macOS GPU usage
sudo powermetrics --samplers gpu_power -i 1000

# Python memory usage
python -c "import psutil; print(f'RAM: {psutil.virtual_memory().percent}%')"
```

---

## Next Steps

1. ✅ Complete installation
2. ✅ Test video feed
3. ✅ Verify Parallax connection
4. ✅ Customize threat keywords for your demo
5. ✅ Record submission video
6. 🏆 Submit to Parallax Competition!

**Good luck! May the most sovereign AI win.** 🛡️
