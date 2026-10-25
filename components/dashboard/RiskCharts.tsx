'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Horizon, CrisisType } from '@/lib/types';

interface RiskChartsProps {
  horizon: Horizon;
  selectedCrisis: CrisisType;
}

export function RiskCharts({ horizon, selectedCrisis }: RiskChartsProps) {
  // 1. Forecast trend data with confidence band
  const trendData =
    horizon === '24h'
      ? [
          { time: '00:00', lower: 52, score: 62, upper: 72 },
          { time: '06:00', lower: 58, score: 68, upper: 78 },
          { time: '12:00', lower: 72, score: 82, upper: 90 },
          { time: '18:00', lower: 78, score: 88, upper: 96 },
          { time: '24:00', lower: 74, score: 85, upper: 94 },
        ]
      : horizon === '72h'
      ? [
          { time: 'Day 1', lower: 55, score: 65, upper: 75 },
          { time: 'Day 2', lower: 70, score: 82, upper: 92 },
          { time: 'Day 3', lower: 78, score: 89, upper: 98 },
        ]
      : [
          { time: 'Day 1', lower: 50, score: 60, upper: 70 },
          { time: 'Day 3', lower: 70, score: 80, upper: 90 },
          { time: 'Day 5', lower: 75, score: 86, upper: 95 },
          { time: 'Day 7', lower: 60, score: 72, upper: 82 },
        ];

  // 2. Supply vs demand comparison across key relief inventory categories
  const supplyDemandData = [
    { category: 'Food Kits', demand: 28000, supply: 26500 },
    { category: 'Water (100L)', demand: 840, supply: 745 },
    { category: 'Medical', demand: 8200, supply: 7350 },
    { category: 'Boats', demand: 90, supply: 76 },
    { category: 'Shelters', demand: 1600, supply: 1350 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Risk Forecast Timeline */}
      <Card className="lg:col-span-7 p-5 bg-white/85 border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Aggregated District Risk Trajectory
            </h4>
            <p className="text-[11px] text-slate-400">
              Timeline prediction with 95% confidence interval band ({horizon})
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
            {selectedCrisis.toUpperCase()}
          </span>
        </div>

        <div className="h-[240px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              {/* Confidence Band (Upper - Lower) */}
              <Area
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="url(#confidenceBand)"
                name="Confidence Upper"
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fill="url(#riskArea)"
                name="Forecast Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Supply vs Demand Comparison */}
      <Card className="lg:col-span-5 p-5 bg-white/85 border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Supply vs Estimated Need</h4>
            <p className="text-[11px] text-slate-400">Total verified warehouse stock vs model demand</p>
          </div>
        </div>

        <div className="h-[240px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={supplyDemandData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
                iconType="circle"
              />
              <Bar
                dataKey="supply"
                name="Current Available Stock"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="demand"
                name="Projected Need"
                fill="#FFAEC2"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
