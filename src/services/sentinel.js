import { useSystemStore } from '../store/useSystemStore';

// Note: For development, run the Python backend manually in separate terminals:
// Terminal 1: python backend/video_server.py
// Terminal 2: python backend/vision_sentinel.py
//
// The sidecar approach is disabled for now to avoid Tauri plugin issues.
// In production, you can re-enable the sidecar binary spawning.

let sentinelProcess = null;
let logPollingInterval = null;

export const startSentinel = async () => {
    try {
        console.log("AEGIS SENTINEL: Checking for backend connection...");

        // Check if video server is running
        try {
            const videoResponse = await fetch('http://localhost:8000/health');
            if (videoResponse.ok) {
                console.log("✓ Video server connected");
                useSystemStore.getState().addLog("✓ Video server online");
            }
        } catch (e) {
            console.warn("⚠ Video server not detected. Start: python backend/video_server.py");
            useSystemStore.getState().addLog("⚠ Video server offline");
        }

        // Check if status API is running (optional)
        try {
            const statusResponse = await fetch('http://localhost:8001/status');
            if (statusResponse.ok) {
                console.log("✓ Status API connected");
                const data = await statusResponse.json();
                useSystemStore.getState().setThreatLevel(data.threat_level);
            }
        } catch (e) {
            console.log("ℹ Status API not running (optional)");
        }

        useSystemStore.getState().addLog("🛡️ AEGIS Sentinel monitoring active");
        useSystemStore.getState().setThreatLevel("SAFE");

        // Poll for status updates from backend
        logPollingInterval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:8001/status');
                if (response.ok) {
                    const data = await response.json();
                    useSystemStore.getState().setThreatLevel(data.threat_level);
                }
            } catch (e) {
                // Status API not available, that's ok for manual testing
            }
        }, 2000);  // Poll every 2 seconds

        console.log("AEGIS BRAIN: Running in manual mode (backend started separately)");

    } catch (error) {
        console.error("FAILED TO START SENTINEL:", error);
        useSystemStore.getState().addLog("❌ Sentinel initialization failed");
    }
};

export const stopSentinel = async () => {
    if (logPollingInterval) {
        clearInterval(logPollingInterval);
        logPollingInterval = null;
    }
    console.log("AEGIS BRAIN: Stopped");
};
