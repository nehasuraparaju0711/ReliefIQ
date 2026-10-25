import React from 'react';
import Link from 'next/link';
import { Shield, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center text-white shadow-soft">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Relief<span className="text-primary-400">IQ</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            AI-Powered Community Resource Allocation & Crisis Prediction System. Designed for District Disaster
            Management Authorities, Humanitarian NGOs, and Community First Responders.
          </p>
          <p className="text-xs text-slate-500 font-mono">
            &quot;Predict crises. Allocate resources. Reach people first.&quot;
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/app/dashboard" className="hover:text-white transition-colors">
                Command Dashboard
              </Link>
            </li>
            <li>
              <Link href="/app/predict" className="hover:text-white transition-colors">
                Predictive Risk AI
              </Link>
            </li>
            <li>
              <Link href="/app/allocate" className="hover:text-white transition-colors">
                Resource Allocation Optimizer
              </Link>
            </li>
            <li>
              <Link href="/app/simulator" className="hover:text-white transition-colors">
                What-If Crisis Simulator
              </Link>
            </li>
            <li>
              <Link href="/app/dispatch" className="hover:text-white transition-colors">
                Dispatch & Tracking
              </Link>
            </li>
            <li>
              <Link href="/app/reports" className="hover:text-white transition-colors">
                Community Reports
              </Link>
            </li>
          </ul>
        </div>

        {/* Governance & Ethics */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Governance & Open Data</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                Algorithmic Fairness & Ethics
              </Link>
            </li>
            <li>
              <Link href="/about#models" className="hover:text-white transition-colors">
                Plain-Language Model Architecture
              </Link>
            </li>
            <li>
              <Link href="/about#data-sources" className="hover:text-white transition-colors">
                Data Sources (IMD, CWC, Census)
              </Link>
            </li>
            <li>
              <Link href="/auth" className="hover:text-white transition-colors">
                Demo User Access (1-Click)
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} ReliefIQ Disaster Support Platform. Tested for Krishna District, Andhra Pradesh.</p>
        <p className="flex items-center gap-1.5">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for community crisis resilience.
        </p>
      </div>
    </footer>
  );
}
