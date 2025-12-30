# Video Audio Merger

Una aplicación de escritorio simple para fusionar archivos de video y audio. **FFmpeg viene incluido**, no necesitas instalarlo por separado.

## Características

- Interfaz gráfica intuitiva
- FFmpeg incluido en la aplicación (descarga automática en la primera ejecución)
- Selecciona archivos de video y audio fácilmente
- Fusiona video y audio sin recodificar el video (copia directa)
- El audio se convierte a AAC para mejor compatibilidad
- Abre la carpeta del archivo generado con un clic
- Multiplataforma: Windows, macOS y Linux
- Portable y fácil de distribuir

## Requisitos Previos

### Para compilar la aplicación:

Solo necesitas **Node.js** y **Rust** instalados:

#### Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Node.js
Descarga desde: https://nodejs.org/

### Para usar la aplicación compilada:

**¡Ninguno!** La aplicación incluye todo lo necesario. Solo descarga e instala.

## Uso

### Opción 1: Ejecutar en modo desarrollo

```bash
cd video-audio-merger
npm install
npm run tauri dev
```

En la primera ejecución, la aplicación descargará automáticamente los binarios de ffmpeg necesarios para tu plataforma.

### Opción 2: Compilar instalador para distribuir

```bash
cd video-audio-merger
npm install
npm run tauri build
```

El instalador se generará en `src-tauri/target/release/bundle/`

Los binarios generados incluyen todo lo necesario y pueden compartirse con otros usuarios sin requerir instalaciones adicionales.

## Cómo Usar la Aplicación

1. Abre la aplicación
2. Haz clic en "Seleccionar Video" y elige un archivo de video
3. Haz clic en "Seleccionar Audio" y elige un archivo de audio
4. Opcionalmente, cambia el nombre del archivo de salida
5. Haz clic en "Fusionar Video y Audio"
6. Espera a que se complete el proceso
7. Haz clic en "Abrir carpeta" para ver el video resultante

## Formatos Soportados

### Video
- MP4, AVI, MKV, MOV, FLV, WMV, WebM

### Audio
- MP3, WAV, AAC, M4A, FLAC, OGG, WMA

## Notas Técnicas

- **FFmpeg embebido**: La aplicación usa `ffmpeg-sidecar` que descarga automáticamente los binarios de ffmpeg apropiados para tu sistema operativo en la primera ejecución
- El video se copia directamente sin recodificación (rápido, sin pérdida de calidad)
- El audio se convierte a AAC si no lo está ya
- El archivo de salida se guarda en la misma carpeta que el video de entrada
- Los archivos originales no se modifican
- Los binarios de ffmpeg se almacenan en el directorio de caché de la aplicación

## Distribución

Puedes compartir el instalador generado con otros usuarios. La aplicación es completamente autocontenida:

- **Windows**: `.msi` o `.exe` en `src-tauri/target/release/bundle/`
- **macOS**: `.dmg` o `.app` en `src-tauri/target/release/bundle/`
- **Linux**: `.deb`, `.appimage` en `src-tauri/target/release/bundle/`

Los usuarios solo necesitan instalar/ejecutar la aplicación. FFmpeg se descargará automáticamente en la primera ejecución si no está presente.

## Ventajas de esta implementación

- No requiere instalación previa de ffmpeg
- Descarga automática de binarios según la plataforma
- Los binarios se cachean localmente después de la primera descarga
- Portabilidad total: un solo archivo ejecutable/instalador
- Actualizaciones automáticas de ffmpeg cuando sea necesario

## Licencia

MIT
