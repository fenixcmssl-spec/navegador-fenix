'use client';

import React from 'react';
import { Bookmark } from '@/types/browser';
import { Globe, Folder, Plus } from 'lucide-react';

interface BookmarksBarProps {
  bookmarks: Bookmark[];
  onNavigate: (url: string) => void;
  onOpenBookmarksManager: () => void;
  isIncognito?: boolean;
}

export default function BookmarksBar({
  bookmarks,
  onNavigate,
  onOpenBookmarksManager,
  isIncognito = false,
}: BookmarksBarProps) {
  return (
    <div
      id="aerochrome-bookmarks-bar"
      className={`w-full flex items-center gap-1.5 px-3 py-1 border-b text-[11px] select-none overflow-x-auto no-scrollbar transition-colors ${
        isIncognito
          ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
          : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300'
      }`}
    >
      {/* Debian Apps shortcut button */}
      <button
        onClick={() => onNavigate('chrome://debian-setup')}
        className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors font-semibold text-red-600 dark:text-red-400 shrink-0"
      >
        <span>🌀</span>
        <span>Debian Apps</span>
      </button>

      <div className="w-[1px] h-3 bg-slate-300 dark:bg-zinc-700 mx-1 shrink-0" />

      {/* Bookmarks list */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
        {bookmarks.slice(0, 10).map((bm) => (
          <button
            key={bm.id}
            onClick={() => onNavigate(bm.url)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors max-w-[150px] truncate shrink-0 group"
            title={`${bm.title}\n${bm.url}`}
          >
            <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
              {bm.favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bm.favicon}
                  alt=""
                  className="w-3.5 h-3.5 rounded-xs"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Globe className="w-3 h-3 text-slate-400" />
              )}
            </div>
            <span className="truncate group-hover:text-red-600 transition-colors">
              {bm.title}
            </span>
          </button>
        ))}
      </div>

      {/* All Bookmarks Manager button */}
      <button
        onClick={onOpenBookmarksManager}
        className="text-[10px] text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 shrink-0 font-medium ml-auto"
      >
        Todos los marcadores →
      </button>
    </div>
  );
}
