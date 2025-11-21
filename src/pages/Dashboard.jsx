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
        // Start the brain when dashboard mounts
        startSentinel();
        return () => {
            // Optional: Stop when leaving, or keep running in background
            // stopSentinel(); 
        };
    }, []);

    return (
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-4rem)]">
            {/* Main Video Feed Area */}
            <div className="col-span-8 flex flex-col gap-6">
                <div className="flex-1 relative">
                    <VideoFeed className="w-full h-full" />
                </div>

                {/* System Load Chart */}
                <Card className="bg-slate-900/50 border-slate-800 ring-0">
                    <Title className="text-slate-200">System Load</Title>
                    <Text className="text-slate-500">Real-time resource consumption</Text>
                    <AreaChart
                        className="h-32 mt-4"
                        data={chartdata}
                        index="date"
                        categories={["CPU", "RAM"]}
                        colors={["blue", "emerald"]}
                        showXAxis={false}
                        showYAxis={false}
                        showLegend={true}
                        showGridLines={false}
                        showAnimation={true}
                    />
                </Card>
            </div>

            {/* Sidebar Info Area */}
            <div className="col-span-4 flex flex-col gap-6">
                {/* Threat Status */}
                <ThreatBadge />

                {/* Neural Log */}
                <div className="flex-1 min-h-0">
                    <NeuralLog />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
