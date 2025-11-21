import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    HomeIcon,
    ShieldCheckIcon,
    Cog6ToothIcon,
    VideoCameraIcon
} from '@heroicons/react/24/solid';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
            active
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
        )}
    >
        <Icon className={clsx("w-5 h-5", active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
        <span className="font-medium tracking-wide text-sm">{label}</span>
        {active && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse" />
        )}
    </Link>
);

const MainLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Sidebar */}
            <aside className="w-64 h-full border-r border-slate-800/50 bg-slate-900/50 backdrop-blur-xl flex flex-col">
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                            <VideoCameraIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-wider text-white">AEGIS</h1>
                            <p className="text-[10px] text-blue-400 tracking-[0.2em] uppercase font-semibold">Sentinel System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavItem
                        to="/"
                        icon={HomeIcon}
                        label="Dashboard"
                        active={location.pathname === '/'}
                    />
                    <NavItem
                        to="/vault"
                        icon={ShieldCheckIcon}
                        label="Privacy Vault"
                        active={location.pathname === '/vault'}
                    />
                    <NavItem
                        to="/calibration"
                        icon={Cog6ToothIcon}
                        label="Calibration"
                        active={location.pathname === '/calibration'}
                    />
                </nav>

                {/* Status Footer */}
                <div className="p-4 border-t border-slate-800/50 bg-slate-900/80">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>SYSTEM STATUS</span>
                        <span className="text-emerald-400 font-mono">ONLINE</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2 font-mono">V 2.0.4 // STABLE</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-auto relative">
                {/* Grid Background Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                <div className="relative z-10 p-8 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
