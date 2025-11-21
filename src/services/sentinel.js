import { Command } from '@tauri-apps/plugin-shell';
import { useSystemStore } from '../store/useSystemStore';

// Store the process so we can kill it later
let sentinelProcess = null;

export const startSentinel = async () => {
    try {
        // 'sentinel' matches the name in tauri.conf.json "externalBin"
        // Note: You need to ensure the binary exists in src-tauri/binaries/
        const command = Command.sidecar('binaries/sentinel');

        // Start the Python script
        sentinelProcess = await command.spawn();

        console.log("AEGIS BRAIN ACTIVATED: PID", sentinelProcess.pid);

        // Listen for text output from Python (e.g., "Threat Detected")
        command.stdout.on('data', (line) => {
            console.log(`[PYTHON SAYS]: ${line}`);
            // Update Zustand store
            useSystemStore.getState().addLog(line);

            // Simple parsing logic (can be expanded)
            if (line.includes("THREAT")) {
                useSystemStore.getState().setThreatLevel("CRITICAL");
            } else if (line.includes("SAFE")) {
                useSystemStore.getState().setThreatLevel("SAFE");
            }
        });

        command.stderr.on('data', (line) => {
            console.error(`[PYTHON ERROR]: ${line}`);
        });

        command.on('close', (data) => {
            console.log(`AEGIS BRAIN TERMINATED with code ${data.code} and signal ${data.signal}`);
            sentinelProcess = null;
        });

    } catch (error) {
        console.error("FAILED TO START SENTINEL:", error);
    }
};

export const stopSentinel = async () => {
    if (sentinelProcess) {
        await sentinelProcess.kill();
        sentinelProcess = null;
        console.log("AEGIS BRAIN DEACTIVATED");
    }
};
