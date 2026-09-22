'use client';

import React, { useState } from 'react';
import { TorCircuitState, TorServerLocation, TOR_SERVER_LOCATIONS } from '@/types/tor';
import FenixLogo from '../FenixLogo';
import {
  Shield,
  ShieldCheck,
  RefreshCw,
  Globe,
  Radio,
  Lock,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Server,
  Layers,
  Activity,
  ArrowRight,
  Terminal,
} from 'lucide-react';

interface TorPageProps {
  circuitState: TorCircuitState;
  onSwitchIp: (targetLocation?: TorServerLocation) => void;
  onToggleTor: (enabled: boolean) => void;
}

export default function TorPage({
  circuitState,
  onSwitchIp,
  onToggleTor,
}: TorPageProps) {
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(circuitState.currentIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitch = (loc?: TorServerLocation) => {
    setIsRotating(true);
    onSwitchIp(loc);
    setTimeout(() => setIsRotating(false), 600);
  };

  return (
    <div id="fenix-tor-page" className="max-w-5xl mx-auto p-6 md:p-10 text-slate-900 dark:text-slate-100 font-sans space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <FenixLogo size={48} showGlow={true} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold">Fénix Onion & Gestor de IP Tor</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 border border-purple-800 text-purple-300 font-bold">
                MULTI-HOP V3
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enruta y anonimiza tu tráfico web mediante nodos descentralizados con cambio de IP en 1 clic
            </p>
          </div>
        </div>

        <button
          onClick={() => handleSwitch()}
          disabled={isRotating}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          <span>Generar Nueva Identidad / Cambiar IP</span>
        </button>
      </div>

      {/* Main Status & Circuit Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-800/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              Dirección IP Pública Actual
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                {circuitState.currentIp}
              </span>
              <button
                onClick={handleCopyIp}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors border border-zinc-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiada' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Nodo de Salida:</span>
              <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5 justify-end">
                <span>{circuitState.selectedLocation.flag}</span>
                <span>{circuitState.selectedLocation.name}</span>
              </span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-zinc-800 border border-zinc-700 text-center">
              <span className="text-[10px] text-slate-400 block">Latencia</span>
              <span className="font-mono font-bold text-xs text-emerald-400">
                {circuitState.exitNode.latencyMs} ms
              </span>
            </div>
          </div>
        </div>

        {/* 3-Hop Circuit Visual Flow */}
        <div className="pt-4 border-t border-purple-900/40">
          <h3 className="font-bold text-xs uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Ruta del Circuito Cifrado Tor (3 Capas de Cifrado)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Hop 0: Device */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-lg">💻</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-300">
                  Tu Equipo
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Debian Linux</h4>
              <p className="text-[11px] text-slate-400">IP local aislada</p>
            </div>

            {/* Hop 1: Guard */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-lg">🛡️ {circuitState.guardNode.flag}</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {circuitState.guardNode.latencyMs}ms
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                1. Entrada: {circuitState.guardNode.city}
              </h4>
              <p className="text-[11px] font-mono text-purple-300">{circuitState.guardNode.ip}</p>
            </div>

            {/* Hop 2: Middle */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-lg">🔒 {circuitState.middleNode.flag}</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {circuitState.middleNode.latencyMs}ms
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                2. Relevo: {circuitState.middleNode.city}
              </h4>
              <p className="text-[11px] font-mono text-indigo-300">{circuitState.middleNode.ip}</p>
            </div>

            {/* Hop 3: Exit */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border-2 border-emerald-500/40 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-lg">🌐 {circuitState.exitNode.flag}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {circuitState.exitNode.latencyMs}ms
                </span>
              </div>
              <h4 className="font-bold text-xs text-emerald-400">
                3. Salida: {circuitState.exitNode.city}
              </h4>
              <p className="text-[11px] font-mono text-emerald-300 font-bold">
                {circuitState.exitNode.ip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Servers Selection Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Ubicaciones de Servidores Tor Disponibles</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Haz clic en cualquier país para cambiar instantáneamente tu ubicación virtual e IP pública.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOR_SERVER_LOCATIONS.map((loc) => {
            const isSelected = circuitState.selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => handleSwitch(loc)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-950/40 ring-2 ring-purple-500/30'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{loc.flag}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-400">
                      {loc.latencyMs}ms
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {loc.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{loc.ip}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400">
                    {loc.isStreamingOptimized ? '⚡ Video HD' : '🛡️ Ultra P2P'}
                  </span>
                  {isSelected ? (
                    <span className="text-[10px] font-bold text-purple-400">ACTIVO</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 hover:text-white">Conectar</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
