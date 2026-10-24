/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserRole,
  BusId,
  BusData,
  StudentPassenger,
  NotificationEvent,
  EmergencyBroadcast,
  TransportReport,
  UserSession,
} from '../types';
import {
  INITIAL_BUSES,
  DEMO_DRIVERS,
  DEMO_BOARDED_STUDENTS,
  DEMO_WAITING_STUDENTS,
  ROUTE_GEOMETRY,
} from '../data/routeData';

interface BusContextType {
  // Session & Role Navigation
  currentUser: UserSession | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (name: string, role: UserRole, assignedBus?: BusId) => void;
  logout: () => void;

  // Fleet & Selection
  buses: Record<BusId, BusData>;
  selectedBusId: BusId;
  setSelectedBusId: (id: BusId) => void;

  // Student Actions
  studentState: 'not_selected' | 'waiting' | 'boarded';
  studentChoiceBusId: BusId;
  setStudentChoiceBusId: (id: BusId) => void;
  studentSelectedStopIdx: number;
  setStudentSelectedStopIdx: (idx: number) => void;
  setStudentWaiting: (busId: BusId, stopName: string) => void;
  setStudentBoarded: (busId: BusId, stopName: string) => void;
  toggleStudentBoarded: () => void;

  // Passenger Registries
  passengers: StudentPassenger[];

  // Simulation Controls
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  isSimulationPaused: boolean;
  toggleSimulationPaused: () => void;
  advanceBusToNextStop: (busId: BusId) => void;
  setBusProgress: (busId: BusId, progress: number) => void;

  // Admin Fleet Controls
  simulateBusDelay: (busId: BusId) => void;
  resumeBusOnTime: (busId: BusId) => void;
  toggleBusOffline: (busId: BusId) => void;

  // Driver Trip Controls
  driverStartTrip: (busId: BusId) => void;
  driverPauseTrip: (busId: BusId) => void;
  driverNextStop: (busId: BusId) => void;
  driverReportIssue: (busId: BusId, type: string, message: string) => void;

  // Notifications & Audit Trail
  notifications: NotificationEvent[];
  addNotification: (title: string, message: string, type?: 'system' | 'login' | 'delay' | 'emergency', isCritical?: boolean) => void;

  // Emergency Broadcasts
  emergencyBroadcasts: EmergencyBroadcast[];
  sendEmergencyBroadcast: (title: string, message: string, severity?: 'urgent' | 'warning' | 'info') => void;
  acknowledgeBroadcast: (broadcastId: string) => void;

  // Reports & Student Help Requests
  reports: TransportReport[];
  submitStudentHelp: (type: string, busId: BusId, message: string) => void;
  updateReportStatus: (reportId: string, status: 'Open' | 'In progress' | 'Resolved') => void;

  // Demo Data Controls
  hasDemoData: boolean;
  loadDemoData: () => void;
  clearDemoData: () => void;

  // Helper getters
  getBoardedCount: (busId: BusId) => number;
  getWaitingCount: (busId: BusId) => number;
  calculateStopEta: (busId: BusId, stopIdx: number) => number;

  // Connectivity & Networking Monitor (Simulated)
  latencyMs: number;
  lastSyncTime: string;
  refreshRequestsCount: number;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
  connectivityState: {
    active: number;
    total: number;
    mode: 'connected' | 'partial' | 'offline';
  };
}

const BusContext = createContext<BusContextType | null>(null);

