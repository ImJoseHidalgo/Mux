# Cómo Funciona la Aplicación - Video Audio Merger

## Resumen Ejecutivo

Has creado una aplicación de escritorio multiplataforma que fusiona archivos de video y audio SIN requerir que los usuarios instalen ffmpeg por separado. Todo está incluido.

## La Solución al Problema de FFmpeg

### Antes (Problema):
- Usuario instala la app
- Usuario debe instalar ffmpeg manualmente
- Difícil de distribuir
- Problemas de PATH y configuración

### Ahora (Solución):
- Usuario instala la app
- **Listo!** FFmpeg se descarga automáticamente la primera vez
- Fácil de distribuir - un solo instalador
- Sin configuración adicional

## Tecnología Utilizada

### ffmpeg-sidecar
Es una biblioteca de Rust que:

1. **Primera ejecución:**
   - Detecta el sistema operativo (Windows/macOS/Linux)
   - Descarga los binarios de ffmpeg apropiados desde GitHub
   - Los guarda en el directorio de caché de la aplicación
   - Tiempo: ~1-2 minutos (descarga ~50-100 MB)

2. **Ejecuciones siguientes:**
   - Usa los binarios ya descargados
   - Instantáneo

### Ubicación de los Binarios

Los binarios de ffmpeg se guardan en:

**macOS:**
```
~/Library/Caches/ffmpeg-sidecar/
```

**Windows:**
```
C:\Users\<usuario>\AppData\Local\ffmpeg-sidecar\
```

**Linux:**
```
~/.cache/ffmpeg-sidecar/
```

## Flujo de Trabajo de la Aplicación

```
1. Usuario abre la app
   ↓
2. Primera ejecución: ffmpeg-sidecar descarga binarios
   (Solo ocurre una vez)
   ↓
3. Usuario selecciona video y audio
   ↓
4. Hace clic en "Fusionar"
   ↓
5. Backend ejecuta:
   ffmpeg -i video.mp4 -i audio.mp3 \
          -c:v copy \              # No recodifica video
          -c:a aac \               # Convierte audio a AAC
          -map 0:v:0 \             # Video del primer archivo
          -map 1:a:0 \             # Audio del segundo archivo
          -y \                     # Sobrescribe si existe
          output.mp4
   ↓
6. Video fusionado guardado en la misma carpeta del video original
   ↓
7. Usuario puede abrir la carpeta con un clic
```

## Distribución

### Para Compartir con Otros

1. Compila la aplicación:
   ```bash
   npm run tauri build
   ```

2. El instalador estará en `src-tauri/target/release/bundle/`

3. Comparte el instalador según la plataforma:
   - **macOS**: `.dmg` o `.app`
   - **Windows**: `.msi` o `.exe`
   - **Linux**: `.deb` o `.appimage`

### Lo que Recibe el Usuario Final

- **Un solo archivo** (instalador o portable)
- Tamaño: ~5-10 MB
- Sin dependencias externas
- Sin necesidad de instalar nada más

### Primera Ejecución para el Usuario

1. Instala/ejecuta la aplicación
2. La primera vez que intente fusionar archivos:
   - Verá un mensaje breve "Preparando ffmpeg..."
   - Se descargan ~50-100 MB
   - Toma ~1-2 minutos
3. Las siguientes veces: instantáneo

## Ventajas de Esta Implementación

1. **Portabilidad Total**
   - Un solo instalador
   - Sin configuración manual

2. **Actualizaciones Automáticas**
   - ffmpeg-sidecar puede actualizar los binarios si es necesario

3. **Multiplataforma**
   - El mismo código funciona en Windows, macOS y Linux
   - Los binarios correctos se descargan según el OS

4. **Tamaño Optimizado**
   - El instalador es pequeño
   - Los binarios grandes se descargan solo cuando se necesitan

5. **Caché Local**
   - Una vez descargado, se reutiliza
   - No descarga en cada ejecución

## Comparación con Alternativas

### Alternativa 1: Pedir al usuario instalar ffmpeg
❌ Complicado para usuarios no técnicos
❌ Problemas de PATH
❌ Difícil soporte

### Alternativa 2: Incluir ffmpeg en el instalador
❌ Instalador muy grande (~100+ MB)
❌ Problemas con App Stores
❌ Licencias complicadas

### Nuestra Solución: ffmpeg-sidecar
✅ Instalador pequeño
✅ Descarga automática
✅ Cacheo inteligente
✅ Fácil distribución
✅ Sin configuración del usuario

## Comandos Útiles

```bash
# Ejecutar en desarrollo
npm run tauri dev

# Compilar para producción
npm run tauri build

# Limpiar caché de compilación
cd src-tauri && cargo clean

# Verificar que ffmpeg esté disponible (después de primera ejecución)
ls ~/Library/Caches/ffmpeg-sidecar/  # macOS
```

## Solución de Problemas

### La aplicación no compila
```bash
# Asegúrate de tener Rust instalado
rustc --version

# Si no, instala:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Recarga el shell
source ~/.cargo/env
```

### La descarga de ffmpeg falla
- Verifica conexión a internet
- ffmpeg-sidecar descarga desde: https://github.com/FFmpeg/FFmpeg
- Los binarios se cachean localmente

### Quiero usar mi propia versión de ffmpeg
- Puedes modificar `lib.rs` para usar un binario local en lugar de `auto_download()`
- Desventaja: pierdes la portabilidad

## Próximos Pasos Posibles

1. **Agregar barra de progreso real**
   - Parsear output de ffmpeg para mostrar % completado

2. **Vista previa**
   - Mostrar preview del video antes de procesar

3. **Más opciones**
   - Ajustar volumen del audio
   - Recortar video/audio
   - Seleccionar codec de salida

4. **Arrastrar y soltar**
   - Permitir drag & drop de archivos

5. **Procesamiento por lotes**
   - Fusionar múltiples pares video+audio

## Conclusión

Tienes una aplicación completamente funcional y fácil de distribuir. Los usuarios solo necesitan:

1. Descargar el instalador
2. Instalarlo
3. Usarlo

Todo lo demás es automático.
