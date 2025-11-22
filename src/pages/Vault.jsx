import React, { useState, useEffect } from 'react';
import { TrashIcon, ShieldExclamationIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Vault = () => {
    const [threats, setThreats] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isPurging, setIsPurging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch threats from backend
    const fetchThreats = async () => {
        try {
            const response = await fetch('http://localhost:8001/threats?limit=50');
            if (response.ok) {
                const data = await response.json();
                setThreats(data.threats || []);
                setTotalCount(data.total_count || 0);
                setError(null);
            } else {
                setError('Failed to fetch threats');
            }
        } catch (e) {
            setError('Backend offline - start python backend/vision_sentinel.py');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchThreats();
        // Poll for updates every 5 seconds
        const interval = setInterval(fetchThreats, 5000);
        return () => clearInterval(interval);
    }, []);

    const handlePurge = async () => {
        setIsPurging(true);
        try {
            const response = await fetch('http://localhost:8001/purge', { method: 'POST' });
            if (response.ok) {
                // Wait for animation then refresh
                setTimeout(() => {
                    fetchThreats();
                    setIsPurging(false);
                }, 2000);
            }
        } catch (e) {
            setIsPurging(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CRITICAL': return 'text-neon-red bg-neon-red/20 border-neon-red/30';
            case 'WARNING': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
            default: return 'text-neon-green bg-neon-green/20 border-neon-green/30';
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto h-full overflow-auto p-4">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight font-mono">PRIVACY VAULT</h1>
                    <p className="text-slate-400 mt-1 text-sm">Local-only storage audit. No data leaves this device.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchThreats}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <ArrowPathIcon className="w-4 h-4 text-slate-400" />
                    </button>
                    <div className="flex items-center gap-2 text-neon-green bg-neon-green/10 px-3 py-1.5 rounded-full border border-neon-green/20">
                        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                        <span className="text-[10px] font-bold tracking-wider font-mono">ENCRYPTED</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500 font-mono tracking-wider">TOTAL EVENTS</div>
                    <div className="text-2xl font-bold text-white font-mono">{totalCount}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500 font-mono tracking-wider">STORED</div>
                    <div className="text-2xl font-bold text-neon-blue font-mono">{threats.length}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500 font-mono tracking-wider">CRITICAL</div>
                    <div className="text-2xl font-bold text-neon-red font-mono">
                        {threats.filter(t => t.status === 'CRITICAL').length}
                    </div>
                </div>
            </div>

            {/* Event History Table */}
            <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-sm font-mono text-neon-blue tracking-wider">EVENT_HISTORY</h3>
                    <span className="text-[10px] text-slate-500 font-mono">LAST 50 EVENTS</span>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-sm">
                        <ArrowPathIcon className="w-6 h-6 mx-auto animate-spin mb-2" />
                        Loading...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-sm">
                        <ShieldExclamationIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        {error}
                    </div>
                ) : threats.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-sm">
                        <ShieldExclamationIcon className="w-8 h-8 mx-auto mb-2 text-neon-green/50" />
                        No threats detected. System secure.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500 tracking-wider">EVENT_ID</th>
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500 tracking-wider">TIME</th>
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500 tracking-wider">TYPE</th>
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500 tracking-wider">CONFIDENCE</th>
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500 tracking-wider">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {threats.slice().reverse().map((threat) => (
                                    <tr key={threat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-mono text-slate-300">{threat.id}</td>
                                        <td className="px-4 py-3 font-mono text-slate-400">{threat.time}</td>
                                        <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate" title={threat.type}>
                                            {threat.type}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-slate-400">
                                            {(threat.confidence * 100).toFixed(0)}%
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={clsx(
                                                "px-2 py-1 rounded text-[10px] font-bold tracking-wider border",
                                                getStatusColor(threat.status)
                                            )}>
                                                {threat.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Emergency Purge Section */}
            <div className="p-6 border border-neon-red/20 rounded-xl bg-neon-red/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-neon-red font-mono">EMERGENCY_PURGE</h2>
                        <p className="text-red-400/60 mt-1 text-sm max-w-md">
                            Irreversibly wipe all local memory, logs, and cached data.
                            This action cannot be undone.
                        </p>
                    </div>

                    <button
                        onClick={handlePurge}
                        disabled={isPurging}
                        className={clsx(
                            "group relative px-6 py-3 rounded-lg font-bold tracking-widest transition-all duration-200 overflow-hidden font-mono text-sm",
                            isPurging
                                ? "bg-neon-red/30 cursor-wait text-red-300"
                                : "bg-neon-red/80 hover:bg-neon-red text-white shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:shadow-[0_0_30px_rgba(255,0,60,0.5)]"
                        )}
                    >
                        <div className="relative z-10 flex items-center gap-2">
                            <TrashIcon className="w-4 h-4" />
                            {isPurging ? "SHREDDING..." : "PURGE_MEMORY"}
                        </div>

                        {isPurging && (
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-20 animate-pulse" />
                        )}
                    </button>
                </div>

                {isPurging && (
                    <div className="mt-4 h-1 bg-neon-red/20 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-red animate-[grow_2s_ease-in-out_forwards] w-0" />
                        <style>{`
                            @keyframes grow {
                                0% { width: 0% }
                                100% { width: 100% }
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vault;
