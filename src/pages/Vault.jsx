import React, { useState } from 'react';
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@tremor/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const mockAlerts = [
    { id: 'EVT-9921', time: '14:22:01', type: 'Person Detected', status: 'SAFE' },
    { id: 'EVT-9922', time: '14:22:05', type: 'Unknown Object', status: 'ANALYZING' },
    { id: 'EVT-9923', time: '14:22:12', type: 'Fire Hazard', status: 'CRITICAL' },
    { id: 'EVT-9924', time: '14:22:45', type: 'Person Detected', status: 'SAFE' },
    { id: 'EVT-9925', time: '14:23:10', type: 'Motion', status: 'SAFE' },
];

const Vault = () => {
    const [isPurging, setIsPurging] = useState(false);

    const handlePurge = () => {
        setIsPurging(true);
        setTimeout(() => setIsPurging(false), 3000);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-end justify-between border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Privacy Vault</h1>
                    <p className="text-slate-400 mt-2">Local-only storage audit. No data leaves this device.</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-wider">ENCRYPTED</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card className="bg-slate-900/50 border-slate-800 ring-0">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-200">Event History</h3>
                        <Badge color="slate">Last 24 Hours</Badge>
                    </div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell className="text-slate-400">Event ID</TableHeaderCell>
                                <TableHeaderCell className="text-slate-400">Timestamp</TableHeaderCell>
                                <TableHeaderCell className="text-slate-400">Classification</TableHeaderCell>
                                <TableHeaderCell className="text-slate-400">Status</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockAlerts.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                    <TableCell className="font-mono text-slate-300">{item.id}</TableCell>
                                    <TableCell className="text-slate-300">{item.time}</TableCell>
                                    <TableCell className="text-slate-300">{item.type}</TableCell>
                                    <TableCell>
                                        <Badge color={item.status === 'CRITICAL' ? 'red' : item.status === 'ANALYZING' ? 'yellow' : 'emerald'}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* The Kill Switch */}
                <div className="mt-12 p-8 border border-red-900/30 rounded-2xl bg-gradient-to-b from-red-950/10 to-red-950/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-red-500">Emergency Data Purge</h2>
                            <p className="text-red-400/60 mt-1 text-sm max-w-md">
                                Irreversibly wipe all local memory, logs, and cached video fragments.
                                This action cannot be undone.
                            </p>
                        </div>

                        <button
                            onClick={handlePurge}
                            disabled={isPurging}
                            className={clsx(
                                "group relative px-8 py-4 rounded-lg font-bold tracking-widest transition-all duration-200 overflow-hidden",
                                isPurging
                                    ? "bg-red-900/50 cursor-wait text-red-300"
                                    : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)]"
                            )}
                        >
                            <div className="relative z-10 flex items-center gap-3">
                                <TrashIcon className="w-5 h-5" />
                                {isPurging ? "SHREDDING..." : "PURGE MEMORY"}
                            </div>

                            {/* Shredding Animation Overlay */}
                            {isPurging && (
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-20 animate-[pulse_0.5s_ease-in-out_infinite]" />
                            )}
                        </button>
                    </div>

                    {isPurging && (
                        <div className="mt-4 h-2 bg-red-900/30 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 animate-[width_3s_ease-in-out_forwards] w-0" style={{ animationName: 'grow' }} />
                            <style>{`
                @keyframes grow {
                  0% { width: 0% }
                  100% { width: 100% }
                }
              `}</style>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Vault;
