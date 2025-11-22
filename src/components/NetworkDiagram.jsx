import React from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { clsx } from 'clsx';

const NetworkDiagram = () => {
    const systemInfo = useSystemStore((state) => state.systemInfo);
    const threatLevel = useSystemStore((state) => state.threatLevel);

    const isActive = systemInfo.parallaxConnected;

    return (
        <div className="glass-panel p-4 rounded-xl border border-white/5 overflow-hidden">
            <h3 className="text-sm font-mono text-neon-blue tracking-wider mb-4">
                INFERENCE_PIPELINE
            </h3>

            {/* Network Diagram - Data Flow Visualization */}
            <div className="relative h-32">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    {/* Camera to OpenCV */}
                    <path
                        d="M60 50 L130 50"
                        className={clsx(
                            "stroke-2 fill-none transition-all duration-500",
                            isActive ? "stroke-neon-blue animate-pulse" : "stroke-slate-700"
                        )}
                        strokeDasharray="5,5"
                    />
                    {/* Data flow animation */}
                    {isActive && (
                        <circle r="3" fill="#00f3ff" className="animate-ping">
                            <animateMotion dur="1s" repeatCount="indefinite" path="M60 50 L130 50" />
                        </circle>
                    )}

                    {/* OpenCV to Parallax */}
                    <path
                        d="M200 50 L270 50"
                        className={clsx(
                            "stroke-2 fill-none transition-all duration-500",
                            isActive ? "stroke-neon-purple animate-pulse" : "stroke-slate-700"
                        )}
                        strokeDasharray="5,5"
                    />
                    {isActive && (
                        <circle r="3" fill="#bc13fe" className="animate-ping">
                            <animateMotion dur="1.2s" repeatCount="indefinite" path="M200 50 L270 50" />
                        </circle>
                    )}

                    {/* Parallax to Decision */}
                    <path
                        d="M340 50 L380 50"
                        className={clsx(
                            "stroke-2 fill-none transition-all duration-500",
                            threatLevel === 'CRITICAL' ? "stroke-neon-red" : isActive ? "stroke-neon-green" : "stroke-slate-700"
                        )}
                        strokeDasharray="5,5"
                    />
                </svg>

                {/* Nodes */}
                <div className="absolute inset-0 flex items-center justify-between px-2">
                    {/* Camera Node */}
                    <div className={clsx(
                        "flex flex-col items-center gap-1 transition-all",
                        systemInfo.cameraActive ? "opacity-100" : "opacity-40"
                    )}>
                        <div className={clsx(
                            "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg",
                            systemInfo.cameraActive
                                ? "bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                                : "bg-slate-800 border-slate-700 text-slate-600"
                        )}>
                            📹
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">CAMERA</span>
                    </div>

                    {/* OpenCV Node */}
                    <div className={clsx(
                        "flex flex-col items-center gap-1 transition-all",
                        isActive ? "opacity-100" : "opacity-40"
                    )}>
                        <div className={clsx(
                            "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg",
                            isActive
                                ? "bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_10px_rgba(10,255,104,0.3)]"
                                : "bg-slate-800 border-slate-700 text-slate-600"
                        )}>
                            👁️
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">OPENCV</span>
                    </div>

                    {/* Parallax Cluster Node */}
                    <div className={clsx(
                        "flex flex-col items-center gap-1 transition-all",
                        isActive ? "opacity-100" : "opacity-40"
                    )}>
                        <div className={clsx(
                            "w-12 h-10 rounded-lg border-2 flex items-center justify-center relative",
                            isActive
                                ? "bg-neon-purple/20 border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.3)]"
                                : "bg-slate-800 border-slate-700"
                        )}>
                            <span className="text-lg">🧠</span>
                            {isActive && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full border border-black animate-pulse" />
                            )}
                        </div>
                        <span className="text-[8px] font-mono text-neon-purple font-bold">PARALLAX</span>
                    </div>

                    {/* Decision Node */}
                    <div className="flex flex-col items-center gap-1">
                        <div className={clsx(
                            "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all",
                            threatLevel === 'CRITICAL'
                                ? "bg-neon-red/20 border-neon-red text-neon-red shadow-[0_0_15px_rgba(255,0,60,0.4)] animate-pulse"
                                : isActive
                                    ? "bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_10px_rgba(10,255,104,0.3)]"
                                    : "bg-slate-800 border-slate-700 text-slate-600"
                        )}>
                            {threatLevel === 'CRITICAL' ? '⚠️' : '✅'}
                        </div>
                        <span className={clsx(
                            "text-[8px] font-mono font-bold",
                            threatLevel === 'CRITICAL' ? "text-neon-red" : "text-neon-green"
                        )}>
                            {threatLevel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Pipeline Status */}
            <div className="mt-4 flex justify-center gap-4 text-[9px] font-mono">
                <div className="flex items-center gap-1">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", systemInfo.cameraActive ? "bg-neon-blue" : "bg-slate-600")} />
                    <span className="text-slate-500">INPUT</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", isActive ? "bg-neon-purple animate-pulse" : "bg-slate-600")} />
                    <span className="text-slate-500">INFERENCE</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        threatLevel === 'CRITICAL' ? "bg-neon-red animate-pulse" : isActive ? "bg-neon-green" : "bg-slate-600"
                    )} />
                    <span className="text-slate-500">OUTPUT</span>
                </div>
            </div>
        </div>
    );
};

export default NetworkDiagram;
