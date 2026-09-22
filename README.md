# 🔥 Fénix Navegador (Debian / Linux Edition)

> **Repositorio Oficial:** `https://github.com/fenixcmssl-spec/navegador-fenix`  
> **Navegador Web Ultraligero con Enrutamiento Tor Onion v3 Multi-Hop y FénixShield Adblock Integrado.**  
> Diseñado para Debian 11/12/13, Ubuntu 22.04/24.04, Linux Mint, Kali Linux y sistemas Linux amd64.

---

## 🚀 Métodos de Instalación

### Método 1: Instalación de 1 Línea por Terminal (Recomendado)
Abre una terminal (`Ctrl + Alt + T`) y ejecuta:

```bash
curl -fsSL https://raw.githubusercontent.com/fenixcmssl-spec/navegador-fenix/main/install.sh | sudo bash
```

---

### Método 2: Instalación por Terminal con DPKG (Estilo Google Chrome)

```bash
# 1. Descargar el paquete oficial .deb desde GitHub
wget -O fenix-browser.deb https://raw.githubusercontent.com/fenixcmssl-spec/navegador-fenix/main/public/fenix-browser_1.0.0_amd64.deb

# 2. Instalar con dpkg y resolver dependencias
sudo dpkg -i fenix-browser.deb || sudo apt-get install -f -y

# 3. Iniciar Fénix Navegador
fenix-browser
```

---

### Método 3: Instalador Gráfico de Linux con Doble Clic (GDebi / GNOME Software)

1. Descarga el archivo **`fenix-browser_1.0.0_amd64.deb`** desde tu repositorio en `public/fenix-browser_1.0.0_amd64.deb` o desde GitHub Releases.
2. Haz clic derecho sobre el archivo descargado y selecciona **"Abrir con Instalador de Paquetes"** (o GDebi).
3. Haz clic en **"Instalar Paquete"** e ingresa tu contraseña de usuario.
4. Fénix aparecerá automáticamente en el menú de aplicaciones de tu sistema en la categoría **Internet / Navegadores**.

---

### Método 4: Ejecución desde el Código Fuente (Desarrollo / Node.js)

```bash
# 1. Clonar tu repositorio
git clone https://github.com/fenixcmssl-spec/navegador-fenix.git
cd navegador-fenix

# 2. Instalar dependencias
npm install

# 3. Compilar e iniciar servidor
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
