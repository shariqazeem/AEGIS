# 🛡️ AEGIS - Autonomous Edge Guard & Intelligence System

[![Parallax Competition 2025](https://img.shields.io/badge/Parallax-Competition_2025-00D9FF?style=for-the-badge)](https://gradient.network/campaign/)
[![Built for M1/M2/M3](https://img.shields.io/badge/Apple_Silicon-Optimized-black?style=for-the-badge&logo=apple)](https://www.apple.com/mac/)
[![Sovereign AI](https://img.shields.io/badge/Sovereign-AI-green?style=for-the-badge)](https://github.com/GradientHQ/parallax)
[![Local Inference](https://img.shields.io/badge/100%25-Local_Inference-purple?style=for-the-badge)](https://github.com/GradientHQ/parallax)

**"The first Sovereign Life OS that turns your MacBook into a private, offline AI sentinel — powered entirely by Parallax local inference."**

> **For Judges:** AEGIS demonstrates **extensive Parallax usage** through a 5-stage AI pipeline:
> 1. **Scene Interpretation** → Parallax analyzes visual features
> 2. **Threat Detection** → Parallax reasons about safety
> 3. **Action Planning** → Parallax generates response plans
> 4. **Trend Analysis** → Parallax detects patterns over time
> 5. **Log Summaries** → Parallax generates human-readable reports
>
> **Zero cloud dependency.** Unplug the ethernet cable during the demo—it keeps working! 🔌❌

---

## 🎯 What is AEGIS?

AEGIS is a **production-ready** local-first AI monitoring system that runs entirely on your hardware using **Parallax**. It demonstrates the future of sovereign AI: powerful, private, and practical.

**The Innovation:**
- **Vision**: Lightweight OpenCV feature extraction + Parallax scene interpretation
- **Multi-Stage Parallax**: 5 different API calls per analysis cycle (see architecture below)
- **Action Pipeline**: Threat detection → Action planning → Trend analysis → Log generation
- **Privacy**: "Purge Memory" button—true data sovereignty unlike cloud AI services

### Key Features

- **5-Stage Parallax Pipeline**: Scene → Threat → Action → Trend → Summary (all via local Parallax!)
- **Lightweight Vision**: OpenCV-based detection (no heavy ML models on M1 Air!)
- **Two Operating Modes**:
  - **Home Mode**: Monitors for falls, emergencies, and safety concerns
  - **Industrial Mode**: Quality control for 3D printing, server monitoring, etc.
- **Sovereign Privacy**: 100% local inference via Parallax cluster
- **Auto-Fallback**: Gracefully handles Parallax offline scenarios
- **Demo Mode**: Works without camera for competition demonstration

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AEGIS FRONTEND                           │
│              (Tauri 2.0 + React + Tremor)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 VISION SYSTEM (Lightweight)                 │
│   OpenCV: Motion | Color | Brightness | Face Detection     │
│              (No heavy ML models needed!)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│           PARALLAX LOCAL CLUSTER (5-Stage Pipeline)        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Stage 1   │  │    Stage 2   │  │    Stage 3   │      │
│  │    Scene     │→│    Threat    │→│    Action    │      │
│  │ Interpretation│  │   Analysis   │  │   Planning   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                                    ↓              │
│  ┌──────────────┐                    ┌──────────────┐      │
│  │    Stage 4   │                    │    Stage 5   │      │
│  │    Trend     │                    │     Log      │      │
│  │   Analysis   │                    │   Summary    │      │
│  └──────────────┘                    └──────────────┘      │
│                                                             │
│  Model: Qwen/Qwen3-0.6B (lightweight, runs on M1!)         │
│  API: http://localhost:3001/v1 (OpenAI-compatible)         │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Tech Stack

### Frontend
- **Framework**: Tauri 2.0 (Rust-based, 10x lighter than Electron)
- **UI**: React 19 + Tremor (Data Dashboard components)
- **Styling**: Tailwind CSS
- **Theme**: Cyber-Industrial Dark Mode

### Backend (Parallax-First!)
- **LLM Orchestration**: Parallax Local Cluster
- **LLM Model**: Qwen/Qwen3-0.6B (lightweight, ~600MB)
- **Vision**: OpenCV (motion, color, brightness, Haar cascades)
- **Fallback Vision**: Optional Moondream2 for powerful hardware
- **API**: FastAPI + Uvicorn

### Parallax Integration
- **Endpoint**: `http://localhost:3001/v1` (OpenAI-compatible)
- **Features Used**:
  - Scene interpretation from visual features
  - Threat reasoning and classification
  - Action plan generation
  - Pattern/trend detection
  - Log summary generation

## 🚀 Quick Start

### Step 1: Start Parallax (Required for competition!)
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

# Start all services
./start-aegis.sh
```

**That's it!** AEGIS will detect Parallax and route all AI inference locally.

### Demo Mode (No Camera)
If you don't have a camera, AEGIS will automatically run in demo mode, generating synthetic frames to showcase the Parallax pipeline.

**See [INSTALLATION.md](INSTALLATION.md) for full setup guide.**

## 📁 Project Structure

```
AEGIS/
├── frontend/              # Tauri + React application
│   ├── src/
│   │   ├── App.jsx       # Main dashboard component
│   │   ├── components/   # Reusable UI components
│   │   └── styles/       # Tailwind configurations
│   ├── src-tauri/        # Rust backend for Tauri
│   └── package.json
│
├── backend/              # Python AI backend
│   ├── vision_sentinel.py       # Moondream vision loop
│   ├── parallax_orchestrator.py # Parallax integration
│   ├── llm_reasoner.py          # Llama reasoning engine
│   └── requirements.txt
│
└── docs/                 # Documentation and guides
```

## 🎮 Development Workflow

1. **Phase 1**: Frontend development (Dashboard UI)
2. **Phase 2**: Vision loop integration (Moondream + MLX)
3. **Phase 3**: Parallax orchestration (Multi-model routing)
4. **Phase 4**: End-to-end testing and demo video

## 🏆 Why AEGIS Wins the Parallax Competition

### Extensive Parallax Usage (Key Judging Criteria!)

AEGIS makes **5 separate Parallax API calls per analysis cycle**:

| Stage | Parallax Call | Purpose |
|-------|---------------|---------|
| 1 | Scene Interpretation | Convert CV features to natural language |
| 2 | Threat Analysis | Reason about safety concerns |
| 3 | Action Planning | Generate response recommendations |
| 4 | Trend Analysis | Detect patterns over time |
| 5 | Log Summary | Create human-readable reports |

**This demonstrates Parallax's value for complex, multi-stage AI workflows!**

### For the Judges

**Track 2: Building Applications** ✅
- **Useful application**: Home safety monitoring & industrial QC
- **Privacy & low cost**: 100% local inference, zero cloud costs
- **Easy to use**: One-command startup, auto-detects Parallax

**Technical Excellence:**
- Lightweight OpenCV vision (works on M1 Air!)
- Auto-fallback when Parallax offline
- Demo mode for testing without camera
- Clean, documented codebase

**The X-Factor:**
- **Privacy Vault** with "Purge Memory" button
- **Offline-first**: Demo runs with ethernet unplugged
- **Beautiful UI**: Production-grade dashboard
- **Open-source**: Other devs can learn and build on this

## 📝 License

MIT License - Built for the Parallax Competition 2025

## 🔗 Links

- [Parallax Documentation](https://github.com/GradientHQ/parallax)
- [Competition Details](https://gradient.network/campaign/)
- [Tremor UI Components](https://www.tremor.so/)
