/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBus } from '../../context/BusContext';
import { BusId } from '../../types';
import {
  Bus,
  Users,
  Clock,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Activity,
  CheckCircle2,
  WifiOff,
  Navigation,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const {
    currentUser,
    buses,
    passengers,
    notifications,
    simulateBusDelay,
    resumeBusOnTime,
    toggleBusOffline,
    hasDemoData,
    loadDemoData,
    clearDemoData,
    getBoardedCount,
    getWaitingCount,
    setActiveTab,
  } = useBus();

  const busList = Object.values(buses);
  const totalBuses = busList.length;
  const activeBuses = busList.filter((b) => !b.isOffline).length;
  const delayedBuses = busList.filter((b) => b.isDelayed).length;
  const totalBoarded = passengers.filter((p) => p.status === 'boarded').length;
  const totalWaiting = passengers.filter((p) => p.status === 'waiting').length;

  const busThemes: Record<
    BusId,
    {
      pastelBg: string;
      pastelBorder: string;
      accentBg: string;
      tagColor: string;
    }
  > = {
    B1: {
      pastelBg: 'bg-[#F0F7FF]',
      pastelBorder: 'border-[#BAE0FD]',
      accentBg: 'bg-[#3B82F6]',
      tagColor: 'text-[#0284C7]',
    },
    B2: {
      pastelBg: 'bg-[#F0FDF4]',
      pastelBorder: 'border-[#BBF7D0]',
      accentBg: 'bg-[#10B981]',
      tagColor: 'text-[#059669]',
    },
    B3: {
      pastelBg: 'bg-[#FFF7ED]',
      pastelBorder: 'border-[#FED7AA]',
      accentBg: 'bg-[#F97316]',
      tagColor: 'text-[#EA580C]',
    },
    B4: {
      pastelBg: 'bg-[#FAF5FF]',
      pastelBorder: 'border-[#E9D5FF]',
      accentBg: 'bg-[#8B5CF6]',
      tagColor: 'text-[#7C3AED]',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Demo Data Action Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2D245A] via-[#5A4BC8] to-[#806EF0] dark:from-[#15122B] dark:via-[#221B48] dark:to-[#362C6E] text-white shadow-md shadow-[#2D245A]/15 dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] dark:border dark:border-[#2D245A] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle Ambient Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#DDD5FF] block mb-1">
            TRANSPORT CONTROL CENTRE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] tracking-tight">
            Campus Fleet Operations
          </h2>
          <p className="text-xs text-slate-200/90 mt-1 max-w-lg leading-relaxed">
            Administrator: <strong>{currentUser?.name}</strong> · Monitoring 4 continuous bus lines, student queues, and live incident dispatches.
          </p>
        </div>

        {/* Demo Values Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-white/15 dark:bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 relative z-10">
          {!hasDemoData ? (
            <button
              onClick={loadDemoData}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#E6F7F0] dark:bg-emerald-950/80 hover:bg-[#D5F4E7] text-[#059669] dark:text-emerald-300 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#10B981]" />
              <span>Use Demo Values</span>
            </button>
          ) : (
            <button
              onClick={clearDemoData}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#FFF1EB] dark:bg-amber-950/80 hover:bg-[#FFE4D6] text-[#EA580C] dark:text-amber-300 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-[#F97316]" />
              <span>Clear Demo Values</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Attractive Pastel KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Total Buses (Lavender) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              TOTAL BUSES
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-[#1E1B4B] text-[#7164ED] dark:text-[#A78BFA] flex items-center justify-center font-bold">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] font-mono tabular-nums block">
            {totalBuses}
          </strong>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            4 Campus routes
          </span>
        </div>

        {/* 2. Active Buses (Mint) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              ACTIVE BUSES
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold text-[#16A34A] dark:text-emerald-400 font-['Manrope'] font-mono tabular-nums block">
            {activeBuses}
          </strong>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Connected to GPS
          </span>
        </div>

        {/* 3. Boarded Students (Sky Blue) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              BOARDED
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] dark:bg-sky-950/60 text-[#0284C7] dark:text-sky-400 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] font-mono tabular-nums block">
            {totalBoarded}
          </strong>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Currently on board
          </span>
        </div>

        {/* 4. Waiting Students (Peach) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              WAITING
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFEDD5] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold text-[#EA580C] dark:text-amber-400 font-['Manrope'] font-mono tabular-nums block">
            {totalWaiting}
          </strong>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            At pickup stops
          </span>
        </div>

        {/* 5. Delayed Buses (Rose/Coral) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              DELAYED
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                delayedBuses > 0
                  ? 'bg-[#FFE4E6] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <strong
            className={`text-2xl sm:text-3xl font-extrabold font-['Manrope'] font-mono tabular-nums block ${
              delayedBuses > 0 ? 'text-[#E11D48] dark:text-rose-400' : 'text-[#1E1B4B] dark:text-white'
            }`}
          >
            {delayedBuses}
          </strong>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            {delayedBuses > 0 ? 'Action suggested' : 'Nominal timing'}
          </span>
        </div>
      </div>

      {/* Subtle Animated Fleet Status Cards & Operational Controls */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-extrabold text-base text-[#1E1B4B] dark:text-white font-['Manrope']">
              Live Fleet Status & Delay Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate traffic incidents, mark on time, or disconnect telematic feeds to test system resilience.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('manifest')}
            className="text-xs font-bold text-[#7164ED] dark:text-cyan-400 hover:text-[#5A4BC8] dark:hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto transition-colors group"
          >
            <span>View Full Passenger Manifest</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['B1', 'B2', 'B3', 'B4'] as BusId[]).map((busId) => {
            const b = buses[busId];
            const boarded = getBoardedCount(busId);
            const waiting = getWaitingCount(busId);
            const theme = busThemes[busId];
            const progressPercent = Math.round((b.progress || 0) * 100);

            return (
              <div
                key={busId}
                className={`p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(33,24,68,0.06)] transition-all duration-300 space-y-3.5 relative overflow-hidden`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: b.color }}
                    >
                      {busId.replace('B', '0')}
                    </div>
                    <div>
                      <strong className="text-xs font-extrabold text-[#1E1B4B] dark:text-white block leading-tight">
                        {b.label}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {b.name}
                      </span>
                    </div>
                  </div>

                  {/* Clear Status Indicator */}
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      b.isOffline
                        ? 'bg-[#FFE4E6] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400 border border-[#FECDD3] dark:border-rose-900/60'
                        : b.isDelayed
                        ? 'bg-[#FFF7ED] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400 border border-[#FED7AA] dark:border-amber-900/60'
                        : 'bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 border border-[#BBF7D0] dark:border-emerald-900/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        b.isOffline
                          ? 'bg-[#E11D48]'
                          : b.isDelayed
                          ? 'bg-[#EA580C]'
                          : 'bg-[#16A34A] animate-pulse'
                      }`}
                    ></span>
                    <span>{b.status}</span>
                  </span>
                </div>

                {/* Animated Route Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Route progress</span>
                    <span className="font-mono text-[#1E1B4B] dark:text-cyan-300">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: b.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Telemetry Details */}
                <div className="text-xs space-y-1.5 py-2 border-y border-slate-100/80 dark:border-slate-800">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Driver:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{b.driverName || 'Assigned'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Speed / ETA:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                      {b.currentSpeedKmh} km/h · {b.etaMinutes}m
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Passenger Load:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {boarded} aboard · {waiting} waiting
                    </strong>
                  </div>
                </div>

                {/* Simulation Action Controls */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => simulateBusDelay(busId)}
                    className={`px-2.5 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
                      b.isDelayed
                        ? 'bg-[#EA580C] text-white shadow-2xs'
                        : 'bg-[#FFF7ED] dark:bg-amber-950/40 text-[#EA580C] dark:text-amber-400 hover:bg-[#FFEDD5] dark:hover:bg-amber-950/70 border border-[#FED7AA] dark:border-amber-800/50'
                    }`}
                  >
                    {b.isDelayed ? 'Delayed (+7m)' : 'Simulate Delay'}
                  </button>

                  <button
                    onClick={() => resumeBusOnTime(busId)}
                    className="px-2.5 py-2 rounded-xl text-[10px] font-bold bg-[#DCFCE7] dark:bg-emerald-950/40 text-[#16A34A] dark:text-emerald-400 hover:bg-[#BBF7D0] dark:hover:bg-emerald-950/70 border border-[#BBF7D0] dark:border-emerald-800/50 transition-all active:scale-95"
                  >
                    Mark On Time
                  </button>

                  <button
                    onClick={() => toggleBusOffline(busId)}
                    className="col-span-2 px-2.5 py-2 rounded-xl text-[10px] font-bold bg-[#F4F6FB] dark:bg-[#1A2234] hover:bg-slate-200/80 dark:hover:bg-[#242F48] text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-transparent dark:border-[#2A364F]"
                  >
                    <WifiOff className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{b.isOffline ? 'Reconnect Bus' : 'Toggle Teletraffic Offline'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Administrative Activity Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#EDE9FE] dark:bg-[#1E1B4B] text-[#7164ED] dark:text-[#A78BFA] flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-xs text-[#1E1B4B] dark:text-white uppercase tracking-wider">
              Recent System & Audit Activity
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('notifications')}
            className="text-xs font-bold text-[#7164ED] dark:text-cyan-400 hover:text-[#5A4BC8] dark:hover:text-cyan-300 transition-colors"
          >
            Open Full Log →
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#F8F9FE] dark:bg-[#151C2D] border border-[#EAE8FC] dark:border-[#1E2638] flex items-start justify-between gap-3 text-xs hover:border-[#DDD8FA] dark:hover:border-[#2A364F] transition-colors"
            >
              <div>
                <strong className="block font-bold text-[#1E1B4B] dark:text-white">
                  {item.title}
                </strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{item.message}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
