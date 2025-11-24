# AEGIS Competition Submission Guide - WIN THE DGX SPARK!

## Submission Deadline: November 30, 2025 (11:59pm EST)

---

## CRITICAL: Submission Checklist

### Required (MUST DO)
- [ ] **Submit via Google Form**: [Submission Form Link](https://gradient.network/campaign/)
- [ ] **Post on X (Twitter)** - Tag @Gradient_HQ
- [ ] **Include screenshots** of AEGIS running with Parallax

### Highly Recommended (WILL INCREASE CHANCES)
- [ ] **GitHub Repo** - Make sure it's public
- [ ] **Demo Video** (60-120 seconds)
- [ ] **Multiple Social Posts** - "The more you post, the higher your likelihood of winning"
- [ ] **Discord Activity** - Join Parallax Discord and share

---

## Social Media Post Templates

### Post 1: The Main Launch Post (Post This First!)

**X (Twitter):**
```
Introducing AEGIS - Autonomous Edge Guard & Intelligence System

Built for the @Gradient_HQ #ParallaxAILab competition!

A sovereign AI security system with:
- 7-Stage Parallax AI Pipeline
- Zero cloud costs ($518/year savings!)
- 100% local inference on MacBook
- Natural language security queries

This is what local AI can do.

GitHub: [YOUR_REPO_URL]

#ParallaxAI #LocalAI #SovereignAI #MachineLearning
```

**Attach:** Screenshot of main dashboard with video feed + AI pipeline visible

---

### Post 2: The Technical Deep Dive

**X (Twitter):**
```
How AEGIS uses @Gradient_HQ Parallax for 7-stage AI reasoning:

1. Scene Interpretation
2. Threat Detection
3. Action Planning
4. Trend Analysis
5. Log Summaries
6. Behavior Analysis
7. Risk Scoring

Up to 7 Parallax API calls per scan = 24,000+ AI inferences/day

All running locally on a MacBook Air M1!

#ParallaxAI #LocalAI
```

**Attach:** Screenshot of AI Pipeline tab showing all 7 stages

---

### Post 3: The Privacy & Cost Story

**X (Twitter):**
```
Why I built AEGIS with @Gradient_HQ Parallax instead of cloud AI:

Cloud AI (AWS Rekognition):
- $518/year for 24/7 monitoring
- Data leaves your device
- Internet dependent

Parallax Local AI:
- $0/year
- 100% private
- Works offline

Own your AI. Own your data.

#ParallaxAI #PrivacyFirst #SovereignAI
```

**Attach:** Screenshot of Cost Metrics component showing savings

---

### Post 4: The Natural Language Query Feature

**X (Twitter):**
```
"Was anyone home at 3pm?"

AEGIS can answer natural language questions about your security footage using @Gradient_HQ Parallax AI.

No cloud. No subscription. Just local AI intelligence.

Ask anything:
- "Any threats today?"
- "How many people visited?"
- "What happened this morning?"

#ParallaxAI #LocalAI
```

**Attach:** Screenshot of Query Interface with an answer displayed

---

### Post 5: Demo Video Announcement

**X (Twitter):**
```
AEGIS Demo: 7-Stage Parallax AI Security System

Watch local AI detect threats, analyze behavior, and answer natural language queries - all running on a MacBook.

Built for @Gradient_HQ AI Lab Competition 2025

[VIDEO_LINK]

#ParallaxAI #LocalAI #DemoDay
```

---

## Demo Video Script (60-90 seconds)

### Structure:

**[0:00-0:10] Hook**
- Show AEGIS dashboard loading
- Text overlay: "AEGIS - Sovereign AI Security"
- Voice: "What if your home security system ran entirely on your laptop, with zero cloud costs?"

**[0:10-0:25] The Problem**
- Show cost comparison (cloud vs local)
- Voice: "Cloud AI services cost hundreds per year and your data goes to their servers. AEGIS changes that."

**[0:25-0:45] The Solution - 7-Stage Pipeline**
- Show AI Pipeline tab
- Highlight each stage lighting up
- Voice: "AEGIS uses Parallax to run a 7-stage AI pipeline locally. Scene interpretation, threat detection, action planning, trend analysis, summaries, behavior analysis, and risk scoring."

**[0:45-1:00] Live Demo**
- Show video feed with detection
- Type a natural language query
- Show AI-generated answer
- Voice: "Ask it anything about your security footage. It answers using Parallax AI, entirely on your device."

**[1:00-1:15] The Impact**
- Show metrics: 24,000+ AI calls/day, $0 cost
- Show "100% LOCAL AI" badge
- Voice: "24,000 AI inferences per day. Zero dollars. Total privacy."

**[1:15-1:20] CTA**
- Show GitHub URL
- Text: "Powered by Parallax"
- Voice: "Own your intelligence. Built for the Parallax AI Lab competition."

---

## Screenshots to Capture

### Screenshot 1: Main Dashboard
- Video feed visible (or test mode)
- Threat status badge
- Neural log showing activity
- "POWERED BY PARALLAX" badge clearly visible

### Screenshot 2: AI Pipeline Tab
- All 7 stages shown
- "7-STAGE AI" badge visible
- "PARALLAX" branding clear

### Screenshot 3: AI Intel Tab
- Cost Metrics showing $518 savings
- Query Interface with a question/answer
- Daily Summary component

### Screenshot 4: Parallax Running
- Terminal showing `parallax run` output
- Proof that Parallax is the backend

### Screenshot 5: Architecture Diagram
- Use the one from README or create new
- Show data flow from camera -> YOLOv8 -> Parallax -> UI

---

## Submission Form Answers

### "How did you use Parallax?"
```
AEGIS uses Parallax as the core AI inference engine for a 7-stage security analysis pipeline. Every frame captured by the camera goes through:

1. Scene Interpretation - Parallax LLM converts computer vision features into natural language
2. Threat Detection - AI-powered threat analysis with confidence scoring
3. Action Planning - Generates response recommendations for detected threats
4. Trend Analysis - Pattern recognition across multiple scans
5. Log Summaries - Human-readable security reports
6. Behavior Analysis - Tracks activity patterns over time
7. Risk Scoring - Multi-factor risk assessment

This results in up to 7 Parallax API calls per scan cycle, demonstrating heavy utilization of local AI inference. AEGIS also uses Parallax for natural language queries ("Was anyone home at 3pm?") and AI-generated daily summaries.

Total: 24,000+ Parallax AI calls per day at full operation.
```

### "Why did you choose Parallax?"
```
Three reasons:

1. PRIVACY: Security camera footage is deeply personal. Cloud AI means my data goes to external servers. With Parallax, everything stays on my MacBook.

2. COST: Cloud AI (AWS Rekognition) would cost ~$518/year for 24/7 monitoring. Parallax costs $0 after initial setup.

3. SOVEREIGNTY: I own the model, I control the inference, I decide what happens with my data. This is what "sovereign AI" means.

Parallax's OpenAI-compatible API made integration seamless - I could use existing libraries while keeping everything local.
```

### "Describe your application"
```
AEGIS (Autonomous Edge Guard & Intelligence System) is a local-first AI security monitoring system that transforms any MacBook into a private, offline AI sentinel.

Key Features:
- Real-time camera monitoring with YOLOv8 object detection
- 7-stage Parallax AI pipeline for deep reasoning
- Natural language queries about security footage
- AI-generated daily summaries
- Anomaly detection with pattern learning
- Zero cloud dependency, 100% local inference
- Privacy-preserving "Purge Memory" feature

Use Cases:
- Home security with fall detection for elderly care
- Industrial quality control monitoring
- Privacy-critical environments (medical, legal)
- Any scenario requiring intelligent monitoring without cloud exposure

Built with: React + Tauri (frontend), FastAPI + YOLOv8 + Parallax (backend)
```

---

## Reddit Post Template

**Title:** Built AEGIS - A 7-Stage AI Security System Running 100% Locally with Parallax [Parallax AI Lab Competition]

**Body:**
```
Hey r/LocalLLaMA (or r/MachineLearning),

I built AEGIS for the Parallax AI Lab competition and wanted to share.

**What is it?**
A home security system that runs entirely on my MacBook using Parallax for local AI inference. No cloud, no subscriptions, total privacy.

**The 7-Stage AI Pipeline:**
Every camera frame goes through 7 Parallax AI calls:
1. Scene interpretation
2. Threat detection
3. Action planning
4. Trend analysis
5. Log summaries
6. Behavior analysis
7. Risk scoring

**Cool Features:**
- Natural language queries: "Was anyone home at 3pm?" → AI answers
- AI-generated daily summaries
- Pattern learning for anomaly detection
- $518/year savings vs cloud alternatives

**Tech Stack:**
- Frontend: React + Tauri
- Vision: YOLOv8
- AI: Parallax with Qwen/Qwen3-0.6B
- Storage: SQLite (local only)

GitHub: [YOUR_REPO_URL]

Would love feedback! Also, if you're interested in the Parallax competition, submissions are open until Nov 30.
```

---

## Posting Schedule (Maximize Visibility)

| Day | Post | Platform |
|-----|------|----------|
| Day 1 | Main Launch Post (#1) | X (Twitter) |
| Day 1 | Reddit Post | r/LocalLLaMA |
| Day 2 | Technical Deep Dive (#2) | X (Twitter) |
| Day 3 | Privacy & Cost (#3) | X (Twitter) |
| Day 4 | Natural Language Query (#4) | X (Twitter) |
| Day 5 | Demo Video (#5) | X (Twitter), YouTube |
| Day 6 | Join Discord, share there | Parallax Discord |
| Day 7 | Submit Form | Gradient submission form |

---

## Tips from Competition Page

> "The more you post, the higher your likelihood of winning and providing impact to the community."

> "Tell us how you used Parallax and why in your social posts. The more detail the better!"

> "Help us teach the community about building local AI applications."

**Translation:** They want you to be an evangelist for Parallax. Every post is a chance to show why local AI matters.

---

## Final Checklist Before Nov 30

- [ ] GitHub repo is public with good README
- [ ] Posted at least 3-4 times on X tagging @Gradient_HQ
- [ ] Demo video uploaded (YouTube or Twitter)
- [ ] Screenshots ready showing AEGIS + Parallax
- [ ] Submitted Google Form with detailed answers
- [ ] Joined Discord and shared project

**Good luck! You've built something impressive - now show it off!**
