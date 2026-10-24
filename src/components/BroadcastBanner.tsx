/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBus } from '../context/BusContext';
import { CheckCircle2, Radio } from 'lucide-react';

export const BroadcastBanner: React.FC = () => {
  const { currentUser, emergencyBroadcasts, acknowledgeBroadcast } = useBus();

  if (!currentUser) return null;

  // Active unacknowledged or recent broadcasts
  const activeBroadcasts = emergencyBroadcasts.filter((b) => b.isActive);
  if (activeBroadcasts.length === 0) return null;

  return (
    <div className="space-y-2.5 mb-5">
      {activeBroadcasts.map((broadcast) => {
        const isAcknowledged = broadcast.acknowledgedBy.includes(currentUser.name);

        return (
          <div
            key={broadcast.id}
            className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 shadow-[0_4px_20px_rgba(33,24,68,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
              broadcast.severity === 'urgent'
                ? 'bg-gradient-to-r from-[#FFF1F2] to-white dark:from-[#2A0F17] dark:to-[#180A10] border-[#FECDD3] dark:border-[#581C26] text-[#881337] dark:text-rose-200'
                : 'bg-gradient-to-r from-[#FFF7ED] to-white dark:from-[#2A170A] dark:to-[#181008] border-[#FED7AA] dark:border-[#583214] text-[#7C2D12] dark:text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-2xl mt-0.5 shrink-0 ${
                  broadcast.severity === 'urgent'
                    ? 'bg-[#FFE4E6] dark:bg-rose-950/80 text-[#E11D48] dark:text-rose-400'
                    : 'bg-[#FFEDD5] dark:bg-amber-950/80 text-[#EA580C] dark:text-amber-400'
                }`}
              >
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      broadcast.severity === 'urgent'
                        ? 'bg-[#E11D48] text-white'
                        : 'bg-[#EA580C] text-white'
                    }`}
                  >
                    EMERGENCY BROADCAST
                  </span>
                  <span className="text-xs font-extrabold text-[#1E1B4B] dark:text-white">
                    {broadcast.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    · {broadcast.time}
                  </span>
                </div>
                <p className="text-xs mt-1 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {broadcast.message}
                </p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                  Sent by: <strong className="font-bold text-[#1E1B4B] dark:text-white">{broadcast.sender}</strong>
                </span>
              </div>
            </div>

            <div className="sm:self-center shrink-0">
              {isAcknowledged ? (
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/60 border border-[#BBF7D0] dark:border-emerald-800/60 text-[#065F46] dark:text-emerald-300 text-xs font-extrabold shadow-2xs">
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
                  Acknowledge Notice
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
