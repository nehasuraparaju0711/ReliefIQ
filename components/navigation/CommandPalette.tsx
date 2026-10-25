'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  BrainCircuit,
  SlidersHorizontal,
  Compass,
  Truck,
  FileText,
  Boxes,
  BarChart3,
  Settings,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { UserRole } from '@/lib/types';

interface CommandItem {
  id: string;
  title: string;
  category: 'Pages' | 'Actions' | 'Switch Role';
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { switchRole } = useAuthStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items: CommandItem[] = [
    {
      id: 'cmd-dash',
      title: 'Go to Command Dashboard',
      category: 'Pages',
      icon: LayoutDashboard,
      action: () => router.push('/app/dashboard'),
    },
    {
      id: 'cmd-predict',
      title: 'Go to Crisis Predictor (Explainable AI)',
      category: 'Pages',
      icon: BrainCircuit,
      action: () => router.push('/app/predict'),
    },
    {
      id: 'cmd-allocate',
      title: 'Go to AI Resource Allocator',
      category: 'Pages',
      icon: SlidersHorizontal,
      action: () => router.push('/app/allocate'),
    },
    {
      id: 'cmd-sim',
      title: 'Go to What-If Crisis Simulator',
      category: 'Pages',
      icon: Compass,
      action: () => router.push('/app/simulator'),
    },
    {
      id: 'cmd-dispatch',
      title: 'Go to Dispatch & Tracking Board',
      category: 'Pages',
      icon: Truck,
      action: () => router.push('/app/dispatch'),
    },
    {
      id: 'cmd-reports',
      title: 'Submit or View Community Incident Reports',
      category: 'Pages',
      icon: FileText,
      action: () => router.push('/app/reports'),
    },
    {
      id: 'cmd-inventory',
      title: 'Check Warehouse Inventory & Stock Levels',
      category: 'Pages',
      icon: Boxes,
      action: () => router.push('/app/inventory'),
    },
    {
      id: 'cmd-insights',
      title: 'View Analytics & Export Crisis Summary',
      category: 'Pages',
      icon: BarChart3,
      action: () => router.push('/app/insights'),
    },
    {
      id: 'cmd-settings',
      title: 'System & Profile Settings',
      category: 'Pages',
      icon: Settings,
      action: () => router.push('/app/settings'),
    },
    {
      id: 'cmd-action-allocate',
      title: 'Quick Action: Launch AI Allocation Optimization',
      category: 'Actions',
      icon: Zap,
      action: () => router.push('/app/allocate?action=optimize'),
    },
    {
      id: 'cmd-action-report',
      title: 'Quick Action: File Emergency Incident Report',
      category: 'Actions',
      icon: Zap,
      action: () => router.push('/app/reports?new=true'),
    },
    {
      id: 'cmd-role-do',
      title: 'Switch Role to District Officer (Full Control)',
      category: 'Switch Role',
      icon: UserCheck,
      action: () => switchRole('district_officer'),
    },
    {
      id: 'cmd-role-ngo',
      title: 'Switch Role to NGO Coordinator (Logistics)',
      category: 'Switch Role',
      icon: UserCheck,
      action: () => switchRole('ngo_coordinator'),
    },
    {
      id: 'cmd-role-vol',
      title: 'Switch Role to Volunteer (Field Tasks)',
      category: 'Switch Role',
      icon: UserCheck,
      action: () => switchRole('volunteer'),
    },
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[24px] shadow-2xl overflow-hidden z-10 flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page name, or action..."
            className="w-full py-4 text-sm bg-transparent border-0 text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-100 text-slate-500 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or actions found for &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs hover:bg-primary-50 text-slate-700 hover:text-primary-900 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center text-slate-500 group-hover:text-primary-700 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-primary-900">{item.title}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-100">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
