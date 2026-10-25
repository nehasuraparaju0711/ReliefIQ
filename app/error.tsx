'use client';

import React, { useEffect } from 'react';
import { ShieldX, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('System error captured in boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <Card className="max-w-md w-full text-center p-8 bg-white/90 shadow-2xl border-slate-200 rounded-[28px]">
        <div className="w-16 h-16 rounded-3xl bg-pastel-rose text-pastel-rose-dark border border-pastel-rose-border mx-auto flex items-center justify-center mb-5">
          <ShieldX className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
          Telemetry Runtime Exception
        </span>
        <h1 className="text-xl font-extrabold text-slate-900 mt-1">Application State Error</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {error.message || 'An unexpected error occurred while synchronizing crisis telemetry feeds.'}
        </p>

        <div className="pt-6 flex flex-col sm:flex-row gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() => reset()}
            className="flex-1 gap-1.5 font-bold shadow-soft"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Telemetry</span>
          </Button>
          <Link href="/app/dashboard" className="flex-1">
            <Button variant="secondary" size="md" className="w-full gap-1.5 font-semibold">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
