# 🤖 AEGIS Parallax Integration Guide

**How to enable real AI models with Parallax**

---

## Step 1: Restart Video Server with Auto-Detection

Stop your current video server (`Ctrl+C`) and restart it:

```bash
cd backend
source venv/bin/activate
python video_server.py
```

**You should now see:**
```
🎥 Starting AEGIS Video Server on http://0.0.0.0:8000
==================================================
INFO: Searching for available cameras...
INFO: Trying camera index 0...
SUCCESS: ✓ Found working camera at index 0
INFO:   Resolution: 1280x720
SUCCESS: Camera ready on index 0
==================================================
```

**Refresh your Tauri app** - you should now see your webcam!

---

## Step 2: Install Parallax

### Option A: Using Homebrew (Easiest)
```bash
# This might be available soon
brew install parallax
```

### Option B: From Source (Recommended for M1/M2/M3)

```bash
# Clone Parallax repo
git clone https://github.com/GradientHQ/parallax.git
cd parallax

# Install dependencies (follow their README)
# This will vary based on the official installation method
```

### Option C: Check Official Docs
Visit: https://github.com/GradientHQ/parallax

Look for installation instructions for macOS.

---

## Step 3: Start Parallax Node

```bash
parallax run
```

This will:
1. Start a local Parallax node
2. Open a web UI at **http://localhost:3001**
3. Create an OpenAI-compatible API endpoint

**Keep this terminal running!**

---

## Step 4: Download Models via Parallax UI

Open **http://localhost:3001** in your browser.

### Download Moondream (Vision Model)
1. In Parallax UI, find "Add Model"
2. Search for: `vikhyatk/moondream2`
3. Click "Download" (~2GB)
4. Wait for download to complete

### Download Llama-3.2 (Reasoning Model)
1. Search for: `meta-llama/Llama-3.2-3B-Instruct`
2. Click "Download" (~2GB)
3. Wait for download to complete

**Total download: ~4GB** (first time only)

---

## Step 5: Enable Real AI in AEGIS

Edit `backend/vision_sentinel.py`:

```python
# Around line 50, change these values:
config.VISION_MODEL = "moondream"      # Change from "mock"
config.PARALLAX_ENABLED = True          # Change from False
config.PARALLAX_BASE_URL = "http://localhost:3001/v1"
```

---

## Step 6: Test the Full System

Now run all services:

### Terminal 1: Parallax
```bash
parallax run
# Keep running
```

### Terminal 2: Video Server
```bash
cd backend
source venv/bin/activate
python video_server.py
# Keep running
```

### Terminal 3: AI Sentinel (with Real AI!)
```bash
cd backend
source venv/bin/activate
python vision_sentinel.py
```

**Expected output:**
```
==================================================
🛡️  AEGIS - Autonomous Edge Guard & Intelligence System
   Parallax Competition 2025
==================================================
[13:45:01] INFO: 🛡️ AEGIS Sentinel Initializing...
[13:45:01] INFO: Mode: HOME
[13:45:01] INFO: Vision: moondream
[13:45:02] INFO: Attempting MLX/MPS accelerated loading...
[13:45:10] SUCCESS: ✓ Model loaded on Apple Neural Engine (MPS)
[13:45:11] SUCCESS: ✓ Connected to Parallax node
[13:45:12] SUCCESS: ✓ Camera initialized
[13:45:12] SUCCESS: 🟢 System READY
SAFE
[13:45:13] INFO: 🔍 Sentinel active. Monitoring started.
```

### Terminal 4: Frontend
```bash
npm run tauri:dev
# Or keep your existing window running
```

---

## Step 7: Test Threat Detection

### Try These Tests:

**Test 1: Normal Scene**
- Point camera at your desk
- Should see: `[TIME] INFO: ✓ Normal: Office desk with computer...`

**Test 2: Threat Detection**
- Hold up a picture of fire (Google Images)
- Should see: `[TIME] CRITICAL: ⚠️ THREAT #1: fire (confidence: 85%)`
- Dashboard should show "CRITICAL" badge in red!

**Test 3: Parallax Routing**
- When threat detected, check Parallax logs
- Should see: Model routing vision → reasoning

---

## Troubleshooting

### "Model loaded on CPU" instead of MPS
**Fix:** Your M1/M2/M3 should auto-detect MPS. If not:
```python
# In vision_sentinel.py, check torch.backends.mps.is_available()
import torch
print(torch.backends.mps.is_available())  # Should be True
```

### "Parallax not detected"
**Check:**
```bash
curl http://localhost:3001/health
# Should return: {"status": "ok"}
```

**If not running:**
- Make sure `parallax run` is active
- Check no other process is using port 3001: `lsof -i :3000`

### "Moondream loading too slow"
**Expected:** First load takes 10-30 seconds to load the model into memory.
**Future runs:** Model stays in memory, inference is fast!

### Camera permission denied
```bash
# Check permissions
System Preferences → Security & Privacy → Camera → Terminal (allow)
```

### Out of Memory on 8GB M1
**Solution:** Close other apps or use mock mode:
```python
config.VISION_MODEL = "mock"  # For testing UI
```

---

## Performance Expectations (M1 MacBook Air, 8GB)

| Metric | Value |
|--------|-------|
| Model Loading (first time) | 10-30 seconds |
| Vision Inference | 1.5-2.5 seconds per frame |
| Reasoning Inference | 1.0-2.0 seconds (when threat detected) |
| Total Threat Detection | 3-5 seconds end-to-end |
| RAM Usage | 5-6 GB total |
| Can run offline? | ✅ Yes! Unplug ethernet to test |

---

## Competition Demo Checklist

Once everything works:

- [ ] Camera shows your face
- [ ] Moondream analyzes frames correctly
- [ ] Parallax shows up in logs as "✓ Connected"
- [ ] Threat detection works (test with fire image)
- [ ] Dashboard updates in real-time
- [ ] **Unplug ethernet** - system keeps working!
- [ ] Record 2-3 minute demo video
- [ ] Post on X tagging @Gradient_HQ
- [ ] Submit to https://gradient.network/campaign/

---

## What to Demo in Video

1. **Show the stack:**
   - Terminal 1: Parallax running
   - Terminal 2: Video server
   - Terminal 3: Sentinel logs (showing Moondream output)
   - Terminal 4: Beautiful Tauri app

2. **Show threat detection:**
   - Normal scene (logs show "Normal...")
   - Hold up fire image (logs show "THREAT DETECTED")
   - Dashboard turns red

3. **Show privacy:**
   - Go to Privacy Vault page
   - Click "PURGE MEMORY" button
   - Show the shredding animation

4. **THE KILLER MOMENT:**
   - **Unplug ethernet cable** 🔌❌
   - Show everything still works!
   - Say: "100% sovereign. Zero cloud."

---

## Next: Record Demo Video

See `COMPETITION_SUBMISSION.md` for the full demo script and submission checklist!

🏆 You're ready to win!
