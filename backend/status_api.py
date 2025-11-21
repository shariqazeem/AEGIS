#!/usr/bin/env python3
"""
AEGIS Status API Server
=======================
Simple FastAPI server that provides status endpoints for the frontend.
This runs alongside the video_server.py to provide system status.

Start with: python status_api.py
Access at: http://localhost:8001
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from datetime import datetime

app = FastAPI(title="AEGIS Status API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
system_status = {
    "sentinel_active": True,
    "threat_level": "SAFE",
    "last_analysis": "System initialized",
    "models_loaded": False,
    "parallax_connected": False,
    "uptime": 0
}

start_time = time.time()

class LogEntry(BaseModel):
    timestamp: str
    level: str
    message: str

recent_logs = []

@app.get("/")
def root():
    return {
        "service": "AEGIS Status API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/status")
def get_status():
    """Get current system status"""
    system_status["uptime"] = int(time.time() - start_time)
    return system_status

@app.post("/status")
def update_status(threat_level: str = None, analysis: str = None, models_loaded: bool = None, parallax_connected: bool = None):
    """Update system status (called by sentinel)"""
    if threat_level:
        system_status["threat_level"] = threat_level
    if analysis:
        system_status["last_analysis"] = analysis
    if models_loaded is not None:
        system_status["models_loaded"] = models_loaded
    if parallax_connected is not None:
        system_status["parallax_connected"] = parallax_connected
    return {"status": "updated"}

@app.get("/logs")
def get_logs():
    """Get recent logs"""
    return {"logs": recent_logs[-50:]}  # Last 50 logs

@app.post("/logs")
def add_log(entry: LogEntry):
    """Add a log entry (called by sentinel)"""
    recent_logs.append(entry.dict())
    if len(recent_logs) > 100:
        recent_logs.pop(0)
    return {"status": "logged"}

@app.get("/health")
def health():
    """Health check"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    print("🔍 Starting AEGIS Status API on http://0.0.0.0:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
