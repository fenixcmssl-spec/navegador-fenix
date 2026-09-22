'use client';

import React from 'react';
import { ShieldStats } from '@/types/browser';
import { TorCircuitState } from '@/types/tor';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  X,
  Zap,
  Eye,
  Sliders,
  CheckCircle2,
  Globe,
} from 'lucide-react';

interface ShieldsPopupProps {
  url: string;
  shieldStats: ShieldStats;
  shieldEnabled: boolean;
  circuitState?: TorCircuitState;
  onToggleShield: () => void;
  onOpenTorCircuit?: () => void;
  onClose: () => void;
}

export default function ShieldsPopup({
  url,
  shieldStats,
  shieldEnabled,
  circuitState,
  onToggleShield,
  onOpenTorCircuit,
  onClose,
}: ShieldsPopupProps) {
  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {}

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                shieldEnabled
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                FénixShield C++
              </h3>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                {hostname}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Master Toggle */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Escudos para este sitio
            </div>
            <div className="text-[11px] text-slate-400">
              {shieldEnabled ? 'Protección activa al 100%' : 'Protección pausada'}
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shieldEnabled}
              onChange={onToggleShield}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-red-600"></div>
          </label>
        </div>

        {/* Tor Onion IP Badge */}
        {circuitState && (
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🧅</span>
              <div>
                <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                  <span>Enrutamiento Tor Onion</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-[10px] font-mono text-purple-200/80">
                  IP: {circuitState.currentIp} ({circuitState.selectedLocation?.countryCode || 'Tor'})
                </div>
              </div>
            </div>
            {onOpenTorCircuit && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTorCircuit();
                }}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-[10px] text-white font-bold transition-colors shadow-xs"
              >
                Cambiar
              </button>
            )}
          </div>
        )}

        {/* Protection Stats */}
        <div className="space-y-2.5 mb-5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span>🚫</span> Anuncios y ventanas emergentes
            </span>
            <span className="font-mono font-bold text-red-600 dark:text-red-400">
              {shieldStats.blockedAds}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span>👁️</span> Rastreadores y huella digital
            </span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {shieldStats.trackersBlocked}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span>🔒</span> Conexión cifrada Multi-Hop
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              3 Hops
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span>⚡</span> Ancho de banda y datos ahorrados
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              ~{(shieldStats.bandwidthSavedKB / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs"
        >
          Listo
        </button>
      </div>
    </div>
  );
}
