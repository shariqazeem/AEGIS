# 🎬 AEGIS DEMO RECORDING SCRIPT
## Competition Video Guide - Gradient "Build Your Own AI Lab"

---

## 🎯 VIDEO STRUCTURE (Aim for 3-4 minutes)

### INTRO (15 seconds)
```
"Hi, I'm [Name], and this is AEGIS - the first Sovereign AI Security System.
It's completely local, completely private, and costs zero dollars to run."
```

---

## 📋 PRE-RECORDING CHECKLIST

### Terminal 1 - Parallax
```bash
parallax run
# Wait for "Scheduler started on port 3001"
```

### Terminal 2 - Join (same machine)
```bash
parallax join
# Wait for node to show as connected
```

### Terminal 3 - AEGIS Backend
```bash
cd AEGIS/backend
python vision_sentinel.py --test
# Wait for "System READY" and "7-Stage AI Pipeline Active"
```

### Terminal 4 - Frontend
```bash
cd AEGIS
npm run dev
# Open http://localhost:1420
```

---

## 🎬 RECORDING SEQUENCE

### SCENE 1: PARALLAX CLUSTER (30 seconds)
**Show Terminal with Parallax running**

Script:
```
"First, let me show you the power behind AEGIS - Parallax.
With a single command, I've started a local AI cluster running Qwen3.
This is the same quality as cloud AI, but running entirely on my M1 MacBook Air."
```

**Actions:**
1. Show `parallax run` terminal output
2. Show the Parallax web UI at http://localhost:3001 (model selector)
3. Show `parallax join` connecting

---

### SCENE 2: AEGIS STARTING (20 seconds)
**Switch to AEGIS terminal**

Script:
```
"Now watch AEGIS connect to our local AI cluster.
Notice the 7-stage pipeline - that's 7 different AI calls per security scan,
all powered by Parallax, all running locally."
```

**Actions:**
1. Run `python vision_sentinel.py --test`
2. Let it show the initialization sequence
3. Highlight "✓ Connected to local cluster"

---

### SCENE 3: DASHBOARD OVERVIEW (30 seconds)
**Show AEGIS Dashboard in browser**

Script:
```
"This is the AEGIS command center. On the left, our live video feed.
On the right, real-time neural logs and our 7-stage AI pipeline visualization.
Every analysis flows through Scene Interpretation, Threat Detection, Action Planning,
Trend Analysis, and more - all powered by Parallax."
```

**Actions:**
1. Pan across the dashboard slowly
2. Highlight the "POWERED BY PARALLAX" badge
3. Point out the "7 AI CALLS PER SCAN" indicator
4. Show logs scrolling in real-time

---

### SCENE 4: THREAT DETECTION DEMO (60 seconds) ⭐ KEY SCENE
**Watch test scenarios cycle**

Script:
```
"Let's see the AI in action. Watch as AEGIS cycles through different scenarios..."
```

**Scenario narration:**

1. **Normal Activity**: 
   "A person detected - Parallax analyzes the scene and confirms normal activity."

2. **WEAPON DETECTED** 🔴:
   "Here's where it gets interesting. A knife is detected!
   Watch the threat badge turn red, the action plan generates instantly -
   that's Parallax providing real-time threat reasoning."

3. **FIRE EMERGENCY** 🔴:
   "Fire detection - not just looking for flames, but analyzing color patterns
   and motion to detect flickering. The AI explains its reasoning."

4. **CAMERA BLOCKED** 🔴:
   "Someone tries to block the camera - AEGIS immediately detects tampering
   based on the sudden loss of edges and contrast."

5. **Person Fallen**:
   "A person who isn't moving - the AI recognizes this could be a medical emergency."

**Actions:**
1. Wait for each threat scenario
2. Highlight the THREAT badge changing
3. Show the AI reasoning in the logs
4. Click "PARALLAX" tab to show the AI insights

---

### SCENE 5: ASK AEGIS AI (30 seconds)
**Use the Query Interface**

Script:
```
"But here's my favorite part - you can actually ASK AEGIS questions.
This goes directly to Parallax for an intelligent response."
```

