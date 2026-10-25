'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Flame, Users, Percent, Truck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { Zone, CrisisType } from '@/lib/types';

interface KpiCardsProps {
  zones: Zone[];
  selectedCrisis: CrisisType;
}

export function KpiCards({ zones, selectedCrisis }: KpiCardsProps) {
  // Compute numbers consistently based on zones data
  const criticalZones = zones.filter(
    (z) => z.riskByCrisis[selectedCrisis]?.severity === 'critical'
  );
  const highZones = zones.filter(
    (z) => z.riskByCrisis[selectedCrisis]?.severity === 'high'
  );

  const totalHighRiskZonesCount = criticalZones.length + highZones.length;

  const totalPeopleAtRisk = zones.reduce((sum, z) => {
    const risk = z.riskByCrisis[selectedCrisis];
    if (risk && risk.score >= 40) {
      return sum + Math.round(z.population * (risk.score / 100) * 0.42);
    }
    return sum;
  }, 0);

  // Stock vs requirement calculation
  const totalRationStock = zones.reduce((sum, z) => sum + (z.stock.food_kits || 0), 0);
  const totalRequiredKits = Math.round(totalPeopleAtRisk / 4.2);
  const resourceGapPct = Math.max(
    8,
    Math.min(68, Math.round(((totalRequiredKits - totalRationStock) / totalRequiredKits) * 100))
  );

  const activeTeams = 18; // 18 SDRF & volunteer squads active in Krishna District

  const cards = [
    {
      title: 'High & Critical Risk Zones',
      value: `${totalHighRiskZonesCount} Mandals`,
      sub: `${criticalZones.length} on Red Evacuation Alert`,
      icon: Flame,
      color: 'bg-pastel-rose text-pastel-rose-dark border-pastel-rose-border',
      trend: '+2 in last 24h',
      trendDir: 'up',
    },
    {
      title: 'Vulnerable Population At Risk',
      value: formatNumber(totalPeopleAtRisk),
      sub: 'Elderly, infants, & flood-plain habitations',
      icon: Users,
      color: 'bg-pastel-peach text-pastel-peach-dark border-pastel-peach-border',
      trend: '+12% risk delta',
      trendDir: 'up',
    },
    {
      title: 'Est. District Resource Gap',
      value: `${resourceGapPct}%`,
      sub: 'Dry ration & drinking water deficit',
      icon: Percent,
      color: 'bg-pastel-butter text-pastel-butter-dark border-pastel-butter-border',
      trend: '-4% after recent dispatch',
      trendDir: 'down',
    },
    {
      title: 'Field Response Squads Mobilized',
      value: `${activeTeams} Teams`,
      sub: 'SDRF, NDRF, & Volunteer Convoys',
      icon: Truck,
      color: 'bg-pastel-mint text-pastel-mint-dark border-pastel-mint-border',
      trend: '100% operational',
      trendDir: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <Card
            key={idx}
            className="p-5 bg-white/85 border-slate-200/90 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {c.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border ${c.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{c.value}</p>
              <p className="text-xs text-slate-500 mt-1">{c.sub}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span
                className={`font-semibold flex items-center gap-0.5 ${
                  c.trendDir === 'down' ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {c.trend}
              </span>
              <span className="text-slate-400">Live Telemetry</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
