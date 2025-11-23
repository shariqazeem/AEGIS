import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { SparklesIcon, CheckCircleIcon, BoltIcon, CpuChipIcon } from '@heroicons/react/24/outline';

const AIPipeline = () => {
    const [pipeline, setPipeline] = useState(null);
    const [pulseStage, setPulseStage] = useState(0);

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

        // Animate through stages
        const pulseInterval = setInterval(() => {
            setPulseStage(prev => (prev + 1) % 7);
        }, 800);

        return () => {
            clearInterval(interval);
            clearInterval(pulseInterval);
        };
    }, []);

    if (!pipeline) return null;

    // Stage colors for visual variety
    const stageColors = [
        'from-purple-500 to-indigo-500',
        'from-red-500 to-orange-500',
        'from-green-500 to-emerald-500',
        'from-blue-500 to-cyan-500',
        'from-yellow-500 to-amber-500',
        'from-pink-500 to-rose-500',
        'from-indigo-500 to-violet-500'
    ];

    return (
        <div className="glass-panel p-4 rounded-xl border border-white/5">
            {/* Header with 7-stage badge */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-mono text-neon-purple tracking-wider flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    PARALLAX_AI_PIPELINE
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50">
                        7-STAGE AI
                    </span>
                    <span className={clsx(
                        "text-[9px] font-mono px-2 py-0.5 rounded",
                        pipeline.all_stages_active
                            ? "bg-neon-green/20 text-neon-green"
                            : "bg-amber-500/20 text-amber-400"
                    )}>
                        {pipeline.all_stages_active ? "ACTIVE" : "PARTIAL"}
                    </span>
                </div>
            </div>

            {/* Competition highlight */}
            <div className="mb-3 p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2">
                    <BoltIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-300">
                        {pipeline.parallax_calls_per_cycle || 'Up to 7 AI calls per scan!'}
                    </span>
                </div>
            </div>

            {/* Pipeline stages - compact view for 7 stages */}
            <div className="space-y-1.5">
                {pipeline.stages.map((stage, i) => (
                    <div
                        key={stage.name}
                        className={clsx(
                            "flex items-center justify-between p-1.5 rounded-lg border transition-all duration-300",
                            stage.status === 'active'
                                ? "bg-neon-purple/10 border-neon-purple/30"
                                : "bg-white/5 border-white/10",
                            pulseStage === i && "ring-1 ring-neon-purple/50 shadow-lg shadow-purple-500/20"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div className={clsx(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                                stage.status === 'active'
                                    ? `bg-gradient-to-r ${stageColors[i]} text-white`
                                    : "bg-slate-700 text-slate-400",
                                pulseStage === i && "scale-110"
                            )}>
                                {i + 1}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-mono text-white leading-tight">{stage.name}</span>
                                {stage.description && (
                                    <span className="text-[8px] font-mono text-slate-500">{stage.description}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[8px] font-mono text-neon-purple">{stage.powered_by}</span>
                            {stage.status === 'active' && (
                                <CheckCircleIcon className={clsx(
                                    "w-3 h-3 text-neon-green transition-transform",
                                    pulseStage === i && "scale-125"
                                )} />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer with cluster info */}
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <CpuChipIcon className="w-3 h-3 text-indigo-400" />
                    <span className="text-[8px] font-mono text-slate-500">Local Parallax Inference</span>
                </div>
                <span className="text-[8px] font-mono text-neon-green animate-pulse">
                    100% SOVEREIGN AI
                </span>
            </div>
        </div>
    );
};

export default AIPipeline;
