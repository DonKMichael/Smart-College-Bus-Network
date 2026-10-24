/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBus } from '../../context/BusContext';
import { Radio, CheckCircle2 } from 'lucide-react';

export const DriverBroadcasts: React.FC = () => {
  const { currentUser, emergencyBroadcasts, acknowledgeBroadcast } = useBus();
  const userName = currentUser?.name || 'Driver';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400 flex items-center justify-center font-bold border border-transparent dark:border-rose-800/40">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight">
              Emergency Broadcasts Console
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-priority bulletins and route hazard alerts issued by Campus Transport Admin.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#FFE4E6] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400 border border-[#FECDD3] dark:border-rose-800/50">
          PRIORITY FEED
        </span>
      </div>

      {/* Broadcast Feed */}
      <div className="space-y-4">
        {emergencyBroadcasts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] text-center space-y-2.5 shadow-none transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 mx-auto flex items-center justify-center border border-transparent dark:border-emerald-800/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white">
              No Active Emergency Broadcasts
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Campus routes are operating without emergency advisories.
            </p>
          </div>
        ) : (
          emergencyBroadcasts.map((broadcast) => {
            const isAcknowledged = broadcast.acknowledgedBy.includes(userName);
            return (
              <div
                key={broadcast.id}
                className={`p-6 rounded-3xl border transition-all duration-200 shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 ${
                  broadcast.severity === 'urgent'
                    ? 'bg-gradient-to-r from-[#FFF1F2] to-white dark:from-rose-950/40 dark:to-[#111625] border-[#FECDD3] dark:border-rose-900/50'
                    : 'bg-gradient-to-r from-[#FFF7ED] to-white dark:from-amber-950/30 dark:to-[#111625] border-[#FED7AA] dark:border-amber-900/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          broadcast.severity === 'urgent'
                            ? 'bg-[#E11D48] text-white'
                            : 'bg-[#EA580C] text-white'
                        }`}
                      >
                        {broadcast.severity.toUpperCase()} ALERT
                      </span>
                      <h3 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white font-['Manrope']">
                        {broadcast.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        · {broadcast.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {broadcast.message}
                    </p>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-3 font-medium">
                      <span>
                        Originator: <strong className="text-slate-800 dark:text-slate-200">{broadcast.sender}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Acknowledgements: <strong className="text-slate-800 dark:text-slate-200">{broadcast.acknowledgedBy.length}</strong> confirmed
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 sm:self-center">
                    {isAcknowledged ? (
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/60 border border-[#BBF7D0] dark:border-emerald-800/60 text-[#065F46] dark:text-emerald-300 text-xs font-extrabold shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400" />
                        <span>Acknowledged</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => acknowledgeBroadcast(broadcast.id)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shadow-xs active:scale-95 ${
                          broadcast.severity === 'urgent'
                            ? 'bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-rose-500/25'
                            : 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-orange-500/25'
                        }`}
                      >
                        Acknowledge Protocol
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
