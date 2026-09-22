'use client';

import React, { useState } from 'react';
import { ConsoleLog, NetworkRequest, Tab } from '@/types/browser';
import {
  Code,
  Terminal,
  Activity,
  Layers,
  Shield,
  X,
  Play,
  Trash2,
  HardDrive,
  Cpu,
  RefreshCw,
  Search,
} from 'lucide-react';

interface DevToolsPanelProps {
  activeTab: Tab;
  onClose: () => void;
}

export default function DevToolsPanel({ activeTab, onClose }: DevToolsPanelProps) {
  const [activeTabName, setActiveTabName] = useState<'elements' | 'console' | 'network' | 'memory' | 'security'>('elements');
  const [consoleInput, setConsoleInput] = useState('');
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: 'l-1',
      type: 'info',
      message: 'Fénix DevTools v1.0 initialized (Debian Linux V8 Engine)',
      timestamp: '00:00.01',
    },
    {
      id: 'l-2',
      type: 'log',
      message: `Navigated to ${activeTab.url}`,
      timestamp: '00:00.04',
    },
    {
      id: 'l-3',
      type: 'info',
      message: `FénixShield: Blocked ${activeTab.shieldStats?.blockedAds || 4} tracking requests.`,
      timestamp: '00:00.12',
    },
  ]);

  const networkRequests: NetworkRequest[] = [
    {
      id: 'req-1',
      url: activeTab.url,
      method: 'GET',
      status: 200,
      type: 'document',
      size: '14.2 KB',
      time: '28 ms',
    },
    {
      id: 'req-2',
      url: `${activeTab.url}/styles.css`,
      method: 'GET',
      status: 200,
      type: 'stylesheet',
      size: '8.4 KB',
      time: '12 ms',
    },
    {
      id: 'req-3',
      url: `${activeTab.url}/bundle.js`,
      method: 'GET',
      status: 200,
      type: 'script',
      size: '32.1 KB',
      time: '34 ms',
    },
    {
      id: 'req-4',
      url: 'https://telemetry.tracker.com/track',
      method: 'POST',
      status: 0,
      type: 'blocked (FénixShield)',
      size: '0 B',
      time: '0 ms',
    },
  ];

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const input = consoleInput.trim();
    let result = '';
    let type: ConsoleLog['type'] = 'log';

    try {
      // Safe quick evaluation
      if (input === 'navigator.userAgent') {
        result = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) FenixBrowser/1.0.0 Debian/12';
      } else if (input === 'window.location.href' || input === 'location.href') {
        result = activeTab.url;
      } else if (input === 'document.title') {
        result = activeTab.title;
      } else if (input === 'memory') {
        result = `RAM: ${(activeTab.memoryMB || 24).toFixed(1)} MB | Total Tabs: 1`;
      } else {
        const runExpression = new Function(`"use strict"; return (${input});`);
        const evaluated = runExpression();
        result = typeof evaluated === 'object' ? JSON.stringify(evaluated) : String(evaluated);
      }
    } catch (err: unknown) {
      result = err instanceof Error ? err.message : String(err);
      type = 'error';
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `l-user-${Date.now()}`,
        type: 'log',
        message: `> ${input}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
      {
        id: `l-res-${Date.now()}`,
        type,
        message: result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ]);
    setConsoleInput('');
  };

  return (
    <div
      id="fenix-devtools-drawer"
      className="w-full h-72 border-t border-slate-300 dark:border-zinc-800 bg-[#1e1e1e] text-slate-200 flex flex-col font-mono text-xs shadow-2xl select-none z-30"
    >
      {/* DevTools Top Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#252526] border-b border-[#333333] shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-red-500 font-bold mr-2 text-[11px] flex items-center gap-1">
            <span>🔥</span>
            <span className="hidden sm:inline">FénixDevTools</span>
          </span>

          <button
            onClick={() => setActiveTabName('elements')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTabName === 'elements'
                ? 'bg-[#37373d] text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#2d2d30]'
            }`}
          >
            Elements
          </button>

          <button
            onClick={() => setActiveTabName('console')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTabName === 'console'
                ? 'bg-[#37373d] text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#2d2d30]'
            }`}
          >
            <span>Console</span>
            {logs.some((l) => l.type === 'error') && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTabName('network')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTabName === 'network'
                ? 'bg-[#37373d] text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#2d2d30]'
            }`}
          >
            Network
          </button>

          <button
            onClick={() => setActiveTabName('memory')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTabName === 'memory'
                ? 'bg-[#37373d] text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#2d2d30]'
            }`}
          >
            Memory (RAM)
          </button>

          <button
            onClick={() => setActiveTabName('security')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTabName === 'security'
                ? 'bg-[#37373d] text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#2d2d30]'
            }`}
          >
            Security
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 font-mono">
            V8 Lite • {(activeTab.memoryMB || 24).toFixed(1)} MB
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#37373d] rounded text-slate-400 hover:text-white"
            title="Cerrar DevTools (F12)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DevTools Content Body */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed">
        {/* TAB 1: ELEMENTS */}
        {activeTabName === 'elements' && (
          <div className="space-y-1 text-slate-300">
            <div className="text-slate-500">&lt;!DOCTYPE html&gt;</div>
            <div className="pl-2">
              <span className="text-purple-400">&lt;html</span> <span className="text-amber-300">lang</span>=<span className="text-emerald-300">&quot;es&quot;</span><span className="text-purple-400">&gt;</span>
            </div>
            <div className="pl-4">
              <span className="text-purple-400">&lt;head&gt;</span>
              <div className="pl-4 text-slate-400">
                &lt;meta charset=&quot;utf-8&quot;&gt;<br />
                &lt;title&gt;{activeTab.title}&lt;/title&gt;<br />
                &lt;meta name=&quot;generator&quot; content=&quot;Fénix Navegador Debian Lite&quot;&gt;
              </div>
              <span className="text-purple-400">&lt;/head&gt;</span>
            </div>
            <div className="pl-4">
              <span className="text-purple-400">&lt;body</span> <span className="text-amber-300">class</span>=<span className="text-emerald-300">&quot;fenix-optimized-render&quot;</span><span className="text-purple-400">&gt;</span>
              <div className="pl-4 p-2 my-1 rounded bg-[#2a2d2e] border border-blue-500/30 text-blue-300">
                &lt;main id=&quot;fenix-view&quot; data-url=&quot;{activeTab.url}&quot;&gt;
                <div className="pl-4 text-slate-300">
                  {/* Content node preview */}
                  &lt;h1 class=&quot;title&quot;&gt;{activeTab.title}&lt;/h1&gt;
                </div>
                &lt;/main&gt;
              </div>
              <span className="text-purple-400">&lt;/body&gt;</span>
            </div>
            <div className="pl-2 text-purple-400">&lt;/html&gt;</div>
          </div>
        )}

        {/* TAB 2: CONSOLE */}
        {activeTabName === 'console' && (
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-1.5 overflow-y-auto mb-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-1.5 rounded flex items-start gap-2 ${
                    log.type === 'error'
                      ? 'bg-red-950/60 text-red-300 border-l-2 border-red-500'
                      : log.type === 'info'
                      ? 'text-blue-300'
                      : 'text-slate-200'
                  }`}
                >
                  <span className="text-slate-500 text-[10px] shrink-0 font-mono">
                    [{log.timestamp}]
                  </span>
                  <span className="break-all">{log.message}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleConsoleSubmit} className="flex items-center gap-2 pt-2 border-t border-[#333333]">
              <span className="text-blue-400 font-bold">&gt;</span>
              <input
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder="Ejecutar JavaScript (ej: document.title, location.href, 2 + 2, navigator.userAgent)..."
                className="w-full bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={() => setLogs([])}
                className="p-1 hover:bg-[#37373d] rounded text-slate-400 hover:text-white shrink-0"
                title="Limpiar consola"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: NETWORK */}
        {activeTabName === 'network' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-500 border-b border-[#333333] pb-1">
                <tr>
                  <th className="pb-1">Recurso / URL</th>
                  <th className="pb-1">Estado</th>
                  <th className="pb-1">Tipo</th>
                  <th className="pb-1">Tamaño</th>
                  <th className="pb-1">Tiempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {networkRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-[#252526]">
                    <td className="py-1.5 max-w-[200px] truncate text-slate-200">{r.url}</td>
                    <td className="py-1.5 font-bold">
                      {r.status === 200 ? (
                        <span className="text-emerald-400">200 OK</span>
                      ) : (
                        <span className="text-red-400">BLOQUEADO</span>
                      )}
                    </td>
                    <td className="py-1.5 text-slate-400">{r.type}</td>
                    <td className="py-1.5 text-slate-300 font-mono">{r.size}</td>
                    <td className="py-1.5 text-amber-400 font-mono">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: MEMORY */}
        {activeTabName === 'memory' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#252526] border border-[#333333]">
                <div className="text-slate-400 text-[10px]">V8 JavaScript Heap</div>
                <div className="text-emerald-400 text-base font-bold font-mono">11.4 MB</div>
              </div>
              <div className="p-3 rounded-xl bg-[#252526] border border-[#333333]">
                <div className="text-slate-400 text-[10px]">DOM & Render Tree</div>
                <div className="text-emerald-400 text-base font-bold font-mono">6.8 MB</div>
              </div>
              <div className="p-3 rounded-xl bg-[#252526] border border-[#333333]">
                <div className="text-slate-400 text-[10px]">FénixShield Cache</div>
                <div className="text-emerald-400 text-base font-bold font-mono">2.2 MB</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs">
              ✓ Optimización para Debian Linux: Sin procesos de telemetría, asignador de memoria jemalloc activo.
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY */}
        {activeTabName === 'security' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
              <Shield className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-emerald-300">Conexión Segura Verificada</div>
                <div className="text-slate-400 text-[10px]">
                  Protocolo: TLS 1.3 | Cifrado: AES_256_GCM | Certificado: Debian CA Trust Store
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
