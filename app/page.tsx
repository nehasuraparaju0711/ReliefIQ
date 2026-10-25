'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle,
  Users,
  Compass,
  Boxes,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LiveMapPreview } from '@/components/landing/LiveMapPreview';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { Footer } from '@/components/landing/Footer';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { UserRole } from '@/lib/types';

export default function LandingPage() {
  const router = useRouter();
  const { loginAs } = useAuthStore();

  const handleDemoLogin = (role: UserRole) => {
    loginAs(role);
    if (role === 'volunteer') {
      router.push('/app/dispatch');
    } else {
      router.push('/app/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Top Public Header */}
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
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Crisis Decision Support</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/about" className="hover:text-primary-600 transition-colors">
              About & Ethics
            </Link>
            <Link href="/about#models" className="hover:text-primary-600 transition-colors">
              AI Models
            </Link>
            <Link href="/about#data-sources" className="hover:text-primary-600 transition-colors">
              Data Sources
            </Link>
            <Link href="/auth" className="hover:text-primary-600 transition-colors">
              Sign In
            </Link>
          </nav>

          {/* Quick Launch CTA */}
          <div className="flex items-center gap-3">
            <Link href="/auth">
              <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                Demo Sign In
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDemoLogin('district_officer')}
              className="gap-1.5 shadow-soft"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pastel-mint/80 border border-pastel-mint-border text-pastel-mint-dark text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>AI-Powered Crisis Decision Support</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Predict crises. <br />
              Allocate resources. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600">
                Reach people first.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              A decision-support platform where district officers, NGO coordinators, and volunteers can
              see where disasters are imminent, quantify supply shortages, and approve AI-recommended
              fair allocations in one click.
            </p>

            {/* Instant 1-Click Demo User Chips */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Explore Immediately As Demo User:
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleDemoLogin('district_officer')}
                  className="bg-primary-600 shadow-soft"
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  District Officer
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleDemoLogin('ngo_coordinator')}
                >
                  <Boxes className="w-4 h-4 mr-1.5 text-indigo-600" />
                  NGO Coordinator
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleDemoLogin('volunteer')}
                >
                  <Compass className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Field Volunteer
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                No login required to test
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Zero black-box AI
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Krishna District (AP) Calibrated
              </span>
            </div>
          </div>

          {/* Right Live Map Preview */}
          <div className="lg:col-span-5 w-full">
            <LiveMapPreview />
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white/70 border-y border-slate-200/80 backdrop-blur-md py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white/60 border border-slate-100 shadow-xs">
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">16 Mandals</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Real-Time Krishna District Zones
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/60 border border-slate-100 shadow-xs">
            <p className="text-3xl sm:text-4xl font-extrabold text-primary-600">1.8M+</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Vulnerable Citizens Monitored
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/60 border border-slate-100 shadow-xs">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">94.2%</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Predictive Model Confidence
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/60 border border-slate-100 shadow-xs">
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">&lt; 45 Mins</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Avg Time from Alert to Dispatch
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Interactive Explainer */}
      <HowItWorks />

      {/* 5 Crisis Types Use Cases */}
      <UseCasesSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-br from-primary-600 via-indigo-700 to-purple-800 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-pastel-butter" />
              Empowering Disaster Management Authorities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to See AI Crisis Allocation in Action?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Launch the live interactive demonstration with realistic Andhra Pradesh telemetry. Experience
              end-to-end prediction, optimization, manual overrides, and task dispatch.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleDemoLogin('district_officer')}
                className="bg-white text-primary-700 hover:bg-slate-50 font-bold border-0 shadow-xl"
              >
                Launch Live Command Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/40 hover:bg-white/10"
                >
                  Read Architecture & Ethics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}
