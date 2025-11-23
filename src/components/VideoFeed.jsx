import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { VideoCameraIcon, ChevronDownIcon, BeakerIcon } from '@heroicons/react/24/outline';

const VideoFeed = ({ className }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [currentCamera, setCurrentCamera] = useState(null);
    const [isTestMode, setIsTestMode] = useState(false);
    const [showCameraSelect, setShowCameraSelect] = useState(false);

    // Use the same port as the sentinel API (8001)
    const VIDEO_SERVER_URL = "http://localhost:8001/video_feed";

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const res = await fetch("http://localhost:8001/health");
                if (res.ok) {
                    const data = await res.json();
                    if (data.camera_available || data.test_mode) {
                        setIsConnected(true);
                        setIsTestMode(data.test_mode);
                        setError(null);
                    } else {
                        setError("Camera not available");
                        setIsConnected(false);
                    }
                }
            } catch (err) {
                setError("Backend offline - Start vision_sentinel.py");
                setIsConnected(false);
            }
        };

        const fetchCameras = async () => {
            try {
                const res = await fetch("http://localhost:8001/cameras");
                if (res.ok) {
                    const data = await res.json();
                    setCameras(data.cameras || []);
                    setCurrentCamera(data.current);
                    setIsTestMode(data.test_mode);
                }
            } catch (err) {
                // Silent fail for camera list
            }
        };

        checkConnection();
        fetchCameras();
        const interval = setInterval(() => {
            checkConnection();
            fetchCameras();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const selectCamera = async (index) => {
        try {
            const res = await fetch(`http://localhost:8001/cameras/select/${index}`, {
                method: 'POST'
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setCurrentCamera(index);
                    setShowCameraSelect(false);
                }
            }
        } catch (err) {
            console.error("Failed to switch camera:", err);
        }
    };

    return (
        <div className={clsx("relative rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group", className)}>
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-50" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />

            {/* Real video stream or placeholder */}
            {isConnected ? (
                <img
                    src={VIDEO_SERVER_URL}
                    alt="Live Feed"
                    className="absolute inset-0 w-full h-full object-contain opacity-80 mix-blend-screen"
                    onError={() => setIsConnected(false)}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-obsidian">
                    <div className="text-center p-8 relative z-20">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                            <div className="w-16 h-16 rounded-full border border-neon-red/30 flex items-center justify-center">
                                <div className="w-2 h-2 bg-neon-red rounded-full shadow-[0_0_10px_#ff003c]" />
                            </div>
                        </div>
                        <p className="text-neon-red font-mono tracking-widest mb-2 text-sm">SIGNAL LOST</p>
                        <p className="text-slate-500 text-xs font-mono max-w-xs">
                            {error || "ESTABLISHING CONNECTION..."}
                        </p>
                    </div>
                </div>
            )}

            {/* HUD Overlay */}
            <div className="absolute inset-0 z-30 pointer-events-none p-6 flex flex-col justify-between">
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {/* Recording indicator */}
                        <div className={clsx(
                            "flex items-center gap-2 px-3 py-1 border rounded backdrop-blur-md transition-colors duration-300",
                            isConnected
                                ? isTestMode
                                    ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                                    : "bg-neon-red/10 border-neon-red/30 text-neon-red"
                                : "bg-slate-800/50 border-slate-700 text-slate-500"
                        )}>
                            {isTestMode ? (
                                <BeakerIcon className="w-3 h-3" />
                            ) : (
                                <div className={clsx(
                                    "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                                    isConnected ? "bg-neon-red animate-pulse" : "bg-slate-500"
                                )} />
                            )}
                            <span className="text-[10px] font-bold tracking-widest">
                                {isTestMode ? "TEST" : isConnected ? "REC" : "OFFLINE"}
                            </span>
                        </div>

                        {/* Camera selector */}
                        <div className="relative pointer-events-auto">
                            <button
                                onClick={() => setShowCameraSelect(!showCameraSelect)}
                                className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/10 rounded backdrop-blur-md hover:bg-white/10 transition-colors"
                            >
                                <VideoCameraIcon className="w-3 h-3 text-neon-blue" />
                                <span className="text-[10px] font-mono text-neon-blue tracking-widest">
                                    {isTestMode ? "TEST MODE" : `CAM-${String(currentCamera || 0).padStart(2, '0')}`}
                                </span>
                                <ChevronDownIcon className="w-3 h-3 text-neon-blue" />
                            </button>

                            {/* Camera dropdown */}
                            {showCameraSelect && !isTestMode && cameras.length > 0 && (
                                <div className="absolute top-full left-0 mt-1 bg-slate-900/95 border border-white/10 rounded-lg overflow-hidden backdrop-blur-xl shadow-xl min-w-[180px]">
                                    {cameras.map((cam) => (
                                        <button
                                            key={cam.index}
                                            onClick={() => selectCamera(cam.index)}
                                            className={clsx(
                                                "w-full px-3 py-2 text-left text-[10px] font-mono transition-colors",
                                                cam.active
                                                    ? "bg-neon-purple/20 text-neon-purple"
                                                    : "text-slate-300 hover:bg-white/10"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{cam.name}</span>
                                                <span className="text-slate-500">{cam.resolution}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-neon-blue/70 tracking-widest">ISO 800</div>
                        <div className="text-[10px] font-mono text-neon-blue/70 tracking-widest">F/2.8</div>
                    </div>
                </div>

                {/* Center Crosshair */}
                {isConnected && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-neon-blue/30 rounded-full flex items-center justify-center opacity-50">
                        <div className="w-1 h-1 bg-neon-blue rounded-full shadow-[0_0_5px_#00f3ff]" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0.5 h-2 bg-neon-blue/50" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-0.5 h-2 bg-neon-blue/50" />
                        <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-2 h-0.5 bg-neon-blue/50" />
                        <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-2 h-0.5 bg-neon-blue/50" />
                    </div>
                )}

                {/* Test Mode Banner */}
                {isTestMode && isConnected && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-16">
                        <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg backdrop-blur-md">
                            <span className="text-[11px] font-mono text-yellow-400 tracking-widest animate-pulse">
                                DEMO MODE - SYNTHETIC SCENARIOS
                            </span>
                        </div>
                    </div>
                )}

                {/* Bottom Bar */}
                <div className="flex justify-between items-end">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-1 h-3 bg-neon-blue/30 rounded-sm" />
                        ))}
                    </div>
                    <div className="text-[10px] font-mono text-neon-blue/50 tracking-[0.2em]">
                        VISION SENTINEL V3.0 // 7-STAGE AI
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoFeed;
