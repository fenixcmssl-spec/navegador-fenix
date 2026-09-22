'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AeroChromeApp = dynamic(() => import('@/components/AeroChromeApp'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center text-xl font-bold shadow-lg">
          🔥
        </div>
        <span className="font-bold text-lg tracking-tight font-mono">Fénix Navegador</span>
      </div>
      <p className="text-xs text-zinc-500 font-mono">Iniciando motor ligero para Debian Linux...</p>
    </div>
  ),
});

export default function Page() {
  return (
    <main className="w-full h-screen overflow-hidden bg-slate-900 text-slate-100">
      <AeroChromeApp />
    </main>
  );
}

