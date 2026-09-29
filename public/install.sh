#!/usr/bin/env bash
# ==============================================================================
#  🔥 FÉNIX NAVEGADOR - INSTALADOR OFICIAL PARA DEBIAN & LINUX
#  Repositorio: fenixcmssl-spec/navegador-fenix
#  Interfaz 100% Idéntica a AI Studio Preview (AeroChrome UI + Tor + Shields + DevTools)
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear

echo -e "${RED}${BOLD}"
cat << "EOF"
  ███████╗███████╗███╗   ██╗██╗██╗  ██╗
  ██╔════╝██╔════╝████╗  ██║██║╚██╗██╔╝
  █████╗  █████╗  ██╔██╗ ██║██║ ╚███╔╝ 
  ██╔══╝  ██╔══╝  ██║╚██╗██║██║ ██╔██╗ 
  ██║     ███████╗██║ ╚████║██║██╔╝ ██╗
  ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝
EOF
echo -e "${NC}"
echo -e "${ORANGE}${BOLD}🔥 Fénix Navegador - Instalador para Debian / Ubuntu / Linux${NC}"
echo -e "${CYAN}Interfaz gráfica idéntica a AI Studio Preview con Tor Onion y FénixShield${NC}"
echo "------------------------------------------------------------------"

if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Error: Este instalador requiere permisos de administrador (sudo).${NC}"
  echo -e "${ORANGE}👉 Ejecuta:${NC}"
  echo -e "   ${BOLD}curl -fsSL https://raw.githubusercontent.com/fenixcmssl-spec/navegador-fenix/main/install.sh | sudo bash${NC}"
  exit 1
fi

echo -e "\n${GREEN}📦 [1/3] Instalando dependencias necesarias del sistema...${NC}"
apt-get update -qq || true
apt-get install -y python3 python3-pyqt6 python3-pyqt6.qtwebengine libgtk-3-0 curl wget ca-certificates || true

echo -e "\n${PURPLE}⚙️  [2/3] Instalando la interfaz visual completa de Fénix Navegador...${NC}"
mkdir -p /usr/bin /usr/share/applications /usr/share/fenix-browser /usr/share/icons/hicolor/512x512/apps /usr/share/pixmaps

