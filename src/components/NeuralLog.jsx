import React, { useEffect, useRef } from 'react';
import { useSystemStore } from '../store/useSystemStore';

const NeuralLog = () => {
    const logs = useSystemStore((state) => state.logs);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Neural Inference Log</span>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-hide"
            >
                {logs.length === 0 && (
                    <div className="text-slate-600 italic">Waiting for neural stream...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 text-slate-300 opacity-80 hover:opacity-100 transition-opacity">
                        <span className="text-slate-600 shrink-0">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                        <span className={log.message.includes("THREAT") ? "text-red-400 font-bold" : "text-emerald-400/80"}>
                            {log.message}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NeuralLog;
