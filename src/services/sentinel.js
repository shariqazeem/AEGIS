// src/services/sentinel.js
import { useSystemStore } from '../store/useSystemStore';

let eventSource = null;
let statusPollingInterval = null;

export const startSentinel = async () => {
    console.log("AEGIS: Connecting to backend...");

    // Connect to status API
    try {
        const statusResponse = await fetch('http://localhost:8001/status');
        if (statusResponse.ok) {
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
                message: `✓ Connected to AEGIS (${data.model})`
            });

            // Load initial logs
            const logsResponse = await fetch('http://localhost:8001/logs?limit=50');
            if (logsResponse.ok) {
                const logsData = await logsResponse.json();
                logsData.logs.forEach(log => useSystemStore.getState().addLog(log));
            }
        }
    } catch (e) {
        useSystemStore.getState().addLog({
            level: "WARN",
            type: "API",
            message: "⚠ Backend offline - start vision_sentinel.py"
        });
    }

    // Connect to SSE for real-time updates
    connectSSE();

    // Poll for status updates
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
        } catch (e) {}
    }, 2000);
};

const connectSSE = () => {
    if (eventSource) eventSource.close();

    try {
        eventSource = new EventSource('http://localhost:8001/events');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'keepalive' || data.type === 'init') return;
                useSystemStore.getState().addLog(data);

                if (data.level === 'CRITICAL') {
                    useSystemStore.getState().setThreatLevel('CRITICAL');
                } else if (data.message?.includes('Normal') || data.message?.includes('SAFE')) {
                    useSystemStore.getState().setThreatLevel('SAFE');
                }
            } catch (e) {}
        };

        eventSource.onerror = () => {
            eventSource.close();
            setTimeout(connectSSE, 5000);
        };
    } catch (e) {}
};

export const stopSentinel = () => {
    if (eventSource) eventSource.close();
    if (statusPollingInterval) clearInterval(statusPollingInterval);
};
