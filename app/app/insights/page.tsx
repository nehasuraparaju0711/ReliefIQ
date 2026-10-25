'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SEED_ZONES, SEED_RESOURCES } from '@/lib/seed/data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  Download,
  Printer,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Calendar,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function InsightsPage() {
  const [selectedHorizon, setSelectedHorizon] = useState<'30d' | '90d' | '1y'>('30d');

  // Predicted vs Actual outcome comparison data
  const accuracyComparisonData = [
    { zone: 'Diviseema', predictedRisk: 91, actualDamageScore: 88, accuracyPct: 96 },
    { zone: 'Vijayawada', predictedRisk: 82, actualDamageScore: 84, accuracyPct: 97 },
    { zone: 'Avanigadda', predictedRisk: 85, actualDamageScore: 82, accuracyPct: 96 },
    { zone: 'Machilipatnam', predictedRisk: 76, actualDamageScore: 70, accuracyPct: 92 },
    { zone: 'Kaikaluru', predictedRisk: 78, actualDamageScore: 75, accuracyPct: 95 },
    { zone: 'Koduru', predictedRisk: 84, actualDamageScore: 86, accuracyPct: 98 },
  ];

  // Relief Fulfillment by Resource Category
  const fulfillmentData = [
    { name: 'Food Kits', allocated: 24500, delivered: 22100, fulfillmentPct: 90 },
    { name: 'Drinking Water (kL)', allocated: 72, delivered: 68, fulfillmentPct: 94 },
    { name: 'Medical Packs', allocated: 6200, delivered: 5900, fulfillmentPct: 95 },
    { name: 'Rescue Boats', allocated: 68, delivered: 64, fulfillmentPct: 94 },
    { name: 'Ambulances', allocated: 24, delivered: 24, fulfillmentPct: 100 },
    { name: 'Shelter Tents', allocated: 1200, delivered: 1080, fulfillmentPct: 90 },
  ];

  // CSV Export Generator
  const handleExportCsv = () => {
    const headers = [
      'Zone ID',
      'Mandal Name',
      'Population',
      'Vulnerability Index (0-1)',
      'Flood Risk Score (0-100)',
      'Cyclone Risk Score (0-100)',
      'Heatwave Risk Score (0-100)',
      'Food Kits Stock',
      'Drinking Water Stock (L)',
    ];

    const rows = SEED_ZONES.map((z) => [
      z.id,
      `"${z.name}"`,
      z.population,
      z.vulnerabilityIndex,
      z.riskByCrisis.flood?.score || 0,
      z.riskByCrisis.cyclone?.score || 0,
      z.riskByCrisis.heatwave?.score || 0,
      z.stock.food_kits || 0,
      z.stock.potable_water || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ReliefIQ_Krishna_District_Insights_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Executive Analytics &amp; Outcome Insights
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border">
              Model Precision: 94.2%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparative outcome validation, relief fulfillment ratios, and downloadable official audits.
          </p>
        </div>

        {/* Action Buttons: CSV Export & Print */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            className="gap-1.5 font-bold shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-primary-600" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 font-bold shadow-soft"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Briefing</span>
          </Button>
        </div>
      </div>

      {/* Official Printable Executive Header (visible in print mode) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase">
          District Disaster Management Authority (DDMA), Krishna District
        </h2>
        <p className="text-sm text-slate-700 font-semibold">
          ReliefIQ Comprehensive Crisis Mitigation &amp; Resource Allocation Performance Audit
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Date of Briefing: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
        </p>
      </div>

      {/* High-Level Scorecard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/90 border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">Model Precision Score</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">94.2%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across 16 monitored Mandals</p>
        </Card>
        <Card className="p-4 bg-white/90 border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Lives Reached</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">142,800</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Zero casualties in primary shelters</p>
        </Card>
        <Card className="p-4 bg-white/90 border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">Overall Supply Fulfillment</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">92.6%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Total stock delivered vs allocated</p>
        </Card>
        <Card className="p-4 bg-white/90 border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400">Fleet Response Speed</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">38 Mins</p>
          <p className="text-[11px] text-slate-500 mt-0.5">From approval to wheels on ground</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Predicted vs Actual Outcome Score */}
        <Card className="lg:col-span-7 p-5 bg-white/90 border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Predicted Risk Score vs Actual Ground Impact
              </h3>
              <p className="text-[11px] text-slate-400">
                Audit validation demonstrating algorithmic calibration
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-mint text-emerald-800">
              R² = 0.94
            </span>
          </div>

          <div className="h-[260px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={accuracyComparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar
                  dataKey="predictedRisk"
                  name="AI Predicted Risk"
                  fill="#4F46E5"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="actualDamageScore"
                  name="Actual Field Impact"
                  fill="#94A3B8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Supply Fulfillment by Category */}
        <Card className="lg:col-span-5 p-5 bg-white/90 border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Logistics Fulfillment Ratio
              </h3>
              <p className="text-[11px] text-slate-400">Delivered vs allocated by supply category</p>
            </div>
          </div>

          <div className="h-[260px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fulfillmentData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Fulfillment Rate']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Bar
                  dataKey="fulfillmentPct"
                  name="Fulfillment %"
                  fill="#34D399"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Narrative Executive Summary for District Magistrate */}
      <Card className="p-6 bg-white/95 border-slate-200 shadow-md space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-600" />
          <span>Executive Directive &amp; Audit Commentary</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            1. <strong>Diviseema Confluence Containment:</strong> Timely pre-positioning of 18 motorized boats
            at Nagayalanka Jetty prevented the stranding of 14 island habitations during the peak 8.5 Lakh Cusecs
            discharge at Prakasam Barrage.
          </p>
          <p>
            2. <strong>Urban Waterlogging in Vijayawada:</strong> Mobile dewatering pumps staged along Budameru
            diversion gates contained water levels to under 1.8 feet in Ajit Singh Nagar, allowing power restoration
            24 hours earlier than during the 2024 flood benchmark.
          </p>
          <p>
            3. <strong>Fairness Benchmark Compliance:</strong> The 35% anti-hoarding cap successfully diverted 4,200
            food ration kits and 18,000 liters of drinking water to peripheral coastal salt pan colonies in Bantumilli
            and Koduru that historically experienced delayed relief delivery.
          </p>
        </div>
      </Card>
    </div>
  );
}