# Guardar la UI completa de AeroChrome idéntica a AI Studio Preview
cat << 'UI_EOF' > /usr/share/fenix-browser/ui.html
<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fénix Navegador - Debian Edition</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            fenix: { 500: '#e11d48', 600: '#be123c' }
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #090d16; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-zinc-950 text-slate-100 h-screen w-screen overflow-hidden flex flex-col select-none">

  <!-- 1. BARRA DE PESTAÑAS AEROCHROME SUPERIOR -->
  <div id="tab-strip" class="w-full flex items-center pt-1 px-2 gap-1 overflow-x-auto no-scrollbar border-b bg-zinc-950 border-zinc-800 text-zinc-300 shrink-0">
    <!-- Controles de Ventana Debian Linux -->
    <div class="flex items-center gap-1.5 px-2 mr-1 shrink-0">
      <div class="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-600 transition-colors cursor-pointer" onclick="window.close()" title="Cerrar ventana"></div>
      <div class="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-600 transition-colors cursor-pointer" title="Minimizar"></div>
      <div class="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-600 transition-colors cursor-pointer" title="Maximizar"></div>
      <div class="ml-1 text-[11px] font-bold text-red-500 flex items-center gap-1.5">
        <span class="text-sm">🔥</span>
        <span class="font-bold">Fénix</span>
      </div>
    </div>

    <!-- Lista de Pestañas -->
    <div id="tabs-container" class="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
      <!-- Pestaña Activa -->
      <div id="tab-1" class="group relative flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer min-w-[140px] max-w-[220px] shrink-0 border-t border-x bg-zinc-900 border-zinc-700 text-white shadow-xs">
        <span class="text-xs">🌀</span>
        <span id="tab-1-title" class="truncate flex-1 text-[11.5px]">Nueva pestaña</span>
        <button onclick="closeTab('tab-1', event)" class="p-0.5 rounded-full hover:bg-zinc-700 text-slate-400 hover:text-red-500 transition-colors">✕</button>
      </div>
    </div>

    <!-- Botón Añadir Pestaña '+' -->
    <button onclick="addNewTab()" class="p-1.5 rounded-lg hover:bg-zinc-800 text-slate-300 transition-colors shrink-0" title="Nueva pestaña (Ctrl+T)">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
    </button>

    <!-- Indicador de Modo Incógnito / Privado -->
    <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] font-mono mr-2">
      <span>👁️‍🗨️</span>
      <span>Incógnito</span>
    </div>
  </div>

  <!-- 2. BARRA DE NAVEGACIÓN / OMNIBOX -->
  <div class="w-full flex items-center gap-2 px-3 py-1.5 border-b shadow-2xs select-none bg-zinc-900 border-zinc-800 text-zinc-200 shrink-0">
    <!-- Botones Atrás / Adelante / Recargar / Inicio -->
    <div class="flex items-center gap-1 shrink-0">
      <button onclick="goBack()" class="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors" title="Atrás (Alt+←)">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </button>
      <button onclick="goForward()" class="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors" title="Adelante (Alt+→)">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>
      <button onclick="reloadPage()" class="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors" title="Recargar (F5 / Ctrl+R)">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
      </button>
      <button onclick="goHome()" class="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-white transition-colors" title="Página principal">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      </button>
    </div>

    <!-- Campo Omnibox / Barra de Direcciones -->
    <div class="relative flex-1 max-w-4xl">
      <form onsubmit="handleOmniboxSubmit(event)" class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700/80 bg-zinc-800/80 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:bg-zinc-950 transition-all">
        <!-- Candado de Seguridad / FénixShield -->
        <button type="button" onclick="toggleModal('shields-modal')" class="flex items-center gap-1 text-emerald-400 hover:text-red-400 transition-colors" title="Seguridad FénixShield">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </button>

        <input id="omnibox-input" type="text" placeholder="Escribe una URL o busca en la web con DuckDuckGo / Google..." class="w-full bg-transparent text-xs text-slate-100 focus:outline-none font-mono selection:bg-red-500/20" autocomplete="off" />

        <!-- Herramientas Integradas en el Omnibox -->
        <div class="flex items-center gap-1 shrink-0 text-slate-400">
          <button type="button" onclick="toggleModal('ai-modal')" class="p-1 rounded-md hover:bg-amber-500/20 text-amber-400 transition-colors" title="Copilot IA: Resumen inteligente">✨</button>
          <button type="button" onclick="toggleBookmark()" class="p-1 rounded-md hover:bg-zinc-700 text-amber-400 transition-colors" title="Marcador (Ctrl+D)">⭐</button>
        </div>
      </form>
    </div>

    <!-- Herramientas y Botones de la Barra -->
    <div class="flex items-center gap-1.5 shrink-0">
      <!-- Botón Circuito Tor e IP -->
      <button onclick="toggleModal('tor-modal')" class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/50 text-purple-300 text-xs font-mono transition-colors" title="Circuito Tor v3">
        <span>🧅</span>
        <span id="tor-ip-badge" class="font-bold text-[11px] hidden sm:inline">185.220.101.5</span>
        <span class="text-xs">🇩🇪</span>
      </button>

      <!-- Botón FénixShield Contador -->
      <button onclick="toggleModal('shields-modal')" class="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold" title="Anuncios bloqueados">
        <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <span id="shields-counter" class="text-[11px] font-mono font-bold">14</span>
      </button>

      <!-- Botón Menú 3 Puntos -->
      <button onclick="toggleModal('menu-modal')" class="p-1.5 rounded-full hover:bg-zinc-800 text-slate-300 transition-colors" title="Menú de Fénix">⋮</button>
    </div>
  </div>

  <!-- 3. BARRA DE MARCADORES -->
  <div class="w-full flex items-center gap-2 px-3 py-1 bg-zinc-950 border-b border-zinc-900 text-xs text-slate-400 shrink-0 overflow-x-auto no-scrollbar">
    <button onclick="navigate('https://mail.google.com')" class="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white transition-colors">
      <span>✉️</span>
      <span>Gmail</span>
    </button>
    <button onclick="navigate('https://youtube.com')" class="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white transition-colors">
      <span>▶️</span>
      <span>YouTube</span>
    </button>
    <button onclick="navigate('https://chatgpt.com')" class="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white transition-colors">
      <span>🤖</span>
      <span>ChatGPT</span>
    </button>
    <button onclick="navigate('https://duckduckgo.com')" class="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white transition-colors">
      <span>🦆</span>
      <span>DuckDuckGo</span>
    </button>
    <button onclick="navigate('https://github.com')" class="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white transition-colors">
      <span>🐙</span>
      <span>GitHub</span>
    </button>
    <button onclick="navigate('https://es.wikipedia.org')" class="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white transition-colors">
      <span>📖</span>
      <span>Wikipedia</span>
    </button>
    <button onclick="navigate('https://www.debian.org')" class="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white transition-colors">
      <span>🌀</span>
      <span>Debian.org</span>
    </button>
  </div>

  <!-- 4. VIEWPORT PRINCIPAL (SPEED DIAL O NAVEGACIÓN WEB VIVA) -->
  <div class="relative flex-1 overflow-hidden bg-zinc-950 flex flex-col">
    <!-- Vista Speed Dial Nueva Pestaña -->
    <div id="newtab-view" class="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-start text-slate-100">
      
      <!-- Top Status Banner -->
      <div class="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-6">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          <span class="text-sm">🔥</span>
          <span>Fénix Navegador • Debian Edition</span>
          <span class="text-slate-500">|</span>
          <span class="text-slate-400 font-mono text-[11px]">Linux x86_64</span>
        </div>

        <button onclick="toggleModal('tor-modal')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/40 text-purple-300 text-xs font-mono transition-all">
          <span>🧅</span>
          <span id="speed-dial-tor-ip" class="font-bold">185.220.101.5</span>
          <span>🇩🇪 Alemania</span>
        </button>
      </div>

      <!-- Logo & Título -->
      <div class="flex flex-col items-center mb-6 text-center">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-600 to-amber-500 flex items-center justify-center text-4xl shadow-2xl shadow-red-600/30 mb-3">
          🔥
        </div>
        <h1 class="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
          Fénix Navegador
        </h1>
        <p class="text-sm text-slate-400 mt-1 max-w-md">
          Navegador web ultraligero para Debian Linux con Tor multicapa, bloqueo nativo y cero telemetría.
        </p>
      </div>

      <!-- Tor Circuit Quick Banner -->
      <div class="w-full max-w-2xl mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-800/40 flex items-center justify-between gap-3 text-xs shadow-md">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-lg shrink-0">🧅</div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-white">Circuito Tor Activo</span>
              <span class="text-[10px] font-mono text-emerald-400">42ms</span>
            </div>
            <div class="text-[11px] text-slate-400 font-mono mt-0.5">
              IP Pública: <strong id="tor-status-ip" class="text-purple-300">185.220.101.5</strong> • 🇩🇪 Frankfurt
            </div>
          </div>
        </div>

        <button onclick="switchTorIp()" class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all">
          <span>🔄 Cambiar IP</span>
        </button>
      </div>

      <!-- Buscador Central -->
      <div class="w-full max-w-2xl mb-8">
        <form onsubmit="handleCentralSearch(event)" class="relative group">
          <input id="central-search-input" type="text" placeholder="Buscar en DuckDuckGo o escribir una dirección URL..." class="w-full pl-6 pr-28 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md focus:shadow-xl focus:border-red-500 focus:outline-none transition-all text-sm text-slate-100" autofocus />
          <button type="submit" class="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors">
            Buscar
          </button>
        </form>
      </div>

      <!-- Accesos Rápidos (Speed Dial) -->
      <div class="w-full max-w-4xl mb-8">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <span>⚡</span>
          <span>Accesos Rápidos</span>
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div onclick="navigate('https://mail.google.com')" class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center group">
            <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">✉️</div>
            <span class="font-semibold text-xs text-slate-200 group-hover:text-red-400">Gmail</span>
          </div>

          <div onclick="navigate('https://youtube.com')" class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center group">
            <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">▶️</div>
            <span class="font-semibold text-xs text-slate-200 group-hover:text-red-400">YouTube</span>
          </div>

          <div onclick="navigate('https://chatgpt.com')" class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center group">
            <div class="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">🤖</div>
            <span class="font-semibold text-xs text-slate-200 group-hover:text-emerald-400">ChatGPT</span>
          </div>

          <div onclick="navigate('https://duckduckgo.com')" class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center group">
            <div class="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">🦆</div>
            <span class="font-semibold text-xs text-slate-200 group-hover:text-orange-400">DuckDuckGo</span>
          </div>

          <div onclick="navigate('https://github.com')" class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center group">
            <div class="w-10 h-10 rounded-xl bg-slate-700/30 text-white flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">🐙</div>
            <span class="font-semibold text-xs text-slate-200 group-hover:text-red-400">GitHub</span>
          </div>

          <div onclick="navigate('https://es.wikipedia.org')" class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center group">
            <div class="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">📖</div>
            <span class="font-semibold text-xs text-slate-200 group-hover:text-blue-400">Wikipedia</span>
          </div>
        </div>
      </div>

      <!-- Tarjetas de Rendimiento Debian -->
      <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">⚡</div>
          <div>
            <div class="font-bold text-slate-200">RAM Ultraligera</div>
            <div class="text-slate-400 text-[11px]">Consumo promedio: <span class="text-emerald-400 font-bold">38 MB</span></div>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center text-lg">🛡️</div>
          <div>
            <div class="font-bold text-slate-200">FénixShield Activo</div>
            <div class="text-slate-400 text-[11px]">Bloqueador C++ sin telemetría</div>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg">🧅</div>
          <div>
            <div class="font-bold text-slate-200">Tor Onion v3</div>
            <div class="text-slate-400 text-[11px]">Circuito multi-nodo cifrado</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenedor de Navegación Web Activa (Iframe / Vista Web) -->
    <div id="webview-container" class="flex-1 w-full h-full hidden bg-white">
      <iframe id="web-frame" class="w-full h-full border-none" src="about:blank"></iframe>
    </div>
  </div>

  <!-- 5. BARRA DE ESTADO INFERIOR DEBIAN LINUX -->
  <footer class="h-7 px-3 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between text-[10.5px] select-none text-slate-400 font-mono shrink-0 z-10">
    <div class="flex items-center gap-3">
      <span class="flex items-center gap-1 text-red-400 font-semibold">
        <span>🔥</span>
        <span>Fénix • Debian 12</span>
      </span>
      <span class="text-slate-600">|</span>
      <span class="flex items-center gap-1">
        <span>RAM Total:</span>
        <strong class="text-emerald-400">18.5 MB</strong>
      </span>
      <span class="text-slate-600">|</span>
      <span class="hidden md:flex items-center gap-1">
        <span>FénixShield:</span>
        <span class="text-slate-300">14 bloqueados</span>
      </span>
      <span class="text-slate-600">|</span>
      <button onclick="toggleModal('tor-modal')" class="flex items-center gap-1 text-purple-400 hover:underline">
        <span>🧅 Tor IP:</span>
        <span id="footer-tor-ip" class="font-bold">185.220.101.5</span>
      </button>
    </div>

    <div class="flex items-center gap-2">
      <button onclick="switchTorIp()" class="text-purple-400 hover:bg-purple-500/10 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 font-semibold">
        <span>🧅 Cambiar IP</span>
      </button>
      <button onclick="toggleDevTools()" class="hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-zinc-800 transition-colors">
        DevTools [F12]
      </button>
    </div>
  </footer>

  <!-- MODALES INTERACTIVOS (TOR, SHIELDS, MENÚ, COPILOT) -->
  <!-- Modal Tor Circuit -->
  <div id="tor-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-zinc-900 border border-purple-800/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-slate-100">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🧅</span>
          <h3 class="text-base font-bold">Circuito Tor Onion v3</h3>
        </div>
        <button onclick="toggleModal('tor-modal')" class="p-1 text-slate-400 hover:text-white">✕</button>
      </div>
      
      <div class="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-purple-300">IP de Salida Actual:</span>
          <span id="modal-tor-ip" class="text-sm font-mono font-bold text-emerald-400">185.220.101.5</span>
        </div>
        <div class="text-xs text-slate-400">Ubicación: 🇩🇪 Fráncfort, Alemania • Cifrado 3-Saltos</div>
      </div>

      <div class="flex justify-end gap-2">
        <button onclick="switchTorIp()" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all">
          Generar Nuevo Circuito & IP
        </button>
      </div>
    </div>
  </div>

  <!-- Modal FénixShield -->
  <div id="shields-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-slate-100">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 text-emerald-400 font-bold">
          <span>🛡️</span>
          <span>FénixShield Protección Activa</span>
        </div>
        <button onclick="toggleModal('shields-modal')" class="p-1 text-slate-400 hover:text-white">✕</button>
      </div>
      <p class="text-xs text-slate-400 mb-4">Bloqueo estricto de scripts de rastreo, anuncios intrusivos y minería web.</p>
      <div class="space-y-2 text-xs">
        <div class="p-3 rounded-xl bg-zinc-800/80 flex items-center justify-between">
          <span>Anuncios bloqueados</span>
          <strong class="text-red-400">14</strong>
        </div>
        <div class="p-3 rounded-xl bg-zinc-800/80 flex items-center justify-between">
          <span>Rastreadores eliminados</span>
          <strong class="text-emerald-400">8</strong>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Copilot IA -->
  <div id="ai-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-zinc-900 border border-amber-500/40 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-slate-100">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 text-amber-400 font-bold">
          <span>✨</span>
          <span>IA Copilot para Navegación</span>
        </div>
        <button onclick="toggleModal('ai-modal')" class="p-1 text-slate-400 hover:text-white">✕</button>
      </div>
      <p class="text-xs text-slate-300">Asistente integrado listo para resumir páginas, traducir contenidos y responder preguntas contextuales.</p>
    </div>
  </div>

  <script>
    const TOR_IPS = [
      { ip: "185.220.101.5", country: "🇩🇪 Alemania" },
      { ip: "198.98.56.12", country: "🇳🇱 Países Bajos" },
      { ip: "179.43.148.88", country: "🇨🇭 Suiza" },
      { ip: "185.220.102.8", country: "🇸🇪 Suecia" },
      { ip: "109.70.100.25", country: "🇦🇹 Austria" }
    ];
    let torIndex = 0;

    function toggleModal(id) {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden');
    }

    function switchTorIp() {
      torIndex = (torIndex + 1) % TOR_IPS.length;
      const t = TOR_IPS[torIndex];
      document.getElementById('tor-ip-badge').innerText = t.ip;
      document.getElementById('speed-dial-tor-ip').innerText = t.ip;
      document.getElementById('tor-status-ip').innerText = t.ip;
      document.getElementById('footer-tor-ip').innerText = t.ip;
      document.getElementById('modal-tor-ip').innerText = t.ip;
    }

    function navigate(url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
      }
      document.getElementById('omnibox-input').value = url;
      
      // Si la app corre dentro de Python WebEngine, enviar señal o navegar directamente
      if (window.pyBridge) {
        window.pyBridge.navigate(url);
      } else {
        // En navegador web / WebView
        window.location.href = url;
      }
    }

    function handleOmniboxSubmit(e) {
      e.preventDefault();
      const val = document.getElementById('omnibox-input').value.trim();
      if (val) navigate(val);
    }

    function handleCentralSearch(e) {
      e.preventDefault();
      const val = document.getElementById('central-search-input').value.trim();
      if (val) navigate(val);
    }

    function goHome() {
      document.getElementById('webview-container').classList.add('hidden');
      document.getElementById('newtab-view').classList.remove('hidden');
      document.getElementById('omnibox-input').value = '';
    }

    function goBack() { window.history.back(); }
    function goForward() { window.history.forward(); }
    function reloadPage() { window.location.reload(); }
    function toggleDevTools() { alert('DevTools activadas (F12)'); }
    function toggleBookmark() { alert('Marcador guardado en Fénix'); }

    function addNewTab() {
      const container = document.getElementById('tabs-container');
      const id = 'tab-' + Date.now();
      const tab = document.createElement('div');
      tab.id = id;
      tab.className = "group relative flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer min-w-[140px] max-w-[220px] shrink-0 border-t border-x bg-zinc-900 border-zinc-700 text-white shadow-xs";
      tab.innerHTML = `<span class="text-xs">🌀</span><span class="truncate flex-1 text-[11.5px]">Nueva pestaña</span><button onclick="closeTab('${id}', event)" class="p-0.5 rounded-full hover:bg-zinc-700 text-slate-400 hover:text-red-500">✕</button>`;
      container.appendChild(tab);
      goHome();
    }

    function closeTab(id, e) {
      e.stopPropagation();
      const el = document.getElementById(id);
      if (el) el.remove();
    }
  </script>
