/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useBus } from '../context/BusContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { UserRole, BusId } from '../types';
import { Bus, GraduationCap, ShieldCheck, ArrowRight, Sparkles, Navigation } from 'lucide-react';
import { ScbnLogo } from './ScbnLogo';

export const LoginScreen: React.FC = () => {
  const { login } = useBus();
  const { isDark } = useTheme();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [displayName, setDisplayName] = useState<string>('');
  const [driverBus, setDriverBus] = useState<BusId>('B1');
  const [demoPasscode, setDemoPasscode] = useState<string>('demo123');

  const roleConfig: Record<
    UserRole,
    {
      title: string;
      subtitle: string;
      icon: any;
      placeholder: string;
      defaultLabel: string;
      lightBg: string;
      lightBorder: string;
      darkBg: string;
      darkBorder: string;
      accentColor: string;
      darkAccent: string;
    }
  > = {
    student: {
      title: 'Student',
      subtitle: 'Select route, track ETA & board bus',
      icon: GraduationCap,
      placeholder: 'Enter your name or student ID',
      defaultLabel: 'Student',
      lightBg: 'bg-[#F3F1FD]',
      lightBorder: 'border-[#DDD8FA]',
      darkBg: 'bg-[#151D2E]',
      darkBorder: 'border-indigo-500/40',
      accentColor: '#7164ED',
      darkAccent: '#818CF8',
    },
    driver: {
      title: 'Driver',
      subtitle: 'Manage assigned bus trip & waiting list',
      icon: Bus,
      placeholder: 'Enter driver name or vehicle ID',
      defaultLabel: 'Driver',
      lightBg: 'bg-[#E6F7F0]',
      lightBorder: 'border-[#BCECD8]',
      darkBg: 'bg-[#112423]',
      darkBorder: 'border-emerald-500/40',
      accentColor: '#10B981',
      darkAccent: '#34D399',
    },
    admin: {
      title: 'Admin',
      subtitle: 'Fleet oversight, passenger manifest & broadcasts',
      icon: ShieldCheck,
      placeholder: 'Enter transport administrator name or ID',
      defaultLabel: 'Admin',
      lightBg: 'bg-[#FFF1EB]',
      lightBorder: 'border-[#FDD6C6]',
      darkBg: 'bg-[#241A1B]',
      darkBorder: 'border-orange-500/40',
      accentColor: '#F97316',
      darkAccent: '#FB923C',
    },
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = displayName.trim() || roleConfig[selectedRole].defaultLabel;
    login(finalName, selectedRole, selectedRole === 'driver' ? driverBus : undefined);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-[#0B0E17] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative overflow-hidden transition-colors duration-300">
      {/* Light Mode: Cute Animated Moving Bubbles */}
      {!isDark && (
        <>
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#DDD8FA]/50 via-[#BAE0FD]/30 to-transparent blur-3xl pointer-events-none animate-cute-float" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-[#BCECD8]/50 via-[#FDD6C6]/40 to-transparent blur-3xl pointer-events-none animate-cute-float-reverse" />
          <div className="absolute top-1/2 left-4 text-4xl opacity-25 animate-cute-wiggle pointer-events-none select-none">
            ☁️
          </div>
          <div className="absolute bottom-1/4 right-8 text-3xl opacity-25 animate-cute-float pointer-events-none select-none">
            ✨
          </div>
        </>
      )}

      {/* Dark Mode: Sharp Tech Radar Ambiance */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-b from-cyan-900/15 via-indigo-950/25 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-t from-purple-950/25 via-blue-950/20 to-transparent blur-3xl pointer-events-none" />
        </>
      )}

      {/* Top Bar with Theme Toggle on Login Screen */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-2 relative z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            SCBN 4-BUS CAMPUS TRANSIT
          </span>
        </div>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#111625] rounded-3xl border border-[#E8E6F8] dark:border-[#1E2638] shadow-[0_12px_40px_rgba(33,24,68,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden relative z-10 transition-colors duration-300">
        {/* Left Hero Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#2D245A] via-[#5A4BC8] to-[#806EF0] dark:from-[#0D121F] dark:via-[#161F33] dark:to-[#1C2844] p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden transition-colors">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <ScbnLogo size={44} />
              <div>
                <span className="font-extrabold text-sm tracking-widest uppercase block text-white dark:text-cyan-300">
                  SCBN TRANSPORT
                </span>
                <span className="text-[10px] text-white/70 dark:text-slate-400 font-medium block">
                  Smart College Bus Network
                </span>
              </div>
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DDD5FF] dark:text-cyan-400 block mb-2">
              FOUR BUSES · ONE SMART CAMPUS
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] tracking-tight leading-tight mb-4">
              Your ride, <br />
              <span className="text-[#C3B8FF] dark:text-cyan-300">your route.</span>
            </h1>
            <p className="text-xs text-slate-200/90 dark:text-slate-400 leading-relaxed max-w-xs font-medium">
              Real-time multi-bus tracking, passenger manifest management, and campus mobility simulation.
            </p>
          </div>

          {/* Role Access Highlights */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/15 dark:border-white/10 space-y-3">
            <span className="text-[11px] font-extrabold text-white/90 dark:text-slate-300 block">
              Selectable Role Capabilities:
            </span>
            <div className="flex items-center gap-2.5 text-xs text-white/90 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C3B8FF] dark:bg-indigo-400 ring-2 ring-white/20"></span>
              <span>
                <strong>Student:</strong> Live pickup ETA, stop queues & boarding check-in
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-white/90 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A5ECCF] dark:bg-emerald-400 ring-2 ring-white/20"></span>
              <span>
                <strong>Driver:</strong> Assigned bus controls & students waiting ahead
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-white/90 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FED7AA] dark:bg-orange-400 ring-2 ring-white/20"></span>
              <span>
                <strong>Admin:</strong> 4-bus overview, passenger manifest & emergency alerts
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 text-[10px] text-slate-300 dark:text-slate-500 font-medium">
            Front-End Interactive Demo · No Server Secrets Required
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#7164ED] dark:text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 animate-cute-wiggle" />
              <span>WELCOME ABOARD</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#1E1B4B] dark:text-white font-['Manrope'] tracking-tight mt-1">
              Select Your Role & Enter
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose your role and enter your name to access the transportation dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              {(['student', 'driver', 'admin'] as UserRole[]).map((role) => {
                const isSelected = selectedRole === role;
                const info = roleConfig[role];
                const Icon = info.icon;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-2 group active:scale-95 ${
                      isSelected
                        ? isDark
                          ? `${info.darkBg} ${info.darkBorder} shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-2 ring-cyan-500/30 -translate-y-1`
                          : `${info.lightBg} ${info.lightBorder} shadow-sm ring-2 ring-[#7164ED]/20 -translate-y-1`
                        : 'border-[#E8E6F8] dark:border-[#1E2638] bg-white dark:bg-[#141B2B] hover:border-[#DDD8FA] dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-[#1A2338] shadow-2xs'
                            : 'bg-white shadow-2xs'
                          : 'bg-slate-100/80 dark:bg-[#1A2234] text-slate-600 dark:text-slate-400 group-hover:scale-105'
                      }`}
                      style={{ color: isSelected ? (isDark ? info.darkAccent : info.accentColor) : undefined }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-[#1E1B4B] dark:text-white capitalize">
                        {role}
                      </span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-400 font-medium leading-tight mt-0.5">
                        {role === 'student' ? 'Choose bus' : role === 'driver' ? 'Assigned bus' : 'All 4 buses'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Display Name Input */}
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-slate-200 mb-1.5">
                Your Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={roleConfig[selectedRole].placeholder}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#28354D] text-xs text-[#1E1B4B] dark:text-white font-bold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-cyan-500/30 focus:border-[#7164ED] dark:focus:border-cyan-500 transition-all bg-white dark:bg-[#141B2B]"
                required
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                Enter any name or identification for your session
              </span>
            </div>

            {/* Driver Bus Selection (Only visible if Driver role selected) */}
            {selectedRole === 'driver' && (
              <div className="p-3.5 rounded-2xl bg-[#E6F7F0] dark:bg-[#112423] border border-[#BCECD8] dark:border-emerald-500/40 animate-in fade-in duration-200">
                <label className="block text-xs font-extrabold text-[#065F46] dark:text-emerald-300 mb-1">
                  Select Assigned Bus (1 Driver Per Bus)
                </label>
                <select
                  value={driverBus}
                  onChange={(e) => setDriverBus(e.target.value as BusId)}
                  className="w-full px-3 py-2 rounded-xl border border-[#A7F3D0] dark:border-emerald-600/40 bg-white dark:bg-[#141B2B] text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="B1">BUS-01 · Town Route (Blue)</option>
                  <option value="B2">BUS-02 · East Route (Green)</option>
                  <option value="B3">BUS-03 · West Route (Orange)</option>
                  <option value="B4">BUS-04 · North Route (Purple)</option>
                </select>
                <span className="text-[10px] text-[#047857] dark:text-emerald-400 mt-1 block font-medium">
                  Drivers are strictly scoped to their assigned vehicle's console and waiting list.
                </span>
              </div>
            )}

            {/* Demo Passcode */}
            <div>
              <label className="block text-xs font-extrabold text-[#1E1B4B] dark:text-slate-200 mb-1.5">
                Demo Passcode
              </label>
              <input
                type="password"
                value={demoPasscode}
                onChange={(e) => setDemoPasscode(e.target.value)}
                placeholder="Enter any demo passcode"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DDD8FA] dark:border-[#28354D] text-xs text-[#1E1B4B] dark:text-white font-bold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7164ED]/20 dark:focus:ring-cyan-500/30 focus:border-[#7164ED] dark:focus:border-cyan-500 transition-all bg-white dark:bg-[#141B2B]"
                required
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                Presentation mode: any demo passcode is accepted
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs text-white bg-gradient-to-r from-[#7164ED] via-[#8B7DF4] to-[#A092F4] dark:from-cyan-600 dark:via-blue-600 dark:to-indigo-600 hover:shadow-md hover:shadow-[#7164ED]/25 dark:hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span>Enter {selectedRole.toUpperCase()} Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
