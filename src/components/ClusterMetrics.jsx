import React, { useState, useEffect } from 'react';
import {
    Card,
    Grid,
    Title,
    Text,
    Metric,
    Flex,
    ProgressBar,
    Badge,
    Tracker
} from '@tremor/react';
import { CpuChipIcon, ServerIcon, BoltIcon } from '@heroicons/react/24/outline';

const ClusterMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('http://localhost:8001/metrics');
                if (response.ok) {
                    const data = await response.json();
                    setMetrics(data);
                }
            } catch (e) {
                console.warn('Metrics not available');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading || !metrics) {
        return (
            <Card decoration="top" decorationColor="indigo" className="h-full flex items-center justify-center">
                <Text>Connecting to Parallax Cluster...</Text>
            </Card>
        );
    }

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Prepare data for Tracker (Node Status)
    const trackerData = metrics.cluster.node_status.map((node, index) => ({
        color: node.status === 'active' ? 'emerald' : node.status === 'available' ? 'blue' : 'slate',
        tooltip: `Node ${index}: ${node.status.toUpperCase()}`
    }));

    return (
        <div className="space-y-4">
            {/* Main Cluster Card */}
            <Card decoration="top" decorationColor="indigo" className="bg-slate-950 ring-slate-900">
                <Flex justifyContent="between" alignItems="center" className="mb-4">
                    <div className="flex items-center gap-2">
                        <ServerIcon className="w-5 h-5 text-indigo-500" />
                        <Title className="text-slate-200">PARALLAX CLUSTER</Title>
                    </div>
                    <Badge color="emerald" icon={CpuChipIcon}>
                        {metrics.cluster.nodes}/{metrics.cluster.max_nodes} NODES ACTIVE
                    </Badge>
                </Flex>

                {/* Node Status Tracker */}
                <div className="mb-6">
                    <Text className="mb-2">Cluster Topology</Text>
                    <Tracker data={trackerData} className="mt-2" />
                    <Flex className="mt-2">
                        <Text className="text-xs">Node-0 (Primary)</Text>
                        <Text className="text-xs">Node-6</Text>
                    </Flex>
                </div>

                {/* Active Model Info */}
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 mb-4">
                    <Flex>
                        <Text className="font-mono text-xs text-slate-400">ACTIVE MODEL</Text>
                        <Badge size="xs" color="indigo">{metrics.cluster.node_status[0]?.model || 'None'}</Badge>
                    </Flex>
                </div>

                {/* Performance Metrics Grid */}
                <Grid numItems={2} className="gap-3 mb-4">
                    <Card className="bg-slate-900 ring-0">
                        <Text>Avg Latency</Text>
                        <Metric className="text-indigo-400">{metrics.performance.avg_inference_ms.toFixed(0)}ms</Metric>
                    </Card>
                    <Card className="bg-slate-900 ring-0">
                        <Text>Total Inferences</Text>
                        <Metric className="text-emerald-400">{metrics.performance.total_inferences}</Metric>
                    </Card>
                </Grid>

                {/* Resource Usage */}
                <div className="space-y-3">
                    <div>
                        <Flex>
                            <Text>GPU Utilization</Text>
                            <Text>{metrics.resources.gpu_utilization}%</Text>
                        </Flex>
                        <ProgressBar value={metrics.resources.gpu_utilization} color="indigo" className="mt-2" />
                    </div>
                    <div>
                        <Flex>
                            <Text>Memory Usage</Text>
                            <Text>{metrics.resources.memory_used_mb} MB</Text>
                        </Flex>
                        <ProgressBar value={Math.min(100, metrics.resources.memory_used_mb / 100)} color="emerald" className="mt-2" />
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                    <Text className="font-mono text-xs">
                        UPTIME: <span className="text-emerald-400">{formatUptime(metrics.resources.uptime_seconds)}</span>
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default ClusterMetrics;
