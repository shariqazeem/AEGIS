import { useSystemStore } from '../store/useSystemStore';
import audioService from './audio';

// Note: Backend runs on port 8001 for status API
// Start backend with: python backend/vision_sentinel.py

let eventSource = null;
let statusPollingInterval = null;

// Initialize audio on first user interaction (browser policy)
let audioInitialized = false;
const initAudio = () => {
    if (!audioInitialized) {
        audioService.init();
        audioInitialized = true;
    }
};

export const startSentinel = async () => {
    try {
        console.log("AEGIS SENTINEL: Connecting to backend...");

        // Check if video server is running
        try {
            const videoResponse = await fetch('http://localhost:8000/health');
            if (videoResponse.ok) {
                console.log("✓ Video server connected");
                useSystemStore.getState().addLog({
                    level: "SUCCESS",
                    type: "VIDEO",
                    message: "✓ Video server online"
                });
            }
        } catch (e) {
            console.warn("⚠ Video server not detected. Start: python backend/video_server.py");
            useSystemStore.getState().addLog({
                level: "WARN",
                type: "VIDEO",
                message: "⚠ Video server offline"
            });
        }

        // Connect to status API
        try {
            const statusResponse = await fetch('http://localhost:8001/status');
            if (statusResponse.ok) {
                console.log("✓ Status API connected");
                const data = await statusResponse.json();
                useSystemStore.getState().setThreatLevel(data.threat_level);
                useSystemStore.getState().setSystemInfo({
                    parallaxConnected: data.parallax_connected,
                    cameraActive: data.camera_active,
                    model: data.model,
                    scanCount: data.scan_count,
                    threatCount: data.threat_count
                });

                useSystemStore.getState().addLog({
                    level: "SUCCESS",
                    type: "API",
                    message: `✓ Connected to AEGIS backend (${data.model})`
                });

                // Load initial logs
                const logsResponse = await fetch('http://localhost:8001/logs?limit=50');
                if (logsResponse.ok) {
                    const logsData = await logsResponse.json();
                    logsData.logs.forEach(log => {
                        useSystemStore.getState().addLog(log);
                    });
                }
            }
        } catch (e) {
            console.warn("⚠ Status API not running. Start: python backend/vision_sentinel.py");
            useSystemStore.getState().addLog({
                level: "WARN",
                type: "API",
                message: "⚠ Status API offline - start backend"
            });
        }

        // Connect to Server-Sent Events for real-time updates
        connectSSE();

        // Also poll for status updates as backup
        statusPollingInterval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:8001/status');
                if (response.ok) {
                    const data = await response.json();
                    useSystemStore.getState().setThreatLevel(data.threat_level);
                    useSystemStore.getState().setSystemInfo({
                        parallaxConnected: data.parallax_connected,
                        cameraActive: data.camera_active,
                        model: data.model,
                        scanCount: data.scan_count,
                        threatCount: data.threat_count,
                        lastDescription: data.last_description
                    });
                }
            } catch (e) {
                // Status API not available
            }
        }, 3000);  // Poll every 3 seconds

        console.log("AEGIS BRAIN: Monitoring active");

    } catch (error) {
        console.error("FAILED TO START SENTINEL:", error);
        useSystemStore.getState().addLog({
            level: "ERROR",
            type: "SYSTEM",
            message: "❌ Sentinel initialization failed"
        });
    }
};

const connectSSE = () => {
    // Close existing connection
    if (eventSource) {
        eventSource.close();
    }

    try {
        eventSource = new EventSource('http://localhost:8001/events');

        eventSource.onopen = () => {
            console.log("✓ SSE connected - real-time logs active");
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Skip keepalive messages
                if (data.type === 'keepalive') return;

                // Handle init message
                if (data.type === 'init') {
                    useSystemStore.getState().setThreatLevel(data.threat_level);
                    return;
                }

                // Add log to store
                useSystemStore.getState().addLog(data);

                // Update threat level based on log
                if (data.level === 'CRITICAL') {
                    useSystemStore.getState().setThreatLevel('CRITICAL');
                    // Play threat alert sound!
                    initAudio();
                    audioService.playThreatAlert();
                } else if (data.message?.includes('Normal') || data.message?.includes('SAFE')) {
                    useSystemStore.getState().setThreatLevel('SAFE');
                }
            } catch (e) {
                console.error("SSE parse error:", e);
            }
        };

        eventSource.onerror = (error) => {
            console.warn("SSE connection error, will retry...");
            eventSource.close();
            // Retry connection after 5 seconds
            setTimeout(connectSSE, 5000);
        };
    } catch (e) {
        console.warn("SSE not available, falling back to polling");
    }
};

export const stopSentinel = async () => {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }
    if (statusPollingInterval) {
        clearInterval(statusPollingInterval);
        statusPollingInterval = null;
    }
    console.log("AEGIS BRAIN: Stopped");
};
