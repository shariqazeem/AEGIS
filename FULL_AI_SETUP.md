# AEGIS Full AI Setup Guide

**Complete setup with Moondream vision + Llama 3.1 reasoning via Parallax**

---

## Architecture Overview

AEGIS uses a **two-model pipeline**:

1. **Vision Model (Moondream)**: Loaded DIRECTLY by AEGIS via transformers
   - Analyzes video frames
   - Runs on Apple Neural Engine (MPS)
   - ~1.8GB model size

2. **Reasoning Model (Qwen3-0.6B)**: Served by Parallax
   - Analyzes vision output for threats
   - Makes decisions and recommendations
   - ~600MB model size (perfect for Macs!)

**Important**: Moondream is NOT available in Parallax, so we load it directly in Python.

---

## Part 1: Setup Parallax with Llama 3.1

### Step 1: Configure Parallax UI

Open: **http://localhost:3001**

**Configuration:**
- Node Number: **1**
- Same local network: **Yes**
- Model: Select **`Qwen/Qwen3-0.6B`**

Click **Continue** and wait for model download (~600MB, takes 2-5 min)

### Step 2: Join Worker Node

Open a **new terminal**:

```bash
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate
parallax join
```

Wait until UI shows node is **connected** (green status).

### Step 3: Test Parallax API

```bash
curl --location 'http://localhost:3001/v1/chat/completions' \
--header 'Content-Type: application/json' \
--data '{
    "max_tokens": 256,
    "messages": [
      {
        "role": "user",
        "content": "Describe signs of a fire emergency."
      }
    ],
    "stream": false
}'
```

If you get a JSON response with AI text, **Parallax is ready!** ✅

---

## Part 2: Install Moondream in AEGIS

### Step 1: Install Dependencies

```bash
cd /home/user/AEGIS/backend
source venv/bin/activate

# Install vision model dependencies
pip install transformers torch torchvision pillow
```

### Step 2: Verify Python/Torch Setup

```bash
python3 -c "import torch; print('Torch version:', torch.__version__); print('MPS available:', torch.backends.mps.is_available())"
```

Expected output:
```
Torch version: 2.x.x
MPS available: True
```

If MPS shows `True`, your M1/M2/M3 Mac is ready for ML acceleration! ✅

---

## Part 3: Configure AEGIS

### Edit `backend/vision_sentinel.py`

Open the file and update these lines (around line 45-51):

```python
# Parallax API (OpenAI-compatible endpoint)
PARALLAX_ENABLED = True  # Change from False
PARALLAX_BASE_URL = "http://localhost:3001/v1"
PARALLAX_API_KEY = "not-needed-for-local"

# Models
VISION_MODEL = "moondream"  # Change from "mock"
REASONING_MODEL = "Qwen/Qwen3-0.6B"  # Match Parallax model (lightweight for Macs!)
```

**Save the file.**

---

## Part 4: Run AEGIS Full Stack

You'll need **5 terminals** running:

### Terminal 1: Parallax Scheduler
```bash
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate
parallax run
```

Keep running ✓

### Terminal 2: Parallax Worker
```bash
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate
parallax join
```

Keep running ✓

### Terminal 3: AEGIS Video Server
```bash
cd /home/user/AEGIS/backend
source venv/bin/activate
python video_server.py
```

Expected: `✓ Camera streaming on index 0`

### Terminal 4: AEGIS AI Sentinel (THE MAIN EVENT!)
```bash
cd /home/user/AEGIS/backend
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
[13:45:02] INFO: Loading Moondream vision model...
[13:45:02] INFO: Attempting MLX/MPS accelerated loading...
[13:45:15] SUCCESS: ✓ Model loaded on Apple Neural Engine (MPS)
[13:45:16] SUCCESS: ✓ Connected to Parallax node
[13:45:17] SUCCESS: ✓ Camera initialized
[13:45:17] SUCCESS: 🟢 System READY
SAFE
[13:45:18] INFO: 🔍 Sentinel active. Monitoring started.
[13:45:20] INFO: ✓ Normal: Person sitting at desk with laptop and coffee mug...
```

**First run takes 10-30 seconds** to load Moondream into RAM. After that, it's fast!

### Terminal 5: AEGIS Frontend
```bash
cd /home/user/AEGIS
npm run tauri:dev
```

Your beautiful dashboard should now show **REAL AI analysis!** 🎉

---

## Part 5: Test Real AI Detection

### Test 1: Normal Scene (Baseline)
- Point camera at your desk
- **Logs should show**: `✓ Normal: Office desk with computer...`
- **Dashboard**: Green "SAFE" badge
- **Frequency**: Analysis every ~2.5 seconds

