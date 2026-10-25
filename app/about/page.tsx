'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  BrainCircuit,
  SlidersHorizontal,
  Database,
  Scale,
  Users,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Footer } from '@/components/landing/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-800">
                  Relief<span className="text-primary-600">IQ</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">About & Scientific Foundation</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="#models" className="hover:text-primary-600 transition-colors">
              AI Models
            </Link>
            <Link href="#data-sources" className="hover:text-primary-600 transition-colors">
              Data Sources
            </Link>
            <Link href="#ethics" className="hover:text-primary-600 transition-colors">
              Fairness & Ethics
            </Link>
          </nav>

          <Link href="/auth">
            <Button variant="primary" size="sm">
              Open Demo Console
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-16">
        {/* Mission Statement */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-mint border border-pastel-mint-border text-pastel-mint-dark text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            Our Core Mission
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Bridging the Critical 48-Hour Humanitarian Logistics Gap
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed pt-2">
            During major climatic catastrophes like the Krishna River surges or Bay of Bengal cyclones,
            the difference between survival and devastation is logistics speed. ReliefIQ replaces chaotic,
            fragmented spreadsheets and guesswork with explainable predictive risk models and deterministic,
            fair resource optimization.
          </p>
        </section>

        {/* Section 1: How the Prediction Model Works (Plain Language) */}
        <section id="models" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pastel-lavender flex items-center justify-center text-pastel-lavender-dark border border-pastel-lavender-border">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">How the Prediction Engine Works</h2>
              <p className="text-xs text-slate-500">Plain-language explainable AI architecture</p>
            </div>
          </div>

          <Card className="p-6 sm:p-8 bg-white/90 border-slate-200/90 shadow-lg">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>
                Most commercial disaster tools rely on opaque black-box deep learning that output arbitrary numbers
                without accountability. ReliefIQ takes an <b>Explainable Machine Learning</b> approach based on
                calibrated Gradient Boosting with SHAP (SHapley Additive exPlanations) factor weights.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    1. Telemetry Ingestion
                  </h4>
                  <p className="text-xs text-slate-600">
                    Calculates precipitation rate (mm/24h), upstream river discharge from dams (Cusecs), ambient dry-bulb
                    temperatures, and satellite soil moisture.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    2. Topographic Exposure
                  </h4>
                  <p className="text-xs text-slate-600">
                    Accounts for elevation deltas, historical drainage bottlenecks (e.g. Budameru channel), and
                    embankment vulnerability.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    3. Demographic Vulnerability
                  </h4>
                  <p className="text-xs text-slate-600">
                    Weight is applied to zones with high densities of children, elderly citizens, low-income
                    thatched households, and cut-off island hamlets.
                  </p>
                </div>
              </div>

              <p className="pt-2">
                Every prediction outputs not just a 0–100 risk score, but a clear list of the <b>top contributing factors</b>,
                explaining why a zone is in peril so officers know whether to send rescue boats, drinking water tankers,
                or anti-venom medical packs.
              </p>
            </div>
          </Card>
        </section>

        {/* Section 2: How the Allocation Optimizer Works */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pastel-mint flex items-center justify-center text-pastel-mint-dark border border-pastel-mint-border">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">How Resource Optimization Works</h2>
              <p className="text-xs text-slate-500">Deterministic allocation with guaranteed fairness</p>
            </div>
          </div>

          <Card className="p-6 sm:p-8 bg-white/90 border-slate-200/90 shadow-lg">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>
                In a crisis, a naive optimization algorithm would simply dump all supplies into the most populous
                urban center because it is easiest to reach. This leaves isolated agrarian and coastal villages
                completely unserved.
              </p>
              <p>
                ReliefIQ utilizes a <b>Greedy Weighted Need-Score Algorithm with a Hard Fairness Cap</b>:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm pl-4 list-disc text-slate-600">
                <li>
                  <b>Fairness Ceiling (35% Cap):</b> No single zone can absorb more than 35% of total warehouse
                  inventory during an initial dispatch run, ensuring reserves remain for peripheral hamlets.
                </li>
                <li>
                  <b>Gini Equity Index:</b> The optimizer calculates an equity score (100 &times; [1 - Gini coefficient])
                  to minimize the disparity of unmet human need across all administrative boundaries.
                </li>
                <li>
                  <b>Haversine Depot Routing:</b> Automatically pairs each needy zone with the closest warehouse
                  holding verified stock, computing realistic convoy travel times and road clearances.
                </li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Section 3: Data Sources */}
        <section id="data-sources" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pastel-sky flex items-center justify-center text-pastel-sky-dark border border-pastel-sky-border">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Authoritative Data Sources</h2>
              <p className="text-xs text-slate-500">Verified feeds and open government telemetry</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 bg-white/80 border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-1">India Meteorological Department (IMD)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Doppler weather radar scans (Machilipatnam radar station), 24h/72h rainfall accumulations, cyclone
                track projections, and temperature extremes.
              </p>
            </Card>
            <Card className="p-5 bg-white/80 border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Central Water Commission (CWC) & Water Resources Dept</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Prakasam Barrage discharge logs (Cusecs), Nagarjuna Sagar reservoir inflow rates, and Krishna River gauge
                levels.
              </p>
            </Card>
            <Card className="p-5 bg-white/80 border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Census of India & Socio-Economic Surveys</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mandal-level population density, age demographics (infants, elderly), disability statistics, and housing
                classification (pucca vs. kutcha dwellings).
              </p>
            </Card>
            <Card className="p-5 bg-white/80 border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-1">OpenStreetMap & Survey of India</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Road network topologies, bridge crossings, causeway elevations, hospital locations, and cyclone shelter
                infrastructure.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 4: Ethics, Privacy, and Human Oversight */}
        <section id="ethics" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pastel-rose flex items-center justify-center text-pastel-rose-dark border border-pastel-rose-border">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Ethics, Privacy & Governance</h2>
              <p className="text-xs text-slate-500">Responsible AI principles built into code</p>
            </div>
          </div>

          <Card className="p-6 sm:p-8 bg-white/90 border-slate-200/90 shadow-lg space-y-4 text-sm text-slate-700 leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">Human-In-The-Loop Authority</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  The AI never executes automated dispatches independently. An authorized District Officer or NGO
                  coordinator must review, adjust if necessary, and explicitly sign off before convoys are mobilized.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">Data Minimization & Citizen Privacy</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Citizen incident reports only collect essential incident coordinates and emergency context. No
                  biometric or personally identifiable tracking data is stored or monetized.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">No Hardcoded Randomness</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Every optimization outcome is deterministic and reproducible. Given the same inventory and zone
                  urgencies, the system produces identical, verifiable distribution plans.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA to Demo */}
        <section className="text-center pt-6">
          <Link href="/auth">
            <Button variant="primary" size="lg" className="shadow-soft-lg">
              Explore the System Live
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
