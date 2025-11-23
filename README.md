# AEGIS - Autonomous Edge Guard & Intelligence System

[![Parallax Competition 2025](https://img.shields.io/badge/Parallax-Competition_2025-00D9FF?style=for-the-badge)](https://gradient.network/campaign/)
[![Built for M1/M2/M3](https://img.shields.io/badge/Apple_Silicon-Optimized-black?style=for-the-badge&logo=apple)](https://www.apple.com/mac/)
[![Sovereign AI](https://img.shields.io/badge/Sovereign-AI-green?style=for-the-badge)](https://github.com/GradientHQ/parallax)
[![7-Stage Pipeline](https://img.shields.io/badge/7_Stage-AI_Pipeline-purple?style=for-the-badge)](https://github.com/GradientHQ/parallax)

**"The first Sovereign Life OS that turns your MacBook into a private, offline AI sentinel — powered entirely by Parallax local inference."**

---

## For Judges: Why AEGIS Should Win

### Extensive Parallax Usage (Key Judging Criteria!)

AEGIS demonstrates **unparalleled Parallax integration** through a **7-STAGE AI PIPELINE**:

| Stage | Function | Parallax Usage |
|-------|----------|----------------|
| 1 | **Scene Interpretation** | CV features → natural language description |
| 2 | **Threat Detection** | AI-powered threat analysis with reasoning |
| 3 | **Action Planning** | Generate response recommendations |
| 4 | **Trend Analysis** | Pattern recognition over time |
| 5 | **Log Summaries** | Human-readable security reports |
| 6 | **Behavior Analysis** | Behavioral pattern recognition (NEW!) |
| 7 | **Risk Scoring** | Multi-factor risk assessment (NEW!) |

**Up to 7 Parallax API calls per analysis cycle!** This showcases the power of local AI clusters for complex, multi-stage reasoning workflows.

### Privacy & Low Cost

- **100% Local Inference**: Zero cloud dependency
- **Zero API Costs**: All AI runs on your hardware
- **Data Sovereignty**: "Purge Memory" button for true data control
- **Offline-First**: Demo works with ethernet unplugged!

### Real-World Application

- **Home Safety**: Fall detection, fire detection, intruder alerts
- **Industrial QC**: Quality control, equipment monitoring
- **Privacy-Critical**: Medical facilities, home care, secure facilities

---

## What is AEGIS?

AEGIS is a **production-ready** local-first AI monitoring system that demonstrates the future of sovereign AI: powerful, private, and practical.

### The Innovation

- **Vision**: YOLOv8 object detection with class-specific confidence thresholds
- **Multi-Stage Parallax**: 7 different AI calls per analysis cycle
- **Intelligent Detection**: AI-powered threat reasoning, not just rule-based
- **Privacy**: Complete data sovereignty with local inference

### Key Features

- **7-Stage Parallax Pipeline**: Maximum Parallax demonstration!
- **Enhanced YOLO Integration**: Class-specific confidence (0.35 for people, 0.55 for weapons)
- **Fall Detection**: Pose-based detection using aspect ratio analysis
- **Behavioral Analysis**: AI tracks activity patterns over time
- **Risk Scoring**: Multi-factor intelligent risk assessment
- **Auto-Fallback**: Graceful degradation if Parallax unavailable
- **Demo Mode**: Works without camera for demonstration

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       AEGIS FRONTEND                                 │
│                 (Tauri 2.0 + React + Tremor)                        │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    VISION SYSTEM (YOLOv8 + OpenCV)                  │
│   YOLOv8: 80+ object classes | OpenCV: Motion, Color, Brightness   │
│           Class-Specific Confidence | Pose Analysis                  │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│              PARALLAX 7-STAGE AI PIPELINE (Local Cluster)           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ Stage1 │→│ Stage2 │→│ Stage3 │→│ Stage4 │→│ Stage5 │            │
│  │ Scene  │ │ Threat │ │ Action │ │ Trend  │ │  Log   │            │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘            │
│              ┌────────┐                   ┌────────┐                │
│              │ Stage6 │───────────────────│ Stage7 │                │
│              │Behavior│                   │  Risk  │                │
│              └────────┘                   └────────┘                │
│                                                                      │
│  Model: Qwen/Qwen3-0.6B (runs on M1 Air 8GB!)                       │
│  API: http://localhost:3001/v1 (OpenAI-compatible)                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Step 1: Start Parallax (Required!)

```bash
# Terminal 1: Start Parallax scheduler
cd /path/to/parallax && source venv/bin/activate
parallax run -m Qwen/Qwen3-0.6B -n 1

# Terminal 2: Join the cluster
cd /path/to/parallax && source venv/bin/activate
parallax join
```

### Step 2: Install & Run AEGIS

```bash
# Install dependencies
npm install && cd backend && pip install -r requirements.txt && cd ..

# Start AEGIS
./start-aegis.sh
```

### Step 3: Access Dashboard

Open http://localhost:1420 in your browser.

**That's it!** AEGIS will detect Parallax and route all AI inference locally.

### Demo Mode (No Camera)

```bash
cd backend && python vision_sentinel.py --test
```

This cycles through threat scenarios to showcase the full 7-stage pipeline.

---

## Tech Stack

### Frontend
- **Framework**: Tauri 2.0 (Rust-based, 10x lighter than Electron)
- **UI**: React 19 + Tremor (Data Dashboard components)
- **Styling**: Tailwind CSS
- **Theme**: Cyber-Industrial Dark Mode

### Backend (Parallax-First!)
- **LLM Orchestration**: Parallax Local Cluster
- **LLM Model**: Qwen/Qwen3-0.6B (lightweight, ~600MB)
- **Vision**: YOLOv8n (6MB) + OpenCV
- **API**: FastAPI + Uvicorn

### Parallax Integration
- **Endpoint**: `http://localhost:3001/v1` (OpenAI-compatible)
- **7 AI Stages**: Scene → Threat → Action → Trend → Log → Behavior → Risk

---

## Competition Differentiators

### 1. Maximum Parallax Utilization

While other apps might make 1-2 API calls, AEGIS makes **up to 7 Parallax calls per scan**:

```
Scan Start
   ├─→ Stage 1: Scene Interpretation    (Parallax)
   ├─→ Stage 2: Threat Detection        (Parallax)
   ├─→ Stage 3: Action Planning         (Parallax, if threat)
   ├─→ Stage 4: Trend Analysis          (Parallax, every 5 scans)
   ├─→ Stage 5: Log Summary             (Parallax, every 10 scans)
   ├─→ Stage 6: Behavior Analysis       (Parallax, every 3 scans)
   └─→ Stage 7: Risk Scoring            (Parallax, every scan)
```

### 2. Enhanced YOLO with Smart Confidence

```python
YOLO_CONFIDENCE_THRESHOLDS = {
    "person": 0.35,      # Lower = more sensitive for safety
    "knife": 0.55,       # Higher = fewer false positives
    "scissors": 0.50,
    "fire": 0.45,
    "default": 0.40
}
```

### 3. Intelligent Fall Detection

Not just "person in lower frame" - AEGIS analyzes:
- Bounding box aspect ratio (horizontal = possibly fallen)
- Motion patterns (sudden stop = collapse)
- Temporal consistency (still for multiple frames)

### 4. Behavioral Pattern Recognition

Parallax AI tracks activity over time:
- Normal activity rhythms
- Anomalous behavior detection
- Historical context awareness

### 5. Multi-Factor Risk Scoring

Combines all inputs into actionable risk score:
- Threat detection confidence
- Behavioral anomaly score
- Environmental factors
- Historical patterns

---

## Project Structure

```
AEGIS/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── AIPipeline.jsx  # 7-stage pipeline visualization
│   │   ├── ClusterMetrics.jsx
│   │   └── ...
│   └── pages/
│       ├── Dashboard.jsx
│       └── Vault.jsx       # Privacy vault
│
├── backend/
│   └── vision_sentinel.py  # Main AI backend (7-stage pipeline)
│
├── src-tauri/              # Rust backend for Tauri
└── docs/                   # Documentation
```

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /status` | Current system status |
| `GET /metrics` | Parallax cluster metrics + 7-stage pipeline info |
| `GET /logs` | Recent activity logs |
| `GET /threats` | Threat history for Vault |
| `GET /screenshots` | Threat capture images |
| `POST /purge` | Purge all data (privacy) |

---

## The X-Factor

- **Privacy Vault** with "Purge Memory" button
- **Offline-first**: Demo runs with ethernet unplugged
- **Beautiful UI**: Production-grade dashboard
- **Scalable**: Ready for 7-node Mac mini cluster
- **Open-source**: Community can learn and build

---

## Built for the Parallax Competition 2025

This project demonstrates:

1. **Useful Application**: Real home safety + industrial QC
2. **Maximum Parallax Usage**: 7-stage AI pipeline
3. **Privacy & Low Cost**: 100% local inference
4. **Technical Excellence**: YOLOv8 + Parallax fusion
5. **Production Ready**: Clean, documented codebase

**Let's win this!**

---

## License

MIT License - Built for the Parallax Competition 2025

## Links

- [Parallax Documentation](https://github.com/GradientHQ/parallax)
- [Competition Details](https://gradient.network/campaign/)
- [Tremor UI Components](https://www.tremor.so/)
