/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'driver' | 'admin';

export type BusId = 'B1' | 'B2' | 'B3' | 'B4';

export interface BusStop {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface BusData {
  id: BusId;
  label: string;       // e.g., 'BUS-01'
  name: string;        // e.g., 'Town Route'
  color: string;       // hex or Tailwind color class
  bgColor: string;
  borderColor: string;
  driverName: string;
  currentSpeedKmh: number;
  etaMinutes: number;
  status: 'On route' | 'Delayed' | 'Trip paused' | 'Arrived' | 'Connection lost';
  progress: number;    // 0.0 to 1.0 along the route points
  stops: string[];
  points: [number, number][];
  isDelayed: boolean;
  isOffline: boolean;
  isPaused: boolean;
}

export interface StudentPassenger {
  id: string;
  name: string;
  busId: BusId;
  stopName: string;
  status: 'waiting' | 'boarded';
  isDemo?: boolean;
  timestamp?: string;
}

export interface NotificationEvent {
  id: string;
  title: string;
  message: string;
  time: string;
  isCritical?: boolean;
  type?: 'system' | 'login' | 'delay' | 'emergency';
}

export interface EmergencyBroadcast {
  id: string;
  title: string;
  message: string;
  time: string;
  severity: 'urgent' | 'warning' | 'info';
  sender: string;
  acknowledgedBy: string[]; // array of user names
  isActive: boolean;
}

export interface TransportReport {
  id: string;
  type: string;
  busId: BusId;
  busLabel: string;
  studentName: string;
  message: string;
  time: string;
  status: 'Open' | 'In progress' | 'Resolved';
  priority: 'Urgent' | 'Normal';
  isDemo?: boolean;
}

export interface UserSession {
  name: string;
  role: UserRole;
  assignedBus?: BusId;
}

export type NetworkMode = 'connected' | 'partial' | 'offline';

export interface ConnectivityState {
  active: number;
  total: number;
  mode: NetworkMode;
}
