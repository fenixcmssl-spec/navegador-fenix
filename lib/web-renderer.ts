import { SearchEngine, ShieldStats } from '@/types/browser';

export function normalizeUrl(input: string, searchEngine: SearchEngine = 'google'): string {
  const trimmed = input.trim();
  if (!trimmed) return 'chrome://newtab';

  // Check if it's an internal chrome:// URL
  if (trimmed.startsWith('chrome://') || trimmed.startsWith('about:')) {
    return trimmed;
  }

  // Check if it looks like a domain name (e.g. google.com, debian.org, localhost:3000, 192.168.1.1)
  const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  const localhostRegex = /^localhost(:\d+)?(\/.*)?$/;
  const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (domainRegex.test(trimmed) || localhostRegex.test(trimmed) || ipRegex.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // Otherwise, it's a search term
  return getSearchUrl(trimmed, searchEngine);
}

export function getSearchUrl(query: string, engine: SearchEngine): string {
  const encoded = encodeURIComponent(query);
  switch (engine) {
    case 'google':
      return `https://www.google.com/search?q=${encoded}`;
    case 'duckduckgo':
      return `https://duckduckgo.com/?q=${encoded}`;
    case 'bing':
      return `https://www.bing.com/search?q=${encoded}`;
    case 'ecosia':
      return `https://www.ecosia.org/search?q=${encoded}`;
    case 'searx':
      return `https://searx.be/search?q=${encoded}`;
    case 'brave':
      return `https://search.brave.com/search?q=${encoded}`;
    default:
      return `https://www.google.com/search?q=${encoded}`;
  }
}

export function extractDomain(url: string): string {
  try {
    if (url.startsWith('chrome://')) {
      return url.replace('chrome://', '').toUpperCase();
    }
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function isSecureUrl(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('chrome://');
}

export function simulateShieldStats(url: string): ShieldStats {
  if (url.startsWith('chrome://')) {
    return {
      blockedAds: 0,
      trackersBlocked: 0,
      httpsUpgraded: true,
      bandwidthSavedKB: 0,
      fingerprintsBlocked: 0,
    };
  }

  // Deterministic seed based on url length and chars
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const blockedAds = (positiveHash % 14) + 3;
  const trackersBlocked = (positiveHash % 9) + 2;
  const fingerprintsBlocked = (positiveHash % 4) + 1;
  const bandwidthSavedKB = blockedAds * 180 + trackersBlocked * 45;

  return {
    blockedAds,
    trackersBlocked,
    httpsUpgraded: true,
    bandwidthSavedKB,
    fingerprintsBlocked,
  };
}

export interface SimulatedPage {
  title: string;
  url: string;
  favicon?: string;
  author?: string;
  readTime?: string;
  description?: string;
  category?: string;
  contentHtml: string;
}

export const SIMULATED_SITES: Record<string, SimulatedPage> = {
  'debian.org': {
    title: 'Debian -- El sistema operativo universal',
    url: 'https://www.debian.org',
    favicon: 'https://www.debian.org/favicon.ico',
    author: 'Debian Project',
    readTime: '4 min',
    description: 'Debian es una distribución libre de Linux reconocida mundialmente por su estabilidad, seguridad y arquitectura abierta.',
    category: 'Sistemas Operativos',
    contentHtml: `
      <div class="debian-site max-w-4xl mx-auto py-8 px-4 text-slate-800 dark:text-slate-100">
        <div class="border-b border-red-500/30 pb-6 mb-8 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-4xl text-red-600">🌀</span>
            <div>
              <h1 class="text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">Debian GNU/Linux</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">El Sistema Operativo Universal</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-full text-xs font-semibold">
            Versión actual: Debian 12 "Bookworm"
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="p-5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <h3 class="font-bold text-lg mb-2 flex items-center gap-2 text-red-600">
              <span>🚀</span> Rendimiento Puro
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Consumo mínimo de recursos, ideal para portátiles, servidores y equipos de bajos recursos. Con AeroChrome, navega usando menos de 50MB de RAM.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <h3 class="font-bold text-lg mb-2 flex items-center gap-2 text-red-600">
              <span>🛡️</span> 100% Software Libre
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Más de 59,000 paquetes precompilados en formatos fáciles de instalar con soporte de seguridad a largo plazo (LTS).
            </p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <h3 class="font-bold text-lg mb-2 flex items-center gap-2 text-red-600">
              <span>💻</span> Instalación Rápida
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-mono text-xs bg-slate-900 text-emerald-400 p-3 rounded-lg mt-1">
              $ sudo apt update<br/>$ sudo apt install aerochrome
            </p>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-gradient-to-br from-red-600/10 to-rose-700/10 border border-red-500/20 mb-8">
          <h2 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">¿Por qué usar AeroChrome en Debian?</h2>
          <p class="text-slate-700 dark:text-slate-300 mb-4 text-sm leading-relaxed">
            Google Chrome oficial suele consumir más de 1.5 GB de memoria RAM debido a procesos duplicados de telemetría y extensiones pesadas. AeroChrome conserva toda la velocidad y compatibilidad de Chromium, pero elimina la telemetría invasiva, integra bloqueador nativo en C++ y utiliza aceleración gráfica ligera en Debian.
          </p>
          <div class="flex flex-wrap gap-2 text-xs font-mono">
            <span class="bg-red-500/20 text-red-700 dark:text-red-300 px-2.5 py-1 rounded">RAM: ~35 MB</span>
            <span class="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded">Arranque: &lt; 180ms</span>
            <span class="bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded">Arquitecturas: amd64, arm64, i386</span>
          </div>
        </div>
      </div>
    `,
  },
  'duckduckgo.com': {
    title: 'DuckDuckGo — Privacidad, simplificada.',
    url: 'https://duckduckgo.com',
    favicon: 'https://duckduckgo.com/favicon.ico',
    author: 'DuckDuckGo Privacy Lab',
    readTime: '1 min',
    description: 'Búsqueda privada que no rastrea tu información personal ni tu historial.',
    category: 'Búsqueda Privada',
    contentHtml: `
      <div class="ddg-site max-w-3xl mx-auto py-12 px-4 text-center">
        <div class="mb-6 flex justify-center">
          <div class="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-5xl">
            🦆
          </div>
        </div>
        <h1 class="text-3xl font-bold mb-2 text-slate-900 dark:text-white">DuckDuckGo</h1>
        <p class="text-slate-500 dark:text-slate-400 mb-8 text-sm">El motor de búsqueda que no almacena tus datos personales.</p>

        <div class="relative max-w-xl mx-auto mb-10">
          <input type="text" placeholder="Busca en la web sin ser rastreado..." class="w-full py-3.5 pl-5 pr-12 rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500" value="navegadores ultraligeros linux debian" readonly />
          <button class="absolute right-3 top-2.5 p-2 text-amber-600">🔍</button>
        </div>

        <div class="text-left space-y-4 max-w-xl mx-auto">
          <h3 class="text-xs uppercase font-bold tracking-wider text-slate-400">Resultados de búsqueda destacados</h3>
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/40 transition-colors">
            <span class="text-xs text-emerald-600 dark:text-emerald-400 block mb-1">https://aerochrome.org/debian</span>
            <h4 class="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline">AeroChrome: El navegador Chrome más ligero para Linux Debian</h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Con solo 35MB de consumo de RAM, bloqueador integrado y compatibilidad con estándares HTML5 y WebAssembly.</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/40 transition-colors">
            <span class="text-xs text-emerald-600 dark:text-emerald-400 block mb-1">https://wiki.debian.org/WebBrowsers</span>
            <h4 class="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline">Debian Wiki: Comparativa de Navegadores Web Ligeros</h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Análisis de rendimiento entre Chromium, Firefox-ESR, Midori, Falkon y AeroChrome en entornos Debian XFCE y GNOME.</p>
          </div>
        </div>
      </div>
    `,
  },
  'news.ycombinator.com': {
    title: 'Hacker News',
    url: 'https://news.ycombinator.com',
    favicon: 'https://news.ycombinator.com/favicon.ico',
    author: 'Y Combinator',
    readTime: '3 min',
    description: 'Discusiones de ingeniería, computación de alto rendimiento y startups.',
    category: 'Tecnología',
    contentHtml: `
      <div class="hn-site max-w-4xl mx-auto py-6 px-4 bg-[#f6f6ef] dark:bg-zinc-950 rounded-xl my-4 text-slate-900 dark:text-slate-100 font-sans">
        <div class="bg-[#ff6600] px-4 py-2 rounded-t-lg flex items-center justify-between text-black font-bold text-sm">
          <div class="flex items-center gap-2">
            <span class="border border-white px-1.5 py-0.5 text-xs text-white">Y</span>
            <span>Hacker News</span>
            <span class="font-normal text-xs ml-3 opacity-90">new | past | comments | ask | show | jobs | submit</span>
          </div>
          <span class="text-xs font-normal">AeroChrome Fast Reader</span>
        </div>

        <div class="p-4 space-y-3.5 bg-white dark:bg-zinc-900 border-x border-b border-orange-300/30 rounded-b-lg">
          <div class="flex items-start gap-3">
            <span class="text-slate-400 text-xs w-5 text-right font-mono">1.</span>
            <div>
              <div class="flex items-center gap-2">
                <a href="#" class="font-medium text-sm text-slate-900 dark:text-slate-100 hover:underline">Show HN: AeroChrome – Google Chrome essential features with 95% less RAM on Debian Linux</a>
                <span class="text-xs text-slate-400">(aerochrome.org)</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">384 points by debian_enthusiast 2 hours ago | 142 comments</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="text-slate-400 text-xs w-5 text-right font-mono">2.</span>
            <div>
              <div class="flex items-center gap-2">
                <a href="#" class="font-medium text-sm text-slate-900 dark:text-slate-100 hover:underline">Linux 6.12 Kernel Release: Real-time PREEMPT_RT officially merged</a>
                <span class="text-xs text-slate-400">(kernel.org)</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">512 points by torvalds_fan 4 hours ago | 89 comments</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="text-slate-400 text-xs w-5 text-right font-mono">3.</span>
            <div>
              <div class="flex items-center gap-2">
                <a href="#" class="font-medium text-sm text-slate-900 dark:text-slate-100 hover:underline">How we cut browser memory usage from 2GB to 40MB without breaking modern CSS</a>
                <span class="text-xs text-slate-400">(blog.browser-engineering.org)</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">278 points by rustacean 6 hours ago | 64 comments</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="text-slate-400 text-xs w-5 text-right font-mono">4.</span>
            <div>
              <div class="flex items-center gap-2">
                <a href="#" class="font-medium text-sm text-slate-900 dark:text-slate-100 hover:underline">Debian 13 'Trixie' Testing Repository updates and Wayland default status</a>
                <span class="text-xs text-slate-400">(lists.debian.org)</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">195 points by sysadmin_dan 8 hours ago | 41 comments</p>
            </div>
          </div>
        </div>
      </div>
    `,
  },
  'es.wikipedia.org': {
    title: 'Debian - Wikipedia, la enciclopedia libre',
    url: 'https://es.wikipedia.org',
    favicon: 'https://es.wikipedia.org/static/favicon/wikipedia.ico',
    author: 'Colaboradores de Wikipedia',
    readTime: '6 min',
    description: 'Debian GNU/Linux es un sistema operativo libre desarrollado por miles de voluntarios alrededor del mundo.',
    category: 'Enciclopedia',
    contentHtml: `
      <div class="wiki-site max-w-4xl mx-auto py-8 px-4 text-slate-800 dark:text-slate-200">
        <div class="border-b border-slate-200 dark:border-zinc-800 pb-4 mb-6">
          <span class="text-xs font-mono uppercase text-slate-400">Artículo de Wikipedia</span>
          <h1 class="text-3xl font-serif font-bold text-slate-900 dark:text-white mt-1">Debian GNU/Linux</h1>
          <p class="text-xs text-slate-500 italic mt-1">De Wikipedia, la enciclopedia libre</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2 space-y-4 text-sm leading-relaxed">
            <p>
              <strong>Debian GNU/Linux</strong> es un sistema operativo libre, desarrollado por más de mil voluntarios de todo el mundo, organizados a través de Internet. El proyecto fue fundado en el año 1993 por <em>Ian Murdock</em>.
            </p>
            <p>
              Debian se caracteriza por su estricta adhesión a las directrices de software libre, su contrato social, su potente sistema de gestión de paquetes (APT y dpkg), y su arquitectura universal que soporta múltiples procesadores incluyendo x86-64, ARM, RISC-V y MIPS.
            </p>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white pt-2 border-b border-slate-200 dark:border-zinc-800 pb-1">
              Ramas de desarrollo
            </h2>
            <ul class="list-disc pl-5 space-y-1.5">
              <li><strong>Stable (Estable):</strong> Paquetes altamente probados y libres de fallos para producción.</li>
              <li><strong>Testing (En pruebas):</strong> La próxima versión candidata con software más reciente.</li>
              <li><strong>Unstable (Inestable - Sid):</strong> El área de desarrollo activo constante.</li>
            </ul>
          </div>

          <div class="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 text-xs space-y-3">
            <div class="text-center font-bold text-sm border-b pb-2 border-slate-200 dark:border-zinc-800">
              Debian GNU/Linux
            </div>
            <div class="text-center text-4xl py-2">🌀</div>
            <div><strong>Desarrollador:</strong> Proyecto Debian</div>
            <div><strong>Modelo de desarrollo:</strong> Software libre y de código abierto</div>
            <div><strong>Núcleo:</strong> Linux (predeterminado) / kFreeBSD</div>
            <div><strong>Gestor de paquetes:</strong> APT, dpkg</div>
            <div><strong>Lanzamiento inicial:</strong> 15 de septiembre de 1993</div>
          </div>
        </div>
      </div>
    `,
  },
};
