'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  AllocationPlan,
  AllocationAssignment,
  CrisisType,
  Resource,
  Zone,
} from '@/lib/types';
import { SEED_ZONES, SEED_WAREHOUSES, SEED_RESOURCES } from '@/lib/seed/data';
import { runResourceOptimizer } from '@/lib/optimizer';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/Badge';
import {
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Truck,
  RotateCcw,
  Clock,
  Scale,
  Users,
  AlertCircle,
  ArrowRight,
  Shield,
  GripVertical,
  Plus,
  Minus,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function AllocatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCrisis = (searchParams.get('crisis') || 'flood') as CrisisType;

  const [crisisType, setCrisisType] = useState<CrisisType>(initialCrisis);
  const [fairnessCap, setFairnessCap] = useState<number>(35);

  // Resource inventory sliders state
  const [foodKits, setFoodKits] = useState(26500);
  const [potableWater, setPotableWater] = useState(74500);
  const [medicalKits, setMedicalKits] = useState(7350);
  const [rescueBoats, setRescueBoats] = useState(76);
  const [ambulances, setAmbulances] = useState(28);
  const [shelters, setShelters] = useState(1350);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [plan, setPlan] = useState<AllocationPlan | null>(null);
  const [assignments, setAssignments] = useState<AllocationAssignment[]>([]);

  // Approval state & undo toast
  const [isApproved, setIsApproved] = useState(false);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [undoTimer, setUndoTimer] = useState(8);

  // Initialize or re-run deterministic optimizer
  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const dynamicResources: Resource[] = [
        { ...SEED_RESOURCES[0], totalAvailable: foodKits },
        { ...SEED_RESOURCES[1], totalAvailable: potableWater },
        { ...SEED_RESOURCES[2], totalAvailable: medicalKits },
        { ...SEED_RESOURCES[3], totalAvailable: rescueBoats },
        { ...SEED_RESOURCES[4], totalAvailable: ambulances },
        { ...SEED_RESOURCES[5], totalAvailable: shelters },
      ];

      const generatedPlan = runResourceOptimizer({
        zones: SEED_ZONES,
        warehouses: SEED_WAREHOUSES,
        resources: dynamicResources,
        crisisType,
        fairnessCapPct: fairnessCap,
      });

      setPlan(generatedPlan);
      setAssignments(generatedPlan.assignments);
      setIsOptimizing(false);
      setIsApproved(false);
    }, 450);
  };

  useEffect(() => {
    handleRunOptimizer();
  }, [crisisType, fairnessCap]);

  // Manual override: adjust quantity on an assignment
  const handleQuantityDelta = (id: string, delta: number) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === id) {
          const newQty = Math.max(0, asg.quantity + delta);
          return { ...asg, quantity: newQty };
        }
        return asg;
      })
    );
  };

  // Reorder assignments via drag & drop
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newItems = [...assignments];
    const item = newItems.splice(draggedIdx, 1)[0];
    newItems.splice(idx, 0, item);
    setDraggedIdx(idx);
    setAssignments(newItems);
  };

  // Approve & Dispatch with success confetti & undo timer
  const handleApprove = async () => {
    if (!plan) return;
    try {
      await apiClient.approveAllocation(plan.id);
      setIsApproved(true);
      setShowUndoToast(true);
      setUndoTimer(8);

      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#4F46E5', '#34D399', '#FBBF24', '#F43F5E'],
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Undo approval countdown
  useEffect(() => {
    if (!showUndoToast) return;
    const interval = setInterval(() => {
      setUndoTimer((prev) => {
        if (prev <= 1) {
          setShowUndoToast(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showUndoToast]);

  const handleUndo = () => {
    setIsApproved(false);
    setShowUndoToast(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Resource Allocation Optimizer
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border">
              Deterministic Algorithm v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Greedy weighted need-score matching with strict fairness caps and Haversine depot routing.
          </p>
        </div>

        {/* Action Header Button */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            isLoading={isOptimizing}
            onClick={handleRunOptimizer}
            className="shadow-soft gap-2 font-bold"
          >
            <Sparkles className="w-4 h-4 text-pastel-butter" />
            <span>Re-Run AI Matching</span>
          </Button>
        </div>
      </div>

      {/* Live Calculated Optimization Metrics Header Cards */}
      {plan && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white/90 border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">People Covered</span>
              <Users className="w-4 h-4 text-primary-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {formatNumber(plan.peopleCovered)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              of {formatNumber(plan.totalAtRisk)} total at risk
            </p>
          </Card>

          <Card className="p-4 bg-white/90 border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Gini Fairness Index</span>
              <Scale className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {plan.fairnessScore} <span className="text-xs text-slate-400">/ 100</span>
            </p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
              Cap: {fairnessCap}% max per zone
            </p>
          </Card>

          <Card className="p-4 bg-white/90 border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Residual Unmet Need</span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-extrabold text-rose-600 mt-2">
              {plan.unmetNeedPct}%
            </p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Requires 2nd convoy wave
            </p>
          </Card>

          <Card className="p-4 bg-white/90 border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Avg Fleet ETA</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {plan.estimatedResponseTimeHours} hrs
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              From closest 3 AP depots
            </p>
          </Card>
        </div>
      )}

      {/* Main Allocation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Resource Inventory Sliders & Controls */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 bg-white/90 border-slate-200/90 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary-600" />
                <span>Available Depot Inventory</span>
              </h3>
              <span className="text-[10px] font-bold uppercase text-slate-400">Tweak Stock</span>
            </div>

            {/* Crisis Type Toggle */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Active Crisis Target
              </label>
              <select
                value={crisisType}
                onChange={(e) => setCrisisType(e.target.value as CrisisType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
              >
                <option value="flood">Flood Inundation & Dam Release</option>
                <option value="cyclone">Cyclone Gale & Storm Surge</option>
                <option value="heatwave">Extreme Heatwave (46°C+)</option>
                <option value="drought">Agricultural Drought & Salinity</option>
                <option value="outbreak">Post-Disaster Epidemic Outbreak</option>
              </select>
            </div>

            {/* Fairness Cap Slider */}
            <div className="p-3 rounded-xl bg-pastel-lavender/30 border border-pastel-lavender-border space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Anti-Hoarding Fairness Cap</span>
                <span className="text-primary-700">{fairnessCap}% max/zone</span>
              </div>
              <input
                type="range"
                min="15"
                max="50"
                step="5"
                value={fairnessCap}
                onChange={(e) => setFairnessCap(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Guarantees supplies are reserved for remote fishing & tribal thandas.
              </p>
            </div>

            {/* Slider: Food Kits */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Dry Food Ration Packs</span>
                <span className="text-primary-700">{formatNumber(foodKits)} kits</span>
              </div>
              <input
                type="range"
                min="5000"
                max="40000"
                step="1000"
                value={foodKits}
                onChange={(e) => setFoodKits(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
            </div>

            {/* Slider: Potable Water */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Clean Drinking Water</span>
                <span className="text-primary-700">{formatNumber(potableWater)} liters</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={potableWater}
                onChange={(e) => setPotableWater(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
            </div>

            {/* Slider: Medical Kits */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Epidemic Medical Packs</span>
                <span className="text-primary-700">{formatNumber(medicalKits)} kits</span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="250"
                value={medicalKits}
                onChange={(e) => setMedicalKits(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
            </div>

            {/* Slider: Rescue Boats */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Inflatable Rescue Boats</span>
                <span className="text-primary-700">{rescueBoats} craft</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="2"
                value={rescueBoats}
                onChange={(e) => setRescueBoats(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
            </div>

            {/* Slider: Ambulances */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">4x4 Life-Support Ambulances</span>
                <span className="text-primary-700">{ambulances} vehicles</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="1"
                value={ambulances}
                onChange={(e) => setAmbulances(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
            </div>

            {/* Slider: Relief Shelters */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Emergency Relief Tents</span>
                <span className="text-primary-700">{shelters} tents</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={shelters}
                onChange={(e) => setShelters(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Ranked Zone-Need List & Manual Drag-and-Drop Override */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-5 bg-white/90 border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Optimized Allocation Plan ({assignments.length} Convoys)
                </h3>
                <p className="text-xs text-slate-400">
                  Drag items to reprioritize. Use (+ / -) to fine-tune quantities before approval.
                </p>
              </div>

              {/* Approval status indicator */}
              {isApproved && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-mint text-emerald-800 text-xs font-bold border border-pastel-mint-border">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved &amp; Dispatched</span>
                </span>
              )}
            </div>

            {/* List of assignments */}
            <div className="mt-4 space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {assignments.map((asg, idx) => (
                <div
                  key={asg.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {asg.zoneName}
                        </span>
                        <RiskBadge severity={asg.severity} size="sm" />
                      </div>

                      <p className="text-xs font-semibold text-primary-700 mt-0.5">
                        {asg.resourceName}
                      </p>

                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-1">
                        {asg.justification}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                        <span>From: <strong>{asg.warehouseName.split(' ')[0]} Hub</strong></span>
                        <span>•</span>
                        <span>ETA: <strong>{asg.etaMinutes} mins</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Stepper Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0 sm:self-center">
                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80">
                      <button
                        onClick={() => handleQuantityDelta(asg.id, asg.quantity > 100 ? -250 : -1)}
                        className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-16 text-center text-xs font-extrabold text-slate-900">
                        {asg.quantity.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleQuantityDelta(asg.id, asg.quantity > 100 ? 250 : 1)}
                        className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">{asg.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Approval Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">DDMA Sign-Off Protocol:</span> One-click approval
                immediately routes tasks to SDRF vehicle telematics and volunteer queues.
              </div>

              <Button
                variant="primary"
                size="lg"
                disabled={isApproved}
                onClick={handleApprove}
                className="shadow-soft-lg gap-2 font-bold flex-shrink-0"
              >
                <Truck className="w-4 h-4" />
                <span>{isApproved ? 'Dispatches Mobilized' : 'Approve & Dispatch Convoys'}</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Undo Toast (8 seconds duration) */}
      {showUndoToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Convoys Approved &amp; Mobilized</p>
              <p className="text-[11px] text-slate-400">
                Dispatch tasks generated. Undo available for {undoTimer}s...
              </p>
            </div>
            <button
              onClick={handleUndo}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors ml-2"
            >
              Undo
            </button>
            <Link href="/app/dispatch">
              <button className="px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-colors">
                View Dispatch
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
