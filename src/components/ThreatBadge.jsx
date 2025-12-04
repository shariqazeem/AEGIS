import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useSystemStore } from '../store/useSystemStore';
import { ShieldCheckIcon, ExclamationTriangleIcon, CpuChipIcon, VideoCameraIcon, BoltIcon } from '@heroicons/react/24/outline';

const ThreatBadge = () => {
    const threatLevel = useSystemStore((state) => state.threatLevel);
    const systemInfo = useSystemStore((state) => state.systemInfo);
    const [pulseIntensity, setPulseIntensity] = useState(0);

    const isSafe = threatLevel === 'SAFE';

    // Pulse animation for threat state
    useEffect(() => {
        if (!isSafe) {
            const interval = setInterval(() => {
                setPulseIntensity(prev => (prev + 1) % 3);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isSafe]);

    return (
        <div className="space-y-3 p-3">
            {/* Main threat status */}
            <div className={clsx(
                "relative flex items-center justify-between p-5 rounded-xl border backdrop-blur-md transition-all duration-500 overflow-hidden group",
                isSafe
                    ? "bg-gradient-to-br from-neon-green/10 to-emerald-500/5 border-neon-green/30 shadow-[0_0_30px_rgba(10,255,104,0.15)]"
                    : "bg-gradient-to-br from-neon-red/10 to-red-500/5 border-neon-red/30 shadow-[0_0_40px_rgba(255,0,60,0.25)]"
            )}>
                {/* Animated background effect */}
                <div className={clsx(
                    "absolute inset-0 transition-opacity duration-300",
                    isSafe 
                        ? "bg-[radial-gradient(circle_at_30%_50%,rgba(10,255,104,0.1),transparent_50%)]"
                        : "bg-[radial-gradient(circle_at_30%_50%,rgba(255,0,60,0.15),transparent_50%)] animate-pulse"
                )} />

                {/* Scanning line effect for threat */}
                {!isSafe && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-neon-red/50 to-transparent animate-scanline" />
                    </div>
                )}

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase mb-1">
                        THREAT ASSESSMENT
                    </h3>
                    <div className="flex items-baseline gap-3">
                        <span className={clsx(
                            "text-4xl font-black tracking-tight font-mono transition-all",
                            isSafe 
                                ? "text-neon-green drop-shadow-[0_0_15px_rgba(10,255,104,0.8)]" 
                                : "text-neon-red drop-shadow-[0_0_20px_rgba(255,0,60,0.8)] animate-pulse"
                        )}>
                            {threatLevel}
                        </span>
                    </div>
                    
                    {/* Threat count */}
                    {systemInfo.threatCount > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                            <BoltIcon className="w-4 h-4 text-neon-red animate-pulse" />
                            <span className="text-sm text-neon-red font-mono font-bold">
                                {systemInfo.threatCount} THREAT{systemInfo.threatCount > 1 ? 'S' : ''} DETECTED
                            </span>
                        </div>
                    )}
                </div>

                {/* Status icon */}
                <div className={clsx(
                    "relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isSafe
                        ? "bg-neon-green/10 border-neon-green shadow-[0_0_25px_rgba(10,255,104,0.4)]"
                        : "bg-neon-red/10 border-neon-red shadow-[0_0_30px_rgba(255,0,60,0.5)]"
                )}>
                    {/* Rotating ring effect */}
                    <div className={clsx(
                        "absolute inset-0 rounded-full border-2 border-dashed animate-spin",
                        isSafe ? "border-neon-green/30" : "border-neon-red/30"
                    )} style={{ animationDuration: '10s' }} />
                    
                    {isSafe ? (
                        <ShieldCheckIcon className="w-8 h-8 text-neon-green drop-shadow-[0_0_10px_rgba(10,255,104,0.8)]" />
                    ) : (
                        <ExclamationTriangleIcon className="w-8 h-8 text-neon-red drop-shadow-[0_0_10px_rgba(255,0,60,0.8)] animate-bounce" />
                    )}
                </div>
            </div>

            {/* System status grid */}
            <div className="grid grid-cols-2 gap-2">
                {/* Parallax connection */}
                <div className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300",
                    systemInfo.parallaxConnected
                        ? "bg-gradient-to-r from-neon-purple/10 to-indigo-500/5 border-neon-purple/30"
                        : "bg-white/5 border-white/10"
                )}>
                    <div className="relative">
                        <CpuChipIcon className={clsx(
                            "w-5 h-5",
                            systemInfo.parallaxConnected ? "text-neon-purple" : "text-slate-500"
                        )} />
                        {systemInfo.parallaxConnected && (
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_8px_#0aff68]" />
                        )}
                    </div>
                    <div>
                        <div className="font-mono text-[9px] tracking-wider text-slate-500">PARALLAX</div>
                        <div className={clsx(
                            "text-xs font-bold",
                            systemInfo.parallaxConnected ? "text-neon-purple" : "text-slate-500"
                        )}>
                            {systemInfo.parallaxConnected ? 'CONNECTED' : 'OFFLINE'}
                        </div>
                    </div>
                </div>

                {/* Camera status */}
                <div className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300",
                    systemInfo.cameraActive
                        ? "bg-gradient-to-r from-neon-blue/10 to-cyan-500/5 border-neon-blue/30"
                        : "bg-white/5 border-white/10"
                )}>
                    <div className="relative">
                        <VideoCameraIcon className={clsx(
                            "w-5 h-5",
                            systemInfo.cameraActive ? "text-neon-blue" : "text-slate-500"
                        )} />
                        {systemInfo.cameraActive && (
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon-red rounded-full animate-pulse shadow-[0_0_8px_#ff003c]" />
                        )}
                    </div>
                    <div>
                        <div className="font-mono text-[9px] tracking-wider text-slate-500">OPTICS</div>
                        <div className={clsx(
                            "text-xs font-bold",
                            systemInfo.cameraActive ? "text-neon-blue" : "text-slate-500"
                        )}>
                            {systemInfo.cameraActive ? 'STREAMING' : 'STANDBY'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Model info */}
            {systemInfo.model && (
                <div className="px-3 py-2 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/10 flex items-center justify-between">
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">AI MODEL</div>
                    <div className="text-xs text-neon-purple font-mono font-bold truncate max-w-[150px]" title={systemInfo.model}>
                        {systemInfo.model}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreatBadge;
