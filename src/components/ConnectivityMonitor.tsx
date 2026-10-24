/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useBus } from '../context/BusContext';
import { RefreshCw, X } from 'lucide-react';

export const ConnectivityMonitor: React.FC = () => {
  const {
    connectivityState,
    latencyMs,
    lastSyncTime,
    refreshRequestsCount,
    isRefreshing,
    refreshData,
  } = useBus();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const { active, total, mode } = connectivityState;

  // Visual state mappings matching SCBN spec
  const statusConfig = {
    connected: {
      label: 'Connected',
      fullText: `Network: Connected (${latencyMs} ms)`,
      dotColor: 'bg-[#36c18b]',
      pingColor: 'bg-[#36c18b]',
      chipBg: 'bg-[#EDFFF7] dark:bg-emerald-950/40',
      chipBorder: 'border-[#BCEFD9] dark:border-emerald-600/40',
      chipText: 'text-[#087954] dark:text-emerald-300',
      cardBg: 'bg-gradient-to-r from-[#EDFFF7] to-[#F5FFFB] dark:from-emerald-950/40 dark:to-emerald-900/20',
      cardBorder: 'border-[#C9F0DF] dark:border-emerald-700/50',
      cardIconBg: 'bg-[#D5F8E8] dark:bg-emerald-900/60',
      cardIconColor: 'text-[#15996C] dark:text-emerald-300',
      cardIconChar: '●',
      title: 'Demo connection healthy',
      message: 'All four simulated bus links are available.',
      titleColor: 'text-[#166B51] dark:text-emerald-300',
      subColor: 'text-[#5B8A7A] dark:text-emerald-400',
      badgeBg: 'bg-[#DFF8EB] dark:bg-emerald-900/60',
      badgeText: 'text-[#19865F] dark:text-emerald-300',
    },
    partial: {
      label: 'Partial',
      fullText: `Network: Partial (${latencyMs} ms)`,
      dotColor: 'bg-[#e6a33a]',
      pingColor: 'bg-[#e6a33a]',
      chipBg: 'bg-[#FFF8E9] dark:bg-amber-950/40',
      chipBorder: 'border-[#F4D59C] dark:border-amber-600/40',
      chipText: 'text-[#A66B12] dark:text-amber-300',
      cardBg: 'bg-gradient-to-r from-[#FFF8E9] to-[#FFFDF7] dark:from-amber-950/40 dark:to-amber-900/20',
      cardBorder: 'border-[#F4D59C] dark:border-amber-700/50',
      cardIconBg: 'bg-[#FFF0CF] dark:bg-amber-900/60',
      cardIconColor: 'text-[#AD7519] dark:text-amber-300',
      cardIconChar: '!',
      title: 'Some simulated links are offline',
      message: 'The dashboard is available; one or more bus links are interrupted.',
      titleColor: 'text-[#925B0E] dark:text-amber-300',
      subColor: 'text-[#9E6E26] dark:text-amber-400',
      badgeBg: 'bg-[#FFEEC7] dark:bg-amber-900/60',
      badgeText: 'text-[#925B0E] dark:text-amber-300',
    },
    offline: {
      label: 'Offline',
      fullText: `Network: Offline (${latencyMs} ms)`,
      dotColor: 'bg-[#df6079]',
      pingColor: 'bg-[#df6079]',
      chipBg: 'bg-[#FFF0F3] dark:bg-rose-950/40',
      chipBorder: 'border-[#F5C4CE] dark:border-rose-600/40',
      chipText: 'text-[#B64760] dark:text-rose-300',
      cardBg: 'bg-gradient-to-r from-[#FFF0F3] to-[#FFF9FA] dark:from-rose-950/40 dark:to-rose-900/20',
      cardBorder: 'border-[#F5C4CE] dark:border-rose-700/50',
      cardIconBg: 'bg-[#FFE0E7] dark:bg-rose-900/60',
      cardIconColor: 'text-[#B64760] dark:text-rose-300',
      cardIconChar: '×',
      title: 'All simulated links are offline',
      message: 'The dashboard is local; all bus links are marked offline.',
      titleColor: 'text-[#9E344B] dark:text-rose-300',
      subColor: 'text-[#9E4C5F] dark:text-rose-400',
      badgeBg: 'bg-[#FFD9E1] dark:bg-rose-900/60',
      badgeText: 'text-[#9E344B] dark:text-rose-300',
    },
  }[mode];

  return (
    <>
      {/* Top Bar Connectivity Controls: Strictly No Wrapping */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Connectivity Status Indicator Chip */}
        <button
          onClick={() => setIsModalOpen(true)}
          title="Click to view SCBN networking concepts and diagnostics"
          aria-haspopup="dialog"
          aria-expanded={isModalOpen}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-extrabold whitespace-nowrap shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer ${statusConfig.chipBg} ${statusConfig.chipBorder} ${statusConfig.chipText}`}
        >
          {/* Animated Status Dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusConfig.pingColor} opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.dotColor}`}
            />
          </span>

          {/* Single-line Label & Latency */}
          <span className="whitespace-nowrap font-bold">
            Network: {statusConfig.label}
          </span>
          <span className="font-mono text-[11px] opacity-80 tabular-nums whitespace-nowrap">
            ({latencyMs} ms)
          </span>
        </button>

        {/* Refresh Data Button */}
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          title="Refresh simulated network data"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 bg-[#F0EDFF] hover:bg-[#E5E0FD] dark:bg-[#1E2538] dark:hover:bg-[#28324A] text-[#6558D9] dark:text-cyan-300 border border-[#DDD8FA] dark:border-[#2E3C56] transition-all shadow-2xs hover:shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#7164ED] dark:text-cyan-400' : ''}`}
          />
          <span>{isRefreshing ? 'Refreshing…' : '↻ Refresh Data'}</span>
        </button>
      </div>

      {/* Network Concepts & Connectivity Diagnostics Modal (Exact SCBN Layout from Image) */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#222044]/35 dark:bg-black/60 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Floating Right-Aligned Panel */}
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="network-modal-title"
            className="fixed right-3 sm:right-6 top-[68px] sm:top-[76px] z-50 w-[min(670px,calc(100vw-24px))] max-h-[calc(100vh-84px)] overflow-y-auto rounded-[24px] bg-gradient-to-b from-white via-white to-[#F8FBFF] dark:from-[#131826] dark:via-[#131826] dark:to-[#0F1420] border border-[#E1E5F2] dark:border-[#222C42] p-5 sm:p-6 shadow-[0_28px_90px_rgba(37,35,75,0.22)] dark:shadow-[0_28px_90px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-top-3 duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#85819B] dark:text-slate-400 block mb-1">
                  SCBN NETWORK MONITOR
                </span>
                <h2
                  id="network-modal-title"
                  className="text-2xl font-extrabold font-['Manrope'] text-[#1E1B4B] dark:text-white tracking-tight leading-tight"
                >
                  Connectivity & Network Concepts
                </h2>
                <p className="text-xs text-[#85819B] dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                  Interactive diagnostics for the computer-networking concepts demonstrated in this project.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close network panel"
                className="w-9 h-9 rounded-2xl bg-[#F0EDFF] hover:bg-[#E5E0FD] dark:bg-[#1C2436] dark:hover:bg-[#28344D] text-[#6558D9] dark:text-slate-200 flex items-center justify-center text-xl font-bold transition-all active:scale-90 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Card (Direct replica from reference image) */}
            <div
              className={`mt-4 p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${statusConfig.cardBg} ${statusConfig.cardBorder}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-base ${statusConfig.cardIconBg} ${statusConfig.cardIconColor}`}
                >
                  {statusConfig.cardIconChar}
                </div>
                <div>
                  <b className={`text-sm font-bold block ${statusConfig.titleColor}`}>
                    {statusConfig.title}
                  </b>
                  <span className={`text-xs block mt-0.5 ${statusConfig.subColor}`}>
                    {statusConfig.message}
                  </span>
                </div>
              </div>

              <span
                className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase shrink-0 ${statusConfig.badgeBg} ${statusConfig.badgeText}`}
              >
                SIMULATED
              </span>
            </div>

            {/* 4 Telemetry Metrics Grid (Matching Image 1:1) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42]">
                <small className="text-[9px] font-black tracking-wider uppercase text-slate-400 block">
                  ROUND-TRIP LATENCY
                </small>
                <strong className="text-lg font-extrabold font-['Manrope'] text-[#34315E] dark:text-white block mt-1 font-mono">
                  {latencyMs} ms
                </strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42]">
                <small className="text-[9px] font-black tracking-wider uppercase text-slate-400 block">
                  REFRESH REQUESTS
                </small>
                <strong className="text-lg font-extrabold font-['Manrope'] text-[#34315E] dark:text-white block mt-1 font-mono">
                  {refreshRequestsCount}
                </strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42]">
                <small className="text-[9px] font-black tracking-wider uppercase text-slate-400 block">
                  ACTIVE BUS LINKS
                </small>
                <strong
                  className={`text-lg font-extrabold font-['Manrope'] block mt-1 font-mono ${
                    mode === 'connected'
                      ? 'text-[#15996C] dark:text-emerald-400'
                      : mode === 'partial'
                      ? 'text-[#AD7519] dark:text-amber-400'
                      : 'text-[#B64760] dark:text-rose-400'
                  }`}
                >
                  {active} / {total}
                </strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42]">
                <small className="text-[9px] font-black tracking-wider uppercase text-slate-400 block">
                  LAST SYNC
                </small>
                <strong className="text-lg font-extrabold font-['Manrope'] text-[#34315E] dark:text-white block mt-1 font-mono truncate">
                  {lastSyncTime}
                </strong>
              </div>
            </div>

            {/* Computer Networking Concepts Used Heading */}
            <h3 className="text-sm font-extrabold text-[#333158] dark:text-white font-['Manrope'] mt-5 mb-3">
              Computer networking concepts used
            </h3>

            {/* 6 Concept Cards Grid (2 Columns, Exact Icons and Text from Image) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Client-Server Model */}
              <article className="p-3 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42] flex gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#EFEDFF] dark:bg-[#20283C] text-[#6A5CDD] dark:text-cyan-300 flex items-center justify-center font-bold text-base shrink-0 select-none">
                  ⇄
                </span>
                <div>
                  <b className="text-xs font-bold text-[#1E1B4B] dark:text-white block">
                    Client–server model
                  </b>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    The dashboard acts as a client requesting bus and passenger data. This demo simulates the server response locally.
                  </p>
                </div>
              </article>

              {/* 2. Request-Response Cycle */}
              <article className="p-3 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42] flex gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#E3F9F0] dark:bg-emerald-950/60 text-[#188B68] dark:text-emerald-300 flex items-center justify-center font-bold text-base shrink-0 select-none">
                  ↔
                </span>
                <div>
                  <b className="text-xs font-bold text-[#1E1B4B] dark:text-white block">
                    Request–response cycle
                  </b>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    Refresh Data triggers a simulated request, updates the response time, and redraws dashboard information.
                  </p>
                </div>
              </article>

              {/* 3. Latency / RTT */}
              <article className="p-3 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42] flex gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#FFF0DF] dark:bg-amber-950/60 text-[#B9782D] dark:text-amber-300 flex items-center justify-center font-bold text-base shrink-0 select-none">
                  ◷
                </span>
                <div>
                  <b className="text-xs font-bold text-[#1E1B4B] dark:text-white block">
                    Latency / RTT
                  </b>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    The displayed milliseconds represent simulated round-trip time, not a measured external server ping.
                  </p>
                </div>
              </article>

              {/* 4. Polling & Live Updates */}
              <article className="p-3 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42] flex gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#EFEDFF] dark:bg-indigo-950/60 text-[#6A5CDD] dark:text-indigo-300 flex items-center justify-center font-bold text-base shrink-0 select-none">
                  ⟳
                </span>
                <div>
                  <b className="text-xs font-bold text-[#1E1B4B] dark:text-white block">
                    Polling & live updates
                  </b>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    The interface periodically refreshes simulated bus positions and status to demonstrate live monitoring.
                  </p>
                </div>
              </article>

              {/* 5. Availability Monitoring */}
              <article className="p-3 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42] flex gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#E3F9F0] dark:bg-sky-950/60 text-[#188B68] dark:text-sky-300 flex items-center justify-center font-bold text-base shrink-0 select-none">
                  ⌁
                </span>
                <div>
                  <b className="text-xs font-bold text-[#1E1B4B] dark:text-white block">
                    Availability monitoring
                  </b>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    Bus online/offline states are reflected as active or interrupted simulated links.
                  </p>
                </div>
              </article>

              {/* 6. Data Integrity Across Views */}
              <article className="p-3 rounded-2xl bg-white dark:bg-[#171D2D] border border-[#E8EAF5] dark:border-[#222C42] flex gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#FFF0DF] dark:bg-pink-950/60 text-[#B9782D] dark:text-pink-300 flex items-center justify-center font-bold text-base shrink-0 select-none">
                  ▤
                </span>
                <div>
                  <b className="text-xs font-bold text-[#1E1B4B] dark:text-white block">
                    Data integrity across views
                  </b>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    A shared front-end state keeps the map, fleet summary, waiting lists, and passenger manifest consistent.
                  </p>
                </div>
              </article>
            </div>

            {/* Disclaimer */}
            <p className="mt-4 p-3 rounded-xl bg-[#F3F2FA] dark:bg-[#181F30] text-[11px] text-[#807C9B] dark:text-slate-400 leading-relaxed">
              Demo limitation: this standalone front end does not connect to a real backend, perform a real ping, or measure actual network packets. The connectivity metrics are simulated for demonstration.
            </p>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-[#ECEAF5] dark:border-[#1E283D]">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F0EDFF] hover:bg-[#E5E0FD] dark:bg-[#1E2538] dark:hover:bg-[#28324A] text-[#6558D9] dark:text-cyan-300 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isRefreshing ? 'Refreshing…' : '↻ Run simulated refresh'}
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7164ED] hover:bg-[#6052E2] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Done
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
};
