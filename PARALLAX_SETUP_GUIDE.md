# AEGIS + Parallax Distributed Inference Setup Guide

## Competition Submission - Track 2

---

## Hardware Challenge: Intel vs Apple Silicon

### Your Setup
- **MacBook Air M1** (Apple Silicon) - ✅ Supported
- **MacBook Pro 2015** (Intel) - ⚠️ Limited Support

### The Problem
Parallax's macOS support is specifically for **Apple Silicon** chips (M1/M2/M3). The Intel MacBook Pro 2015 cannot run the macOS version of Parallax.

### Solutions (Choose One)

---

## Solution 1: Single-Node Simulation (Recommended for Demo)

**Best for**: Quick setup, reliable demo recording

Since you only have one Apple Silicon Mac, simulate distributed inference on a single machine:

### Setup Steps

```bash
# On MacBook Air M1

# 1. Navigate to parallax directory
cd /Users/macbookair/projects/AEGIS/parallax

# 2. Activate virtual environment (if not already)
source ./venv/bin/activate

# 3. Start Parallax scheduler
parallax run -m Qwen/Qwen3-0.6B -n 1 --host 0.0.0.0

# This starts:
# - Scheduler on port 3001
# - Frontend on http://localhost:3001
```

**In a second terminal:**

```bash
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate

# Join the cluster (connects to local scheduler)
parallax join
```

**In a third terminal:**

```bash
# Start AEGIS backend
cd /Users/macbookair/projects/AEGIS
./start-aegis.sh
```

### Verification

- Parallax frontend: http://localhost:3001
- AEGIS dashboard: http://localhost:1420
- Check scheduler logs show "1 node connected"

---

## Solution 2: Multi-Node with Linux on Intel Mac

**Best for**: True distributed setup (requires more setup time)

If your MacBook Pro 2015 can boot Linux or run Linux in a VM:

### On Intel MacBook Pro (Linux)

```bash
# Install Parallax for Linux
git clone https://github.com/GradientHQ/parallax.git
cd parallax
pip install -e '.[gpu]'  # Even without GPU, this is the Linux version

# Join cluster using M1 Mac's IP
parallax join -s {M1-Mac-IP-Address}:3001
```

### On MacBook Air M1

```bash
# Start scheduler accessible from network
cd /Users/macbookair/projects/AEGIS/parallax
source ./venv/bin/activate
parallax run -m Qwen/Qwen3-0.6B -n 2 --host 0.0.0.0

# Note: -n 2 means expecting 2 nodes (M1 + Intel Mac)
```

### Finding Your M1 Mac's IP

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Look for something like: 192.168.1.XXX
```

---

## Solution 3: Cloud Node (Alternative)

Use a cloud Linux instance as your second node:

```bash
# On AWS/DigitalOcean/etc (Ubuntu)
git clone https://github.com/GradientHQ/parallax.git
cd parallax
pip install -e '.[gpu]'

# Join using M1 Mac's public IP or relay server
parallax join -s {scheduler-address}
```

---

## Testing Distributed Inference

Once your cluster is running, test the API:

```bash
curl http://localhost:3001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "max_tokens": 512,
    "messages": [
      {
        "role": "user",
        "content": "Analyze this security event: Person detected near entrance at 2 AM"
      }
    ],
    "stream": false
  }'
```

---

## Demo Recording Strategy

### Pre-Recording Checklist

- [ ] Parallax cluster running (check http://localhost:3001)
- [ ] AEGIS backend running (check http://localhost:1420)
- [ ] Test camera feed working
- [ ] Run demo mode to verify: `cd backend && python vision_sentinel.py --test`
- [ ] Close unnecessary apps (free up screen space)
- [ ] Prepare talking points (see below)

### Recording Tools

**macOS Native:**
```bash
# Record screen + audio
# Cmd + Shift + 5 -> Options -> Show Mouse Clicks
```

**Professional (Recommended):**
- **OBS Studio** (free, open-source)
  - Download: https://obsproject.com/
  - Better quality, multiple scenes, overlays
  - Can show Activity Monitor alongside demo

### Demo Video Structure (5-7 minutes)

#### 1. Introduction (30 seconds)
```
"Hi, I'm [Your Name], and this is AEGIS - an Autonomous
Security System powered by Parallax local inference.

