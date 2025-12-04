import React, { useEffect, useRef } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { clsx } from 'clsx';

const levelConfig = {
    CRITICAL: { color: 'text-neon-red', icon: '⚠️' },
    ERROR: { color: 'text-red-400', icon: '✖' },
    WARN: { color: 'text-amber-400', icon: '⚡' },
    SUCCESS: { color: 'text-neon-green', icon: '✓' },
    INFO: { color: 'text-neon-blue', icon: 'ℹ' },
    DEBUG: { color: 'text-slate-500', icon: '•' },
};

const typeColors = {
    THREAT: 'text-neon-red bg-neon-red/20 border-neon-red/30',
    SCAN: 'text-neon-green bg-neon-green/20 border-neon-green/30',
    PARALLAX: 'text-neon-purple bg-neon-purple/20 border-neon-purple/30',
    AEGIS: 'text-neon-blue bg-neon-blue/20 border-neon-blue/30',
    CAMERA: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
    PIPELINE: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
    DEMO: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    VIDEO: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    API: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
};

const NeuralLog = () => {
    const logs = useSystemStore((state) => state.logs);
    const systemInfo = useSystemStore((state) => state.systemInfo);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const visibleLogs = logs.filter(log => log.level !== 'DEBUG').slice(-50);

    return (
        <div className="flex flex-col h-full bg-obsidian/50 backdrop-blur-sm">
            {/* Header */}
            <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase font-mono">
                        NEURAL LOG
                    </div>
                    <div className="flex gap-4 text-xs font-mono text-slate-500">
                        <span>SCANS: <span className="text-neon-blue font-bold">{systemInfo.scanCount || 0}</span></span>
                        <span>THREATS: <span className={clsx(
                            "font-bold",
                            systemInfo.threatCount > 0 ? 'text-neon-red animate-pulse' : 'text-neon-green'
                        )}>{systemInfo.threatCount || 0}</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className={clsx(
                        "w-2 h-2 rounded-full transition-all",
                        systemInfo.parallaxConnected 
                            ? 'bg-neon-green shadow-[0_0_10px_#0aff68] animate-pulse' 
                            : 'bg-slate-600'
                    )} />
                    <span className="text-xs font-mono text-slate-500">
                        {systemInfo.parallaxConnected ? 'LIVE' : 'OFFLINE'}
                    </span>
                </div>
            </div>

            {/* Log entries */}
            <div
                ref={scrollRef}
                className="flex-1 p-3 overflow-y-auto font-mono text-sm space-y-1.5 scrollbar-hide"
            >
                {visibleLogs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <div className="text-4xl mb-3 font-bold tracking-[0.3em] text-white/5">AEGIS</div>
                        <div className="text-sm tracking-wider animate-pulse">WAITING FOR NEURAL STREAM...</div>
                        <div className="text-xs mt-4 font-mono bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            python backend/vision_sentinel.py --test
                        </div>
                    </div>
                )}

                {visibleLogs.map((log, i) => {
                    const config = levelConfig[log.level] || levelConfig.INFO;
                    const typeColor = typeColors[log.type] || 'text-slate-400 bg-slate-500/20 border-slate-500/30';
                    const isThreat = log.level === 'CRITICAL';

                    return (
                        <div
                            key={i}
                            className={clsx(
                                "flex items-start gap-2 py-1.5 px-2 rounded border transition-all duration-200",
                                isThreat 
                                    ? 'bg-neon-red/10 border-neon-red/30 shadow-[0_0_15px_rgba(255,0,60,0.1)]' 
                                    : 'border-transparent hover:bg-white/5'
                            )}
                        >
                            <span className="text-slate-500 shrink-0 w-[55px] text-[10px]">
                                {log.time || ''}
                            </span>

                            {log.type && (
                                <span className={clsx(
                                    "shrink-0 px-1.5 py-0.5 rounded border text-[9px] font-bold tracking-wider",
                                    typeColor
                                )}>
                                    {log.type}
                                </span>
                            )}

                            <span className={clsx("flex-1 text-xs break-words leading-relaxed", config.color)}>
                                {isThreat && <span className="mr-1">{config.icon}</span>}
                                {log.message}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Footer with scene description */}
            {systemInfo.lastDescription && (
                <div className="px-4 py-3 bg-black/60 border-t border-white/10">
                    <div className="flex items-start gap-2">
                        <span className="text-neon-blue shrink-0 font-bold text-[10px] tracking-wider">AI:</span>
                        <span className="text-slate-300 text-xs leading-relaxed">{systemInfo.lastDescription}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NeuralLog;
