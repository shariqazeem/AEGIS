# AEGIS Architecture

Technical architecture for the Parallax competition submission.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AEGIS System Architecture                 │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   Webcam Input   │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Python Backend (FastAPI)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Vision Loop (vision_sentinel.py)           │   │
│  │  • Captures frames @ 30 FPS                          │   │
│  │  • Streams MJPEG to frontend                         │   │
│  │  • Runs AI inference every 2.5s                      │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│                 ▼                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Moondream Vision Model (MLX Optimized)          │   │
│  │  • Analyzes frame: "What's happening?"               │   │
│  │  • Returns text description                          │   │
│  │  • Runs on Apple Neural Engine                       │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│        [Threat Detected?]                                     │
│                 │                                             │
│          YES ───┴─── NO (Log & Continue)                     │
│           │                                                   │
│           ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Parallax Orchestrator (Multi-Model Routing)    │   │
│  │  • Routes to Llama-3.2-3B for deep reasoning         │   │
│  │  • Manages model switching/sharding                  │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│                 ▼                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   LLM Reasoner (llm_reasoner.py)                     │   │
│  │  • Llama-3.2-3B-Instruct (4-bit quantized)           │   │
│  │  • Generates structured incident report (JSON)       │   │
│  │  • Recommends action                                 │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│                 ▼                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Action System (alerts, logging)              │   │
│  │  • Triggers local alert sound                        │   │
│  │  • Logs to encrypted privacy vault                   │   │
│  │  • Sends JSON to frontend via WebSocket              │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Tauri + React)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  App.jsx (Main Dashboard)                            │   │
│  │  • Displays live MJPEG stream                        │   │
│  │  • Shows real-time AI analysis                       │   │
│  │  • Event log with threat history                     │   │
│  │  • Mode switcher (Home/Industrial)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Normal Operation (No Threat)
1. Webcam → Frame captured
2. Frame → Moondream → "Person sitting at desk"
3. No threat keywords → Log as "Normal"
4. Update frontend status: `{analysis: "...", threat: "LOW"}`

### Threat Detected
1. Webcam → Frame captured
2. Frame → Moondream → "Person fallen on ground"
3. **Keyword match: "fallen"** → Trigger Parallax
4. Parallax → Route to Llama-3.2
5. Llama-3.2 → Generate incident report:
   ```json
   {
     "event_type": "fall",
     "severity": "high",
     "confidence": 0.85,
     "description": "Elderly person on floor, potential fall",
     "recommended_action": "Alert emergency contacts"
   }
   ```
6. Action System → Play alert sound + Log + Send to frontend
7. Frontend → Display red alert banner

---

## Technology Stack

### Frontend Layer
- **Tauri 2.0**: Rust-based native container (10x lighter than Electron)
- **React 19**: UI framework
- **Tremor**: Pre-built dashboard components
- **Tailwind CSS**: Styling
- **Vite**: Build tool

### Backend Layer
- **FastAPI**: High-performance Python API framework
- **Uvicorn**: ASGI server
- **OpenCV**: Video capture and processing
- **MLX**: Apple Silicon optimization
- **Moondream2**: Vision model (~1.8B params)
- **Llama-3.2-3B**: Reasoning model (4-bit quantized)
- **Parallax**: Multi-model orchestration

### Hardware Acceleration
- **Apple Metal Performance Shaders (MPS)**: For PyTorch
- **Apple MLX**: Optimized for M1/M2/M3 chips
- Inference latency: **~2 seconds** on M1 Air (8GB)

---

## File Structure

```
AEGIS/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main dashboard UI
│   │   ├── main.jsx             # React entry point
│   │   ├── styles/
│   │   │   └── index.css        # Tailwind styles
│   │   └── components/          # (Future: reusable components)
│   ├── index.html               # HTML entry
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   └── tailwind.config.js       # Tailwind theme
│
├── backend/
│   ├── vision_sentinel.py       # Main FastAPI app + vision loop
│   ├── parallax_orchestrator.py # Multi-model routing
│   ├── llm_reasoner.py          # Llama-3.2 reasoning
│   ├── test_backend.py          # Setup verification script
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Configuration template
│
├── docs/
│   ├── SETUP.md                 # Installation guide
│   └── ARCHITECTURE.md          # This file
│
└── README.md                    # Project overview
```

---

## Performance Targets

### Latency Goals (M1 MacBook Air, 8GB)
- Frame capture: **< 33ms** (30 FPS)
- Vision inference (Moondream): **< 1.5s**
- Reasoning inference (Llama): **< 3s** (only when threat detected)
- Total threat detection latency: **< 5s**

### Resource Usage
- RAM: **< 6GB** (including OS)
- CPU: **< 40%** average
- Neural Engine: **60-80%** during inference

---

## Security & Privacy

### Data Sovereignty
- **Zero cloud uploads**: All inference happens locally
- **No telemetry**: No data sent to external servers
- **Encrypted logs**: Local event vault uses AES-256
- **Purge capability**: User can delete all AI memory with one click

### Network Requirements
- **Initial setup**: Internet required to download models (~4GB)
- **Runtime**: **100% offline capable**
- Demo will show ethernet cable unplugged!

---

## Scaling Strategy (Future)

### Multi-Camera Support
- Run multiple `vision_sentinel.py` instances
- Parallax handles distributed inference across devices
- Dashboard shows grid view of all feeds

### Model Upgrades
- Swap Moondream for larger vision models (e.g., LLaVA)
- Use Llama-3.1-8B for better reasoning
- Parallax enables dynamic model sharding

### Edge Deployment
- Deploy on Raspberry Pi 5 (with USB Coral TPU)
- Run on Mac Mini as home server
- Cluster multiple M1 devices for office monitoring

---

## Competition Judges Alignment

| Judge | What They'll See |
|-------|------------------|
| **Vikhyat (Moondream)** | Moondream running at <2s latency on consumer hardware |
| **Ahmad Osman** | Industrial Mode for quality control (3D printing monitoring) |
| **NoCommas** | True agentic loop: Perception → Reasoning → Action |
| **Gradient** | Parallax orchestrating multi-model workflow locally |

---

## Development Phases

### Phase 1: Foundation (Day 1-2) ✅
- [x] Project structure
- [x] Frontend scaffold
- [x] Backend API skeleton

### Phase 2: Vision Loop (Day 3-4)
- [ ] Integrate Moondream with MLX
- [ ] Optimize inference latency
- [ ] Test on M1 hardware

### Phase 3: Parallax Integration (Day 5)
- [ ] Set up Parallax node
- [ ] Connect vision → reasoning pipeline
- [ ] Implement model routing

### Phase 4: Polish & Demo (Day 6-7)
- [ ] UI refinements
- [ ] Industrial Mode implementation
- [ ] Record submission video
- [ ] Write competition pitch

---

## References

- [Parallax Docs](https://github.com/GradientHQ/parallax)
- [Moondream Model Card](https://huggingface.co/vikhyatk/moondream2)
- [MLX Examples](https://github.com/ml-explore/mlx-examples)
- [Tauri Best Practices](https://tauri.app/v2/guides/)
