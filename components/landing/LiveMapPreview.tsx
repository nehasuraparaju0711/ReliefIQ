'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Flame, Users, Navigation } from 'lucide-react';
import { RiskBadge } from '@/components/ui/Badge';
import { CrisisType } from '@/lib/types';

export function LiveMapPreview() {
  const [activeZone, setActiveZone] = useState<string>('diviseema');
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisType>('flood');

  const previewZones = [
    {
      id: 'diviseema',
      name: 'Diviseema Island Belt',
      x: '72%',
      y: '78%',
      risk: 'critical' as const,
      score: 91,
      pop: '62.4K',
      threat: 'River confluence & 2.4m storm surge',
    },
    {
      id: 'vijayawada',
      name: 'Vijayawada Urban Center',
      x: '38%',
      y: '42%',
      risk: 'critical' as const,
      score: 82,
      pop: '1.04M',
      threat: 'Budameru channel spillover',
    },
    {
      id: 'machilipatnam',
      name: 'Machilipatnam Coastal Port',
      x: '82%',
      y: '56%',
      risk: 'high' as const,
      score: 76,
      pop: '172K',
      threat: 'Bay depression gale gusts 95 km/h',
    },
    {
      id: 'avanigadda',
      name: 'Avanigadda Delta Basin',
      x: '64%',
      y: '68%',
      risk: 'high' as const,
      score: 85,
      pop: '78K',
      threat: 'Puligadda aqueduct seepage',
    },
    {
      id: 'nuzvid',
      name: 'Nuzvid Uplands',
      x: '46%',
      y: '22%',
      risk: 'medium' as const,
      score: 54,
      pop: '130K',
      threat: 'Localized groundwater drop',
    },
  ];

  const currentZone = previewZones.find((z) => z.id === activeZone) || previewZones[0];

  return (
    <div className="relative w-full rounded-[24px] overflow-hidden glass-card border border-slate-200/90 shadow-2xl bg-white/80 p-4 sm:p-6 select-none">
      {/* Top Header of Map Preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Live Krishna District Telemetry (AP)
          </span>
        </div>

        {/* Crisis Type Toggle Selector */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold">
          {(['flood', 'cyclone', 'heatwave'] as CrisisType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedCrisis(type)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                selectedCrisis === type
                  ? 'bg-white text-primary-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Stylized Visual Map Canvas */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl overflow-hidden mt-4 border border-slate-200/60 flex items-center justify-center">
        {/* Abstract river & delta vector paths representing Krishna River */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 120 0 Q 180 140 260 190 T 480 320 T 700 400"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 260 190 Q 320 270 420 380"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 480 320 Q 560 360 620 400"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Bay of Bengal coastal contour */}
          <path
            d="M 540 400 Q 640 310 800 240"
            fill="none"
            stroke="#6EE7B7"
            strokeWidth="6"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Radar sweep effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.06),transparent_70%)] animate-pulse" />

        {/* Interactive Zone Hotspots */}
        {previewZones.map((zone) => {
          const isSelected = activeZone === zone.id;
          return (
            <div
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              style={{ left: zone.x, top: zone.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Outer pulsing ring */}
              <span
                className={`absolute -inset-2 rounded-full opacity-40 animate-ping ${
                  zone.risk === 'critical' ? 'bg-pastel-rose-dark' : 'bg-primary-500'
                }`}
              />

              {/* Pin node */}
              <div
                className={`relative px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border transition-transform duration-200 ${
                  isSelected
                    ? 'scale-110 ring-2 ring-primary-600 bg-white font-bold'
                    : 'bg-white/90 group-hover:scale-105'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    zone.risk === 'critical'
                      ? 'bg-rose-500'
                      : zone.risk === 'high'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="text-[11px] font-bold text-slate-800">{zone.name.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{zone.score}</span>
              </div>
            </div>
          );
        })}

        {/* Active Zone Detail Drawer Overlay */}
        <motion.div
          key={currentZone.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-200/90 shadow-xl text-left"
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-800 truncate">{currentZone.name}</h4>
            <RiskBadge severity={currentZone.risk} size="sm" />
          </div>

          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            {currentZone.threat}
          </p>

          <div className="flex items-center justify-between text-[11px] pt-2 mt-2 border-t border-slate-100 text-slate-600">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              Pop: <b>{currentZone.pop}</b>
            </span>
            <span className="text-primary-600 font-bold flex items-center gap-0.5">
              Risk: {currentZone.score} / 100
            </span>
          </div>
        </motion.div>
      </div>

      {/* Floating Bottom Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
        <div className="p-2 rounded-xl bg-pastel-mint/40 border border-pastel-mint-border">
          <p className="text-[10px] uppercase font-bold text-slate-500">Predicted Coverage</p>
          <p className="text-sm font-extrabold text-slate-800 mt-0.5">92.4%</p>
        </div>
        <div className="p-2 rounded-xl bg-pastel-butter/40 border border-pastel-butter-border">
          <p className="text-[10px] uppercase font-bold text-slate-500">Fairness Index</p>
          <p className="text-sm font-extrabold text-slate-800 mt-0.5">88 / 100</p>
        </div>
        <div className="p-2 rounded-xl bg-pastel-lavender/40 border border-pastel-lavender-border">
          <p className="text-[10px] uppercase font-bold text-slate-500">Avg Fleet ETA</p>
          <p className="text-sm font-extrabold text-slate-800 mt-0.5">38 mins</p>
        </div>
      </div>
    </div>
  );
}
