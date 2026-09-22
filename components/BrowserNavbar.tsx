'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tab, BrowserSettings, SearchEngine } from '@/types/browser';
import { TorCircuitState } from '@/types/tor';
import FenixLogo from './FenixLogo';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Home,
  Lock,
  ShieldCheck,
  Star,
  BookOpen,
  Sparkles,
  QrCode,
  MoreVertical,
  Search,
  Globe,
  Sliders,
  Cpu,
  Activity,
  Download,
  RefreshCw,
} from 'lucide-react';

interface BrowserNavbarProps {
  activeTab: Tab;
  settings: BrowserSettings;
  circuitState?: TorCircuitState;
  isBookmarked: boolean;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onGoHome: () => void;
  onToggleBookmark: () => void;
  onToggleReaderMode: () => void;
  onToggleAiCopilot: () => void;
  onOpenShields: () => void;
  onOpenQrCode: () => void;
  onOpenMenu: () => void;
  onOpenTaskManager: () => void;
  onOpenDebianSetup: () => void;
  onOpenTorModal?: () => void;
  onOpenTorCircuit?: () => void;
  onSwitchTorIp?: () => void;
  isIncognitoWindow?: boolean;
}

export default function BrowserNavbar({
  activeTab,
  settings,
  circuitState,
  isBookmarked,
  onNavigate,
  onGoBack,
  onGoForward,
  onReload,
  onGoHome,
  onToggleBookmark,
  onToggleReaderMode,
  onToggleAiCopilot,
  onOpenShields,
  onOpenQrCode,
  onOpenMenu,
  onOpenTaskManager,
  onOpenDebianSetup,
  onOpenTorModal,
  onOpenTorCircuit,
  onSwitchTorIp,
  isIncognitoWindow = false,
}: BrowserNavbarProps) {
  const triggerTorModal = onOpenTorCircuit || onOpenTorModal;
  const [prevTabUrl, setPrevTabUrl] = useState(activeTab.url);
  const [urlInput, setUrlInput] = useState(activeTab.url);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync url input when active tab changes, unless user is actively typing
  if (activeTab.url !== prevTabUrl) {
    setPrevTabUrl(activeTab.url);
    if (!isFocused) {
      setUrlInput(activeTab.url);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onNavigate(urlInput.trim());
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const suggestions = [
    { label: 'Debian Linux Oficial', url: 'https://www.debian.org', icon: '🌀' },
    { label: 'Debian Package Tracker', url: 'https://packages.debian.org', icon: '📦' },
    { label: 'DuckDuckGo Búsqueda Privada', url: 'https://duckduckgo.com', icon: '🦆' },
    { label: 'Hacker News Tech', url: 'https://news.ycombinator.com', icon: '⚡' },
    { label: 'Wikipedia en Español', url: 'https://es.wikipedia.org', icon: '📚' },
    { label: 'Administrador de Tareas Fénix', url: 'chrome://tasks', icon: '⚡' },
    { label: 'Descargar .deb para Debian', url: 'chrome://debian-setup', icon: '🐧' },
    { label: 'Configuración de Fénix Navegador', url: 'chrome://settings', icon: '⚙️' },
  ].filter(
    (s) =>
      !urlInput ||
      s.label.toLowerCase().includes(urlInput.toLowerCase()) ||
      s.url.toLowerCase().includes(urlInput.toLowerCase())
  );

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;
  const isInternalUrl = activeTab.url.startsWith('chrome://');

  return (
    <div
      id="aerochrome-navbar"
      className={`w-full flex items-center gap-2 px-3 py-1.5 border-b shadow-2xs select-none transition-colors ${
        isIncognitoWindow
          ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
          : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300'
      }`}
    >
      {/* Navigation controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          id="btn-nav-back"
          onClick={onGoBack}
          disabled={!canGoBack}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Atrás (Alt+Flecha Izquierda)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          id="btn-nav-forward"
          onClick={onGoForward}
          disabled={!canGoForward}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Adelante (Alt+Flecha Derecha)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          id="btn-nav-reload"
          onClick={onReload}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title="Recargar (F5 / Ctrl+R)"
        >
          {activeTab.isLoading ? (
            <X className="w-4 h-4 text-red-500" />
          ) : (
            <RotateCw className="w-4 h-4" />
          )}
        </button>

        <button
          id="btn-nav-home"
          onClick={onGoHome}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors hidden sm:flex"
          title="Página principal (chrome://newtab)"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Omnibox / Address Bar */}
      <div className="relative flex-1 max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
            isFocused
              ? 'border-red-500 ring-2 ring-red-500/20 bg-white dark:bg-zinc-950 shadow-md'
              : 'border-slate-200 dark:border-zinc-700/80 bg-slate-100/90 dark:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          {/* Security / Shields Lock Badge */}
          <button
            type="button"
            onClick={onOpenShields}
            className="flex items-center gap-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0"
            title="Ver información de seguridad y escudos FénixShield"
          >
            {isInternalUrl ? (
              <span className="text-xs">🔥</span>
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>

          {/* Omnibox Text Input */}
          <input
            id="omnibox-input"
            ref={inputRef}
            type="text"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                setShowSuggestions(false);
              }, 200);
            }}
            placeholder="Escribe una URL o busca en la web..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none font-mono selection:bg-red-500/20"
          />

          {/* Page Action Tools Inside Omnibox */}
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            {/* AI Summarizer Button */}
            {!isInternalUrl && (
              <button
                type="button"
                onClick={onToggleAiCopilot}
                className="p-1 rounded-md hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                title="Copilot IA: Resumen y análisis inteligente de la página"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Reader Mode Button */}
            {!isInternalUrl && (
              <button
                type="button"
                onClick={onToggleReaderMode}
                className={`p-1 rounded-md transition-colors ${
                  activeTab.readerModeActive
                    ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500'
                }`}
                title="Modo lectura sin distracciones"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Share / QR Code */}
            {!isInternalUrl && (
              <button
                type="button"
                onClick={onOpenQrCode}
                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 transition-colors hidden sm:block"
                title="Generar código QR del enlace"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Bookmark Star Button */}
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`p-1 rounded-md transition-colors ${
                isBookmarked
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Editar marcador' : 'Añadir esta pestaña a marcadores (Ctrl+D)'}
            >
              <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </form>

        {/* Omnibox Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs">
            {suggestions.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                onMouseDown={() => {
                  onNavigate(item.url);
                  setShowSuggestions(false);
                }}
                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 flex items-center justify-between cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <div className="truncate">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-600">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2 truncate font-mono">
                      {item.url}
                    </span>
                  </div>
                </div>
                <Search className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extensions & Tools Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Tor Onion Circuit & IP Switcher Badge */}
        {circuitState && (
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenTorModal}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/50 text-purple-300 transition-colors text-xs font-mono group"
              title={`Tor Circuit: IP ${circuitState.currentIp} (${circuitState.selectedLocation.name})\nHaz clic para gestionar circuito o cambiar IP`}
            >
              <span className="text-sm">🧅</span>
              <span className="font-bold text-[11px] hidden sm:inline">{circuitState.currentIp}</span>
              <span className="text-xs">{circuitState.selectedLocation.flag}</span>
            </button>

            {onSwitchTorIp && (
              <button
                onClick={onSwitchTorIp}
                className="p-1 rounded-lg hover:bg-purple-950/50 text-purple-400 hover:text-purple-200 transition-colors"
                title="Cambiar IP / Nueva Identidad Tor"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* FénixShield Badge */}
        <button
          id="btn-shields-counter"
          onClick={onOpenShields}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold"
          title="Escudo FénixShield: Anuncios bloqueados"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono font-bold">
            {activeTab.shieldStats?.blockedAds || 0}
          </span>
        </button>

        {/* Task Manager RAM quick access */}
        <button
          onClick={onOpenTaskManager}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400 transition-colors hidden md:flex items-center gap-1"
          title="Administrador de Tareas: Monitor de RAM & CPU"
        >
          <Activity className="w-4 h-4 text-emerald-500" />
        </button>

        {/* Debian setup launcher */}
        <button
          onClick={onOpenDebianSetup}
          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title="Instalador Debian .deb & Guía Fénix"
        >
          <FenixLogo size={20} showGlow={false} />
        </button>

        {/* Chrome 3-Dots Menu */}
        <button
          id="btn-chrome-menu"
          onClick={onOpenMenu}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 transition-colors"
          title="Personaliza y controla Fénix Navegador"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
