# 🧪 AEGIS Testing Guide (Quick Start)

**Fixed the Tauri error! Here's how to test AEGIS now:**

---

## ✅ The Error is Fixed

The `TypeError: Cannot read properties of undefined (reading 'transformCallback')` error is now resolved.

**What changed:** Frontend no longer tries to spawn Python processes automatically. Instead, you run the backend manually (which is better for testing anyway).

---

## 🚀 How to Test (3 Terminals)

### Terminal 1: Video Server

```bash
cd backend
source venv/bin/activate  # If you already created venv
# OR: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
python video_server.py
```

**Expected output:**
```
🎥 Starting AEGIS Video Server on http://0.0.0.0:8000
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Test it: Open http://localhost:8000/video_feed in browser - you should see your webcam!

---

### Terminal 2: AI Sentinel (Mock Mode)

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
[14:23:01] INFO: 🛡️ AEGIS Sentinel Initializing...
[14:23:01] INFO: Mode: HOME
[14:23:01] INFO: Vision: moondream
[14:23:01] WARN: Using MOCK vision mode (no AI)
[14:23:02] SUCCESS: 🟢 System READY
SAFE
[14:23:03] INFO: 🔍 Sentinel active. Monitoring started.
[14:23:05] INFO: ✓ Normal: Normal office environment. One person sitting at desk.
```

---

### Terminal 3: Frontend

```bash
# If first time:
npm install

# Then run:
npm run tauri dev
```

**Expected result:**
- Native app window opens
- Dashboard shows live webcam feed
- No errors in console
- "✓ Video server online" in system logs

---

## 🎯 What You Should See

### In the Dashboard:
1. **Live Video Feed** - Your webcam stream with HUD overlay
2. **Threat Badge** - Shows "SAFE" (green)
3. **System Logs** - Shows "✓ Video server online" and "🛡️ AEGIS Sentinel monitoring active"
4. **Video Status** - "REC" indicator when video server connected

### In Terminal 2 (Sentinel):
- Every 2-3 seconds: `[TIME] INFO: ✓ Normal: [description]`
- Occasionally (for testing): `DEMO: Simulated unusual activity detected`

---

## 🐛 Troubleshooting

### "No camera detected" in video server
```bash
# Test camera access
python3 -c "import cv2; cam = cv2.VideoCapture(0); print('OK' if cam.isOpened() else 'FAIL')"
```

If FAIL:
- Check System Preferences → Privacy → Camera
- Try camera index 1: Edit `backend/video_server.py` line 18, change `CAMERA_INDEX = 0` to `1`

### "Video server offline" in frontend
- Make sure Terminal 1 is running `video_server.py`
- Check http://localhost:8000/health in browser
- Check firewall isn't blocking port 8000

### Frontend still showing error
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Restart all terminals
- Make sure you pulled latest code: `git pull origin claude/build-competition-project-018SenbKazAtNeavEk48cjm3`

---

## 🎨 What to Test

### Basic Functionality:
- [ ] Video feed shows your webcam
- [ ] Dashboard UI renders without errors
- [ ] Threat badge shows "SAFE"
- [ ] System logs appear

### Navigation:
- [ ] Click "Privacy Vault" in sidebar
- [ ] See the "PURGE MEMORY" button
- [ ] Click it and watch the animation

### Mock Threat Detection:
The sentinel simulates a threat detection every ~2 minutes. Watch Terminal 2 for:
```
[14:25:30] CRITICAL: ⚠️ THREAT #1: potential_threat (confidence: 75%) - Alert security
THREAT DETECTED
```

---

## 📊 Next Steps (After Basic Testing Works)

### 1. Enable Real AI (Optional)
Edit `backend/vision_sentinel.py` line 50:
```python
config.VISION_MODEL = "moondream"  # Change from "mock"
```

Then restart Terminal 2. First run will download Moondream (~4GB).

### 2. Add Parallax Integration
```bash
# Terminal 4 (new):
parallax run
# Opens http://localhost:3001
# Select models: Moondream2 + Llama-3.2-3B
```

Edit `vision_sentinel.py` line 45:
```python
config.PARALLAX_ENABLED = True
```

### 3. Test Threat Detection
- Hold up a picture of fire to the camera
- Watch Terminal 2 for THREAT detection
- See dashboard update in real-time

---

## ✅ Success Criteria

**You're ready for the competition demo when:**
- [x] No console errors
- [x] Video feed works
- [x] Dashboard looks beautiful
- [ ] Parallax connected (optional for now)
- [ ] Real Moondream model works (optional for now)
- [ ] Threat detection triggers correctly

---

## 🎬 Ready to Record Demo?

Once testing works:
1. Follow the demo script in `COMPETITION_SUBMISSION.md`
2. Record 2-3 minute video
3. Post on X tagging @Gradient_HQ
4. Submit to competition form

---

## Need Help?

**Check logs:**
```bash
# Frontend console: Check browser console in Tauri window (Cmd+Shift+I on Mac)
# Backend logs: Visible in Terminal 1 and 2
```

**Common issues:**
- Camera permission denied → System Preferences
- Port 8000 in use → Kill existing process: `lsof -ti:8000 | xargs kill`
- Python deps missing → `pip install -r requirements.txt`

**Everything working?** Great! You're ready to win this competition! 🏆
