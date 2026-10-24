/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { BusId } from '../../types';
import { LifeBuoy, AlertTriangle, Phone, CheckCircle2, Shield, Send } from 'lucide-react';

export const StudentEmergencyHelp: React.FC = () => {
  const { submitStudentHelp, buses } = useBus();
  const [issueType, setIssueType] = useState<string>('Missed bus');
  const [selectedBus, setSelectedBus] = useState<BusId>('B1');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    submitStudentHelp(issueType, selectedBus, message.trim());
    setSubmitted(true);
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400 flex items-center justify-center font-bold border border-transparent dark:border-rose-800/40">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight">
              Emergency Help & Student Support
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Contact the campus transportation administration for missed buses, unexpected delays, or route assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice Callout */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FFF1F2] to-[#FFF7ED] dark:from-rose-950/40 dark:to-orange-950/30 border border-[#FECDD3] dark:border-rose-900/50 text-[#881337] dark:text-rose-200 flex items-start gap-3.5 shadow-2xs transition-colors">
        <AlertTriangle className="w-5 h-5 text-[#E11D48] dark:text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed font-medium">
          <strong className="block font-bold mb-0.5 text-[#9F1239] dark:text-rose-300">
            Campus Safety First:
          </strong>
          If you are in immediate personal danger, move to a well-lit, populated campus location and call local emergency services immediately. This help form delivers a simulated real-time ticket to the college Transport Admin console.
        </div>
      </div>

      {/* Contact Directory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Admin Control (Lavender / Dark Violet) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-[#1E1B4B] dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/60 text-[#7164ED] dark:text-purple-300 flex items-center justify-center font-bold border border-transparent dark:border-purple-800/40">
                <Shield className="w-4 h-4" />
              </div>
              <span>Transport Admin Control</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-purple-950/60 text-[#7164ED] dark:text-purple-300 border border-transparent dark:border-purple-800/40">
              Live Desk
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 leading-relaxed">
            In-charge of fleet rescheduling, route diversions, and transit safety tickets.
          </p>
          <div className="text-xs font-semibold text-[#1E1B4B] dark:text-slate-200 bg-[#F8F9FE] dark:bg-[#161F31] p-3 rounded-2xl border border-[#E8E6F8] dark:border-[#26354D] flex items-center justify-between">
            <span>In-App Dispatch:</span>
            <span className="font-mono text-[#7164ED] dark:text-cyan-400 font-bold">Desk ID: SCBN-CTRL-01</span>
          </div>
        </div>

        {/* Bus In-Charge Officer (Mint / Dark Emerald) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-[#1E1B4B] dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center font-bold border border-transparent dark:border-emerald-800/40">
                <Phone className="w-4 h-4" />
              </div>
              <span>Bus In-Charge Officer</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 border border-transparent dark:border-emerald-800/40">
              Radio Duty
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 leading-relaxed">
            On-duty campus transport security for missed stops and student assistance.
          </p>
          <div className="text-xs font-semibold text-[#1E1B4B] dark:text-slate-200 bg-[#F8F9FE] dark:bg-[#161F31] p-3 rounded-2xl border border-[#E8E6F8] dark:border-[#26354D] flex items-center justify-between">
            <span>Radio Channel:</span>
            <span className="font-mono text-[#16A34A] dark:text-emerald-400 font-bold">Ch. 04 (Simulated)</span>
          </div>
        </div>
      </div>

      {/* Help Ticket Submission Form */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111625] border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_4px_20px_rgba(33,24,68,0.03)] dark:shadow-none transition-colors">
        <h3 className="font-extrabold text-sm text-[#1E1B4B] dark:text-white font-['Manrope'] mb-4">
          Submit Help Request / Incident Report
        </h3>

        {submitted && (
          <div className="mb-4 p-4 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/50 border border-[#BBF7D0] dark:border-emerald-800/60 text-[#065F46] dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0" />
            <span>
              Your help request has been transmitted! The Transport Admin has received it in the live Reports console.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 mb-1.5">
                What do you need help with?
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs font-bold text-[#1E1B4B] dark:text-white bg-white dark:bg-[#161F31] focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-rose-500/20 transition-colors"
              >
                <option value="Missed bus">Missed bus</option>
                <option value="Missed stop">Missed stop</option>
                <option value="Bus delay">Bus delay or no-show</option>
                <option value="Safety concern">Safety concern / Personal assistance</option>
                <option value="Contact transport in-charge">Contact transport in-charge</option>
                <option value="Other emergency">Other transit issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 mb-1.5">
                Relevant Bus Route
              </label>
              <select
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value as BusId)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs font-bold text-[#1E1B4B] dark:text-white bg-white dark:bg-[#161F31] focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-rose-500/20 transition-colors"
              >
                {(['B1', 'B2', 'B3', 'B4'] as BusId[]).map((id) => (
                  <option key={id} value={id}>
                    {buses[id].label} · {buses[id].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-slate-300 mb-1.5">
              Explain what happened and your current location:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. I missed the 8:00 AM Town Junction bus due to heavy rain. Waiting at Sports Complex stop..."
              className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#26354D] text-xs text-[#1E1B4B] dark:text-white bg-white dark:bg-[#161F31] font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-rose-500/20 focus:border-[#7164ED] dark:focus:border-rose-400 resize-none transition-colors"
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Direct simulated link to Admin Reports
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#E11D48] to-[#F43F5E] hover:shadow-md hover:shadow-rose-500/25 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Help Request to Admin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
