# AEGIS Demo Recording Checklist

## Pre-Recording Setup (30 minutes before)

### System Preparation
- [ ] Close all unnecessary applications
- [ ] Clear desktop (clean background)
- [ ] Set browser bookmarks bar (hide if cluttered)
- [ ] Turn off notifications (Do Not Disturb mode)
- [ ] Charge MacBook to 100% (or keep plugged in)
- [ ] Clean camera lens
- [ ] Test microphone audio levels

### Software Setup
- [ ] Install OBS Studio (or prepare QuickTime/built-in screen recording)
- [ ] Test screen recording (record 30 seconds, check quality)
- [ ] Prepare terminal windows (iTerm2 split panes recommended)
- [ ] Set browser zoom to 125% for better visibility
- [ ] Prepare Activity Monitor in case you want to show resource usage

### Parallax Cluster
- [ ] Navigate to: `cd /Users/macbookair/projects/AEGIS/parallax`
- [ ] Activate venv: `source ./venv/bin/activate`
- [ ] Start scheduler: `parallax run -m Qwen/Qwen3-0.6B -n 1 --host 0.0.0.0`
- [ ] Verify scheduler running: http://localhost:3001
- [ ] Join cluster (new terminal): `parallax join`
- [ ] Verify node connected in Parallax UI

### AEGIS Backend
- [ ] Navigate to: `cd /Users/macbookair/projects/AEGIS`
- [ ] Start AEGIS: `./start-aegis.sh` (or backend individually)
- [ ] Verify backend running: http://localhost:1420
- [ ] Test video feed is working
- [ ] Run test mode: `cd backend && python vision_sentinel.py --test`
- [ ] Verify all 7 stages are executing

