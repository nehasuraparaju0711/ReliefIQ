'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Brain, Sliders, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Telemetry & Ingestion',
      subtitle: 'Multi-Stream Satellite & Gauge Feeds',
      icon: Radio,
      color: 'bg-pastel-sky text-pastel-sky-dark border-pastel-sky-border',
      summary:
        'Continuous ingestion of IMD Doppler radar, Central Water Commission barrage release rates, reservoir capacities, and real-time citizen grievance reports across all 16 Mandals.',
      metrics: ['15-minute sensor sync', '16 Mandals mapped', '99.8% uptime'],
      codeSnippet: `// Input stream ingestion
const riverDischarge = telemetry.getPrakasamBarrageOutflow(); // 8.5L Cusecs
const tidalForecast = coastalSensors.getBayOfBengalSurge(); // +2.4m`,
    },
    {
      step: '02',
      title: 'Predictive Risk Modeling',
      subtitle: 'Explainable Gradient-Boosted Assessment',
      icon: Brain,
      color: 'bg-pastel-lavender text-pastel-lavender-dark border-pastel-lavender-border',
      summary:
        'Instead of opaque black-box predictions, ReliefIQ breaks down exact risk contributors—topography, vulnerable populations, embankment stress, and rainfall—with clear plain-English justifications.',
      metrics: ['94.2% test accuracy', 'SHAP factor weights', '3 forecast horizons'],
      codeSnippet: `// Explainable AI scoring
const { riskScore, factors } = calculateCrisisRisk({
  rainfallMm: 240,
  riverDischarge: 850000,
  vulnerabilityIndex: 0.92 // Diviseema
});`,
    },
    {
      step: '03',
      title: 'Equitable Optimization',
      subtitle: 'Deterministic Greedy Allocation with Fairness Cap',
      icon: Sliders,
      color: 'bg-pastel-mint text-pastel-mint-dark border-pastel-mint-border',
      summary:
        'Our mathematical optimizer balances urgent need against equitable distribution. A strict fairness cap ensures no single privileged area hoards resources while high-risk remote hamlets are left behind.',
      metrics: ['Gini fairness index', 'Min coverage guarantee', 'Nearest-depot routing'],
      codeSnippet: `// Linear & heuristic optimizer
const plan = runResourceOptimizer({
  zones: vulnerableZones,
  warehouses: apDepots,
  fairnessCapPct: 35 // prevents hoarding
});`,
    },
    {
      step: '04',
      title: 'One-Click Field Dispatch',
      subtitle: 'Real-Time Convoy Tracking & Volunteer Tasks',
      icon: CheckCircle2,
      color: 'bg-pastel-peach text-pastel-peach-dark border-pastel-peach-border',
      summary:
        'District Magistrates approve optimal plans with a single tap. Tasks automatically route to SDRF motor convoys and volunteer mobile apps with turn-by-turn ETA and delivery verification.',
      metrics: ['< 45 min dispatch', 'Mobile-first volunteer UI', 'Delivery confirmation'],
      codeSnippet: `// Dispatched task orchestration
await crisisService.approvePlan(plan.id);
// Convoys 1-6 mobilized from Machilipatnam & Vijayawada Hubs`,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-lavender/80 border border-pastel-lavender-border text-pastel-lavender-dark text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How ReliefIQ Works in 4 Steps
        </h2>
        <p className="text-base text-slate-500 mt-3 leading-relaxed">
          From incoming precipitation spikes to the final emergency ration kit delivered at a flooded doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Step Selector Tabs */}
        <div className="lg:col-span-5 space-y-3">
          {steps.map((s, idx) => {
            const isCurrent = activeStep === idx;
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-white shadow-xl border-primary-200 ring-2 ring-primary-500/20'
                    : 'bg-white/60 hover:bg-white/90 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${s.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Step {s.step}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">{s.title}</h4>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isCurrent ? 'text-primary-600 rotate-90' : 'text-slate-300'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Display Panel for Selected Step */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-6 sm:p-8 bg-white/90 border-slate-200/90 shadow-2xl rounded-[24px]">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                      Phase {steps[activeStep].step} Deep-Dive
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
                      {steps[activeStep].subtitle}
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    Step {steps[activeStep].step} / 04
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {steps[activeStep].summary}
                </p>

                {/* Key Metrics Pills */}
                <div className="grid grid-cols-3 gap-2.5 my-5">
                  {steps[activeStep].metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center"
                    >
                      <p className="text-xs font-bold text-slate-800">{metric}</p>
                    </div>
                  ))}
                </div>

                {/* Logic / Code representation */}
                <div className="rounded-xl bg-slate-900 text-slate-200 p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                  <pre>{steps[activeStep].codeSnippet}</pre>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