AEGIS runs 100% locally on my MacBook with zero cloud costs,
using Parallax's distributed inference to run AI models
across multiple devices."
```

**Show:**
- Quick pan of your setup (both Macs if using distributed)
- AEGIS dashboard landing page

#### 2. Parallax Cluster Demo (1 minute)
```
"First, let me show you the Parallax cluster powering AEGIS..."
```

**Show:**
- Open http://localhost:3001 (Parallax frontend)
- Point out connected nodes
- Show model configuration (Qwen3-0.6B)
- Explain: "This is running entirely on my local hardware"

**Optional:** Show Activity Monitor with CPU/GPU usage

#### 3. AEGIS Core Features (2 minutes)
```
"AEGIS uses a 7-stage AI pipeline powered entirely by Parallax..."
```

**Show:**
- Open http://localhost:1420
- Navigate through main dashboard
- Point out:
  - Live video feed
  - 7-stage AI pipeline visualization
  - Real-time threat detection
  - Cost savings metrics ($0 vs $518/year)

#### 4. AI Pipeline in Action (2 minutes)
```
"Watch how AEGIS uses Parallax for multi-stage reasoning..."
```

**Show:**
- Run demo mode: `python vision_sentinel.py --test`
- Or use live camera
- Walk through all 7 stages:
  1. Scene interpretation
  2. Threat detection
  3. Action planning
  4. Trend analysis
  5. Log summary
  6. Behavior analysis
  7. Risk scoring

**Emphasize:**
- "Each stage is a separate Parallax API call"
- "Up to 7 AI inferences per scan"
- "Over 24,000 Parallax calls per day at full operation"

#### 5. Natural Language Queries (1 minute)
```
"AEGIS can answer questions about your security history..."
```

**Show:**
- Query interface
- Example queries:
  - "Was anyone home at 3pm?"
  - "Show me all high-risk events today"
  - "What was the activity pattern this week?"

#### 6. Privacy & Cost Benefits (1 minute)
```
"Everything runs locally - no cloud, no subscriptions..."
```

**Show:**
- Cost comparison dashboard
- Privacy vault features
- Explain: "All data stored locally in SQLite"
- Demo: "Purge Memory" feature

#### 7. Closing (30 seconds)
```
"AEGIS proves that powerful AI security systems can run
entirely on personal hardware using Parallax. No cloud
dependencies, no monthly fees, complete privacy.

Thank you for watching! Links to the repo and Parallax
are in the description."
```

**Show:**
- GitHub repo link
- Parallax link
- Competition details

---

## Recording Tips

### Technical Setup

1. **Screen Resolution**
   - Record at 1920x1080 or 1280x720
   - Use browser zoom if text is small

2. **Audio**
   - Use external mic if possible
   - Reduce background noise
   - Test audio levels first

3. **Performance**
   - Close heavy apps (Slack, Chrome, etc.)
   - Use `top` or Activity Monitor to show resource usage
   - Demonstrates Parallax efficiency

### Visual Tips

1. **Show Multiple Terminals**
   - Use iTerm2 split panes or tmux
   - Show Parallax scheduler logs in one pane
   - Show AEGIS backend logs in another
   - Shows real-time processing

2. **Use Picture-in-Picture**
   - Show yourself in corner (optional)
   - Or use OBS to overlay multiple screens

3. **Highlight Key Moments**
   - Use macOS zoom (Ctrl+Scroll) for important UI elements
   - Pause briefly on key metrics
   - Let AI responses fully render

### Content Tips

1. **Emphasize Parallax Usage**
   - "This call is going to Parallax..."
   - "Notice all 7 stages use Parallax inference..."
   - "No data leaves this machine"

2. **Show Real Value**
   - Mention real use cases (elderly care, home security)
   - Explain privacy benefits
   - Show actual cost savings calculation

3. **Technical Depth**
   - Mention model names (Qwen3-0.6B)
   - Explain 7-stage pipeline architecture
   - Show SQLite database (optional)

---

## Post-Production (Optional)

### Video Editing
- **iMovie** (macOS, free) - Basic cuts and titles
- **DaVinci Resolve** (free) - Professional editing

### Add These Elements
- Opening title card: "AEGIS - Parallax AI Lab 2025"
- Text overlays for key metrics
- Highlight important UI elements
- Closing credits with links

### Export Settings
- Format: MP4 (H.264)
- Resolution: 1920x1080 or 1280x720
- Frame rate: 30 FPS
- Bitrate: 5-10 Mbps

---

## Submission Checklist

### GitHub Repository
- [ ] README.md updated with installation instructions
- [ ] Clean code (remove TODOs, add comments)
- [ ] Requirements.txt complete
- [ ] Architecture diagram included
- [ ] Screenshots in README

### Social Media Posts

**Twitter/X Template:**
```
🛡️ Built AEGIS for @Gradient_HQ's Parallax AI Lab Competition!

