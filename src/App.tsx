/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BusProvider, useBus } from './context/BusContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BroadcastBanner } from './components/BroadcastBanner';
import { LoginScreen } from './components/LoginScreen';
import { LiveMap } from './components/LiveMap';
import { ThemeToggle } from './components/ThemeToggle';

// Student Views
import { StudentOverview } from './components/StudentViews/StudentOverview';
import { StudentMyBus } from './components/StudentViews/StudentMyBus';
import { StudentEmergencyHelp } from './components/StudentViews/StudentEmergencyHelp';

// Driver Views
import { DriverOverview } from './components/DriverViews/DriverOverview';
import { DriverWaitingAhead } from './components/DriverViews/DriverWaitingAhead';
import { DriverBroadcasts } from './components/DriverViews/DriverBroadcasts';

// Admin Views
import { AdminOverview } from './components/AdminViews/AdminOverview';
import { AdminManifest } from './components/AdminViews/AdminManifest';
import { AdminNotifications } from './components/AdminViews/AdminNotifications';
import { AdminReports } from './components/AdminViews/AdminReports';
import { AdminBroadcasts } from './components/AdminViews/AdminBroadcasts';

import { Menu, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, activeTab } = useBus();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // If not logged in, render the Role Selection Login Screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Render role-specific tab content
  const renderTabContent = () => {
    const role = currentUser.role;

    if (role === 'student') {
      switch (activeTab) {
        case 'overview':
          return <StudentOverview />;
        case 'live-map':
          return <LiveMap standalone />;
        case 'my-bus':
          return <StudentMyBus />;
        case 'emergency-help':
          return <StudentEmergencyHelp />;
        default:
          return <StudentOverview />;
      }
    }

    if (role === 'driver') {
      switch (activeTab) {
        case 'overview':
          return <DriverOverview />;
        case 'live-map':
          return <LiveMap standalone fixedBusId={currentUser.assignedBus} />;
        case 'waiting-ahead':
          return <DriverWaitingAhead />;
        case 'broadcasts':
          return <DriverBroadcasts />;
        default:
          return <DriverOverview />;
      }
    }

    if (role === 'admin') {
      switch (activeTab) {
        case 'overview':
          return <AdminOverview />;
        case 'live-map':
          return <LiveMap standalone />;
        case 'manifest':
          return <AdminManifest />;
        case 'notifications':
          return <AdminNotifications />;
        case 'reports':
          return <AdminReports />;
        case 'broadcasts':
          return <AdminBroadcasts />;
        default:
          return <AdminOverview />;
      }
    }

    return null;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8F9FD] dark:bg-[#0B0E17] flex flex-col font-['DM_Sans'] text-[#1E1B4B] dark:text-[#E2E8F0] transition-colors duration-300 relative">
      {/* Light Mode Cute Ambient Floating Glows */}
      {!isDark && (
        <>
          <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#EAE8FC]/60 via-[#DDD9F9]/40 to-transparent blur-3xl pointer-events-none animate-cute-float" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-[#E6F7F0]/60 via-[#FFF1EB]/40 to-transparent blur-3xl pointer-events-none animate-cute-float-reverse" />
        </>
      )}

      {/* Dark Mode Sharp Tech Grid Glows */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-gradient-to-b from-cyan-900/10 via-indigo-950/20 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-t from-purple-950/20 via-blue-950/15 to-transparent blur-3xl pointer-events-none" />
        </>
      )}

      {/* Top Navbar: Fixed at top of viewport */}
      <Navbar />

      {/* Mobile Drawer Toggle Bar */}
      <div className="md:hidden shrink-0 flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#111625] border-b border-[#E8E6F8] dark:border-[#1E2638] z-20 transition-colors">
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 p-2 rounded-xl bg-[#F4F6FB] dark:bg-[#1A2234] active:scale-95 transition-all"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileMenuOpen ? 'Close Menu' : 'Workspace Menu'}</span>
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <span className="text-xs font-extrabold capitalize text-[#7164ED] dark:text-cyan-400 bg-[#F3F1FD] dark:bg-[#1A2236] px-3 py-1 rounded-full border border-[#DDD8FA] dark:border-cyan-500/30">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Main Workspace Frame: Exactly fits available height */}
      <div className="flex-1 min-h-0 flex flex-row overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-[#1E1B4B]/40 dark:bg-black/60 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar: Fixed stationary according to the device length */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform transition-transform md:static md:translate-x-0 md:z-0 h-full shrink-0 flex ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
        </div>

        {/* Content Viewport: Independent vertical scroll container */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-[1600px] w-full mx-auto">
            {/* Priority Emergency Broadcast Banner */}
            <BroadcastBanner />

            {/* Active Tab Screen */}
            {renderTabContent()}

            {/* Footer note */}
            <footer className="mt-12 pt-6 border-t border-[#E8E6F8] dark:border-[#1E2638] text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Smart College Bus Network (SCBN) · 4-Bus Interactive Campus Transit Simulation · No Real GPS Required
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <BusProvider>
        <MainAppContent />
      </BusProvider>
    </ThemeProvider>
  );
}
