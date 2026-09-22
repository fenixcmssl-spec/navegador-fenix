'use client';

import React, { useState } from 'react';
import { SPEED_DIAL_ITEMS } from '@/lib/browser-defaults';
import { BrowserSettings, SearchEngine } from '@/types/browser';
import { TorCircuitState } from '@/types/tor';
import FenixLogo from '../FenixLogo';
import {
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Cpu,
  Sparkles,
  Layers,
  ArrowRight,
  Terminal,
  Zap,
  RefreshCw,
  Globe,
  Lock,
} from 'lucide-react';

interface NewTabPageProps {
  settings: BrowserSettings;
  circuitState?: TorCircuitState;
  onNavigate: (url: string) => void;
  onOpenDebianExport: () => void;
  onOpenTorModal?: () => void;
  onSwitchTorIp?: () => void;
}

export default function NewTabPage({
  settings,
  circuitState,
  onNavigate,
  onOpenDebianExport,
  onOpenTorModal,
  onSwitchTorIp,
}: NewTabPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEngine, setActiveEngine] = useState<SearchEngine>(settings.defaultSearchEngine);
  const [shortcuts, setShortcuts] = useState(SPEED_DIAL_ITEMS);
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSwitchingIp, setIsSwitchingIp] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate(searchQuery.trim());
  };

  const handleSwitchIp = () => {
    if (!onSwitchTorIp) return;
    setIsSwitchingIp(true);
    onSwitchTorIp();
    setTimeout(() => setIsSwitchingIp(false), 600);
  };

  const handleAddShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    const formattedUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    setShortcuts([
      ...shortcuts,
      {
        id: `sd-custom-${Date.now()}`,
        title: newTitle,
        url: formattedUrl,
        iconText: '🌐',
        color: 'from-blue-600 to-indigo-700',
        description: formattedUrl,
      },
    ]);
    setNewTitle('');
    setNewUrl('');
    setIsAddingShortcut(false);
  };

  const handleDeleteShortcut = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShortcuts(shortcuts.filter((s) => s.id !== id));
  };

  return (
    <div id="fenix-newtab-page" className="min-h-full w-full flex flex-col items-center justify-start p-6 md:p-12 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner with Debian badge & Tor IP quick status */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
          <FenixLogo size={18} showGlow={false} />
          <span>Fénix Navegador • Debian Edition</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Linux x86_64</span>
        </div>

        <div className="flex items-center gap-2">
          {circuitState && (
            <button
              onClick={onOpenTorModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/40 text-purple-300 text-xs font-mono transition-all cursor-pointer"
              title="Ver Circuito Tor y Servidores de Salida"
            >
              <span>🧅</span>
              <span className="font-bold">{circuitState.currentIp}</span>
              <span>{circuitState.selectedLocation.flag}</span>
            </button>
          )}

          <button
            id="btn-debian-export-quick"
            onClick={onOpenDebianExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all text-xs font-semibold shadow-xs"
            title="Descargar paquete .deb para Debian"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Instalar .deb en Debian</span>
          </button>
        </div>
      </div>

      {/* Main Brand Logo & Title */}
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="relative mb-3 flex items-center justify-center">
          <FenixLogo size={80} showGlow={true} animate={true} />
          <div className="absolute -bottom-2 -right-3 px-2 py-0.5 rounded-md bg-zinc-900 text-emerald-400 text-[10px] font-mono border border-zinc-700 shadow-md">
            ~35MB RAM
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
          Fénix Navegador
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          Navegador web ultraligero para Linux Debian con enrutamiento Tor multicapa, bloqueo nativo y cero telemetría.
        </p>
      </div>

      {/* Tor Circuit Quick Status Card */}
      {circuitState && (
        <div className="w-full max-w-2xl mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-800/40 flex items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-lg shrink-0">
              🧅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Circuito Tor Activo</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {circuitState.exitNode.latencyMs}ms
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono mt-0.5">
                <span>IP: <strong className="text-purple-300">{circuitState.currentIp}</strong></span>
                <span>•</span>
                <span>{circuitState.selectedLocation.flag} {circuitState.selectedLocation.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSwitchIp}
              disabled={isSwitchingIp}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Cambiar a otra IP pública aleatoria"
            >
              <RefreshCw className={`w-3 h-3 ${isSwitchingIp ? 'animate-spin' : ''}`} />
              <span>Cambiar IP</span>
            </button>
            <button
              onClick={onOpenTorModal}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Ver Nodos
            </button>
          </div>
        </div>
      )}

      {/* Omnibox / Search Box */}
      <div className="w-full max-w-2xl mb-8">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>

          <input
            id="newtab-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar en ${activeEngine.toUpperCase()} o escribir URL...`}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md focus:shadow-xl focus:border-red-500 dark:focus:border-red-500 focus:outline-none transition-all text-sm text-slate-800 dark:text-slate-100"
            autoFocus
          />

          <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
            <select
              id="newtab-engine-selector"
              value={activeEngine}
              onChange={(e) => setActiveEngine(e.target.value as SearchEngine)}
              className="text-xs bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="google">Google</option>
              <option value="duckduckgo">DuckDuckGo</option>
              <option value="bing">Bing</option>
              <option value="ecosia">Ecosia</option>
              <option value="searx">SearX</option>
              <option value="brave">Brave</option>
            </select>

            <button
              type="submit"
              className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
              title="Ir"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Sugerencias rápidas:</span>
          <button
            onClick={() => onNavigate('https://www.debian.org')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-red-500/10 hover:text-red-600 transition-colors"
          >
            debian.org
          </button>
          <button
            onClick={() => onNavigate('https://packages.debian.org')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-red-500/10 hover:text-red-600 transition-colors"
          >
            packages.debian.org
          </button>
          <button
            onClick={() => onNavigate('https://news.ycombinator.com')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-red-500/10 hover:text-red-600 transition-colors"
          >
            Hacker News
          </button>
          <button
            onClick={() => onNavigate('chrome://tasks')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-red-500/10 hover:text-red-600 transition-colors"
          >
            chrome://tasks
          </button>
        </div>
      </div>

      {/* Speed Dial Grid */}
      <div className="w-full max-w-4xl mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-500" />
            <span>Accesos Rápidos (Speed Dial)</span>
          </h2>

          <button
            id="btn-add-speeddial"
            onClick={() => setIsAddingShortcut(true)}
            className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Sitio</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {shortcuts.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.url)}
              className="group relative p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-red-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col items-start"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} text-white flex items-center justify-center text-lg shadow-xs`}>
                  {item.iconText}
                </div>
                <button
                  onClick={(e) => handleDeleteShortcut(item.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="font-semibold text-xs text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-red-600 transition-colors">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                {item.description || item.url}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Shortcut Modal */}
      {isAddingShortcut && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-white">Añadir Acceso Rápido</h3>
            <form onSubmit={handleAddShortcut} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Nombre</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Mi Blog / Servidor Local"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">URL del Sitio</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://ejemplo.com o localhost:8080"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingShortcut(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Linux Debian Performance & Telemetry Strip */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Consumo de Memoria</div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
              Fénix: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">38 MB</span> vs Chrome: 1,850 MB
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center text-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">FénixShield Activo</div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
              Bloqueador nativo C++ de anuncios y rastreo
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">IA Copilot Integrada</div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
              Resúmenes automáticos y modo lectura rápida
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
