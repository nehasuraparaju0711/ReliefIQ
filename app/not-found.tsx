'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <Card className="max-w-md w-full text-center p-8 bg-white/90 shadow-2xl border-slate-200 rounded-[28px]">
        <div className="w-16 h-16 rounded-3xl bg-pastel-butter text-pastel-butter-dark border border-pastel-butter-border mx-auto flex items-center justify-center mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          HTTP 404 Error
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Spatial Unit Not Found</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The requested crisis coordinate or platform module does not exist or has been shifted during disaster restructuring.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row gap-2.5">
          <Link href="/app/dashboard" className="flex-1">
            <Button variant="primary" size="md" className="w-full gap-1.5 font-bold shadow-soft">
              <LayoutDashboard className="w-4 h-4" />
              <span>Command Dashboard</span>
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" size="md" className="w-full gap-1.5 font-semibold">
              <Home className="w-4 h-4" />
              <span>Landing Home</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