✅ 100% local AI security system
✅ 7-stage AI pipeline
✅ 24,000+ Parallax inferences/day
✅ $0 cloud costs
✅ Complete privacy

Running entirely on my MacBook with Parallax distributed inference.

[Link to video]
[Link to GitHub]

#ParallaxAILab #LocalAI #Privacy
```

**Reddit Post (r/MachineLearning, r/LocalLLaMA):**
```
Title: Built a 100% Local AI Security System with Parallax (0 Cloud Costs)

[Link to video]
[Link to GitHub]

AEGIS is a private, offline security monitoring system using
Parallax for distributed inference. Runs 7-stage AI pipeline
entirely on local hardware.

Tech: YOLOv8, Parallax, Qwen3, FastAPI, React, Tauri

Happy to answer questions!
```

### Competition Form
- [ ] Video link (YouTube/Vimeo)
- [ ] GitHub repo link
- [ ] Description of Parallax usage
- [ ] Twitter post link
- [ ] Reddit post link (optional)

---

## Troubleshooting

### Parallax Won't Start
```bash
# Check Python version (need 3.11-3.13)
python3 --version

# Reinstall in virtual environment
cd parallax
python3 -m venv ./venv
source ./venv/bin/activate
pip install -e '.[mac]'
```

### Node Won't Join
```bash
# Check firewall (macOS)
# System Settings > Network > Firewall
# Allow Python/Parallax

# Check scheduler is accessible
curl http://localhost:3001/health
```

### AEGIS Backend Issues
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Test backend
python test_backend.py
```

### Camera Not Working
```bash
# Use demo mode instead
cd backend
python vision_sentinel.py --test

# This cycles through test scenarios
```

---

## Recommended Demo Flow

```
[INTRO] -> [SHOW SETUP] -> [PARALLAX CLUSTER] ->
[AEGIS DASHBOARD] -> [7-STAGE PIPELINE] ->
[NATURAL LANGUAGE] -> [PRIVACY/COST] -> [CLOSING]
```

Total time: 5-7 minutes

---

## Questions for Judges

**Prepare answers for:**

1. "Why Parallax over other local inference options?"
   - Distributed inference across devices
   - Easy setup, production-ready
   - Open-source, community-driven

2. "How does AEGIS ensure privacy?"
   - 100% local processing
   - SQLite local storage
   - No network calls (except Parallax cluster)
   - Purge memory feature

3. "What are the real-world applications?"
   - Elderly care (fall detection)
   - Home security
   - Medical facilities (HIPAA)
   - Industrial monitoring

4. "How scalable is this?"
   - Can add more nodes easily
   - Parallax handles distributed scheduling
   - Tested on M1 MacBook (8GB)

---

## Final Tips

1. **Practice First**
   - Record a test run
   - Check audio/video quality
   - Time yourself (aim for 5-7 min)

2. **Be Enthusiastic**
   - Show genuine excitement about the project
   - Explain why local AI matters

3. **Be Honest**
   - If single-node, say so but explain distributed capabilities
   - Mention limitations and future improvements

4. **Follow Competition Rules**
   - Deadline: December 7, 2025 (11:59 PM EST)
   - Tag @Gradient_HQ on Twitter
   - Submit form with all required info

---

## Good Luck!

You've built an impressive project. Focus on:
- Clear demonstration of Parallax usage
- Real-world value (privacy + cost savings)
- Technical excellence
- Enthusiasm and presentation

The judges are looking for impactful applications that solve real problems with local AI. AEGIS does exactly that.

---

**Ready to record? Let's go win that DGX Spark!** 🚀
