import React from 'react';
import { clsx } from 'clsx';
import { useSystemStore } from '../store/useSystemStore';
import { ShieldCheckIcon, ExclamationTriangleIcon, CpuChipIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

const ThreatBadge = () => {
    const threatLevel = useSystemStore((state) => state.threatLevel);
    const systemInfo = useSystemStore((state) => state.systemInfo);

    const isSafe = threatLevel === 'SAFE';
    const isCritical = threatLevel === 'CRITICAL';

    return (
        <div className="space-y-3">
            {/* Main threat status */}
            <div className={clsx(
                "flex items-center justify-between p-6 rounded-xl border backdrop-blur-sm transition-all duration-500",
                isSafe
                    ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                    : "bg-red-500/10 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
            )}>
                <div>
                    <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Current Status</h3>
                    <div className="flex items-baseline gap-2">
                        <span className={clsx(
                            "text-3xl font-black tracking-tighter",
                            isSafe ? "text-emerald-400" : "text-red-500"
                        )}>
                            {threatLevel}
                        </span>
                    </div>
                    {/* Threat count */}
                    {systemInfo.threatCount > 0 && (
                        <div className="text-xs text-red-400/70 mt-1">
                            {systemInfo.threatCount} threat{systemInfo.threatCount > 1 ? 's' : ''} detected
                        </div>
                    )}
                </div>

                <div className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2",
                    isSafe
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-red-500/20 border-red-500 text-red-500 animate-pulse"
                )}>
                    {isSafe ? (
                        <ShieldCheckIcon className="w-6 h-6" />
                    ) : (
                        <ExclamationTriangleIcon className="w-6 h-6" />
                    )}
                </div>
            </div>

            {/* System status indicators */}
            <div className="grid grid-cols-2 gap-2">
                {/* Parallax connection */}
                <div className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs",
                    systemInfo.parallaxConnected
                        ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        : "bg-slate-800/50 border-slate-700 text-slate-500"
                )}>
                    <CpuChipIcon className="w-4 h-4" />
                    <div>
                        <div className="font-medium">Parallax</div>
                        <div className="text-[10px] opacity-70">
                            {systemInfo.parallaxConnected ? 'Connected' : 'Offline'}
                        </div>
                    </div>
                </div>

                {/* Camera status */}
                <div className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs",
                    systemInfo.cameraActive
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : "bg-slate-800/50 border-slate-700 text-slate-500"
                )}>
                    <VideoCameraIcon className="w-4 h-4" />
                    <div>
                        <div className="font-medium">Camera</div>
                        <div className="text-[10px] opacity-70">
                            {systemInfo.cameraActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Model info */}
            {systemInfo.model && (
                <div className="px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">AI Model</div>
                    <div className="text-xs text-purple-400 font-mono truncate" title={systemInfo.model}>
                        {systemInfo.model}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreatBadge;
