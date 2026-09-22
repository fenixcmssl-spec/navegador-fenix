'use client';

import React from 'react';
import { Info, Shield, Cpu, Code, ExternalLink, Heart, Globe, Lock } from 'lucide-react';
import FenixLogo from '../FenixLogo';

interface AboutPageProps {
  onNavigate: (url: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div id="fenix-about-page" className="max-w-3xl mx-auto p-6 md:p-12 text-slate-900 dark:text-slate-100 text-center">
      <div className="mb-4 flex justify-center">
        <FenixLogo size={84} showGlow={true} animate={true} />
      </div>

      <h1 className="text-3xl font-black tracking-tight mb-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
        Fénix Navegador
      </h1>
      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-6">
        Versión 1.0.0 (Build 2026.09.Debian-amd64) • Basado en Chromium Core Ultralight con Tor Onion v3
      </p>

      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left text-xs space-y-3.5 shadow-xs mb-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-2">
          <span className="text-slate-500">Sistema Operativo Objetivo</span>
          <span className="font-semibold text-red-600 dark:text-red-400 font-mono">Debian GNU/Linux 11/12</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-2">
          <span className="text-slate-500">Enrutamiento Tor & Servidores IP</span>
          <span className="font-semibold text-purple-400 font-mono">Tor Onion v3 Multi-Hop (Cambio de IP 1-clic)</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-2">
          <span className="text-slate-500">Motor de Renderizado</span>
          <span className="font-semibold font-mono">Chromium WebEngine Lite / Blink</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-2">
          <span className="text-slate-500">Motor JavaScript</span>
          <span className="font-semibold font-mono">V8 Turbofan Compact</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-2">
          <span className="text-slate-500">Consumo de Memoria Base</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">~35 MB RAM</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-2">
          <span className="text-slate-500">Bloqueador de Anuncios</span>
          <span className="font-semibold text-emerald-600 font-mono">FénixShield C++ Integrado</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Licencia</span>
          <span className="font-semibold font-mono">GPLv3 & BSD-3-Clause</span>
        </div>
      </div>

      <div className="flex justify-center gap-3 text-xs">
        <button
          onClick={() => onNavigate('chrome://tor')}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-xs flex items-center gap-1.5"
        >
          <span>🧅</span>
          <span>Configurar Tor & IP</span>
        </button>
        <button
          onClick={() => onNavigate('chrome://debian-setup')}
          className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-xs"
        >
          Instalar en Debian Linux
        </button>
        <button
          onClick={() => onNavigate('chrome://settings')}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Configuración
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mt-10 flex items-center justify-center gap-1">
        <span>Diseñado para la comunidad Debian con</span>
        <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
        <span>y máxima velocidad.</span>
      </p>
    </div>
  );
}
