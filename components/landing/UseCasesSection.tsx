'use client';

import React, { useState } from 'react';
import { Waves, CloudLightning, SunMedium, Droplets, Biohazard, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState<string>('flood');

  const useCases = [
    {
      id: 'flood',
      label: 'River & Urban Flood',
      icon: Waves,
      badge: 'Critical Hazard',
      title: 'Krishna River Outflow & Budameru Deluge Containment',
      location: 'Vijayawada Urban & Diviseema Delta',
      description:
        'When upstream dams release over 8 Lakh Cusecs, low-lying colonies like Ajit Singh Nagar flood within hours. ReliefIQ predicts localized inundation levels 24 hours in advance and pre-positions heavy rescue boats and ration kits before road links submerge.',
      keyOutcomes: [
        'Prevented isolation of 14 island habitations in Diviseema',
        '8,500 families evacuated prior to causeway overtopping',
        'Real-time coordination with NDRF & SDRF motor dinghies',
      ],
      color: 'bg-pastel-sky/50 text-pastel-sky-dark border-pastel-sky-border',
    },
    {
      id: 'cyclone',
      label: 'Cyclone & Storm Surge',
      icon: CloudLightning,
      badge: 'Coastal Threat',
      title: 'Bay of Bengal Severe Cyclonic Squalls & Tidal Ingress',
      location: 'Machilipatnam Coast & Koduru Mangroves',
      description:
        'Coastal gales exceeding 100 km/h tear communication lines and drive seawater kilometers inland. ReliefIQ models wind drag and storm surge heights, prioritizing durable relief tents, emergency generator fuel, and drinking water storage.',
      keyOutcomes: [
        'Pre-allocation of 1,200 weather-proof family shelter tents',
        'Automated routing of coastal ambulance corridors',
        'Zero reported casualties in primary cyclone shelter nodes',
      ],
      color: 'bg-pastel-peach/50 text-pastel-peach-dark border-pastel-peach-border',
    },
    {
      id: 'heatwave',
      label: 'Severe Heatwave',
      icon: SunMedium,
      badge: 'Thermal Alert',
      title: 'Lethal Ambient Thermal Stress & Outdoor Labor Protection',
      location: 'Tiruvuru & Nuzvid Upland Mandals',
      description:
        'With mercury exceeding 46°C, agricultural and construction laborers face fatal heatstroke. ReliefIQ maps high-risk dry zones, scheduling dynamic water tanker shuttles, setting up community misting kiosks, and dispatching ORS hydration packs.',
      keyOutcomes: [
        '25 shaded rehydration stations operationalized in 2 hours',
        '15,000 ORS sachets distributed to rural primary health centres',
        'Mandated 11 AM - 4 PM field rest advisory compliance',
      ],
      color: 'bg-pastel-butter/50 text-pastel-butter-dark border-pastel-butter-border',
    },
    {
      id: 'drought',
      label: 'Agricultural Drought',
      icon: Droplets,
      badge: 'Slow-Onset Crisis',
      title: 'Groundwater Table Depletion & Potable Water Scarcity',
      location: 'Jaggaiahpet & Northern Dry Uplands',
      description:
        'Prolonged dry spells dry up borewells and trigger rural distress. ReliefIQ correlates rainfall deficits with aquifer exhaustion, routing municipal water tankers equitably to prevent inter-hamlet water conflicts.',
      keyOutcomes: [
        'Equitable tanker scheduling across 38 dry thandas',
        '42,000 liters of emergency drinking water delivered daily',
        'Priority allocation for schools and maternal healthcare clinics',
      ],
      color: 'bg-pastel-mint/50 text-pastel-mint-dark border-pastel-mint-border',
    },
    {
      id: 'outbreak',
      label: 'Post-Crisis Outbreak',
      icon: Biohazard,
      badge: 'Epidemic Hazard',
      title: 'Waterborne Gastroenteritis & Dengue Cluster Interception',
      location: 'Kaikaluru & Kolleru Wetland Belt',
      description:
        'Stagnant floodwaters create ideal vectors for cholera, leptospirosis, and dengue. ReliefIQ detects post-flood contamination patterns and directs chlorine distribution and anti-venom supplies before secondary epidemics claim lives.',
      keyOutcomes: [
        'Targeted chlorination across 40 wetland fishing hamlets',
        'Rapid staging of 750 emergency anti-venom & hydration kits',
        'Epidemic curve contained within 5 days of flood recession',
      ],
      color: 'bg-pastel-rose/50 text-pastel-rose-dark border-pastel-rose-border',
    },
  ];

  const current = useCases.find((u) => u.id === activeTab) || useCases[0];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-100">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Battle-Tested Across 5 Critical Crisis Types
        </h2>
        <p className="text-base text-slate-500 mt-2">
          Tailored models calibrated specifically for South Indian climate and demographic vulnerabilities.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {useCases.map((u) => {
          const Icon = u.icon;
          const isSelected = activeTab === u.id;
          return (
            <button
              key={u.id}
              onClick={() => setActiveTab(u.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-soft border-primary-600 scale-105'
                  : 'bg-white/80 text-slate-600 hover:bg-white border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{u.label}</span>
            </button>
          );
        })}
      </div>

      {/* Case Study Card */}
      <Card className="p-6 sm:p-10 bg-white/85 border-slate-200/90 shadow-2xl rounded-[28px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${current.color}`}>
                {current.badge}
              </span>
              <span className="text-xs font-semibold text-slate-500">{current.location}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {current.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">{current.description}</p>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Key System Outcomes
              </h4>
              <ul className="space-y-2">
                {current.keyOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-tr from-slate-50 to-indigo-50/50 border border-slate-200/70 text-center">
            <div className="w-16 h-16 rounded-3xl bg-white shadow-md flex items-center justify-center text-primary-600 mb-4">
              <current.icon className="w-8 h-8" />
            </div>
            <h4 className="text-base font-extrabold text-slate-800">Explore Simulation</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Test dynamic weather variations and inspect live AI allocation recommendations.
            </p>
            <Link href={`/app/simulator?type=${current.id}`} className="mt-5 w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full">
                Run {current.label} Simulator
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
