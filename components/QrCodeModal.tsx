'use client';

import React, { useState } from 'react';
import { QrCode, X, Copy, Check, Share2 } from 'lucide-react';

interface QrCodeModalProps {
  url: string;
  onClose: () => void;
}

export default function QrCodeModal({ url, onClose }: QrCodeModalProps) {
  const [copied, setCopied] = useState(false);

  // Generate public QR code image url
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    url
  )}&bgcolor=ffffff&color=000000&margin=2`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
            <QrCode className="w-4 h-4 text-red-600" />
            <span>Compartir enlace con código QR</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block mb-4 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt="Código QR de la URL"
            className="w-48 h-48 mx-auto"
            onError={(e) => {
              // Fallback placeholder if offline
              e.currentTarget.src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23374151">QR Code</text></svg>';
            }}
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate px-2 mb-4">
          {url}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Enlace copiado' : 'Copiar enlace'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
