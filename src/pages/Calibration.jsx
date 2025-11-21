import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';
import { UserGroupIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const ModeCard = ({ title, description, icon: Icon, active, onClick }) => (
    <div
        onClick={onClick}
        className={clsx(
            "cursor-pointer relative p-6 rounded-xl border-2 transition-all duration-300",
            active
                ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
        )}
    >
        <div className={clsx(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors",
            active ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
        )}>
            <Icon className="w-6 h-6" />
        </div>
        <h3 className={clsx("text-lg font-bold mb-2", active ? "text-white" : "text-slate-300")}>{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>

        {active && (
            <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        )}
    </div>
);

const Calibration = () => {
    const [mode, setMode] = useState('human'); // 'human' | 'industrial'
    const [sensitivity, setSensitivity] = useState(50);

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">System Calibration</h1>
                <p className="text-slate-400 mt-2">Configure neural network sensitivity and operational mode.</p>
            </div>

            {/* Mode Selection */}
            <div className="grid grid-cols-2 gap-6">
                <ModeCard
                    title="Human Safety"
                    description="Optimized for pedestrian detection, fall monitoring, and unauthorized access in residential or retail environments."
                    icon={UserGroupIcon}
                    active={mode === 'human'}
                    onClick={() => setMode('human')}
                />
                <ModeCard
                    title="Industrial Watch"
                    description="High-speed defect detection, thermal anomaly monitoring, and machinery safety interlocks."
                    icon={WrenchScrewdriverIcon}
                    active={mode === 'industrial'}
                    onClick={() => setMode('industrial')}
                />
            </div>

            {/* Sensitivity Slider */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-200">Inference Sensitivity</h3>
                        <p className="text-sm text-slate-500">Adjust the confidence threshold for threat detection.</p>
                    </div>
                    <span className="text-2xl font-mono font-bold text-blue-400">{sensitivity}%</span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(e.target.value)}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between mt-2 text-xs text-slate-600 font-mono uppercase tracking-wider">
                    <span>Low Latency</span>
                    <span>Balanced</span>
                    <span>High Accuracy</span>
                </div>
            </div>
        </div>
    );
};

export default Calibration;
