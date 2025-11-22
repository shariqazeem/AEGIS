import React, { useEffect } from 'react';
import { Card, AreaChart, Title, Text } from '@tremor/react';
import VideoFeed from '../components/VideoFeed';
import ThreatBadge from '../components/ThreatBadge';
import NeuralLog from '../components/NeuralLog';
import { startSentinel, stopSentinel } from '../services/sentinel';

const chartdata = [
    { date: '00:00', CPU: 12, RAM: 20 },
    { date: '00:01', CPU: 15, RAM: 22 },
    { date: '00:02', CPU: 45, RAM: 25 },
    { date: '00:03', CPU: 32, RAM: 24 },
    { date: '00:04', CPU: 28, RAM: 24 },
    { date: '00:05', CPU: 18, RAM: 22 },
    { date: '00:06', CPU: 14, RAM: 21 },
];

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

                {/* System Load Chart */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden group shrink-0 h-48">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-20 group-hover:opacity-50 transition-opacity" />
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-neon-blue font-mono tracking-wider text-sm">SYSTEM METRICS</h3>
                            <p className="text-slate-500 text-[10px] font-mono">REAL-TIME RESOURCE CONSUMPTION</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                            <span className="text-[9px] text-neon-blue font-mono">LIVE</span>
                        </div>
                    </div>
                    <AreaChart
                        className="h-28"
                        data={chartdata}
                        index="date"
                        categories={["CPU", "RAM"]}
                        colors={["cyan", "emerald"]}
                        showXAxis={false}
                        showYAxis={false}
                        showLegend={true}
                        showGridLines={false}
                        showAnimation={true}
                        curveType="monotone"
                    />
                </div>
            </div>

            {/* Sidebar Info Area */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
                {/* Threat Status */}
                <div className="glass-panel p-1 rounded-xl shrink-0">
                    <ThreatBadge />
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
