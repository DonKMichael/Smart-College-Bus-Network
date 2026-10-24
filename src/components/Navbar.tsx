/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useBus } from '../context/BusContext';
import { ThemeToggle } from './ThemeToggle';
import { ConnectivityMonitor } from './ConnectivityMonitor';
import { ScbnLogo } from './ScbnLogo';
import {
  Clock,
  Play,
  Pause,
  LogOut,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    simulationSpeed,
    setSimulationSpeed,
    isSimulationPaused,
    toggleSimulationPaused,
    hasDemoData,
    loadDemoData,
    clearDemoData,
  } = useBus();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        new Intl.DateTimeFormat(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(now)
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white/95 dark:bg-[#111625]/95 backdrop-blur-md border-b border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_2px_12px_rgba(33,24,68,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-colors duration-300">
      {/* Left: Brand Identity with Modern Circular SCBN Logo */}
      <div className="flex items-center gap-3">
        <ScbnLogo size={40} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-[#1E1B4B] dark:text-white font-['Manrope']">
              SCBN
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 hidden sm:inline">
              Smart College Bus Network
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">
            Campus Fleet Simulation · 4 Connected Routes
          </p>
        </div>
      </div>

      {/* Middle: Live Clock & Simulation Speed Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock with Heartbeat */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F1FD] dark:bg-[#182032] border border-[#DDD8FA] dark:border-[#28354D] text-xs font-medium text-[#1E1B4B] dark:text-slate-200 shadow-2xs transition-colors">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isSimulationPaused ? 'bg-amber-400' : 'bg-emerald-400'
              } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isSimulationPaused ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
          </span>
          <Clock className="w-3.5 h-3.5 text-[#7164ED] dark:text-cyan-400" />
          <span className="font-mono tabular-nums text-xs font-bold text-[#1E1B4B] dark:text-white">
            {currentTime || '08:00:00 AM'}
          </span>
        </div>

        {/* Speed Multiplier & Pause (20x removed) */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-[#F4F6FB] dark:bg-[#182032] rounded-2xl border border-slate-200/80 dark:border-[#28354D] transition-colors">
          <button
            onClick={toggleSimulationPaused}
            title={isSimulationPaused ? 'Resume simulation' : 'Pause simulation'}
            className={`p-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              isSimulationPaused
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#202B42]'
            }`}
          >
            {isSimulationPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          {([1, 2, 5] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => setSimulationSpeed(speed)}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                simulationSpeed === speed
                  ? 'bg-white dark:bg-cyan-500/20 text-[#7164ED] dark:text-cyan-300 shadow-xs border border-transparent dark:border-cyan-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Connectivity Monitor & Refresh Data (Integrated where 20x was located) */}
        <ConnectivityMonitor />

        {/* Demo Values Controls */}
        <div className="flex items-center gap-1.5">
          {!hasDemoData ? (
            <button
              onClick={loadDemoData}
              title="Populate complete sample data (24 boarded, 12 waiting, drivers, delays)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#E6F7F0] dark:bg-emerald-950/40 border border-[#BCECD8] dark:border-emerald-600/40 text-[#059669] dark:text-emerald-300 hover:bg-[#D5F4E7] dark:hover:bg-emerald-900/50 transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#10B981] dark:text-emerald-400 animate-cute-wiggle" />
              <span className="hidden sm:inline">Use demo values</span>
              <span className="sm:hidden">Demo</span>
            </button>
          ) : (
            <button
              onClick={clearDemoData}
              title="Remove sample data and restore clean state"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#FFF1EB] dark:bg-orange-950/40 border border-[#FDD6C6] dark:border-orange-600/40 text-[#EA580C] dark:text-orange-300 hover:bg-[#FFE4D6] dark:hover:bg-orange-900/50 transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F97316] dark:text-orange-400" />
              <span className="hidden sm:inline">Clear demo values</span>
              <span className="sm:hidden">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle, User Profile & Logout */}
      <div className="flex items-center gap-2.5">
        {/* Prominent Theme Toggle Button (Light/Dark) */}
        <ThemeToggle />

        {currentUser && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200/80 dark:border-[#28354D]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#EAE8FC] to-[#DDD9F9] dark:from-[#1E293D] dark:to-[#2B3954] text-[#7164ED] dark:text-cyan-300 flex items-center justify-center font-extrabold text-xs shadow-2xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-extrabold text-[#1E1B4B] dark:text-white leading-tight">
                {currentUser.name}
              </span>
              <span className="block text-[10px] font-medium text-slate-400 dark:text-slate-400 capitalize">
                {currentUser.role} {currentUser.assignedBus ? `· ${currentUser.assignedBus}` : ''}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          title="Sign out of current role"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100/80 dark:bg-[#182032] hover:bg-[#FFF1EB] dark:hover:bg-rose-950/30 rounded-xl transition-all border border-transparent hover:border-[#FDD6C6] dark:hover:border-rose-800/40 active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};
