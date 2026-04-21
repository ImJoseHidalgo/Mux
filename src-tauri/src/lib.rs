use std::path::PathBuf;
use ffmpeg_sidecar::command::FfmpegCommand;
use ffmpeg_sidecar::download::auto_download;

#[tauri::command]
fn merge_video_audio(video_path: String, audio_path: String, output_name: String, output_dir: Option<String>) -> Result<String, String> {
    // Asegurar que ffmpeg esté disponible (descarga automáticamente si es necesario)
    auto_download().map_err(|e| format!("Error al preparar ffmpeg: {}", e))?;

    let video_path_buf = PathBuf::from(&video_path);

    // Usar la carpeta personalizada si está especificada, sino usar la carpeta del video
    let target_dir = if let Some(custom_dir) = output_dir {
        PathBuf::from(custom_dir)
    } else {
        video_path_buf.parent()
            .ok_or("No se pudo determinar el directorio del video")?
            .to_path_buf()
    };

    let output_path = target_dir.join(&output_name);
    let output_str = output_path.to_str()
        .ok_or("Error al convertir la ruta de salida")?;

    // Usar ffmpeg-sidecar para ejecutar el comando
    let output = FfmpegCommand::new()
        .input(&video_path)
        .input(&audio_path)
        .args(["-c:v", "copy"])
        .args(["-c:a", "aac"])
        .args(["-map", "0:v:0"])
        .args(["-map", "1:a:0"])
        .args(["-y"])
        .output(output_str)
        .spawn()
        .map_err(|e| format!("Error al ejecutar ffmpeg: {}", e))?
        .wait()
        .map_err(|e| format!("Error al esperar ffmpeg: {}", e))?;

    if output.success() {
        Ok(output_str.to_string())
    } else {
        Err("ffmpeg falló al procesar los archivos".to_string())
    }
}

#[tauri::command]
fn compress_video(
    video_path: String,
    output_name: String,
    output_dir: Option<String>,
    crf: Option<u32>,
    preset: Option<String>,
    audio_bitrate: Option<String>,
) -> Result<String, String> {
    auto_download().map_err(|e| format!("Error al preparar ffmpeg: {}", e))?;

    let video_path_buf = PathBuf::from(&video_path);

    let target_dir = if let Some(custom_dir) = output_dir {
        PathBuf::from(custom_dir)
    } else {
        video_path_buf
            .parent()
            .ok_or("No se pudo determinar el directorio del video")?
            .to_path_buf()
    };

    let output_path = target_dir.join(&output_name);
    let output_str = output_path
        .to_str()
        .ok_or("Error al convertir la ruta de salida")?;

    let crf_val = crf.unwrap_or(23).to_string();
    let preset_val = preset.unwrap_or_else(|| "medium".to_string());
    let audio_br = audio_bitrate.unwrap_or_else(|| "128k".to_string());

    let output = FfmpegCommand::new()
        .input(&video_path)
        .args(["-c:v", "libx264"])
        .args(["-crf", &crf_val])
        .args(["-preset", &preset_val])
        .args(["-c:a", "aac"])
        .args(["-b:a", &audio_br])
        .args(["-y"])
        .output(output_str)
        .spawn()
        .map_err(|e| format!("Error al ejecutar ffmpeg: {}", e))?
        .wait()
        .map_err(|e| format!("Error al esperar ffmpeg: {}", e))?;

    if output.success() {
        Ok(output_str.to_string())
    } else {
        Err("ffmpeg falló al comprimir el video".to_string())
    }
}

#[tauri::command]
fn open_folder(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![merge_video_audio, compress_video, open_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
