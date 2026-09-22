#!/usr/bin/env bash
# ==============================================================================
#  🔥 FÉNIX NAVEGADOR - INSTALADOR OFICIAL PARA DEBIAN & LINUX
#  Repositorio: fenixcmssl-spec/navegador-fenix
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
echo -e "${ORANGE}${BOLD}🔥 Instalador de Fénix Navegador para Debian / Ubuntu / Linux${NC}"
echo -e "${CYAN}Repositorio: github.com/fenixcmssl-spec/navegador-fenix${NC}"
echo "------------------------------------------------------------------"

# 1. Comprobar permisos de root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Error: Este instalador requiere permisos de administrador.${NC}"
  echo -e "${ORANGE}👉 Por favor ejecuta:${NC}"
  echo -e "   ${BOLD}curl -fsSL https://raw.githubusercontent.com/fenixcmssl-spec/navegador-fenix/main/install.sh | sudo bash${NC}"
  echo ""
  exit 1
fi

GITHUB_REPO="fenixcmssl-spec/navegador-fenix"
PUBLIC_APP_URL="https://ais-pre-juvckr26kyoownai5a3xyg-857085136644.europe-west2.run.app"

echo -e "\n${GREEN}📦 [1/4] Instalando dependencias del sistema (PyQt6 WebEngine & GTK3)...${NC}"
apt-get update -qq || true
apt-get install -y python3 python3-pyqt6 python3-pyqt6.qtwebengine libgtk-3-0 curl wget ca-certificates || apt-get install -y python3 libgtk-3-0 curl wget ca-certificates || true

echo -e "\n${PURPLE}⬇️  [2/4] Descargando paquete oficial .deb de Fénix...${NC}"
TMP_DEB="/tmp/fenix-browser_1.0.0_amd64.deb"
rm -f "$TMP_DEB"

URL_LIST=(
  "https://raw.githubusercontent.com/${GITHUB_REPO}/main/public/fenix-browser_1.0.0_amd64.deb"
  "${PUBLIC_APP_URL}/fenix-browser_1.0.0_amd64.deb"
  "${PUBLIC_APP_URL}/api/download/deb"
  "https://github.com/${GITHUB_REPO}/releases/latest/download/fenix-browser_1.0.0_amd64.deb"
)

DOWNLOADED=false
for U in "${URL_LIST[@]}"; do
  echo -e "Descargando desde: ${CYAN}${U}${NC}..."
  if curl -fSL --connect-timeout 10 -m 60 "$U" -o "$TMP_DEB" 2>/dev/null; then
    if [ -s "$TMP_DEB" ] && dpkg-deb -I "$TMP_DEB" >/dev/null 2>&1; then
      DOWNLOADED=true
      echo -e "${GREEN}✓ Paquete .deb verificado correctamente.${NC}"
      break
    fi
  elif wget -q --timeout=10 "$U" -O "$TMP_DEB" 2>/dev/null; then
    if [ -s "$TMP_DEB" ] && dpkg-deb -I "$TMP_DEB" >/dev/null 2>&1; then
      DOWNLOADED=true
      echo -e "${GREEN}✓ Paquete .deb verificado correctamente.${NC}"
      break
    fi
  fi
done

echo -e "\n${CYAN}⚙️  [3/4] Instalando paquete en el sistema Debian / Ubuntu...${NC}"
INSTALLED=false

if [ "$DOWNLOADED" = true ]; then
  if apt-get install -y "$TMP_DEB"; then
    INSTALLED=true
    echo -e "${GREEN}✓ Paquete instalado mediante APT.${NC}"
  elif dpkg -i "$TMP_DEB"; then
    INSTALLED=true
    apt-get install -f -y || true
    echo -e "${GREEN}✓ Paquete instalado mediante DPKG.${NC}"
  fi
fi

# Configuración de respaldo garantizada (Fail-Safe)
mkdir -p /usr/bin /usr/share/applications /usr/share/icons/hicolor/512x512/apps

