/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBus } from '../../context/BusContext';
import { LiveMap } from '../LiveMap';
import { BusId } from '../../types';
import { Bus, Clock, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';

export const StudentOverview: React.FC = () => {
  const {
    currentUser,
    buses,
    selectedBusId,
    setSelectedBusId,
    studentState,
    studentChoiceBusId,
    setActiveTab,
  } = useBus();

  const chosenBus = buses[selectedBusId || 'B1'];

  return (
    <div className="space-y-6">
      {/* Welcome Banner in Cute Pastel Lavender-Sky Gradient */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#6558D7] via-[#7B6EF6] to-[#A092F4] dark:from-[#211B50] dark:via-[#362B7E] dark:to-[#4C3D9E] dark:border dark:border-[#382D88] text-white shadow-md shadow-[#7164ED]/15 dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Subtle Decorative Ambient Circles */}
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

        <div className="max-w-xl relative z-10">
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/80 block mb-1">
            STUDENT SPACE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] tracking-tight mb-2">
            Welcome back, {currentUser?.name} ✦
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Track all four campus bus lines in real time, check arrival times at your stop, and confirm when you're safely aboard.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('my-bus')}
              className="px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-white dark:bg-cyan-500 text-[#6355DE] dark:text-slate-950 hover:bg-slate-50 dark:hover:bg-cyan-400 transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>Manage My Bus & Boarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('live-map')}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/20 dark:bg-white/10 hover:bg-white/30 text-white transition-all active:scale-95 backdrop-blur-xs"
            >
              Full Screen Map
            </button>
          </div>
        </div>

        {/* Decorative Bus Icon */}
        <div className="absolute right-6 bottom-3 text-7xl sm:text-8xl opacity-20 pointer-events-none select-none">
          🚌
        </div>
      </div>

      {/* 4 Attractive Pastel Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Selected Bus (Sky Blue) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-9 h-9 rounded-2xl bg-[#E0F2FE] dark:bg-sky-950/70 text-[#0284C7] dark:text-sky-400 flex items-center justify-center font-bold text-xs mb-3">
            <Bus className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            SELECTED BUS
          </span>
          <strong className="text-base sm:text-lg font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] block mt-0.5">
            {chosenBus.label}
          </strong>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {chosenBus.name}
          </span>
        </div>

        {/* Simulated ETA (Mint) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-9 h-9 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/70 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            SIMULATED ETA
          </span>
          <strong className="text-base sm:text-lg font-extrabold text-[#16A34A] dark:text-emerald-400 font-['Manrope'] block mt-0.5 font-mono tabular-nums">
            {chosenBus.etaMinutes} min
          </strong>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            To College Gate
          </span>
        </div>

        {/* Route Status (Peach) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-9 h-9 rounded-2xl bg-[#FFEDD5] dark:bg-amber-950/70 text-[#EA580C] dark:text-amber-400 flex items-center justify-center font-bold text-xs mb-3">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            ROUTE STATUS
          </span>
          <strong className="text-base sm:text-lg font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] block mt-0.5">
            {chosenBus.status}
          </strong>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Speed {chosenBus.currentSpeedKmh} km/h
          </span>
        </div>

        {/* Boarding State (Lavender) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-9 h-9 rounded-2xl bg-[#EDE9FE] dark:bg-indigo-950/70 text-[#7164ED] dark:text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            BOARDING STATE
          </span>
          <strong className="text-base sm:text-lg font-extrabold text-[#7164ED] dark:text-cyan-400 font-['Manrope'] block mt-0.5 capitalize">
            {studentState === 'boarded' ? 'On Board' : studentState === 'waiting' ? 'Waiting' : 'Not Boarded'}
          </strong>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {studentState === 'boarded' ? `Aboard ${buses[studentChoiceBusId]?.label}` : 'Select your stop'}
          </span>
        </div>
      </div>

      {/* Main Grid: Live Map + Fleet Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Map (Kept Large & Usable) */}
        <div className="lg:col-span-8">
          <LiveMap />
        </div>

        {/* Right Column: 4 Buses Quick Switch with Animated Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-extrabold text-xs text-[#1E1B4B] dark:text-white uppercase tracking-wider">
                All Campus Bus Lines
              </h3>
              <span className="text-[10px] font-extrabold text-[#16A34A] dark:text-emerald-400 bg-[#DCFCE7] dark:bg-emerald-950/60 border border-[#BBF7D0] dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                4 Active
              </span>
            </div>

            <div className="space-y-2.5">
              {(['B1', 'B2', 'B3', 'B4'] as BusId[]).map((id) => {
                const b = buses[id];
                const isSelected = selectedBusId === id;
                const progressPercent = Math.round((b.progress || 0) * 100);

                return (
                  <button
                    key={id}
                    onClick={() => setSelectedBusId(id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 group active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#DDD8FA] dark:border-cyan-500/50 bg-gradient-to-r from-[#F3F1FD] to-[#FAF8FE] dark:from-[#162238] dark:to-[#111A2C] shadow-sm ring-1 ring-[#7164ED]/25 dark:ring-cyan-500/30 -translate-y-0.5'
                        : 'border-[#E8E6F8] dark:border-[#1E2638] hover:border-[#DDD8FA] dark:hover:border-[#2A364F] bg-white dark:bg-[#111625] hover:bg-[#FAF9FE] dark:hover:bg-[#161F31]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-2xs"
                          style={{ backgroundColor: b.color }}
                        >
                          {id.replace('B', '0')}
                        </div>
                        <div>
                          <span className="block text-xs font-extrabold text-[#1E1B4B] dark:text-white">
                            {b.label} · {b.name}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-medium">
                            Driver: {b.driverName || 'Assigned'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            b.isDelayed
                              ? 'bg-[#FFF7ED] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400 border border-[#FED7AA] dark:border-amber-800/60'
                              : 'bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 border border-[#BBF7D0] dark:border-emerald-800/60'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                          ETA {b.etaMinutes}m
                        </span>
                      </div>
                    </div>

                    {/* Mini Progress Bar on Card */}
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: b.color,
                        }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
