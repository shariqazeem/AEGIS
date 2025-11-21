import React from 'react';
import { clsx } from 'clsx';
import { useSystemStore } from '../store/useSystemStore';
import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const ThreatBadge = () => {
    const threatLevel = useSystemStore((state) => state.threatLevel);

    const isSafe = threatLevel === 'SAFE';
    const isCritical = threatLevel === 'CRITICAL';

    return (
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
    );
};

export default ThreatBadge;
