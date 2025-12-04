# 🛡️ AEGIS - Autonomous Edge Guard & Intelligence System

> **The First Sovereign AI Security System** - 100% Local, $0 Cloud Costs, Complete Privacy

Built for the **Gradient "Build Your Own AI Lab" Hackathon** powered by Parallax.

![AEGIS Banner](docs/banner.png)

## 🏆 Competition Highlights

- **7-Stage AI Pipeline** - Maximum Parallax demonstration
- **$0 Cloud Costs** vs $518.40/month AWS (Annual savings: $6,220.80)
- **100% Local Privacy** - No data ever leaves your device
- **Offline Operation** - Works without internet
- **Optimized for M1 Air 8GB** - Runs on consumer hardware

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **Python 3.10+**
- **Rust** (for Tauri builds)
- **Parallax** installed and running

### 1. Start Parallax Cluster

```bash
# Start Parallax
parallax run

# In another terminal, join the cluster
parallax join
```

### 2. Install Frontend Dependencies

```bash
cd AEGIS
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt --break-system-packages
```

### 4. Start the Backend

```bash
# With real camera
python vision_sentinel.py

# OR with demo mode (recommended for testing)
python vision_sentinel.py --test
```

### 5. Start the Frontend

```bash
# In the AEGIS root directory
npm run dev
```

Open http://localhost:1420 in your browser.

## 🧠 7-Stage AI Pipeline

Every scan utilizes up to **7 AI inference calls** powered by Parallax:

| Stage | Function | Description |
|-------|----------|-------------|
| 1 | **Scene Interpretation** | CV features → natural language |
| 2 | **Threat Detection** | AI-powered threat analysis |
| 3 | **Action Planning** | Response plan generation |
| 4 | **Trend Analysis** | Pattern detection (every 5 scans) |
| 5 | **Log Summary** | Periodic summaries (every 10 scans) |
| 6 | **Behavior Analysis** | Activity patterns (every 3 scans) |
| 7 | **Risk Scoring** | Overall risk calculation |

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AEGIS FRONTEND                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Dashboard│  │  Vault   │  │Calibrate │  │   AI Pipeline    │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘ │
│       └─────────────┴─────────────┴─────────────────┘           │
│                             │                                   │
│                      REST API / SSE                             │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    AEGIS BACKEND (FastAPI)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ YOLOv8n  │→ │  7-Stage │→ │  State   │→ │  Video Stream    │ │
│  │  Vision  │  │ Pipeline │  │  Manager │  │    (30 FPS)      │ │
│  └────┬─────┘  └────┬─────┘  └──────────┘  └──────────────────┘ │
│       │             │                                           │
│       │        ┌────┴────┐                                      │
│       │        │PARALLAX │ ← Local AI Inference                 │
│       │        │ Client  │   Qwen/Qwen3-0.6B                    │
│       │        └─────────┘                                      │
└───────┼─────────────────────────────────────────────────────────┘
        │
   ┌────┴────┐
   │ Camera  │ or Test Mode
   └─────────┘
```

## 💰 Cost Comparison

| Service | Monthly Cost | Annual Cost |
|---------|--------------|-------------|
| AWS Rekognition | $518.40 | $6,220.80 |
| Google Vision AI | $450.00 | $5,400.00 |
| Azure CV | $480.00 | $5,760.00 |
| **AEGIS + Parallax** | **$0.00** | **$0.00** |

**Your Savings: $6,220.80/year** 🎉

## 🎬 Demo Mode

Run with `--test` flag for 8 cycling scenarios:

1. ✅ Normal Activity (1 person)
2. 👥 Multiple People (2 people + cell phone)
3. 🔪 **WEAPON DETECTED** (person + knife)
4. 🔥 **FIRE EMERGENCY** (flames)
5. ⬇️ Person Fallen (horizontal person)
6. 📷 Camera Blocked (obstructed view)
7. 🌙 Night Mode (low brightness)
8. ✨ All Clear (empty room)

## 🛠️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/status` | GET | System status |
| `/logs` | GET | Recent logs |
| `/threats` | GET | Threat events |
| `/metrics` | GET | Performance metrics |
| `/video_feed` | GET | MJPEG stream |
| `/events` | GET | SSE real-time updates |
| `/config` | POST | Update configuration |
| `/query` | POST | Natural language queries |
| `/cost_metrics` | GET | Cloud cost comparison |
| `/summary` | GET | Daily summary |

## 🏗️ Building for Production

### Web Build

```bash
npm run build
```

### Tauri Desktop App

```bash
npm run tauri:build
```

## 📁 Project Structure

```
AEGIS/
├── backend/
│   ├── vision_sentinel.py    # Main backend (optimized)
│   └── requirements.txt      # Python dependencies
├── src/
│   ├── components/           # React components
│   │   ├── VideoFeed.jsx
│   │   ├── ThreatBadge.jsx
│   │   ├── NeuralLog.jsx
│   │   ├── AIPipeline.jsx
│   │   ├── NetworkDiagram.jsx
│   │   └── ClusterMetrics.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Vault.jsx         # Privacy vault
│   │   └── Calibration.jsx   # System config
│   ├── store/
│   │   └── useSystemStore.js # Zustand state
│   ├── services/
│   │   └── sentinel.js       # Backend connection
│   └── styles/
│       └── index.css         # Tailwind + custom
├── src-tauri/                # Tauri config
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Why AEGIS Wins

1. **Maximum Parallax Integration** - 7 AI calls per scan cycle
2. **Privacy First** - 100% local processing, zero cloud dependency
3. **Cost Effective** - $0 operational cost
4. **Production Ready** - Handles real cameras and edge cases
5. **Impressive UI** - Sci-fi aesthetics with smooth animations
6. **Low Hardware Requirements** - Optimized for M1 Air 8GB

## 🔐 Privacy Features

- ✅ All processing on-device
- ✅ No cloud uploads
- ✅ No internet required
- ✅ Emergency purge feature
- ✅ Encrypted local storage
- ✅ 100% data sovereignty

## 📜 License

MIT License - Built for the Gradient Hackathon

---

**AEGIS** - *Your Security, Your Data, Your Control* 🛡️
