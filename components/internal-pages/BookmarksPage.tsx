'use client';

import React, { useState } from 'react';
import { Bookmark } from '@/types/browser';
import { Bookmark as BookmarkIcon, Plus, Trash2, ExternalLink, Search, Download, Upload, Star } from 'lucide-react';

interface BookmarksPageProps {
  bookmarks: Bookmark[];
  onNavigate: (url: string) => void;
  onAddBookmark: (bm: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  onDeleteBookmark: (id: string) => void;
  onImportBookmarks?: (bms: Bookmark[]) => void;
}

export default function BookmarksPage({
  bookmarks,
  onNavigate,
  onAddBookmark,
  onDeleteBookmark,
}: BookmarksPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    const cleanUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    onAddBookmark({
      title: newTitle,
      url: cleanUrl,
      tags: ['favorito'],
    });
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
  };

  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>AeroChrome Bookmarks</TITLE>
<H1>Marcadores de AeroChrome (Debian Linux)</H1>
<DL><p>
${bookmarks.map((b) => `  <DT><A HREF="${b.url}">${b.title}</A>`).join('\n')}
</DL><p>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aerochrome_bookmarks_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="aerochrome-bookmarks-page" className="max-w-4xl mx-auto p-6 md:p-10 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Administrador de Marcadores</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {bookmarks.length} sitios guardados en AeroChrome
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Marcador</span>
          </button>
          <button
            onClick={handleExportHTML}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-medium text-slate-700 dark:text-slate-300"
            title="Exportar archivo HTML estándar compatible con Chrome y Firefox"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar HTML</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar marcadores por nombre o URL..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Modal Add Bookmark */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold mb-4">Añadir Marcador</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">Título</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Debian Security Tracker"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">URL</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://security-tracker.debian.org"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
                >
                  Guardar Marcador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl divide-y divide-slate-100 dark:divide-zinc-800/60 overflow-hidden shadow-xs">
        {filteredBookmarks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No se encontraron marcadores con el término de búsqueda.
          </div>
        ) : (
          filteredBookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 flex items-center justify-between group transition-colors cursor-pointer"
              onClick={() => onNavigate(bm.url)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-xs">
                  {bm.favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bm.favicon} alt="" className="w-4 h-4 rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    '⭐'
                  )}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors">
                    {bm.title}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {bm.url}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(bm.url);
                  }}
                  className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Abrir en pestaña actual"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBookmark(bm.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-950 text-slate-400 hover:text-red-600"
                  title="Eliminar marcador"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
