'use client';

import React, { useState } from 'react';
import { Bookmark, BrowserSettings, DownloadItem, Extension, HistoryItem, Tab } from '@/types/browser';
import { TorCircuitState, TorServerLocation } from '@/types/tor';
import { SIMULATED_SITES, extractDomain } from '@/lib/web-renderer';
import NewTabPage from './internal-pages/NewTabPage';
import BookmarksPage from './internal-pages/BookmarksPage';
import HistoryPage from './internal-pages/HistoryPage';
import DownloadsPage from './internal-pages/DownloadsPage';
import ExtensionsPage from './internal-pages/ExtensionsPage';
import TaskManagerPage from './internal-pages/TaskManagerPage';
import SettingsPage from './internal-pages/SettingsPage';
import DebianSetupPage from './internal-pages/DebianSetupPage';
import AboutPage from './internal-pages/AboutPage';
import TorPage from './internal-pages/TorPage';
import ReaderModeView from './ReaderModeView';
import YouTubeView from './web-apps/YouTubeView';
import FacebookView from './web-apps/FacebookView';
import TwitterXView from './web-apps/TwitterXView';
import {
  Globe,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface BrowserViewProps {
  tab: Tab;
  tabs: Tab[];
  bookmarks: Bookmark[];
  history: HistoryItem[];
  downloads: DownloadItem[];
  extensions: Extension[];
  settings: BrowserSettings;
  circuitState?: TorCircuitState;
  onNavigate: (url: string) => void;
  onAddBookmark: (bm: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  onDeleteBookmark: (id: string) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: (range: 'hour' | 'day' | 'all') => void;
  onStartDebianDownload: () => void;
  onDeleteDownload: (id: string) => void;
  onClearAllDownloads: () => void;
  onToggleExtension: (id: string) => void;
  onRemoveExtension: (id: string) => void;
  onCloseTab: (id: string) => void;
  onPurgeMemory: () => void;
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
  onResetSettings: () => void;
  onOpenDebianExport: () => void;
  onToggleReaderMode: () => void;
  onAskAiSummary: () => void;
  onOpenTorModal?: () => void;
  onSwitchTorIp?: (targetLocation?: TorServerLocation) => void;
  onToggleTor?: (enabled: boolean) => void;
}

export default function BrowserView({
  tab,
  tabs,
  bookmarks,
  history,
  downloads,
  extensions,
  settings,
  circuitState,
  onNavigate,
  onAddBookmark,
  onDeleteBookmark,
  onDeleteHistoryItem,
  onClearHistory,
  onStartDebianDownload,
  onDeleteDownload,
  onClearAllDownloads,
  onToggleExtension,
  onRemoveExtension,
  onCloseTab,
  onPurgeMemory,
  onUpdateSettings,
  onResetSettings,
  onOpenDebianExport,
  onToggleReaderMode,
  onAskAiSummary,
  onOpenTorModal,
  onSwitchTorIp,
  onToggleTor,
}: BrowserViewProps) {
  const url = tab.url.toLowerCase();

  // 1. Check if Reader Mode is enabled
  if (tab.readerModeActive) {
    const domain = extractDomain(tab.url);
    const simulated = SIMULATED_SITES[domain];
    const text =
      tab.pageContent?.plainText ||
      simulated?.description ||
      `Contenido optimizado de ${tab.title}. Fénix ha limpiado el documento de rastreadores y publicidad intrusiva.`;

    return (
      <div className="w-full h-full overflow-y-auto">
        <ReaderModeView
          title={tab.title}
          url={tab.url}
          plainText={text}
          author={simulated?.author || 'Fénix Reader'}
          readTime={simulated?.readTime || '3 min'}
          onClose={onToggleReaderMode}
          onAskAiSummary={onAskAiSummary}
        />
      </div>
    );
  }

  // 2. Check internal chrome:// pages
  if (url === 'chrome://newtab' || url === 'about:blank' || !url) {
    return (
      <div className="w-full h-full overflow-y-auto">
        <NewTabPage
          settings={settings}
          circuitState={circuitState}
          onNavigate={onNavigate}
          onOpenDebianExport={onOpenDebianExport}
          onOpenTorModal={onOpenTorModal}
          onSwitchTorIp={onSwitchTorIp}
        />
      </div>
    );
  }

  if (url === 'chrome://tor' || url === 'chrome://circuit' || url === 'chrome://ip' || url === 'chrome://onion') {
    return (
      <div className="w-full h-full overflow-y-auto">
        {circuitState ? (
          <TorPage
            circuitState={circuitState}
            onSwitchIp={onSwitchTorIp || (() => {})}
            onToggleTor={onToggleTor || (() => {})}
          />
        ) : (
          <div className="p-10 text-center text-slate-500">Cargando circuito Tor...</div>
        )}
      </div>
    );
  }

  if (url === 'chrome://bookmarks') {
    return (
      <div className="w-full h-full overflow-y-auto">
        <BookmarksPage
          bookmarks={bookmarks}
          onNavigate={onNavigate}
          onAddBookmark={onAddBookmark}
          onDeleteBookmark={onDeleteBookmark}
        />
      </div>
    );
  }

  if (url === 'chrome://history') {
    return (
      <div className="w-full h-full overflow-y-auto">
        <HistoryPage
          history={history}
          onNavigate={onNavigate}
          onDeleteItem={onDeleteHistoryItem}
          onClearHistory={onClearHistory}
        />
      </div>
    );
  }

  if (url === 'chrome://downloads') {
    return (
      <div className="w-full h-full overflow-y-auto">
        <DownloadsPage
          downloads={downloads}
          onStartDebianDownload={onStartDebianDownload}
          onDeleteDownload={onDeleteDownload}
          onClearAllDownloads={onClearAllDownloads}
        />
      </div>
    );
  }

  if (url === 'chrome://extensions') {
    return (
      <div className="w-full h-full overflow-y-auto">
        <ExtensionsPage
          extensions={extensions}
          onToggleExtension={onToggleExtension}
          onRemoveExtension={onRemoveExtension}
        />
      </div>
    );
  }

  if (url === 'chrome://tasks' || url === 'chrome://taskmanager') {
    return (
      <div className="w-full h-full overflow-y-auto">
        <TaskManagerPage
          tabs={tabs}
          onCloseTab={onCloseTab}
          onPurgeMemory={onPurgeMemory}
        />
      </div>
    );
  }

  if (url === 'chrome://settings') {
    return (
      <div className="w-full h-full overflow-y-auto">
        <SettingsPage
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onResetDefaults={onResetSettings}
        />
      </div>
    );
  }

  if (url === 'chrome://debian-setup' || url === 'chrome://debian') {
    return (
      <div className="w-full h-full overflow-y-auto">
        <DebianSetupPage onTriggerDownloadDeb={onStartDebianDownload} />
      </div>
    );
  }

  if (url === 'chrome://about' || url === 'chrome://version') {
    return (
      <div className="w-full h-full overflow-y-auto">
        <AboutPage onNavigate={onNavigate} />
      </div>
    );
  }

  // 3. Specialized Rich Web Applications (YouTube, Facebook, Twitter/X)
  const domain = extractDomain(tab.url).toLowerCase();
  
  if (
    domain.includes('youtube.com') ||
    domain.includes('youtu.be') ||
    tab.url.includes('youtube.com')
  ) {
    return (
      <div className="w-full h-full overflow-y-auto">
        <YouTubeView
          onNavigate={onNavigate}
          onAskAiSummary={onAskAiSummary}
        />
      </div>
    );
  }

  if (
    domain.includes('facebook.com') ||
    domain.includes('fb.com') ||
    tab.url.includes('facebook.com')
  ) {
    return (
      <div className="w-full h-full overflow-y-auto">
        <FacebookView
          onNavigate={onNavigate}
          onAskAiSummary={onAskAiSummary}
        />
      </div>
    );
  }

  if (
    domain.includes('twitter.com') ||
    domain.includes('x.com') ||
    tab.url.includes('twitter.com') ||
    tab.url.includes('x.com')
  ) {
    return (
      <div className="w-full h-full overflow-y-auto">
        <TwitterXView
          onNavigate={onNavigate}
          onAskAiSummary={onAskAiSummary}
        />
      </div>
    );
  }

  // 4. Simulated Known High-Quality Sites (Offline / Zero-latency guarantee)
  const simulated = SIMULATED_SITES[domain];

  if (simulated) {
    return (
      <div className="w-full h-full overflow-y-auto bg-white dark:bg-zinc-950">
        {/* Quick site banner */}
        <div className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Renderizado seguro de Fénix Navegador sin scripts de seguimiento</span>
          </div>
          <button
            onClick={onToggleReaderMode}
            className="hover:text-red-600 dark:hover:text-red-400 font-semibold flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>Activar Modo Lectura</span>
          </button>
        </div>

        <div
          className="p-4"
          dangerouslySetInnerHTML={{ __html: simulated.contentHtml }}
        />
      </div>
    );
  }

  // 4. Live Render / Proxy / Real URL
  if (tab.pageContent?.hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-950 text-slate-900 dark:text-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold mb-2">No se pudo cargar la página</h2>
        <p className="text-xs text-slate-500 max-w-md mb-6">
          {tab.pageContent.errorMessage ||
            `Error al establecer conexión con '${tab.url}'. Es posible que el servidor no responda o la política CORS restrinja la visualización directa.`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate(tab.url)}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
          >
            Reintentar
          </button>
          <button
            onClick={() => onNavigate('chrome://newtab')}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-zinc-700"
          >
            Ir a inicio
          </button>
        </div>
      </div>
    );
  }

  // Live parsed content container
  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-zinc-950 text-slate-900 dark:text-slate-100">
      {/* Live web viewport info banner */}
      <div className="bg-slate-50 dark:bg-zinc-900/80 border-b border-slate-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-sm">
            {tab.url}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
            TLS 1.3 / Aceleración VA-API
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAskAiSummary}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 font-semibold text-[11px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resumir con IA</span>
          </button>

          <button
            onClick={onToggleReaderMode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 font-semibold text-[11px]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Modo Lectura</span>
          </button>
        </div>
      </div>

      {/* Main page content preview */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
          {tab.title}
        </h1>

        {tab.pageContent?.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed border-l-2 border-red-500 pl-4 py-1 italic bg-slate-50 dark:bg-zinc-900 rounded-r-lg">
            {tab.pageContent.description}
          </p>
        )}

        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {tab.pageContent?.plainText ? (
            tab.pageContent.plainText
              .split('\n')
              .filter((p) => p.trim().length > 0)
              .slice(0, 15)
              .map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              Cargando y optimizando vista de la página para Debian Linux...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
