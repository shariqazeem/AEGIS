import React from 'react';
import { clsx } from 'clsx';
import { useSystemStore } from '../store/useSystemStore';
import { ShieldCheckIcon, ExclamationTriangleIcon, CpuChipIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const ThreatBadge = () => {
    const threatLevel = useSystemStore((state) => state.threatLevel);
    const systemInfo = useSystemStore((state) => state.systemInfo);

    const isSafe = threatLevel === 'SAFE';

    return (
        <div className="space-y-3">
            {/* Main threat status */}
            <div className={clsx(
                "relative flex items-center justify-between p-6 rounded-xl border backdrop-blur-md transition-all duration-500 overflow-hidden group",
                isSafe
                    ? "bg-neon-green/5 border-neon-green/20 shadow-[0_0_20px_rgba(10,255,104,0.1)]"
                    : "bg-neon-red/5 border-neon-red/20 shadow-[0_0_30px_rgba(255,0,60,0.2)]"
            )}>
                {/* Background Pulse */}
                <div className={clsx(
                    "absolute inset-0 opacity-10 animate-pulse",
                    isSafe ? "bg-neon-green" : "bg-neon-red"
                )} />

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-1">THREAT LEVEL</h3>
                    <div className="flex items-baseline gap-2">
                        <span className={clsx(
                            "text-4xl font-black tracking-tighter font-mono text-glow",
                            isSafe ? "text-neon-green" : "text-neon-red"
                        )}>
                            {threatLevel}
                        </span>
                    </div>
                    {/* Threat count */}
                    {systemInfo.threatCount > 0 && (
                        <div className="text-xs text-neon-red font-mono mt-1 animate-pulse">
                            ⚠ {systemInfo.threatCount} THREATS DETECTED
                        </div>
                    )}
                </div>

                <div className={clsx(
                    "relative w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-lg",
                    isSafe
                        ? "bg-neon-green/10 border-neon-green text-neon-green shadow-neon-green/20"
                        : "bg-neon-red/10 border-neon-red text-neon-red shadow-neon-red/20 animate-pulse"
                )}>
                    {isSafe ? (
                        <ShieldCheckIcon className="w-8 h-8 drop-shadow-[0_0_5px_rgba(10,255,104,0.8)]" />
                    ) : (
                        <ExclamationTriangleIcon className="w-8 h-8 drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]" />
                    )}
                </div>
            </div>

            {/* System status indicators */}
            <div className="grid grid-cols-2 gap-2">
                {/* Parallax connection */}
                <div className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors duration-300",
                    systemInfo.parallaxConnected
                        ? "bg-neon-purple/10 border-neon-purple/30 text-neon-purple"
                        : "bg-white/5 border-white/10 text-slate-500"
                )}>
                    <CpuChipIcon className="w-5 h-5" />
                    <div>
                        <div className="font-mono text-[10px] tracking-wider opacity-70">PARALLAX</div>
                        <div className="text-xs font-bold">
                            {systemInfo.parallaxConnected ? 'ONLINE' : 'OFFLINE'}
                        </div>
                    </div>
                </div>

                {/* Camera status */}
                <div className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors duration-300",
                    systemInfo.cameraActive
                        ? "bg-neon-blue/10 border-neon-blue/30 text-neon-blue"
                        : "bg-white/5 border-white/10 text-slate-500"
                )}>
                    <VideoCameraIcon className="w-5 h-5" />
                    <div>
                        <div className="font-mono text-[10px] tracking-wider opacity-70">OPTICS</div>
                        <div className="text-xs font-bold">
                            {systemInfo.cameraActive ? 'ACTIVE' : 'STANDBY'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Model info */}
            {systemInfo.model && (
                <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">AI Model</div>
                    <div className="text-xs text-neon-purple font-mono truncate drop-shadow-[0_0_5px_rgba(188,19,254,0.5)]" title={systemInfo.model}>
                        {systemInfo.model}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreatBadge;
