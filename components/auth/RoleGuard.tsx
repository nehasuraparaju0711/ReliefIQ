'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { UserRole } from '@/lib/types';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export function RoleGuard({
  children,
  allowedRoles = ['district_officer', 'ngo_coordinator', 'volunteer'],
  fallbackTitle = 'Restricted Access for Current Role',
  fallbackMessage = 'This module requires elevated administrative or coordination clearance. Use demo role switcher below to proceed.',
}: RoleGuardProps) {
  const { role, switchRole } = useAuthStore();
  const currentRole = role || 'district_officer';

  const isAllowed = allowedRoles.includes(currentRole);

  if (isAllowed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <Card className="max-w-lg w-full text-center p-8 bg-white/90 shadow-xl border-slate-200">
        <CardContent className="space-y-5 p-0">
          <div className="w-16 h-16 rounded-3xl bg-pastel-rose text-pastel-rose-dark border border-pastel-rose-border mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">{fallbackTitle}</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{fallbackMessage}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <p className="text-xs font-semibold text-slate-600 mb-1">Current Active Role:</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold capitalize text-slate-800">
                {currentRole.replace('_', ' ')}
              </span>
              <span className="text-xs text-rose-600 font-medium">Insufficient Permissions</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              1-Click Demo Elevation
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => switchRole('district_officer')}
              >
                <UserCheck className="w-4 h-4 mr-1.5" />
                Switch to District Officer
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => switchRole('ngo_coordinator')}
              >
                Switch to NGO Lead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
