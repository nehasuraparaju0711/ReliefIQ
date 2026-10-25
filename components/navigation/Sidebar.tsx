'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BrainCircuit,
  SlidersHorizontal,
  Compass,
  Truck,
  FileText,
  Boxes,
  BarChart3,
  Settings,
  Shield,
  LifeBuoy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { UserRole } from '@/lib/types';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  {
    name: 'Live Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
    roles: ['district_officer', 'ngo_coordinator', 'volunteer'],
  },
  {
    name: 'Crisis Predictor',
    href: '/app/predict',
    icon: BrainCircuit,
    roles: ['district_officer', 'ngo_coordinator'],
    badge: 'AI',
  },
  {
    name: 'Resource Allocation',
    href: '/app/allocate',
    icon: SlidersHorizontal,
    roles: ['district_officer', 'ngo_coordinator'],
    badge: 'Core',
  },
  {
    name: 'What-If Simulator',
    href: '/app/simulator',
    icon: Compass,
    roles: ['district_officer', 'ngo_coordinator'],
  },
  {
    name: 'Dispatch & Tasks',
    href: '/app/dispatch',
    icon: Truck,
    roles: ['district_officer', 'ngo_coordinator', 'volunteer'],
    badge: 'Live',
  },
  {
    name: 'Community Reports',
    href: '/app/reports',
    icon: FileText,
    roles: ['district_officer', 'ngo_coordinator', 'volunteer'],
  },
  {
    name: 'Inventory & Depots',
    href: '/app/inventory',
    icon: Boxes,
    roles: ['district_officer', 'ngo_coordinator'],
  },
  {
    name: 'Insights & Exports',
    href: '/app/insights',
    icon: BarChart3,
    roles: ['district_officer', 'ngo_coordinator'],
  },
  {
    name: 'System Settings',
    href: '/app/settings',
    icon: Settings,
    roles: ['district_officer', 'ngo_coordinator', 'volunteer'],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, role } = useAuthStore();

  const currentRole = role || 'district_officer';
  const filteredNavItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside
      className={cn(
        'w-64 flex-shrink-0 bg-white/80 backdrop-blur-xl border-r border-slate-200/80 flex flex-col h-screen sticky top-0 z-30 transition-all select-none',
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100/80">
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
                AP DEMO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Crisis Decision Support</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-xs border border-primary-100 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase',
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-pastel-lavender text-pastel-lavender-dark'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Active User Card & Quick Role Indicator */}
      <div className="p-3.5 border-t border-slate-100/80 bg-slate-50/50 m-3 rounded-2xl border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs ring-2 ring-white">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'DO'}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Authorized User'}</p>
            <p className="text-[11px] text-slate-500 truncate capitalize">
              {currentRole.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
