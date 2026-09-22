'use client';

import React from 'react';
import {
  Plus,
  EyeOff,
  Star,
  History,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Search,
  Activity,
  Code,
  Settings,
  HelpCircle,
  Package,
  X,
  ExternalLink,
} from 'lucide-react';

interface ChromeMenuProps {
  zoomLevel: number;
  onNewTab: (incognito?: boolean) => void;
  onNavigate: (url: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleFullscreen: () => void;
  onOpenFindInPage: () => void;
  onOpenTaskManager: () => void;
  onOpenDevTools: () => void;
  onOpenDebianSetup: () => void;
  onOpenTorCircuit?: () => void;
  onClose: () => void;
}

export default function ChromeMenu({
  zoomLevel,
  onNewTab,
  onNavigate,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFullscreen,
  onOpenFindInPage,
  onOpenTaskManager,
  onOpenDevTools,
  onOpenDebianSetup,
  onOpenTorCircuit,
  onClose,
}: ChromeMenuProps) {
  const handleAction = (cb: () => void) => {
    cb();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/20"
      onClick={onClose}
    >
      <div
        className="absolute top-12 right-4 w-72 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 text-slate-800 dark:text-slate-100 text-xs animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100 dark:divide-zinc-800/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Section 1: Tabs & Windows */}
        <div className="py-1 space-y-0.5">
          <button
            onClick={() => handleAction(() => onNewTab(false))}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-4 h-4 text-slate-500" />
              <span>Nueva pestaña</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+T</span>
          </button>

          <button
            onClick={() => handleAction(() => onNewTab(true))}
            className="w-full px-3 py-2 rounded-xl hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <EyeOff className="w-4 h-4" />
              <span>Nueva ventana de incógnito</span>
            </div>
            <span className="text-[10px] text-purple-400 font-mono">Ctrl+Shift+N</span>
          </button>
        </div>

        {/* Section 2: Bookmarks, History, Downloads */}
        <div className="py-1 space-y-0.5">
          <button
            onClick={() => handleAction(() => onNavigate('chrome://bookmarks'))}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Marcadores</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+Shift+O</span>
          </button>

          <button
            onClick={() => handleAction(() => onNavigate('chrome://history'))}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-blue-500" />
              <span>Historial</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+H</span>
          </button>

          <button
            onClick={() => handleAction(() => onNavigate('chrome://downloads'))}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Descargas</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+J</span>
          </button>
        </div>

        {/* Section 3: Zoom Controls */}
        <div className="py-2 px-3 flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Zoom</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-slate-200 dark:border-zinc-700">
            <button
              onClick={onZoomOut}
              className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded text-slate-700 dark:text-slate-200"
              title="Reducir zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetZoom}
              className="px-2 text-[11px] font-mono font-semibold"
              title="Restablecer zoom"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={onZoomIn}
              className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded text-slate-700 dark:text-slate-200"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleFullscreen}
              className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded text-slate-700 dark:text-slate-200 ml-1"
              title="Pantalla completa (F11)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section 4: Print & Find */}
        <div className="py-1 space-y-0.5">
          <button
            onClick={() => handleAction(onOpenFindInPage)}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-500" />
              <span>Buscar en la página...</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+F</span>
          </button>

          <button
            onClick={() => handleAction(() => window.print())}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimir / Guardar PDF</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+P</span>
          </button>
        </div>

        {/* Section 5: More Tools */}
        <div className="py-1 space-y-0.5">
          {onOpenTorCircuit && (
            <button
              onClick={() => handleAction(onOpenTorCircuit)}
              className="w-full px-3 py-2 rounded-xl hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 flex items-center justify-between transition-colors font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🧅</span>
                <span>Circuito Tor & Cambiar IP</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900 text-purple-200 font-mono">Onion v3</span>
            </button>
          )}

          <button
            onClick={() => handleAction(onOpenTaskManager)}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Administrador de tareas</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Shift+Esc</span>
          </button>

          <button
            onClick={() => handleAction(onOpenDevTools)}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Code className="w-4 h-4 text-purple-500" />
              <span>Herramientas para desarrolladores</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">F12</span>
          </button>

          <button
            onClick={() => handleAction(onOpenDebianSetup)}
            className="w-full px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-between transition-colors font-semibold"
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Instalador Debian (.deb)</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-mono">Linux</span>
          </button>
        </div>

        {/* Section 6: Settings & About */}
        <div className="py-1 space-y-0.5">
          <button
            onClick={() => handleAction(() => onNavigate('chrome://settings'))}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2.5 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Configuración</span>
          </button>

          <button
            onClick={() => handleAction(() => onNavigate('chrome://about'))}
            className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Información de Fénix Navegador</span>
          </button>
        </div>
      </div>
    </div>
  );
}
