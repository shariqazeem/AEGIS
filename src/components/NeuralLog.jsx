import React, { useEffect, useRef } from 'react';
import { useSystemStore } from '../store/useSystemStore';

// Log level colors and icons
const levelConfig = {
    CRITICAL: { color: 'text-neon-red', bg: 'bg-neon-red/10', icon: '⚠' },
    ERROR: { color: 'text-neon-red', bg: 'bg-neon-red/5', icon: '✖' },
    WARN: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: '!' },
    SUCCESS: { color: 'text-neon-green', bg: 'bg-neon-green/10', icon: '✓' },
    INFO: { color: 'text-neon-blue', bg: 'bg-transparent', icon: 'ℹ' },
    DEBUG: { color: 'text-slate-500', bg: 'bg-transparent', icon: '•' },
};

// Type badge colors
const typeColors = {
    THREAT: 'text-neon-red bg-neon-red/20 border-neon-red/30',
    SCAN: 'text-neon-green bg-neon-green/20 border-neon-green/30',
    PARALLAX: 'text-neon-purple bg-neon-purple/20 border-neon-purple/30',
    AEGIS: 'text-neon-blue bg-neon-blue/20 border-neon-blue/30',
    CAMERA: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
    LLM: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    VISION: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
    API: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
    ACTION: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    TREND: 'text-pink-400 bg-pink-500/20 border-pink-500/30',
    SUMMARY: 'text-violet-400 bg-violet-500/20 border-violet-500/30',
    CLUSTER: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    CAPTURE: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    CONFIG: 'text-lime-400 bg-lime-500/20 border-lime-500/30',
};

const NeuralLog = () => {
    const logs = useSystemStore((state) => state.logs);
    const systemInfo = useSystemStore((state) => state.systemInfo);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getTime = (log) => {
        if (log.time) return log.time;
        if (log.timestamp) {
            return log.timestamp.split('T')[1]?.split('.')[0] || '';
        }
        return '';
    };

    const getLevelConfig = (level) => {
        return levelConfig[level] || levelConfig.INFO;
    };

    const getTypeColor = (type) => {
        return typeColors[type] || 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    };

    // Filter out DEBUG logs for cleaner display
    const visibleLogs = logs.filter(log => log.level !== 'DEBUG');

    return (
        <div className="flex flex-col h-full bg-obsidian/50 backdrop-blur-sm">
            {/* Header with stats */}
            <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-xs font-bold text-slate-400 tracking-widest uppercase font-mono">
                        NEURAL LOG
                    </div>
                    <div className="flex gap-4 text-xs font-mono text-slate-500">
                        <span>SCANS: <span className="text-neon-blue font-bold">{systemInfo.scanCount || 0}</span></span>
                        <span>THREATS: <span className={systemInfo.threatCount > 0 ? 'text-neon-red font-bold animate-pulse' : 'text-slate-500'}>{systemInfo.threatCount || 0}</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${systemInfo.parallaxConnected ? 'bg-neon-green shadow-[0_0_8px_#0aff68] animate-pulse' : 'bg-slate-600'}`} />
                    <span className="text-xs font-mono text-slate-500">
                        {systemInfo.parallaxConnected ? 'LIVE' : 'OFFLINE'}
                    </span>
                </div>
            </div>

            {/* Log entries - LARGER and more readable */}
            <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2 scrollbar-hide relative"
            >
                {visibleLogs.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-50">
                        <div className="text-4xl mb-2 font-bold tracking-widest text-white/10">AEGIS</div>
                        <div className="text-sm tracking-wider">WAITING FOR NEURAL STREAM...</div>
                        <div className="text-xs mt-4 font-mono bg-white/5 px-3 py-2 rounded">
                            python backend/vision_sentinel.py
                        </div>
                    </div>
                )}

                {visibleLogs.map((log, i) => {
                    const config = getLevelConfig(log.level);
                    const typeColor = getTypeColor(log.type);
                    const isThreat = log.level === 'CRITICAL' || log.message?.includes('THREAT');

                    return (
                        <div
                            key={i}
                            className={`
                                flex items-start gap-3 py-2 px-3 rounded border border-transparent transition-all duration-200
                                ${isThreat ? 'bg-neon-red/10 border-neon-red/30 shadow-[0_0_15px_rgba(255,0,60,0.15)]' : 'hover:bg-white/5'}
                            `}
                        >
                            {/* Timestamp */}
                            <span className="text-slate-500 shrink-0 w-[60px] font-mono text-xs">
                                {getTime(log)}
                            </span>

                            {/* Type badge */}
                            {log.type && log.type !== 'SYSTEM' && (
                                <span className={`shrink-0 px-2 py-0.5 rounded border text-xs font-bold tracking-wider ${typeColor}`}>
                                    {log.type}
                                </span>
                            )}

                            {/* Message */}
                            <span className={`flex-1 ${config.color} break-words leading-relaxed text-sm`}>
                                {isThreat && <span className="mr-2 animate-pulse text-neon-red">⚠</span>}
                                {log.message}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Footer with last description */}
            {systemInfo.lastDescription && (
                <div className="px-4 py-2 bg-black/60 border-t border-white/10 text-xs font-mono truncate flex items-center gap-2">
                    <span className="text-neon-blue shrink-0 font-bold">LAST:</span>
                    <span className="text-slate-400 truncate">{systemInfo.lastDescription}</span>
                </div>
            )}
        </div>
    );
};

export default NeuralLog;
