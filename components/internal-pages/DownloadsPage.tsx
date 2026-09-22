'use client';

import React, { useState } from 'react';
import { DownloadItem } from '@/types/browser';
import {
  Download,
  FileCheck,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  FolderOpen,
  Search,
  FileCode,
  Package,
  HardDrive,
} from 'lucide-react';

interface DownloadsPageProps {
  downloads: DownloadItem[];
  onStartDebianDownload: () => void;
  onDeleteDownload: (id: string) => void;
  onClearAllDownloads: () => void;
}

export default function DownloadsPage({
  downloads,
  onStartDebianDownload,
  onDeleteDownload,
  onClearAllDownloads,
}: DownloadsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = downloads.filter((d) =>
    d.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenLocalFile = (item: DownloadItem) => {
    // If it has blobData, trigger standard browser download
    if (item.blobData) {
      const blob = new Blob([item.blobData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert(`Archivo '${item.fileName}' listo en el directorio ~/Descargas de Debian.`);
    }
  };

  return (
    <div id="aerochrome-downloads-page" className="max-w-4xl mx-auto p-6 md:p-10 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Descargas</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gestor de archivos descargados con acelerador multihilo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartDebianDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Descargar .deb (Debian)</span>
          </button>
          {downloads.length > 0 && (
            <button
              onClick={onClearAllDownloads}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar lista</span>
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en descargas..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Downloads List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <FolderOpen className="w-10 h-10 text-slate-300 dark:text-zinc-700" />
            <p>No hay descargas activas o archivadas.</p>
            <button
              onClick={onStartDebianDownload}
              className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-semibold"
            >
              Generar y descargar paquete para Debian Linux
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                    {item.fileName.endsWith('.deb') ? (
                      <Package className="w-5 h-5" />
                    ) : (
                      <FileCheck className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.fileName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.fileSize} • {item.speed} • {item.status === 'completed' ? 'Completada' : 'Descargando...'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenLocalFile(item)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-medium text-slate-700 dark:text-slate-200"
                  >
                    Guardar / Abrir
                  </button>
                  <button
                    onClick={() => onDeleteDownload(item.id)}
                    className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-600"
                    title="Eliminar de la lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    item.status === 'completed' ? 'bg-emerald-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
