import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AIPipeline = () => {
    const [pipeline, setPipeline] = useState(null);

    useEffect(() => {
        const fetchPipeline = async () => {
            try {
                const response = await fetch('http://localhost:8001/metrics');
                if (response.ok) {
                    const data = await response.json();
                    setPipeline(data.ai_pipeline);
                }
            } catch (e) {
                console.warn('Pipeline status not available');
            }
        };

        fetchPipeline();
        const interval = setInterval(fetchPipeline, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!pipeline) return null;

    return (
        <div className="glass-panel p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-mono text-neon-purple tracking-wider flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    AI_PIPELINE
                </h3>
                <span className={clsx(
                    "text-[9px] font-mono px-2 py-0.5 rounded",
                    pipeline.all_stages_active
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-amber-500/20 text-amber-400"
                )}>
                    {pipeline.all_stages_active ? "ALL ACTIVE" : "PARTIAL"}
                </span>
            </div>

            <div className="space-y-2">
                {pipeline.stages.map((stage, i) => (
                    <div
                        key={stage.name}
                        className={clsx(
                            "flex items-center justify-between p-2 rounded-lg border transition-all",
                            stage.status === 'active'
                                ? "bg-neon-purple/10 border-neon-purple/30"
                                : "bg-white/5 border-white/10"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div className={clsx(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                                stage.status === 'active'
                                    ? "bg-neon-purple text-black"
                                    : "bg-slate-700 text-slate-400"
                            )}>
                                {i + 1}
                            </div>
                            <span className="text-xs font-mono text-white">{stage.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono text-neon-purple">{stage.powered_by}</span>
                            {stage.status === 'active' && (
                                <CheckCircleIcon className="w-3 h-3 text-neon-green" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-center text-[9px] font-mono text-slate-500">
                Every scan uses Parallax AI for intelligent decisions
            </div>
        </div>
    );
};

export default AIPipeline;
