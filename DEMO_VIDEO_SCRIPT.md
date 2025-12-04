# AEGIS Demo Video Script (Under 3 Minutes)

## Recording Tips
- Use screen recording (QuickTime or OBS)
- Have 2 terminals ready: one for Parallax, one for AEGIS
- Browser open to localhost:1420 or http://localhost:8001/video_feed
- **KEY: Start with REAL camera first, then switch to --test mode**
- Have a phone or object ready to hold up for detection demo

---

## SCRIPT (Real Camera + Test Mode Flow)

### [0:00-0:12] HOOK - The Problem

**[Show text overlay or say directly to camera]**

> "Home security AI on AWS costs $518 a month - and your private camera footage goes to their servers. I built something better."

---

### [0:12-0:25] INTRO - The Solution

**[Show AEGIS dashboard or logo]**

> "This is AEGIS - an AI security system that runs 100% locally using Parallax. Zero cloud costs. Zero data leaving your home. Let me show you it's real."

---

### [0:25-0:40] START PARALLAX

**[Terminal 1: Show Parallax starting]**

```bash
parallax run
```

> "First, I start Parallax - it hosts Qwen3 locally on my MacBook Air. No expensive GPUs, just consumer hardware turned into an AI server."

---

### [0:40-1:10] REAL CAMERA DEMO (THE PROOF)

**[Terminal 2: Start AEGIS WITHOUT --test flag]**

```bash
python backend/vision_sentinel.py
```

**[Show YOUR FACE on the live video feed]**

> "Here's the proof - this is my real MacBook FaceTime camera. That's me, live, right now. Watch..."

**[Wave at camera]**

> "AEGIS detects me as a person instantly. The bounding box follows my movement in real-time."

**[Hold up your phone to the camera]**

> "If I hold up my phone - there! Cell phone detected. This is YOLOv8 running locally, feeding into our 7-stage Parallax AI pipeline."

**[Point to the Neural Log showing "1 person(s), 1 cell phone(s)"]**

> "Every detection is analyzed by Parallax - scene interpretation, behavior analysis, risk scoring - all happening live on my laptop."

---

### [1:10-1:25] TRANSITION TO TEST MODE

**[Ctrl+C to stop, then restart with --test]**

```bash
python backend/vision_sentinel.py --test
```

> "Now let me show you the threat detection you hopefully WON'T see in real life. Switching to demo mode..."

---

### [1:25-1:50] THREAT SCENARIOS

**[Wait for WEAPON scenario - red alert]**

> "WEAPON DETECTED! AEGIS identifies the knife, triggers CRITICAL alert, and Parallax AI generates an action plan - evacuate, call 911, don't confront. All in under 2 seconds."

**[Wait for FIRE scenario]**

> "Fire detection - analyzing color patterns and motion to identify flames. Different threat, different AI response."

**[Wait for CAMERA BLOCKED scenario]**

> "Even camera tampering is caught - someone covers the lens, AEGIS detects the obstruction immediately."

---

### [1:50-2:15] AI QUERY DEMO

**[Click AI_INTEL tab]**

> "Here's the killer feature - natural language queries powered by Parallax."

**[Click "Was anyone home?"]**

> "Was anyone home? It remembers detecting ME earlier with the real camera - look, it gives the exact time!"

**[Click "Any threats detected?"]**

> "Any threats? It summarizes all the scenarios - weapon, fire, camera blocked - with timestamps and severity levels."

**[Point to inference time]**

> "500 milliseconds, 95% confidence - that's local Parallax AI."

---

### [2:15-2:35] COST & PRIVACY IMPACT

**[Show Cost Metrics panel]**

> "The numbers: AWS Rekognition costs $518 per month. AEGIS with Parallax? Zero. Forever. That's $6,220 saved every year."

> "Privacy score: 100% local. My face, my home, my family - never leaves my network. That's not a feature, that's a requirement."

---

### [2:35-2:55] CLOSING

**[Show full dashboard]**

> "AEGIS: Real camera support, 7-stage AI pipeline, threat detection, natural language queries - all running on a MacBook Air with Parallax."

> "Sovereign AI isn't the future - it's running right here, right now. Built for the Gradient Parallax AI Lab Competition. Thank you!"

---

## QUICK COMMANDS

```bash
# Terminal 1: Parallax
parallax run

# Terminal 2: AEGIS with REAL camera (start here!)
python backend/vision_sentinel.py

# Terminal 2: AEGIS in TEST mode (switch to this)
python backend/vision_sentinel.py --test
```

---

## POST-VIDEO CHECKLIST

### Required for Submission:
- [ ] Upload video to YouTube/X/etc.
- [ ] Post on X tagging @Gradient_HQ
- [ ] Submit form at: [Gradient submission form]
- [ ] Include GitHub repo link

### X Post Template:

```
🛡️ AEGIS - AI Security running 100% locally with @Gradient_HQ Parallax!

✅ REAL camera demo (that's my face!)
✅ 7-Stage AI Pipeline
✅ Threat Detection (weapons, fire, tampering)
✅ Natural Language Q&A
💰 $0/month vs $518 AWS
🔒 100% Private

Built for #Parallax AI Lab Competition!

🎬 [VIDEO]
💻 [GITHUB]

#LocalAI #GradientAI #BuildWithParallax
```

### Reddit Post (r/LocalLLaMA, r/selfhosted):

```
Title: I built a $0/month AI security system with real camera support using Parallax

Built AEGIS for the Gradient competition - full AI security with:

- Real MacBook camera support (demo shows my actual face)
- 7-stage AI pipeline powered by Parallax (Qwen3-0.6B)
- Weapon, fire, and tampering detection
- Natural language Q&A ("Was anyone home?")
- $0/month vs $518 for AWS Rekognition

Runs entirely on M1 MacBook Air. No cloud. 100% private.

[Demo Video] | [GitHub]
```

---

## KEY DEMO MOMENTS (Screenshot These!)

1. **Your real face** being detected with bounding box
2. **Phone detection** when you hold it up
3. **CRITICAL threat alert** (red screen, weapon)
4. **AI Query response** with your detection from real camera
5. **Cost savings** panel showing $6,220/year

---

## JUDGE TALKING POINTS

| Point | What to Say |
|-------|-------------|
| **Real, Not Fake** | "That was my actual camera - AEGIS works with real hardware" |
| **Impact** | "$6,220/year saved vs cloud solutions" |
| **Privacy** | "Camera footage of my home never leaves my network" |
| **Technical** | "7 Parallax AI calls per scan - deep integration" |
| **Accessible** | "Runs on M1 MacBook Air - consumer hardware" |
