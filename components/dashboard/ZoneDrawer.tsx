'use client';

import React from 'react';
import Link from 'next/link';
import { Zone, CrisisType } from '@/lib/types';
import { Drawer } from '@/components/ui/Modal';
import { RiskBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Users,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface ZoneDrawerProps {
  zone: Zone | null;
  isOpen: boolean;
  onClose: () => void;
  selectedCrisis: CrisisType;
}

export function ZoneDrawer({
  zone,
  isOpen,
  onClose,
  selectedCrisis,
}: ZoneDrawerProps) {
  if (!zone) return null;

  const risk = zone.riskByCrisis[selectedCrisis] || {
    score: 45,
    severity: 'medium' as const,
    summary: 'Standard seasonal monitoring.',
  };

  // Estimated need based on population and risk
  const estRationNeed = Math.round((zone.population * (risk.score / 100) * 0.12));
  const estWaterNeed = Math.round((zone.population * (risk.score / 100) * 0.8));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={zone.name}
      description="Krishna District Administration Spatial Unit"
      width="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Risk Score & Severity Strip */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {selectedCrisis.toUpperCase()} Threat Evaluation
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-900">{risk.score}</span>
              <span className="text-xs text-slate-500 font-semibold">/ 100 Risk Score</span>
            </div>
          </div>
          <RiskBadge severity={risk.severity} size="md" />
        </div>

        {/* Threat Summary Narrative */}
        <div className="p-3.5 rounded-xl bg-pastel-lavender/40 border border-pastel-lavender-border text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-pastel-lavender-dark mb-1">Predictive Intelligence Brief:</p>
          <p>{risk.summary}</p>
        </div>

        {/* Demographics & Vulnerable Groups */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
            <Users className="w-3.5 h-3.5 text-primary-600" />
            Demographic Vulnerability Profile
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Population</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">{formatNumber(zone.population)}</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Vulnerability Index</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {(zone.vulnerabilityIndex * 10).toFixed(1)} / 10
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Children (&lt; 10 yrs)</span>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {formatNumber(zone.vulnerableGroups.children)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Elderly (&gt; 60 yrs)</span>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {formatNumber(zone.vulnerableGroups.elderly)}
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 Predicted Threats */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Top 3 Imminent Threat Vectors
          </h4>
          <div className="space-y-2">
            {zone.topThreats.map((threat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-start gap-2.5 text-xs text-slate-700"
              >
                <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <span className="font-medium leading-relaxed">{threat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock vs Estimated Need */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
            <Boxes className="w-3.5 h-3.5 text-primary-600" />
            On-Site Stock vs Estimated Need
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Food Ration Kits</p>
                <p className="text-[11px] text-slate-400">Current Stock: {zone.stock.food_kits} kits</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Est. Need:</span>
                <p className="font-extrabold text-rose-600">{formatNumber(estRationNeed)} kits</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Potable Water</p>
                <p className="text-[11px] text-slate-400">Current Stock: {zone.stock.potable_water} L</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Est. Need:</span>
                <p className="font-extrabold text-rose-600">{formatNumber(estWaterNeed)} L</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Rescue Motorboats</p>
                <p className="text-[11px] text-slate-400">Current: {zone.stock.rescue_boats || 0} craft</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Required:</span>
                <p className="font-extrabold text-slate-700">
                  {risk.severity === 'critical' ? '12 craft' : '4 craft'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            AI Recommended Response Directives
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {zone.recommendedActions.map((action, i) => (
              <li
                key={i}
                className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button: Allocate Now */}
        <div className="pt-2 sticky bottom-0 bg-white/95 pb-2 border-t border-slate-100">
          <Link href={`/app/allocate?zoneId=${zone.id}&crisis=${selectedCrisis}`}>
            <Button variant="primary" size="lg" className="w-full shadow-soft-lg gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Allocate Resources for {zone.name.split(' ')[0]} Now</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </Link>
        </div>
      </div>
    </Drawer>
  );
}