### Test 2: Threat Detection (Fire)
1. Google "fire image" on your phone or another screen
2. Show it to your MacBook camera
3. **Watch Terminal 4 logs** - you should see:
   ```
   [13:50:22] INFO: Analyzing frame...
   [13:50:24] CRITICAL: ⚠️ THREAT #1: fire (confidence: 85%) - Alert authorities
   THREAT DETECTED
   ```
4. **Dashboard**: Red "CRITICAL" badge appears!

### Test 3: Offline Mode (KILLER DEMO!)
1. Unplug your ethernet cable (or turn off WiFi)
2. **Everything keeps working!** Camera, AI, dashboard - all running
3. Say to camera: "100% sovereign. Zero cloud dependency."
4. This is your competition-winning moment! 🏆
5. Plug ethernet back in when done

---

## Troubleshooting

### "Model loaded on CPU" instead of MPS
**Issue**: Not using Apple Neural Engine

**Fix**:
```bash
python3 -c "import torch; print(torch.backends.mps.is_available())"
```

If `False`, reinstall PyTorch:
```bash
pip uninstall torch torchvision
pip install torch torchvision
```

### "Out of memory" errors (8GB Macs)
**Issue**: Running out of RAM

**Temporary fix** - Use smaller model in Parallax:
- Switch to `Qwen/Qwen3-0.6B` (smaller, ~600MB)
- Update config: `REASONING_MODEL = "Qwen/Qwen3-0.6B"`
- Close other apps

### "Parallax not detected"
**Issue**: Scheduler not running

**Fix**:
```bash
curl http://localhost:3001/health
# Should return: {"status": "healthy"}
```

If error, restart Parallax scheduler (Terminal 1).

### Moondream loading takes forever
**First time only**: Downloading model weights from HuggingFace (~1.8GB)

Location: `~/.cache/huggingface/hub/`

After first load, it's cached and loads in ~10 seconds.

---

## Performance Expectations

### M1/M2 MacBook Air (8GB RAM)
| Metric | Value |
|--------|-------|
| Qwen3-0.6B model download | ~600MB (~2-5 min) |
| Moondream loading (first time) | 10-30 seconds |
| Vision inference | 1.5-2.5 sec/frame |
| Qwen reasoning | 0.5-1 second (fast!) |
| Total RAM usage | 4-5 GB |
| Runs 100% offline? | ✅ YES! |

### M1/M2 MacBook Pro (16GB RAM)
| Metric | Value |
|--------|-------|
| Qwen3-0.6B model download | ~600MB (~2-5 min) |
| Moondream loading | 5-10 seconds |
| Vision inference | 1-2 sec/frame |
| Qwen reasoning | 0.3-0.5 second (very fast!) |
| Total RAM usage | 5-6 GB |
| Runs 100% offline? | ✅ YES! |

---

## Next Steps: Record Demo Video

Once everything works, record a 2-3 minute demo showing:

1. **Terminal overview** - All 5 terminals running
2. **Normal monitoring** - AI analyzing normal scene
3. **Threat detection** - Show fire → AI detects it
4. **Privacy feature** - Click "Privacy Vault" → "PURGE MEMORY"
5. **OFFLINE MODE** - Unplug ethernet, still works!
6. **Tech stack** - Mention Moondream, Parallax, Qwen3-0.6B, MLX, Apple Silicon

---

## Competition Submission Checklist

- [ ] Parallax running with Qwen3-0.6B (lightweight model for Macs)
- [ ] Moondream loaded on MPS (Apple Neural Engine)
- [ ] Camera feed working in Tauri app
- [ ] Real-time threat detection tested
- [ ] Offline mode tested (unplug ethernet)
- [ ] Demo video recorded (2-3 min)
- [ ] Posted on X/Twitter tagging @Gradient_HQ
- [ ] Submitted to: https://gradient.network/campaign/

**Deadline**: November 30, 2025
**Prize**: DGX Spark + Mac Minis (~$50K)

---

## Why AEGIS Will Win

1. **Real-world application** - Not just a chatbot
2. **Multi-model orchestration** - Vision → Reasoning pipeline
3. **100% offline** - True sovereign AI (judges love this!)
4. **Production quality** - Tauri native app, beautiful UI
5. **Apple Silicon optimized** - Uses MPS acceleration
6. **Privacy-first** - "Purge Memory" feature
7. **Clear commercial potential** - Home security, industrial monitoring

You've got this! 🚀🏆
