import React, { useEffect } from 'react';
import VideoFeed from '../components/VideoFeed';
import ThreatBadge from '../components/ThreatBadge';
import NeuralLog from '../components/NeuralLog';
import ClusterMetrics from '../components/ClusterMetrics';
import NetworkDiagram from '../components/NetworkDiagram';
import { startSentinel, stopSentinel } from '../services/sentinel';

const Dashboard = () => {
    useEffect(() => {
        startSentinel();
        return () => {
            // stopSentinel();
        };
    }, []);

    return (
        <div className="grid grid-cols-12 gap-4 h-full max-h-full overflow-hidden">
            {/* Main Video Feed Area */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden">
                <div className="flex-1 relative rounded-xl overflow-hidden border border-neon-blue/20 shadow-[0_0_30px_rgba(0,243,255,0.1)] bg-black/50 min-h-0">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-blue z-20" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-blue z-20" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-blue z-20" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-blue z-20" />

                    <VideoFeed className="w-full h-full object-contain opacity-90" />
                </div>

                {/* Network Diagram - Data Flow Visualization */}
                <div className="shrink-0">
                    <NetworkDiagram />
                </div>
            </div>

            {/* Sidebar Info Area */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
                {/* Threat Status */}
                <div className="glass-panel p-1 rounded-xl shrink-0">
                    <ThreatBadge />
                </div>

                {/* Cluster Metrics - Parallax Showcase! */}
                <div className="glass-panel p-3 rounded-xl shrink-0 overflow-auto max-h-[40%]">
                    <ClusterMetrics />
                </div>

                {/* Neural Log */}
                <div className="flex-1 min-h-0 glass-panel rounded-xl overflow-hidden flex flex-col relative">
                    <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
                        <span className="font-mono text-xs text-neon-blue tracking-widest">NEURAL_LOG</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        <NeuralLog />
                        {/* Scanline for log */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
