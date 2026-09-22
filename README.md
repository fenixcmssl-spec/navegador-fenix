# 🔥 Fénix Navegador (Debian / Linux Edition)

> **Navegador Web Ultraligero con Enrutamiento Tor Onion v3 Multi-Hop y FénixShield Adblock Integrado.**
> Diseñado para Debian 11/12/13, Ubuntu 22.04/24.04, Linux Mint, Kali Linux y sistemas Linux amd64.

---

## 🚀 Métodos de Instalación

### Método 1: Instalación de 1 Línea por Terminal (Recomendado)
Abre una terminal (`Ctrl + Alt + T`) y ejecuta:

```bash
curl -fsSL https://raw.githubusercontent.com/sindacatoobsidiana/fenix-browser/main/install.sh | sudo bash
```

---

### Método 2: Instalación por Terminal con DPKG (Estilo Google Chrome)

```bash
# 1. Descargar el paquete oficial .deb desde GitHub Releases o repositorio
wget -O fenix-browser.deb https://github.com/sindacatoobsidiana/fenix-browser/releases/latest/download/fenix-browser_1.0.0_amd64.deb \
  || wget -O fenix-browser.deb https://raw.githubusercontent.com/sindacatoobsidiana/fenix-browser/main/public/fenix-browser_1.0.0_amd64.deb

# 2. Instalar el paquete y resolver dependencias
sudo dpkg -i fenix-browser.deb || sudo apt-get install -f -y

# 3. Iniciar Fénix Navegador
fenix-browser
```

---

### Método 3: Instalador Gráfico de Linux con Doble Clic (GDebi / GNOME Software)

1. Descarga el archivo **`fenix-browser_1.0.0_amd64.deb`** desde la sección [Releases](https://github.com/sindacatoobsidiana/fenix-browser/releases) o desde la carpeta `public/`.
2. Haz clic derecho sobre el archivo descargado y selecciona **"Abrir con Instalador de Paquetes"** (o GDebi).
3. Haz clic en **"Instalar Paquete"** e ingresa tu contraseña de usuario.
4. Fénix aparecerá automáticamente en el menú de aplicaciones de tu sistema en la categoría **Internet / Navegadores**.

---

### Método 4: Ejecución desde el Código Fuente (Desarrollo / Node.js)

```bash
# 1. Clonar el repositorio
git clone https://github.com/sindacatoobsidiana/fenix-browser.git
cd fenix-browser

# 2. Instalar dependencias
npm install

# 3. Compilar e iniciar servidor de producción
npm run build
npm start
```
Luego abre `http://localhost:3000` en tu navegador.

---

## 🛡️ Características Principales

- **Consumo Ultraligero**: Menos de 35 MB de memoria RAM en reposo.
- **🧅 Tor Onion v3 Multi-Hop**: Cambio de IP y circuito criptográfico en 1 clic desde la barra de direcciones o `chrome://tor`.
- **🛡️ FénixShield**: Bloqueador nativo de publicidad, rastreadores y scripts de minería criptográfica.
- **⚡ Compatibilidad Total**: Soporta Wayland, X11 y aceleración VA-API por hardware.
- **🔒 Privacidad Máxima**: Modo Incógnito permanente sin telemetría ni recopilación de datos.

---

## 📄 Licencia
Distribuido bajo licencia MIT. Consulta el archivo `LICENSE` para más detalles.
