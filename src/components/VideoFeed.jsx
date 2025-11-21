import React from 'react';
import { clsx } from 'clsx';

const VideoFeed = ({ className }) => {
    return (
        <div className={clsx("relative rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl", className)}>
            {/* Placeholder for actual video stream */}
            <div className="absolute inset-0 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Overlay UI */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <span className="text-[10px] font-bold text-red-400 tracking-widest">REC</span>
                </div>
                <div className="px-2 py-1 bg-slate-900/50 border border-slate-700/50 rounded backdrop-blur-md">
                    <span className="text-[10px] font-mono text-slate-300">CAM-01 // MAIN_HALL</span>
                </div>
            </div>

            {/* Crosshairs / HUD Elements */}
            <div className="absolute inset-4 border border-white/10 rounded-lg pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white/50 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default VideoFeed;
