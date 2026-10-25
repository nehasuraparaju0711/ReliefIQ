'use client';

import React, { useState, useEffect } from 'react';
import { DispatchTask } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  User,
  ArrowRight,
  MapPin,
  RefreshCw,
  Boxes,
  Compass,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function DispatchPage() {
  const { role } = useAuthStore();
  const [tasks, setTasks] = useState<DispatchTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getDispatchTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: 'pending' | 'in_transit' | 'delivered'
  ) => {
    try {
      const updated = await apiClient.updateDispatchTask(id, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inTransitTasks = tasks.filter((t) => t.status === 'in_transit');
  const deliveredTasks = tasks.filter((t) => t.status === 'delivered');

  const isVolunteer = role === 'volunteer';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isVolunteer ? 'My Assigned Volunteer Field Tasks' : 'Fleet Dispatch & Convoys Board'}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border">
              {tasks.length} Active Convoys
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isVolunteer
              ? 'Mobile-first task queue for frontline relief distribution and verification.'
              : 'Live tracking of relief vehicles moving from Krishna District hubs to affected Mandals.'}
          </p>
        </div>

        <button
          onClick={fetchTasks}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Top Status Metrics Strip */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-white/90 border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Staging &amp; Pending</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingTasks.length}</p>
        </Card>
        <Card className="p-4 bg-white/90 border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">En Route (In Transit)</p>
          <p className="text-2xl font-extrabold text-primary-600 mt-1">{inTransitTasks.length}</p>
        </Card>
        <Card className="p-4 bg-white/90 border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-400">Verified Delivered</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{deliveredTasks.length}</p>
        </Card>
      </div>

      {/* Volunteer Mobile-First View vs Coordinator Kanban Board */}
      {isVolunteer ? (
        /* Volunteer View: Simplified mobile action list */
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-pastel-lavender/40 border border-pastel-lavender-border text-xs text-slate-700 flex items-center gap-3">
            <Compass className="w-5 h-5 text-pastel-lavender-dark flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Field Volunteer Mode Activated</p>
              <p className="text-[11px] text-slate-500">
                Prioritize high-urgency rations and mark tasks complete as supplies are distributed to families.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="p-5 bg-white border-slate-200 shadow-sm rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      task.status === 'delivered'
                        ? 'bg-pastel-mint text-emerald-800'
                        : task.status === 'in_transit'
                        ? 'bg-pastel-sky text-sky-800'
                        : 'bg-pastel-butter text-amber-800'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{task.lastUpdated}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">{task.resource}</h3>
                  <p className="text-xs font-extrabold text-primary-700 mt-0.5">
                    Quantity: {formatNumber(task.qty)} {task.unit}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Destination: <strong>{task.toZone}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-slate-400" />
                    <span>From: {task.fromWarehouse}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>ETA: {task.eta}</span>
                  </div>
                </div>

                {/* Volunteer Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {task.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(task.id, 'in_transit')}
                      className="w-full font-bold"
                    >
                      <Truck className="w-4 h-4 mr-1.5" />
                      Accept &amp; Start Transit
                    </Button>
                  )}
                  {task.status === 'in_transit' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(task.id, 'delivered')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Confirm Handover &amp; Complete
                    </Button>
                  )}
                  {task.status === 'delivered' && (
                    <div className="w-full p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
                      Distribution Verified
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Coordinator & District Officer Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Pending */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Staging &amp; Loading ({pendingTasks.length})
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>

            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 bg-white/95 border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-800">{task.resource}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                      Staging
                    </span>
                  </div>

                  <p className="text-xs font-extrabold text-primary-700">
                    {formatNumber(task.qty)} {task.unit}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p>To: <strong>{task.toZone}</strong></p>
                    <p>From: {task.fromWarehouse.split(' ')[0]} Hub</p>
                    <p>ETA: {task.eta}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{task.assignee.name.split(' ')[0]}</span>
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'in_transit')}
                      className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Mobilize</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Column 2: In Transit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. En Route Convoys ({inTransitTasks.length})
              </span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {inTransitTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 bg-white/95 border-primary-200 shadow-sm ring-1 ring-primary-500/10 space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-800">{task.resource}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pastel-sky text-sky-800 font-bold">
                      In Transit
                    </span>
                  </div>

                  <p className="text-xs font-extrabold text-primary-700">
                    {formatNumber(task.qty)} {task.unit}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>Telemetry Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p>To: <strong>{task.toZone}</strong></p>
                    <p>ETA: {task.eta}</p>
                    <p className="flex items-center gap-1 pt-1 text-slate-700">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{task.assignee.name} ({task.assignee.phone})</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'delivered')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Delivered</span>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Column 3: Delivered */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Delivered &amp; Verified ({deliveredTasks.length})
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-3">
              {deliveredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 bg-slate-50/70 border-slate-200/80 shadow-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-700">{task.resource}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pastel-mint text-emerald-800 font-bold">
                      Completed
                    </span>
                  </div>

                  <p className="text-xs font-extrabold text-slate-800">
                    {formatNumber(task.qty)} {task.unit}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p>Delivered to: <strong>{task.toZone}</strong></p>
                    <p className="text-[10px] text-emerald-600 font-semibold">{task.lastUpdated}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
