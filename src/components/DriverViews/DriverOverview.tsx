/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { LiveMap } from '../LiveMap';
import { BusId } from '../../types';
import { ROUTE_GEOMETRY } from '../../data/routeData';
import {
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  Users,
  MapPin,
  Send,
} from 'lucide-react';

export const DriverOverview: React.FC = () => {
  const {
    currentUser,
    buses,
    driverStartTrip,
    driverPauseTrip,
    driverNextStop,
    driverReportIssue,
    getBoardedCount,
    getWaitingCount,
  } = useBus();

  const assignedBusId: BusId = currentUser?.assignedBus || 'B1';
  const bus = buses[assignedBusId];
  const stops = ROUTE_GEOMETRY[assignedBusId]?.stops || [];

  // Determine current/next stop based on progress
  const numStops = stops.length;
  const currentStopIndex = Math.min(numStops - 1, Math.floor(bus.progress * (numStops - 1)));
  const nextStopIndex = Math.min(numStops - 1, currentStopIndex + 1);
  const currentStopName = stops[currentStopIndex];
  const nextStopName = stops[nextStopIndex];

  const boardedCount = getBoardedCount(assignedBusId);
  const waitingCount = getWaitingCount(assignedBusId);

  // Issue modal / inline report state
  const [showIssueBox, setShowIssueBox] = useState<boolean>(false);
  const [issueType, setIssueType] = useState<string>('Route obstruction');
  const [issueDetails, setIssueDetails] = useState<string>('');
  const [reportedToast, setReportedToast] = useState<boolean>(false);

  const handleSendIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDetails.trim()) return;

    driverReportIssue(assignedBusId, issueType, issueDetails.trim());
    setIssueDetails('');
    setShowIssueBox(false);
    setReportedToast(true);
    setTimeout(() => setReportedToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner in Mint & Sky Blue Gradient */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#059669] via-[#10B981] to-[#0284C7] dark:from-[#0B3528] dark:via-[#0F4A39] dark:to-[#0C3D52] text-white shadow-md shadow-[#059669]/15 dark:shadow-none border border-transparent dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden transition-colors">
        {/* Subtle Ambient Decorative Circles */}
        <div className="absolute right-0 top-0 w-60 h-60 rounded-full bg-white/10 blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/80 block mb-1">
            DRIVER COCKPIT · ASSIGNED VEHICLE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] tracking-tight">
            {bus.label} · {bus.name}
          </h2>
          <p className="text-xs text-white/90 mt-1 max-w-lg leading-relaxed">
            Driver: <strong>{currentUser?.name}</strong> · All actions and metrics are locked to your assigned route.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/25 dark:border-white/20 self-start sm:self-auto relative z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
          <span className="text-xs font-extrabold font-mono tracking-wide">
            {bus.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Driver Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Next Stop (Lavender) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              NEXT STOP
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#7164ED] dark:text-purple-300 flex items-center justify-center font-bold border border-transparent dark:border-purple-800/40">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-sm sm:text-base font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] block truncate">
            {nextStopName}
          </strong>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 block truncate">
            Passed: {currentStopName}
          </span>
        </div>

        {/* Estimated Arrival (Mint) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              ESTIMATED ARRIVAL
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center font-bold border border-transparent dark:border-emerald-800/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-xl sm:text-2xl font-extrabold text-[#16A34A] dark:text-emerald-400 font-mono tabular-nums block">
            {bus.etaMinutes} min
          </strong>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 block">
            To College Gate
          </span>
        </div>

        {/* Cruising Speed (Sky Blue) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              CRUISING SPEED
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] dark:bg-cyan-950/60 text-[#0284C7] dark:text-cyan-400 flex items-center justify-center font-bold border border-transparent dark:border-cyan-800/40">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-xl sm:text-2xl font-extrabold text-[#1E1B4B] dark:text-white font-mono tabular-nums block">
            {bus.currentSpeedKmh} km/h
          </strong>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 block">
            Simulated velocity
          </span>
        </div>

        {/* Passenger Load (Peach) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              PASSENGER LOAD
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFEDD5] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400 flex items-center justify-center font-bold border border-transparent dark:border-amber-800/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-xl sm:text-2xl font-extrabold text-[#1E1B4B] dark:text-white font-mono tabular-nums">
              {boardedCount}
            </strong>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              aboard · <strong className="text-[#EA580C] dark:text-amber-400">{waitingCount}</strong> waiting
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
            Capacity: 30 seats
          </span>
        </div>
      </div>

      {/* Driver Operational Trip Controls Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xs font-extrabold uppercase text-[#1E1B4B] dark:text-white tracking-wider">
              Driver Route Controls · {bus.label}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Control simulation movement for your assigned vehicle or report incidents to dispatch.
            </p>
          </div>
          {reportedToast && (
            <span className="text-xs font-bold text-[#065F46] dark:text-emerald-300 bg-[#DCFCE7] dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-2xl border border-[#BBF7D0] dark:border-emerald-800/60">
              ✓ Incident reported to Admin
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => driverStartTrip(assignedBusId)}
            className="py-3 px-3 rounded-2xl text-xs font-extrabold bg-[#7164ED] dark:bg-indigo-600 hover:bg-[#5D51CE] dark:hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            <span>▶ Start Trip</span>
          </button>
          <button
            onClick={() => driverPauseTrip(assignedBusId)}
            className="py-3 px-3 rounded-2xl text-xs font-extrabold bg-[#F59E0B] dark:bg-amber-600 hover:bg-[#D97706] dark:hover:bg-amber-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>⏸ Pause Trip</span>
          </button>
          <button
            onClick={() => driverNextStop(assignedBusId)}
            className="py-3 px-3 rounded-2xl text-xs font-extrabold bg-[#10B981] dark:bg-emerald-600 hover:bg-[#059669] dark:hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>✓ Confirm Next Stop</span>
          </button>
          <button
            onClick={() => setShowIssueBox((prev) => !prev)}
            className="py-3 px-3 rounded-2xl text-xs font-extrabold bg-[#FFF1EB] dark:bg-amber-950/30 text-[#EA580C] dark:text-amber-400 hover:bg-[#FFE4D6] dark:hover:bg-amber-900/50 border border-[#FDD6C6] dark:border-amber-800/50 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>⚠ Report Issue</span>
          </button>
        </div>

        {/* Issue Report Form Accordion */}
        {showIssueBox && (
          <form
            onSubmit={handleSendIssue}
            className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1E1B4B] dark:text-slate-300 mb-1">
                  Incident Type
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-[#26354D] text-xs font-bold text-[#1E1B4B] dark:text-white bg-white dark:bg-[#161F31] focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-indigo-500/20 transition-colors"
                >
                  <option value="Route obstruction">Route obstruction / Traffic</option>
                  <option value="Bus breakdown">Bus mechanical issue</option>
                  <option value="Safety concern">Safety concern on board</option>
                  <option value="Weather hazard">Severe weather hazard</option>
                  <option value="Other">Other delay</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-extrabold text-[#1E1B4B] dark:text-slate-300 mb-1">
                  Incident Explanation
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={issueDetails}
                    onChange={(e) => setIssueDetails(e.target.value)}
                    placeholder="e.g. Tree branch blocking left lane near Library Junction..."
                    className="flex-1 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-[#26354D] text-xs text-[#1E1B4B] dark:text-white bg-white dark:bg-[#161F31] placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-indigo-500/20 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-2xl bg-[#E11D48] text-white font-extrabold text-xs hover:bg-[#BE123C] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Route Map Focused on Assigned Bus */}
      <div>
        <LiveMap fixedBusId={assignedBusId} />
      </div>
    </div>
  );
};
