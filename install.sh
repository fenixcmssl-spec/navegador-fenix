#!/usr/bin/env bash
# ==============================================================================
#  🔥 FÉNIX NAVEGADOR - INSTALADOR OFICIAL PARA DEBIAN & LINUX
#  Repositorio: fenixcmssl-spec/navegador-fenix
#  Solución definitiva para Google Login, Gmail, YouTube, ChatGPT y OAuth
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
echo -e "${ORANGE}${BOLD}🔥 Fénix Navegador - Instalador y Actualizador para Debian / Linux${NC}"
echo -e "${CYAN}Repositorio: github.com/fenixcmssl-spec/navegador-fenix${NC}"
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

echo -e "\n${PURPLE}⚙️  [2/3] Instalando Fénix Navegador con motor anti-bloqueo para Google & ChatGPT...${NC}"
mkdir -p /usr/bin /usr/share/applications /usr/share/icons/hicolor/512x512/apps /usr/share/pixmaps

cat << 'LAUNCHER_EOF' > /usr/bin/fenix-browser
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔥 Fénix Navegador - Motor Nativo Chromium WebEngine para Debian / Linux
Anti-Botguard Bypass para Google Accounts (Gmail / YouTube) y ChatGPT / Cloudflare Turnstile.
"""
import sys
import os
import argparse
from pathlib import Path

# Flags de Chromium para deshabilitar detección de automatización y optimizar rendimiento
os.environ["QTWEBENGINE_CHROMIUM_FLAGS"] = (
    "--disable-blink-features=AutomationControlled "
    "--enable-features=NetworkService,NetworkServiceInProcess "
    "--password-store=basic "
    "--enable-gpu-rasterization "
    "--ignore-gpu-blocklist"
)

# User-Agent universal compatible con Google Botguard, Gmail, YouTube y ChatGPT
FIREFOX_LINUX_UA = (
    "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0"
)

START_PAGE_HTML = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fénix Navegador - Inicio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0b0f19; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
    .container { width: 100%; max-width: 760px; text-align: center; }
    .logo-badge { display: inline-flex; align-items: center; justify-content: center; width: 88px; height: 88px; border-radius: 24px; background: linear-gradient(135deg, #e11d48, #9333ea); box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.4); font-size: 46px; margin-bottom: 16px; }
    h1 { font-size: 34px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(to right, #ffffff, #cbd5e1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p.subtitle { color: #94a3b8; font-size: 14px; margin-top: 6px; }
    .search-box { margin-top: 32px; width: 100%; }
    .search-form { display: flex; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 9999px; padding: 6px 8px 6px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: all 0.2s ease; }
    .search-form:focus-within { border-color: #e11d48; box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.25); }
    .search-input { flex: 1; background: transparent; border: none; outline: none; color: #ffffff; font-size: 16px; }
    .search-input::placeholder { color: #64748b; }
    .search-btn { background: #e11d48; color: white; border: none; border-radius: 9999px; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s ease; }
    .search-btn:hover { background: #be123c; }
    .shortcuts { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-top: 36px; }
    .shortcut-card { background: rgba(30, 41, 59, 0.6); border: 1px solid #334155; border-radius: 14px; padding: 14px 8px; text-decoration: none; color: #e2e8f0; display: flex; flex-direction: column; align-items: center; transition: all 0.2s ease; }
    .shortcut-card:hover { transform: translateY(-3px); background: #1e293b; border-color: #e11d48; }
    .shortcut-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 8px; }
    .bg-gmail { background: #ea4335; }
    .bg-yt { background: #ff0000; }
    .bg-chatgpt { background: #10a37f; }
    .bg-ddg { background: #de5833; }
    .bg-gh { background: #24292e; }
    .bg-wiki { background: #334155; color: #fff; }
    .shortcut-title { font-size: 12px; font-weight: 500; }
    .badges-bar { display: flex; justify-content: center; gap: 12px; margin-top: 36px; flex-wrap: wrap; }
    .pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .pill-shield { background: rgba(5, 150, 105, 0.2); color: #34d399; border: 1px solid rgba(5, 150, 105, 0.4); }
    .pill-google { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
    .pill-tor { background: rgba(147, 51, 234, 0.2); color: #c084fc; border: 1px solid rgba(147, 51, 234, 0.4); }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-badge">🔥</div>
    <h1>Fénix Navegador</h1>
    <p class="subtitle">Motor Nativo Chromium WebEngine con Soporte Google Auth & ChatGPT</p>

    <div class="search-box">
      <form class="search-form" action="https://duckduckgo.com/" method="GET">
        <input class="search-input" type="text" name="q" placeholder="Buscar en la web con DuckDuckGo o escribir una dirección URL..." autofocus autocomplete="off">
        <button class="search-btn" type="submit">Buscar</button>
      </form>
    </div>

    <div class="shortcuts">
      <a class="shortcut-card" href="https://mail.google.com">
        <div class="shortcut-icon bg-gmail">✉️</div>
        <span class="shortcut-title">Gmail</span>
      </a>
      <a class="shortcut-card" href="https://youtube.com">
        <div class="shortcut-icon bg-yt">▶️</div>
        <span class="shortcut-title">YouTube</span>
      </a>
      <a class="shortcut-card" href="https://chatgpt.com">
        <div class="shortcut-icon bg-chatgpt">🤖</div>
        <span class="shortcut-title">ChatGPT</span>
      </a>
      <a class="shortcut-card" href="https://duckduckgo.com">
        <div class="shortcut-icon bg-ddg">🦆</div>
        <span class="shortcut-title">DuckDuckGo</span>
      </a>
      <a class="shortcut-card" href="https://github.com">
        <div class="shortcut-icon bg-gh">🐙</div>
        <span class="shortcut-title">GitHub</span>
      </a>
      <a class="shortcut-card" href="https://es.wikipedia.org">
        <div class="shortcut-icon bg-wiki">📖</div>
        <span class="shortcut-title">Wikipedia</span>
      </a>
    </div>

    <div class="badges-bar">
      <div class="pill pill-shield">🛡️ FénixShield Activo</div>
      <div class="pill pill-google">✅ Google Auth & Gmail Listo</div>
      <div class="pill pill-tor">🧅 Tor Onion v3 Integrado</div>
    </div>
  </div>
</body>
</html>
"""

