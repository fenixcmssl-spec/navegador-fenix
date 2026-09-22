'use client';

import React from 'react';
import { Tab } from '@/types/browser';
import { Plus, X, Volume2, VolumeX, Pin, ShieldCheck, EyeOff, Globe } from 'lucide-react';
import FenixLogo from './FenixLogo';

interface BrowserTabsProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (incognito?: boolean) => void;
  onToggleMute: (id: string) => void;
  isIncognitoWindow?: boolean;
}

export default function BrowserTabs({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onToggleMute,
  isIncognitoWindow = false,
}: BrowserTabsProps) {
  return (
    <div
      id="aerochrome-tabstrip"
      className={`w-full flex items-center select-none pt-1 px-2 gap-1 overflow-x-auto no-scrollbar border-b ${
        isIncognitoWindow
          ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
          : 'bg-slate-200/90 dark:bg-zinc-950 border-slate-300/80 dark:border-zinc-800/80 text-slate-700 dark:text-slate-300'
      }`}
    >
      {/* Linux Debian Window Title / Controls */}
      <div className="flex items-center gap-1.5 px-2 mr-1 shrink-0">
        <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-600 transition-colors cursor-pointer" title="Cerrar ventana" />
        <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-600 transition-colors cursor-pointer" title="Minimizar" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-600 transition-colors cursor-pointer" title="Maximizar" />
        <div className="ml-1 text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <FenixLogo size={16} showGlow={false} />
          <span className="hidden sm:inline font-bold">Fénix</span>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-t-xl transition-all cursor-pointer min-w-[120px] max-w-[220px] shrink-0 border-t border-x ${
                isActive
                  ? isIncognitoWindow
                    ? 'bg-zinc-900 border-zinc-700 text-white font-semibold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'bg-transparent border-transparent hover:bg-slate-300/60 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-slate-400'
              }`}
            >
              {/* Tab Favicon or Spinner */}
              <div className="shrink-0 flex items-center justify-center w-4 h-4">
                {tab.isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : tab.isIncognito ? (
                  <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                ) : tab.url.startsWith('chrome://') ? (
                  <span className="text-xs">🌀</span>
                ) : tab.favicon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tab.favicon}
                    alt=""
                    className="w-3.5 h-3.5 rounded-xs"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              {/* Title */}
              <span className="truncate flex-1 text-[11.5px]">
                {tab.title || 'Nueva pestaña'}
              </span>

              {/* Mute Audio Button */}
              {tab.isMuted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute(tab.id);
                  }}
                  className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Activar sonido"
                >
                  <VolumeX className="w-3 h-3 text-red-500" />
                </button>
              )}

              {/* Close Tab Button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className={`p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 transition-opacity ${
                    isActive ? 'opacity-80 hover:opacity-100' : 'opacity-0 group-hover:opacity-80'
                  }`}
                  title="Cerrar pestaña (Ctrl+W)"
                >
                  <X className="w-3 h-3 text-slate-500 hover:text-red-500" />
                </button>
              )}
            </div>
          );
        })}

        {/* New Tab '+' Button */}
        <button
          id="btn-new-tab"
          onClick={() => onNewTab(false)}
          className="p-1.5 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
          title="Nueva pestaña (Ctrl+T)"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Incognito indicator badge */}
      {isIncognitoWindow && (
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] font-mono mr-2">
          <EyeOff className="w-3 h-3" />
          <span>Incógnito</span>
        </div>
      )}
    </div>
  );
}
