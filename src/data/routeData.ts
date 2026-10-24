/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusData, BusId } from '../types';

// College Gate is positioned centrally in the 1200x520 landscape coordinate space
export const SHARED_GATE_COORDS = { x: 600, y: 260 };

/**
 * Samples a cubic Bezier curve segment into evenly spaced points.
 */
function sampleCubicBezier(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  steps: number
): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const invT = 1 - t;
    const x =
      invT * invT * invT * p0[0] +
      3 * invT * invT * t * p1[0] +
      3 * invT * t * t * p2[0] +
      t * t * t * p3[0];
    const y =
      invT * invT * invT * p0[1] +
      3 * invT * invT * t * p1[1] +
      3 * invT * t * t * p2[1] +
      t * t * t * p3[1];
    pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  }
  return pts;
}

// B1 Route: West approach
const b1Seg1 = sampleCubicBezier([0, 395], [90, 365], [180, 420], [290, 365], 12);
const b1Seg2 = sampleCubicBezier([290, 365], [400, 310], [475, 285], [600, 260], 12);
const b1DensePoints: [number, number][] = [...b1Seg1, ...b1Seg2.slice(1)];

// B2 Route: East approach
const b2Seg1 = sampleCubicBezier([1200, 120], [1090, 145], [1005, 210], [905, 225], 12);
const b2Seg2 = sampleCubicBezier([905, 225], [805, 240], [720, 248], [600, 260], 12);
const b2DensePoints: [number, number][] = [...b2Seg1, ...b2Seg2.slice(1)];

// B3 Route: South-West approach
const b3Seg1 = sampleCubicBezier([150, 520], [205, 475], [275, 410], [360, 350], 12);
const b3Seg2 = sampleCubicBezier([360, 350], [445, 290], [505, 285], [600, 260], 12);
const b3DensePoints: [number, number][] = [...b3Seg1, ...b3Seg2.slice(1)];

// B4 Route: North approach
const b4Seg1 = sampleCubicBezier([950, 0], [920, 65], [855, 122], [790, 166], 12);
const b4Seg2 = sampleCubicBezier([790, 166], [725, 210], [670, 225], [600, 260], 12);
const b4DensePoints: [number, number][] = [...b4Seg1, ...b4Seg2.slice(1)];

export const ROUTE_GEOMETRY: Record<
  BusId,
  {
    pathD: string;
    points: [number, number][];
    stops: string[];
    stopPoints: [number, number][];
  }
> = {
  // B1: Blue Town Route - Smooth curved approach from the WEST
  B1: {
    pathD: 'M 0 395 C 90 365 180 420 290 365 S 475 285 600 260',
    points: b1DensePoints,
    stops: [
      'Town Junction',
      'Market Stop',
      'Sports Complex',
      'Library Junction',
      'Hostel Stop',
      'Main Junction',
      'College Gate',
    ],
    stopPoints: [
      b1DensePoints[0],
      b1DensePoints[4],
      b1DensePoints[8],
      b1DensePoints[12],
      b1DensePoints[16],
      b1DensePoints[20],
      [SHARED_GATE_COORDS.x, SHARED_GATE_COORDS.y],
    ],
  },

  // B2: Green East Route - Smooth curved approach from the EAST
  B2: {
    pathD: 'M 1200 120 C 1090 145 1005 210 905 225 S 720 248 600 260',
    points: b2DensePoints,
    stops: [
      'East End',
      'Stadium Stop',
      'Hospital Junction',
      'Science Block',
      'Hostel Stop',
      'Main Junction',
      'College Gate',
    ],
    stopPoints: [
      b2DensePoints[0],
      b2DensePoints[4],
      b2DensePoints[8],
      b2DensePoints[12],
      b2DensePoints[16],
      b2DensePoints[20],
      [SHARED_GATE_COORDS.x, SHARED_GATE_COORDS.y],
    ],
  },

  // B3: Orange West Route - Smooth curved approach from the SOUTH-WEST
  B3: {
    pathD: 'M 150 520 C 205 475 275 410 360 350 S 505 285 600 260',
    points: b3DensePoints,
    stops: [
      'West End',
      'Church Stop',
      'Market Square',
      'Arts Block',
      'Library Junction',
      'College Road',
      'College Gate',
    ],
    stopPoints: [
      b3DensePoints[0],
      b3DensePoints[4],
      b3DensePoints[8],
      b3DensePoints[12],
      b3DensePoints[16],
      b3DensePoints[20],
      [SHARED_GATE_COORDS.x, SHARED_GATE_COORDS.y],
    ],
  },

  // B4: Purple North Route - Smooth curved approach from the NORTH
  B4: {
    pathD: 'M 950 0 C 920 65 855 122 790 166 S 670 225 600 260',
    points: b4DensePoints,
    stops: [
      'North Gate',
      'Park Stop',
      'Lake View',
      'Admin Block',
      'Auditorium',
      'Main Junction',
      'College Gate',
    ],
    stopPoints: [
      b4DensePoints[0],
      b4DensePoints[4],
      b4DensePoints[8],
      b4DensePoints[12],
      b4DensePoints[16],
      b4DensePoints[20],
      [SHARED_GATE_COORDS.x, SHARED_GATE_COORDS.y],
    ],
  },
};

