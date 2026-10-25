'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { UserRole } from '@/lib/types';
import {
  Bell,
  Search,
  Globe,
  Check,
  ChevronDown,
  UserCheck,
  Menu,
  Shield,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function TopNav({
  onOpenCommandPalette,
  onToggleMobileSidebar,
}: {
  onOpenCommandPalette: () => void;
  onToggleMobileSidebar?: () => void;
}) {
  const { user, role, switchRole } = useAuthStore();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'HI' | 'TE'>('EN');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const roles: { id: UserRole; label: string; desc: string }[] = [
    {
      id: 'district_officer',
      label: 'District Officer',
      desc: 'Full command, approve AI plans, reports & dispatch',
    },
    {
      id: 'ngo_coordinator',
      label: 'NGO Coordinator',
      desc: 'Inventory allocation, fleet dispatch, tracking',
    },
    {
      id: 'volunteer',
      label: 'Volunteer / Field Team',
      desc: 'Mobile-first task queue, direct incident filing',
    },
  ];

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Menu Button & Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Command Palette Trigger button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-xs font-medium border border-slate-200/60 transition-all group"
          aria-label="Open command palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600" />
          <span className="hidden sm:inline">Search zones, resources, actions...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white rounded border border-slate-200 text-slate-400">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Role Switcher, Language, Alerts, Quick Demo Links */}
      <div className="flex items-center gap-2.5">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsLangDropdownOpen(!isLangDropdownOpen);
              setIsRoleDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors border border-transparent hover:border-slate-200"
            aria-label="Language selector"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isLangDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-40 animate-fade-in">
              <button
                onClick={() => {
                  setCurrentLang('EN');
                  setIsLangDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-primary-50 flex items-center justify-between"
              >
                <span>English</span>
                {currentLang === 'EN' && <Check className="w-3.5 h-3.5 text-primary-600" />}
              </button>
              <button
                onClick={() => {
                  setCurrentLang('TE');
                  setIsLangDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-primary-50 flex items-center justify-between"
              >
                <span>తెలుగు (Telugu)</span>
                {currentLang === 'TE' && <Check className="w-3.5 h-3.5 text-primary-600" />}
              </button>
              <button
                onClick={() => {
                  setCurrentLang('HI');
                  setIsLangDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-primary-50 flex items-center justify-between"
              >
                <span>हिन्दी (Hindi)</span>
                {currentLang === 'HI' && <Check className="w-3.5 h-3.5 text-primary-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Role Switcher Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsRoleDropdownOpen(!isRoleDropdownOpen);
              setIsLangDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pastel-lavender/70 hover:bg-pastel-lavender text-pastel-lavender-dark border border-pastel-lavender-border text-xs font-bold transition-all"
            aria-label="Switch active role"
          >
            <UserCheck className="w-3.5 h-3.5 text-pastel-lavender-dark" />
            <span className="hidden sm:inline capitalize">
              Role: {role?.replace('_', ' ') || 'District Officer'}
            </span>
            <span className="sm:hidden capitalize">{role?.split('_')[0]}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-40 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Role (Demo)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explore how the interface adapts instantly
                </p>
              </div>
              <div className="mt-1 space-y-1">
                {roles.map((r) => {
                  const isCurrent = (role || 'district_officer') === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2',
                        isCurrent
                          ? 'bg-primary-50 text-primary-800 font-semibold border border-primary-200/60'
                          : 'hover:bg-slate-50 text-slate-700'
                      )}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          {r.label}
                          {isCurrent && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-primary-600 text-white font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal mt-0.5">{r.desc}</p>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell linking to dashboard alerts */}
        <Link
          href="/app/dashboard?view=alerts"
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="View notifications (3 critical alerts active)"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pastel-rose-dark rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pastel-rose-dark rounded-full" />
        </Link>
      </div>
    </header>
  );
}
