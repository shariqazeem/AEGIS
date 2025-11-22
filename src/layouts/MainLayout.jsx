import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    HomeIcon,
    ShieldCheckIcon,
    Cog6ToothIcon,
    VideoCameraIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={clsx(
            "relative flex items-center gap-4 px-4 py-3 my-1 transition-all duration-300 group overflow-hidden",
            active
                ? "text-neon-blue"
                : "text-slate-400 hover:text-white"
        )}
    >
        {/* Active Background Glow */}
        {active && (
            <div className="absolute inset-0 bg-neon-blue/10 border-r-2 border-neon-blue shadow-[inset_10px_0_20px_-10px_rgba(0,243,255,0.3)]" />
        )}

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />

        <Icon className={clsx("w-6 h-6 relative z-10", active ? "text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" : "group-hover:text-white")} />
        <span className={clsx("font-mono text-sm tracking-wider relative z-10", active ? "font-bold" : "font-medium")}>{label}</span>
    </Link>
);

const MainLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex h-screen w-full bg-void text-slate-200 overflow-hidden font-sans selection:bg-neon-blue/30 relative">
            {/* Global Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.05),transparent_70%)] pointer-events-none" />

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

            {/* Sidebar */}
            <aside className="w-20 hover:w-64 transition-all duration-500 ease-out h-full border-r border-white/10 bg-obsidian/90 backdrop-blur-xl flex flex-col z-40 group relative">
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-neon-blue/5 animate-pulse" />
                    <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap px-4 w-full">
                        <div className="w-10 h-10 min-w-[2.5rem] rounded-lg bg-neon-blue/10 border border-neon-blue/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                            <VideoCameraIcon className="w-6 h-6 text-neon-blue" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h1 className="font-bold text-xl tracking-widest text-white font-mono">AEGIS</h1>
                            <p className="text-[10px] text-neon-blue tracking-[0.3em] uppercase">Sentinel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-2 overflow-hidden">
                    <NavItem
                        to="/"
                        icon={HomeIcon}
                        label="COMMAND"
                        active={location.pathname === '/'}
                    />
                    <NavItem
                        to="/vault"
                        icon={ShieldCheckIcon}
                        label="VAULT"
                        active={location.pathname === '/vault'}
                    />
                    <NavItem
                        to="/calibration"
                        icon={CpuChipIcon}
                        label="SYSTEM"
                        active={location.pathname === '/calibration'}
                    />
                </nav>

                {/* Status Footer */}
                <div className="p-4 border-t border-white/10 bg-black/40 overflow-hidden whitespace-nowrap">
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_#0aff68] animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-mono tracking-wider">SYSTEM ONLINE</span>
                            <span className="text-[10px] text-slate-600 font-mono">V 3.0.0 // STABLE</span>
                        </div>
                    </div>
                    {/* Collapsed State Indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_#0aff68] group-hover:opacity-0 transition-opacity duration-300" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-hidden relative flex flex-col">
                {/* Top Bar (Optional, for breadcrumbs or status) */}
                <header className="h-16 border-b border-white/5 bg-obsidian/50 backdrop-blur-sm flex items-center justify-between px-8 z-30">
                    <div className="flex items-center gap-2 text-sm font-mono text-slate-400">
                        <span className="text-neon-blue">root</span>
                        <span>/</span>
                        <span className="text-white tracking-wider uppercase">{location.pathname === '/' ? 'dashboard' : location.pathname.slice(1)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 rounded border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-mono tracking-widest shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                            SECURE CONNECTION
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6 relative z-10 scrollbar-hide">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
