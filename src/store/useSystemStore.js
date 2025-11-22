import { create } from 'zustand';

export const useSystemStore = create((set) => ({
    threatLevel: 'SAFE', // 'SAFE' | 'CRITICAL' | 'WARNING'
    cpuLoad: 0,
    ramUsage: 0,
    logs: [],

    // System info from backend
    systemInfo: {
        parallaxConnected: false,
        cameraActive: false,
        model: '',
        scanCount: 0,
        threatCount: 0,
        lastDescription: ''
    },

    setThreatLevel: (level) => set({ threatLevel: level }),
    setCpuLoad: (load) => set({ cpuLoad: load }),
    setRamUsage: (usage) => set({ ramUsage: usage }),
    setSystemInfo: (info) => set((state) => ({
        systemInfo: { ...state.systemInfo, ...info }
    })),

    addLog: (log) => set((state) => {
        // Handle both old format (string) and new format (object)
        const logEntry = typeof log === 'string'
            ? { timestamp: new Date().toISOString(), message: log, level: 'INFO', type: 'SYSTEM' }
            : {
                timestamp: log.timestamp || new Date().toISOString(),
                time: log.time || new Date().toISOString().split('T')[1].split('.')[0],
                message: log.message,
                level: log.level || 'INFO',
                type: log.type || 'SYSTEM'
            };

        return {
            logs: [...state.logs.slice(-99), logEntry]  // Keep last 100 logs
        };
    }),

    clearLogs: () => set({ logs: [] }),
}));
