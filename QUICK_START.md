# AEGIS + Parallax Quick Start

## TL;DR - Start Demo in 3 Steps

### Step 1: Start Parallax Cluster
```bash
cd /Users/macbookair/projects/AEGIS
./start-parallax-demo.sh
```

### Step 2: Join Cluster (New Terminal)
```bash
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate
parallax join
```

### Step 3: Start AEGIS (New Terminal)
```bash
cd /Users/macbookair/projects/AEGIS
./start-aegis.sh
```

### Access URLs
- **Parallax UI:** http://localhost:3001
- **AEGIS Dashboard:** http://localhost:1420

---

## Manual Setup (Alternative)

### Terminal 1: Parallax Scheduler
```bash
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate
parallax run -m Qwen/Qwen3-0.6B -n 1 --host 0.0.0.0
```

### Terminal 2: Parallax Node
```bash
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate
parallax join
```

### Terminal 3: AEGIS Backend
```bash
cd /Users/macbookair/projects/AEGIS/backend
python vision_sentinel.py
# OR for demo mode without camera:
python vision_sentinel.py --test
```

### Terminal 4: AEGIS Frontend
```bash
cd /Users/macbookair/projects/AEGIS
npm run tauri dev
```

---

## Troubleshooting

### "Port already in use"
```bash
# Kill process on port 3001 (Parallax scheduler)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (Parallax node)
lsof -ti:3000 | xargs kill -9

# Kill process on port 1420 (AEGIS)
lsof -ti:1420 | xargs kill -9
```

### "Module not found"
```bash
# Reinstall Parallax
cd parallax
source ./venv/bin/activate
pip install -e '.[mac]'

# Reinstall AEGIS dependencies
cd ../backend
pip install -r requirements.txt
```

### "Camera not accessible"
```bash
# Use demo mode instead
cd backend
python vision_sentinel.py --test
```

---

## Testing Parallax Cluster

```bash
# Test Parallax API directly
curl http://localhost:3001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": false
  }'
```

---

## Stop Everything

```bash
# Press Ctrl+C in each terminal window
# Or kill all processes:
pkill -f "parallax"
pkill -f "uvicorn"
pkill -f "vision_sentinel"
```

---

## Demo Mode Commands

### Start Demo with Simulated Threats
```bash
cd /Users/macbookair/projects/AEGIS/backend
python vision_sentinel.py --test
```

This will cycle through:
- Normal scene
- Person detected
- Multiple people
- Fall detection
- Fire/emergency
- Weapon detection

Perfect for demo recording!

---

## Competition Submission URLs

- **Competition Form:** https://gradient.network/campaign/
- **Discord:** https://discord.gg/parallax
- **Twitter Tag:** @Gradient_HQ

---

## File Locations

| File | Path |
|------|------|
| Setup Guide | `/Users/macbookair/projects/AEGIS/PARALLAX_SETUP_GUIDE.md` |
| Demo Checklist | `/Users/macbookair/projects/AEGIS/DEMO_CHECKLIST.md` |
| Quick Start | `/Users/macbookair/projects/AEGIS/QUICK_START.md` |
| Demo Script | `/Users/macbookair/projects/AEGIS/start-parallax-demo.sh` |

---

**Need help? Check the full setup guide: `PARALLAX_SETUP_GUIDE.md`**
