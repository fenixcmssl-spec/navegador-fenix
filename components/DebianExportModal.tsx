'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Download,
  Copy,
  Check,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FenixLogo from './FenixLogo';

interface DebianExportModalProps {
  onClose: () => void;
  onTriggerDownloadDeb: () => void;
}

export default function DebianExportModal({
  onClose,
  onTriggerDownloadDeb,
}: DebianExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [originUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://ais-dev-juvckr26kyoownai5a3xyg-857085136644.europe-west2.run.app';
  });
  const [tab, setTab] = useState<'curl' | 'dpkg' | 'gui'>('curl');

  const curlCommand = `curl -fsSL ${originUrl}/install.sh | sudo bash`;
  const dpkgCommand = `wget -O fenix.deb ${originUrl}/api/download/deb && sudo dpkg -i fenix.deb || sudo apt-get install -f -y`;

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    onTriggerDownloadDeb();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <FenixLogo size={42} showGlow={true} />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Instalar Fénix Navegador en Linux</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-mono font-bold">
                  .deb
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paquete nativo ultraligero (~896 KB) con Tor y Adblock para Debian y derivados
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits reminder */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/50">
            <div className="font-bold text-red-600 dark:text-red-400 text-sm font-mono">
              ~35 MB
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Memoria RAM</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/50">
            <div className="font-bold text-purple-600 dark:text-purple-400 text-sm font-mono">
              🧅 Tor Onion
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">IP Anónima</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/50">
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
              🛡️ Adblock
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">0 Publicidad</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/80 mb-4 text-xs font-semibold">
          <button
            onClick={() => setTab('curl')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === 'curl'
                ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            1. Terminal (1 Clic)
          </button>
          <button
            onClick={() => setTab('dpkg')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === 'dpkg'
                ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            2. Terminal (DPKG)
          </button>
          <button
            onClick={() => setTab('gui')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === 'gui'
                ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            3. Descarga (.deb)
          </button>
        </div>

        {/* Terminal APT command */}
        {tab === 'curl' && (
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-slate-100 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Pega en tu terminal de Debian / Linux:</span>
              </span>
              <button
                onClick={() => handleCopy(curlCommand)}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 transition-colors cursor-pointer font-bold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
              {curlCommand}
            </pre>
          </div>
        )}

        {tab === 'dpkg' && (
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-slate-100 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Comando wget + dpkg:</span>
              </span>
              <button
                onClick={() => handleCopy(dpkgCommand)}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 transition-colors cursor-pointer font-bold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
              {dpkgCommand}
            </pre>
          </div>
        )}

        {tab === 'gui' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 text-xs mb-6 space-y-2">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Instalación con doble clic:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-500 dark:text-slate-400">
              <li>Haz clic en el botón rojo inferior para descargar el archivo <code className="text-red-500">.deb</code>.</li>
              <li>Abre el archivo descargado con <b>Instalador de paquetes</b> o <b>GDebi</b>.</li>
              <li>Pulsa <b>Instalar paquete</b> e introduce tu contraseña.</li>
            </ol>
          </div>
        )}

        {/* Download direct .deb button */}
        <div className="space-y-3">
          <button
            id="btn-download-deb-pkg"
            onClick={handleDownload}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Paquete fenix-browser_1.0.0_amd64.deb</span>
          </button>
        </div>
      </div>
    </div>
  );
}
