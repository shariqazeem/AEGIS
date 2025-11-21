# 🛡️ AEGIS - Autonomous Edge Guard & Intelligence System

[![Parallax Competition 2025](https://img.shields.io/badge/Parallax-Competition_2025-00D9FF?style=for-the-badge)](https://gradient.network/campaign/)
[![Built for M1/M2/M3](https://img.shields.io/badge/Apple_Silicon-Optimized-black?style=for-the-badge&logo=apple)](https://www.apple.com/mac/)
[![Sovereign AI](https://img.shields.io/badge/Sovereign-AI-green?style=for-the-badge)](https://github.com/GradientHQ/parallax)

**"The first Sovereign Life OS that turns your MacBook into a private, offline AI sentinel."**

> **For Judges:** AEGIS showcases Parallax's power through a real-world agentic workflow: Vision (Moondream) → Reasoning (Llama-3.2) → Action. Everything runs locally on M1/M2/M3 with zero cloud dependency. Unplug the ethernet cable during the demo—it keeps working. 🔌❌

---

## 🎯 What is AEGIS?

AEGIS is a **production-ready** local-first AI monitoring system that runs entirely on Apple Silicon using **Parallax**. It demonstrates the future of sovereign AI: powerful, private, and practical.

**The Innovation:**
- **Vision**: Moondream analyzes live webcam feed every 2.5 seconds
- **Orchestration**: Parallax routes threats to Llama-3.2 for deep reasoning
- **Action**: Structured incident reports, local logging, zero cloud upload
- **Privacy**: "Purge Memory" button—true data sovereignty unlike ChatGPT

### Key Features

- **Visual Sentinel**: Real-time video monitoring using Moondream vision model
- **Two Operating Modes**:
  - **Home Mode**: Monitors for falls, emergencies, and safety concerns
  - **Industrial Mode**: Quality control for 3D printing, server monitoring, etc.
- **Sovereign Privacy**: All AI inference happens locally on your hardware
- **Agentic Workflow**: Parallax orchestrates vision → reasoning → action pipeline

## 🏗️ Architecture

```
Frontend (Tauri + React)
    ↓
Python FastAPI Backend
    ├── Vision Loop (Moondream via MLX)
    ├── Parallax Orchestrator
    └── LLM Reasoning (Llama-3.2-3B)
```

## 📦 Tech Stack

### Frontend
- **Framework**: Tauri 2.0 (Rust-based, 10x lighter than Electron)
- **UI**: React 19 + Tremor (Data Dashboard components)
- **Styling**: Tailwind CSS
- **Theme**: Cyber-Industrial Dark Mode

### Backend
- **Orchestration**: Parallax
- **Vision Model**: Moondream2 (optimized for MLX)
- **Reasoning**: Llama-3.2-3B-Instruct (4-bit quantized)
- **Hardware Acceleration**: Apple MLX
- **API**: FastAPI + Uvicorn

## 🚀 Quick Start (3 Commands)

```bash
# 1. Install everything
npm install && cd backend && pip install -r requirements.txt && cd ..

# 2. Start all services (video server, sentinel, frontend)
./start-aegis.sh

# 3. (Optional) Enable Parallax for multi-model orchestration
parallax run  # In a separate terminal
```

**That's it!** The app opens automatically with live video feed.

**See [INSTALLATION.md](INSTALLATION.md) for full setup with Parallax integration.**

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

## 🏆 Why AEGIS Wins

**For Vikhyat Korrapati (Moondream CTO):**
- Moondream running real-time visual inference at <2.5s latency on M1
- Not just a demo—a production use case (home safety, industrial QC)
- Showcases Moondream's speed advantage on Apple Silicon

**For Ahmad Osman (Industrial AI):**
- "Industrial Mode" for quality control (3D print monitoring, server rack alerts)
- Demonstrates NDT (Non-Destructive Testing) at the edge
- Cost-effective alternative to $10K+ industrial vision systems

**For NoCommas (Agentic Systems):**
- True autonomous loop: Perception → Reasoning → Action
- Parallax orchestrates handoff from vision to reasoning
- Structured output (JSON incident reports) for downstream actions

**For Gradient Team:**
- Perfect case study for Parallax's value prop
- Shows multi-model orchestration (Moondream + Llama working together)
- Demonstrates "sovereign AI" philosophy tangibly

**The X-Factor:**
- **Privacy Vault** with "Purge Memory" button (judges will love this UX)
- **Offline-first**: Demo runs with ethernet unplugged
- **Beautiful UI**: Cinema-grade dashboard (judges are humans too!)
- **Open-source & Educational**: Other devs can learn from this

## 📝 License

MIT License - Built for the Parallax Competition 2025

## 🔗 Links

- [Parallax Documentation](https://github.com/GradientHQ/parallax)
- [Competition Details](https://gradient.network/campaign/)
- [Tremor UI Components](https://www.tremor.so/)
