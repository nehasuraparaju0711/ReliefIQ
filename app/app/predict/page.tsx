'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CrisisType, Horizon, Zone, Prediction } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BrainCircuit,
  SlidersHorizontal,
  Clock,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function PredictPage() {
  const searchParams = useSearchParams();
  const initialZone = searchParams.get('zone') || 'zone-4';
  const initialType = (searchParams.get('type') || 'flood') as CrisisType;

  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(initialZone);
  const [selectedType, setSelectedType] = useState<CrisisType>(initialType);
  const [selectedHorizon, setSelectedHorizon] = useState<Horizon>('24h');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const fetchedZones = await apiClient.getZones();
        setZones(fetchedZones);
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchPrediction() {
      if (!selectedZoneId) return;
      try {
        setIsLoading(true);
        const data = await apiClient.getPrediction(selectedZoneId, selectedType, selectedHorizon);
        setPrediction(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrediction();
  }, [selectedZoneId, selectedType, selectedHorizon]);

  const activeZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Explainable Crisis Predictor
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-lavender text-pastel-lavender-dark border border-pastel-lavender-border">
              Gradient-Boosted Model v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Machine learning forecast breakdown with SHAP feature attributions and sensor freshness telemetry.
          </p>
        </div>

        {/* Data Freshness Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Telemetry Synced: <strong>3 mins ago</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500">IMD Radar &amp; CWC Outflow Live</span>
        </div>
      </div>

      {/* Control Bar: Region / Crisis Type / Horizon */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Zone Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Select Mandal / Spatial Unit
          </label>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} (Pop: {z.population.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        {/* Crisis Type Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Hazard / Crisis Mode
          </label>
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            {(['flood', 'cyclone', 'heatwave', 'drought', 'outbreak'] as CrisisType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`flex-1 py-1.5 rounded-lg capitalize transition-all text-center ${
                  selectedType === t ? 'bg-white text-primary-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Horizon Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Forecast Horizon
          </label>
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            {(['24h', '72h', '7d'] as Horizon[]).map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                  selectedHorizon === h ? 'bg-white text-primary-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                {h} Horizon
              </button>
            ))}
          </div>
        </div>
      </div>

      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Risk Gauge & Overview */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-white/90 border-slate-200/90 shadow-md text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Composite Risk Assessment
              </span>

              {/* Gauge Display */}
              <div className="my-6 relative inline-flex items-center justify-center">
                <svg className="w-44 h-44 -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="#F1F5F9"
                    strokeWidth="16"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke={
                      prediction.riskScore >= 80
                        ? '#BE123C'
                        : prediction.riskScore >= 65
                        ? '#B85014'
                        : prediction.riskScore >= 40
                        ? '#946C00'
                        : '#107E54'
                    }
                    strokeWidth="16"
                    strokeDasharray={452}
                    strokeDashoffset={452 - (452 * prediction.riskScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {prediction.riskScore}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">
                    Score / 100
                  </span>
                </div>
              </div>

              <div className="flex justify-center mb-3">
                <RiskBadge severity={prediction.severity} size="md" />
              </div>

              <p className="text-xs text-slate-600 px-2 leading-relaxed">
                Model confidence: <strong>{prediction.confidence}%</strong> based on telemetry completeness
                and historical validation.
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link href={`/app/allocate?zoneId=${prediction.zoneId}&crisis=${selectedType}`}>
                  <Button variant="primary" size="md" className="w-full gap-2 shadow-soft font-bold">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Run Optimization For This Mandal</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Historical Context Card */}
            <Card className="p-5 bg-white/80 border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Historical Benchmark Context
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {prediction.historicalContext}
              </p>
              {activeZone && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <p>• Historical Disaster Incidents: <strong>{activeZone.historicalIncidents.length} recorded</strong></p>
                  <p>• Vulnerability Rank: <strong>{(activeZone.vulnerabilityIndex * 10).toFixed(1)} / 10</strong></p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: "Why This Prediction?" Factors & Forecast Timeline */}
          <div className="lg:col-span-8 space-y-6">
            {/* "Why This Prediction?" Explainable AI Panel */}
            <Card className="p-6 bg-white/90 border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-pastel-lavender flex items-center justify-center text-pastel-lavender-dark">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Why This Prediction? (Explainable AI Attribution)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Top contributing factors driving the {prediction.riskScore} risk score
                    </p>
                  </div>
                </div>
              </div>

              {/* Factors List with Horizontal Bars */}
              <div className="mt-5 space-y-4">
                {prediction.factors.map((factor) => (
                  <div key={factor.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{factor.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">{factor.impactValue}</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold">
                          {factor.contributionPct}% Weight
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          factor.direction === 'increases_risk' ? 'bg-primary-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${factor.contributionPct}%` }}
                      />
                    </div>

                    {/* Plain English explanation */}
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {factor.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Forecast Timeline with Confidence Band */}
            <Card className="p-6 bg-white/90 border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Forecast Timeline &amp; Confidence Band
                  </h4>
                  <p className="text-xs text-slate-400">
                    Predicted trajectory with upper and lower boundary bounds ({selectedHorizon})
                  </p>
                </div>
              </div>

              <div className="h-[220px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={prediction.forecastTimeline}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="predArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="predConf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="timeLabel" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="transparent"
                      fill="url(#predConf)"
                      name="Upper Bound"
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#4F46E5"
                      strokeWidth={2.5}
                      fill="url(#predArea)"
                      name="Forecast Score"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
