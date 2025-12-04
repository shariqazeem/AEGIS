import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { VideoCameraIcon, ChevronDownIcon, BeakerIcon, SignalIcon } from '@heroicons/react/24/outline';

const VideoFeed = ({ className }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [isTestMode, setIsTestMode] = useState(false);
    const [currentScenario, setCurrentScenario] = useState("");
    const [streamKey, setStreamKey] = useState(0);
    const [fps, setFps] = useState(30);
    const imgRef = useRef(null);
    const frameCountRef = useRef(0);

    const VIDEO_SERVER_URL = `http://localhost:8001/video_feed?t=${streamKey}`;

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const res = await fetch("http://localhost:8001/health");
                if (res.ok) {
                    const data = await res.json();
                    if (data.camera_available || data.test_mode) {
                        setIsConnected(true);
                        setIsTestMode(data.test_mode);
                        setCurrentScenario(data.current_scenario || "");
                        setError(null);
                    } else {
                        setError("Camera not available");
                        setIsConnected(false);
                    }
                } else {
                    setError("Backend not responding");
                    setIsConnected(false);
                }
            } catch (err) {
                setError("Backend offline");
                setIsConnected(false);
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 2000);
        return () => clearInterval(interval);
    }, []);

    // FPS counter
    useEffect(() => {
        const fpsInterval = setInterval(() => {
            setFps(Math.min(30, frameCountRef.current));
            frameCountRef.current = 0;
        }, 1000);
        return () => clearInterval(fpsInterval);
    }, []);

    // Refresh stream periodically
    useEffect(() => {
        if (!isConnected) return;
        const refreshInterval = setInterval(() => {
            setStreamKey(prev => prev + 1);
        }, 60000);
        return () => clearInterval(refreshInterval);
    }, [isConnected]);

    const handleFrameLoad = () => {
        frameCountRef.current++;
    };

    return (
        <div className={clsx("relative rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group", className)}>
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-20" />
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)] pointer-events-none z-20" />

            {/* Video stream */}
            {isConnected ? (
                <img
                    ref={imgRef}
                    src={VIDEO_SERVER_URL}
                    alt="Live Feed"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    onLoad={handleFrameLoad}
                    onError={() => setTimeout(() => setStreamKey(prev => prev + 1), 1000)}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-obsidian z-10">
                    <div className="text-center p-8 relative z-20">
                        {/* Animated radar effect */}
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-2 border-neon-red/20 animate-ping" />
                            <div className="absolute inset-2 rounded-full border-2 border-neon-red/30 animate-ping" style={{ animationDelay: '0.5s' }} />
                            <div className="absolute inset-0 rounded-full bg-neon-red/5 flex items-center justify-center">
                                <div className="w-3 h-3 bg-neon-red rounded-full shadow-[0_0_20px_#ff003c] animate-pulse" />
                            </div>
                            {/* Rotating radar line */}
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-neon-red to-transparent origin-left animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                        </div>
                        
                        <p className="text-neon-red font-mono tracking-[0.3em] mb-2 text-sm animate-pulse">SIGNAL LOST</p>
                        <p className="text-slate-500 text-xs font-mono max-w-xs">
                            {error || "ESTABLISHING CONNECTION..."}
                        </p>
                        <p className="text-slate-600 text-[10px] font-mono mt-4">
                            Run: python backend/vision_sentinel.py
                        </p>
                    </div>
                </div>
            )}

            {/* HUD Overlay */}
            <div className="absolute inset-0 z-30 pointer-events-none p-4 flex flex-col justify-between">
                {/* Top HUD */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {/* Recording indicator */}
                        <div className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 border rounded-lg backdrop-blur-md transition-all",
                            isConnected
                                ? isTestMode
                                    ? "bg-yellow-500/10 border-yellow-500/30"
                                    : "bg-neon-red/10 border-neon-red/30"
                                : "bg-slate-800/50 border-slate-700"
                        )}>
                            {isTestMode ? (
                                <BeakerIcon className="w-4 h-4 text-yellow-400" />
                            ) : (
                                <div className={clsx(
                                    "w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]",
                                    isConnected ? "bg-neon-red animate-pulse" : "bg-slate-500"
                                )} />
                            )}
                            <span className={clsx(
                                "text-[10px] font-bold tracking-[0.2em]",
                                isTestMode ? "text-yellow-400" : isConnected ? "text-neon-red" : "text-slate-500"
                            )}>
                                {isTestMode ? "DEMO" : isConnected ? "REC" : "OFFLINE"}
                            </span>
                        </div>

                        {/* FPS counter */}
                        {isConnected && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-black/40 border border-white/10 rounded backdrop-blur-md">
                                <SignalIcon className="w-3 h-3 text-neon-green" />
                                <span className="text-[10px] font-mono text-neon-green">{fps} FPS</span>
                            </div>
                        )}
                    </div>

                    {/* Camera info */}
                    <div className="text-right space-y-1">
                        <div className="text-[10px] font-mono text-neon-blue/70 tracking-wider">ISO 800</div>
                        <div className="text-[10px] font-mono text-neon-blue/70 tracking-wider">F/2.8</div>
                        <div className="text-[10px] font-mono text-neon-blue/70 tracking-wider">1/30s</div>
                    </div>
                </div>

                {/* Center crosshair */}
                {isConnected && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative w-16 h-16">
                            {/* Rotating outer ring */}
                            <div className="absolute inset-0 border border-neon-blue/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1 h-2 bg-neon-blue/50" />
                            </div>
                            {/* Inner circle */}
                            <div className="absolute inset-3 border border-neon-blue/40 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-neon-blue rounded-full shadow-[0_0_8px_#00f3ff]" />
                            </div>
                            {/* Crosshair lines */}
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neon-blue/30 to-transparent" />
                        </div>
                    </div>
                )}

                {/* Test mode scenario banner */}
                {isTestMode && isConnected && currentScenario && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16">
                        <div className="px-6 py-3 bg-black/70 border border-yellow-500/50 rounded-lg backdrop-blur-md text-center">
                            <span className="text-[10px] font-mono text-yellow-400 tracking-[0.2em] block mb-1">
                                DEMO MODE
                            </span>
                            <span className="text-lg font-mono text-white font-bold">
                                {currentScenario}
                            </span>
                        </div>
                    </div>
                )}

                {/* Bottom HUD */}
                <div className="flex justify-between items-end">
                    {/* Signal strength bars */}
                    <div className="flex items-end gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <div 
                                key={i} 
                                className={clsx(
                                    "w-1.5 rounded-sm transition-all",
                                    isConnected ? "bg-neon-blue" : "bg-slate-700"
                                )}
                                style={{ height: `${(i + 1) * 4}px`, opacity: isConnected ? 1 - (i * 0.15) : 0.3 }}
                            />
                        ))}
                    </div>

                    {/* Timestamp */}
                    <div className="text-center">
                        <div className="text-[10px] font-mono text-neon-blue/50 tracking-[0.15em]">
                            AEGIS VISION SENTINEL V3.0
                        </div>
                        <div className="text-[9px] font-mono text-slate-500">
                            7-STAGE PARALLAX AI PIPELINE
                        </div>
                    </div>

                    {/* Grid pattern indicator */}
                    <div className="grid grid-cols-3 gap-0.5">
                        {[...Array(9)].map((_, i) => (
                            <div 
                                key={i} 
                                className={clsx(
                                    "w-1.5 h-1.5 rounded-sm",
                                    isConnected ? "bg-neon-blue/30" : "bg-slate-700/30"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoFeed;