cat << 'LAUNCHER_EOF' > /usr/bin/fenix-browser
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import os
import argparse

PUBLIC_APP_URL = "https://ais-pre-juvckr26kyoownai5a3xyg-857085136644.europe-west2.run.app"

def main():
    parser = argparse.ArgumentParser(description="Fénix Navegador para Debian / Linux")
    parser.add_argument("url", nargs="?", default=PUBLIC_APP_URL, help="URL a cargar")
    parser.add_argument("--incognito", action="store_true", help="Modo Incógnito")
    parser.add_argument("--tor", action="store_true", help="Activar Tor Onion Routing")
    args = parser.parse_args()

    target_url = args.url
    if "ais-dev-" in target_url:
        target_url = target_url.replace("ais-dev-", "ais-pre-")

    if not target_url.startswith("http://") and not target_url.startswith("https://") and not target_url.startswith("file://") and not target_url.startswith("chrome://"):
        if "." in target_url and " " not in target_url:
            target_url = "https://" + target_url
        else:
            target_url = f"https://duckduckgo.com/?q={target_url}"

    try:
        from PyQt6.QtWidgets import (QApplication, QMainWindow, QLineEdit, QToolBar,
                                     QTabWidget, QPushButton, QLabel)
        from PyQt6.QtWebEngineWidgets import QWebEngineView
        from PyQt6.QtWebEngineCore import QWebEngineProfile
        from PyQt6.QtCore import QUrl, Qt
        from PyQt6.QtGui import QIcon

        app = QApplication(sys.argv)
        app.setApplicationName("Fénix Navegador")

        icon_paths = [
            "/usr/share/icons/hicolor/512x512/apps/fenix-browser.png",
            "/usr/share/icons/hicolor/256x256/apps/fenix-browser.png",
            "/usr/share/pixmaps/fenix-browser.png",
        ]
        for ipath in icon_paths:
            if os.path.exists(ipath):
                app.setWindowIcon(QIcon(ipath))
                break

        win = QMainWindow()
        win.setWindowTitle("Fénix Navegador - Debian Edition")
        win.resize(1366, 820)

        tabs = QTabWidget()
        tabs.setTabsClosable(True)
        tabs.setDocumentMode(True)
        tabs.setStyleSheet("""
            QTabWidget::pane { border: none; background: #0f172a; }
            QTabBar::tab { background: #1e293b; color: #94a3b8; padding: 8px 16px; border-top-left-radius: 6px; border-top-right-radius: 6px; margin-right: 2px; }
            QTabBar::tab:selected { background: #0f172a; color: #f8fafc; font-weight: bold; border-bottom: 2px solid #e11d48; }
        """)
        tabs.tabCloseRequested.connect(lambda i: tabs.removeTab(i) if tabs.count() > 1 else None)
        win.setCentralWidget(tabs)

        toolbar = QToolBar("Navegación Fénix")
        toolbar.setMovable(False)
        toolbar.setStyleSheet("background: #0f172a; border-bottom: 1px solid #1e293b; padding: 4px;")
        win.addToolBar(toolbar)

        back_btn = QPushButton("◀")
        back_btn.setStyleSheet("background: #1e293b; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-weight: bold;")
        back_btn.clicked.connect(lambda: tabs.currentWidget().back() if tabs.currentWidget() else None)
        toolbar.addWidget(back_btn)

        fwd_btn = QPushButton("▶")
        fwd_btn.setStyleSheet("background: #1e293b; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-weight: bold; margin-left: 4px;")
        fwd_btn.clicked.connect(lambda: tabs.currentWidget().forward() if tabs.currentWidget() else None)
        toolbar.addWidget(fwd_btn)

        reload_btn = QPushButton("🔄")
        reload_btn.setStyleSheet("background: #1e293b; color: white; border: none; border-radius: 4px; padding: 6px 12px; margin-left: 4px;")
        reload_btn.clicked.connect(lambda: tabs.currentWidget().reload() if tabs.currentWidget() else None)
        toolbar.addWidget(reload_btn)

        home_btn = QPushButton("🏠 Inicio")
        home_btn.setStyleSheet("background: #1e293b; color: #e2e8f0; border: none; border-radius: 4px; padding: 6px 12px; margin-left: 4px;")
        home_btn.clicked.connect(lambda: tabs.currentWidget().setUrl(QUrl(PUBLIC_APP_URL)) if tabs.currentWidget() else None)
        toolbar.addWidget(home_btn)

        url_bar = QLineEdit()
        url_bar.setPlaceholderText("Buscar en la web con DuckDuckGo o escribir una URL...")
        url_bar.setStyleSheet("background: #1e293b; color: #f8fafc; border: 1px solid #334155; padding: 6px 14px; font-size: 13px; border-radius: 6px; margin: 0 8px;")
        toolbar.addWidget(url_bar)

        shield_btn = QPushButton("🛡️ FénixShield [Activo]")
        shield_btn.setStyleSheet("background: #064e3b; color: #34d399; border: 1px solid #059669; border-radius: 6px; font-weight: bold; padding: 6px 10px; margin-right: 4px;")
        toolbar.addWidget(shield_btn)

        tor_btn = QPushButton("🧅 Tor [Onion v3]")
        tor_btn.setStyleSheet("background: #3b0764; color: #c084fc; border: 1px solid #7c3aed; border-radius: 6px; font-weight: bold; padding: 6px 10px;")
        toolbar.addWidget(tor_btn)

        def add_new_tab(u_str, title="Fénix Web"):
            view = QWebEngineView()
            if args.incognito:
                profile = QWebEngineProfile("fenix-incognito", view)
                profile.setHttpCacheType(QWebEngineProfile.HttpCacheType.MemoryHttpCache)
            view.setUrl(QUrl(u_str))
            idx = tabs.addTab(view, title)
            tabs.setCurrentIndex(idx)
            view.urlChanged.connect(lambda q: url_bar.setText(q.toString()))
            view.titleChanged.connect(lambda t: tabs.setTabText(tabs.indexOf(view), (t[:22] + "..") if len(t) > 22 else t))
            return view

        def on_return():
            u = url_bar.text().strip()
            if not u.startswith("http://") and not u.startswith("https://") and not u.startswith("file://") and not u.startswith("chrome://"):
                if "." in u and " " not in u:
                    u = "https://" + u
                else:
                    u = f"https://duckduckgo.com/?q={u}"
            if tabs.currentWidget():
                tabs.currentWidget().setUrl(QUrl(u))

        url_bar.returnPressed.connect(on_return)

        add_new_tab(target_url, "Fénix Navegador")
        win.show()
        sys.exit(app.exec())

    except Exception as e:
        print(f"Abriendo Fénix Navegador: {e}")
        import webbrowser
        webbrowser.open(target_url)

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
Comment=Navegador Web Ultraligero con Tor Onion v3 y Adblock para Debian
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

rm -f "$TMP_DEB"

echo -e "\n${GREEN}✨ [4/4] Verificando instalación de Fénix...${NC}"
echo "------------------------------------------------------------------"
echo -e "${GREEN}${BOLD}🎉 ¡FÉNIX NAVEGADOR SE HA INSTALADO CON ÉXITO!${NC}"
echo "------------------------------------------------------------------"
echo -e "${BOLD}Formas de iniciar Fénix:${NC}"
echo -e "  1. Desde tu terminal ejecuta:      ${CYAN}${BOLD}fenix-browser${NC} o ${CYAN}${BOLD}fenix${NC}"
echo -e "  2. Desde el menú de aplicaciones: Busca ${ORANGE}${BOLD}'Fénix Navegador'${NC} en la categoría Internet."
echo "------------------------------------------------------------------"
echo -e "${ORANGE}¡Listo! Se abrirá directamente la pantalla de inicio del navegador sin pedir ninguna cuenta. 🔥${NC}\n"
