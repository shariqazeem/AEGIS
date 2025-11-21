import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

const VideoFeed = ({ className }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const VIDEO_SERVER_URL = "http://localhost:8000/video_feed";

    useEffect(() => {
        // Check if video server is available
        fetch("http://localhost:8000/health")
            .then(res => {
                if (res.ok) {
                    setIsConnected(true);
                }
            })
            .catch(err => {
                setError("Video server not running. Start: python backend/video_server.py");
                setIsConnected(false);
            });
    }, []);

    return (
        <div className={clsx("relative rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl", className)}>
            {/* Real video stream or placeholder */}
            {isConnected ? (
                <img
                    src={VIDEO_SERVER_URL}
                    alt="Live Feed"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setIsConnected(false)}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-slate-400 font-semibold mb-2">No Video Feed</p>
                        <p className="text-slate-600 text-sm max-w-xs">
                            {error || "Start the video server to see live feed"}
                        </p>
                        <code className="block mt-3 text-xs text-emerald-400 bg-slate-900/50 px-3 py-2 rounded border border-slate-700">
                            python backend/video_server.py
                        </code>
                    </div>
                </div>
            )}

            {/* Overlay UI */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <div className={clsx(
                    "flex items-center gap-1.5 px-2 py-1 border rounded backdrop-blur-md",
                    isConnected
                        ? "bg-red-500/20 border-red-500/30"
                        : "bg-slate-700/20 border-slate-600/30"
                )}>
                    <div className={clsx(
                        "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]",
                        isConnected
                            ? "bg-red-500 animate-pulse"
                            : "bg-slate-500"
                    )} />
                    <span className={clsx(
                        "text-[10px] font-bold tracking-widest",
                        isConnected ? "text-red-400" : "text-slate-400"
                    )}>
                        {isConnected ? "REC" : "OFF"}
                    </span>
                </div>
                <div className="px-2 py-1 bg-slate-900/50 border border-slate-700/50 rounded backdrop-blur-md">
                    <span className="text-[10px] font-mono text-slate-300">CAM-01 // MAIN_HALL</span>
                </div>
            </div>

            {/* Crosshairs / HUD Elements - Only show when connected */}
            {isConnected && (
                <div className="absolute inset-4 border border-white/10 rounded-lg pointer-events-none">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white/50 rounded-full" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoFeed;
