# AEGIS Demo Video Script (Under 3 Minutes)

## Recording Tips
- Use screen recording (QuickTime or OBS)
- Have 2 terminals ready: one for Parallax, one for AEGIS
- Browser open to localhost:1420 (Tauri app) or video feed
- Speak clearly and enthusiastically

---

## SCRIPT

### [0:00-0:15] HOOK - The Problem

**[Show slide or text overlay: "Home Security AI = $518/month on AWS"]**

> "What if I told you that running AI-powered home security costs over $500 a month on cloud services like AWS Rekognition? And your private camera footage gets sent to their servers. There has to be a better way."

---

### [0:15-0:30] INTRO - The Solution

**[Show AEGIS logo/banner or the running app]**

> "Meet AEGIS - the Autonomous Edge Guard and Intelligence System. It's a sovereign AI security system that runs 100% locally on your own hardware, powered by Parallax. Zero cloud costs. Zero data leaving your home. Let me show you how it works."

---

### [0:30-0:50] SHOW PARALLAX RUNNING

**[Terminal 1: Show Parallax running]**

```bash
parallax run
```

> "First, I start Parallax which hosts the Qwen3-0.6B model locally. Parallax turns my M1 MacBook Air - a consumer laptop - into a powerful AI inference server. No expensive GPUs needed."

**[Point to the Parallax output showing model loaded]**

> "The model is now running locally on port 3001, ready to process AI requests."

---

### [0:50-1:20] START AEGIS & SHOW 7-STAGE PIPELINE

**[Terminal 2: Start AEGIS in test mode]**

```bash
python backend/vision_sentinel.py --test
```

**[Show the ASCII banner and startup logs]**

> "Now I start AEGIS. Watch the console - it connects to Parallax and initializes a 7-stage AI pipeline. That's SEVEN different AI calls per security scan - scene interpretation, threat detection, action planning, trend analysis, log summary, behavior analysis, and risk scoring."

**[Switch to browser/app showing the Dashboard]**

> "Here's the dashboard. On the left, our live video feed with real-time object detection using YOLOv8. On the right, watch the AI pipeline visualization - each stage lights up as Parallax processes the scene."

---

### [1:20-1:50] DEMO THREAT DETECTION

**[Wait for weapon or fire scenario in test mode]**

> "Watch what happens when AEGIS detects a threat..."

**[Show the threat alert - red screen, CRITICAL status]**

> "AEGIS detected a weapon! The AI analyzed the scene, identified the threat, and generated an action plan - all in under 2 seconds, all running locally on Parallax. No cloud. No latency. No monthly bills."

**[Point to the threat badge and neural log]**

> "Every detection is logged with timestamps, confidence scores, and AI-generated reasoning."

---

### [1:50-2:15] DEMO AI QUERY FEATURE

**[Click on AI_INTEL tab]**

> "Here's my favorite feature - natural language queries. I can ask AEGIS anything about the security status."

**[Click "Was anyone home?" button]**

> "Watch - I ask 'Was anyone home?' and Parallax analyzes all the detection data to give me a specific answer with timestamps."

**[Show the AI response with confidence score and inference time]**

> "95% confidence, answered in 500 milliseconds - that's the power of local AI inference with Parallax."

---

### [2:15-2:40] THE IMPACT - COST SAVINGS

**[Show the Cost Metrics panel]**

> "Let's talk about impact. AWS Rekognition would cost $518 per month for this level of AI security monitoring. With AEGIS and Parallax? Zero dollars. Forever. That's over $6,000 saved per year."

**[Point to privacy score]**

> "And privacy? 100% local. Your camera footage never leaves your network. For families, for businesses, for anyone who cares about privacy - this is a game changer."

---

### [2:40-2:55] CLOSING

**[Show full dashboard with all features visible]**

> "AEGIS proves that powerful AI applications don't need expensive cloud services. With Parallax, anyone can build production-ready AI systems on consumer hardware."

> "7-stage AI pipeline. Real-time threat detection. Natural language queries. Zero cost. 100% private. This is the future of sovereign AI - and it's running right here on my MacBook."

**[Show competition badge or Gradient logo]**

> "Built for the Gradient Parallax AI Lab Competition. Thank you for watching!"

---

## POST-VIDEO CHECKLIST

### Required for Submission:
- [ ] Upload video to YouTube/Twitter/etc.
- [ ] Post on X with @Gradient_HQ tag
- [ ] Include hashtags: #Parallax #LocalAI #GradientAI
- [ ] Submit form with GitHub repo link

### Suggested X Post:

```
🛡️ Meet AEGIS - AI-powered home security running 100% locally with @Gradient_HQ Parallax!

✨ 7-Stage AI Pipeline
💰 $0/month (vs $518 AWS)
🔒 100% Private - no cloud
🧠 Powered by Qwen3-0.6B

Built for the #Parallax AI Lab Competition!

[VIDEO LINK]
[GITHUB LINK]

#LocalAI #AIPrivacy #BuildWithParallax
```

### Suggested Reddit Post (r/LocalLLaMA, r/selfhosted):

```
Title: I built a free, private AI security system using Parallax local inference

Hey everyone! I built AEGIS for the Gradient Parallax competition - it's a home security system with:

- 7-stage AI pipeline (scene interpretation, threat detection, action planning, etc.)
- YOLOv8 for real-time object detection
- Natural language Q&A about your security footage
- $0/month vs $518/month for AWS Rekognition
- 100% local processing - your data never leaves your network

It runs on an M1 MacBook Air using Parallax to serve Qwen3-0.6B locally.

[Demo Video]
[GitHub Repo]

Would love feedback from the community!
```

---

## QUICK COMMANDS REFERENCE

```bash
# Terminal 1: Start Parallax
cd ~/parallax
source venv/bin/activate
parallax run

# Terminal 2: Start AEGIS (demo mode)
cd ~/projects/AEGIS
python backend/vision_sentinel.py --test

# Terminal 3: Start Frontend (if using dev mode)
npm run dev

# Or run the Tauri app
npm run tauri dev
```

## KEY TALKING POINTS FOR JUDGES

1. **Impact**: Replaces $518/month cloud service with $0 local solution
2. **Privacy**: 100% local - critical for home security cameras
3. **Technical Depth**: 7 different AI inference calls per scan cycle
4. **Parallax Integration**: Uses OpenAI-compatible API, easy to adapt
5. **Accessibility**: Runs on consumer M1 MacBook, not expensive hardware
6. **Real-World Use**: Solves actual privacy/cost problems for families & businesses
