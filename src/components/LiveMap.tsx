/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useBus } from '../context/BusContext';
import { useTheme } from '../context/ThemeContext';
import { BusId } from '../types';
import { ROUTE_GEOMETRY, pointOnRoute, SHARED_GATE_COORDS } from '../data/routeData';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
  X,
  Settings,
  Check,
  Building2,
  Navigation,
} from 'lucide-react';

interface LiveMapProps {
  standalone?: boolean;
  fixedBusId?: BusId;
}

export const LiveMap: React.FC<LiveMapProps> = ({ standalone = false, fixedBusId }) => {
  const {
    buses,
    selectedBusId,
    setSelectedBusId,
    currentUser,
    studentState,
    studentChoiceBusId,
    simulationSpeed,
    setSimulationSpeed,
    isSimulationPaused,
    toggleSimulationPaused,
    advanceBusToNextStop,
    setBusProgress,
  } = useBus();

  const { isDark } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Playback Floating Controller State
  const [showSpeedDropdown, setShowSpeedDropdown] = useState<boolean>(false);
  const [showController, setShowController] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Active highlighted bus
  const activeBusId =
    fixedBusId ||
    (currentUser?.role === 'driver'
      ? currentUser.assignedBus || 'B1'
      : currentUser?.role === 'student' && studentState === 'boarded'
      ? studentChoiceBusId
      : selectedBusId);

  const activeBus = buses[activeBusId];
  const activeGeometry = ROUTE_GEOMETRY[activeBusId];

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(3.2, prev + 0.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.7, prev - 0.25));
  const handleZoomReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Fullscreen expansion using Fullscreen API
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Mouse pan/drag handlers for interactive panning when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Classic landscape coordinate space 1200x520 with College Gate exactly at center (600, 260)
  const baseW = 1200;
  const baseH = 520;
  const currentW = baseW / zoomLevel;
  const currentH = baseH / zoomLevel;

  const minX = -300;
  const maxX = 900;
  const rawViewBoxX = (baseW - currentW) / 2 - panOffset.x / zoomLevel;
  const rawViewBoxY = (baseH - currentH) / 2 - panOffset.y / zoomLevel;

  const viewBoxX = Math.max(minX, Math.min(maxX, rawViewBoxX));
  const viewBoxY = Math.max(-150, Math.min(500, rawViewBoxY));

  // Bus IDs to display
  const busIds: BusId[] =
    currentUser?.role === 'driver' && currentUser.assignedBus
      ? [currentUser.assignedBus]
      : ['B1', 'B2', 'B3', 'B4'];

  // Current progress calculation for scrubber
  const totalSeconds = 368;
  const currentSeconds = Math.round((activeBus?.progress || 0) * totalSeconds);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value) / 100;
    setBusProgress(activeBusId, newProgress);
  };

  const speedOptions = [1, 2, 5, 10, 20, 50, 100];

  const mapColors = isDark
    ? {
        terrain: '#0A0F1D',
        grid: '#152033',
        roofHatch: '#1A2840',
        waterBed: '#071826',
        waterGradStart: '#0F2F4A',
        waterGradEnd: '#081C2E',
        islandFill: '#0E362A',
        islandStroke: '#145A45',
        pier: '#45382B',
        ripples: '#38BDF8',
        lawnGradStart: '#0C271E',
        lawnGradEnd: '#091E17',
        trackGradStart: '#331B19',
        trackGradEnd: '#241312',
        trackStroke: '#4D2622',
        pitchGrass: '#0E3324',
        pitchStripes: '#0B281C',
        tennisCourt: '#0F2F26',
        tennisInner: '#122B42',
        buildingBg: '#111726',
        buildingStroke: '#223048',
        buildingRoof: '#1A2337',
        buildingPortico: '#151E31',
        buildingAccent: '#38BDF8',
        dormBg: '#131B2C',
        trees: ['#0B2B1B', '#114B31', '#145D3D'],
        roadFoundation: '#141D2E',
        roadSurface: '#1D273B',
        centerline: '#38BDF8',
        walkways: '#233247',
        roundaboutIsland: '#0C2D24',
        roundaboutInner: '#133E32',
        gateLabelBg: '#051912',
        gateLabelBorder: '#10B981',
        gateLabelText: '#34D399',
        roadLabelBg: '#101625',
        roadLabelBorder: '#233048',
        roadLabelText: '#94A3B8',
        landmarkText: '#CBD5E1',
        stopText: '#F1F5F9',
        stopTextStroke: '#0B0F19',
      }
    : {
        terrain: '#F2F5ED',
        grid: '#E6EAE1',
        roofHatch: '#E1E6DC',
        waterBed: '#C2E0ED',
        waterGradStart: '#D5ECF8',
        waterGradEnd: '#BFE0F0',
        islandFill: '#B0D69B',
        islandStroke: '#9CC884',
        pier: '#C5A47E',
        ripples: '#FFFFFF',
        lawnGradStart: '#D8E8CD',
        lawnGradEnd: '#C9DDBB',
        trackGradStart: '#DF8B78',
        trackGradEnd: '#D57A66',
        trackStroke: '#C66B57',
        pitchGrass: '#88C267',
        pitchStripes: '#7EB85C',
        tennisCourt: '#3D7D68',
        tennisInner: '#3B6FA8',
        buildingBg: '#FFFFFF',
        buildingStroke: '#D1D8CE',
        buildingRoof: '#EDF3E9',
        buildingPortico: '#E2EAE0',
        buildingAccent: '#7164ED',
        dormBg: '#FFFFFF',
        trees: ['#669C50', '#8AC26E', '#A3D68B'],
        roadFoundation: '#D0DCD0',
        roadSurface: '#FFFFFF',
        centerline: '#CBD5C7',
        walkways: '#E0D5C1',
        roundaboutIsland: '#CEE3BF',
        roundaboutInner: '#E2EFE0',
        gateLabelBg: '#162E24',
        gateLabelBorder: '#2CAF82',
        gateLabelText: '#FFFFFF',
        roadLabelBg: '#FFFFFF',
        roadLabelBorder: '#D3DDD0',
        roadLabelText: '#5A6D55',
        landmarkText: '#3D4B39',
        stopText: '#252647',
        stopTextStroke: '#FFFFFF',
      };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl border shadow-[0_4px_24px_rgba(33,24,68,0.04)] flex flex-col transition-all overflow-hidden w-full ${
        isDark
          ? 'bg-[#0A0E1A] border-[#1E2638] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'bg-[#F3F6EE] border-[#DDD8FA]'
      } ${
        isFullscreen
          ? `fixed inset-0 z-50 rounded-none w-screen h-screen ${isDark ? 'bg-[#0A0E1A]' : 'bg-[#F3F6EE]'}`
          : standalone
          ? 'h-[calc(100vh-170px)] min-h-[540px]'
          : 'h-[460px] sm:h-[520px] lg:h-[580px]'
      }`}
    >
      {/* Top Floating Playback & Scrub Controller Widget */}
      {showController && (
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-lg bg-white/95 dark:bg-[#111625]/95 backdrop-blur-md rounded-2xl border border-[#DDD8FA] dark:border-[#1E2638] shadow-[0_8px_25px_rgba(33,24,68,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 text-xs">
          {/* Time Scrubber / Slider */}
          <div className="flex-1 flex items-center gap-2">
            <span className="font-mono tabular-nums text-xs font-extrabold text-[#1E1B4B] dark:text-white shrink-0">
              {formatTime(currentSeconds)}
            </span>
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((activeBus?.progress || 0) * 100)}
                onChange={handleScrubberChange}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#7164ED] dark:accent-cyan-400"
              />
            </div>
            <span className="font-mono tabular-nums text-xs text-slate-400 dark:text-slate-500 shrink-0 font-medium">
              {formatTime(totalSeconds)}
            </span>
          </div>

          {/* Current Live Speed */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-xs font-extrabold text-[#1E1B4B] dark:text-cyan-300 px-2.5 py-1 rounded-xl bg-[#F3F1FD] dark:bg-[#1A2234] border border-[#DDD8FA] dark:border-[#2A364F]">
            <span>{activeBus?.currentSpeedKmh || 35}</span>
            <span className="text-[10px] font-bold text-[#7164ED] dark:text-cyan-400">km/h</span>
          </div>

          {/* Step & Play/Pause Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                const next = Math.max(0, (activeBus?.progress || 0) - 0.1);
                setBusProgress(activeBusId, next);
              }}
              title="Step Backward"
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#1E1B4B] dark:hover:text-white hover:bg-[#F3F1FD] dark:hover:bg-[#1A2234] active:scale-95 transition-all"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleSimulationPaused}
              title={isSimulationPaused ? 'Play Simulation' : 'Pause Simulation'}
              className="p-1.5 rounded-xl bg-[#EDE9FE] dark:bg-cyan-500/20 hover:bg-[#DDD8FA] dark:hover:bg-cyan-500/30 text-[#7164ED] dark:text-cyan-400 active:scale-95 transition-all shadow-2xs font-bold"
            >
              {isSimulationPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => advanceBusToNextStop(activeBusId)}
              title="Advance to Next Stop"
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#1E1B4B] dark:hover:text-white hover:bg-[#F3F1FD] dark:hover:bg-[#1A2234] active:scale-95 transition-all"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Multiplier Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSpeedDropdown((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F4F6FB] dark:bg-[#1A2234] hover:bg-[#EDE9FE] dark:hover:bg-[#242F48] hover:text-[#7164ED] dark:hover:text-cyan-300 text-xs font-bold text-[#1E1B4B] dark:text-slate-200 transition-all border border-slate-200/80 dark:border-[#2A364F] active:scale-95"
            >
              <span>x{simulationSpeed}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            </button>

            {showSpeedDropdown && (
              <div className="absolute right-0 top-full mt-2 w-24 bg-white/98 dark:bg-[#111625] backdrop-blur-md rounded-2xl border border-[#DDD8FA] dark:border-[#1E2638] shadow-xl py-1.5 z-40 max-h-56 overflow-y-auto">
                {speedOptions.map((spd) => {
                  const isCur = simulationSpeed === spd;
                  return (
                    <button
                      key={spd}
                      onClick={() => {
                        setSimulationSpeed(spd);
                        setShowSpeedDropdown(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left font-bold flex items-center justify-between transition-colors ${
                        isCur
                          ? 'bg-[#7164ED] dark:bg-cyan-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-[#F3F1FD] dark:hover:bg-[#1A2234]'
                      }`}
                    >
                      <span>x{spd}</span>
                      {isCur && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Minimize button */}
          <button
            onClick={() => setShowController(false)}
            title="Minimize playback bar"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top-Left Controls: Fullscreen, Labels Toggle, Restore Playback */}
      <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5">
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          className="p-2.5 rounded-2xl bg-white/95 dark:bg-[#111625]/95 backdrop-blur-md border border-[#DDD8FA] dark:border-[#1E2638] shadow-[0_4px_16px_rgba(33,24,68,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-[#1E1B4B] dark:text-slate-200 hover:text-[#7164ED] dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-[#1A2234] active:scale-95 transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setShowLabels((prev) => !prev)}
          title="Toggle Campus Labels & Landmarks"
          className={`p-2.5 rounded-2xl backdrop-blur-md border border-[#DDD8FA] dark:border-[#1E2638] shadow-[0_4px_16px_rgba(33,24,68,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] active:scale-95 transition-all ${
            showLabels
              ? 'bg-white/95 dark:bg-[#111625]/95 text-[#7164ED] dark:text-cyan-400'
              : 'bg-slate-100/90 dark:bg-[#1A2234]/90 text-slate-400'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>

        {!showController && (
          <button
            onClick={() => setShowController(true)}
            title="Open Playback Scrubber"
            className="p-2.5 rounded-2xl bg-white/95 dark:bg-[#111625]/95 backdrop-blur-md border border-[#DDD8FA] dark:border-[#1E2638] shadow-[0_4px_16px_rgba(33,24,68,0.06)] text-[#059669] dark:text-emerald-400 hover:bg-white dark:hover:bg-[#1A2234] active:scale-95 transition-all"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Top-Right Floating Zoom Controls */}
      <div className="absolute top-3.5 right-3.5 z-20 flex flex-col gap-1 bg-white/95 dark:bg-[#111625]/95 backdrop-blur-md rounded-2xl border border-[#DDD8FA] dark:border-[#1E2638] shadow-[0_4px_16px_rgba(33,24,68,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] p-1">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#7164ED] dark:hover:text-cyan-400 hover:bg-[#F3F1FD] dark:hover:bg-[#1A2234] active:scale-95 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#7164ED] dark:hover:text-cyan-400 hover:bg-[#F3F1FD] dark:hover:bg-[#1A2234] active:scale-95 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomReset}
          title="Reset Zoom & Pan"
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#7164ED] dark:hover:text-cyan-400 hover:bg-[#F3F1FD] dark:hover:bg-[#1A2234] active:scale-95 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cartographic SVG Canvas */}
      <div
        className={`flex-1 w-full h-full relative overflow-hidden select-none ${
          zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`${viewBoxX} ${viewBoxY} ${currentW} ${currentH}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full block"
        >
          <defs>
            {/* Campus Micro-Grid */}
            <pattern id="campusGrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke={mapColors.grid} strokeWidth="1" />
            </pattern>

            {/* Subtle Building Roof Hatching */}
            <pattern id="roofHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke={mapColors.roofHatch} strokeWidth="1.2" />
            </pattern>

            {/* Drop Shadows */}
            <filter id="mapShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="1" dy="2.5" stdDeviation="2.5" floodColor={isDark ? '#000000' : '#2E3A2B'} floodOpacity={isDark ? 0.45 : 0.14} />
            </filter>
            <filter id="buildingShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1.5" dy="3" stdDeviation="3" floodColor={isDark ? '#000000' : '#1C2618'} floodOpacity={isDark ? 0.5 : 0.18} />
            </filter>
            <filter id="gateHalo" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#10B981" floodOpacity="0.45" />
            </filter>
            <filter id="busGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={isDark ? '#38BDF8' : '#15172C'} floodOpacity={isDark ? 0.4 : 0.3} />
            </filter>

            {/* Linear Gradients for Campus Features */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mapColors.waterGradStart} />
              <stop offset="100%" stopColor={mapColors.waterGradEnd} />
            </linearGradient>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mapColors.trackGradStart} />
              <stop offset="100%" stopColor={mapColors.trackGradEnd} />
            </linearGradient>
            <linearGradient id="lawnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={mapColors.lawnGradStart} />
              <stop offset="100%" stopColor={mapColors.lawnGradEnd} />
            </linearGradient>
          </defs>

          {/* ================= 1. BASE TERRAIN & SUBTLE GRID ================= */}
          <rect width={baseW} height={baseH} fill={mapColors.terrain} />
          <rect width={baseW} height={baseH} fill="url(#campusGrid)" />

          {/* ================= 2. NATURAL PARKS, WATERWAY & LAWNS ================= */}
          {/* A. Mirror Lake (North-East Scenic Campus Lake) */}
          <g filter="url(#mapShadow)">
            {/* Lake Bank Bed */}
            <path
              d="M 830 30 C 890 20 980 30 1040 60 C 1090 85 1075 140 1025 155 C 960 170 890 155 845 125 C 805 98 800 45 830 30 Z"
              fill={mapColors.waterBed}
            />
            {/* Lake Water Surface */}
            <path
              d="M 834 34 C 892 24 978 34 1035 63 C 1083 87 1069 137 1021 150 C 958 165 892 150 849 121 C 811 96 806 48 834 34 Z"
              fill="url(#waterGrad)"
            />
            {/* Small Green Island in Lake */}
            <ellipse cx="945" cy="85" rx="20" ry="12" fill={mapColors.islandFill} stroke={mapColors.islandStroke} strokeWidth="1.5" />
            <circle cx="942" cy="83" r="5" fill={isDark ? '#10523C' : '#75A85A'} />
            <circle cx="952" cy="87" r="4.5" fill={isDark ? '#146349' : '#679A4D'} />
            {/* Wooden Boat Pier / Jetty */}
            <rect x="865" y="115" width="22" height="6" rx="1.5" fill={mapColors.pier} transform="rotate(-25 865 115)" />
            {/* Water Waves / Ripples */}
            <path d="M 900 60 Q 910 57 920 60" fill="none" stroke={mapColors.ripples} strokeWidth="1.5" opacity={isDark ? 0.5 : 0.75} />
            <path d="M 980 100 Q 990 97 1000 100" fill="none" stroke={mapColors.ripples} strokeWidth="1.5" opacity={isDark ? 0.5 : 0.75} />
            <path d="M 860 80 Q 870 77 880 80" fill="none" stroke={mapColors.ripples} strokeWidth="1.5" opacity={isDark ? 0.5 : 0.75} />
          </g>

          {/* B. Campus Botanical Arboretum & Green Quads */}
          <g filter="url(#mapShadow)">
            {/* West Botanical Grove */}
            <path
              d="M 120 230 C 180 210 240 240 230 300 C 220 340 160 360 120 330 C 90 300 90 250 120 230 Z"
              fill="url(#lawnGrad)"
            />
            {/* South-West Park */}
            <path
              d="M 270 420 C 330 395 380 430 370 475 C 355 510 300 520 260 495 C 235 470 240 435 270 420 Z"
              fill="url(#lawnGrad)"
            />
            {/* Central North Garden */}
            <path
              d="M 430 65 C 500 45 540 85 530 135 C 510 165 440 170 410 140 C 390 110 400 80 430 65 Z"
              fill="url(#lawnGrad)"
            />
            {/* South-East Campus Meadow */}
            <path
              d="M 750 330 C 830 305 890 345 870 410 C 850 450 780 460 740 430 C 715 400 710 355 750 330 Z"
              fill="url(#lawnGrad)"
            />
          </g>

          {/* C. Varsity Athletics Complex (Track Oval & Soccer Field) */}
          <g transform="translate(930, 275)" filter="url(#mapShadow)">
            {/* Terracotta Running Track Oval */}
            <rect x="0" y="0" width="180" height="98" rx="49" fill="url(#trackGrad)" stroke={mapColors.trackStroke} strokeWidth="1.5" />
            {/* Track Lanes */}
            <rect x="6" y="6" width="168" height="86" rx="43" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity={isDark ? 0.35 : 0.6} strokeDasharray="3 3" />
            <rect x="12" y="12" width="156" height="74" rx="37" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity={isDark ? 0.35 : 0.6} strokeDasharray="3 3" />
            {/* Inner Lush Turf Soccer Pitch */}
            <rect x="22" y="20" width="136" height="58" rx="6" fill={mapColors.pitchGrass} stroke={isDark ? '#204E3A' : '#FFFFFF'} strokeWidth="1.5" />
            {/* Soccer Pitch Grass Cut Stripes */}
            <rect x="42" y="20" width="20" height="58" fill={mapColors.pitchStripes} opacity="0.5" />
            <rect x="82" y="20" width="20" height="58" fill={mapColors.pitchStripes} opacity="0.5" />
            <rect x="122" y="20" width="20" height="58" fill={mapColors.pitchStripes} opacity="0.5" />
            {/* Pitch Midline & Center Circle */}
            <line x1="90" y1="20" x2="90" y2="78" stroke={isDark ? '#3D7A5E' : '#FFFFFF'} strokeWidth="1.2" />
            <circle cx="90" cy="49" r="14" fill="none" stroke={isDark ? '#3D7A5E' : '#FFFFFF'} strokeWidth="1.2" />
            {/* Goal Boxes */}
            <rect x="22" y="35" width="14" height="28" fill="none" stroke={isDark ? '#3D7A5E' : '#FFFFFF'} strokeWidth="1.2" />
            <rect x="144" y="35" width="14" height="28" fill="none" stroke={isDark ? '#3D7A5E' : '#FFFFFF'} strokeWidth="1.2" />
          </g>

          {/* D. Dual Tennis Courts */}
          <g transform="translate(1125, 275)" filter="url(#mapShadow)">
            <rect x="0" y="0" width="65" height="98" rx="4" fill={mapColors.tennisCourt} stroke={isDark ? '#144637' : '#316353'} strokeWidth="1.5" />
            {/* Court 1 */}
            <rect x="5" y="8" width="55" height="38" fill={mapColors.tennisInner} stroke={isDark ? '#254E70' : '#FFFFFF'} strokeWidth="1" />
            <line x1="5" y1="27" x2="60" y2="27" stroke={isDark ? '#254E70' : '#FFFFFF'} strokeWidth="1.2" />
            {/* Court 2 */}
            <rect x="5" y="52" width="55" height="38" fill={mapColors.tennisInner} stroke={isDark ? '#254E70' : '#FFFFFF'} strokeWidth="1" />
            <line x1="5" y1="71" x2="60" y2="71" stroke={isDark ? '#254E70' : '#FFFFFF'} strokeWidth="1.2" />
          </g>

          {/* ================= 3. ARCHITECTURAL CAMPUS BUILDINGS ================= */}
          <g filter="url(#buildingShadow)">
            {/* Central Administration & Clocktower (North of Gate) */}
            <g transform="translate(545, 120)">
              <rect x="0" y="0" width="110" height="48" rx="6" fill={mapColors.buildingBg} stroke={mapColors.buildingStroke} strokeWidth="1.5" />
              <rect x="6" y="6" width="98" height="36" rx="4" fill={mapColors.buildingRoof} />
              {/* Central Clocktower Portico */}
              <rect x="38" y="-12" width="34" height="26" rx="4" fill={mapColors.buildingPortico} stroke={mapColors.buildingStroke} strokeWidth="1.2" />
              <circle cx="55" cy="1" r="5" fill={isDark ? '#38BDF8' : '#7164ED'} opacity="0.9" />
              <rect x="42" y="16" width="26" height="6" fill={isDark ? '#23304A' : '#CBD6C6'} />
            </g>

            {/* University Central Library (South of Gate) */}
            <g transform="translate(535, 330)">
              <rect x="0" y="0" width="130" height="54" rx="8" fill={mapColors.buildingBg} stroke={mapColors.buildingStroke} strokeWidth="1.5" />
              <rect x="8" y="8" width="114" height="38" rx="5" fill={mapColors.buildingRoof} />
              {/* Library Atrium Skylight */}
              <rect x="35" y="14" width="60" height="26" rx="4" fill={isDark ? '#14314A' : '#D0E3F0'} stroke={isDark ? '#254D70' : '#B8D5E8'} strokeWidth="1" />
              <line x1="35" y1="27" x2="95" y2="27" stroke={isDark ? '#38BDF8' : '#FFFFFF'} strokeWidth="1.5" opacity={isDark ? 0.6 : 1} />
              <line x1="65" y1="14" x2="65" y2="40" stroke={isDark ? '#38BDF8' : '#FFFFFF'} strokeWidth="1.5" opacity={isDark ? 0.6 : 1} />
            </g>

            {/* Science & Engineering Hall (West) */}
            <g transform="translate(320, 210)">
              <path d="M 0 0 L 70 0 L 70 30 L 40 30 L 40 70 L 0 70 Z" fill={mapColors.buildingBg} stroke={mapColors.buildingStroke} strokeWidth="1.5" />
              <rect x="6" y="6" width="58" height="18" fill={mapColors.buildingRoof} rx="3" />
              <rect x="6" y="32" width="28" height="32" fill={mapColors.buildingRoof} rx="3" />
            </g>

            {/* Arts & Humanities Pavilion (East) */}
            <g transform="translate(760, 180)">
              <rect x="0" y="0" width="85" height="44" rx="6" fill={mapColors.buildingBg} stroke={mapColors.buildingStroke} strokeWidth="1.5" />
              <rect x="6" y="6" width="73" height="32" rx="4" fill={mapColors.buildingRoof} />
              <line x1="28" y1="6" x2="28" y2="38" stroke={isDark ? '#23304A' : '#D2DCCF'} strokeWidth="1.2" />
              <line x1="56" y1="6" x2="56" y2="38" stroke={isDark ? '#23304A' : '#D2DCCF'} strokeWidth="1.2" />
            </g>

            {/* Student Village / Dormitories (West Side) */}
            <g transform="translate(60, 430)">
              <rect x="0" y="0" width="65" height="36" rx="5" fill={mapColors.dormBg} stroke={mapColors.buildingStroke} strokeWidth="1.2" />
              <rect x="80" y="0" width="65" height="36" rx="5" fill={mapColors.dormBg} stroke={mapColors.buildingStroke} strokeWidth="1.2" />
              <rect x="5" y="5" width="55" height="26" rx="3" fill={mapColors.buildingRoof} />
              <rect x="85" y="5" width="55" height="26" rx="3" fill={mapColors.buildingRoof} />
            </g>

            {/* North Academic Labs */}
            <g transform="translate(820, 95)">
              <rect x="0" y="0" width="75" height="36" rx="5" fill={mapColors.buildingBg} stroke={mapColors.buildingStroke} strokeWidth="1.2" />
              <rect x="5" y="5" width="65" height="26" rx="3" fill={mapColors.buildingRoof} />
            </g>

            {/* East Campus Health & Clinic */}
            <g transform="translate(1010, 180)">
              <rect x="0" y="0" width="75" height="40" rx="6" fill={mapColors.buildingBg} stroke={mapColors.buildingStroke} strokeWidth="1.2" />
              <rect x="6" y="6" width="63" height="28" rx="4" fill={mapColors.buildingRoof} />
              {/* Red Cross / Clinic glyph */}
              <rect x="34" y="14" width="8" height="12" fill="#E86E6E" rx="1.5" />
              <rect x="32" y="16" width="12" height="8" fill="#E86E6E" rx="1.5" />
            </g>

            {/* Campus Parking Lot A (West) */}
            <g transform="translate(240, 290)">
              <rect x="0" y="0" width="50" height="36" rx="4" fill={isDark ? '#141D2D' : '#E5EAE1'} stroke={mapColors.buildingStroke} strokeWidth="1" />
              <line x1="10" y1="6" x2="10" y2="30" stroke={isDark ? '#2D3F59' : '#FFFFFF'} strokeWidth="1" strokeDasharray="3 3" />
              <line x1="25" y1="6" x2="25" y2="30" stroke={isDark ? '#2D3F59' : '#FFFFFF'} strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="6" x2="40" y2="30" stroke={isDark ? '#2D3F59' : '#FFFFFF'} strokeWidth="1" strokeDasharray="3 3" />
            </g>
          </g>

          {/* Vector Campus Trees (Clusters across groves) */}
          <g filter="url(#mapShadow)">
            {[
              [140, 260], [170, 280], [150, 310], [190, 250], [210, 290],
              [280, 440], [310, 460], [340, 445], [330, 480],
              [450, 90], [480, 80], [510, 105], [470, 130],
              [770, 360], [800, 380], [830, 360], [850, 395], [780, 410],
              [730, 150], [700, 190], [670, 170],
              [520, 200], [520, 290], [680, 200], [680, 290],
            ].map(([tx, ty], i) => (
              <g key={`tree-${i}`} transform={`translate(${tx}, ${ty})`}>
                <circle cx="0" cy="1" r="7" fill={mapColors.trees[0]} opacity="0.35" />
                <circle cx="0" cy="0" r="6.5" fill={mapColors.trees[1]} />
                <circle cx="-1.5" cy="-1.5" r="3.5" fill={mapColors.trees[2]} />
              </g>
            ))}
          </g>

          {/* ================= 4. REALISTIC CURVED ROAD NETWORK ================= */}
          {/* Layer A: Outer Curb / Road Foundation Underlay */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Primary Feeder Avenues Outer Casings (Width 36px) */}
            <g stroke={mapColors.roadFoundation} strokeWidth="36" filter="url(#mapShadow)">
              {/* B1: West Route Approach */}
              <path d={ROUTE_GEOMETRY.B1.pathD} />
              {/* B2: East Route Approach */}
              <path d={ROUTE_GEOMETRY.B2.pathD} />
              {/* B3: South-West Route Approach */}
              <path d={ROUTE_GEOMETRY.B3.pathD} />
              {/* B4: North Route Approach */}
              <path d={ROUTE_GEOMETRY.B4.pathD} />
              {/* Secondary Curved Connectors */}
              <path d="M -20 180 C 160 140 280 190 420 180 S 540 230 600 260" />
              <path d="M 600 260 C 670 300 790 350 930 380 S 1110 420 1220 440" />
              <path d="M 770 60 C 820 110 870 140 920 150 S 1030 110 1100 60" />
              <path d="M 360 350 C 430 420 490 470 580 480 S 720 460 780 370" />
            </g>

            {/* Layer B: Crisp Clean Road Surface Pavement (Width 28px) */}
            <g stroke={mapColors.roadSurface} strokeWidth="28">
              <path d={ROUTE_GEOMETRY.B1.pathD} />
              <path d={ROUTE_GEOMETRY.B2.pathD} />
              <path d={ROUTE_GEOMETRY.B3.pathD} />
              <path d={ROUTE_GEOMETRY.B4.pathD} />
              {/* Secondary Connectors */}
              <path d="M -20 180 C 160 140 280 190 420 180 S 540 230 600 260" />
              <path d="M 600 260 C 670 300 790 350 930 380 S 1110 420 1220 440" />
              <path d="M 770 60 C 820 110 870 140 920 150 S 1030 110 1100 60" />
              <path d="M 360 350 C 430 420 490 470 580 480 S 720 460 780 370" />
            </g>

            {/* Layer C: Centerline Dashed Lane Markings */}
            <g stroke={mapColors.centerline} strokeWidth="1.8" strokeDasharray="6 8" opacity={isDark ? 0.75 : 1}>
              <path d={ROUTE_GEOMETRY.B1.pathD} />
              <path d={ROUTE_GEOMETRY.B2.pathD} />
              <path d={ROUTE_GEOMETRY.B3.pathD} />
              <path d={ROUTE_GEOMETRY.B4.pathD} />
              <path d="M -20 180 C 160 140 280 190 420 180 S 540 230 600 260" />
              <path d="M 600 260 C 670 300 790 350 930 380 S 1110 420 1220 440" />
            </g>

            {/* Layer D: Pedestrian Walkways & Paved Promenades */}
            <g stroke={mapColors.walkways} strokeWidth="3" strokeDasharray="4 4">
              <path d="M 545 145 C 510 160 480 200 480 260" />
              <path d="M 655 145 C 690 165 720 200 720 260" />
              <path d="M 600 330 L 600 290" />
              <path d="M 400 240 L 480 260" />
              <path d="M 760 200 C 710 220 670 240 640 260" />
            </g>
          </g>

          {/* ================= 5. CENTRAL COLLEGE GATE TERMINAL ROUNDABOUT ================= */}
          <g transform={`translate(${SHARED_GATE_COORDS.x}, ${SHARED_GATE_COORDS.y})`}>
            {/* Outer Roundabout Ring Road */}
            <circle r="44" fill="none" stroke={mapColors.roadFoundation} strokeWidth="26" filter="url(#mapShadow)" />
            <circle r="44" fill="none" stroke={mapColors.roadSurface} strokeWidth="20" />
            <circle r="44" fill="none" stroke={mapColors.centerline} strokeWidth="1.6" strokeDasharray="5 7" opacity={isDark ? 0.75 : 1} />

            {/* Central Roundabout Island */}
            <circle r="28" fill={mapColors.roundaboutIsland} stroke={mapColors.roundaboutInner} strokeWidth="2" />
            <circle r="20" fill={mapColors.roundaboutInner} />

            {/* Concentric Pulsing Green Rings */}
            <circle r="36" fill="#10B981" opacity={isDark ? 0.28 : 0.16} className="animate-ping" />
            <circle r="18" fill="#10B981" opacity={isDark ? 0.35 : 0.22} />

            {/* College Gate Entrance Monument Hub */}
            <circle r="13" fill="#10B981" stroke={mapColors.roadSurface} strokeWidth="3.5" filter="url(#gateHalo)" />

            {/* Gate Landmark Arch Icon */}
            <g transform="translate(-6, -6)">
              <rect x="1" y="2" width="2.5" height="8" fill="#FFFFFF" rx="0.8" />
              <rect x="8.5" y="2" width="2.5" height="8" fill="#FFFFFF" rx="0.8" />
              <path d="M 1 3 Q 6 -1 11 3" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* College Gate Main Terminal Pill & Label */}
            <g transform="translate(0, 36)">
              <rect
                x="-90"
                y="-13"
                width="180"
                height="26"
                rx="13"
                fill={mapColors.gateLabelBg}
                stroke={mapColors.gateLabelBorder}
                strokeWidth="1.8"
                filter="url(#mapShadow)"
              />
              <text
                y="3"
                textAnchor="middle"
                fill={mapColors.gateLabelText}
                fontSize="11"
                fontWeight="900"
                fontFamily="'Manrope', sans-serif"
                letterSpacing="0.4"
              >
                COLLEGE GATE TERMINAL
              </text>
            </g>
          </g>

          {/* ================= 6. CAMPUS WAYFINDING LABELS ================= */}
          {showLabels && (
            <g fontFamily="'Manrope', sans-serif">
              {/* Road Names with Contrast Background Badges */}
              <g transform="translate(260, 395) rotate(-16)">
                <rect x="-65" y="-10" width="130" height="18" rx="9" fill={mapColors.roadLabelBg} stroke={mapColors.roadLabelBorder} strokeWidth="1" />
                <text y="2.5" textAnchor="middle" fill={mapColors.roadLabelText} fontSize="9" fontWeight="800">
                  WEST CAMPUS BOULEVARD
                </text>
              </g>

              <g transform="translate(930, 205) rotate(10)">
                <rect x="-68" y="-10" width="136" height="18" rx="9" fill={mapColors.roadLabelBg} stroke={mapColors.roadLabelBorder} strokeWidth="1" />
                <text y="2.5" textAnchor="middle" fill={mapColors.roadLabelText} fontSize="9" fontWeight="800">
                  EAST UNIVERSITY EXPRESSWAY
                </text>
              </g>

              <g transform="translate(760, 140) rotate(-35)">
                <rect x="-55" y="-9" width="110" height="17" rx="8.5" fill={mapColors.roadLabelBg} stroke={mapColors.roadLabelBorder} strokeWidth="1" />
                <text y="2.5" textAnchor="middle" fill={mapColors.roadLabelText} fontSize="8.5" fontWeight="800">
                  NORTH LAKE PARKWAY
                </text>
              </g>

              <g transform="translate(360, 435) rotate(-38)">
                <rect x="-55" y="-9" width="110" height="17" rx="8.5" fill={mapColors.roadLabelBg} stroke={mapColors.roadLabelBorder} strokeWidth="1" />
                <text y="2.5" textAnchor="middle" fill={mapColors.roadLabelText} fontSize="8.5" fontWeight="800">
                  SOUTH VALLEY WAY
                </text>
              </g>

              {/* Major Campus Landmarks */}
              <text x="600" y="112" textAnchor="middle" fill={mapColors.landmarkText} fontSize="10.5" fontWeight="800">
                ADMINISTRATION & CLOCKTOWER
              </text>
              <text x="600" y="402" textAnchor="middle" fill={mapColors.landmarkText} fontSize="10.5" fontWeight="800">
                CENTRAL UNIVERSITY LIBRARY
              </text>
              <text x="940" y="52" textAnchor="middle" fill={isDark ? '#38BDF8' : '#2E6987'} fontSize="10" fontWeight="800">
                MIRROR LAKE
              </text>
              <text x="1020" y="388" textAnchor="middle" fill={isDark ? '#FB7185' : '#A84C38'} fontSize="10" fontWeight="800">
                VARSITY STADIUM & ATHLETICS
              </text>
              <text x="175" y="222" textAnchor="middle" fill={isDark ? '#34D399' : '#4B6344'} fontSize="9.5" fontWeight="800">
                CAMPUS ARBORETUM
              </text>
            </g>
          )}

          {/* ================= 7. DOTTED TRANSIT ROUTE (Rendered ONLY for selected bus!) ================= */}
          {activeGeometry && (
            <path
              d={activeGeometry.pathD}
              fill="none"
              stroke={activeBus?.color || '#7868E8'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="4 8"
              opacity="0.95"
              className="animate-pulse"
            />
          )}

          {/* ================= 8. STOP MARKERS (Along selected route) ================= */}
          {activeGeometry &&
            activeGeometry.stopPoints.map((pt, idx) => {
              const isGate = idx === activeGeometry.stopPoints.length - 1;
              if (isGate) return null; // Gate has its dedicated terminal marker above
              const stopName = activeGeometry.stops[idx] || `Stop ${idx + 1}`;
              const isEven = idx % 2 === 0;

              return (
                <g key={`stop-node-${idx}`}>
                  {/* Stop Shelter Platform Ring */}
                  <circle
                    cx={pt[0]}
                    cy={pt[1]}
                    r="6.5"
                    fill={activeBus?.color || '#7868E8'}
                    stroke={mapColors.roadSurface}
                    strokeWidth="2.5"
                    filter="url(#busGlow)"
                  />
                  <circle cx={pt[0]} cy={pt[1]} r="2" fill={mapColors.roadSurface} />

                  {/* Stop Name Badge with Contrast Background */}
                  <g transform={`translate(${pt[0] + (isEven ? 10 : -10)}, ${pt[1] + (isEven ? -12 : 16)})`}>
                    <text
                      textAnchor={isEven ? 'start' : 'end'}
                      fill={mapColors.stopText}
                      fontSize="9.5"
                      fontWeight="800"
                      stroke={mapColors.stopTextStroke}
                      strokeWidth="3.5"
                      paintOrder="stroke"
                      strokeLinejoin="round"
                      fontFamily="'Manrope', sans-serif"
                    >
                      {stopName}
                    </text>
                  </g>
                </g>
              );
            })}

          {/* ================= 9. NUMBERED MOVING BUS MARKERS ================= */}
          {busIds.map((busId) => {
            const bus = buses[busId];
            if (!bus) return null;
            const pos = pointOnRoute(bus.points, bus.progress);
            const isSelected = busId === activeBusId;

            return (
              <g
                key={busId}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedBusId(busId)}
                className="cursor-pointer transition-transform duration-150"
                opacity={bus.isOffline ? 0.6 : 1}
              >
                {/* Active Bus Radar Halo */}
                {isSelected && (
                  <circle
                    r="28"
                    fill={bus.color}
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Rotating Heading Arrow (Aligned along curve tangent) */}
                <g transform={`rotate(${pos.angle})`}>
                  <polygon
                    points="22,0 12,-6 14,0 12,6"
                    fill={bus.color}
                    opacity={isSelected ? 1 : 0.85}
                    filter="url(#busGlow)"
                  />
                </g>

                {/* Main Vehicle Marker Body */}
                <circle
                  r={isSelected ? 16 : 13.5}
                  fill={bus.color}
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  filter="url(#busGlow)"
                />

                {/* Numbered Marker Badge Digit ('01', '02', '03', '04') */}
                <text
                  y="4.5"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={isSelected ? '11' : '9.5'}
                  fontWeight="900"
                  fontFamily="'Manrope', sans-serif"
                >
                  {busId.replace('B', '0')}
                </text>

                {/* Floating Tooltip Label */}
                <g transform="translate(0, -25)">
                  <rect
                    x="-30"
                    y="-11"
                    width="60"
                    height="18"
                    rx="9"
                    fill={isDark ? '#0F1626' : '#1F2338'}
                    stroke={isDark ? '#38BDF8' : '#FFFFFF'}
                    strokeWidth="1.2"
                    filter="url(#busGlow)"
                  />
                  <text
                    y="2"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="800"
                    fontFamily="'Manrope', sans-serif"
                  >
                    {bus.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Map Bottom Bar: Route Legend & Active Bus Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white/95 dark:bg-[#111625]/95 backdrop-blur-md border-t border-[#E8E6F8] dark:border-[#1E2638] z-20 shrink-0">
        {/* Route Color Pills (Click to switch bus) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#7164ED] dark:text-cyan-400" />
            ROUTES:
          </span>
          {(['B1', 'B2', 'B3', 'B4'] as BusId[]).map((busId) => {
            const b = buses[busId];
            const isSelected = busId === activeBusId;
            return (
              <button
                key={busId}
                onClick={() => setSelectedBusId(busId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-extrabold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#1E1B4B] dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs dark:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-[#F4F6FB] dark:bg-[#1A2234] text-slate-600 dark:text-slate-300 hover:text-[#1E1B4B] dark:hover:text-cyan-300 hover:bg-[#EDE9FE] dark:hover:bg-[#242F48]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/50"
                  style={{ backgroundColor: b.color }}
                ></span>
                <span>{b.label}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  · {b.name.replace(' Route', '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Bus Live Telemetry */}
        <div className="flex items-center gap-3 text-xs">
          <div className="text-right">
            <span className="block font-extrabold text-[#1E1B4B] dark:text-white">
              {activeBus?.label} · {activeBus?.status}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono tabular-nums font-bold">
              ETA {activeBus?.etaMinutes}m · {activeBus?.currentSpeedKmh} km/h
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-200/60 dark:ring-emerald-500/30 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};
