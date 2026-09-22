'use client';

import React from 'react';
import { BrowserSettings, BrowserTheme, SearchEngine } from '@/types/browser';
import {
  Settings,
  Search,
  Palette,
  ShieldCheck,
  Cpu,
  Monitor,
  Globe,
  Sliders,
  Check,
  Terminal,
  Zap,
  EyeOff,
  Lock,
  Trash2,
} from 'lucide-react';

interface SettingsPageProps {
  settings: BrowserSettings;
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
  onResetDefaults: () => void;
}

export default function SettingsPage({
  settings,
  onUpdateSettings,
  onResetDefaults,
}: SettingsPageProps) {
  return (
    <div id="fenix-settings-page" className="max-w-4xl mx-auto p-6 md:p-10 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Configuración de Fénix Navegador</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personaliza el motor, apariencia y protecciones para Debian Linux
            </p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
        >
          Restablecer valores predeterminados
        </button>
      </div>

      <div className="space-y-6">
        {/* Modo Oculto Permanente (Configuración Oculto) */}
        <section className="p-6 rounded-2xl bg-purple-950/20 dark:bg-purple-950/30 border border-purple-800/40 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-purple-400" />
            <span>Modo Oculto Permanente (Zero Trace Incognito)</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span>Siempre en Modo Oculto (Always Incognito)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-900/60 text-purple-300 font-mono">
                    ACTIVO POR DEFECTO
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] max-w-xl mt-0.5">
                  Todas las pestañas y ventanas se abren automáticamente con aislamiento de memoria, sin guardar historial en disco y bloqueando rastreadores en YouTube, Facebook y toda la web.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.alwaysIncognito ?? true}
                onChange={(e) => onUpdateSettings({ alwaysIncognito: e.target.checked })}
                className="accent-purple-600 cursor-pointer scale-125"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-900/30">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  Limpieza automática al cerrar sesión
                </div>
                <div className="text-slate-400 text-[11px] max-w-xl mt-0.5">
                  Borra cookies de sesión, caché temporal y almacenamiento local volátil inmediatamente al cerrar el navegador.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.clearSessionOnClose ?? true}
                onChange={(e) => onUpdateSettings({ clearSessionOnClose: e.target.checked })}
                className="accent-purple-600 cursor-pointer scale-110"
              />
            </div>
          </div>
        </section>

        {/* Motor de Búsqueda */}
        <section className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-red-500" />
            <span>Motor de Búsqueda Predeterminado</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(
              [
                { id: 'google', name: 'Google Search', desc: 'Buscador oficial estándar' },
                { id: 'duckduckgo', name: 'DuckDuckGo', desc: 'Privacidad estricta sin seguimiento' },
                { id: 'brave', name: 'Brave Search', desc: 'Índice web independiente' },
                { id: 'ecosia', name: 'Ecosia', desc: 'Planta árboles mientras buscas' },
                { id: 'searx', name: 'SearXNG', desc: 'Metabuscador libre descentralizado' },
                { id: 'bing', name: 'Microsoft Bing', desc: 'Resultados con IA integrada' },
              ] as const
            ).map((engine) => (
              <button
                key={engine.id}
                onClick={() => onUpdateSettings({ defaultSearchEngine: engine.id })}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  settings.defaultSearchEngine === engine.id
                    ? 'border-red-500 bg-red-500/5 dark:bg-red-500/10 ring-1 ring-red-500'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    {engine.name}
                  </span>
                  {settings.defaultSearchEngine === engine.id && (
                    <Check className="w-3.5 h-3.5 text-red-600" />
                  )}
                </div>
                <span className="text-[11px] text-slate-400 leading-tight">
                  {engine.desc}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Apariencia y Tema */}
        <section className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-500" />
            <span>Tema y Apariencia</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            {(
              [
                { id: 'debian-dark', name: 'Debian Dark', bg: 'bg-zinc-950 border-red-500' },
                { id: 'chrome-classic', name: 'Chrome Clásico', bg: 'bg-slate-100 border-blue-400' },
                { id: 'nordic-slate', name: 'Nordic Slate', bg: 'bg-slate-900 border-cyan-500' },
                { id: 'material-dark', name: 'Material You', bg: 'bg-neutral-900 border-emerald-500' },
                { id: 'paper-light', name: 'Paper Clean', bg: 'bg-white border-amber-400' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings({ theme: t.id })}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                  settings.theme === t.id
                    ? 'border-red-500 ring-2 ring-red-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-zinc-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border ${t.bg} shadow-inner flex items-center justify-center text-[10px]`}>
                  {settings.theme === t.id ? '✓' : ''}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {t.name}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800/60 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">Mostrar barra de marcadores siempre</span>
              <input
                type="checkbox"
                checked={settings.showBookmarksBar}
                onChange={(e) => onUpdateSettings({ showBookmarksBar: e.target.checked })}
                className="accent-red-600 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300">Mostrar barra de estado Debian / RAM en tiempo real</span>
              <input
                type="checkbox"
                checked={settings.showDebianStats}
                onChange={(e) => onUpdateSettings({ showDebianStats: e.target.checked })}
                className="accent-red-600 cursor-pointer"
              />
            </label>
          </div>
        </section>

        {/* Privacidad y Escudos FénixShield */}
        <section className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Escudos y Protección de Privacidad</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">FénixShield Ad & Tracker Blocker</div>
                <div className="text-slate-400 text-[11px]">Bloquea anuncios intrusivos y rastreo de huella digital</div>
              </div>
              <input
                type="checkbox"
                checked={settings.adblockEnabled}
                onChange={(e) => onUpdateSettings({ adblockEnabled: e.target.checked })}
                className="accent-red-600 cursor-pointer scale-110"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Protección contra rastreo</div>
                <div className="text-slate-400 text-[11px]">Nivel de bloqueo de cookies de terceros y scripts espía</div>
              </div>
              <select
                value={settings.trackingProtection}
                onChange={(e) =>
                  onUpdateSettings({
                    trackingProtection: e.target.value as 'strict' | 'standard' | 'off',
                  })
                }
                className="bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs"
              >
                <option value="strict">Estricta (Recomendado)</option>
                <option value="standard">Estándar</option>
                <option value="off">Desactivada</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Enviar cabecera &apos;Do Not Track&apos; (DNT)</div>
                <div className="text-slate-400 text-[11px]">Solicita a los servidores que no registren tus visitas</div>
              </div>
              <input
                type="checkbox"
                checked={settings.doNotTrack}
                onChange={(e) => onUpdateSettings({ doNotTrack: e.target.checked })}
                className="accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Rendimiento y Ahorro de Memoria Debian */}
        <section className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>Rendimiento y Memoria (Debian Linux Engine)</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Modo Ahorro de Memoria Extremo</div>
                <div className="text-slate-400 text-[11px]">Suspende pestañas en segundo plano tras 5 minutos de inactividad</div>
              </div>
              <input
                type="checkbox"
                checked={settings.memorySaverMode}
                onChange={(e) => onUpdateSettings({ memorySaverMode: e.target.checked })}
                className="accent-red-600 cursor-pointer scale-110"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Modo Turbo Data Saver</div>
                <div className="text-slate-400 text-[11px]">Comprime imágenes y bloquea fuentes innecesarias para ahorrar datos</div>
              </div>
              <input
                type="checkbox"
                checked={settings.turboDataSaver}
                onChange={(e) => onUpdateSettings({ turboDataSaver: e.target.checked })}
                className="accent-red-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Aceleración por Hardware (VA-API / OpenGL)</div>
                <div className="text-slate-400 text-[11px]">Utiliza la GPU de Linux para renderizado suave a 60 FPS</div>
              </div>
              <input
                type="checkbox"
                checked={settings.hardwareAcceleration}
                onChange={(e) => onUpdateSettings({ hardwareAcceleration: e.target.checked })}
                className="accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
