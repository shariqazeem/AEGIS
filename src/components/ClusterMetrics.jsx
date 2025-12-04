import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

// ============================================================================
// ClusterMetrics Component
// ============================================================================
export const ClusterMetrics = () => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('http://localhost:8001/metrics');
                if (response.ok) setMetrics(await response.json());
            } catch (e) {}
        };
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!metrics) return (
        <div className="glass-panel p-4 rounded-xl border border-white/5 text-center text-slate-500">
            Connecting to Parallax...
        </div>
    );

    const formatUptime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono text-indigo-400 tracking-wider">PARALLAX CLUSTER</h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon-green/20 text-neon-green border border-neon-green/30">
                    {metrics.cluster.nodes}/{metrics.cluster.max_nodes} NODES
                </span>
            </div>

            {/* Node status */}
            <div className="flex gap-1">
                {metrics.cluster.node_status.map((node, i) => (
                    <div
                        key={node.id}
                        className={clsx(
                            "flex-1 h-6 rounded flex items-center justify-center text-[8px] font-mono border transition-all",
                            node.status === 'active'
                                ? "bg-neon-green/20 border-neon-green/30 text-neon-green"
                                : node.status === 'available'
                                    ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                                    : "bg-slate-700/50 border-slate-600 text-slate-500"
                        )}
                        title={node.model || 'Available'}
                    >
                        {i}
                    </div>
                ))}
            </div>

            {/* Performance metrics */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                    <div className="text-[9px] text-slate-500 font-mono">AVG LATENCY</div>
                    <div className="text-xl font-bold text-indigo-400 font-mono">{metrics.performance.avg_inference_ms.toFixed(0)}ms</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                    <div className="text-[9px] text-slate-500 font-mono">INFERENCES</div>
                    <div className="text-xl font-bold text-neon-green font-mono">{metrics.performance.total_inferences}</div>
                </div>
            </div>

            {/* Resource bars */}
            <div className="space-y-2">
                <div>
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-1">
                        <span>GPU</span>
                        <span>{metrics.resources.gpu_utilization}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${metrics.resources.gpu_utilization}%` }} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-1">
                        <span>MEMORY</span>
                        <span>{metrics.resources.memory_used_mb} MB</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${Math.min(100, metrics.resources.memory_used_mb / 20)}%` }} />
                    </div>
                </div>
            </div>

            <div className="text-center text-[9px] text-slate-500 font-mono">
                UPTIME: <span className="text-neon-green">{formatUptime(metrics.resources.uptime_seconds)}</span>
            </div>
        </div>
    );
};

