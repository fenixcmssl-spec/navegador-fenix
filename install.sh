#!/usr/bin/env bash
# ==============================================================================
#  🔥 FÉNIX NAVEGADOR - INSTALADOR OFICIAL PARA DEBIAN & LINUX
#  Motor Chromium Core Ultralight • Tor Onion v3 • FénixShield Adblock
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

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
echo -e "${ORANGE}${BOLD}🔥 Instalador de Fénix Navegador para Debian / Ubuntu / Linux${NC}"
echo -e "${CYAN}Versión 1.0.0 (Debian amd64) • Tor Onion Routing • Adblock Integrado${NC}"
echo "------------------------------------------------------------------"

# 1. Comprobar privilegios de root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Error: Este instalador requiere permisos de administrador.${NC}"
  echo -e "${ORANGE}👉 Por favor ejecuta:${NC}"
  echo -e "   ${BOLD}curl -fsSL https://raw.githubusercontent.com/sindacatoobsidiana/fenix-browser/main/install.sh | sudo bash${NC}"
  echo ""
  exit 1
fi

# Lista de URLs candidatas para descargar el binario .deb
GITHUB_REPO="${GITHUB_REPO:-sindacatoobsidiana/fenix-browser}"
SERVER_URL="${FENIX_SERVER_URL:-https://ais-dev-juvckr26kyoownai5a3xyg-857085136644.europe-west2.run.app}"

DEB_CANDIDATES=(
  "https://github.com/${GITHUB_REPO}/releases/latest/download/fenix-browser_1.0.0_amd64.deb"
  "https://raw.githubusercontent.com/${GITHUB_REPO}/main/public/fenix-browser_1.0.0_amd64.deb"
  "${SERVER_URL}/fenix-browser_1.0.0_amd64.deb"
  "${SERVER_URL}/api/download/deb"
)

echo -e "\n${GREEN}🚀 [1/4] Comprobando paquetes y dependencias del sistema...${NC}"
apt-get update -qq || true
apt-get install -y -qq curl wget ca-certificates python3 python3-pyqt6 python3-pyqt6.qtwebengine libgtk-3-0 2>/dev/null || apt-get install -y -qq curl wget ca-certificates python3 libgtk-3-0 2>/dev/null || true

echo -e "\n${PURPLE}⬇️  [2/4] Descargando paquete oficial .deb desde GitHub / Servidor...${NC}"
TMP_DEB="/tmp/fenix-browser_1.0.0_amd64.deb"
rm -f "$TMP_DEB"

DOWNLOAD_SUCCESS=false
for URL in "${DEB_CANDIDATES[@]}"; do
  echo -e "Intentando descargar desde: ${CYAN}${URL}${NC}..."
  if curl -fSL --connect-timeout 8 "$URL" -o "$TMP_DEB" --progress-bar 2>/dev/null; then
    # Verificar que el archivo descargado no esté vacío y sea válido
    if [ -s "$TMP_DEB" ]; then
      DOWNLOAD_SUCCESS=true
      echo -e "${GREEN}✓ Descarga completada con éxito.${NC}"
      break
    fi
  elif wget -q --timeout=8 --show-progress "$URL" -O "$TMP_DEB" 2>/dev/null; then
    if [ -s "$TMP_DEB" ]; then
      DOWNLOAD_SUCCESS=true
      echo -e "${GREEN}✓ Descarga completada con éxito.${NC}"
      break
    fi
  fi
done

if [ "$DOWNLOAD_SUCCESS" = false ]; then
  echo -e "${RED}❌ No se pudo descargar el paquete .deb. Comprueba tu conexión a Internet.${NC}"
  exit 1
fi

echo -e "\n${CYAN}⚙️  [3/4] Instalando paquete en el gestor Debian (dpkg / apt)...${NC}"
if dpkg -i "$TMP_DEB" 2>/dev/null; then
  echo -e "${GREEN}✓ Paquete desempaquetado correctamente.${NC}"
else
  echo -e "${ORANGE}Resolviendo dependencias adicionales con apt-get install -f...${NC}"
  apt-get install -f -y -qq
fi

# Actualizar base de datos de escritorio y MIME
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database -q /usr/share/applications || true
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor || true
fi

# Limpiar temporal
rm -f "$TMP_DEB"

echo -e "\n${GREEN}✨ [4/4] Configurando accesos directos y lanzador en /usr/bin/fenix-browser...${NC}"
echo "------------------------------------------------------------------"
echo -e "${GREEN}${BOLD}🎉 ¡FÉNIX NAVEGADOR SE HA INSTALADO CON ÉXITO!${NC}"
echo "------------------------------------------------------------------"
echo -e "${BOLD}Formas de iniciar Fénix:${NC}"
echo -e "  1. Desde tu terminal ejecuta:      ${CYAN}${BOLD}fenix-browser${NC} o ${CYAN}${BOLD}fenix${NC}"
echo -e "  2. Desde el menú de aplicaciones: Busca ${ORANGE}${BOLD}'Fénix Navegador'${NC} en la categoría Internet."
echo -e "  3. Para iniciar en modo incógnito: ${CYAN}fenix-browser --incognito${NC}"
echo -e "  4. Para iniciar con Tor Onion:    ${PURPLE}fenix-browser --tor${NC}"
echo "------------------------------------------------------------------"
echo -e "${ORANGE}¡Disfruta de una navegación ultraligera, privada y segura en Debian! 🔥${NC}\n"