export function BusProvider({ children }: { children: ReactNode }) {
  // Current logged in user session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Buses map
  const [buses, setBuses] = useState<Record<BusId, BusData>>(INITIAL_BUSES);
  const [selectedBusId, setSelectedBusId] = useState<BusId>('B1');

  // Student specific selections
  const [studentChoiceBusId, setStudentChoiceBusId] = useState<BusId>('B1');
  const [studentSelectedStopIdx, setStudentSelectedStopIdx] = useState<number>(0);
  const [studentState, setStudentState] = useState<'not_selected' | 'waiting' | 'boarded'>('not_selected');

  // Passengers list (both boarded and waiting)
  const [passengers, setPassengers] = useState<StudentPassenger[]>([]);

  // Simulation parameters
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isSimulationPaused, setIsSimulationPaused] = useState<boolean>(false);

  // Notifications (Admin audit trail)
  const [notifications, setNotifications] = useState<NotificationEvent[]>([
    {
      id: 'init-1',
      title: 'Fleet System Online',
      message: 'SCBN operational server started. 4 campus routes monitored.',
      time: '07:30 AM',
      type: 'system',
      isCritical: false,
    },
    {
      id: 'init-2',
      title: 'Simulation Loop Active',
      message: 'Automatic road geometry interpolation running at 1x nominal pace.',
      time: '07:31 AM',
      type: 'system',
      isCritical: false,
    },
  ]);

  // Emergency Broadcasts
  const [emergencyBroadcasts, setEmergencyBroadcasts] = useState<EmergencyBroadcast[]>([
    {
      id: 'bcast-sample',
      title: 'Campus North Road Construction Notice',
      message: 'North perimeter drive roadwork in progress. BUS-04 will utilize the inner campus bypass.',
      time: '08:00 AM',
      severity: 'warning',
      sender: 'Transport Control Centre',
      acknowledgedBy: [],
      isActive: true,
    },
  ]);

  // Reports
  const [reports, setReports] = useState<TransportReport[]>([
    {
      id: 'rep-1',
      type: 'Road Construction',
      busId: 'B3',
      busLabel: 'BUS-03',
      studentName: 'Driver Ryan Joseph',
      message: 'Heavy morning congestion near West End Church crossing.',
      time: '07:45 AM',
      status: 'In progress',
      priority: 'Normal',
      isDemo: true,
    },
  ]);

  const [hasDemoData, setHasDemoData] = useState<boolean>(false);

  // Simulated Connectivity & Network Diagnostics
  const [latencyMs, setLatencyMs] = useState<number>(194);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() =>
    new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date())
  );
  const [refreshRequestsCount, setRefreshRequestsCount] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Derive availability from simulated bus link status
  const busList = Object.values(buses);
  const activeBusLinks = busList.filter((b) => !b.isOffline).length;
  const totalBusLinks = busList.length;
  const connectivityMode: 'connected' | 'partial' | 'offline' =
    activeBusLinks === 0 ? 'offline' : activeBusLinks < totalBusLinks ? 'partial' : 'connected';

  const connectivityState = {
    active: activeBusLinks,
    total: totalBusLinks,
    mode: connectivityMode,
  };

  const refreshData = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    // Simulated network request-response cycle delay (450ms - 750ms)
    const delay = 450 + Math.floor(Math.random() * 300);
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Update simulated latency (88ms - 233ms)
    const newLatency = 88 + Math.floor(Math.random() * 145);
    setLatencyMs(newLatency);
    setRefreshRequestsCount((prev) => prev + 1);
    setLastSyncTime(
      new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date())
    );

    // Refresh relevant dashboard data without resetting or overwriting records:
    setBuses((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as BusId[]).forEach((id) => {
        const b = updated[id];
        if (!b.isOffline && !b.isPaused) {
          const remainingFraction = Math.max(0.05, 1 - b.progress);
          const calculatedEta = Math.max(1, Math.round(remainingFraction * 20 + (b.isDelayed ? 7 : 0)));
          updated[id] = {
            ...b,
            etaMinutes: calculatedEta,
          };
        }
      });
      return updated;
    });

    setIsRefreshing(false);
  }, [isRefreshing]);

  // Time formatter
  const getCurrentTimeStr = () => {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());
  };

  // Add notification
  const addNotification = useCallback((
    title: string,
    message: string,
    type: 'system' | 'login' | 'delay' | 'emergency' = 'system',
    isCritical = false
  ) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        message,
        time: getCurrentTimeStr(),
        type,
        isCritical,
      },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // Login handler: Always resets view to that role's default 'overview'
  const login = useCallback((name: string, role: UserRole, assignedBus: BusId = 'B1') => {
    const user: UserSession = { name, role, assignedBus: role === 'driver' ? assignedBus : undefined };
    setCurrentUser(user);
    setActiveTab('overview');

    if (role === 'driver') {
      setSelectedBusId(assignedBus);
      // Ensure the bus has this driver's name assigned in simulation
      setBuses((prev) => ({
        ...prev,
        [assignedBus]: {
          ...prev[assignedBus],
          driverName: name,
        },
      }));
    } else if (role === 'student') {
      setSelectedBusId('B1');
      setStudentChoiceBusId('B1');
      setStudentState('not_selected');
      setStudentSelectedStopIdx(0);
    } else {
      setSelectedBusId('B1');
    }

    addNotification(
      `Login · ${role.toUpperCase()}`,
      `${name} logged into ${role === 'driver' ? `Driver console for ${assignedBus}` : `${role} workspace`}.`,
      'login',
      false
    );
  }, [addNotification]);

  // Logout handler: Completely resets active screen and returns to login
  const logout = useCallback(() => {
    if (currentUser) {
      addNotification(
        `Logout · ${currentUser.role.toUpperCase()}`,
        `${currentUser.name} signed out of the application.`,
        'login',
        false
      );
    }
    setCurrentUser(null);
    setActiveTab('overview');
    setSelectedBusId('B1');
    setStudentState('not_selected');
  }, [currentUser, addNotification]);

  // Student actions
  const setStudentWaiting = useCallback((busId: BusId, stopName: string) => {
    if (!currentUser) return;
    setStudentChoiceBusId(busId);
    setSelectedBusId(busId);
    setStudentState('waiting');

    setPassengers((prev) => {
      const filtered = prev.filter((p) => p.name !== currentUser.name);
      return [
        ...filtered,
        {
          id: `p-${Date.now()}`,
          name: currentUser.name,
          busId,
          stopName,
          status: 'waiting',
          timestamp: getCurrentTimeStr(),
        },
      ];
    });

    addNotification(
      'Student Waiting Registered',
      `${currentUser.name} is waiting at ${stopName} for ${buses[busId]?.label}.`,
      'system',
      false
    );
  }, [currentUser, buses, addNotification]);

  const setStudentBoarded = useCallback((busId: BusId, stopName: string) => {
    if (!currentUser) return;
    setStudentChoiceBusId(busId);
    setSelectedBusId(busId);
    setStudentState('boarded');

    setPassengers((prev) => {
      const filtered = prev.filter((p) => p.name !== currentUser.name);
      return [
        ...filtered,
        {
          id: `p-${Date.now()}`,
          name: currentUser.name,
          busId,
          stopName,
          status: 'boarded',
          timestamp: getCurrentTimeStr(),
        },
      ];
    });

    addNotification(
      'Student Boarded',
      `${currentUser.name} boarded ${buses[busId]?.label} at ${stopName}.`,
      'system',
      false
    );
  }, [currentUser, buses, addNotification]);

  const toggleStudentBoarded = useCallback(() => {
    if (!currentUser) return;
    if (studentState === 'boarded') {
      // Unboard
      setStudentState('not_selected');
      setPassengers((prev) => prev.filter((p) => p.name !== currentUser.name));
      addNotification('Student Departed', `${currentUser.name} is no longer marked as aboard.`, 'system', false);
    } else {
      // Mark as boarded
      const stops = ROUTE_GEOMETRY[studentChoiceBusId]?.stops || [];
      const stopName = stops[studentSelectedStopIdx] || stops[0] || 'Campus Stop';
      setStudentBoarded(studentChoiceBusId, stopName);
    }
  }, [currentUser, studentState, studentChoiceBusId, studentSelectedStopIdx, setStudentBoarded, addNotification]);

  // Simulation controls
  const toggleSimulationPaused = useCallback(() => {
    setIsSimulationPaused((prev) => !prev);
  }, []);

  const advanceBusToNextStop = useCallback((busId: BusId) => {
    setBuses((prev) => {
      const bus = prev[busId];
      if (!bus) return prev;
      const numStops = bus.stops.length;
      const step = 1 / (numStops - 1);
      const nextProgress = Math.min(0.999, bus.progress + step);
      return {
        ...prev,
        [busId]: {
          ...bus,
          progress: nextProgress,
          status: nextProgress >= 0.95 ? 'Arrived' : bus.status,
        },
      };
    });
  }, []);

  const setBusProgress = useCallback((busId: BusId, progress: number) => {
    setBuses((prev) => {
      const bus = prev[busId];
      if (!bus) return prev;
      const clamped = Math.max(0, Math.min(0.999, progress));
      return {
        ...prev,
        [busId]: {
          ...bus,
          progress: clamped,
          status: clamped >= 0.96 ? 'Arrived' : bus.isDelayed ? 'Delayed' : 'On route',
        },
      };
    });
  }, []);

  // Admin fleet manipulations
  const simulateBusDelay = useCallback((busId: BusId) => {
    setBuses((prev) => {
      const bus = prev[busId];
      if (!bus) return prev;
      const delayed = !bus.isDelayed;
      return {
        ...prev,
        [busId]: {
          ...bus,
          isDelayed: delayed,
          status: delayed ? 'Delayed' : 'On route',
          currentSpeedKmh: delayed ? Math.max(15, bus.currentSpeedKmh - 12) : 38,
          etaMinutes: delayed ? bus.etaMinutes + 8 : Math.max(5, bus.etaMinutes - 8),
        },
      };
    });
    addNotification(
      `Fleet Status Change · ${busId}`,
      `Simulated traffic delay toggled for ${buses[busId]?.label}.`,
      'delay',
      false
    );
  }, [buses, addNotification]);

  const resumeBusOnTime = useCallback((busId: BusId) => {
    setBuses((prev) => {
      const bus = prev[busId];
      if (!bus) return prev;
      return {
        ...prev,
        [busId]: {
          ...bus,
          isDelayed: false,
          isOffline: false,
          isPaused: false,
          status: 'On route',
          currentSpeedKmh: 40,
        },
      };
    });
    addNotification(
      `Status Normal · ${busId}`,
      `${buses[busId]?.label} marked On Time and operational.`,
      'system',
      false
    );
  }, [buses, addNotification]);

  const toggleBusOffline = useCallback((busId: BusId) => {
    setBuses((prev) => {
      const bus = prev[busId];
      if (!bus) return prev;
      const offline = !bus.isOffline;
      return {
        ...prev,
        [busId]: {
          ...bus,
          isOffline: offline,
          status: offline ? 'Connection lost' : 'On route',
        },
      };
    });
    addNotification(
      `Network Alert · ${busId}`,
      `${buses[busId]?.label} telematics connection ${buses[busId]?.isOffline ? 'restored' : 'interrupted'}.`,
      'system',
      true
    );
  }, [buses, addNotification]);

  // Driver actions
  const driverStartTrip = useCallback((busId: BusId) => {
    setBuses((prev) => ({
      ...prev,
      [busId]: {
        ...prev[busId],
        isPaused: false,
        status: 'On route',
      },
    }));
    addNotification('Driver Trip Started', `Trip started for ${buses[busId]?.label}.`, 'system', false);
  }, [buses, addNotification]);

  const driverPauseTrip = useCallback((busId: BusId) => {
    setBuses((prev) => ({
      ...prev,
      [busId]: {
        ...prev[busId],
        isPaused: true,
        status: 'Trip paused',
      },
    }));
    addNotification('Driver Trip Paused', `Trip paused for ${buses[busId]?.label}.`, 'system', false);
  }, [buses, addNotification]);

  const driverNextStop = useCallback((busId: BusId) => {
    advanceBusToNextStop(busId);
    addNotification('Stop Confirmed', `Driver confirmed arrival at next scheduled stop for ${buses[busId]?.label}.`, 'system', false);
  }, [advanceBusToNextStop, buses, addNotification]);

  const driverReportIssue = useCallback((busId: BusId, type: string, message: string) => {
    const report: TransportReport = {
      id: `rep-${Date.now()}`,
      type,
      busId,
      busLabel: buses[busId]?.label || busId,
      studentName: currentUser?.name || 'Driver',
      message,
      time: getCurrentTimeStr(),
      status: 'Open',
      priority: 'Urgent',
    };
    setReports((prev) => [report, ...prev]);
    addNotification('Driver Report Filed', `${type} reported for ${buses[busId]?.label}: ${message}`, 'emergency', true);
  }, [buses, currentUser, addNotification]);

  // Emergency broadcasts
  const sendEmergencyBroadcast = useCallback((title: string, message: string, severity: 'urgent' | 'warning' | 'info' = 'urgent') => {
    const newBroadcast: EmergencyBroadcast = {
      id: `bcast-${Date.now()}`,
      title,
      message,
      time: getCurrentTimeStr(),
      severity,
      sender: currentUser?.name || 'Transport Admin',
      acknowledgedBy: [],
      isActive: true,
    };
    setEmergencyBroadcasts((prev) => [newBroadcast, ...prev]);
    addNotification('Emergency Broadcast Dispatched', `${title}: ${message}`, 'emergency', true);
  }, [currentUser, addNotification]);

  const acknowledgeBroadcast = useCallback((broadcastId: string) => {
    if (!currentUser) return;
    setEmergencyBroadcasts((prev) =>
      prev.map((b) => {
        if (b.id === broadcastId) {
          const alreadyAcked = b.acknowledgedBy.includes(currentUser.name);
          return {
            ...b,
            acknowledgedBy: alreadyAcked ? b.acknowledgedBy : [...b.acknowledgedBy, currentUser.name],
          };
        }
        return b;
      })
    );
  }, [currentUser]);

  // Student help request
  const submitStudentHelp = useCallback((type: string, busId: BusId, message: string) => {
    const newReport: TransportReport = {
      id: `rep-help-${Date.now()}`,
      type: `Student Help · ${type}`,
      busId,
      busLabel: buses[busId]?.label || busId,
      studentName: currentUser?.name || 'Anonymous Student',
      message,
      time: getCurrentTimeStr(),
      status: 'Open',
      priority: type.toLowerCase().includes('emergency') || type.toLowerCase().includes('safety') ? 'Urgent' : 'Normal',
    };
    setReports((prev) => [newReport, ...prev]);
    addNotification(
      'Student Emergency Request',
      `${currentUser?.name || 'Student'} requested help for ${buses[busId]?.label} (${type}): ${message}`,
      'emergency',
      true
    );
  }, [buses, currentUser, addNotification]);

  const updateReportStatus = useCallback((reportId: string, status: 'Open' | 'In progress' | 'Resolved') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
    addNotification('Report Updated', `Report ID ${reportId} status updated to ${status}.`, 'system', false);
  }, [addNotification]);

  // Demo Data Controls
  const loadDemoData = useCallback(() => {
    // 1. Assign drivers and statuses
    setBuses((prev) => {
      const next = { ...prev };
      (Object.keys(next) as BusId[]).forEach((id, idx) => {
        next[id] = {
          ...next[id],
          driverName: DEMO_DRIVERS[id],
          progress: [0.18, 0.35, 0.52, 0.12][idx],
          isDelayed: id === 'B3',
          status: id === 'B3' ? 'Delayed' : 'On route',
          currentSpeedKmh: id === 'B3' ? 24 : 38 + idx * 2,
          isOffline: false,
          isPaused: false,
        };
      });
      return next;
    });

    // 2. Populate 24 boarded students and 12 waiting students
    const newPassengers: StudentPassenger[] = [];
    (Object.keys(DEMO_BOARDED_STUDENTS) as BusId[]).forEach((busId) => {
      const stops = ROUTE_GEOMETRY[busId].stops;
      DEMO_BOARDED_STUDENTS[busId].forEach((studentName, i) => {
        newPassengers.push({
          id: `demo-boarded-${busId}-${i}`,
          name: studentName,
          busId,
          stopName: stops[i % (stops.length - 1)],
          status: 'boarded',
          isDemo: true,
          timestamp: '07:50 AM',
        });
      });
    });

    (Object.keys(DEMO_WAITING_STUDENTS) as BusId[]).forEach((busId) => {
      const stops = ROUTE_GEOMETRY[busId].stops;
      DEMO_WAITING_STUDENTS[busId].forEach((studentName, i) => {
        newPassengers.push({
          id: `demo-waiting-${busId}-${i}`,
          name: studentName,
          busId,
          stopName: stops[i + 2] || stops[stops.length - 2],
          status: 'waiting',
          isDemo: true,
          timestamp: '08:05 AM',
        });
      });
    });

    setPassengers(newPassengers);

    // 3. Populate demo reports & notifications
    setReports([
      {
        id: 'rep-demo-1',
        type: 'Traffic Congestion',
        busId: 'B3',
        busLabel: 'BUS-03',
        studentName: 'Driver Ryan Joseph',
        message: 'Roadwork bottleneck near West End Church. Delaying arrival by approx 7 minutes.',
        time: '08:02 AM',
        status: 'Open',
        priority: 'Normal',
        isDemo: true,
      },
      {
        id: 'rep-demo-2',
        type: 'Missed bus',
        busId: 'B1',
        busLabel: 'BUS-01',
        studentName: 'Aiden Varghese',
        message: 'Missed scheduled 8:00 AM pickup at Sports Complex. Requesting next connection ETA.',
        time: '08:06 AM',
        status: 'In progress',
        priority: 'Normal',
        isDemo: true,
      },
      {
        id: 'rep-demo-3',
        type: 'Safety concern',
        busId: 'B4',
        busLabel: 'BUS-04',
        studentName: 'Sofia Roy',
        message: 'Slippery road surface near North Gate roundabout due to morning rain.',
        time: '08:10 AM',
        status: 'Open',
        priority: 'Urgent',
        isDemo: true,
      },
    ]);

    setEmergencyBroadcasts([
      {
        id: 'bcast-demo-1',
        title: 'Emergency: Heavy Rain & North Gate Caution',
        message: 'All drivers exercise reduced speed (30 km/h) on northern perimeter roads due to rain.',
        time: '08:12 AM',
        severity: 'urgent',
        sender: 'Christy Johny (Admin)',
        acknowledgedBy: ['Alex Johny'],
        isActive: true,
      },
    ]);

    setHasDemoData(true);
    addNotification(
      'Demo Values Loaded',
      'Loaded 4 buses, 4 drivers, 24 boarded students, 12 waiting students, and active incident reports.',
      'system',
      false
    );
  }, [addNotification]);

  const clearDemoData = useCallback(() => {
    // Restore clean initial state
    setBuses(INITIAL_BUSES);
    setPassengers([]);
    setReports([]);
    setEmergencyBroadcasts([]);
    setHasDemoData(false);
    addNotification('Demo Values Cleared', 'All sample passenger records, counts, and test reports removed.', 'system', false);
  }, [addNotification]);

  // Helpers
  const getBoardedCount = useCallback((busId: BusId) => {
    return passengers.filter((p) => p.busId === busId && p.status === 'boarded').length;
  }, [passengers]);

  const getWaitingCount = useCallback((busId: BusId) => {
    return passengers.filter((p) => p.busId === busId && p.status === 'waiting').length;
  }, [passengers]);

  const calculateStopEta = useCallback((busId: BusId, stopIdx: number) => {
    const bus = buses[busId];
    if (!bus) return 15;
    const numPoints = bus.points.length;
    const targetProgress = stopIdx / (numPoints - 1);
    let gap = targetProgress - bus.progress;
    if (gap < 0) gap = 1 - bus.progress + targetProgress;
    const baseMinutes = Math.max(1, Math.round(gap * bus.etaMinutes + (bus.isDelayed ? 7 : 0)));
    return baseMinutes;
  }, [buses]);

  // Multi-bus simulation movement loop
  useEffect(() => {
    if (isSimulationPaused) return;

    const intervalMs = 1000 / simulationSpeed;
    const timer = setInterval(() => {
      setBuses((prev) => {
        const next = { ...prev };
        let hasChanges = false;

        (Object.keys(next) as BusId[]).forEach((busId) => {
          const bus = next[busId];
          if (!bus.isOffline && !bus.isPaused) {
            // Speed factor
            const progressDelta = (bus.isDelayed ? 0.0015 : 0.004) * simulationSpeed;
            let newProgress = bus.progress + progressDelta;

            if (newProgress >= 1.0) {
              newProgress = 0.0; // Reset trip loop
            }

            const currentStatus = newProgress >= 0.96 ? 'Arrived' : bus.isDelayed ? 'Delayed' : 'On route';

            next[busId] = {
              ...bus,
              progress: newProgress,
              status: currentStatus,
            };
            hasChanges = true;
          }
        });

        return hasChanges ? next : prev;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulationPaused, simulationSpeed]);

  const value: BusContextType = {
    currentUser,
    activeTab,
    setActiveTab,
    login,
    logout,
    buses,
    selectedBusId,
    setSelectedBusId,
    studentState,
    studentChoiceBusId,
    setStudentChoiceBusId,
    studentSelectedStopIdx,
    setStudentSelectedStopIdx,
    setStudentWaiting,
    setStudentBoarded,
    toggleStudentBoarded,
    passengers,
    simulationSpeed,
    setSimulationSpeed,
    isSimulationPaused,
    toggleSimulationPaused,
    advanceBusToNextStop,
    setBusProgress,
    simulateBusDelay,
    resumeBusOnTime,
    toggleBusOffline,
    driverStartTrip,
    driverPauseTrip,
    driverNextStop,
    driverReportIssue,
    notifications,
    addNotification,
    emergencyBroadcasts,
    sendEmergencyBroadcast,
    acknowledgeBroadcast,
    reports,
    submitStudentHelp,
    updateReportStatus,
    hasDemoData,
    loadDemoData,
    clearDemoData,
    getBoardedCount,
    getWaitingCount,
    calculateStopEta,
    latencyMs,
    lastSyncTime,
    refreshRequestsCount,
    isRefreshing,
    refreshData,
    connectivityState,
  };

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
}

export function useBus(): BusContextType {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
}
