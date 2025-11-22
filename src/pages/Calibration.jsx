import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { UserGroupIcon, WrenchScrewdriverIcon, BoltIcon, ScaleIcon, BoltSlashIcon, CpuChipIcon } from '@heroicons/react/24/outline';

const ModeCard = ({ title, description, icon: Icon, active, onClick, color }) => (
    <div
        onClick={onClick}
        className={clsx(
            "cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-300 group",
            active
                ? `border-${color} bg-${color}/10 shadow-[0_0_30px_rgba(0,243,255,0.15)]`
                : "border-white/10 bg-white/5 hover:border-white/20"
        )}
    >
        <div className={clsx(
            "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
            active ? `bg-${color}/20 text-${color}` : "bg-white/10 text-slate-400"
        )}>
            <Icon className="w-5 h-5" />
        </div>
        <h3 className={clsx("text-sm font-bold font-mono mb-1", active ? "text-white" : "text-slate-300")}>{title}</h3>
        <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p>

        {active && (
            <div className={`absolute top-3 right-3 w-2 h-2 bg-${color} rounded-full shadow-[0_0_10px] animate-pulse`} />
        )}
    </div>
);

const PerformanceCard = ({ title, description, icon: Icon, active, onClick, value }) => (
    <div
        onClick={onClick}
        className={clsx(
            "cursor-pointer relative p-4 rounded-xl border transition-all duration-300",
            active
                ? "border-neon-purple bg-neon-purple/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
        )}
    >
        <div className="flex items-center gap-3">
            <Icon className={clsx("w-5 h-5", active ? "text-neon-purple" : "text-slate-500")} />
            <div>
                <div className={clsx("text-sm font-mono", active ? "text-white" : "text-slate-400")}>{title}</div>
                <div className="text-[10px] text-slate-500">{description}</div>
            </div>
        </div>
        {active && (
            <div className="absolute top-2 right-2 text-[9px] font-mono text-neon-purple">{value}s</div>
        )}
    </div>
);

const Calibration = () => {
    const [config, setConfig] = useState({
        mode: 'HOME',
        performance_mode: 'balanced',
        inference_interval: 5.0,
        parallax_model: '',
        parallax_base_url: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    // Fetch config from backend
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('http://localhost:8001/config');
                if (response.ok) {
                    const data = await response.json();
                    setConfig(data);
                    setError(null);
                } else {
                    setError('Failed to load config');
                }
            } catch (e) {
                setError('Backend offline');
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const updateConfig = async (key, value) => {
        setIsSaving(true);
        setSaved(false);

        // Optimistically update UI
        setConfig(prev => ({ ...prev, [key]: value }));

        try {
            const response = await fetch(`http://localhost:8001/config?${key}=${value}`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.applied?.inference_interval) {
                    setConfig(prev => ({ ...prev, inference_interval: data.applied.inference_interval }));
                }
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (e) {
            setError('Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500 font-mono">
                Loading configuration...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 h-full overflow-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight font-mono">SYSTEM_CALIBRATION</h1>
                    <p className="text-slate-400 mt-1 text-sm">Configure AI sensitivity and operational parameters.</p>
                </div>
                {saved && (
                    <div className="px-3 py-1 bg-neon-green/20 border border-neon-green/30 rounded text-neon-green text-xs font-mono">
                        SAVED
                    </div>
                )}
                {error && (
                    <div className="px-3 py-1 bg-neon-red/20 border border-neon-red/30 rounded text-neon-red text-xs font-mono">
                        {error}
                    </div>
                )}
            </div>

            {/* Mode Selection */}
            <div className="space-y-3">
                <h2 className="text-sm font-mono text-slate-400 tracking-wider">OPERATIONAL_MODE</h2>
                <div className="grid grid-cols-2 gap-4">
                    <ModeCard
                        title="HOME_SECURITY"
                        description="Pedestrian detection, fall monitoring, unauthorized access in residential environments."
                        icon={UserGroupIcon}
                        active={config.mode === 'HOME'}
                        onClick={() => updateConfig('mode', 'HOME')}
                        color="neon-blue"
                    />
                    <ModeCard
                        title="INDUSTRIAL_WATCH"
                        description="High-speed defect detection, thermal anomaly monitoring, machinery safety."
                        icon={WrenchScrewdriverIcon}
                        active={config.mode === 'INDUSTRIAL'}
                        onClick={() => updateConfig('mode', 'INDUSTRIAL')}
                        color="neon-purple"
                    />
                </div>
            </div>

            {/* Performance Mode */}
            <div className="space-y-3">
                <h2 className="text-sm font-mono text-slate-400 tracking-wider">PERFORMANCE_MODE</h2>
                <div className="grid grid-cols-3 gap-3">
                    <PerformanceCard
                        title="PERFORMANCE"
                        description="2.5s intervals"
                        icon={BoltIcon}
                        active={config.performance_mode === 'performance'}
                        onClick={() => updateConfig('performance_mode', 'performance')}
                        value="2.5"
                    />
                    <PerformanceCard
                        title="BALANCED"
                        description="5s intervals"
                        icon={ScaleIcon}
                        active={config.performance_mode === 'balanced'}
                        onClick={() => updateConfig('performance_mode', 'balanced')}
                        value="5.0"
                    />
                    <PerformanceCard
                        title="ECO"
                        description="10s intervals"
                        icon={BoltSlashIcon}
                        active={config.performance_mode === 'eco'}
                        onClick={() => updateConfig('performance_mode', 'eco')}
                        value="10"
                    />
                </div>
            </div>

            {/* Current Config Display */}
            <div className="glass-panel rounded-xl border border-white/5 p-5 space-y-4">
                <h2 className="text-sm font-mono text-neon-blue tracking-wider flex items-center gap-2">
                    <CpuChipIcon className="w-4 h-4" />
                    PARALLAX_CONFIG
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-wider mb-1">MODEL</div>
                        <div className="text-neon-purple font-mono truncate" title={config.parallax_model}>
                            {config.parallax_model || 'Not configured'}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-wider mb-1">ENDPOINT</div>
                        <div className="text-slate-300 font-mono truncate" title={config.parallax_base_url}>
                            {config.parallax_base_url || 'Not configured'}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-wider mb-1">INFERENCE_INTERVAL</div>
                        <div className="text-white font-mono">
                            {config.inference_interval}s
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-mono tracking-wider mb-1">FEATURES</div>
                        <div className="flex gap-2">
                            {config.use_parallax_for_scene && (
                                <span className="px-1.5 py-0.5 bg-neon-green/20 text-neon-green text-[9px] rounded font-mono">SCENE</span>
                            )}
                            {config.use_parallax_for_action && (
                                <span className="px-1.5 py-0.5 bg-neon-blue/20 text-neon-blue text-[9px] rounded font-mono">ACTION</span>
                            )}
                            {config.use_parallax_for_logging && (
                                <span className="px-1.5 py-0.5 bg-neon-purple/20 text-neon-purple text-[9px] rounded font-mono">LOGGING</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status indicator */}
            {isSaving && (
                <div className="fixed bottom-4 right-4 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-mono text-slate-400">
                    Saving...
                </div>
            )}
        </div>
    );
};

export default Calibration;
