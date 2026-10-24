/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Cute Light Mode' : 'Switch to Sharp Dark Mode'}
      aria-label="Toggle light and dark theme"
      className={`relative inline-flex items-center transition-all duration-300 focus:outline-none select-none active:scale-95 group ${
        compact
          ? 'p-2 rounded-2xl'
          : 'px-3 py-1.5 rounded-full'
      } ${
        isDark
          ? 'bg-[#131929] border border-[#2D3748] text-cyan-300 hover:border-cyan-500/50 hover:bg-[#1A2236] shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          : 'bg-gradient-to-r from-[#F3F1FD] via-[#FFF1EB] to-[#E6F7F0] border border-[#DDD8FA] text-[#7164ED] hover:border-[#7164ED]/60 shadow-[0_2px_10px_rgba(113,100,237,0.15)] hover:shadow-[0_4px_16px_rgba(113,100,237,0.25)]'
      } ${className}`}
    >
      {compact ? (
        <div className="relative w-5 h-5 flex items-center justify-center">
          {isDark ? (
            <Moon className="w-4 h-4 text-cyan-300 transition-transform duration-300 rotate-0 scale-100 group-hover:-rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-[#F59E0B] transition-transform duration-300 rotate-0 scale-100 group-hover:rotate-45" />
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Animated Toggle Switch Track */}
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
              isDark ? 'bg-[#0B0E17] border border-cyan-500/40' : 'bg-white shadow-inner border border-[#DDD8FA]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-300 transform shadow-xs ${
                isDark
                  ? 'translate-x-4 bg-gradient-to-tr from-cyan-400 to-indigo-400 text-slate-900'
                  : 'translate-x-0 bg-gradient-to-tr from-[#F59E0B] via-[#F97316] to-[#EF4444] text-white'
              }`}
            >
              {isDark ? (
                <Moon className="w-2.5 h-2.5" />
              ) : (
                <Sun className="w-2.5 h-2.5" />
              )}
            </div>
          </div>

          <span
            className={`text-xs font-extrabold tracking-tight transition-colors duration-200 ${
              isDark ? 'text-slate-200' : 'text-[#1E1B4B]'
            }`}
          >
            {isDark ? 'Dark HUD' : 'Pastel Mode'}
          </span>

          {!isDark && (
            <Sparkles className="w-3 h-3 text-[#F59E0B] animate-cute-wiggle" />
          )}
        </div>
      )}
    </button>
  );
};
