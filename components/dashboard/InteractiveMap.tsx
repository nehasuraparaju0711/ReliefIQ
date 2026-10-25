'use client';

import React, { useState, useEffect } from 'react';
import { Zone, Warehouse, Severity, CrisisType } from '@/lib/types';
import { RiskBadge } from '@/components/ui/Badge';
import { ShieldCheck, Flame, AlertTriangle, AlertCircle, Warehouse as WarehouseIcon, Layers, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  zones: Zone[];
  warehouses: Warehouse[];
  selectedCrisis: CrisisType;
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone) => void;
  severityFilter?: Severity | 'all';
}

export function InteractiveMap({
  zones,
  warehouses,
  selectedCrisis,
  selectedZone,
  onSelectZone,
  severityFilter = 'all',
}: InteractiveMapProps) {
  const [showWarehouses, setShowWarehouses] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);

  // Center bounds around Krishna District, Andhra Pradesh
  // Lat range: 15.8 to 17.15, Lon range: 80.05 to 81.35
  const minLat = 15.8;
  const maxLat = 17.2;
  const minLng = 80.05;
  const maxLng = 81.4;

  const getCoordinatesPct = (coords: [number, number]) => {
    const [lat, lng] = coords;
    // X axis: Lng from min to max (80.05 to 81.4)
    const xPct = Math.min(94, Math.max(6, ((lng - minLng) / (maxLng - minLng)) * 100));
    // Y axis: Lat from max to min (inverted for screen space)
    const yPct = Math.min(94, Math.max(6, ((maxLat - lat) / (maxLat - minLat)) * 100));
    return { x: `${xPct}%`, y: `${yPct}%` };
  };

  const filteredZones = zones.filter((zone) => {
    const risk = zone.riskByCrisis[selectedCrisis] || { severity: 'low' as Severity };
    if (severityFilter === 'all') return true;
    return risk.severity === severityFilter;
  });

  return (
    <div className="relative w-full h-[520px] rounded-[24px] overflow-hidden glass-card border border-slate-200/90 shadow-xl bg-gradient-to-br from-slate-50 via-indigo-50/20 to-sky-50/30 select-none">
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-bold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Krishna District Spatial Grid</span>
          <span className="text-[10px] text-slate-400 font-normal">| {filteredZones.length} Zones Visible</span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowWarehouses(!showWarehouses)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all shadow-xs',
              showWarehouses
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
            )}
            aria-label="Toggle warehouse layer"
          >
            <WarehouseIcon className="w-3.5 h-3.5" />
            <span>Depots ({warehouses.length})</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/80 p-0.5 shadow-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div
        className="w-full h-full relative transition-transform duration-300 overflow-hidden"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* River paths SVG representation */}
        <svg
          className="absolute inset-0 w-full h-full opacity-45 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* District Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Main Krishna River Flow Path */}
          <path
            d="M 140 180 Q 280 260 420 310 T 680 430 T 920 490"
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth="32"
            strokeLinecap="round"
          />
          {/* Munneru & Budameru Tributaries */}
          <path
            d="M 210 40 Q 250 140 280 260"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 420 310 Q 520 220 740 160"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Bay of Bengal Coastline Boundary */}
          <path
            d="M 520 520 Q 720 460 980 340"
            fill="none"
            stroke="#34D399"
            strokeWidth="6"
            strokeDasharray="8 6"
          />
        </svg>

        {/* Zone Nodes */}
        {filteredZones.map((zone) => {
          const risk = zone.riskByCrisis[selectedCrisis] || { score: 40, severity: 'medium' as Severity };
          const pos = getCoordinatesPct(zone.geometry.coordinates);
          const isSelected = selectedZone?.id === zone.id;
          const isCritical = risk.severity === 'critical';

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone)}
              onMouseEnter={() => setHoveredZone(zone)}
              onMouseLeave={() => setHoveredZone(null)}
              style={{ left: pos.x, top: pos.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              {/* Critical Pulsing Radar Wave */}
              {isCritical && (
                <span className="absolute -inset-3 rounded-full bg-pastel-rose-dark opacity-35 animate-ping" />
              )}

              {/* Pin Pill Marker */}
              <div
                className={cn(
                  'relative px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border transition-all duration-200 select-none',
                  isSelected
                    ? 'ring-2 ring-primary-600 scale-110 bg-white font-bold shadow-lg'
                    : 'bg-white/95 group-hover:scale-105 group-hover:bg-white',
                  risk.severity === 'critical'
                    ? 'border-pastel-rose-border text-rose-950'
                    : risk.severity === 'high'
                    ? 'border-pastel-peach-border text-amber-950'
                    : risk.severity === 'medium'
                    ? 'border-pastel-butter-border text-yellow-950'
                    : 'border-pastel-mint-border text-emerald-950'
                )}
              >
                <span
                  className={cn(
                    'w-2.5 h-2.5 rounded-full flex-shrink-0',
                    risk.severity === 'critical'
                      ? 'bg-rose-500 animate-pulse'
                      : risk.severity === 'high'
                      ? 'bg-amber-500'
                      : risk.severity === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-emerald-500'
                  )}
                />
                <span className="text-xs font-bold whitespace-nowrap">
                  {zone.name.split(' ')[0]}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-extrabold px-1.5 py-0.2 rounded-full',
                    risk.severity === 'critical'
                      ? 'bg-pastel-rose text-pastel-rose-dark'
                      : risk.severity === 'high'
                      ? 'bg-pastel-peach text-pastel-peach-dark'
                      : risk.severity === 'medium'
                      ? 'bg-pastel-butter text-pastel-butter-dark'
                      : 'bg-pastel-mint text-pastel-mint-dark'
                  )}
                >
                  {risk.score}
                </span>
              </div>
            </div>
          );
        })}

        {/* Warehouse Depots */}
        {showWarehouses &&
          warehouses.map((wh) => {
            const pos = getCoordinatesPct(wh.coordinates);
            return (
              <div
                key={wh.id}
                style={{ left: pos.x, top: pos.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                  <WarehouseIcon className="w-4 h-4 text-pastel-butter" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900 text-white text-[10px] rounded-lg whitespace-nowrap font-semibold shadow-md pointer-events-none">
                  {wh.name}
                </div>
              </div>
            );
          })}
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-4 text-xs font-medium text-slate-600">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Critical (80+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>High (65+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span>Medium (40+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Low</span>
        </div>
      </div>
    </div>
  );
}
