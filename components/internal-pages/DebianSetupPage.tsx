'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Package,
  Download,
  Copy,
  Check,
  Layers,
  Laptop,
  Play,
  RotateCcw,
  CheckCircle2,
  Monitor,
  Github,
  GitBranch,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FenixLogo from '../FenixLogo';

interface DebianSetupPageProps {
  onTriggerDownloadDeb: () => void;
}

export default function DebianSetupPage({ onTriggerDownloadDeb }: DebianSetupPageProps) {
  const [originUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://ais-pre-juvckr26kyoownai5a3xyg-857085136644.europe-west2.run.app';
  });

  const [githubRepo, setGithubRepo] = useState('fenixcmssl-spec/navegador-fenix');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeInstallTab, setActiveInstallTab] = useState<'curl' | 'dpkg' | 'gui' | 'github_source' | 'apt'>('curl');
  
  // Terminal Simulator State
  const [simRunning, setSimRunning] = useState(false);
  const [, setSimStep] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // GitHub-powered commands
  const cleanRepo = githubRepo.trim() || 'fenixcmssl-spec/navegador-fenix';
  const curlGithubCommand = `curl -fsSL https://raw.githubusercontent.com/${cleanRepo}/main/install.sh | sudo bash`;

  const dpkgGithubCommand = `# 1. Descargar paquete compilado oficial .deb desde tu GitHub
wget -O fenix-browser.deb https://github.com/${cleanRepo}/releases/latest/download/fenix-browser_1.0.0_amd64.deb \\
  || wget -O fenix-browser.deb https://raw.githubusercontent.com/${cleanRepo}/main/public/fenix-browser_1.0.0_amd64.deb

# 2. Instalar con dpkg y resolver dependencias del sistema
sudo dpkg -i fenix-browser.deb || sudo apt-get install -f -y

# 3. Iniciar Fénix Navegador
fenix-browser`;

  const githubCloneCommand = `# 1. Clonar tu repositorio oficial de GitHub
git clone https://github.com/${cleanRepo}.git
cd fenix-browser

# 2. Instalar dependencias e iniciar
npm install
npm run build
npm start`;

  const aptRepoCommand = `# 1. Añadir el repositorio oficial a /etc/apt/sources.list.d
echo "deb [trusted=yes] ${originUrl}/debian stable main" | sudo tee /etc/apt/sources.list.d/fenix.list

# 2. Actualizar e instalar con APT
sudo apt update
sudo apt install -y fenix-browser`;

  const runTerminalSimulator = () => {
    if (simRunning) return;
    setSimRunning(true);
    setSimStep(1);
    setSimLogs([
      `$ ${curlGithubCommand}`,
      `🔥 Conectando con GitHub: https://raw.githubusercontent.com/${cleanRepo}/main/...`,
    ]);

    const steps = [
      { delay: 600, log: '📦 [1/4] Comprobando dependencias de Debian / Ubuntu (libc6, python3, webengine)...' },
      { delay: 1200, log: '✓ Paquetes esenciales verificados en el sistema.' },
      { delay: 1800, log: `⬇️ [2/4] Descargando fenix-browser_1.0.0_amd64.deb desde GitHub Releases... [####################] 100%` },
      { delay: 2400, log: '⚙️ [3/4] Desempaquetando e instalando con dpkg...' },
      { delay: 3000, log: '✓ Registrado binario en /usr/bin/fenix-browser y alias /usr/bin/fenix' },
      { delay: 3400, log: '✓ Creado acceso directo /usr/share/applications/fenix-browser.desktop' },
      { delay: 3800, log: '✓ Icono de alta resolución instalado en /usr/share/icons/hicolor/512x512/apps/' },
      { delay: 4200, log: '✨ [4/4] Configuración y registro MIME finalizados con éxito.' },
      { delay: 4600, log: '🎉 ¡Fénix Navegador instalado desde GitHub! Ejecuta "fenix-browser" en tu terminal.' },
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setSimLogs((prev) => [...prev, s.log]);
        setSimStep(idx + 2);
        if (idx === steps.length - 1) {
          setSimRunning(false);
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          } catch {}
        }
      }, s.delay);
    });
  };

  const handleDownloadDeb = () => {
    onTriggerDownloadDeb();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleDownloadScript = () => {
    const a = document.createElement('a');
    a.href = '/install.sh';
    a.download = 'install.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="fenix-debiansetup-page" className="max-w-4xl mx-auto p-6 md:p-10 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800 mb-8">
        <div className="flex items-center gap-3.5">
          <FenixLogo size={46} showGlow={true} />
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Instalador GitHub para Linux / Debian</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 font-mono font-bold border border-red-500/20">
                v1.0.0
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instala Fénix Navegador directamente desde tu repositorio de GitHub mediante terminal o instalador gráfico
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadDeb}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar .deb (896 KB)</span>
          </button>
        </div>
      </div>

      {/* GitHub Repository Selector Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 text-white mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Repositorio GitHub Oficial:</div>
              <div className="text-[11px] text-slate-400">Los comandos de instalación se actualizan automáticamente</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">github.com/</span>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              placeholder="tu-usuario/fenix-browser"
              className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-red-500 w-60"
            />
          </div>
        </div>
      </div>

      {/* Quick Specs Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-center text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="font-mono font-bold text-red-600 dark:text-red-400 text-base">~35 MB</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Consumo RAM</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="font-mono font-bold text-purple-600 dark:text-purple-400 text-base">🧅 Tor v3</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Enrutamiento Anónimo</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">🛡️ FénixShield</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">0 Rastreadores</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">&lt; 0.2s</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Arranque Nativo</div>
        </div>
      </div>

      {/* Interactive Tabs for Installation Methods */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveInstallTab('curl')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeInstallTab === 'curl'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. Terminal GitHub (1 Línea)</span>
          </button>

          <button
            onClick={() => setActiveInstallTab('dpkg')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeInstallTab === 'dpkg'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>2. Terminal con DPKG (GitHub)</span>
          </button>

          <button
            onClick={() => setActiveInstallTab('gui')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeInstallTab === 'gui'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>3. Instalador Gráfico (GDebi)</span>
          </button>

          <button
            onClick={() => setActiveInstallTab('github_source')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeInstallTab === 'github_source'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>4. Clonar Código Fuente</span>
          </button>

          <button
            onClick={() => setActiveInstallTab('apt')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeInstallTab === 'apt'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. Repositorio APT</span>
          </button>
        </div>

        {/* Tab 1: Curl 1-Line from GitHub */}
        {activeInstallTab === 'curl' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Abre tu terminal (<kbd className="font-mono font-bold text-slate-800 dark:text-slate-200">Ctrl + Alt + T</kbd>) y pega el comando directo de tu GitHub:
              </div>
              <button
                onClick={() => copyToClipboard(curlGithubCommand, 'curl_github')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
              >
                {copiedKey === 'curl_github' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'curl_github' ? '¡Copiado!' : 'Copiar comando'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {curlGithubCommand}
            </pre>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>¿Cómo funciona este comando con tu GitHub?</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 ml-1">
                <li>Descarga directamente el script <code>install.sh</code> desde tu repositorio público en GitHub.</li>
                <li>Obtiene el paquete <code>.deb</code> compilado desde tus Releases o desde el repositorio.</li>
                <li>Registra el ejecutable <code>fenix-browser</code> y el acceso directo de escritorio automáticamente.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: DPKG GitHub style */}
        {activeInstallTab === 'dpkg' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Instalación estándar por terminal descargando el paquete desde GitHub:
              </div>
              <button
                onClick={() => copyToClipboard(dpkgGithubCommand, 'dpkg_github')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
              >
                {copiedKey === 'dpkg_github' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'dpkg_github' ? '¡Copiado!' : 'Copiar comando'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {dpkgGithubCommand}
            </pre>
          </div>
        )}

        {/* Tab 3: GUI Package Manager */}
        {activeInstallTab === 'gui' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Instalación visual en Debian / Ubuntu con <b>Instalador de Paquetes (GDebi / GNOME Software)</b>:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div className="font-bold">Descarga el .deb</div>
                <button
                  onClick={handleDownloadDeb}
                  className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar paquete .deb</span>
                </button>
                <div className="text-[10px] text-slate-400 text-center">
                  O desde <code>github.com/{cleanRepo}/releases</code>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div className="font-bold">Abre con el Instalador</div>
                <p className="text-[11px] text-slate-500">
                  Haz clic derecho sobre <code className="text-red-500">fenix-browser_1.0.0_amd64.deb</code> &rarr; <b>Abrir con Instalador de Paquetes</b> (o GDebi).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div className="font-bold">Pulsa &quot;Instalar&quot;</div>
                <p className="text-[11px] text-slate-500">
                  Introduce tu contraseña de usuario y Fénix aparecerá en el menú de aplicaciones de Debian / Ubuntu listo para navegar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Clone source */}
        {activeInstallTab === 'github_source' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Clonar y ejecutar directamente desde el código fuente de GitHub:
              </div>
              <button
                onClick={() => copyToClipboard(githubCloneCommand, 'clone_source')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
              >
                {copiedKey === 'clone_source' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'clone_source' ? '¡Copiado!' : 'Copiar comando'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {githubCloneCommand}
            </pre>
          </div>
        )}

        {/* Tab 5: APT Repo */}
        {activeInstallTab === 'apt' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Añadir repositorio para actualizaciones automáticas con <code className="text-red-500 font-mono">apt upgrade</code>:
              </div>
              <button
                onClick={() => copyToClipboard(aptRepoCommand, 'apt')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
              >
                {copiedKey === 'apt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'apt' ? '¡Copiado!' : 'Copiar comando'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {aptRepoCommand}
            </pre>
          </div>
        )}
      </div>

      {/* Interactive Terminal Simulator */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 text-slate-100 p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2">
              usuario@debian:~$ simulador-instalador-github
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runTerminalSimulator}
              disabled={simRunning}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                simRunning
                  ? 'bg-zinc-800 text-slate-500'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
              }`}
            >
              {simRunning ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{simRunning ? 'Instalando desde GitHub...' : 'Simular Instalación en Vivo'}</span>
            </button>
          </div>
        </div>

        <div className="bg-black/80 rounded-2xl p-4 font-mono text-xs space-y-1.5 min-h-[160px] text-emerald-400/90 leading-relaxed border border-zinc-900 overflow-x-auto">
          {simLogs.length === 0 ? (
            <div className="text-slate-500 italic py-6 text-center">
              Haz clic en &quot;Simular Instalación en Vivo&quot; para probar el instalador de tu GitHub en tiempo real.
            </div>
          ) : (
            simLogs.map((log, i) => (
              <div
                key={i}
                className={
                  log.startsWith('$')
                    ? 'text-white font-bold'
                    : log.includes('🎉') || log.includes('✓')
                    ? 'text-emerald-300 font-bold'
                    : log.includes('🔥')
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))
          )}
          {simRunning && (
            <div className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1 align-middle" />
          )}
        </div>
      </div>

      {/* Package Formats Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">Paquete Binario (.deb)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Paquete compilado amd64 con dependencias y entrada desktop completa.
            </p>
          </div>
          <button
            onClick={handleDownloadDeb}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar .deb (896 KB)</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">Script Bash (install.sh)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Instalador desatendido para servidores o terminal sin interfaz gráfica.
            </p>
          </div>
          <button
            onClick={handleDownloadScript}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar install.sh</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm mb-1">Repositorio APT Directo</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Añade el origen para actualizaciones continuas con <code>apt-get upgrade</code>.
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(aptRepoCommand, 'apt-card')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copiedKey === 'apt-card' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'apt-card' ? '¡Copiado!' : 'Copiar comando APT'}</span>
          </button>
        </div>
      </div>

      {/* Linux Keyboard Shortcuts Cheat Sheet */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Laptop className="w-4 h-4 text-red-500" />
          <span>Atajos de Teclado Nativos en Debian (Iguales a Google Chrome)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
            <span className="text-slate-700 dark:text-slate-300">Nueva Pestaña</span>
            <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-[11px] font-bold">
              Ctrl + T
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
            <span className="text-slate-700 dark:text-slate-300">Cerrar Pestaña</span>
            <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-[11px] font-bold">
              Ctrl + W
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
            <span className="text-slate-700 dark:text-slate-300">Ventana Incógnito</span>
            <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-[11px] font-bold">
              Ctrl + Shift + N
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
            <span className="text-slate-700 dark:text-slate-300">Enfocar Barra de Direcciones</span>
            <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-[11px] font-bold">
              Ctrl + L / Alt + D
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
            <span className="text-slate-700 dark:text-slate-300">Historial de Navegación</span>
            <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-[11px] font-bold">
              Ctrl + H
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
            <span className="text-slate-700 dark:text-slate-300">Descargas</span>
            <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-[11px] font-bold">
              Ctrl + J
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
            <span className="text-slate-700 dark:text-slate-300">Inspeccionar / DevTools</span>
            <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-[11px] font-bold">
              F12 / Ctrl + Shift + I
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
            <span className="text-slate-700 dark:text-slate-300">Circuito Tor & Cambiar IP</span>
            <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-[11px] font-bold">
              Ctrl + Shift + U
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
