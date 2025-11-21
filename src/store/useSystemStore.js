import { create } from 'zustand';

export const useSystemStore = create((set) => ({
    threatLevel: 'SAFE', // 'SAFE' | 'CRITICAL' | 'WARNING'
    cpuLoad: 0,
    ramUsage: 0,
    logs: [],

    setThreatLevel: (level) => set({ threatLevel: level }),
    setCpuLoad: (load) => set({ cpuLoad: load }),
    setRamUsage: (usage) => set({ ramUsage: usage }),
    addLog: (log) => set((state) => ({
        logs: [...state.logs.slice(-49), { timestamp: new Date().toISOString(), message: log }]
    })),
    clearLogs: () => set({ logs: [] }),
}));
