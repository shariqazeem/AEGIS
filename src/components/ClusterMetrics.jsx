import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { CpuChipIcon, ServerIcon, ClockIcon, BoltIcon } from '@heroicons/react/24/outline';

const ClusterMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('http://localhost:8001/metrics');
                if (response.ok) {
                    const data = await response.json();
                    setMetrics(data);
                }
            } catch (e) {
                console.warn('Metrics not available');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading || !metrics) {
        return (
            <div className="text-center text-slate-500 font-mono text-sm py-8">
                Connecting to cluster...
            </div>
        );
    }

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4">
            {/* Cluster Node Grid - The 7 Mac Minis! */}
            <div className="glass-panel p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-mono text-neon-purple tracking-wider flex items-center gap-2">
                        <ServerIcon className="w-4 h-4" />
                        PARALLAX_CLUSTER
                    </h3>
                    <span className="text-[9px] font-mono text-slate-500">
                        {metrics.cluster.nodes}/{metrics.cluster.max_nodes} NODES
                    </span>
                </div>

                {/* Node Grid - Visual representation of 7 Mac minis */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {metrics.cluster.node_status.map((node, i) => (
                        <div
                            key={node.id}
                            className={clsx(
                                "aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all",
                                node.status === 'active'
                                    ? "bg-neon-green/20 border-neon-green/50 shadow-[0_0_10px_rgba(10,255,104,0.3)]"
                                    : node.status === 'available'
                                        ? "bg-white/5 border-white/10 hover:border-neon-blue/30"
                                        : "bg-slate-900 border-slate-800"
                            )}
                        >
                            <CpuChipIcon className={clsx(
                                "w-4 h-4",
                                node.status === 'active' ? "text-neon-green" : "text-slate-600"
                            )} />
                            <span className={clsx(
                                "text-[8px] font-mono mt-1",
                                node.status === 'active' ? "text-neon-green" : "text-slate-600"
                            )}>
                                {i}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Active Node Info */}
                <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                        <span className="text-xs font-mono text-white">NODE-0 ACTIVE</span>
                    </div>
                    <div className="text-[10px] font-mono text-neon-purple truncate">
                        {metrics.cluster.node_status[0]?.model || 'No model loaded'}
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3">
                {/* Inference Stats */}
                <div className="glass-panel p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] font-mono text-slate-500 mb-2 flex items-center gap-1">
                        <BoltIcon className="w-3 h-3" />
                        INFERENCE
                    </div>
                    <div className="text-2xl font-bold font-mono text-neon-blue">
                        {metrics.performance.avg_inference_ms.toFixed(0)}
                        <span className="text-xs text-slate-500 ml-1">ms</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                        AVG LATENCY
                    </div>
                </div>

                {/* Total Inferences */}
                <div className="glass-panel p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] font-mono text-slate-500 mb-2 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        TOTAL
                    </div>
                    <div className="text-2xl font-bold font-mono text-neon-green">
                        {metrics.performance.total_inferences}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                        INFERENCES
                    </div>
                </div>
            </div>

            {/* Resource Usage */}
            <div className="glass-panel p-3 rounded-xl border border-white/5">
                <div className="text-[9px] font-mono text-slate-500 mb-3">RESOURCES</div>

                {/* GPU Usage */}
                <div className="mb-3">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-slate-400">GPU</span>
                        <span className="text-neon-purple">{metrics.resources.gpu_utilization}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-500"
                            style={{ width: `${metrics.resources.gpu_utilization}%` }}
                        />
                    </div>
                </div>

                {/* Memory Usage */}
                <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-slate-400">MEMORY</span>
                        <span className="text-neon-blue">{metrics.resources.memory_used_mb} MB</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-neon-blue to-neon-green transition-all duration-500"
                            style={{ width: `${Math.min(100, metrics.resources.memory_used_mb / 40)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Uptime */}
            <div className="text-center text-[10px] font-mono text-slate-500">
                UPTIME: <span className="text-neon-green">{formatUptime(metrics.resources.uptime_seconds)}</span>
            </div>
        </div>
    );
};

export default ClusterMetrics;
