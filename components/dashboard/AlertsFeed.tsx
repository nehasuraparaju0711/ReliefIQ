'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '@/lib/types';
import { RiskBadge } from '@/components/ui/Badge';
import { Bell, Check, Radio, Filter, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';

export function AlertsFeed({
  initialAlerts,
  onZoneClick,
}: {
  initialAlerts: Alert[];
  onZoneClick?: (zoneId: string) => void;
}) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Poll for simulated new alerts every 14 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await apiClient.getAlerts();
        setAlerts(fresh);
      } catch {
        // quiet fallback
      }
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiClient.markAlertRead(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, read: true } : a))
      );
    } catch {
      // quiet fallback
    }
  };

  const displayedAlerts = filterUnreadOnly ? alerts.filter((a) => !a.read) : alerts;
  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="glass-card bg-white/80 rounded-[24px] border border-slate-200/90 shadow-sm p-5 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Live Incident & Threat Feed</h3>
            <p className="text-[11px] text-slate-400">
              {unreadCount} unread incident telemetry alerts
            </p>
          </div>
        </div>

        <button
          onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
            filterUnreadOnly
              ? 'bg-primary-50 text-primary-700 border-primary-200'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {filterUnreadOnly ? 'Show All' : 'Unread Only'}
        </button>
      </div>

      {/* Feed list with slide-in animation */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
        <AnimatePresence initial={false}>
          {displayedAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => onZoneClick && onZoneClick(alert.zoneId)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left group ${
                alert.read
                  ? 'bg-slate-50/60 border-slate-200/70 hover:bg-white'
                  : 'bg-white border-primary-200/90 shadow-xs ring-1 ring-primary-500/10 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <RiskBadge severity={alert.severity} size="sm" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{alert.createdAt}</span>
                  {!alert.read && (
                    <button
                      onClick={(e) => handleMarkRead(alert.id, e)}
                      title="Mark as read"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      aria-label="Mark alert as read"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs font-bold text-slate-800 line-clamp-1">{alert.zoneName}</p>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {alert.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
