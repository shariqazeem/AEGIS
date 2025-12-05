import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { VideoCameraIcon, ChevronDownIcon, BeakerIcon, SignalIcon } from '@heroicons/react/24/outline';

// Individual camera feed component
const CameraFeed = ({ camera, streamKey, isTestMode, currentScenario, isSingleCamera }) => {
    const [fps, setFps] = useState(30);
    const frameCountRef = useRef(0);

    const VIDEO_URL = `http://localhost:8001/video_feed/${camera.index}?t=${streamKey}`;

    useEffect(() => {
        const fpsInterval = setInterval(() => {
            setFps(Math.min(30, frameCountRef.current));
            frameCountRef.current = 0;
        }, 1000);
        return () => clearInterval(fpsInterval);
    }, []);

    const handleFrameLoad = () => {
        frameCountRef.current++;
    };

    return (
        <div className={clsx(
            "relative rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group",
            isSingleCamera ? "w-full h-full" : "aspect-video"
        )}>
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-20" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)] pointer-events-none z-20" />

            {/* Video stream */}
            <img
                src={VIDEO_URL}
                alt={`Camera ${camera.index} Feed`}
                className="absolute inset-0 w-full h-full object-cover z-10"
                onLoad={handleFrameLoad}
            />

            {/* HUD Overlay */}
            <div className="absolute inset-0 z-30 pointer-events-none p-3 flex flex-col justify-between">
                {/* Top HUD */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        {/* Recording indicator */}
                        <div className={clsx(
                            "flex items-center gap-2 px-2 py-1 border rounded-lg backdrop-blur-md transition-all",
                            isTestMode
                                ? "bg-yellow-500/10 border-yellow-500/30"
                                : "bg-neon-red/10 border-neon-red/30"
                        )}>
                            {isTestMode ? (
                                <BeakerIcon className="w-3 h-3 text-yellow-400" />
                            ) : (
                                <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] bg-neon-red animate-pulse" />
                            )}
                            <span className={clsx(
                                "text-[9px] font-bold tracking-[0.15em]",
                                isTestMode ? "text-yellow-400" : "text-neon-red"
                            )}>
                                {isTestMode ? "DEMO" : "REC"}
                            </span>
                        </div>

                        {/* FPS counter */}
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-white/10 rounded backdrop-blur-md">
                            <SignalIcon className="w-2.5 h-2.5 text-neon-green" />
                            <span className="text-[9px] font-mono text-neon-green">{fps} FPS</span>
                        </div>
                    </div>

                    {/* Camera info */}
                    <div className="text-right">
                        <div className="text-[9px] font-mono text-neon-blue/70 tracking-wider px-2 py-1 bg-black/30 rounded">
                            CAM {camera.index}
                        </div>
                    </div>
                </div>

                {/* Test mode scenario banner */}
                {isTestMode && currentScenario && isSingleCamera && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8">
                        <div className="px-4 py-2 bg-black/70 border border-yellow-500/50 rounded-lg backdrop-blur-md text-center">
                            <span className="text-[9px] font-mono text-yellow-400 tracking-[0.2em] block mb-1">
                                DEMO MODE
                            </span>
                            <span className="text-base font-mono text-white font-bold">
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
                                className="w-1 rounded-sm bg-neon-blue"
                                style={{ height: `${(i + 1) * 3}px`, opacity: 1 - (i * 0.15) }}
                            />
                        ))}
                    </div>

                    {/* Camera name */}
                    <div className="text-center">
                        <div className="text-[9px] font-mono text-neon-blue/60 tracking-[0.1em]">
                            {camera.name || `Camera ${camera.index}`}
                        </div>
                        <div className="text-[8px] font-mono text-slate-500">
                            {camera.resolution}
                        </div>
                    </div>

                    {/* Grid pattern indicator */}
                    <div className="grid grid-cols-3 gap-0.5">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 h-1 rounded-sm bg-neon-blue/30"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VideoFeed = ({ className }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [isTestMode, setIsTestMode] = useState(false);
    const [currentScenario, setCurrentScenario] = useState("");
    const [streamKey, setStreamKey] = useState(0);
    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                // Fetch health status
                const healthRes = await fetch("http://localhost:8001/health");
                if (healthRes.ok) {
                    const healthData = await healthRes.json();
                    setIsTestMode(healthData.test_mode);
                    setCurrentScenario(healthData.current_scenario || "");

                    // Fetch camera list
                    const camerasRes = await fetch("http://localhost:8001/cameras");
                    if (camerasRes.ok) {
                        const camerasData = await camerasRes.json();
                        if (camerasData.cameras && camerasData.cameras.length > 0) {
                            setCameras(camerasData.cameras);
                            setIsConnected(true);
                            setError(null);
                        } else if (healthData.test_mode) {
                            // Test mode with virtual camera
                            setCameras([{ index: 0, name: "Test Camera", resolution: "1280x720", active: true }]);
                            setIsConnected(true);
                            setError(null);
                        } else {
                            setError("No cameras available");
                            setIsConnected(false);
                        }
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

    // Refresh stream periodically
    useEffect(() => {
        if (!isConnected) return;
        const refreshInterval = setInterval(() => {
            setStreamKey(prev => prev + 1);
        }, 60000);
        return () => clearInterval(refreshInterval);
    }, [isConnected]);

    // Determine grid layout based on camera count
    const getGridClass = () => {
        if (cameras.length === 1) return "";
        if (cameras.length === 2) return "grid grid-cols-2 gap-2";
        if (cameras.length <= 4) return "grid grid-cols-2 gap-2";
        if (cameras.length <= 6) return "grid grid-cols-3 gap-2";
        return "grid grid-cols-3 gap-2";
    };

    // If not connected, show the offline screen
    if (!isConnected) {
        return (
            <div className={clsx("relative rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl", className)}>
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
            </div>
        );
    }

    // Single camera - use the original full-size layout
    if (cameras.length === 1) {
        return (
            <div className={clsx("relative", className)}>
                <CameraFeed
                    camera={cameras[0]}
                    streamKey={streamKey}
                    isTestMode={isTestMode}
                    currentScenario={currentScenario}
                    isSingleCamera={true}
                />
            </div>
        );
    }

    // Multiple cameras - display in a grid
    return (
        <div className={clsx("relative", className)}>
            {/* Header for multi-camera view */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <VideoCameraIcon className="w-4 h-4 text-neon-blue" />
                    <span className="text-xs font-mono text-neon-blue tracking-wider">
                        MULTI-CAMERA VIEW
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                        ({cameras.length} cameras)
                    </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                    AEGIS SENTINEL V3.0 | PARALLAX AI
                </div>
            </div>

            {/* Camera grid */}
            <div className={getGridClass()}>
                {cameras.map((camera) => (
                    <CameraFeed
                        key={camera.index}
                        camera={camera}
                        streamKey={streamKey}
                        isTestMode={isTestMode}
                        currentScenario={currentScenario}
                        isSingleCamera={false}
                    />
                ))}
            </div>
        </div>
    );
};

export default VideoFeed;
