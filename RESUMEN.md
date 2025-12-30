# Resumen del Proyecto: Video Audio Merger

## ¿Qué hace esta aplicación?

Una aplicación de escritorio multiplataforma que permite fusionar archivos de video y audio de manera simple y rápida, sin necesidad de usar la línea de comandos.

## Ventaja Principal: FFmpeg Incluido

**Los usuarios NO necesitan instalar ffmpeg por separado**. La aplicación usa `ffmpeg-sidecar`, una biblioteca que:

1. Descarga automáticamente los binarios de ffmpeg la primera vez que se ejecuta
2. Los almacena en caché para usos futuros
3. Selecciona la versión correcta según el sistema operativo (Windows, macOS, Linux)

## Estructura del Proyecto

```
video-audio-merger/
├── src/                          # Frontend (HTML/CSS/JS)
│   ├── index.html               # Interfaz de usuario
│   ├── main.js                  # Lógica de la UI
│   └── styles.css               # Estilos
│
├── src-tauri/                   # Backend (Rust)
│   ├── src/
│   │   ├── lib.rs              # Lógica principal (comandos Tauri)
│   │   └── main.rs             # Punto de entrada
│   ├── Cargo.toml              # Dependencias Rust
│   └── tauri.conf.json         # Configuración de Tauri
│
├── README.md                    # Documentación completa
├── INSTALACION.md              # Guía rápida de instalación
└── package.json                # Dependencias Node.js
```

## Cómo Funciona

### Frontend (JavaScript)
1. El usuario selecciona archivos de video y audio usando diálogos nativos
2. Define el nombre del archivo de salida
3. Hace clic en "Fusionar"
4. La UI muestra el progreso y el resultado

### Backend (Rust)
1. Recibe las rutas de los archivos desde el frontend
2. Usa `ffmpeg-sidecar` para ejecutar ffmpeg
3. Fusiona el video y audio:
   - Copia el video sin recodificar (rápido)
   - Convierte el audio a AAC (compatibilidad)
4. Guarda el resultado en la misma carpeta que el video original
5. Devuelve la ruta del archivo creado

### Comando FFmpeg Usado

```bash
ffmpeg -i video.mp4 -i audio.mp3 \
  -c:v copy \              # Copiar video sin recodificar
  -c:a aac \               # Convertir audio a AAC
  -map 0:v:0 \             # Usar video del primer archivo
  -map 1:a:0 \             # Usar audio del segundo archivo
  -y \                     # Sobrescribir si existe
  output.mp4               # Archivo de salida
```

## Instalación y Uso

### Para Desarrolladores:

1. Instalar Rust:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. Ejecutar en desarrollo:
   ```bash
   cd video-audio-merger
   npm install
   npm run tauri dev
   ```

3. Compilar instalador:
   ```bash
   npm run tauri build
   ```

### Para Usuarios Finales:

1. Descargar el instalador para tu sistema operativo
2. Instalarlo
3. Ejecutar la aplicación
4. En la primera ejecución, esperar a que descargue ffmpeg (automático)
5. ¡Listo para usar!

## Distribución

### Instaladores Generados:

- **macOS**: `.app` y `.dmg` en `src-tauri/target/release/bundle/macos/` y `dmg/`
- **Windows**: `.msi` y `.exe` en `src-tauri/target/release/bundle/msi/` y `nsis/`
- **Linux**: `.deb` y `.appimage` en `src-tauri/target/release/bundle/deb/` y `appimage/`

### Requisitos para Usuarios:

**¡NINGUNO!** Solo instalar la aplicación.

- No necesitan Node.js
- No necesitan Rust
- No necesitan ffmpeg
- No necesitan conocimientos técnicos

## Dependencias Principales

### Frontend:
- Tauri API (dialog, path)
- JavaScript vanilla (sin frameworks)

### Backend:
- `tauri` v2 - Framework principal
- `ffmpeg-sidecar` v2 - Gestión automática de ffmpeg
- `tauri-plugin-dialog` - Diálogos de selección de archivos
- `tauri-plugin-opener` - Abrir carpetas en el explorador

## Características Técnicas

- Tamaño del instalador: ~5-10 MB (sin ffmpeg incluido en el binario)
- Primera descarga de ffmpeg: ~50-100 MB (una sola vez)
- Velocidad de fusión: Muy rápida (no recodifica video)
- Calidad: Sin pérdida en el video
- Multiplataforma: Windows, macOS, Linux

## Próximas Mejoras Posibles

- Barra de progreso real basada en el output de ffmpeg
- Soporte para múltiples pistas de audio
- Vista previa del video resultante
- Ajuste de volumen del audio
- Recorte de video/audio antes de fusionar
- Arrastrar y soltar archivos
- Conversión a diferentes formatos de salida