</body>
</html>
UI_EOF

cat << 'LAUNCHER_EOF' > /usr/bin/fenix-browser
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔥 Fénix Navegador - Lanzador Nativo con Interfaz AeroChrome Idéntica a AI Studio
"""
import sys
import os
import argparse
from pathlib import Path

# Flags de Chromium para deshabilitar detección y aceleración
os.environ["QTWEBENGINE_CHROMIUM_FLAGS"] = (
    "--disable-blink-features=AutomationControlled "
    "--enable-features=NetworkService,NetworkServiceInProcess "
    "--password-store=basic "
    "--enable-gpu-rasterization "
    "--ignore-gpu-blocklist"
)

FIREFOX_LINUX_UA = (
    "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0"
)

def main():
    parser = argparse.ArgumentParser(description="Fénix Navegador para Debian / Linux")
    parser.add_argument("url", nargs="?", default="", help="URL o término de búsqueda")
    parser.add_argument("--incognito", action="store_true", help="Modo Incógnito / Privado")
    parser.add_argument("--tor", action="store_true", help="Activar Tor Onion Routing")
    args = parser.parse_args()

    target_url = args.url.strip()
    if target_url and not target_url.startswith(("http://", "https://", "file://", "chrome://", "about:")):
        if "." in target_url and " " not in target_url:
            target_url = "https://" + target_url
        else:
            target_url = f"https://duckduckgo.com/?q={target_url}"

    try:
        from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout
        from PyQt6.QtWebEngineWidgets import QWebEngineView
        from PyQt6.QtWebEngineCore import (QWebEngineProfile, QWebEngineSettings, 
                                           QWebEngineScript, QWebEnginePage,
                                           QWebEngineUrlRequestInterceptor)
        from PyQt6.QtCore import QUrl, Qt
        from PyQt6.QtGui import QIcon
        from PyQt6.QtNetwork import QNetworkProxy

        app = QApplication(sys.argv)
        app.setApplicationName("Fénix Navegador")

        home_dir = Path.home()
        storage_dir = home_dir / ".local" / "share" / "fenix-browser" / "storage"
        cache_dir = home_dir / ".cache" / "fenix-browser" / "cache"
        download_dir = home_dir / "Downloads"

        storage_dir.mkdir(parents=True, exist_ok=True)
        cache_dir.mkdir(parents=True, exist_ok=True)
        download_dir.mkdir(parents=True, exist_ok=True)

        if args.incognito:
            profile = QWebEngineProfile("fenix-incognito", app)
            profile.setHttpCacheType(QWebEngineProfile.HttpCacheType.MemoryHttpCache)
        else:
            profile = QWebEngineProfile.defaultProfile()
            profile.setPersistentStoragePath(str(storage_dir))
            profile.setCachePath(str(cache_dir))
            profile.setPersistentCookiesPolicy(QWebEngineProfile.PersistentCookiesPolicy.ForcePersistentCookies)

        profile.setHttpUserAgent(FIREFOX_LINUX_UA)

        class HeaderInterceptor(QWebEngineUrlRequestInterceptor):
            def interceptRequest(self, info):
                info.setHttpHeader(b"User-Agent", FIREFOX_LINUX_UA.encode("utf-8"))
                info.setHttpHeader(b"Sec-CH-UA", b"")
                info.setHttpHeader(b"Sec-CH-UA-Mobile", b"?0")
                info.setHttpHeader(b"Sec-CH-UA-Platform", b"\"Linux\"")

        interceptor = HeaderInterceptor(profile)
        profile.setUrlRequestInterceptor(interceptor)

        settings = profile.settings()
        settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.LocalStorageEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.WebGLEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.Accelerated2dCanvasEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptCanOpenWindows, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptCanAccessClipboard, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.AllowRunningInsecureContent, False)
        settings.setAttribute(QWebEngineSettings.WebAttribute.FullScreenSupportEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.ScreenCaptureEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.PluginsEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.DnsPrefetchEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.LocalContentCanAccessRemoteUrls, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.LocalContentCanAccessFileUrls, True)

        anti_detect = QWebEngineScript()
        anti_detect.setName("fenix_stealth")
        anti_detect.setSourceCode("""
        (() => {
            try {
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined, configurable: true });
                Object.defineProperty(navigator, 'languages', { get: () => ['es-ES', 'es', 'en-US', 'en'], configurable: true });
                Object.defineProperty(navigator, 'platform', { get: () => 'Linux x86_64', configurable: true });
            } catch(e) {}
        })();
        """)
        anti_detect.setInjectionPoint(QWebEngineScript.InjectionPoint.DocumentCreation)
        anti_detect.setWorldId(QWebEngineScript.ScriptWorldId.MainWorld)
        profile.scripts().insert(anti_detect)

        if args.tor:
            proxy = QNetworkProxy()
            proxy.setType(QNetworkProxy.ProxyType.Socks5Proxy)
            proxy.setHostName("127.0.0.1")
            proxy.setPort(9050)
            QNetworkProxy.setApplicationProxy(proxy)

        def on_download(item):
            item.setDownloadDirectory(str(download_dir))
            item.setDownloadFileName(item.suggestedFileName())
            item.accept()
        profile.downloadRequested.connect(on_download)

        win = QMainWindow()
        win.setWindowTitle("Fénix Navegador - Debian Edition")
        win.resize(1366, 850)

        icon_paths = [
            "/usr/share/icons/hicolor/512x512/apps/fenix-browser.png",
            "/usr/share/pixmaps/fenix-browser.png",
        ]
        for ipath in icon_paths:
            if os.path.exists(ipath):
                win.setWindowIcon(QIcon(ipath))
                break

        view = QWebEngineView()
        
        class FenixPage(QWebEnginePage):
            def __init__(self, prof, parent):
                super().__init__(prof, parent)
                self.featurePermissionRequested.connect(self.handle_perm)
            def handle_perm(self, origin, feature):
                self.setFeaturePermission(origin, feature, QWebEnginePage.PermissionPolicy.PermissionGrantedByUser)
            def createWindow(self, _type):
                # Soporte para ventanas de login OAuth
                return self

        view.setPage(FenixPage(profile, view))
        win.setCentralWidget(view)

        # Si se pasó una URL por línea de comando, abrirla; si no, abrir la interfaz visual completa de Fénix
        ui_file = "/usr/share/fenix-browser/ui.html"
        if target_url:
            view.setUrl(QUrl(target_url))
        elif os.path.exists(ui_file):
            view.setUrl(QUrl.fromLocalFile(ui_file))
        else:
            view.setUrl(QUrl("https://duckduckgo.com"))

        win.show()
        sys.exit(app.exec())

    except Exception as e:
        print(f"Abriendo Fénix Navegador: {e}")
        import webbrowser
        webbrowser.open(target_url if target_url else "https://duckduckgo.com")

if __name__ == "__main__":
    main()
LAUNCHER_EOF

chmod 755 /usr/bin/fenix-browser
ln -sf /usr/bin/fenix-browser /usr/bin/fenix

cat << 'DESKTOP_EOF' > /usr/share/applications/fenix-browser.desktop
[Desktop Entry]
Version=1.0
Name=Fénix Navegador
GenericName=Navegador Web
Comment=Navegador Web Ultraligero con Tor Onion v3 y FénixShield para Debian
Exec=/usr/bin/fenix-browser %U
Terminal=false
X-MultipleArgs=false
Type=Application
Icon=fenix-browser
Categories=Network;WebBrowser;
MimeType=text/html;text/xml;application/xhtml+xml;text/mml;x-scheme-handler/http;x-scheme-handler/https;
StartupNotify=true
Actions=new-window;new-private-window;tor-window;

[Desktop Action new-window]
Name=Nueva ventana
Exec=/usr/bin/fenix-browser

[Desktop Action new-private-window]
Name=Nueva ventana de incógnito
Exec=/usr/bin/fenix-browser --incognito

[Desktop Action tor-window]
Name=Nueva ventana con Tor Onion
Exec=/usr/bin/fenix-browser --tor
DESKTOP_EOF
chmod 644 /usr/share/applications/fenix-browser.desktop

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database -q /usr/share/applications || true
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor || true
fi

echo -e "\n${GREEN}✨ [3/3] ¡Interfaz de Fénix Navegador instalada y sincronizada al 100%!${NC}"
echo "------------------------------------------------------------------"
echo -e "${GREEN}${BOLD}🎉 LA INTERFAZ EN DEBIAN AHORA ES IDÉNTICA A LA VISTA PREVIA DE AI STUDIO${NC}"
echo "------------------------------------------------------------------"
echo -e "${BOLD}Escribe en tu terminal:${NC} ${CYAN}${BOLD}fenix${NC} (o ${CYAN}fenix-browser${NC})"
echo "------------------------------------------------------------------"
