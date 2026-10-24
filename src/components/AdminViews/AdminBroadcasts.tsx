/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { Radio, Send, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

export const AdminBroadcasts: React.FC = () => {
  const { emergencyBroadcasts, sendEmergencyBroadcast } = useBus();

  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'urgent' | 'warning' | 'info'>('urgent');
  const [sentToast, setSentToast] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendEmergencyBroadcast(title.trim(), message.trim(), severity);
    setTitle('');
    setMessage('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] dark:bg-rose-950/70 text-[#E11D48] dark:text-rose-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight">
              Emergency Broadcast Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compose and transmit high-priority alerts to all bus drivers and commuting students.
            </p>
          </div>
        </div>
      </div>

      {/* Composer Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none">
        <h3 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white font-['Manrope'] mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#E11D48] dark:text-rose-400" />
          <span>Compose New Emergency Broadcast</span>
        </h3>

        {sentToast && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/60 border border-[#BBF7D0] dark:border-emerald-800/60 text-[#065F46] dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0" />
            <span>Emergency broadcast dispatched! Real-time banners active for Drivers and Students.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-white mb-1.5">
                Broadcast Headline / Topic
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Severe Rain Advisory: Reduce Speed on Northern Loop"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs text-[#1E1B4B] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400 transition-all bg-white dark:bg-[#161F31] dark:placeholder-slate-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-white mb-1.5">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs font-bold text-[#1E1B4B] dark:text-white bg-white dark:bg-[#161F31] focus:outline-none focus:ring-2 focus:ring-rose-400/20"
              >
                <option value="urgent">🔴 Urgent / Critical Action</option>
                <option value="warning">🟡 Warning / Route Advisory</option>
                <option value="info">🔵 Informational Notice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-white mb-1.5">
              Broadcast Message Body
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide clear instructions for drivers (speed limits, diversions) and waiting students..."
              className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs text-[#1E1B4B] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400 resize-none bg-white dark:bg-[#161F31] dark:placeholder-slate-500"
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Triggers instant priority banner with acknowledgement action across all user screens
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#E11D48] to-[#F43F5E] hover:shadow-md hover:shadow-rose-500/25 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert to Fleet</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dispatched Broadcasts History */}
      <div className="space-y-3.5">
        <h3 className="font-extrabold text-xs text-[#1E1B4B] dark:text-white uppercase tracking-wider px-1">
          Active Fleet Broadcasts ({emergencyBroadcasts.length})
        </h3>
        {emergencyBroadcasts.map((b) => (
          <div
            key={b.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    b.severity === 'urgent'
                      ? 'bg-[#FFE4E6] dark:bg-rose-950/70 text-[#E11D48] dark:text-rose-400 border border-[#FECDD3] dark:border-rose-900/60'
                      : 'bg-[#FFEDD5] dark:bg-amber-950/70 text-[#EA580C] dark:text-amber-400 border border-[#FED7AA] dark:border-amber-900/60'
                  }`}
                >
                  {b.severity}
                </span>
                <strong className="text-sm font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope']">
                  {b.title}
                </strong>
                <span className="text-xs text-slate-400 font-mono">
                  · {b.time}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-[#F4F6FB] dark:bg-[#1A2234] px-3 py-1 rounded-xl border border-slate-200/60 dark:border-[#2A364F]">
                <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="font-mono tabular-nums">{b.acknowledgedBy.length}</span>
                <span>Acknowledged</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {b.message}
            </p>

            {b.acknowledgedBy.length > 0 && (
              <div className="pt-2 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-2 flex-wrap border-t border-slate-100 dark:border-slate-800">
                <span>Acknowledged by:</span>
                {b.acknowledgedBy.map((user, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 border border-[#BBF7D0] dark:border-emerald-800/60 font-bold"
                  >
                    ✓ {user}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
