/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { BusId } from '../../types';
import { Users, Search, MapPin, UserCheck, Clock } from 'lucide-react';

export const AdminManifest: React.FC = () => {
  const { buses, passengers } = useBus();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const busIds: BusId[] = ['B1', 'B2', 'B3', 'B4'];

  const filteredPassengers = passengers.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.stopName.toLowerCase().includes(q) ||
      p.busId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-[#1E1B4B] text-[#7164ED] dark:text-[#A78BFA] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight">
              Passenger Manifest (Grouped by Bus)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete registry of boarded passengers and waiting student queues across all 4 fleet routes.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, stop, or route..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs text-[#1E1B4B] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 focus:border-[#7164ED] dark:focus:border-cyan-400 transition-all bg-white dark:bg-[#161F31] dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Manifest Grouped Cards */}
      <div className="space-y-6">
        {busIds.map((busId) => {
          const bus = buses[busId];
          const busPassengers = filteredPassengers.filter((p) => p.busId === busId);
          const boardedList = busPassengers.filter((p) => p.status === 'boarded');
          const waitingList = busPassengers.filter((p) => p.status === 'waiting');

          return (
            <div
              key={busId}
              className="rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none overflow-hidden hover:border-[#DDD8FA] dark:hover:border-[#2A364F] transition-all duration-200"
            >
              {/* Bus Card Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF9FE] to-white dark:from-[#151D2E] dark:to-[#111625] border-b border-[#F0EEFB] dark:border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-2xl text-white font-black text-xs flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: bus.color }}
                  >
                    {busId.replace('B', '0')}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope']">
                      {bus.label} · {bus.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Assigned Driver: <strong className="dark:text-slate-200">{bus.driverName || 'Not assigned'}</strong> · Status: {bus.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 border border-[#BBF7D0] dark:border-emerald-800/60 text-xs font-bold font-mono tabular-nums flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{boardedList.length} Boarded</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-2xl bg-[#FFEDD5] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400 border border-[#FED7AA] dark:border-amber-800/60 text-xs font-bold font-mono tabular-nums flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{waitingList.length} Waiting</span>
                  </span>
                </div>
              </div>

              {/* Sub-sections: Boarded List vs Waiting List */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Boarded Students (Mint Pastel) */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#16A34A] dark:text-emerald-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      <span>Boarded Students ({boardedList.length})</span>
                    </span>
                  </div>

                  {boardedList.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-3">
                      No students currently boarded on this bus.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {boardedList.map((passenger) => (
                        <div
                          key={passenger.id}
                          className="p-3 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/40 border border-[#DCFCE7] dark:border-emerald-900/50 flex items-center justify-between text-xs hover:border-[#BBF7D0] dark:hover:border-emerald-800 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                            <strong className="font-bold text-[#1E1B4B] dark:text-white">{passenger.name}</strong>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#16A34A] dark:text-emerald-400" />
                            Boarded: {passenger.stopName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Waiting Students (Peach Pastel) */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#EA580C] dark:text-amber-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Waiting for Pickup ({waitingList.length})</span>
                    </span>
                  </div>

                  {waitingList.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-3">
                      No students currently registered at pickup stops for this bus.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {waitingList.map((passenger) => (
                        <div
                          key={passenger.id}
                          className="p-3 rounded-2xl bg-[#FFF7ED] dark:bg-amber-950/40 border border-[#FFEDD5] dark:border-amber-900/50 flex items-center justify-between text-xs hover:border-[#FED7AA] dark:hover:border-amber-800 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span>
                            <strong className="font-bold text-[#1E1B4B] dark:text-white">{passenger.name}</strong>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#EA580C] dark:text-amber-400" />
                            Pickup Stop: {passenger.stopName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
