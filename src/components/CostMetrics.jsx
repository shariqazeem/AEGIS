import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { BanknotesIcon, BoltIcon, ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const CostMetrics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8001/cost_metrics');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch cost metrics:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) {
        return (
            <div className="bg-obsidian/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!stats || !stats.success) {
        return null;
    }

    return (
        <div className="bg-obsidian/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <BanknotesIcon className="w-6 h-6 text-green-400" />
                    <h2 className="text-xl font-bold text-white">Cost Savings</h2>
                </div>
                <span className="text-xs text-green-400/70 font-mono">🏆 ZERO CLOUD COSTS</span>
            </div>

            {/* Cost Comparison */}
            <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                    {/* Cloud Cost */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Cloud Alternative</p>
                        <p className="text-2xl font-bold text-red-400">${stats.cloud_cost_monthly.toFixed(2)}/mo</p>
                        <p className="text-xs text-slate-500 mt-1">AWS Rekognition</p>
                    </div>

                    {/* Parallax Cost */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Parallax Local</p>
                        <p className="text-2xl font-bold text-green-400">$0.00/mo</p>
                        <p className="text-xs text-slate-500 mt-1">100% Free</p>
                    </div>
                </div>

                {/* Savings Badge */}
                <div className="mt-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-green-400">Monthly Savings</span>
                        <span className="text-xl font-bold text-green-400">
                            ${stats.cloud_cost_monthly.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-400">Annual Savings</span>
                        <span className="text-lg font-bold text-green-400">
                            ${(stats.cloud_cost_monthly * 12).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/30 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <BoltIcon className="w-4 h-4 text-yellow-400" />
                        <p className="text-xs text-slate-400">Avg Inference</p>
                    </div>
                    <p className="text-xl font-bold text-white">{stats.avg_inference_ms}ms</p>
                </div>

                <div className="bg-black/30 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <ChartBarIcon className="w-4 h-4 text-blue-400" />
                        <p className="text-xs text-slate-400">Events Analyzed</p>
                    </div>
                    <p className="text-xl font-bold text-white">{stats.total_events.toLocaleString()}</p>
                </div>
            </div>

            {/* Privacy Score */}
            <div className="flex items-center justify-between p-3 bg-black/30 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-slate-300">Privacy Score</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-400">100%</span>
                    <span className="text-xs text-green-400/70">LOCAL ONLY</span>
                </div>
            </div>

            {/* Parallax Branding */}
            <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                    Powered by <span className="text-neon-blue font-semibold">Parallax Distributed Inference</span>
                </p>
            </div>
        </div>
    );
};

export default CostMetrics;
