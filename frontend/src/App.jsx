import { Card, Badge, Title, Text, Metric, Flex, ProgressBar } from "@tremor/react";
import {
  ExclamationCircleIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
  CpuChipIcon,
  EyeIcon
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

export default function AegisDashboard() {
  const [status, setStatus] = useState({
    analysis: "Initializing neural vision systems...",
    threat: "LOW"
  });
  const [logs, setLogs] = useState([
    { time: "14:02:10", message: "System initialized", level: "info" },
    { time: "14:02:12", message: "Moondream vision model loaded", level: "success" },
    { time: "14:02:15", message: "Parallax orchestrator ready", level: "success" }
  ]);
  const [isConnected, setIsConnected] = useState(false);

  // Poll for AI status every 1 second
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:8000/status");
        const data = await res.json();
        setStatus(data);
        setIsConnected(true);

        // Add new log entry if analysis changed
        if (data.analysis !== status.analysis) {
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          setLogs(prev => [{
            time: timeStr,
            message: data.analysis,
            level: data.threat === "LOW" ? "info" : "warning"
          }, ...prev].slice(0, 10)); // Keep only last 10 logs
        }
      } catch (error) {
        setIsConnected(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status.analysis]);

  const isSafe = status.threat === "LOW";

  return (
    <main className="bg-slate-950 min-h-screen p-6 text-slate-200 font-mono">

      {/* Header */}
      <Flex className="mb-6 items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheckIcon className="w-10 h-10 text-emerald-400" />
            <Title className="text-emerald-400 text-4xl tracking-widest font-bold">
              AEGIS
            </Title>
          </div>
          <Text className="text-slate-500">
            Autonomous Edge Guard & Intelligence System
          </Text>
          <Text className="text-slate-600 text-sm">
            M1 Neural Engine: {isConnected ? "ACTIVE" : "STANDBY"} • Local Inference • Zero Cloud
          </Text>
        </div>

        <div className="flex gap-3">
          <Badge
            size="xl"
            color={isConnected ? "emerald" : "gray"}
            icon={CpuChipIcon}
          >
            {isConnected ? "ONLINE" : "OFFLINE"}
          </Badge>
          <Badge
            size="xl"
            color={isSafe ? "emerald" : "rose"}
            icon={isSafe ? ShieldCheckIcon : ExclamationCircleIcon}
            className={isSafe ? "neon-glow-green" : "neon-glow-red"}
          >
            {status.threat}
          </Badge>
        </div>
      </Flex>

      <div className="grid grid-cols-12 gap-6">

        {/* VIDEO FEED - The Hero Component */}
        <Card className="col-span-8 bg-slate-900 border-slate-800 ring-0">
          <Flex className="mb-3">
            <div>
              <Title className="text-slate-300 flex items-center gap-2">
                <EyeIcon className="w-5 h-5 text-emerald-400" />
                Live Optical Feed
              </Title>
              <Text className="text-slate-500 text-sm">Real-time visual analysis</Text>
            </div>
            <Badge icon={VideoCameraIcon} color="emerald" className="animate-pulse">
              Recording
            </Badge>
          </Flex>

          <div className="relative rounded-lg overflow-hidden border border-slate-700 neon-glow-green">
            {/* MJPEG Stream from Python Backend */}
            {isConnected ? (
              <img
                src="http://localhost:8000/video_feed"
                className="w-full h-[500px] object-cover"
                alt="Live feed"
              />
            ) : (
              <div className="w-full h-[500px] bg-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <VideoCameraIcon className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                  <Text className="text-slate-500">Waiting for backend connection...</Text>
                  <Text className="text-slate-600 text-sm mt-2">
                    Start the Python server at localhost:8000
                  </Text>
                </div>
              </div>
            )}

            {/* Scan line effect */}
            {isConnected && <div className="scan-line" />}

            {/* HUD Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass-card p-4 rounded-lg border border-emerald-500/20">
                <Flex>
                  <div>
                    <Text className="text-xs text-emerald-400 uppercase font-semibold mb-1">
                      Latest Analysis
                    </Text>
                    <div className="text-white font-bold text-base">
                      {status.analysis}
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="text-xs text-slate-400 mb-1">Inference</Text>
                    <Text className="text-emerald-400 font-mono font-bold">~2.1s</Text>
                  </div>
                </Flex>
              </div>
            </div>
          </div>
        </Card>

        {/* SIDEBAR METRICS */}
        <div className="col-span-4 space-y-4">

          {/* Neural Load Card */}
          <Card className="bg-slate-900 border-slate-800">
            <Flex className="mb-2">
              <Title className="text-slate-400 text-sm">Neural Load</Title>
              <CpuChipIcon className="w-5 h-5 text-indigo-400" />
            </Flex>
            <Metric className="text-white text-3xl">42%</Metric>
            <Text className="mt-1 text-slate-500 text-sm">Parallax Node Efficiency</Text>
            <ProgressBar value={42} color="indigo" className="mt-3" />

            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-sm">
              <div>
                <Text className="text-slate-500 text-xs">Vision (Moondream)</Text>
                <Text className="text-white font-mono">28%</Text>
              </div>
              <div>
                <Text className="text-slate-500 text-xs">Reasoning (Llama)</Text>
                <Text className="text-white font-mono">14%</Text>
              </div>
            </div>
          </Card>

          {/* Mode Selector */}
          <Card className="bg-slate-900 border-slate-800">
            <Title className="text-slate-400 text-sm mb-3">Operating Mode</Title>
            <div className="space-y-2">
              <button className="w-full p-3 bg-emerald-500/10 border border-emerald-500 rounded-lg text-left hover:bg-emerald-500/20 transition">
                <Text className="text-emerald-400 font-semibold">🏠 Home Mode</Text>
                <Text className="text-slate-500 text-xs mt-1">Care & Safety Monitoring</Text>
              </button>
              <button className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-left hover:bg-slate-700 transition">
                <Text className="text-slate-400 font-semibold">🏭 Industrial Mode</Text>
                <Text className="text-slate-600 text-xs mt-1">Quality Control & Ops</Text>
              </button>
            </div>
          </Card>

          {/* Event Log */}
          <Card className="bg-slate-900 border-slate-800 h-full">
            <Title className="text-slate-400 text-sm mb-4">System Event Log</Title>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-xs p-2 bg-slate-800/50 rounded border border-slate-700/50 hover:border-slate-600 transition"
                >
                  <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                    log.level === 'warning' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <Text className="text-slate-400 font-mono">{log.time}</Text>
                    <Text className="text-slate-300 break-words">{log.message}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="mt-6 p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <Flex className="text-xs">
          <Text className="text-slate-500">
            AEGIS v0.1.0 • Parallax Competition 2025 • Sovereign AI
          </Text>
          <Text className="text-slate-600">
            {isConnected ? "🟢 Backend Connected" : "🔴 Backend Disconnected"}
          </Text>
        </Flex>
      </div>
    </main>
  );
}