### Test Run
- [ ] Do a complete walkthrough (don't record yet)
- [ ] Time yourself (aim for 5-7 minutes)
- [ ] Note any UI glitches or slow responses
- [ ] Prepare browser tabs in order:
  1. Parallax UI (http://localhost:3001)
  2. AEGIS Dashboard (http://localhost:1420)
  3. AEGIS Query Interface
  4. AEGIS Cost Metrics

---

## Recording Setup

### Screen Recording Settings (OBS Studio)
- [ ] Source: Display Capture (select main monitor)
- [ ] Resolution: 1920x1080 or 1280x720
- [ ] Frame rate: 30 FPS
- [ ] Audio: Desktop audio + Microphone
- [ ] Bitrate: 5000-10000 kbps
- [ ] Encoder: Apple VT H264 Hardware Encoder (fastest on Mac)

### Screen Recording Settings (macOS Built-in)
- [ ] Press: Cmd + Shift + 5
- [ ] Select: Record Selected Portion (or entire screen)
- [ ] Options:
  - [ ] Show Mouse Clicks: ON
  - [ ] Microphone: ON (select correct device)
  - [ ] Save to: Desktop

### Audio Check
- [ ] Do a 30-second test recording
- [ ] Play it back - check:
  - [ ] Voice is clear and loud enough
  - [ ] No background noise (AC, fan, keyboard clicks)
  - [ ] System audio is audible (if needed)

---

## Demo Script (5-7 minutes)

### Scene 1: Introduction (30 seconds)
**Script:**
> "Hi everyone! I'm [Your Name], and this is AEGIS - an Autonomous Edge Guard & Intelligence System built for the Parallax AI Lab Competition 2025.
>
> AEGIS is a 100% local AI security monitoring system that runs entirely on my MacBook using Parallax distributed inference. No cloud, no subscriptions, complete privacy."

**Show:**
- [ ] Your face (optional) or just screen
- [ ] Quick pan of setup (both MacBooks if using distributed)
- [ ] AEGIS dashboard landing page

**Time Check:** 30 seconds

---

### Scene 2: The Problem & Solution (45 seconds)
**Script:**
> "Traditional cloud-based security systems like AWS Rekognition cost over $500 per year and send your private video feeds to the cloud.
>
> AEGIS solves this with local AI inference powered by Parallax. Everything runs on your own hardware - zero cloud costs, complete privacy, works offline."

**Show:**
- [ ] Cost comparison dashboard
- [ ] Highlight: $0 vs $518/year

**Time Check:** 1:15 total

---

### Scene 3: Parallax Cluster Demo (1 minute)
**Script:**
> "Let me show you the Parallax cluster powering AEGIS. I'm running Qwen3-0.6B on my MacBook, with [X] nodes connected through Parallax's distributed inference framework.
>
> All of this is running locally - no cloud servers, no external APIs."

**Show:**
- [ ] Open http://localhost:3001 (Parallax UI)
- [ ] Point to connected nodes
- [ ] Show model configuration
- [ ] (Optional) Show Activity Monitor with CPU usage

**Actions:**
- [ ] Navigate through Parallax UI
- [ ] Point out: "Notice the node status - all local"
- [ ] Show: "This is the Qwen3 model running on my Mac"

**Time Check:** 2:15 total

---

### Scene 4: AEGIS 7-Stage AI Pipeline (2 minutes)
**Script:**
> "AEGIS uses a 7-stage AI pipeline where each stage is powered by Parallax. Let me walk you through what happens when AEGIS processes a security frame...
>
> Stage 1: Scene interpretation - converting visual features to natural language
> Stage 2: Threat detection - AI analyzes the scene for potential threats
> Stage 3: Action planning - generates response recommendations
> Stage 4: Trend analysis - pattern recognition over time
> Stage 5: Log summary - creates human-readable reports
> Stage 6: Behavior analysis - learns normal patterns
> Stage 7: Risk scoring - multi-factor threat assessment
>
> That's up to 7 Parallax API calls per scan, running 24/7, which would be impossible with cloud API costs."

**Show:**
- [ ] AEGIS main dashboard
- [ ] Point out 7-stage pipeline visualization
- [ ] Live video feed
- [ ] Threat detection in action
- [ ] Real-time AI reasoning output

**Actions:**
- [ ] Trigger demo mode or show live detection
- [ ] Watch as each stage executes
- [ ] Point to Parallax inference happening in real-time
- [ ] Show logs/output updating

**Time Check:** 4:15 total

---

### Scene 5: Natural Language Queries (1 minute)
**Script:**
> "AEGIS also has natural language query capabilities. I can ask questions about security history, and Parallax processes them locally.
>
> For example: 'Was anyone home at 3pm?' or 'Show me high-risk events today.'"

**Show:**
- [ ] Query interface
- [ ] Type example query
- [ ] Show AI-generated response

**Actions:**
- [ ] Execute 2-3 example queries
- [ ] Show responses loading
- [ ] Explain: "This is all happening locally through Parallax"

**Time Check:** 5:15 total

---

### Scene 6: Privacy & Performance (45 seconds)
**Script:**
> "Everything in AEGIS is privacy-first. All video processing happens locally, all data is stored in a local SQLite database, and there's even a 'Purge Memory' feature to completely delete all data with one click.
>
> And it's surprisingly efficient - running on just an M1 MacBook Air with 8GB of RAM, processing at 30 FPS with full AI inference."

**Show:**
- [ ] Privacy vault interface
- [ ] SQLite data storage
- [ ] "Purge Memory" button (don't click)
- [ ] Performance metrics (optional)

**Time Check:** 6:00 total

---

### Scene 7: Closing (30 seconds)
**Script:**
> "AEGIS demonstrates that powerful AI security systems don't need cloud infrastructure. With Parallax, we can run sophisticated multi-stage AI pipelines entirely on local hardware.
>
> Thanks for watching! The code is open source on GitHub, and I've included links to both AEGIS and Parallax in the description. Check out Gradient's Parallax AI Lab Competition - there's still time to build your own local AI application!"

**Show:**
- [ ] Final dashboard view
- [ ] GitHub repo on screen
- [ ] Competition link

**Actions:**
- [ ] Show GitHub repo (optional)
- [ ] Wave goodbye or fade out

**Time Check:** 6:30 total

---

## Post-Recording Checklist

### Immediately After Recording
- [ ] Watch the entire recording
- [ ] Check audio quality throughout
- [ ] Verify all UI interactions were captured
- [ ] Note timestamp of any mistakes (for editing)
- [ ] Save raw recording file (backup)

### Editing (Optional)
- [ ] Trim dead space at start/end
- [ ] Remove long loading times (speed up 2x)
- [ ] Add opening title card:
  - "AEGIS - Autonomous Edge Guard & Intelligence System"
  - "Built for Parallax AI Lab Competition 2025"
- [ ] Add text overlays for key metrics:
  - "7-Stage AI Pipeline"
  - "24,000+ Parallax Calls/Day"
  - "$0 Cloud Costs"
  - "100% Local Inference"
- [ ] Add closing credits:
  - GitHub repo link
  - Parallax link
  - Your social media handles

### Export Settings
- [ ] Format: MP4 (H.264)
- [ ] Resolution: 1920x1080 (or original)
- [ ] Frame rate: 30 FPS
- [ ] Bitrate: 5-10 Mbps
- [ ] Audio: AAC, 192 kbps

### Upload
- [ ] Upload to YouTube/Vimeo
- [ ] Title: "AEGIS - 100% Local AI Security System | Parallax AI Lab 2025"
- [ ] Description:
```
AEGIS (Autonomous Edge Guard & Intelligence System) is a privacy-first AI security monitoring system built entirely with local inference using Parallax.

🔑 Key Features:
• 7-stage AI pipeline powered by Parallax
• 24,000+ local AI inferences per day
• $0 cloud costs (vs $518/year for cloud alternatives)
• 100% privacy - all processing happens locally
• Natural language queries
• Multi-stage reasoning and threat detection

🛠️ Tech Stack:
• Parallax (distributed inference)
• YOLOv8 (object detection)
• Qwen3-0.6B (LLM reasoning)
• FastAPI + React + Tauri
• SQLite (local storage)

🔗 Links:
• AEGIS GitHub: [your-repo-url]
• Parallax: https://github.com/GradientHQ/parallax
• Competition: https://gradient.network/campaign/

Built for the Parallax AI Lab Competition 2025 by [Your Name]

#ParallaxAILab #LocalAI #Privacy #MachineLearning #OpenSource
```
- [ ] Thumbnail: Create eye-catching thumbnail with AEGIS logo
- [ ] Visibility: Public
- [ ] Tags: parallax, local ai, privacy, machine learning, security, open source

---

## Social Media Posts

### Twitter/X Post
- [ ] Post video link
- [ ] Use template:
```
🛡️ Built AEGIS for @Gradient_HQ's Parallax AI Lab Competition!

✅ 7-stage AI security pipeline
✅ 24,000+ Parallax inferences/day
✅ $0 cloud costs
✅ 100% local & private
✅ Runs on M1 MacBook

Watch demo 👇
[YouTube link]

Code: [GitHub link]

#ParallaxAILab #LocalAI #Privacy
```
- [ ] Add video thumbnail or GIF
- [ ] Tag @Gradient_HQ
- [ ] Tag @TheAhmadOsman (if relevant)

### Reddit Posts
- [ ] r/MachineLearning (be technical, show code)
- [ ] r/LocalLLaMA (emphasize local inference)
- [ ] r/Privacy (emphasize privacy benefits)
- [ ] r/HomeSecurity (practical application)

Template:
```
Title: Built a 100% Local AI Security System with Parallax (Zero Cloud Costs)

I created AEGIS for the Parallax AI Lab Competition - a complete AI security monitoring system that runs entirely on local hardware using Parallax distributed inference.

[Video Link]
[GitHub Link]

Key features:
• 7-stage AI reasoning pipeline
• 24,000+ local LLM inferences per day
• Natural language queries over security events
• YOLOv8 + Qwen3 + Parallax
• All processing happens locally (zero cloud costs)

Tech stack: Parallax, YOLOv8, Qwen3-0.6B, FastAPI, React, Tauri

Happy to answer questions about the architecture or Parallax integration!
```

### Discord (Parallax Community)
- [ ] Join Parallax Discord
- [ ] Post in #showcase or #competition channel
- [ ] Share video and repo
- [ ] Ask for feedback

---

## Competition Submission

### Form Submission
- [ ] Fill out official competition form
- [ ] Required fields:
  - [ ] Name and email
  - [ ] Project name: "AEGIS"
  - [ ] Description: [Paste from YouTube description]
  - [ ] GitHub repo URL
  - [ ] Demo video URL (YouTube/Vimeo)
  - [ ] Social media posts (Twitter/X link)
  - [ ] How you used Parallax: "7-stage AI pipeline for security monitoring with 24,000+ daily inferences"

### GitHub Repo Preparation
- [ ] Clean up code
- [ ] Remove TODOs (or convert to GitHub issues)
- [ ] Add detailed comments
- [ ] Update README.md with:
  - [ ] Installation instructions
  - [ ] Architecture diagram
  - [ ] Screenshots/GIFs
  - [ ] Demo video embed
  - [ ] Competition badge
- [ ] Add LICENSE (MIT)
- [ ] Add CONTRIBUTING.md (optional)
- [ ] Create releases/tags

---

## Backup Plans

### If Something Goes Wrong During Recording

**Parallax Crashes:**
- [ ] Restart scheduler and node
- [ ] Wait 1 minute before resuming
- [ ] Edit out the restart in post-production

**AEGIS Backend Crashes:**
- [ ] Check backend logs
- [ ] Restart: `./start-aegis.sh`
- [ ] If persistent, use demo mode: `python vision_sentinel.py --test`

**Camera Not Working:**
- [ ] Switch to demo mode (test frames)
- [ ] Explain: "Using simulated security scenarios for demo"

**Audio Issues Mid-Recording:**
- [ ] Stop, fix audio, restart recording
- [ ] Or record video silently, add voiceover later

**Performance Issues:**
- [ ] Close all other apps
- [ ] Reduce video stream FPS
- [ ] Use smaller model (if desperate)

---

## Final Pre-Recording Checklist

**5 Minutes Before Recording:**
- [ ] All systems running and verified
- [ ] Browser tabs open in order
- [ ] Terminal logs visible and clean
- [ ] Audio test completed
- [ ] Camera/screen recording ready
- [ ] Script/notes visible (second monitor or printed)
- [ ] Water nearby (stay hydrated)
- [ ] Phone on silent

**Deep breath. You've got this!** 🚀

---

## Timing Reference

| Section | Time | Cumulative |
|---------|------|------------|
| Introduction | 0:30 | 0:30 |
| Problem & Solution | 0:45 | 1:15 |
| Parallax Cluster | 1:00 | 2:15 |
| 7-Stage Pipeline | 2:00 | 4:15 |
| Natural Language | 1:00 | 5:15 |
| Privacy & Performance | 0:45 | 6:00 |
| Closing | 0:30 | 6:30 |

**Target:** 6-7 minutes total

---

## Success Criteria

Your demo is ready when:
- [ ] Video is 5-7 minutes long
- [ ] Audio is clear throughout
- [ ] All key features are demonstrated
- [ ] Parallax usage is clearly explained
- [ ] No major technical glitches
- [ ] You feel confident presenting it

---

## Remember

- **Be enthusiastic!** Show genuine excitement about your project
- **Be clear:** Explain technical concepts simply
- **Be confident:** You built something amazing
- **Be authentic:** Don't worry about being perfect
- **Have fun!** This is your moment to shine

---

**Ready to record? Check off the items above and let's win that DGX Spark!** 🏆