/**
 * Calculates smooth interpolated 2D coordinates and heading angle along the route polyline.
 */
export function pointOnRoute(
  points: [number, number][],
  progress: number
): { x: number; y: number; angle: number } {
  if (!points || points.length === 0) return { x: 0, y: 0, angle: 0 };
  const clampedProgress = Math.min(0.9999, Math.max(0, progress));
  const totalSegments = points.length - 1;
  const pos = clampedProgress * totalSegments;
  const idx = Math.floor(pos);
  const factor = pos - idx;

  const p0 = points[idx];
  const p1 = points[Math.min(idx + 1, totalSegments)];

  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return {
    x: p0[0] + dx * factor,
    y: p0[1] + dy * factor,
    angle,
  };
}

export const INITIAL_BUSES: Record<BusId, BusData> = {
  B1: {
    id: 'B1',
    label: 'BUS-01',
    name: 'Town Route',
    color: '#3B82F6', // Blue
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    driverName: 'Alex Johny',
    currentSpeedKmh: 35,
    etaMinutes: 18,
    status: 'On route',
    progress: 0.18,
    stops: ROUTE_GEOMETRY.B1.stops,
    points: ROUTE_GEOMETRY.B1.points,
    isDelayed: false,
    isOffline: false,
    isPaused: false,
  },
  B2: {
    id: 'B2',
    label: 'BUS-02',
    name: 'East Route',
    color: '#10B981', // Green
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    driverName: 'Kevin Thomas',
    currentSpeedKmh: 38,
    etaMinutes: 24,
    status: 'On route',
    progress: 0.32,
    stops: ROUTE_GEOMETRY.B2.stops,
    points: ROUTE_GEOMETRY.B2.points,
    isDelayed: false,
    isOffline: false,
    isPaused: false,
  },
  B3: {
    id: 'B3',
    label: 'BUS-03',
    name: 'West Route',
    color: '#F97316', // Orange
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    driverName: 'Ryan Joseph',
    currentSpeedKmh: 24,
    etaMinutes: 15,
    status: 'Delayed',
    progress: 0.45,
    stops: ROUTE_GEOMETRY.B3.stops,
    points: ROUTE_GEOMETRY.B3.points,
    isDelayed: true,
    isOffline: false,
    isPaused: false,
  },
  B4: {
    id: 'B4',
    label: 'BUS-04',
    name: 'North Route',
    color: '#8B5CF6', // Purple
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    driverName: 'Aaron George',
    currentSpeedKmh: 32,
    etaMinutes: 21,
    status: 'On route',
    progress: 0.12,
    stops: ROUTE_GEOMETRY.B4.stops,
    points: ROUTE_GEOMETRY.B4.points,
    isDelayed: false,
    isOffline: false,
    isPaused: false,
  },
};

export const DEMO_DRIVERS: Record<BusId, string> = {
  B1: 'Alex Johny',
  B2: 'Kevin Thomas',
  B3: 'Ryan Joseph',
  B4: 'Aaron George',
};

// 6 Boarded students per bus = 24 total
export const DEMO_BOARDED_STUDENTS: Record<BusId, string[]> = {
  B1: ['Ava Thomas', 'Noah Mathew', 'Mia Joseph', 'Ethan Roy', 'Ivy George', 'Liam Paul'],
  B2: ['Olivia James', 'Lucas Peter', 'Emma Jose', 'Aiden Varghese', 'Sofia Roy', 'Leo Mathew'],
  B3: ['Isabella Thomas', 'Mason Joseph', 'Amelia Paul', 'Elijah George', 'Grace Mathew', 'Arjun Das'],
  B4: ['Charlotte Roy', 'Benjamin Jose', 'Ella Thomas', 'James Varghese', 'Zoe Mathew', 'Ryan Paul'],
};

// 3 Waiting students per bus = 12 total
export const DEMO_WAITING_STUDENTS: Record<BusId, string[]> = {
  B1: ['Nina Philip', 'Adrian Jose', 'Tara Mathew'],
  B2: ['Sarah George', 'Joel Thomas', 'Anya Paul'],
  B3: ['Diya Joseph', 'Neil Roy', 'Meera Das'],
  B4: ['Rohan Mathew', 'Eva Thomas', 'Kiran Jose'],
};
