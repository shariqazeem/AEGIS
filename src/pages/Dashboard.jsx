import React, { useEffect, useState, useMemo } from 'react';
import VideoFeed from '../components/VideoFeed';
import ThreatBadge from '../components/ThreatBadge';
import NeuralLog from '../components/NeuralLog';
import ClusterMetrics from '../components/ClusterMetrics';
import AIPipeline from '../components/AIPipeline';
import NetworkDiagram from '../components/NetworkDiagram';
import QueryInterface from '../components/QueryInterface';
import DailySummary from '../components/DailySummary';
import CostMetrics from '../components/CostMetrics';
import { startSentinel } from '../services/sentinel';
import { useSystemStore } from '../store/useSystemStore';

// Animated background particles
const ParticleField = () => {
    const particles = useMemo(() => 
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5
        })), []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-neon-blue/20 animate-pulse"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`
                    }}
                />
            ))}
        </div>
    );
};

// Live stats ticker
const LiveStatsTicker = () => {
    const systemInfo = useSystemStore((state) => state.systemInfo);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-6 px-4 py-2 bg-black/40 border-b border-white/5 text-xs font-mono overflow-hidden">
            <div className="flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-400">LIVE</span>
            </div>
            
            <div className="flex items-center gap-4 text-slate-400 whitespace-nowrap animate-marquee">
                <span>⏱ {time.toLocaleTimeString()}</span>
                <span className="text-slate-600">|</span>
                <span>📊 SCANS: <span className="text-neon-blue">{systemInfo.scanCount || 0}</span></span>
                <span className="text-slate-600">|</span>
                <span>⚠️ THREATS: <span className={systemInfo.threatCount > 0 ? 'text-neon-red animate-pulse' : 'text-neon-green'}>{systemInfo.threatCount || 0}</span></span>
                <span className="text-slate-600">|</span>
                <span>🧠 MODEL: <span className="text-neon-purple">{systemInfo.model || 'Qwen3-0.6B'}</span></span>
                <span className="text-slate-600">|</span>
                <span>💰 COST: <span className="text-neon-green">$0.00</span></span>
                <span className="text-slate-600">|</span>
                <span>🔒 PRIVACY: <span className="text-neon-green">100% LOCAL</span></span>
            </div>
        </div>
    );
};

// Competition badge
const CompetitionBadge = () => (
    <div className="absolute top-4 right-4 z-50">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative px-4 py-2 bg-black rounded-lg leading-none flex items-center gap-3">
                <span className="text-yellow-400 text-lg">🏆</span>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Parallax AI Lab</div>
                    <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Competition 2025</div>
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('logs');
    const threatLevel = useSystemStore((state) => state.threatLevel);

    useEffect(() => {
        startSentinel();
    }, []);

    return (
        <div className="relative h-full max-h-full overflow-hidden">
            {/* Animated background */}
            <ParticleField />
            
            {/* Threat level glow effect */}
            {threatLevel === 'CRITICAL' && (
                <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none z-0" />
            )}

            {/* Competition badge */}
            <CompetitionBadge />

            {/* Live stats ticker */}
            <LiveStatsTicker />

            {/* Main grid */}
            <div className="grid grid-cols-12 gap-4 h-[calc(100%-40px)] p-4 overflow-hidden relative z-10">
                {/* Video Feed Area */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden">
                    <div className="flex-1 relative rounded-xl overflow-hidden border-2 border-neon-blue/30 shadow-[0_0_50px_rgba(0,243,255,0.15)] bg-black/50 min-h-0 group">
                        {/* Animated corner brackets */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-neon-blue z-20 transition-all duration-300 group-hover:w-16 group-hover:h-16" />
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-neon-blue z-20 transition-all duration-300 group-hover:w-16 group-hover:h-16" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-neon-blue z-20 transition-all duration-300 group-hover:w-16 group-hover:h-16" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-neon-blue z-20 transition-all duration-300 group-hover:w-16 group-hover:h-16" />

                        {/* Scanning line effect */}
                        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50 animate-scanline" />
                        </div>

                        <VideoFeed className="w-full h-full object-contain" />
                    </div>

                    {/* Network Diagram */}
                    <div className="shrink-0">
                        <NetworkDiagram />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 h-full overflow-hidden">
                    {/* Threat Status */}
                    <div className="glass-panel p-1 rounded-xl shrink-0 border border-white/10 hover:border-neon-blue/30 transition-colors">
                        <ThreatBadge />
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex gap-1 shrink-0">
                        {[
                            { id: 'logs', label: 'NEURAL_LOG', color: 'neon-blue' },
                            { id: 'cluster', label: 'PARALLAX', color: 'neon-purple' },
                            { id: 'ai_intel', label: '🏆 AI_INTEL', color: 'amber-400' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs tracking-wider transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? `bg-${tab.color}/20 text-${tab.color} border border-${tab.color}/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]`
                                        : 'bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-h-0 glass-panel rounded-xl overflow-hidden flex flex-col relative border border-white/5 hover:border-white/10 transition-colors">
                        {activeTab === 'logs' && (
                            <div className="flex-1 overflow-hidden relative">
                                <NeuralLog />
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                            </div>
                        )}
                        
                        {activeTab === 'cluster' && (
                            <div className="flex-1 overflow-auto p-3 space-y-4">
                                <AIPipeline />
                                <ClusterMetrics />
                            </div>
                        )}
                        
                        {activeTab === 'ai_intel' && (
                            <div className="flex-1 overflow-auto p-3 space-y-4">
                                <CostMetrics />
                                <QueryInterface />
                                <DailySummary />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
