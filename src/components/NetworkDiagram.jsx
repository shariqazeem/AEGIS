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

            <div className="relative h-24">
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 80">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#bc13fe" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#0aff68" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                    
                    {/* Main flow line */}
                    <path
                        d="M50 40 Q150 40 200 40 Q250 40 350 40"
                        stroke="url(#lineGrad)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={isActive ? "none" : "5,5"}
                        className={isActive ? "animate-pulse" : ""}
                    />
                    
                    {/* Animated data packets */}
                    {isActive && (
                        <>
                            <circle r="4" fill="#00f3ff">
                                <animateMotion dur="2s" repeatCount="indefinite" path="M50 40 Q150 40 200 40 Q250 40 350 40" />
                            </circle>
                            <circle r="3" fill="#bc13fe">
                                <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s" path="M50 40 Q150 40 200 40 Q250 40 350 40" />
                            </circle>
                        </>
                    )}
                </svg>

                {/* Nodes */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                    {/* Camera */}
                    <div className={clsx("flex flex-col items-center gap-1", systemInfo.cameraActive ? "opacity-100" : "opacity-40")}>
                        <div className={clsx(
                            "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg",
                            systemInfo.cameraActive
                                ? "bg-neon-blue/20 border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                                : "bg-slate-800 border-slate-700"
                        )}>📹</div>
                        <span className="text-[8px] font-mono text-slate-500">CAMERA</span>
                    </div>

                    {/* YOLO */}
                    <div className={clsx("flex flex-col items-center gap-1", isActive ? "opacity-100" : "opacity-40")}>
                        <div className={clsx(
                            "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg",
                            isActive
                                ? "bg-neon-green/20 border-neon-green shadow-[0_0_15px_rgba(10,255,104,0.4)]"
                                : "bg-slate-800 border-slate-700"
                        )}>👁️</div>
                        <span className="text-[8px] font-mono text-slate-500">YOLO</span>
                    </div>

                    {/* Parallax */}
                    <div className={clsx("flex flex-col items-center gap-1", isActive ? "opacity-100" : "opacity-40")}>
                        <div className={clsx(
                            "relative w-12 h-10 rounded-lg border-2 flex items-center justify-center",
                            isActive
                                ? "bg-neon-purple/20 border-neon-purple shadow-[0_0_20px_rgba(188,19,254,0.4)]"
                                : "bg-slate-800 border-slate-700"
                        )}>
                            <span className="text-lg">🧠</span>
                            {isActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse shadow-[0_0_8px_#0aff68]" />}
                        </div>
                        <span className="text-[8px] font-mono text-neon-purple font-bold">PARALLAX</span>
                    </div>

                    {/* Decision */}
                    <div className="flex flex-col items-center gap-1">
                        <div className={clsx(
                            "w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all",
                            threatLevel === 'CRITICAL'
                                ? "bg-neon-red/20 border-neon-red shadow-[0_0_20px_rgba(255,0,60,0.5)] animate-pulse"
                                : isActive
                                    ? "bg-neon-green/20 border-neon-green shadow-[0_0_15px_rgba(10,255,104,0.4)]"
                                    : "bg-slate-800 border-slate-700"
                        )}>
                            {threatLevel === 'CRITICAL' ? '⚠️' : '✅'}
                        </div>
                        <span className={clsx(
                            "text-[8px] font-mono font-bold",
                            threatLevel === 'CRITICAL' ? "text-neon-red" : "text-neon-green"
                        )}>{threatLevel}</span>
                    </div>
                </div>
            </div>

            {/* Status indicators */}
            <div className="mt-3 flex justify-center gap-6 text-[9px] font-mono">
                <div className="flex items-center gap-1">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", systemInfo.cameraActive ? "bg-neon-blue" : "bg-slate-600")} />
                    <span className="text-slate-500">INPUT</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", isActive ? "bg-neon-purple animate-pulse" : "bg-slate-600")} />
                    <span className="text-slate-500">AI</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", threatLevel === 'CRITICAL' ? "bg-neon-red animate-pulse" : isActive ? "bg-neon-green" : "bg-slate-600")} />
                    <span className="text-slate-500">OUTPUT</span>
                </div>
            </div>
        </div>
    );
};

export default NetworkDiagram;
