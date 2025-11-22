import React, { useEffect, useRef } from 'react';
import { useSystemStore } from '../store/useSystemStore';

// Log level colors and icons
const levelConfig = {
    CRITICAL: { color: 'text-red-400', bg: 'bg-red-500/20', icon: '!' },
    ERROR: { color: 'text-red-400', bg: 'bg-red-500/10', icon: '!' },
    WARN: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: '!' },
    SUCCESS: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: '>' },
    INFO: { color: 'text-blue-400', bg: 'bg-transparent', icon: '>' },
    DEBUG: { color: 'text-slate-500', bg: 'bg-transparent', icon: '.' },
};

// Type badge colors
const typeColors = {
    THREAT: 'text-red-500 bg-red-500/20',
    SCAN: 'text-emerald-400 bg-emerald-500/20',
    PARALLAX: 'text-purple-400 bg-purple-500/20',
    AEGIS: 'text-cyan-400 bg-cyan-500/20',
    CAMERA: 'text-blue-400 bg-blue-500/20',
    LLM: 'text-orange-400 bg-orange-500/20',
    VISION: 'text-indigo-400 bg-indigo-500/20',
    API: 'text-teal-400 bg-teal-500/20',
    ACTION: 'text-amber-400 bg-amber-500/20',
    TREND: 'text-pink-400 bg-pink-500/20',
    SUMMARY: 'text-violet-400 bg-violet-500/20',
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
        return typeColors[type] || 'text-slate-400 bg-slate-500/20';
    };

    // Filter out DEBUG logs for cleaner display (optional)
    const visibleLogs = logs.filter(log => log.level !== 'DEBUG');

    return (
        <div className="flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            {/* Header with stats */}
            <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                        Neural Inference Log
                    </span>
                    <div className="flex items-center gap-2">
                        {/* Connection indicator */}
                        <div className={`w-2 h-2 rounded-full ${systemInfo.parallaxConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                        <span className="text-[9px] text-slate-500">
                            {systemInfo.parallaxConnected ? 'LIVE' : 'OFFLINE'}
                        </span>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex gap-4 text-[9px] text-slate-500">
                    <span>Scans: <span className="text-slate-300">{systemInfo.scanCount || 0}</span></span>
                    <span>Threats: <span className={systemInfo.threatCount > 0 ? 'text-red-400' : 'text-slate-300'}>{systemInfo.threatCount || 0}</span></span>
                    {systemInfo.model && (
                        <span className="text-purple-400 truncate max-w-[100px]" title={systemInfo.model}>
                            {systemInfo.model.split('/').pop()}
                        </span>
                    )}
                </div>
            </div>

            {/* Log entries */}
            <div
                ref={scrollRef}
                className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1 scrollbar-hide"
            >
                {visibleLogs.length === 0 && (
                    <div className="text-slate-600 italic text-center py-8">
                        <div className="text-2xl mb-2 opacity-50">AEGIS</div>
                        <div>Waiting for neural stream...</div>
                        <div className="text-[10px] mt-2 text-slate-700">
                            Start backend: python backend/vision_sentinel.py
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
                                flex items-start gap-2 py-1 px-2 rounded transition-all duration-200
                                ${config.bg}
                                ${isThreat ? 'border-l-2 border-red-500 animate-pulse' : ''}
                                hover:bg-slate-800/50
                            `}
                        >
                            {/* Timestamp */}
                            <span className="text-slate-600 shrink-0 w-[52px]">
                                {getTime(log)}
                            </span>

                            {/* Type badge */}
                            {log.type && log.type !== 'SYSTEM' && (
                                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium ${typeColor}`}>
                                    {log.type}
                                </span>
                            )}

                            {/* Message */}
                            <span className={`flex-1 ${config.color} break-words`}>
                                {log.message}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Footer with last description */}
            {systemInfo.lastDescription && (
                <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800 text-[10px] text-slate-500 truncate">
                    <span className="text-slate-600">Last: </span>
                    {systemInfo.lastDescription.slice(0, 80)}...
                </div>
            )}
        </div>
    );
};

export default NeuralLog;
