import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

const VideoFeed = ({ className }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const VIDEO_SERVER_URL = "http://localhost:8000/video_feed";

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const res = await fetch("http://localhost:8000/health");
                if (res.ok) {
                    const data = await res.json();
                    if (data.camera_available) {
                        setIsConnected(true);
                        setError(null);
                    } else {
                        setError("Camera not available");
                        setIsConnected(false);
                    }
                }
            } catch (err) {
                setError("Video server offline");
                setIsConnected(false);
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 5000);
        return () => clearInterval(interval);
    }, []);

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
                        <div className={clsx(
                            "flex items-center gap-2 px-3 py-1 border rounded backdrop-blur-md transition-colors duration-300",
                            isConnected
                                ? "bg-neon-red/10 border-neon-red/30 text-neon-red"
                                : "bg-slate-800/50 border-slate-700 text-slate-500"
                        )}>
                            <div className={clsx(
                                "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                                isConnected ? "bg-neon-red animate-pulse" : "bg-slate-500"
                            )} />
                            <span className="text-[10px] font-bold tracking-widest">
                                {isConnected ? "REC" : "OFFLINE"}
                            </span>
                        </div>
                        <div className="px-3 py-1 bg-black/40 border border-white/10 rounded backdrop-blur-md">
                            <span className="text-[10px] font-mono text-neon-blue tracking-widest">CAM-01 // MAIN_FEED</span>
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

                {/* Bottom Bar */}
                <div className="flex justify-between items-end">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-1 h-3 bg-neon-blue/30 rounded-sm" />
                        ))}
                    </div>
                    <div className="text-[10px] font-mono text-neon-blue/50 tracking-[0.2em]">
                        VISION SENTINEL V3.0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoFeed;