// ============================================================================
// QueryInterface Component
// ============================================================================
export const QueryInterface = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);

    // Demo-optimized questions that showcase AI capabilities
    const quickQuestions = [
        "Was anyone home?",
        "Any threats detected?",
        "Give me a status report",
        "Is it safe right now?"
    ];

    const handleAsk = async (q) => {
        const questionToAsk = q || question;
        if (!questionToAsk.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8001/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: questionToAsk })
            });
            setAnswer(await res.json());
        } catch (err) {
            setAnswer({ success: false, error: err.message });
        }
        setLoading(false);
    };

    return (
        <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

            <div className="relative flex items-center gap-2 mb-4">
                <span className="text-lg animate-pulse">🤖</span>
                <h3 className="text-sm font-mono text-neon-purple tracking-wider">ASK AEGIS AI</h3>
                <span className="ml-auto text-[9px] text-yellow-400 font-mono px-2 py-0.5 bg-yellow-400/10 rounded border border-yellow-400/30 animate-pulse">🏆 DEMO FEATURE</span>
            </div>

            <div className="relative flex flex-wrap gap-1.5 mb-3">
                {quickQuestions.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => { setQuestion(q); handleAsk(q); }}
                        className="px-2.5 py-1.5 text-[10px] bg-neon-purple/10 border border-neon-purple/30 rounded-lg hover:bg-neon-purple/30 hover:scale-105 text-neon-purple transition-all duration-200 font-mono"
                    >{q}</button>
                ))}
            </div>

            <div className="relative flex gap-2 mb-3">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder="Ask anything about security..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                />
                <button
                    onClick={() => handleAsk()}
                    disabled={loading}
                    className={clsx(
                        "px-4 py-2 rounded-lg font-mono text-sm transition-all",
                        loading
                            ? "bg-slate-700 text-slate-500"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                    )}
                >{loading ? "⏳" : "Ask"}</button>
            </div>

            {answer && (
                <div className={clsx(
                    "relative p-3 rounded-lg border text-sm transition-all duration-300",
                    answer.success
                        ? "bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-neon-purple/30 shadow-lg shadow-purple-500/10"
                        : "bg-red-500/5 border-red-500/30"
                )}>
                    <p className="text-white leading-relaxed">{answer.success ? answer.answer : answer.error}</p>
                    {answer.success && (
                        <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap items-center gap-3 text-[10px] font-mono">
                            <span className="text-neon-green">✓ {(answer.confidence * 100).toFixed(0)}% confidence</span>
                            <span className="text-neon-blue">⚡ {answer.inference_time_ms}ms</span>
                            <span className="text-neon-purple">{answer.powered_by}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================================================
// DailySummary Component
// ============================================================================
export const DailySummary = () => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('http://localhost:8001/summary');
                setSummary(await res.json());
            } catch (err) {
                setSummary({ success: false });
            }
        };
        fetchSummary();
        const interval = setInterval(fetchSummary, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!summary || !summary.success) return null;

    return (
        <div className="glass-panel p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📋</span>
                <h3 className="text-sm font-mono text-neon-blue tracking-wider">DAILY SUMMARY</h3>
            </div>
            
            <p className="text-slate-300 text-sm mb-3">{summary.summary}</p>
            
            {summary.stats && (
                <div className="flex gap-4 text-xs font-mono">
                    <span className="text-slate-500">Events: <span className="text-white">{summary.stats.total_events}</span></span>
                    <span className="text-slate-500">Threats: <span className={summary.stats.threats_detected > 0 ? "text-neon-red" : "text-neon-green"}>{summary.stats.threats_detected}</span></span>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// CostMetrics Component
// ============================================================================
export const CostMetrics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:8001/cost_metrics');
                setStats(await res.json());
            } catch (err) {}
        };
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!stats || !stats.success) return null;

    return (
        <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden">
            {/* Success gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

            <div className="relative flex items-center gap-2 mb-4">
                <span className="text-lg">💰</span>
                <h3 className="text-sm font-mono text-green-400 tracking-wider">COST ANALYSIS</h3>
                <span className="ml-auto text-[9px] text-neon-green font-mono px-2 py-0.5 bg-green-500/10 rounded border border-green-500/30 animate-pulse">$0 CLOUD</span>
            </div>

            <div className="relative grid grid-cols-2 gap-2 mb-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-red-500/20 rotate-45 transform translate-x-4 -translate-y-4" />
                    <p className="text-[9px] text-slate-400 mb-1 font-mono">☁️ AWS Rekognition</p>
                    <p className="text-xl font-bold text-red-400 font-mono">${stats.cloud_cost_monthly.toFixed(0)}<span className="text-sm">/mo</span></p>
                    <p className="text-[8px] text-red-400/60 mt-1">+ Data Transfer Fees</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-green-500/20 rotate-45 transform translate-x-4 -translate-y-4" />
                    <p className="text-[9px] text-slate-400 mb-1 font-mono">🏠 Parallax Local</p>
                    <p className="text-xl font-bold text-green-400 font-mono">$0<span className="text-sm">/mo</span></p>
                    <p className="text-[8px] text-green-400/60 mt-1">Forever Free</p>
                </div>
            </div>

            {/* Big savings highlight */}
            <div className="relative p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(10,255,104,0.1),transparent)] animate-shimmer" />
                <div className="relative flex justify-between items-center">
                    <div>
                        <span className="text-xs text-green-300/80 font-mono">ANNUAL SAVINGS</span>
                        <p className="text-2xl font-bold text-green-400 font-mono">${stats.savings_annual.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-mono block">vs AWS</span>
                        <span className="text-lg font-bold text-green-400">🎉</span>
                    </div>
                </div>
            </div>

            <div className="relative mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-slate-500">Privacy:</span>
                    <span className="text-neon-green font-bold">{stats.privacy_score}%</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                    <span className="text-slate-500">Latency:</span>
                    <span className="text-neon-blue font-bold">{stats.avg_inference_ms?.toFixed(0) || '~500'}ms</span>
                </div>
            </div>
        </div>
    );
};

export default ClusterMetrics;
