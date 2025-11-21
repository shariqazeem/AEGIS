# 🚀 AEGIS Parallax Quick Start

**Get real AI running in 5 minutes**

---

## Current Status ✓

- ✅ Video server running and streaming your MacBook camera
- ✅ Frontend showing live feed with "AEGIS SENTINEL" overlay
- ✅ Backend ready for Parallax integration
- 🔄 Next: Enable real AI models

---

## Step 1: Install Parallax (macOS - Apple Silicon)

### Prerequisites
- Python >= 3.11.0, < 3.14.0
- M1/M2/M3 Mac

### Installation Steps

```bash
# Clone Parallax
git clone https://github.com/GradientHQ/parallax.git
cd parallax

# Create isolated Python virtual environment (RECOMMENDED)
python3 -m venv ./venv
source ./venv/bin/activate

# Install Parallax for macOS
pip install -e '.[mac]'
```

**Next time:** To re-activate the virtual environment:
```bash
cd parallax
source ./venv/bin/activate
```

---

## Step 2: Launch Parallax Scheduler (with UI)

From the parallax directory with activated virtual environment:

```bash
parallax run
```

**Expected output:**
```
Starting scheduler...
✓ Scheduler running at http://localhost:3001
✓ Web UI available at http://localhost:3001
```

**Keep this terminal running!**

On macOS, if prompted for network access, click **"Allow"** so Parallax can communicate on your local network.

---

## Step 3: Configure Cluster via Web UI

Open in your browser: **http://localhost:3001**

You'll see the Parallax setup interface.

### Select Node & Model Configuration:

1. **Node Type:** Select your Mac (should auto-detect M1/M2/M3)
2. **Model Selection:** Choose models to download:
   - **`vikhyatk/moondream2`** - Vision model (~1.8GB)
   - **`meta-llama/Llama-3.2-3B-Instruct`** - Reasoning model (~2GB)

3. Click **"Continue"** to start model downloads

**Note:** First download takes ~10-15 minutes depending on internet speed. Models are cached locally.

---

## Step 4: Join Node (Single Mac Setup)

Since you're running everything on one Mac:

In a **new terminal** (keep parallax scheduler running):

```bash
# Activate parallax venv first
cd /path/to/parallax
source ./venv/bin/activate

# Join the local scheduler
parallax join
```

Wait until the UI shows your node is **connected** (green status).

You'll automatically be directed to the chat interface when ready.

---

## Step 5: Test Parallax API

Open a **new terminal** and test the API:

```bash
curl --location 'http://localhost:3001/v1/chat/completions' \
--header 'Content-Type: application/json' \
--data '{
    "max_tokens": 256,
    "messages": [
      {
        "role": "user",
        "content": "Describe what you would see in a kitchen fire."
      }
    ],
    "stream": false
}'
```

**Expected:** You should get a JSON response with AI-generated text about a kitchen fire.

If this works, **Parallax is ready!** ✅

---

## Step 6: Enable Real AI in AEGIS

Now connect AEGIS to Parallax!

Edit `backend/vision_sentinel.py` (lines 45-50):

```python
# Change these two lines:
config.VISION_MODEL = "moondream"       # Change from "mock"
config.PARALLAX_ENABLED = True          # Change from False
```

Save the file.

---

## Step 7: Run AEGIS with Real AI

You'll need **4 terminals** running simultaneously:

### Terminal 1: Parallax Scheduler (already running)
```bash
cd /path/to/parallax
source ./venv/bin/activate
parallax run
```

### Terminal 2: Parallax Worker (already running)
```bash
cd /path/to/parallax
source ./venv/bin/activate
parallax join
```

### Terminal 3: AEGIS Video Server
```bash
cd /home/user/AEGIS/backend
source venv/bin/activate
python video_server.py
```

### Terminal 4: AEGIS AI Sentinel (NEW - with real AI!)
```bash
cd /home/user/AEGIS/backend
source venv/bin/activate
python vision_sentinel.py
```

