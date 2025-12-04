// src/pages/Vault.jsx
import React, { useState, useEffect } from 'react';
import { TrashIcon, ShieldExclamationIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Vault = () => {
    const [threats, setThreats] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isPurging, setIsPurging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchThreats = async () => {
        try {
            const response = await fetch('http://localhost:8001/threats?limit=50');
            if (response.ok) {
                const data = await response.json();
                setThreats(data.threats || []);
                setTotalCount(data.total_count || 0);
            }
        } catch (e) {}
        setIsLoading(false);
    };

    useEffect(() => {
        fetchThreats();
        const interval = setInterval(fetchThreats, 5000);
        return () => clearInterval(interval);
    }, []);

    const handlePurge = async () => {
        setIsPurging(true);
        try {
            await fetch('http://localhost:8001/purge', { method: 'POST' });
            setTimeout(() => { fetchThreats(); setIsPurging(false); }, 2000);
        } catch (e) { setIsPurging(false); }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto h-full overflow-auto p-6">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight font-mono">PRIVACY VAULT</h1>
                    <p className="text-slate-400 mt-1 text-sm">100% local storage. No data leaves your device.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={fetchThreats} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
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
                    <div className="text-[10px] text-slate-500 font-mono">TOTAL</div>
                    <div className="text-2xl font-bold text-white font-mono">{totalCount}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500 font-mono">STORED</div>
                    <div className="text-2xl font-bold text-neon-blue font-mono">{threats.length}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500 font-mono">CRITICAL</div>
                    <div className="text-2xl font-bold text-neon-red font-mono">
                        {threats.filter(t => t.status === 'CRITICAL').length}
                    </div>
                </div>
            </div>

            {/* Events Table */}
            <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-sm font-mono text-neon-blue tracking-wider">EVENT_HISTORY</h3>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-slate-500"><ArrowPathIcon className="w-6 h-6 mx-auto animate-spin" /></div>
                ) : threats.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono">
                        <ShieldExclamationIcon className="w-8 h-8 mx-auto mb-2 text-neon-green/50" />
                        No threats detected. System secure.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500">ID</th>
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500">TIME</th>
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500">TYPE</th>
                                    <th className="px-4 py-3 text-[10px] font-mono text-slate-500">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {threats.slice().reverse().map((t) => (
                                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 font-mono text-slate-300">{t.id}</td>
                                        <td className="px-4 py-3 font-mono text-slate-400">{t.time}</td>
                                        <td className="px-4 py-3 text-slate-300 truncate max-w-[200px]">{t.type}</td>
                                        <td className="px-4 py-3">
                                            <span className={clsx(
                                                "px-2 py-1 rounded text-[10px] font-bold border",
                                                t.status === 'CRITICAL' ? "text-neon-red bg-neon-red/20 border-neon-red/30" : "text-amber-400 bg-amber-500/20 border-amber-500/30"
                                            )}>{t.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Purge */}
            <div className="p-6 border border-neon-red/20 rounded-xl bg-neon-red/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-neon-red font-mono">EMERGENCY_PURGE</h2>
                        <p className="text-red-400/60 mt-1 text-sm">Irreversibly wipe all local data.</p>
                    </div>
                    <button
                        onClick={handlePurge}
                        disabled={isPurging}
                        className={clsx(
                            "px-6 py-3 rounded-lg font-bold font-mono text-sm",
                            isPurging ? "bg-neon-red/30 text-red-300" : "bg-neon-red/80 hover:bg-neon-red text-white shadow-[0_0_20px_rgba(255,0,60,0.3)]"
                        )}
                    >
                        <TrashIcon className="w-4 h-4 inline mr-2" />
                        {isPurging ? "SHREDDING..." : "PURGE_MEMORY"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Vault;
