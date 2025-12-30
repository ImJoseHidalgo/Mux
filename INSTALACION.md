# Guía Rápida de Instalación y Uso

## Paso 1: Instalar Rust

Abre la terminal y ejecuta:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Luego cierra y abre de nuevo la terminal.

## Paso 2: Ejecutar la aplicación en modo desarrollo

```bash
cd video-audio-merger
npm install
npm run tauri dev
```

La primera vez que ejecutes la aplicación, descargará automáticamente los binarios de ffmpeg (esto puede tardar un minuto). Las siguientes ejecuciones serán instantáneas.

## Paso 3: Compilar instalador (opcional)

Si quieres crear un instalador para compartir:

```bash
npm run tauri build
```

El instalador estará en: `src-tauri/target/release/bundle/`

### Tipos de instaladores generados:

**macOS:**
- `dmg/` - Imagen de disco para instalar arrastrando a Aplicaciones
- `macos/` - Aplicación `.app` independiente

**Windows (si compilas en Windows):**
- `msi/` - Instalador MSI
- `nsis/` - Instalador NSIS

**Linux (si compilas en Linux):**
- `deb/` - Paquete Debian
- `appimage/` - AppImage portable

## Notas importantes:

1. **FFmpeg incluido**: No necesitas instalar ffmpeg. La aplicación lo descarga automáticamente la primera vez que se ejecuta.

2. **Compartir la aplicación**: Una vez compilada, puedes compartir el instalador con otros usuarios. Ellos NO necesitan instalar Rust, Node.js ni ffmpeg. Solo instalan tu aplicación y listo.

3. **Primera ejecución**: La primera vez que un usuario abra la aplicación, se descargará ffmpeg automáticamente (unos 50-100 MB dependiendo de la plataforma). Esto solo sucede una vez.

4. **Tamaño del instalador**: El instalador será pequeño (unos pocos MB). FFmpeg se descarga en tiempo de ejecución la primera vez para mantener el tamaño del instalador reducido.

## Comandos útiles:

```bash
# Ejecutar en desarrollo
npm run tauri dev

# Compilar para producción
npm run tauri build

# Ver logs de compilación
npm run tauri build -- --verbose

# Limpiar caché de compilación
cargo clean --manifest-path=src-tauri/Cargo.toml
```