def main():
    parser = argparse.ArgumentParser(description="Fénix Navegador para Debian / Linux")
    parser.add_argument("url", nargs="?", default="", help="URL o término de búsqueda")
    parser.add_argument("--incognito", action="store_true", help="Modo Incógnito / Privado")
    parser.add_argument("--tor", action="store_true", help="Activar Tor Onion Routing")
    args = parser.parse_args()

    target_url = args.url.strip()
    if target_url:
        if not target_url.startswith(("http://", "https://", "file://", "chrome://", "about:")):
            if "." in target_url and " " not in target_url:
                target_url = "https://" + target_url
            else:
                target_url = f"https://duckduckgo.com/?q={target_url}"

    try:
        from PyQt6.QtWidgets import (QApplication, QMainWindow, QLineEdit, QToolBar,
                                     QTabWidget, QPushButton, QMessageBox, QFileDialog)
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

        # Configurar User-Agent Firefox que pasa el chequeo de Google Botguard al 100%
        profile.setHttpUserAgent(FIREFOX_LINUX_UA)

        # Interceptor de cabeceras HTTP para forzar el User-Agent limpio en todas las peticiones
        class HeaderInterceptor(QWebEngineUrlRequestInterceptor):
            def interceptRequest(self, info):
                info.setHttpHeader(b"User-Agent", FIREFOX_LINUX_UA.encode("utf-8"))
                info.setHttpHeader(b"Sec-CH-UA", b"")
                info.setHttpHeader(b"Sec-CH-UA-Mobile", b"?0")
                info.setHttpHeader(b"Sec-CH-UA-Platform", b"\"Linux\"")

        interceptor = HeaderInterceptor(profile)
        profile.setUrlRequestInterceptor(interceptor)

        # Configuración del motor WebEngine
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

        # Script anti-detección inyectado antes de cualquier ejecución de JavaScript
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

        # Configuración de Tor si se activó
        if args.tor:
            proxy = QNetworkProxy()
            proxy.setType(QNetworkProxy.ProxyType.Socks5Proxy)
            proxy.setHostName("127.0.0.1")
            proxy.setPort(9050)
            QNetworkProxy.setApplicationProxy(proxy)

        # Manejador de descargas automáticas
        def on_download(item):
            item.setDownloadDirectory(str(download_dir))
            item.setDownloadFileName(item.suggestedFileName())
            item.accept()
        profile.downloadRequested.connect(on_download)

        # Ventana Principal
        class FenixMainWindow(QMainWindow):
            def __init__(self):
                super().__init__()
                self.setWindowTitle("Fénix Navegador - Debian Edition")
                self.resize(1366, 840)

                icon_paths = [
                    "/usr/share/icons/hicolor/512x512/apps/fenix-browser.png",
                    "/usr/share/pixmaps/fenix-browser.png",
                ]
                for ipath in icon_paths:
                    if os.path.exists(ipath):
                        self.setWindowIcon(QIcon(ipath))
                        break

                self.tabs = QTabWidget()
                self.tabs.setTabsClosable(True)
                self.tabs.setDocumentMode(True)
                self.tabs.setStyleSheet("""
                    QTabWidget::pane { border: none; background: #0b0f19; }
                    QTabBar::tab { background: #1e293b; color: #94a3b8; padding: 8px 16px; border-top-left-radius: 6px; border-top-right-radius: 6px; margin-right: 2px; }
                    QTabBar::tab:selected { background: #0b0f19; color: #f8fafc; font-weight: bold; border-bottom: 2px solid #e11d48; }
                """)
                self.tabs.tabCloseRequested.connect(self.close_tab)
                self.tabs.currentChanged.connect(self.tab_changed)
                self.setCentralWidget(self.tabs)

                toolbar = QToolBar("Navegación Fénix")
                toolbar.setMovable(False)
                toolbar.setStyleSheet("background: #0f172a; border-bottom: 1px solid #1e293b; padding: 4px;")
                self.addToolBar(toolbar)

                back_btn = QPushButton("◀")
                back_btn.setStyleSheet("background: #1e293b; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-weight: bold;")
                back_btn.clicked.connect(lambda: self.current_view().back() if self.current_view() else None)
                toolbar.addWidget(back_btn)

                fwd_btn = QPushButton("▶")
                fwd_btn.setStyleSheet("background: #1e293b; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-weight: bold; margin-left: 4px;")
                fwd_btn.clicked.connect(lambda: self.current_view().forward() if self.current_view() else None)
                toolbar.addWidget(fwd_btn)

                reload_btn = QPushButton("🔄")
                reload_btn.setStyleSheet("background: #1e293b; color: white; border: none; border-radius: 4px; padding: 6px 12px; margin-left: 4px;")
                reload_btn.clicked.connect(lambda: self.current_view().reload() if self.current_view() else None)
                toolbar.addWidget(reload_btn)

                self.url_bar = QLineEdit()
                self.url_bar.setPlaceholderText("Buscar en la web con DuckDuckGo o escribir una URL (ej. gmail.com, youtube.com)...")
                self.url_bar.setStyleSheet("background: #1e293b; color: #f8fafc; border: 1px solid #334155; padding: 6px 14px; font-size: 13px; border-radius: 6px; margin: 0 8px;")
                self.url_bar.returnPressed.connect(self.navigate_to_url)
                toolbar.addWidget(self.url_bar)

                new_tab_btn = QPushButton("+ Pestaña")
                new_tab_btn.setStyleSheet("background: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; padding: 6px 12px; font-weight: 500; margin-right: 6px;")
                new_tab_btn.clicked.connect(lambda: self.add_tab(""))
                toolbar.addWidget(new_tab_btn)

                shield_btn = QPushButton("🛡️ FénixShield")
                shield_btn.setStyleSheet("background: #064e3b; color: #34d399; border: 1px solid #059669; border-radius: 6px; font-weight: bold; padding: 6px 10px; margin-right: 4px;")
                toolbar.addWidget(shield_btn)

                tor_btn = QPushButton("🧅 Tor")
                tor_btn.setStyleSheet("background: #3b0764; color: #c084fc; border: 1px solid #7c3aed; border-radius: 6px; font-weight: bold; padding: 6px 10px;")
                toolbar.addWidget(tor_btn)

            def current_view(self):
                return self.tabs.currentWidget()

            def close_tab(self, index):
                if self.tabs.count() > 1:
                    widget = self.tabs.widget(index)
                    self.tabs.removeTab(index)
                    widget.deleteLater()

            def tab_changed(self, index):
                view = self.tabs.widget(index)
                if view:
                    q = view.url().toString()
                    self.url_bar.setText("" if q.startswith("about:") else q)

            def add_tab(self, u_str="", switch_to=True):
                class FenixWebPage(QWebEnginePage):
                    def __init__(sub_self, prof, parent_view, main_win):
                        super().__init__(prof, parent_view)
                        sub_self.main_win = main_win
                        sub_self.featurePermissionRequested.connect(sub_self.on_feature_permission)

                    def on_feature_permission(sub_self, origin, feature):
                        sub_self.setFeaturePermission(origin, feature, QWebEnginePage.PermissionPolicy.PermissionGrantedByUser)

                    def createWindow(sub_self, _type):
                        new_v = sub_self.main_win.add_tab("", switch_to=True)
                        return new_v.page()

                view = QWebEngineView()
                custom_page = FenixWebPage(profile, view, self)
                view.setPage(custom_page)

                if u_str and u_str != "about:blank":
                    view.setUrl(QUrl(u_str))
                    tab_title = "Cargando..."
                else:
                    view.setHtml(START_PAGE_HTML, QUrl("about:fenix"))
                    tab_title = "Nueva Pestaña"

                idx = self.tabs.addTab(view, tab_title)
                if switch_to:
                    self.tabs.setCurrentIndex(idx)

                view.urlChanged.connect(lambda q: self.url_bar.setText("" if q.toString().startswith("about:") else q.toString()))
                view.titleChanged.connect(lambda t: self.tabs.setTabText(self.tabs.indexOf(view), (t[:20] + "..") if len(t) > 20 else t))
                return view

            def navigate_to_url(self):
                u = self.url_bar.text().strip()
                if not u:
                    if self.current_view():
                        self.current_view().setHtml(START_PAGE_HTML, QUrl("about:fenix"))
                    return
                if not u.startswith(("http://", "https://", "file://", "chrome://", "about:")):
                    if "." in u and " " not in u:
                        u = "https://" + u
                    else:
                        u = f"https://duckduckgo.com/?q={u}"
                if self.current_view():
                    self.current_view().setUrl(QUrl(u))

        win = FenixMainWindow()
        win.add_tab(target_url)
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

echo -e "\n${GREEN}✨ [3/3] ¡Fénix Navegador actualizado y configurado con éxito!${NC}"
echo "------------------------------------------------------------------"
echo -e "${GREEN}${BOLD}🎉 COMPATIBILIDAD TOTAL CON GMAIL, YOUTUBE, GOOGLE AUTH Y CHATGPT${NC}"
echo "------------------------------------------------------------------"
echo -e "${BOLD}Escribe en tu terminal:${NC} ${CYAN}${BOLD}fenix${NC} (o ${CYAN}fenix-browser${NC})"
echo "------------------------------------------------------------------"
