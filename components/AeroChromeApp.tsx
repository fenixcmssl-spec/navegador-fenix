'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bookmark,
  BrowserSettings,
  DownloadItem,
  Extension,
  HistoryItem,
  Tab,
} from '@/types/browser';
import {
  DEFAULT_BOOKMARKS,
  DEFAULT_EXTENSIONS,
  DEFAULT_SETTINGS,
  INITIAL_HISTORY,
} from '@/lib/browser-defaults';
import {
  extractDomain,
  normalizeUrl,
  SIMULATED_SITES,
  simulateShieldStats,
} from '@/lib/web-renderer';
import BrowserTabs from './BrowserTabs';
import BrowserNavbar from './BrowserNavbar';
import BookmarksBar from './BookmarksBar';
import BrowserView from './BrowserView';
import ChromeMenu from './ChromeMenu';
import ShieldsPopup from './ShieldsPopup';
import DevToolsPanel from './DevToolsPanel';
import FindInPageBar from './FindInPageBar';
import QrCodeModal from './QrCodeModal';
import DebianExportModal from './DebianExportModal';
import AiCopilotModal from './AiCopilotModal';
import TorCircuitModal from './TorCircuitModal';
import { TorCircuitState, TorServerLocation } from '@/types/tor';
import { generateRandomCircuit, TOR_SERVER_LOCATIONS } from '@/lib/tor-defaults';
import { Activity, Cpu, Shield, Terminal, Zap } from 'lucide-react';

