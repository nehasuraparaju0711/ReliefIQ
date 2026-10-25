import React from 'react';

export default function AppLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200/80 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-slate-200/80 rounded-xl" />
      </div>

      {/* Skeleton KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white/70 rounded-2xl border border-slate-200/60 p-4" />
        ))}
      </div>

      {/* Skeleton Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-[420px] bg-white/70 rounded-[24px] border border-slate-200/60" />
        <div className="lg:col-span-4 h-[420px] bg-white/70 rounded-[24px] border border-slate-200/60" />
      </div>
    </div>
  );
}
