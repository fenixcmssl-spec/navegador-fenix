'use client';

import React, { useState } from 'react';
import { HistoryItem } from '@/types/browser';
import { History, Trash2, Search, Calendar, Globe, Clock, ShieldCheck } from 'lucide-react';

interface HistoryPageProps {
  history: HistoryItem[];
  onNavigate: (url: string) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: (range: 'hour' | 'day' | 'all') => void;
}

export default function HistoryPage({
  history,
  onNavigate,
  onDeleteItem,
  onClearHistory,
}: HistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);

  const filtered = history.filter(
    (h) =>
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="aerochrome-history-page" className="max-w-4xl mx-auto p-6 md:p-10 text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Historial de Navegación</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {history.length} visitas registradas (almacenamiento local ligero)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowClearModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white transition-colors text-xs font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Borrar Datos de Navegación</span>
        </button>
      </div>

      {/* Search History */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en el historial..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Clear History Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold mb-2">Borrar Historial de Navegación</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Selecciona el intervalo de tiempo para purgar el historial y liberar caché:
            </p>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => {
                  onClearHistory('hour');
                  setShowClearModal(false);
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-red-500 text-xs font-semibold flex items-center justify-between"
              >
                <span>Última hora</span>
                <span className="text-[10px] text-slate-400">Rápido</span>
              </button>

              <button
                onClick={() => {
                  onClearHistory('day');
                  setShowClearModal(false);
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-red-500 text-xs font-semibold flex items-center justify-between"
              >
                <span>Últimas 24 horas</span>
                <span className="text-[10px] text-slate-400">Recomendado</span>
              </button>

              <button
                onClick={() => {
                  onClearHistory('all');
                  setShowClearModal(false);
                }}
                className="w-full text-left p-3 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center justify-between"
              >
                <span>Desde el principio (Todo el historial)</span>
                <span className="text-[10px] text-red-400">Limpieza total</span>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Items Grouped */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl divide-y divide-slate-100 dark:divide-zinc-800/60 overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <span>Historial limpio o sin coincidencias de búsqueda.</span>
          </div>
        ) : (
          filtered.map((item) => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.url)}
                className="p-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="text-[11px] font-mono text-slate-400 w-12 shrink-0">
                    {timeStr}
                  </div>
                  <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-xs">
                    {item.favicon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.favicon} alt="" className="w-3.5 h-3.5 rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <Globe className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      {item.url}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500">
                    {item.visitCount} {item.visitCount === 1 ? 'visita' : 'visitas'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-950 text-slate-400 hover:text-red-600"
                    title="Eliminar del historial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
