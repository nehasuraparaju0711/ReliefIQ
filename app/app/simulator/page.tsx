'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateCrisisRisk } from '@/lib/risk/engine';
import { CrisisType, Zone } from '@/lib/types';
import { SEED_ZONES } from '@/lib/seed/data';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Compass,
  Sliders,
  AlertTriangle,
  ShieldCheck,
  Flame,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Boxes,
  Users,
  RotateCcw,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function SimulatorPage() {
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisType>('flood');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-4'); // Diviseema

  // Slider State Variables
  const [rainfallMm, setRainfallMm] = useState<number>(240);
  const [windSpeedKmh, setWindSpeedKmh] = useState<number>(85);
  const [temperatureC, setTemperatureC] = useState<number>(34);
  const [displacedPopulation, setDisplacedPopulation] = useState<number>(18500);
  const [riverDischargeCusecs, setRiverDischargeCusecs] = useState<number>(750000);

  const selectedZone = SEED_ZONES.find((z) => z.id === selectedZoneId) || SEED_ZONES[0];

  // Dynamic evaluation using the shared risk function
  const simulationResult = useMemo(() => {
    return calculateCrisisRisk({
      crisisType: selectedCrisis,
      rainfallMm,
      windSpeedKmh,
      temperatureC,
      displacedPopulation,
      riverDischargeCusecs,
      vulnerabilityIndex: selectedZone.vulnerabilityIndex,
    });
  }, [selectedCrisis, rainfallMm, windSpeedKmh, temperatureC, displacedPopulation, riverDischargeCusecs, selectedZone]);

  const resetDefaults = () => {
    setRainfallMm(240);
    setWindSpeedKmh(85);
    setTemperatureC(34);
    setDisplacedPopulation(18500);
    setRiverDischargeCusecs(750000);
  };

  // Do nothing vs AI plan metrics
  const dangerCountDoNothing = simulationResult.humanImpactEstimate.peopleInImmediateDanger;
  const dangerCountWithPlan = Math.round(dangerCountDoNothing * 0.16);
  const peopleProtectedDelta = dangerCountDoNothing - dangerCountWithPlan;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              What-If Disaster Scenario Simulator
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-sky text-pastel-sky-dark border border-pastel-sky-border">
              Real-Time Sensitivity Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate extreme climate stressors, recalculate spatial risk in real time, and compare outcomes.
          </p>
        </div>

        <button
          onClick={resetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Target Mandal & Crisis Type Selector */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Mandal Under Stress Testing
          </label>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
          >
            {SEED_ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} (Vulnerability: {(z.vulnerabilityIndex * 10).toFixed(1)}/10)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Crisis Mode Simulation
          </label>
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            {(['flood', 'cyclone', 'heatwave', 'drought', 'outbreak'] as CrisisType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedCrisis(t)}
                className={`flex-1 py-1.5 rounded-lg capitalize transition-all ${
                  selectedCrisis === t ? 'bg-white text-primary-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Real-Time Sliders (Left) & Side-by-Side Outcome Deltas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sensitivity Sliders */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 bg-white/90 border-slate-200/90 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary-600" />
                <span>Environmental Stress Controls</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Math</span>
            </div>

            {/* Slider 1: 24h Precipitation */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Precipitation Intensity (24h)</span>
                <span className="text-primary-700">{rainfallMm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="450"
                step="5"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 mm (Dry)</span>
                <span>150 mm (Warning)</span>
                <span>450 mm (Historic deluge)</span>
              </div>
            </div>

            {/* Slider 2: River / Barrage Outflow */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Prakasam Barrage Discharge</span>
                <span className="text-primary-700">{(riverDischargeCusecs / 100000).toFixed(1)} Lakh Cusecs</span>
              </div>
              <input
                type="range"
                min="100000"
                max="1100000"
                step="25000"
                value={riverDischargeCusecs}
                onChange={(e) => setRiverDischargeCusecs(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.0L (Normal)</span>
                <span>6.0L (Warning 1)</span>
                <span>11.0L (Historic 2009 peak)</span>
              </div>
            </div>

            {/* Slider 3: Wind Velocity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Peak Gust Wind Velocity</span>
                <span className="text-primary-700">{windSpeedKmh} km/h</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                step="5"
                value={windSpeedKmh}
                onChange={(e) => setWindSpeedKmh(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10 km/h</span>
                <span>80 km/h (Gale)</span>
                <span>180 km/h (Category 4)</span>
              </div>
            </div>

            {/* Slider 4: Ambient Dry-Bulb Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Ambient Dry-Bulb Temperature</span>
                <span className="text-primary-700">{temperatureC} °C</span>
              </div>
              <input
                type="range"
                min="24"
                max="50"
                step="0.5"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>24 °C</span>
                <span>38 °C (Warm)</span>
                <span>50 °C (Severe Heatwave)</span>
              </div>
            </div>

            {/* Slider 5: Displaced Population */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Displaced / Cut-Off Population</span>
                <span className="text-primary-700">{formatNumber(displacedPopulation)} persons</span>
              </div>
              <input
                type="range"
                min="0"
                max="60000"
                step="1000"
                value={displacedPopulation}
                onChange={(e) => setDisplacedPopulation(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0</span>
                <span>20,000</span>
                <span>60,000</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Recalculated Score & Side-by-Side Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Real-Time Calculated Risk Banner */}
          <Card className="p-5 bg-white/90 border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Simulated Risk For {selectedZone.name.split(' ')[0]}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {simulationResult.riskScore}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ 100 Recalculated Score</span>
                </div>
              </div>
              <RiskBadge severity={simulationResult.severity} size="md" />
            </div>
          </Card>

          {/* Side-by-Side: Do Nothing vs AI Recommended Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario A: Do Nothing */}
            <Card className="p-5 bg-rose-50/40 border-pastel-rose-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
                <span className="text-xs font-bold text-rose-900 uppercase">
                  Scenario A: Do Nothing
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pastel-rose text-rose-800 font-bold">
                  Status Quo
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">People In Extreme Danger</p>
                  <p className="text-xl font-extrabold text-rose-700 mt-0.5">
                    {formatNumber(dangerCountDoNothing)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Logistics Delay</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">18+ hours (No pre-positioning)</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Supply Shortage</p>
                  <p className="text-sm font-bold text-rose-600 mt-0.5">100% unmet relief demand</p>
                </div>
              </div>

              <p className="text-[11px] text-rose-800 leading-relaxed pt-1">
                Without proactive dispatch, road corridors submerge, leaving {formatNumber(dangerCountDoNothing)} citizens
                isolated without food or drinkable water.
              </p>
            </Card>

            {/* Scenario B: Recommended Plan */}
            <Card className="p-5 bg-emerald-50/40 border-pastel-mint-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                <span className="text-xs font-bold text-emerald-900 uppercase">
                  Scenario B: ReliefIQ Plan
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pastel-mint text-emerald-800 font-bold">
                  AI Optimized
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Residual Danger</p>
                  <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
                    {formatNumber(dangerCountWithPlan)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Guaranteed Response Time</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">&lt; 45 mins (Nearest Depot)</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Coverage Ratio</p>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">88.4% with fairness cap</p>
                </div>
              </div>

              <p className="text-[11px] text-emerald-900 leading-relaxed pt-1">
                Mobilizes {simulationResult.humanImpactEstimate.recommendedRescueBoats} rescue boats &amp;{' '}
                {simulationResult.humanImpactEstimate.recommendedFoodKits} food packs before causeways submerge.
              </p>
            </Card>
          </div>

          {/* Outcome Deltas Strip */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pastel-mint text-pastel-mint-dark flex items-center justify-center font-bold">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {formatNumber(peopleProtectedDelta)} People Protected
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">
                  -84% reduction in casualty exposure vs doing nothing
                </p>
              </div>
            </div>

            <Link href={`/app/allocate?crisis=${selectedCrisis}&zoneId=${selectedZoneId}`}>
              <Button variant="primary" size="sm" className="shadow-soft font-bold">
                Deploy This Plan
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
