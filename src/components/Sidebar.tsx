/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useBus } from '../context/BusContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  MapPin,
  Users,
  Bell,
  FileText,
  Radio,
  Bus,
  LifeBuoy,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { currentUser, activeTab, setActiveTab, logout, passengers } = useBus();
  const { isDark } = useTheme();

  if (!currentUser) return null;

  const role = currentUser.role;

  // Navigation configuration strictly per role:
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'live-map', label: 'Live Map', icon: MapPin },
          {
            id: 'manifest',
            label: 'Passenger Manifest',
            icon: Users,
            badge: passengers.length > 0 ? String(passengers.length) : undefined,
          },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'broadcasts', label: 'Emergency Broadcasts', icon: Radio },
        ];
      case 'driver':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'live-map', label: 'Live Map', icon: MapPin },
          { id: 'waiting-ahead', label: 'Students Waiting Ahead', icon: Users },
          { id: 'broadcasts', label: 'Emergency Broadcasts', icon: Radio },
        ];
      case 'student':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'live-map', label: 'Live Map', icon: MapPin },
          { id: 'my-bus', label: 'My Bus', icon: Bus },
          { id: 'emergency-help', label: 'Emergency Help', icon: LifeBuoy },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#111625] border-r border-[#E8E6F8] dark:border-[#1E2638] flex flex-col shrink-0 h-full overflow-hidden select-none shadow-[2px_0_12px_rgba(33,24,68,0.02)] dark:shadow-[4px_0_20px_rgba(0,0,0,0.5)] transition-colors duration-300">
      {/* Top section: Workspace Console Badge */}
      <div className="p-4 border-b border-[#F0EEFB] dark:border-[#1E2638] shrink-0">
        <div className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#F3F1FD] to-[#EBF5FE] dark:from-[#182032] dark:to-[#1E2638] border border-[#DDD8FA] dark:border-[#28354D] flex items-center justify-between transition-colors">
          <div>
            <span className="text-[10px] font-extrabold tracking-wider text-[#7164ED] dark:text-cyan-400 uppercase block">
              WORKSPACE
            </span>
            <span className="text-xs font-extrabold text-[#1E1B4B] dark:text-white capitalize">
              {role} Console {currentUser.assignedBus ? `(${currentUser.assignedBus})` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-200/60 dark:ring-emerald-500/20 animate-pulse"></span>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0">
        <div className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 uppercase">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left group active:scale-[0.98] ${
                isActive
                  ? 'bg-gradient-to-r from-[#EDE9FE] to-[#F5F2FF] dark:from-[#1B253A] dark:to-[#172033] text-[#6355DE] dark:text-cyan-300 border border-[#DDD8FA] dark:border-cyan-500/40 shadow-[0_2px_8px_rgba(113,100,237,0.12)] dark:shadow-[0_0_15px_rgba(6,182,212,0.15)] font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#1E1B4B] dark:hover:text-white hover:bg-[#F8F7FD] dark:hover:bg-[#182032]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#7164ED] to-[#8B7DF4] dark:from-cyan-500 dark:to-blue-600 text-white shadow-2xs shadow-[#7164ED]/20'
                      : 'bg-slate-100/80 dark:bg-[#182032] text-slate-500 dark:text-slate-400 group-hover:bg-[#EAE8FC] dark:group-hover:bg-cyan-950/40 group-hover:text-[#7164ED] dark:group-hover:text-cyan-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#EAE8FC] dark:bg-cyan-950/60 text-[#7164ED] dark:text-cyan-300 border border-[#DDD8FA] dark:border-cyan-500/30 tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Logout - Pinned at bottom of sidebar */}
      <div className="p-3 border-t border-[#F0EEFB] dark:border-[#1E2638] bg-[#FAF9FE] dark:bg-[#0E1320] shrink-0 transition-colors">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-[#141B2B] border border-[#E8E6F8] dark:border-[#222E42] shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#EAE8FC] to-[#DDD9F9] dark:from-cyan-950 dark:to-indigo-950 text-[#7164ED] dark:text-cyan-300 flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="block text-xs font-extrabold text-[#1E1B4B] dark:text-white truncate">
                {currentUser.name}
              </span>
              <span className="block text-[10px] font-medium text-slate-400 capitalize">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-[#FFF1EB] dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-[#FDD6C6] dark:hover:border-rose-900/40 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
