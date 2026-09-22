'use client';

import React, { useState } from 'react';
import {
  TorCircuitState,
  TorServerLocation,
  TOR_SERVER_LOCATIONS,
} from '@/types/tor';
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
  X,
  Server,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  AlertCircle,
} from 'lucide-react';

interface TorCircuitModalProps {
  isOpen?: boolean;
  onClose: () => void;
  circuitState: TorCircuitState;
  onSwitchIp: (targetLocation?: TorServerLocation) => void;
  onToggleTor: (enabled: boolean) => void;
  onUpdateTorSettings?: (updates: Partial<TorCircuitState>) => void;
}

export default function TorCircuitModal({
  isOpen = true,
  onClose,
  circuitState,
  onSwitchIp,
  onToggleTor,
  onUpdateTorSettings,
}: TorCircuitModalProps) {
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [activeTab, setActiveTab] = useState<'circuit' | 'servers' | 'settings'>('circuit');

  if (!isOpen) return null;

  const handleCopyIp = () => {
    navigator.clipboard.writeText(circuitState.currentIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualNewIdentity = () => {
    setIsRotating(true);
    onSwitchIp();
    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  const handleSelectServer = (loc: TorServerLocation) => {
    setIsRotating(true);
    onSwitchIp(loc);
    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900/30 via-zinc-900 to-amber-950/20 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xl shadow-inner">
              🧅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Circuito Fénix Tor & Gestor de IP
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 border border-purple-800 text-purple-300">
                  Onion v3
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enrutamiento anónimo multi-salto con cifrado multicapa de grado militar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-5 pt-2 bg-slate-50 dark:bg-zinc-900/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('circuit')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'circuit'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Circuito Activo & IP</span>
          </button>

          <button
            onClick={() => setActiveTab('servers')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'servers'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Servidores de Salida ({TOR_SERVER_LOCATIONS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'settings'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ajustes de Red</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {activeTab === 'circuit' && (
            <>
              {/* Current IP & Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-800/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      IP Pública Oculta (Visible a sitios web)
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wider">
                        {circuitState.currentIp}
                      </span>
                      <button
                        onClick={handleCopyIp}
                        className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors border border-zinc-700"
                        title="Copiar IP"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copiada' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Switch IP Action Button */}
                  <button
                    onClick={handleManualNewIdentity}
                    disabled={isRotating}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                    <span>Cambiar IP / Nuevo Circuito</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-900/40 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block">Ubicación de Salida:</span>
                    <span className="font-semibold text-slate-200">
                      {circuitState.selectedLocation.flag} {circuitState.selectedLocation.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Latencia estimada:</span>
                    <span className="font-semibold text-emerald-400">
                      {circuitState.exitNode.latencyMs} ms
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cifrado de Capas:</span>
                    <span className="font-semibold text-purple-300">3x Onion Layers</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cambios de IP:</span>
                    <span className="font-semibold text-amber-300">
                      {circuitState.totalSwitches} generados
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Hop Multi-Layer Visual Circuit Diagram */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Diagrama de Saltos Tor (Multi-Hop Circuit)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Cero fugas WebRTC / DNS</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3">
                  {/* Step 1: Your Device */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg shrink-0">
                      💻
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Este Dispositivo (Debian Linux)
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 font-mono">
                          Origen Local
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        IP Real oculta • Huella digital (Fingerprint) neutralizada
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center -my-1 text-purple-400">
                    <div className="w-0.5 h-3 bg-purple-500/40" />
                  </div>

                  {/* Step 2: Guard Node */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-purple-500/30">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-base shrink-0">
                      🛡️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>1. Nodo Guardián (Guard Relay)</span>
                          <span>{circuitState.guardNode.flag}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {circuitState.guardNode.latencyMs} ms
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{circuitState.guardNode.name} • {circuitState.guardNode.city}</span>
                        <span className="font-mono text-slate-500">{circuitState.guardNode.ip}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center -my-1 text-purple-400">
                    <div className="w-0.5 h-3 bg-purple-500/40" />
                  </div>

                  {/* Step 3: Middle Node */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-purple-500/30">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-base shrink-0">
                      🔒
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>2. Nodo Intermedio (Middle Relay)</span>
                          <span>{circuitState.middleNode.flag}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {circuitState.middleNode.latencyMs} ms
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{circuitState.middleNode.name} • {circuitState.middleNode.city}</span>
                        <span className="font-mono text-slate-500">{circuitState.middleNode.ip}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center -my-1 text-purple-400">
                    <div className="w-0.5 h-3 bg-purple-500/40" />
                  </div>

                  {/* Step 4: Exit Node */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-emerald-500/40 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-base shrink-0 font-bold">
                      🌐
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>3. Nodo de Salida (Exit Node - IP Pública)</span>
                          <span>{circuitState.exitNode.flag}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {circuitState.exitNode.latencyMs} ms
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-semibold">
                          {circuitState.exitNode.name} • {circuitState.exitNode.city}, {circuitState.exitNode.country}
                        </span>
                        <span className="font-mono text-emerald-300 font-bold">{circuitState.exitNode.ip}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center -my-1 text-emerald-400">
                    <div className="w-0.5 h-3 bg-emerald-500/40" />
                  </div>

                  {/* Step 5: Web Destination */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg shrink-0">
                      🎯
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Destino Web (YouTube, Facebook, Sitios Web)
                      </span>
                      <p className="text-[11px] text-slate-400">
                        El servidor web sólo ve la IP del nodo de salida ({circuitState.currentIp}) en {circuitState.selectedLocation.country}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'servers' && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">
                  Selecciona una Ubicación / Servidor de Salida
                </h4>
                <p className="text-[11px] text-slate-400">
                  Haz clic en cualquier país para enrutar inmediatamente tu tráfico a través de ese nodo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TOR_SERVER_LOCATIONS.map((loc) => {
                  const isSelected = circuitState.selectedLocation.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectServer(loc)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-950/40 ring-1 ring-purple-500'
                          : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{loc.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {loc.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>{loc.ip}</span>
                            <span>•</span>
                            <span className="text-emerald-400">{loc.latencyMs}ms</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-500 font-mono">
                          {loc.loadPercent}% carga
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">
                      Enrutamiento Tor & Proxy Activo
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Enviar todo el tráfico web a través de la red de nodos encriptados Fénix Onion
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={circuitState.enabled}
                    onChange={(e) => onToggleTor(e.target.checked)}
                    className="accent-purple-600 scale-125 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">
                      Protección contra Fugas de DNS
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Forzar resolución de nombres exclusivamente a través de los nodos de salida Tor
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={circuitState.dnsLeakProtection}
                    onChange={(e) =>
                      onUpdateTorSettings?.({ dnsLeakProtection: e.target.checked })
                    }
                    className="accent-purple-600 scale-110 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">
                      Puentes Ofuscados (Snowflake / Obfs4)
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Disfraza el tráfico Tor como videollamada estándar para eludir censura de red
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={circuitState.bridgesEnabled}
                    onChange={(e) =>
                      onUpdateTorSettings?.({ bridgesEnabled: e.target.checked })
                    }
                    className="accent-purple-600 scale-110 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Fénix Onion Engine • Sin registros (No-Logs Policy)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
