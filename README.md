# 🛡️ AEGIS - Autonomous Edge Guard & Intelligence System

**"The first Sovereign Life OS that turns your MacBook into a private, offline AI sentinel."**

Built for the Parallax Competition by Gradient Network.

## 🎯 What is AEGIS?

AEGIS is a local-first AI monitoring system that runs entirely on Apple Silicon (M1/M2/M3) using Parallax. It transforms your MacBook's webcam into an intelligent "Guardian" that monitors the physical world for safety threats—**without sending any data to the cloud**.

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

## 🚀 Quick Start

### Prerequisites

- macOS with Apple Silicon (M1/M2/M3)
- Node.js 18+ and npm
- Python 3.10+
- Rust (for Tauri development)

### Frontend Setup

```bash
cd frontend
npm install
npm run tauri dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python vision_sentinel.py
```

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

## 🏆 Competition Strategy

This project is designed to appeal to the specific judges:

- **Vikhyat (Moondream)**: Real-time video inference on consumer hardware
- **Ahmad Osman**: Industrial monitoring use case
- **NoCommas**: True agentic workflow (Perception → Reasoning → Action)
- **Gradient/Parallax**: Perfect showcase of local model orchestration

## 📝 License

MIT License - Built for the Parallax Competition 2025

## 🔗 Links

- [Parallax Documentation](https://github.com/GradientHQ/parallax)
- [Competition Details](https://gradient.network/campaign/)
- [Tremor UI Components](https://www.tremor.so/)
