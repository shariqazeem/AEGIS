# AEGIS Setup Checklist - Competition Ready

**Quick reference for getting AEGIS running with Parallax**

---

## ✅ Prerequisites (Already Done)

- [x] macOS with Apple Silicon (M1/M2/M3)
- [x] Python >= 3.11.0, < 3.14.0
- [x] Node.js and npm installed
- [x] AEGIS repository cloned
- [x] Frontend built (Tauri + React)
- [x] Backend video server working
- [x] Camera displaying in Tauri app

---

## 🚀 Parallax Setup (Do This Now)

### 1. Install Parallax (~5 minutes)

```bash
# Clone Parallax repository
git clone https://github.com/GradientHQ/parallax.git
cd parallax

# Create virtual environment
python3 -m venv ./venv
source ./venv/bin/activate

# Install for macOS (Apple Silicon)
pip install -e '.[mac]'
```

**Important:** Remember the path to your parallax directory. You'll need it later!

---

### 2. Start Parallax Scheduler

**Terminal 1: Scheduler**
```bash
cd /path/to/parallax
source ./venv/bin/activate
parallax run
```

Expected output:
```
Starting scheduler...
✓ Scheduler running at http://localhost:3001
✓ Web UI available at http://localhost:3001
```

**On first run:** macOS will ask for network permission - click **"Allow"**

**Keep this terminal running!**

---

### 3. Join Worker Node

**Terminal 2: Worker**
```bash
cd /path/to/parallax
source ./venv/bin/activate
parallax join
```

Expected: UI should show node connected (green status)

**Keep this terminal running!**

---

### 4. Download Models via UI

Open in browser: **http://localhost:3001**

You'll see the Parallax setup interface.

**Download these 2 models:**
1. `vikhyatk/moondream2` (~1.8GB) - Vision
2. `meta-llama/Llama-3.2-3B-Instruct` (~2GB) - Reasoning

Click each model and download. Wait for both to complete (~10-15 min on fast internet).

---

### 5. Test Parallax Connection

**Terminal 3: Test**
```bash
cd /home/user/AEGIS/backend
source venv/bin/activate
python test_parallax.py
```

Expected output:
```
🛡️  AEGIS Parallax Integration Test
==================================================
✓ Parallax scheduler is running!
✓ OpenAI-compatible API accessible
✓ All required models found!
AEGIS is ready to run with real AI.
```

If you see errors, models aren't downloaded yet. Wait and re-run the test.

---

## 🎯 Enable Real AI in AEGIS

### Edit Configuration

Open `backend/vision_sentinel.py` and change lines 45-50:

```python
# BEFORE (mock mode):
config.VISION_MODEL = "mock"
config.PARALLAX_ENABLED = False

# AFTER (real AI):
config.VISION_MODEL = "moondream"
config.PARALLAX_ENABLED = True
```

Save the file.

---

## 🏃 Run Complete AEGIS Stack

You need **5 terminals** total:

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

### Terminal 3: Video Server
```bash
cd /home/user/AEGIS/backend
source venv/bin/activate
python video_server.py
```

### Terminal 4: AI Sentinel (WITH REAL AI!)
```bash
cd /home/user/AEGIS/backend
source venv/bin/activate
python vision_sentinel.py
```

Watch for:
```
✓ Model loaded on Apple Neural Engine (MPS)
✓ Connected to Parallax node
✓ Camera initialized
🟢 System READY
🔍 Sentinel active. Monitoring started.
```

### Terminal 5: Frontend
```bash
cd /home/user/AEGIS
npm run tauri:dev
```

---

## 🧪 Test Real AI Detection

### Test 1: Normal Scene
- Point camera at desk
- Logs show: `✓ Normal: Office desk with...`
- Dashboard: Green "SAFE"

### Test 2: Threat Detection
- Google "fire image" and show to camera
- Logs show: `⚠️ THREAT #1: fire (confidence: XX%)`
- Dashboard: Red "CRITICAL" badge

### Test 3: Offline Mode (THE KILLER DEMO!)
- **Unplug ethernet cable**
- System keeps working perfectly!
- This proves 100% sovereign, zero-cloud AI
- **Plug ethernet back in**

---

## 📹 Record Demo Video (2-3 minutes)

Show these key moments:

1. **Terminal overview** - All 5 terminals running
2. **Normal monitoring** - Camera feed + AI logs showing "Normal"
3. **Threat detection** - Show fire image → logs show "THREAT"
4. **Privacy feature** - Click "Privacy Vault" → "PURGE MEMORY" animation
5. **OFFLINE MODE** - Unplug ethernet, say "100% sovereign. Zero cloud." Still works!
6. **Tech stack callout** - Mention Moondream + Parallax + MLX on Apple Silicon

---

## 🏆 Submit to Competition

**Deadline: November 30, 2025**

### Submission Steps:

1. **Post on X/Twitter:**
   - Share demo video
   - Tag: @Gradient_HQ
   - Hashtags: #ParallaxCompetition #SovereignAI

2. **Submit form:**
   - Visit: https://gradient.network/campaign/
   - Fill out application
   - Link to X post
   - Link to GitHub repo

3. **GitHub README:**
   - Make sure your README has demo GIF/video
   - Clear setup instructions
   - Competition badges

---

## 🐛 Troubleshooting

### "Parallax not detected"
```bash
# Check if running
curl http://localhost:3001/health
# Should return: {"status": "ok"}
```

### "Models not loading"
- Check Parallax UI: http://localhost:3001
- Ensure models fully downloaded (check progress bar)
- Re-run: `python test_parallax.py`

### "Camera not showing"
- Check macOS Privacy & Security → Camera
- Allow Terminal/iTerm to access camera
- Restart video_server.py

### "Out of memory" (8GB Macs)
- Close other apps
- Use Activity Monitor to check RAM
- Temporarily use mock mode for UI testing

### "Model loaded on CPU" instead of MPS
Check if Apple Metal is available:
```python
import torch
print(torch.backends.mps.is_available())  # Should be True
```

---

## 📊 Performance Expectations (M1 MacBook Air 8GB)

| Metric | Value |
|--------|-------|
| Parallax startup | 10-20 seconds |
| Model loading | 10-30 seconds (first time) |
| Vision inference | 1.5-2.5 sec/frame |
| Reasoning inference | 1-2 seconds (on threat) |
| Total RAM usage | 5-6 GB |
| Runs 100% offline? | ✅ YES! |

---

## 🎓 Key Talking Points for Demo

1. **"Local-first AI"** - Everything runs on-device
2. **"Sovereign intelligence"** - No cloud dependency
3. **"MLX optimization"** - Uses Apple Neural Engine (MPS)
4. **"Multi-model orchestration"** - Moondream vision → Llama reasoning
5. **"Privacy by design"** - Purge memory with one click
6. **"Production ready"** - Tauri native app, not Electron
7. **"Competition winning"** - Built specifically for Parallax judges

---

## 📚 Full Documentation

- `PARALLAX_QUICKSTART.md` - Detailed setup guide
- `TESTING.md` - Complete testing instructions
- `ARCHITECTURE.md` - Technical deep-dive
- `COMPETITION_SUBMISSION.md` - Full submission strategy
- `README.md` - Project overview

---

## 🎯 You're Ready to Win!

**Prize:** DGX Spark + Mac Minis (~$50K value)

**Why AEGIS will win:**
- Real-world application (not just a chatbot)
- Production-quality UI/UX
- True multi-model orchestration (vision → reasoning)
- 100% offline capability (judges love this!)
- Privacy-first design
- Optimized for Apple Silicon
- Clear commercial potential

Good luck! 🚀🏆
