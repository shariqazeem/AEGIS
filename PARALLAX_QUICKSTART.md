# 🚀 AEGIS Parallax Quick Start

**Get real AI running in 5 minutes**

---

## Current Status ✓

- ✅ Video server running and streaming your MacBook camera
- ✅ Frontend showing live feed with "AEGIS SENTINEL" overlay
- ✅ Backend ready for Parallax integration
- 🔄 Next: Enable real AI models

---

## Step 1: Install Parallax

### Option A: Using Homebrew (if available)
```bash
brew install parallax
```

### Option B: From Source (Most Reliable)
```bash
git clone https://github.com/GradientHQ/parallax.git
cd parallax
# Follow their README for installation
```

### Option C: Check for Pre-built Binary
Visit: https://github.com/GradientHQ/parallax/releases

---

## Step 2: Start Parallax Node

```bash
parallax run
```

**Expected output:**
```
🚀 Parallax node starting...
✓ Server running at http://localhost:3001
✓ Web UI available at http://localhost:3001
```

Keep this terminal running!

---

## Step 3: Test Parallax Connection

Open a new terminal:

```bash
cd /home/user/AEGIS/backend
source venv/bin/activate
python test_parallax.py
```

**Expected output:**
```
🛡️  AEGIS Parallax Integration Test
==================================================
🔍 Testing Parallax Connection...

✓ Parallax is running at http://localhost:3001
```

If you see ✗ (failed), Parallax isn't running. Go back to Step 2.

---

## Step 4: Download AI Models via Parallax UI

Open in browser: **http://localhost:3001**

### Download Moondream (Vision Model)
1. Click "Add Model" or "Models"
2. Search: `vikhyatk/moondream2`
3. Click "Download" (~1.8GB)
4. Wait for download to complete

### Download Llama-3.2 (Reasoning Model)
1. Search: `meta-llama/Llama-3.2-3B-Instruct`
2. Click "Download" (~2GB)
3. Wait for download to complete

**Total: ~4GB** (first time only, then models stay cached)

---

## Step 5: Enable Real AI in AEGIS

Edit `backend/vision_sentinel.py`:

```python
# Around line 45-50, change these two lines:
config.VISION_MODEL = "moondream"       # Change from "mock"
config.PARALLAX_ENABLED = True          # Change from False
```

Save the file.

---

## Step 6: Run AEGIS with Real AI

**Terminal 1: Parallax** (already running)
```bash
parallax run
```

**Terminal 2: Video Server** (already running)
```bash
cd backend
source venv/bin/activate
python video_server.py
```

**Terminal 3: AI Sentinel** (NEW - with real AI!)
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
[13:45:15] INFO: ✓ Normal: Office desk with computer and person sitting...
```

**Terminal 4: Frontend** (already running)
```bash
npm run tauri:dev
```

---

## Step 7: Test Threat Detection

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
