<div align="center">

# AEGIS

### Autonomous Edge Guard & Intelligence System

**The first Sovereign AI Security System powered by Parallax Local Inference**

[![Parallax AI Lab 2025](https://img.shields.io/badge/PARALLAX-AI_LAB_2025-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlnb24gcG9pbnRzPSIxMiAyIDE5IDIxIDUgMjEgMTIgMiI+PC9wb2x5Z29uPjwvc3ZnPg==)](https://gradient.network/campaign/)
[![7-Stage AI Pipeline](https://img.shields.io/badge/7_STAGE-AI_PIPELINE-a855f7?style=for-the-badge)](https://github.com/GradientHQ/parallax)
[![Zero Cloud Costs](https://img.shields.io/badge/$0-CLOUD_COSTS-10b981?style=for-the-badge)](https://github.com/GradientHQ/parallax)
[![100% Local](https://img.shields.io/badge/100%25-LOCAL_INFERENCE-00d4ff?style=for-the-badge)](https://github.com/GradientHQ/parallax)

<br/>

**Transform your MacBook into a private, offline AI security sentinel**

*No cloud. No subscriptions. Total privacy. Powered by [Parallax](https://github.com/GradientHQ/parallax).*

</div>

---

## Why AEGIS Wins

| Feature | AEGIS + Parallax | Cloud AI (AWS) |
|---------|------------------|----------------|
| **Monthly Cost** | **$0** | $43/month |
| **Annual Cost** | **$0** | $518/year |
| **Privacy** | **100% Local** | Data leaves device |
| **Internet Required** | **No** | Yes |
| **AI Calls/Day** | **24,000+** | Rate limited |
| **Data Ownership** | **You own it** | They store it |

---

## The 7-Stage Parallax AI Pipeline

AEGIS makes **up to 7 Parallax API calls per scan** - demonstrating the power of local AI for complex, multi-stage reasoning:

```
                    AEGIS 7-STAGE AI PIPELINE

    [CAMERA] --> [YOLO v8] --> [PARALLAX LOCAL CLUSTER]
                                       |
         +-----------------------------+-----------------------------+
         |                             |                             |
    +----v----+   +----v----+   +----v----+   +----v----+   +----v----+
    | STAGE 1 |   | STAGE 2 |   | STAGE 3 |   | STAGE 4 |   | STAGE 5 |
    |  Scene  |-->| Threat  |-->| Action  |-->| Trend   |-->|   Log   |
    | Interp. |   | Detect  |   |  Plan   |   |Analysis |   | Summary |
    +---------+   +---------+   +---------+   +---------+   +---------+
                                       |
         +-----------------------------+-----------------------------+
         |                             |
    +----v----+                   +----v----+
    | STAGE 6 |                   | STAGE 7 |
    |Behavior |------------------>|  Risk   |
    |Analysis |                   | Scoring |
    +---------+                   +---------+
                                       |
                                       v
                              [DASHBOARD + ALERTS]
```

| Stage | Function | Parallax Usage |
|-------|----------|----------------|
| **1. Scene Interpretation** | Convert CV features to natural language | Every scan |
| **2. Threat Detection** | AI-powered threat analysis with reasoning | Every scan |
| **3. Action Planning** | Generate response recommendations | When threat detected |
| **4. Trend Analysis** | Pattern recognition over time | Every 5 scans |
| **5. Log Summary** | Human-readable security reports | Every 10 scans |
| **6. Behavior Analysis** | Behavioral pattern recognition | Every 3 scans |
| **7. Risk Scoring** | Multi-factor risk assessment | Every scan |

---

## Features

### Real-Time AI Security
- **YOLOv8 Object Detection** - 80+ object classes with class-specific confidence
- **Fall Detection** - Pose analysis for elderly care applications
- **Weapon Detection** - Intelligent threat classification
- **Fire/Emergency Detection** - Visual anomaly recognition

### Competition-Winning Capabilities

**Natural Language Queries**
```
"Was anyone home at 3pm?" --> "Yes, 2 people were detected between
3:00 PM and 3:45 PM. Activity was normal with no threats."
```

**AI-Generated Daily Summaries**
```
"Today analyzed 1,247 frames with no threats detected. Normal activity
observed between 6am-10pm with 3 household members. All systems nominal."
```

**Pattern Learning & Anomaly Detection**
```
"ANOMALY: Person detected at 2:00 AM (normally quiet 11pm-6am)"
"ANOMALY: 5 people detected (typical baseline: 2-3)"
```

### Privacy-First Design
- **100% Local Inference** - All AI runs on your Mac
- **SQLite Storage** - Data never leaves your device
- **Purge Memory** - One-click complete data deletion
- **Offline Operation** - Works without internet

---

## Quick Start

### 1. Start Parallax Cluster

```bash
# Terminal 1: Start scheduler
parallax run -m Qwen/Qwen3-0.6B -n 1

# Terminal 2: Join cluster
parallax join
```

### 2. Start AEGIS

```bash
# Install dependencies
npm install
cd backend && pip install -r requirements.txt && cd ..

# Start AEGIS
./start-aegis.sh
```

### 3. Open Dashboard

Navigate to **http://localhost:1420**

### Demo Mode (No Camera Required)

```bash
cd backend && python vision_sentinel.py --test
```

This cycles through threat scenarios to showcase the full 7-stage pipeline.

---

## Architecture

```
AEGIS/
├── src/                     # React + Tauri Frontend
│   ├── components/
│   │   ├── VideoFeed.jsx        # Live camera stream
│   │   ├── AIPipeline.jsx       # 7-stage visualization
│   │   ├── QueryInterface.jsx   # Natural language Q&A
│   │   ├── DailySummary.jsx     # AI-generated reports
│   │   └── CostMetrics.jsx      # Savings calculator
│   └── pages/
│       ├── Dashboard.jsx        # Main monitoring view
│       └── Vault.jsx            # Privacy vault
│
├── backend/
│   ├── vision_sentinel.py       # Core 7-stage AI pipeline
│   ├── query_engine.py          # Natural language queries
│   ├── anomaly_detector.py      # Pattern learning
│   └── event_store.py           # SQLite database
│
└── parallax/                    # Local AI inference
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Tauri 2.0 + React 19 + Tremor |
| **Styling** | Tailwind CSS (Cyber-Industrial Dark) |
| **Vision** | YOLOv8n (6MB) + OpenCV |
| **AI Inference** | Parallax + Qwen/Qwen3-0.6B |
| **Backend** | FastAPI + Uvicorn |
| **Storage** | SQLite (local only) |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/status` | GET | System status and threat level |
| `/metrics` | GET | Parallax cluster + AI pipeline metrics |
| `/video_feed` | GET | MJPEG video stream |
| `/query` | POST | Natural language questions |
| `/summary` | GET | AI-generated daily summary |
| `/cost_metrics` | GET | Cloud vs local cost comparison |
| `/history` | GET | Event history from database |
| `/anomalies` | GET | AI-detected anomalies |
| `/purge` | POST | Delete all local data |

---

## Competition Metrics

### Parallax Usage Stats
- **Up to 7 AI calls per scan cycle**
- **~24,000+ Parallax inferences per day** (at full operation)
- **Zero cloud API calls**

### Cost Savings
- **Cloud Alternative**: ~$518/year (AWS Rekognition)
- **AEGIS + Parallax**: $0/year
- **Annual Savings**: $518+

### Performance (M1 MacBook Air 8GB)
- **Inference Time**: ~3000ms per 7-stage cycle
- **Video Stream**: 30 FPS
- **Memory Usage**: ~2GB (model + inference)

---

## Use Cases

### Home Security
- Elderly care with fall detection
- Intrusion detection with intelligent alerts
- Privacy-preserving monitoring

### Industrial / Business
- Quality control inspection
- Equipment monitoring
- Access control logging

### Privacy-Critical Environments
- Medical facilities (HIPAA compliance)
- Legal offices (client confidentiality)
- Home offices (work-from-home privacy)

---

## Built for Parallax AI Lab Competition 2025

This project demonstrates:

1. **Maximum Parallax Usage** - 7-stage AI pipeline with 24,000+ daily inferences
2. **Privacy & Low Cost** - 100% local, $0 cloud costs
3. **Real-World Utility** - Practical security monitoring application
4. **Technical Excellence** - Production-grade code and UI
5. **Scalability** - Architecture ready for multi-node clusters

---

## Links

- **Parallax**: [github.com/GradientHQ/parallax](https://github.com/GradientHQ/parallax)
- **Competition**: [gradient.network/campaign](https://gradient.network/campaign/)
- **Gradient**: [gradient.network](https://gradient.network)

---

## License

MIT License - Built for Parallax AI Lab Competition 2025

---

<div align="center">

**Powered by [Parallax](https://github.com/GradientHQ/parallax) - Sovereign AI for Everyone**

*Own your intelligence. Own your data.*

</div>
