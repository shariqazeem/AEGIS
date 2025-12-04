// src/pages/Calibration.jsx
import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { UserGroupIcon, WrenchScrewdriverIcon, BoltIcon, ScaleIcon, BoltSlashIcon, CpuChipIcon } from '@heroicons/react/24/outline';

const Calibration = () => {
    const [config, setConfig] = useState({
        mode: 'HOME',
        performance_mode: 'balanced',
        inference_interval: 4.0,
        parallax_model: 'Qwen/Qwen3-0.6B',
        parallax_base_url: 'http://localhost:3001/v1'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('http://localhost:8001/config');
                if (response.ok) setConfig(await response.json());
            } catch (e) {}
            setIsLoading(false);
        };
        fetchConfig();
    }, []);

    const updateConfig = async (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        try {
            await fetch(`http://localhost:8001/config?${key}=${value}`, { method: 'POST' });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {}
    };

    if (isLoading) return <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 h-full overflow-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight font-mono">SYSTEM_CALIBRATION</h1>
                    <p className="text-slate-400 mt-1 text-sm">Configure AI sensitivity and parameters.</p>
                </div>
                {saved && <div className="px-3 py-1 bg-neon-green/20 border border-neon-green/30 rounded text-neon-green text-xs font-mono">SAVED</div>}
            </div>

            {/* Mode Selection */}
            <div className="space-y-3">
                <h2 className="text-sm font-mono text-slate-400 tracking-wider">OPERATIONAL_MODE</h2>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: 'HOME', title: 'HOME_SECURITY', desc: 'Residential monitoring', icon: UserGroupIcon, color: 'neon-blue' },
                        { id: 'INDUSTRIAL', title: 'INDUSTRIAL', desc: 'Industrial safety', icon: WrenchScrewdriverIcon, color: 'neon-purple' }
                    ].map(mode => (
                        <div
                            key={mode.id}
                            onClick={() => updateConfig('mode', mode.id)}
                            className={clsx(
                                "cursor-pointer p-5 rounded-xl border-2 transition-all",
                                config.mode === mode.id
                                    ? `border-${mode.color} bg-${mode.color}/10 shadow-[0_0_20px_rgba(0,243,255,0.1)]`
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                            )}
                        >
                            <mode.icon className={clsx("w-8 h-8 mb-3", config.mode === mode.id ? `text-${mode.color}` : "text-slate-500")} />
                            <h3 className="text-sm font-bold font-mono text-white">{mode.title}</h3>
                            <p className="text-[11px] text-slate-500">{mode.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Mode */}
            <div className="space-y-3">
                <h2 className="text-sm font-mono text-slate-400 tracking-wider">PERFORMANCE_MODE</h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'performance', title: 'FAST', interval: '2.5s', icon: BoltIcon },
                        { id: 'balanced', title: 'BALANCED', interval: '4s', icon: ScaleIcon },
                        { id: 'eco', title: 'ECO', interval: '8s', icon: BoltSlashIcon }
                    ].map(mode => (
                        <div
                            key={mode.id}
                            onClick={() => updateConfig('performance_mode', mode.id)}
                            className={clsx(
                                "cursor-pointer p-4 rounded-xl border transition-all",
                                config.performance_mode === mode.id
                                    ? "border-neon-purple bg-neon-purple/10"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <mode.icon className={clsx("w-5 h-5", config.performance_mode === mode.id ? "text-neon-purple" : "text-slate-500")} />
                                <div>
                                    <div className="text-sm font-mono text-white">{mode.title}</div>
                                    <div className="text-[10px] text-slate-500">{mode.interval} intervals</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Parallax Config */}
            <div className="glass-panel rounded-xl border border-white/5 p-5 space-y-4">
                <h2 className="text-sm font-mono text-neon-blue tracking-wider flex items-center gap-2">
                    <CpuChipIcon className="w-4 h-4" />
                    PARALLAX_CONFIG
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-[10px] text-slate-500 font-mono mb-1">MODEL</div>
                        <div className="text-neon-purple font-mono">{config.parallax_model}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-mono mb-1">ENDPOINT</div>
                        <div className="text-slate-300 font-mono truncate">{config.parallax_base_url}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-mono mb-1">INFERENCE_INTERVAL</div>
                        <div className="text-white font-mono">{config.inference_interval}s</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-mono mb-1">STATUS</div>
                        <span className="px-2 py-0.5 bg-neon-green/20 text-neon-green text-[9px] rounded font-mono">ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calibration;
