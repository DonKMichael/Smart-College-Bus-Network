/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBus } from '../../context/BusContext';
import { BusId } from '../../types';
import { ROUTE_GEOMETRY } from '../../data/routeData';
import { LiveMap } from '../LiveMap';
import { Bus, Clock, MapPin, CheckCircle2, UserCheck } from 'lucide-react';

export const StudentMyBus: React.FC = () => {
  const {
    currentUser,
    buses,
    studentChoiceBusId,
    setStudentChoiceBusId,
    studentSelectedStopIdx,
    setStudentSelectedStopIdx,
    studentState,
    setStudentWaiting,
    setStudentBoarded,
    toggleStudentBoarded,
    calculateStopEta,
  } = useBus();

  const chosenBus = buses[studentChoiceBusId];
  const stops = ROUTE_GEOMETRY[studentChoiceBusId]?.stops || [];
  const currentStopName = stops[studentSelectedStopIdx] || stops[0] || 'Campus Stop';
  const stopEta = calculateStopEta(studentChoiceBusId, studentSelectedStopIdx);

  const handleRouteChange = (busId: BusId) => {
    setStudentChoiceBusId(busId);
    setStudentSelectedStopIdx(0);
  };

  const handleWaitingClick = () => {
    setStudentWaiting(studentChoiceBusId, currentStopName);
  };

  const handleBoardedClick = () => {
    setStudentBoarded(studentChoiceBusId, currentStopName);
  };

  return (
    <div className="space-y-6">
      {/* Header Description */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none transition-colors">
        <h2 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight">
          My Bus & Boarding Console
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select your commute route, set your waiting stop, view live pickup estimates, and toggle your on-board status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route, Stop & Boarding Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none space-y-4 transition-colors">
            <h3 className="font-extrabold text-xs text-[#1E1B4B] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#7164ED] dark:text-cyan-400" />
              <span>Route & Stop Selection</span>
            </h3>

            {/* Bus Route Selector */}
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 mb-1.5">
                Choose Bus Route
              </label>
              <select
                value={studentChoiceBusId}
                onChange={(e) => handleRouteChange(e.target.value as BusId)}
                disabled={studentState === 'boarded'}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs font-bold text-[#1E1B4B] dark:text-white bg-white dark:bg-[#161F31] focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-cyan-500/20 disabled:bg-slate-50 dark:disabled:bg-[#0D121F] disabled:text-slate-400 dark:disabled:text-slate-600 transition-colors"
              >
                <option value="B1">BUS-01 · Town Route (Blue)</option>
                <option value="B2">BUS-02 · East Route (Green)</option>
                <option value="B3">BUS-03 · West Route (Orange)</option>
                <option value="B4">BUS-04 · North Route (Purple)</option>
              </select>
            </div>

            {/* Stop Selector */}
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 mb-1.5">
                Your Pickup Stop
              </label>
              <select
                value={studentSelectedStopIdx}
                onChange={(e) => setStudentSelectedStopIdx(Number(e.target.value))}
                disabled={studentState === 'boarded'}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs font-bold text-[#1E1B4B] dark:text-white bg-white dark:bg-[#161F31] focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-cyan-500/20 disabled:bg-slate-50 dark:disabled:bg-[#0D121F] disabled:text-slate-400 dark:disabled:text-slate-600 transition-colors"
              >
                {stops.slice(0, -1).map((stop, idx) => (
                  <option key={idx} value={idx}>
                    {stop} {idx === 0 ? '(Route Origin)' : ''}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-medium">
                Destination for all routes: <strong className="text-slate-600 dark:text-slate-300">College Gate</strong>
              </span>
            </div>

            {/* Estimated Pickup Callout Card (Pastel Lavender-Sky / Tech Dark) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F3F1FD] via-[#F8FAFF] to-[#EBF5FE] dark:from-[#131B2C] dark:via-[#162238] dark:to-[#0F1626] border border-[#DDD8FA] dark:border-[#26354D] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-[#7164ED] dark:text-cyan-400 tracking-wider">
                  ESTIMATED PICKUP TIME
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#0284C7] dark:text-cyan-300 bg-[#E0F2FE] dark:bg-cyan-950/60 border border-transparent dark:border-cyan-800/40 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  Live calculation
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1E1B4B] dark:text-white">
                  {stopEta} min
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  to {currentStopName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {chosenBus.label} is currently <strong className="text-slate-700 dark:text-slate-200">{chosenBus.status}</strong> moving at {chosenBus.currentSpeedKmh} km/h with Driver {chosenBus.driverName || 'Assigned'}.
              </p>
            </div>

            {/* Action Buttons: "I'm waiting here" & "I have boarded" */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleWaitingClick}
                className={`py-3 px-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  studentState === 'waiting'
                    ? 'bg-[#FFEDD5] dark:bg-amber-950/60 text-[#C2410C] dark:text-amber-300 border border-[#FED7AA] dark:border-amber-700/60 shadow-xs'
                    : 'bg-[#FFF7ED] dark:bg-amber-950/20 text-[#EA580C] dark:text-amber-400 hover:bg-[#FFEDD5] dark:hover:bg-amber-900/40 border border-[#FED7AA] dark:border-amber-800/40'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>📍 I'm waiting here</span>
              </button>
              <button
                type="button"
                onClick={handleBoardedClick}
                className={`py-3 px-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  studentState === 'boarded'
                    ? 'bg-[#10B981] dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#EDE9FE] dark:bg-[#1A2238] text-[#7164ED] dark:text-cyan-300 hover:bg-[#DDD8FA] dark:hover:bg-[#222E48] border border-[#DDD8FA] dark:border-[#2C3B5C]'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>🚌 I have boarded</span>
              </button>
            </div>

            {/* Boarding Switch Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F9FE] dark:bg-[#161F31] hover:bg-[#F3F1FD] dark:hover:bg-[#1C2840] cursor-pointer transition-colors border border-[#E8E6F8] dark:border-[#26354D]">
                <div className="flex items-center gap-2.5">
                  <UserCheck
                    className={`w-4 h-4 ${
                      studentState === 'boarded' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <span className="block text-xs font-extrabold text-[#1E1B4B] dark:text-white">
                      I have boarded this bus
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Toggles boarding state on the admin passenger manifest
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={studentState === 'boarded'}
                  onChange={toggleStudentBoarded}
                  className="w-4 h-4 accent-[#7164ED] dark:accent-cyan-400 rounded-md cursor-pointer"
                />
              </label>
            </div>

            {/* Boarding State Confirmation Card */}
            <div
              className={`p-4 rounded-2xl border text-xs font-medium leading-relaxed transition-all ${
                studentState === 'boarded'
                  ? 'bg-[#DCFCE7] dark:bg-emerald-950/40 border-[#BBF7D0] dark:border-emerald-800/50 text-[#065F46] dark:text-emerald-300'
                  : studentState === 'waiting'
                  ? 'bg-[#FFEDD5] dark:bg-amber-950/40 border-[#FED7AA] dark:border-amber-800/50 text-[#9A3412] dark:text-amber-300'
                  : 'bg-[#F8F9FE] dark:bg-[#161F31] border-[#E8E6F8] dark:border-[#26354D] text-slate-600 dark:text-slate-300'
              }`}
            >
              {studentState === 'boarded' ? (
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-[#065F46] dark:text-emerald-300">
                      You are checked in aboard {chosenBus.label}!
                    </strong>
                    <span>
                      Your seat is marked on the Admin Passenger Manifest. The map is now focused on your bus journey to College Gate.
                    </span>
                  </div>
                </div>
              ) : studentState === 'waiting' ? (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#EA580C] dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-[#9A3412] dark:text-amber-300">
                      Waiting registered at {currentStopName}
                    </strong>
                    <span>
                      Driver {chosenBus.driverName} has been notified of your pickup ahead on {chosenBus.label}.
                    </span>
                  </div>
                </div>
              ) : (
                <span>
                  Select your stop and click <strong className="text-slate-800 dark:text-white">"I'm waiting here"</strong> or toggle <strong className="text-slate-800 dark:text-white">"I have boarded"</strong> once you step onto the bus.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Map focused on selected bus */}
        <div className="lg:col-span-7">
          <LiveMap fixedBusId={studentChoiceBusId} />
        </div>
      </div>
    </div>
  );
};
