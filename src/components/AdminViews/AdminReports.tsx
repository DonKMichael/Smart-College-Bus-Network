/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { FileText, CheckCircle2 } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { reports, updateReportStatus } = useBus();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In progress' | 'Resolved'>('All');

  const filtered = reports.filter((r) => {
    if (statusFilter === 'All') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-[#1E1B4B] text-[#7164ED] dark:text-[#A78BFA] flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight">
              Incident Reports & Student Help Tickets
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review incoming student emergency requests, driver breakdown reports, and delay tickets.
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F6FB] dark:bg-[#161F31] rounded-2xl border border-slate-200/80 dark:border-[#26354D]">
          {(['All', 'Open', 'In progress', 'Resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                statusFilter === tab
                  ? 'bg-white dark:bg-[#1E293B] text-[#7164ED] dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] text-center text-slate-400 text-xs">
            No incident reports matching status filter.
          </div>
        ) : (
          filtered.map((report) => (
            <div
              key={report.id}
              className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111625] border transition-all duration-200 shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 ${
                report.priority === 'Urgent'
                  ? 'border-[#FECDD3] dark:border-rose-900/60 bg-gradient-to-r from-white via-white to-[#FFF1F2] dark:from-[#111625] dark:via-[#111625] dark:to-[#2A0F17]'
                  : 'border-[#E8E6F8] dark:border-[#1E2638]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      report.priority === 'Urgent'
                        ? 'bg-[#FFE4E6] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400 border border-[#FECDD3] dark:border-rose-900/60'
                        : 'bg-[#F4F6FB] dark:bg-[#1A2234] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {report.priority.toUpperCase()}
                  </span>
                  <strong className="text-xs font-extrabold text-[#1E1B4B] dark:text-white">
                    {report.type}
                  </strong>
                  <span className="text-xs font-bold text-slate-400">·</span>
                  <span className="text-xs font-bold text-[#7164ED] dark:text-cyan-400">
                    {report.busLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      report.status === 'Resolved'
                        ? 'bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 border border-[#BBF7D0] dark:border-emerald-800/60'
                        : report.status === 'In progress'
                        ? 'bg-[#FFEDD5] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400 border border-[#FED7AA] dark:border-amber-800/60'
                        : 'bg-[#FFE4E6] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400 border border-[#FECDD3] dark:border-rose-800/60'
                    }`}
                  >
                    {report.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    {report.time}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="py-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {report.message}
                </p>
                <span className="text-[10px] text-slate-400 mt-1.5 block">
                  Reported by: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{report.studentName}</strong>
                </span>
              </div>

              {/* Resolution Action Controls */}
              <div className="pt-2.5 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 mr-auto font-medium">
                  Update ticket state:
                </span>
                {report.status !== 'In progress' && (
                  <button
                    onClick={() => updateReportStatus(report.id, 'In progress')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FFEDD5] dark:bg-amber-950/40 hover:bg-[#FED7AA] dark:hover:bg-amber-950/70 text-[#EA580C] dark:text-amber-400 border border-[#FED7AA] dark:border-amber-800/50 transition-all active:scale-95"
                  >
                    Mark In Progress
                  </button>
                )}
                {report.status !== 'Resolved' && (
                  <button
                    onClick={() => updateReportStatus(report.id, 'Resolved')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#DCFCE7] dark:bg-emerald-950/40 hover:bg-[#BBF7D0] dark:hover:bg-emerald-950/70 text-[#16A34A] dark:text-emerald-400 border border-[#BBF7D0] dark:border-emerald-800/50 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve Ticket</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
