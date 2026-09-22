'use client';

import React, { useState } from 'react';
import { Extension } from '@/types/browser';
import {
  Puzzle,
  ShieldCheck,
  Moon,
  Sparkles,
  Cpu,
  Code,
  CheckCircle2,
  Trash2,
  Settings2,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface ExtensionsPageProps {
  extensions: Extension[];
  onToggleExtension: (id: string) => void;
  onRemoveExtension: (id: string) => void;
}

export default function ExtensionsPage({
  extensions,
  onToggleExtension,
  onRemoveExtension,
}: ExtensionsPageProps) {
  const [developerMode, setDeveloperMode] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'adblocker':
        return <ShieldCheck className="w-6 h-6 text-red-500" />;
      case 'darkreader':
        return <Moon className="w-6 h-6 text-indigo-400" />;
      case 'ai_summarizer':
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'memory_booster':
        return <Cpu className="w-6 h-6 text-emerald-500" />;
      case 'json_viewer':
        return <Code className="w-6 h-6 text-blue-500" />;
      default:
        return <Puzzle className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div id="aerochrome-extensions-page" className="max-w-5xl mx-auto p-6 md:p-10 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Puzzle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Extensiones & Complementos</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Módulos ultraligeros sin sobrecarga de memoria en Debian
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
            <span>Modo desarrollador</span>
            <input
              type="checkbox"
              checked={developerMode}
              onChange={(e) => setDeveloperMode(e.target.checked)}
              className="accent-red-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {developerMode && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-amber-700 dark:text-amber-300 font-medium">
            🔧 Modo desarrollador activado: Carga extensiones de manifiesto v3 o scripts de usuario en Debian.
          </span>
          <button
            onClick={() => alert('Selecciona una carpeta descomprimida con manifest.json en Debian')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
          >
            Cargar descomprimida...
          </button>
        </div>
      )}

      {/* Extensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {extensions.map((ext) => (
          <div
            key={ext.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 flex items-center justify-center">
                    {getIcon(ext.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {ext.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-mono">
                      v{ext.version} • {ext.author}
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ext.enabled}
                    onChange={() => onToggleExtension(ext.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-red-600"></div>
                </label>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {ext.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800/60 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                ★ {ext.rating.toFixed(1)} ({ext.users} usuarios)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Configuración de ${ext.name}`)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Detalles"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemoveExtension(ext.id)}
                  className="p-1 text-slate-400 hover:text-red-500"
                  title="Quitar extensión"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
