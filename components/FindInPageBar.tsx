'use client';

import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';

interface FindInPageBarProps {
  onClose: () => void;
}

export default function FindInPageBar({ onClose }: FindInPageBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (!val.trim()) {
      setMatchCount(0);
      setCurrentMatch(0);
    } else {
      // Deterministic match simulation based on length
      const count = Math.max(1, (val.length * 3) % 8 + 1);
      setMatchCount(count);
      setCurrentMatch(1);
    }
  };

  return (
    <div
      id="aerochrome-find-bar"
      className="absolute top-2 right-6 z-40 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl px-3 py-1.5 flex items-center gap-2 text-xs text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-1"
    >
      <Search className="w-3.5 h-3.5 text-slate-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Buscar en la página..."
        className="w-36 sm:w-48 bg-transparent text-xs focus:outline-none"
        autoFocus
      />

      {searchTerm && (
        <span className="text-[11px] font-mono text-slate-400">
          {currentMatch}/{matchCount}
        </span>
      )}

      <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-zinc-700 pl-1">
        <button
          onClick={() => setCurrentMatch((prev) => (prev > 1 ? prev - 1 : matchCount))}
          className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded text-slate-500"
          title="Anterior"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setCurrentMatch((prev) => (prev < matchCount ? prev + 1 : 1))}
          className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded text-slate-500"
          title="Siguiente"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded text-slate-500 hover:text-red-500"
          title="Cerrar (Esc)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