**Expected output from Sentinel:**
```
==================================================
🛡️  AEGIS - Autonomous Edge Guard & Intelligence System
   Parallax Competition 2025
==================================================
[13:45:01] INFO: 🛡️ AEGIS Sentinel Initializing...
[13:45:01] INFO: Mode: HOME
[13:45:01] INFO: Vision: moondream
[13:45:02] INFO: Loading Moondream vision model...
[13:45:02] INFO: Attempting MLX/MPS accelerated loading...
[13:45:10] SUCCESS: ✓ Model loaded on Apple Neural Engine (MPS)
[13:45:11] SUCCESS: ✓ Connected to Parallax node
[13:45:12] SUCCESS: ✓ Camera initialized
[13:45:12] SUCCESS: 🟢 System READY
SAFE
[13:45:13] INFO: 🔍 Sentinel active. Monitoring started.
[13:45:15] INFO: ✓ Normal: Office desk with computer and person sitting...
```

### Terminal 5: AEGIS Frontend
```bash
cd /home/user/AEGIS
npm run tauri:dev
```

Your dashboard should now show **real-time AI analysis** from Moondream!

---

## Step 8: Test Threat Detection

### Test 1: Normal Scene
- Point camera at your desk
- Watch logs: Should see `✓ Normal: Office desk...`
- Dashboard shows "SAFE" (green)

### Test 2: Threat Detection
- Google "fire image" and show to camera
- Watch logs: Should see `⚠️ THREAT #1: fire (confidence: XX%)`
- Dashboard shows "CRITICAL" (red badge)

### Test 3: Offline Mode
- Unplug ethernet cable
- System keeps working! (100% local AI)
- Plug back in when done testing

---

## Troubleshooting

### "Model loaded on CPU" instead of MPS
Your M1/M2/M3 should auto-detect. Check:
```python
import torch
print(torch.backends.mps.is_available())  # Should be True
```

### "Parallax not detected"
```bash
# Check if Parallax is running
curl http://localhost:3001/health
# Should return: {"status": "ok"}

# Check what's using port 3001
lsof -i :3001
```

### "Moondream loading too slow"
First load takes 10-30 seconds (downloading weights to RAM).
After that, inference is fast!

### Out of Memory on 8GB Mac
Close other apps, or use mock mode for UI testing:
```python
config.VISION_MODEL = "mock"  # Temporarily
```

---

## Performance Expectations (M1 MacBook Air 8GB)

| Metric | Value |
|--------|-------|
| Model Loading (first time) | 10-30 seconds |
| Vision Inference | 1.5-2.5 seconds per frame |
| Reasoning Inference | 1-2 seconds (when threat detected) |
| RAM Usage | 5-6 GB total |
| Runs Offline? | ✅ Yes! |

---

## Competition Demo Checklist

Once everything works:

- [ ] Camera shows live feed in Tauri app
- [ ] Moondream analyzes frames correctly (check logs)
- [ ] Parallax connected (see ✓ in logs)
- [ ] Threat detection works (test with fire image)
- [ ] Dashboard updates in real-time
- [ ] **Unplug ethernet** - system keeps working!
- [ ] Record 2-3 minute demo video
- [ ] Post on X/Twitter tagging @Gradient_HQ
- [ ] Submit: https://gradient.network/campaign/

---

## What to Show in Demo Video

1. **The Stack** (show all 4 terminals)
   - Parallax node
   - Video server
   - AI sentinel with Moondream logs
   - Beautiful Tauri app

2. **Threat Detection**
   - Normal scene → logs show "Normal..."
   - Show fire image → logs show "THREAT DETECTED"
   - Dashboard turns red

3. **Privacy Feature**
   - Click "Privacy Vault" page
   - Click "PURGE MEMORY" button
   - Show shredding animation

4. **THE KILLER MOMENT** 🏆
   - Unplug ethernet cable
   - Everything still works!
   - Say: "100% sovereign. Zero cloud."

---

## Ready to Win! 🏆

Questions? Check:
- Full setup: `PARALLAX_SETUP.md`
- Testing guide: `TESTING.md`
- Competition strategy: `COMPETITION_SUBMISSION.md`

**Submission deadline: November 30, 2025**
**Prize: DGX Spark + Mac Minis (~$50K)**

Good luck! 🚀
