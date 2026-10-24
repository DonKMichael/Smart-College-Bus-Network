/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { Bell, Shield, AlertTriangle, User, Info } from 'lucide-react';

export const AdminNotifications: React.FC = () => {
  const { notifications } = useBus();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-[#1E1B4B] text-[#7164ED] dark:text-[#A78BFA] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight">
              Administrative Notification Feed
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit logging: User logins, dispatch commands, telematics status, and incident records (Admin Only).
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F6FB] dark:bg-[#161F31] rounded-2xl border border-slate-200/80 dark:border-[#26354D]">
          {[
            { id: 'all', label: 'All' },
            { id: 'login', label: 'Logins' },
            { id: 'delay', label: 'Delays' },
            { id: 'emergency', label: 'Alerts' },
            { id: 'system', label: 'System' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                filterType === tab.id
                  ? 'bg-white dark:bg-[#1E293B] text-[#7164ED] dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#111625] rounded-3xl border border-[#E8E6F8] dark:border-[#1E2638] text-slate-400 text-xs">
            No notification events matching filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 flex items-start gap-3.5 bg-white dark:bg-[#111625] shadow-[0_4px_20px_rgba(33,24,68,0.02)] dark:shadow-none hover:-translate-y-0.5 hover:border-[#DDD8FA] dark:hover:border-[#2A364F] ${
                item.isCritical
                  ? 'border-[#FECDD3] dark:border-rose-900/60 bg-gradient-to-r from-white to-[#FFF1F2] dark:from-[#111625] dark:to-[#2A0F17]'
                  : 'border-[#E8E6F8] dark:border-[#1E2638]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                  item.type === 'emergency'
                    ? 'bg-[#FFE4E6] dark:bg-rose-950/70 text-[#E11D48] dark:text-rose-400'
                    : item.type === 'delay'
                    ? 'bg-[#FFEDD5] dark:bg-amber-950/70 text-[#EA580C] dark:text-amber-400'
                    : item.type === 'login'
                    ? 'bg-[#E0F2FE] dark:bg-sky-950/70 text-[#0284C7] dark:text-sky-400'
                    : 'bg-[#EDE9FE] dark:bg-indigo-950/70 text-[#7164ED] dark:text-indigo-400'
                }`}
              >
                {item.type === 'emergency' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : item.type === 'delay' ? (
                  <Info className="w-4 h-4" />
                ) : item.type === 'login' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-xs font-extrabold text-[#1E1B4B] dark:text-white">
                    {item.title}
                  </strong>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
                  {item.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
