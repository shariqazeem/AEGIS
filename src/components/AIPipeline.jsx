import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { SparklesIcon, CheckCircleIcon, BoltIcon, CpuChipIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const AIPipeline = () => {
    const [pipeline, setPipeline] = useState(null);
    const [pulseStage, setPulseStage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        const fetchPipeline = async () => {
            try {
                const response = await fetch('http://localhost:8001/metrics');
                if (response.ok) {
                    const data = await response.json();
                    setPipeline(data.ai_pipeline);
                }
            } catch (e) {
                // Use fallback data for demo
                setPipeline({
                    stages: [
                        { name: "Scene Interpretation", status: "active", powered_by: "Parallax", description: "CV → language" },
                        { name: "Threat Detection", status: "active", powered_by: "Parallax AI", description: "AI threat analysis" },
                        { name: "Action Planning", status: "active", powered_by: "Parallax", description: "Response planning" },
                        { name: "Trend Analysis", status: "active", powered_by: "Parallax", description: "Pattern detection" },
                        { name: "Log Summary", status: "active", powered_by: "Parallax", description: "Report generation" },
                        { name: "Behavior Analysis", status: "active", powered_by: "Parallax", description: "Activity patterns" },
                        { name: "Risk Scoring", status: "active", powered_by: "Parallax", description: "Risk assessment" }
                    ],
                    all_stages_active: true,
                    total_stages: 7,
                    parallax_calls_per_cycle: "Up to 7 AI calls per scan!"
                });
            }
        };

        fetchPipeline();
        const interval = setInterval(fetchPipeline, 3000);

        // Animate through stages
        const pulseInterval = setInterval(() => {
            setPulseStage(prev => (prev + 1) % 7);
        }, 600);

        return () => {
            clearInterval(interval);
            clearInterval(pulseInterval);
        };
    }, []);

    if (!pipeline) return null;

    // Stage colors for visual variety
    const stageColors = [
        { bg: 'from-purple-500 to-indigo-500', glow: 'shadow-purple-500/50' },
        { bg: 'from-red-500 to-orange-500', glow: 'shadow-red-500/50' },
        { bg: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/50' },
        { bg: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/50' },
        { bg: 'from-yellow-500 to-amber-500', glow: 'shadow-yellow-500/50' },
        { bg: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/50' },
        { bg: 'from-indigo-500 to-violet-500', glow: 'shadow-indigo-500/50' }
    ];

    return (
        <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            
            {/* Header */}
            <div className="relative flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono text-neon-purple tracking-wider flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 animate-pulse" />
                    PARALLAX_AI_PIPELINE
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50 animate-pulse">
                        7-STAGE AI
                    </span>
                    <span className={clsx(
                        "text-[9px] font-mono px-2 py-0.5 rounded transition-all",
                        pipeline.all_stages_active
                            ? "bg-neon-green/20 text-neon-green shadow-[0_0_10px_rgba(10,255,104,0.3)]"
                            : "bg-amber-500/20 text-amber-400"
                    )}>
                        {pipeline.all_stages_active ? "✓ ACTIVE" : "PARTIAL"}
                    </span>
                </div>
            </div>

            {/* Competition highlight - WOW factor */}
            <div className="relative mb-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-shimmer" />
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BoltIcon className="w-5 h-5 text-yellow-400 animate-bounce" />
                        <span className="text-sm font-mono text-white font-bold">
                            {pipeline.parallax_calls_per_cycle}
                        </span>
                    </div>
                    <span className="text-[10px] font-mono text-neon-green">$0 CLOUD COSTS</span>
                </div>
            </div>

            {/* Pipeline visualization - Flow diagram */}
            <div className="relative space-y-2">
                {pipeline.stages.map((stage, i) => (
                    <div key={stage.name} className="relative">
                        {/* Connection line */}
                        {i < pipeline.stages.length - 1 && (
                            <div className="absolute left-[14px] top-[28px] w-0.5 h-6 bg-gradient-to-b from-white/20 to-transparent z-0" />
                        )}
                        
                        <div
                            className={clsx(
                                "relative flex items-center gap-3 p-2 rounded-lg border transition-all duration-300",
                                stage.status === 'active'
                                    ? "bg-gradient-to-r from-white/5 to-transparent border-white/10"
                                    : "bg-white/5 border-white/5",
                                pulseStage === i && `ring-2 ring-purple-500/50 ${stageColors[i].glow} shadow-lg scale-[1.02]`
                            )}
                        >
                            {/* Stage number badge */}
                            <div className={clsx(
                                "relative w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 shrink-0",
                                stage.status === 'active'
                                    ? `bg-gradient-to-br ${stageColors[i].bg} text-white shadow-lg`
                                    : "bg-slate-700 text-slate-400",
                                pulseStage === i && "scale-110 animate-pulse"
                            )}>
                                {i + 1}
                                {pulseStage === i && (
                                    <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                                )}
                            </div>

                            {/* Stage info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono text-white font-medium truncate">{stage.name}</span>
                                    {pulseStage === i && (
                                        <ArrowRightIcon className="w-3 h-3 text-neon-blue animate-pulse" />
                                    )}
                                </div>
                                <span className="text-[9px] font-mono text-slate-500">{stage.description}</span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[8px] font-mono text-neon-purple">{stage.powered_by}</span>
                                {stage.status === 'active' && (
                                    <CheckCircleIcon className={clsx(
                                        "w-4 h-4 text-neon-green transition-transform",
                                        pulseStage === i && "scale-125"
                                    )} />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CpuChipIcon className="w-4 h-4 text-indigo-400" />
                    <span className="text-[9px] font-mono text-slate-500">Local Parallax Inference</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#0aff68]" />
                    <span className="text-[9px] font-mono text-neon-green font-bold">100% SOVEREIGN</span>
                </div>
            </div>
        </div>
    );
};

export default AIPipeline;
