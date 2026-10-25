import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-2xl bg-primary-600/20 animate-ping absolute inset-0" />
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold shadow-soft">
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <p className="text-xs font-bold text-slate-700 tracking-tight mt-2">
          Synchronizing Spatial Telemetry...
        </p>
      </div>
    </div>
  );
}