export default function AeroChromeApp() {
  // Initial state with a speed-dial tab in Incognito / Modo Oculto
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      title: 'Nueva pestaña',
      url: 'chrome://newtab',
      isLoading: false,
      loadingProgress: 100,
      history: ['chrome://newtab'],
      historyIndex: 0,
      isMuted: false,
      isPinned: false,
      isIncognito: true, // Modo Oculto Permanente
      shieldStats: simulateShieldStats('chrome://newtab'),
      readerModeActive: false,
      zoomLevel: 100,
      memoryMB: 18.5,
      cpuPercent: 0.2,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Tor Circuit State
  const [circuitState, setCircuitState] = useState<TorCircuitState>(() =>
    generateRandomCircuit(TOR_SERVER_LOCATIONS[0])
  );
  const [isTorModalOpen, setIsTorModalOpen] = useState(false);

  // Persistence data
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedBm = localStorage.getItem('fenix_bookmarks') || localStorage.getItem('aerochrome_bookmarks');
        if (savedBm) return JSON.parse(savedBm);
      } catch {}
    }
    return DEFAULT_BOOKMARKS;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHist = localStorage.getItem('fenix_history') || localStorage.getItem('aerochrome_history');
        if (savedHist) return JSON.parse(savedHist);
      } catch {}
    }
    return INITIAL_HISTORY;
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: 'dl-deb-1',
      fileName: 'fenix_1.0.0_amd64.deb',
      fileSize: '6.8 MB',
      totalBytes: 6800000,
      downloadedBytes: 6800000,
      mimeType: 'application/vnd.debian.binary-package',
      url: 'https://packages.fenix-browser.org/debian/fenix_1.0.0_amd64.deb',
      progress: 100,
      status: 'completed',
      speed: '18 MB/s',
      startTime: 1716000000000,
    },
  ]);

  const [extensions, setExtensions] = useState<Extension[]>(DEFAULT_EXTENSIONS);

  const [settings, setSettings] = useState<BrowserSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSet = localStorage.getItem('fenix_settings') || localStorage.getItem('aerochrome_settings');
        if (savedSet) return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSet) };
      } catch {}
    }
    return DEFAULT_SETTINGS;
  });

  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShieldsOpen, setIsShieldsOpen] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isFindInPageOpen, setIsFindInPageOpen] = useState(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  const [isDebianExportOpen, setIsDebianExportOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);

  // Active tab reference
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fenix_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('fenix_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('fenix_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Tab Navigation Handler
  const navigateTab = useCallback(
    async (targetUrlInput: string, tabIdToNavigate: string = activeTabId) => {
      const targetUrl = normalizeUrl(targetUrlInput, settings.defaultSearchEngine);
      const domain = extractDomain(targetUrl);
      const isInternal = targetUrl.startsWith('chrome://');

      // Update tab URL, start loading
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === tabIdToNavigate) {
            const nextHistory = t.history.slice(0, t.historyIndex + 1);
            nextHistory.push(targetUrl);
            return {
              ...t,
              url: targetUrl,
              title: isInternal
                ? targetUrl.replace('chrome://', '').toUpperCase()
                : domain,
              isLoading: true,
              loadingProgress: 25,
              history: nextHistory,
              historyIndex: nextHistory.length - 1,
              shieldStats: simulateShieldStats(targetUrl),
              readerModeActive: false,
              memoryMB: isInternal ? 18.2 : 24.5 + Math.random() * 5,
            };
          }
          return t;
        })
      );

      // Record in history if not internal
      if (!isInternal) {
        setHistory((prev) => [
          {
            id: `h-${Date.now()}`,
            title: SIMULATED_SITES[domain]?.title || domain,
            url: targetUrl,
            timestamp: Date.now(),
            favicon: SIMULATED_SITES[domain]?.favicon || `https://${domain}/favicon.ico`,
            visitCount: 1,
          },
          ...prev.slice(0, 99),
        ]);
      }

      // If it's a known simulated site or internal page, complete immediately
      if (isInternal || SIMULATED_SITES[domain]) {
        setTimeout(() => {
          setTabs((prev) =>
            prev.map((t) => {
              if (t.id === tabIdToNavigate) {
                const siteInfo = SIMULATED_SITES[domain];
                return {
                  ...t,
                  isLoading: false,
                  loadingProgress: 100,
                  title: siteInfo ? siteInfo.title : isInternal ? targetUrl.replace('chrome://', '').toUpperCase() : domain,
                  favicon: siteInfo?.favicon,
                  pageContent: siteInfo
                    ? {
                        title: siteInfo.title,
                        description: siteInfo.description,
                        plainText: siteInfo.description,
                        isMock: true,
                      }
                    : undefined,
                };
              }
              return t;
            })
          );
        }, 150);
        return;
      }

      // Otherwise, attempt live fetch via /api/proxy
      try {
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
        if (response.ok) {
          const data = await response.json();
          setTabs((prev) =>
            prev.map((t) => {
              if (t.id === tabIdToNavigate) {
                return {
                  ...t,
                  isLoading: false,
                  loadingProgress: 100,
                  title: data.title || domain,
                  favicon: data.favicon,
                  pageContent: {
                    title: data.title,
                    description: data.description,
                    plainText: data.plainText,
                    html: data.rawHtml,
                  },
                };
              }
              return t;
            })
          );
        } else {
          setTabs((prev) =>
            prev.map((t) => {
              if (t.id === tabIdToNavigate) {
                return {
                  ...t,
                  isLoading: false,
                  loadingProgress: 100,
                  title: domain,
                  pageContent: {
                    hasError: true,
                    errorMessage: `No se pudo conectar directamente con ${domain}. Modo offline seguro activo.`,
                  },
                };
              }
              return t;
            })
          );
        }
      } catch {
        setTabs((prev) =>
          prev.map((t) => {
            if (t.id === tabIdToNavigate) {
              return {
                ...t,
                isLoading: false,
                loadingProgress: 100,
                title: domain,
                pageContent: {
                  hasError: true,
                  errorMessage: `Conexión rechazada por el servidor remoto o política de seguridad de red.`,
                },
              };
            }
            return t;
          })
        );
      }
    },
    [activeTabId, settings.defaultSearchEngine]
  );

  // Add new tab
  const handleNewTab = (incognito: boolean = false) => {
    const isIncognitoMode = settings.alwaysIncognito || incognito;
    const newId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newId,
      title: isIncognitoMode ? 'Nueva pestaña (Oculta)' : 'Nueva pestaña',
      url: 'chrome://newtab',
      isLoading: false,
      loadingProgress: 100,
      history: ['chrome://newtab'],
      historyIndex: 0,
      isMuted: false,
      isPinned: false,
      isIncognito: isIncognitoMode,
      shieldStats: simulateShieldStats('chrome://newtab'),
      readerModeActive: false,
      zoomLevel: 100,
      memoryMB: 16.5,
      cpuPercent: 0.1,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  // Close tab
  const handleCloseTab = (id: string) => {
    if (tabs.length === 1) {
      // If closing last tab, reset it to newtab
      navigateTab('chrome://newtab', id);
      return;
    }
    const idx = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      const nextActive = newTabs[Math.max(0, idx - 1)];
      setActiveTabId(nextActive.id);
    }
  };

  // Back / Forward / Reload
  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[newIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url: prevUrl,
                historyIndex: newIndex,
                title: prevUrl.startsWith('chrome://') ? prevUrl.replace('chrome://', '').toUpperCase() : extractDomain(prevUrl),
              }
            : t
        )
      );
    }
  };

  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[newIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url: nextUrl,
                historyIndex: newIndex,
                title: nextUrl.startsWith('chrome://') ? nextUrl.replace('chrome://', '').toUpperCase() : extractDomain(nextUrl),
              }
            : t
        )
      );
    }
  };

  const handleReload = () => {
    navigateTab(activeTab.url);
  };

  // Bookmark toggle
  const isCurrentBookmarked = bookmarks.some((b) => b.url === activeTab.url);
  const handleToggleBookmark = () => {
    if (isCurrentBookmarked) {
      setBookmarks(bookmarks.filter((b) => b.url !== activeTab.url));
    } else {
      setBookmarks([
        ...bookmarks,
        {
          id: `bm-${Date.now()}`,
          title: activeTab.title,
          url: activeTab.url,
          favicon: activeTab.favicon,
          createdAt: Date.now(),
        },
      ]);
    }
  };

  // Reader mode toggle
  const handleToggleReaderMode = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, readerModeActive: !t.readerModeActive } : t
      )
    );
  };

  // Download .deb package file
  const handleDownloadDebianPackage = () => {
    const a = document.createElement('a');
    a.href = '/api/download/deb';
    a.download = 'fenix-browser_1.0.0_amd64.deb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const newDownload: DownloadItem = {
      id: `dl-${Date.now()}`,
      fileName: 'fenix-browser_1.0.0_amd64.deb',
      fileSize: '896 KB',
      totalBytes: 917504,
      downloadedBytes: 917504,
      mimeType: 'application/vnd.debian.binary-package',
      url: '/api/download/deb',
      progress: 100,
      status: 'completed',
      speed: '45 MB/s',
      startTime: Date.now(),
    };
    setDownloads((prev) => [newDownload, ...prev]);
  };

  // RAM Purge action
  const handlePurgeMemory = () => {
    setTabs((prev) =>
      prev.map((t) => ({
        ...t,
        memoryMB: Math.max(12, (t.memoryMB || 20) * 0.55),
      }))
    );
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+T: New tab
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleNewTab(false);
      }
      // Ctrl+W: Close tab
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleCloseTab(activeTabId);
      }
      // Ctrl+Shift+N: Incognito
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewTab(true);
      }
      // Ctrl+H: History
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        navigateTab('chrome://history');
      }
      // Ctrl+J: Downloads
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        navigateTab('chrome://downloads');
      }
      // F12 or Ctrl+Shift+I: DevTools
      else if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        setIsDevToolsOpen((prev) => !prev);
      }
      // F5 or Ctrl+R: Reload
      else if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r')) {
        e.preventDefault();
        handleReload();
      }
      // Ctrl+F: Find in page
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFindInPageOpen(true);
      }
      // Alt+Left: Back
      else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleGoBack();
      }
      // Alt+Right: Forward
      else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleGoForward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Tor Circuit Handlers
  const handleSwitchTorIp = useCallback((targetLocation?: TorServerLocation) => {
    setCircuitState((prev) => {
      const target =
        targetLocation ||
        TOR_SERVER_LOCATIONS[Math.floor(Math.random() * TOR_SERVER_LOCATIONS.length)];
      return generateRandomCircuit(target);
    });
  }, []);

  const handleToggleTor = useCallback((enabled: boolean) => {
    setCircuitState((prev) => ({
      ...prev,
      isConnected: enabled,
    }));
  }, []);

  // Calculate live total memory
  const totalRAM = tabs.reduce((acc, t) => acc + (t.memoryMB || 18), 16);

  // Theme wrapper class
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'debian-dark':
        return 'dark bg-zinc-950 text-slate-100';
      case 'chrome-classic':
        return 'bg-slate-100 text-slate-900';
      case 'nordic-slate':
        return 'dark bg-slate-950 text-slate-100';
      case 'material-dark':
        return 'dark bg-neutral-950 text-slate-100';
      default:
        return 'bg-[#fcfbf9] text-slate-900';
    }
  };

  return (
    <div
      id="aerochrome-root"
      className={`w-full h-screen flex flex-col overflow-hidden font-sans ${getThemeClass()}`}
    >
      {/* 1. Window Tabs Bar */}
      <BrowserTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onToggleMute={(id) =>
          setTabs(tabs.map((t) => (t.id === id ? { ...t, isMuted: !t.isMuted } : t)))
        }
        isIncognitoWindow={activeTab.isIncognito}
      />

      {/* 2. Omnibox Toolbar */}
      <BrowserNavbar
        activeTab={activeTab}
        settings={settings}
        isBookmarked={isCurrentBookmarked}
        circuitState={circuitState}
        onNavigate={(url) => navigateTab(url)}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onReload={handleReload}
        onGoHome={() => navigateTab('chrome://newtab')}
        onToggleBookmark={handleToggleBookmark}
        onToggleReaderMode={handleToggleReaderMode}
        onToggleAiCopilot={() => setIsAiCopilotOpen(true)}
        onOpenShields={() => setIsShieldsOpen(true)}
        onOpenQrCode={() => setIsQrCodeOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenTaskManager={() => navigateTab('chrome://tasks')}
        onOpenDebianSetup={() => setIsDebianExportOpen(true)}
        onOpenTorCircuit={() => setIsTorModalOpen(true)}
        isIncognitoWindow={activeTab.isIncognito}
      />

      {/* 3. Bookmarks Bar (if enabled) */}
      {settings.showBookmarksBar && (
        <BookmarksBar
          bookmarks={bookmarks}
          onNavigate={(url) => navigateTab(url)}
          onOpenBookmarksManager={() => navigateTab('chrome://bookmarks')}
          isIncognito={activeTab.isIncognito}
        />
      )}

      {/* 4. Page Viewport Body */}
      <div className="relative flex-1 overflow-hidden flex flex-col bg-slate-50 dark:bg-zinc-950">
        {/* Find in page overlay */}
        {isFindInPageOpen && (
          <FindInPageBar onClose={() => setIsFindInPageOpen(false)} />
        )}

        {/* Viewport Router */}
        <div className="flex-1 overflow-hidden">
          <BrowserView
            tab={activeTab}
            tabs={tabs}
            bookmarks={bookmarks}
            history={history}
            downloads={downloads}
            extensions={extensions}
            settings={settings}
            circuitState={circuitState}
            onNavigate={(url) => navigateTab(url)}
            onAddBookmark={(bm) =>
              setBookmarks([
                ...bookmarks,
                { ...bm, id: `bm-${Date.now()}`, createdAt: Date.now() },
              ])
            }
            onDeleteBookmark={(id) => setBookmarks(bookmarks.filter((b) => b.id !== id))}
            onDeleteHistoryItem={(id) => setHistory(history.filter((h) => h.id !== id))}
            onClearHistory={(range) => {
              if (range === 'hour') {
                setHistory(history.filter((h) => Date.now() - h.timestamp > 3600000));
              } else if (range === 'day') {
                setHistory(history.filter((h) => Date.now() - h.timestamp > 86400000));
              } else {
                setHistory([]);
              }
            }}
            onStartDebianDownload={handleDownloadDebianPackage}
            onDeleteDownload={(id) => setDownloads(downloads.filter((d) => d.id !== id))}
            onClearAllDownloads={() => setDownloads([])}
            onToggleExtension={(id) =>
              setExtensions(
                extensions.map((ext) =>
                  ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
                )
              )
            }
            onRemoveExtension={(id) =>
              setExtensions(extensions.filter((ext) => ext.id !== id))
            }
            onCloseTab={handleCloseTab}
            onPurgeMemory={handlePurgeMemory}
            onUpdateSettings={(newSettings) =>
              setSettings((prev) => ({ ...prev, ...newSettings }))
            }
            onResetSettings={() => setSettings(DEFAULT_SETTINGS)}
            onOpenDebianExport={() => setIsDebianExportOpen(true)}
            onToggleReaderMode={handleToggleReaderMode}
            onAskAiSummary={() => setIsAiCopilotOpen(true)}
            onOpenTorModal={() => setIsTorModalOpen(true)}
            onSwitchTorIp={handleSwitchTorIp}
            onToggleTor={handleToggleTor}
          />
        </div>

        {/* 5. Developer Tools Drawer (if open) */}
        {isDevToolsOpen && (
          <DevToolsPanel
            activeTab={activeTab}
            onClose={() => setIsDevToolsOpen(false)}
          />
        )}
      </div>

      {/* 6. Debian Linux Real-Time Status & Performance Bar */}
      {settings.showDebianStats && (
        <footer
          id="fenix-status-bar"
          className="h-7 px-3 bg-slate-200/90 dark:bg-zinc-950 border-t border-slate-300 dark:border-zinc-800/80 flex items-center justify-between text-[10.5px] select-none text-slate-600 dark:text-slate-400 font-mono shrink-0 z-10"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
              <span>🔥</span>
              <span>Fénix • Debian 12</span>
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-500" />
              <span>RAM Total:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">
                {totalRAM.toFixed(1)} MB
              </strong>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:flex items-center gap-1">
              <Shield className="w-3 h-3 text-red-500" />
              <span>FénixShield:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {activeTab.shieldStats?.blockedAds || 0} bloqueados
              </span>
            </span>
            <span className="hidden lg:inline text-slate-400">|</span>
            <button
              onClick={() => setIsTorModalOpen(true)}
              className="hidden lg:flex items-center gap-1 hover:text-purple-400 transition-colors cursor-pointer"
              title="Circuito Tor v3"
            >
              <span>🧅</span>
              <span className="text-purple-400 font-mono font-bold">Tor IP: {circuitState.currentIp}</span>
              <span className="text-[10px] text-slate-400">({circuitState.selectedLocation?.countryCode || 'Tor'})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTorModalOpen(true)}
              className="text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 font-semibold"
              title="Cambiar IP / Servidor Tor"
            >
              <span>🧅</span>
              <span>Cambiar IP</span>
            </button>
            <button
              onClick={() => setIsDevToolsOpen((prev) => !prev)}
              className="hover:text-red-600 dark:hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-slate-300 dark:hover:bg-zinc-800 transition-colors"
              title="Abrir DevTools (F12)"
            >
              DevTools [F12]
            </button>
            <button
              onClick={() => setIsDebianExportOpen(true)}
              className="hover:text-red-600 dark:hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-slate-300 dark:hover:bg-zinc-800 transition-colors font-bold"
            >
              Descargar .deb
            </button>
          </div>
        </footer>
      )}

      {/* 7. Chrome 3-Dots Dropdown Menu */}
      {isMenuOpen && (
        <ChromeMenu
          zoomLevel={activeTab.zoomLevel || 100}
          onNewTab={handleNewTab}
          onNavigate={(url) => navigateTab(url)}
          onZoomIn={() =>
            setTabs(
              tabs.map((t) =>
                t.id === activeTabId
                  ? { ...t, zoomLevel: Math.min(200, (t.zoomLevel || 100) + 10) }
                  : t
              )
            )
          }
          onZoomOut={() =>
            setTabs(
              tabs.map((t) =>
                t.id === activeTabId
                  ? { ...t, zoomLevel: Math.max(50, (t.zoomLevel || 100) - 10) }
                  : t
              )
            )
          }
          onResetZoom={() =>
            setTabs(
              tabs.map((t) => (t.id === activeTabId ? { ...t, zoomLevel: 100 } : t))
            )
          }
          onToggleFullscreen={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          onOpenFindInPage={() => setIsFindInPageOpen(true)}
          onOpenTaskManager={() => navigateTab('chrome://tasks')}
          onOpenDevTools={() => setIsDevToolsOpen(true)}
          onOpenDebianSetup={() => setIsDebianExportOpen(true)}
          onOpenTorCircuit={() => setIsTorModalOpen(true)}
          onClose={() => setIsMenuOpen(false)}
        />
      )}

      {/* 8. Shields Privacy Dialog */}
      {isShieldsOpen && (
        <ShieldsPopup
          url={activeTab.url}
          shieldStats={activeTab.shieldStats}
          shieldEnabled={settings.adblockEnabled}
          circuitState={circuitState}
          onToggleShield={() =>
            setSettings((prev) => ({
              ...prev,
              adblockEnabled: !prev.adblockEnabled,
            }))
          }
          onOpenTorCircuit={() => setIsTorModalOpen(true)}
          onClose={() => setIsShieldsOpen(false)}
        />
      )}

      {/* 9. Tor Circuit & IP Changer Modal */}
      {isTorModalOpen && (
        <TorCircuitModal
          circuitState={circuitState}
          onSwitchIp={handleSwitchTorIp}
          onToggleTor={handleToggleTor}
          onClose={() => setIsTorModalOpen(false)}
        />
      )}

      {/* 10. QR Code Modal */}
      {isQrCodeOpen && (
        <QrCodeModal
          url={activeTab.url}
          onClose={() => setIsQrCodeOpen(false)}
        />
      )}

      {/* 11. Debian Export & Setup Modal */}
      {isDebianExportOpen && (
        <DebianExportModal
          onClose={() => setIsDebianExportOpen(false)}
          onTriggerDownloadDeb={handleDownloadDebianPackage}
        />
      )}

      {/* 12. AI Copilot Modal */}
      {isAiCopilotOpen && (
        <AiCopilotModal
          title={activeTab.title}
          url={activeTab.url}
          plainText={activeTab.pageContent?.plainText}
          onClose={() => setIsAiCopilotOpen(false)}
        />
      )}
    </div>
  );
}