**Actions:**
1. Click "AI_INTEL" tab
2. Type: "Was anyone home?"
3. Show the Parallax-powered response
4. Type: "What threats were detected?"
5. Show the detailed answer with inference time

---

### SCENE 6: COST COMPARISON (20 seconds)
**Show cost metrics**

Script:
```
"Let's talk about why this matters. 
AWS Rekognition would cost over $500 per month for this level of monitoring.
With Parallax? Zero. Dollars. Zero cloud costs. 100% private.
Your security footage never leaves your device."
```

**Actions:**
1. Scroll to show cost comparison widget
2. Highlight "$0 CLOUD COSTS"
3. Show "100% LOCAL" badge

---

### SCENE 7: PRIVACY VAULT (15 seconds)
**Quick vault demo**

Script:
```
"All threat events are stored locally in our Privacy Vault.
One-click purge if you ever need it. Complete data sovereignty."
```

**Actions:**
1. Click VAULT in sidebar
2. Show threat events listed
3. Hover over PURGE button (don't click)

---

### SCENE 8: CLOSING (20 seconds)
**Back to Dashboard**

Script:
```
"AEGIS proves that enterprise-grade AI security doesn't need the cloud.
With Parallax's local inference, we get the intelligence of GPT-4
with the privacy of an air-gapped system.

7 AI stages. Zero cloud costs. 100% local. This is AEGIS.
Thank you."
```

---

## 🎬 RECORDING TIPS

### Screen Recording Setup
- **Resolution**: 1920x1080 or 2560x1440
- **Tool**: OBS Studio or ScreenFlow
- **Audio**: Use a good microphone, record voiceover separately if needed

### Visual Flow
1. Start with terminals tiled (Parallax + AEGIS)
2. Transition to full-screen dashboard
3. Use zoom/highlight effects for key features
4. Keep mouse movements slow and deliberate

### Key Moments to Capture
- [ ] Parallax cluster starting
- [ ] AEGIS connecting to Parallax
- [ ] "7-Stage Pipeline Active" message
- [ ] WEAPON DETECTED threat (RED screen)
- [ ] FIRE EMERGENCY threat
- [ ] AI Query response
- [ ] Cost savings display

### What Judges Want to See
1. ✅ **Parallax Integration** - Multiple AI calls per cycle
2. ✅ **Privacy** - 100% local processing
3. ✅ **Low Cost** - No cloud bills
4. ✅ **Creativity** - Unique security use case
5. ✅ **Impact** - Real-world application

---

## 🏆 WINNING TALKING POINTS

### On Parallax:
> "Every scan uses up to 7 Parallax AI calls - scene interpretation, threat detection, action planning, trend analysis, behavior analysis, log summary, and risk scoring. This is the maximum utilization of Parallax's capabilities."

### On Privacy:
> "Unlike cloud security cameras that upload your footage to AWS or Google, AEGIS keeps everything on your device. Your home, your data, your control."

### On Cost:
> "AWS Rekognition costs $518 per month for equivalent monitoring. AEGIS with Parallax? Zero dollars. That's $6,200 saved per year."

### On Technical Achievement:
> "We're running real-time computer vision with YOLOv8 for detection, combined with Qwen3 running on Parallax for intelligent reasoning - all on an M1 MacBook Air with 8GB RAM."

---

## 📱 OPTIONAL: QUICK 60-SECOND VERSION

If time is limited:

```
"AEGIS - Sovereign AI Security powered by Parallax.

[Show dashboard with threat detection]
Watch: real-time threat detection using 7 AI stages per scan.
Weapon detected? Parallax reasons about it instantly.

[Show cost comparison]  
AWS costs $500/month. Parallax costs zero.

[Show privacy badge]
100% local. Your footage never touches the cloud.

AEGIS: Your security, your data, your control.
Built with Parallax."
```

---

## 🎯 POST-RECORDING CHECKLIST

- [ ] Video is under 5 minutes
- [ ] Audio is clear
- [ ] All threat scenarios visible
- [ ] Parallax branding shown
- [ ] Cost savings highlighted
- [ ] Privacy benefits mentioned
- [ ] No personal information visible
- [ ] Export at 1080p minimum

---

Good luck! 🚀 You've got this, Shariq!
