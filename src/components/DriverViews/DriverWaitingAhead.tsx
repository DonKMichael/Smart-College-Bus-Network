/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBus } from '../../context/BusContext';
import { BusId } from '../../types';
import { ROUTE_GEOMETRY } from '../../data/routeData';
import { Users, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export const DriverWaitingAhead: React.FC = () => {
  const { currentUser, buses, passengers } = useBus();
  const assignedBusId: BusId = currentUser?.assignedBus || 'B1';
  const bus = buses[assignedBusId];
  const stops = ROUTE_GEOMETRY[assignedBusId]?.stops || [];
  const numStops = stops.length;

  // Filter passengers who are:
  // 1. Waiting for this assigned bus
  // 2. Waiting at a stop whose index is AHEAD of the bus's current position along the route
  const waitingPassengers = passengers
    .filter((p) => p.busId === assignedBusId && p.status === 'waiting')
    .map((p) => {
      const stopIdx = stops.indexOf(p.stopName);
      const stopProgress = stopIdx >= 0 ? stopIdx / (numStops - 1) : 0;
      const isAhead = stopProgress >= bus.progress || bus.progress > 0.95;
      return {
        ...p,
        stopIndex: stopIdx,
        isAhead,
      };
    })
    .filter((p) => p.isAhead)
    .sort((a, b) => a.stopIndex - b.stopIndex);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFEDD5] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400 flex items-center justify-center font-bold border border-transparent dark:border-amber-800/40">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight">
              Students Waiting Ahead
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pickup queue for {bus.label} ({bus.name}) · Ordered chronologically by upcoming route stop.
            </p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 rounded-2xl bg-[#FFEDD5] dark:bg-amber-950/60 border border-[#FED7AA] dark:border-amber-800/50 text-[#C2410C] dark:text-amber-300 text-xs font-bold self-start sm:self-auto font-mono tabular-nums">
          {waitingPassengers.length} Pending Pickups Ahead
        </div>
      </div>

      {/* Info Callout in Sky Blue / Dark Cyan */}
      <div className="p-4 rounded-2xl bg-[#EBF5FE] dark:bg-cyan-950/40 border border-[#BAE0FD] dark:border-cyan-800/40 text-[#0369A1] dark:text-cyan-300 text-xs flex items-center gap-2.5 font-medium transition-colors">
        <Clock className="w-4 h-4 text-[#0284C7] dark:text-cyan-400 shrink-0" />
        <span>
          This queue dynamically updates as your bus travels along its route coordinates. Stops already passed drop off this view.
        </span>
      </div>

      {/* Students Waiting Ahead List */}
      <div className="space-y-3">
        {waitingPassengers.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] text-center space-y-2.5 shadow-none transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 mx-auto flex items-center justify-center border border-transparent dark:border-emerald-800/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">
              No Students Currently Waiting Ahead
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
              All scheduled passengers for passed stops have been boarded, or no students are registered at upcoming stops.
            </p>
          </div>
        ) : (
          waitingPassengers.map((passenger, index) => {
            const stopEtaMinutes = Math.max(
              1,
              Math.round(
                ((passenger.stopIndex / (numStops - 1) - bus.progress) * bus.etaMinutes) +
                  (bus.isDelayed ? 7 : 0)
              )
            );

            return (
              <div
                key={passenger.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.02)] dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:border-[#DDD8FA] dark:hover:border-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7164ED] to-[#9A8BF4] dark:from-indigo-600 dark:to-cyan-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                    {index + 1}
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-[#1E1B4B] dark:text-white">
                      {passenger.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#EA580C] dark:text-amber-400" />
                      Waiting at: <strong className="text-slate-800 dark:text-slate-200">{passenger.stopName}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-[#1E1B4B] dark:text-white font-mono tabular-nums">
                      ~{stopEtaMinutes} min arrival
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Pickup Order #{index + 1}
                    </span>
                  </div>
                  <span className="px-3 py-1 text-[10px] font-extrabold uppercase rounded-full bg-[#FFEDD5] dark:bg-amber-950/60 text-[#C2410C] dark:text-amber-300 border border-[#FED7AA] dark:border-amber-800/50">
                    AHEAD
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
