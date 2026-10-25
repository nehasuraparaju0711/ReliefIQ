'use client';

import React from 'react';

export function PastelBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      {/* Mint Blob */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-pastel-mint opacity-45 blur-[90px] animate-blob"
      />
      {/* Lavender Blob */}
      <div
        className="absolute top-[20%] -right-[15%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-pastel-lavender opacity-50 blur-[100px] animate-blob-slow"
        style={{ animationDelay: '3s' }}
      />
      {/* Sky Blob */}
      <div
        className="absolute -bottom-[15%] left-[25%] w-[48vw] h-[48vw] max-w-[580px] max-h-[580px] rounded-full bg-pastel-sky opacity-40 blur-[90px] animate-blob"
        style={{ animationDelay: '6s' }}
      />
      {/* Peach Blob */}
      <div
        className="absolute top-[60%] -left-[10%] w-[38vw] h-[38vw] max-w-[460px] max-h-[460px] rounded-full bg-pastel-peach opacity-35 blur-[90px] animate-blob-slow"
        style={{ animationDelay: '9s' }}
      />
      {/* Butter Blob */}
      <div
        className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] max-w-[380px] max-h-[380px] rounded-full bg-pastel-butter opacity-35 blur-[80px] animate-blob"
        style={{ animationDelay: '12s' }}
      />
    </div>
  );
}
