'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CrisisType, Horizon, Severity, Zone, Alert } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { InteractiveMap } from '@/components/dashboard/InteractiveMap';
import { AlertsFeed } from '@/components/dashboard/AlertsFeed';
import { ZoneDrawer } from '@/components/dashboard/ZoneDrawer';
import { RiskCharts } from '@/components/dashboard/RiskCharts';
import { Button } from '@/components/ui/Button';
import {
  Waves,
  CloudLightning,
  SunMedium,
  Droplets,
  Biohazard,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  Compass,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state synchronization
  const crisisParam = (searchParams.get('type') || 'flood') as CrisisType;
  const horizonParam = (searchParams.get('horizon') || '24h') as Horizon;
  const severityParam = (searchParams.get('severity') || 'all') as Severity | 'all';

  const [selectedCrisis, setSelectedCrisis] = useState<CrisisType>(crisisParam);
  const [selectedHorizon, setSelectedHorizon] = useState<Horizon>(horizonParam);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>(severityParam);

  const [zones, setZones] = useState<Zone[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state to URL
  const updateUrlParams = (
    newCrisis = selectedCrisis,
    newHorizon = selectedHorizon,
    newSeverity = selectedSeverity
  ) => {
    const params = new URLSearchParams();
    params.set('type', newCrisis);
    params.set('horizon', newHorizon);
    if (newSeverity !== 'all') params.set('severity', newSeverity);
    router.replace(`/app/dashboard?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [zonesData, inventoryData, alertsData] = await Promise.all([
          apiClient.getZones(),
          apiClient.getInventory(),
          apiClient.getAlerts(),
        ]);
        setZones(zonesData);
        setWarehouses(inventoryData.warehouses);
        setAlerts(alertsData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone);
    setIsDrawerOpen(true);
  };

  const handleAlertZoneClick = (zoneId: string) => {
    const target = zones.find((z) => z.id === zoneId);
    if (target) {
      setSelectedZone(target);
      setIsDrawerOpen(true);
    }
  };

  const crisisTypes: { id: CrisisType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'flood', label: 'Flood Surge', icon: Waves },
    { id: 'cyclone', label: 'Cyclone', icon: CloudLightning },
    { id: 'heatwave', label: 'Heatwave', icon: SunMedium },
    { id: 'drought', label: 'Drought', icon: Droplets },
    { id: 'outbreak', label: 'Epidemic', icon: Biohazard },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Context Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Krishna District Command Dashboard
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border">
              AP Telemetry Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time geospatial risk synthesis, multi-threat alerts, and resource disposition.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/app/allocate">
            <Button variant="primary" size="sm" className="shadow-soft gap-1.5 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Launch AI Optimizer</span>
            </Button>
          </Link>
          <Link href="/app/simulator">
            <Button variant="secondary" size="sm" className="gap-1.5 font-bold">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>What-If Simulator</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Filter Strip (Syncs to URL query params) */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Crisis Type Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Crisis:
          </span>
          {crisisTypes.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCrisis === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCrisis(c.id);
                  updateUrlParams(c.id, selectedHorizon, selectedSeverity);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-soft border-primary-600'
                    : 'bg-white/80 hover:bg-white text-slate-600 border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Horizon (24h / 72h / 7d) & Severity Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Horizon */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['24h', '72h', '7d'] as Horizon[]).map((h) => (
              <button
                key={h}
                onClick={() => {
                  setSelectedHorizon(h);
                  updateUrlParams(selectedCrisis, h, selectedSeverity);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedHorizon === h
                    ? 'bg-white text-primary-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => {
              const val = e.target.value as Severity | 'all';
              setSelectedSeverity(val);
              updateUrlParams(selectedCrisis, selectedHorizon, val);
            }}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Filter by severity level"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High & Above</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <KpiCards zones={zones} selectedCrisis={selectedCrisis} />

      {/* Main Grid: Interactive Map + Live Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <InteractiveMap
            zones={zones}
            warehouses={warehouses}
            selectedCrisis={selectedCrisis}
            selectedZone={selectedZone}
            onSelectZone={handleZoneSelect}
            severityFilter={selectedSeverity}
          />
        </div>

        <div className="lg:col-span-4">
          <AlertsFeed initialAlerts={alerts} onZoneClick={handleAlertZoneClick} />
        </div>
      </div>

      {/* Trend Forecast & Supply vs Demand Charts */}
      <RiskCharts horizon={selectedHorizon} selectedCrisis={selectedCrisis} />

      {/* Click-to-open Side Drawer for Selected Zone */}
      <ZoneDrawer
        zone={selectedZone}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedCrisis={selectedCrisis}
      />
    </div>
  );
}
