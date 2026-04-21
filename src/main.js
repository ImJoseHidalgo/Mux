// Merge state
let videoPath = null;
let audioPath = null;
let outputDir = null;
let customOutputDir = null;

// Compress state
let compressVideoPath = null;
let compressOutputDir = null;
let compressCustomOutputDir = null;

console.log('main.js loaded');
console.log('Tauri API:', window.__TAURI__);

// Helper function to get translated text
function t(key, params = {}) {
  return window.i18n.t(key, params);
}

async function selectVideo() {
  console.log('selectVideo called');
  try {
    const selected = await window.__TAURI__.dialog.open({
      multiple: false,
      filters: [{
        name: 'Video',
        extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm']
      }]
    });

    console.log('Selected video:', selected);

    if (selected) {
      videoPath = selected;
      document.getElementById('video-name').textContent = selected.split('/').pop();
      checkReadyToMerge();
    }
  } catch (error) {
    console.error('Error selecting video:', error);
  }
}

async function selectAudio() {
  console.log('selectAudio called');
  try {
    const selected = await window.__TAURI__.dialog.open({
      multiple: false,
      filters: [{
        name: 'Audio/Video',
        extensions: ['mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg', 'wma', 'mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm']
      }]
    });

    console.log('Selected audio:', selected);

    if (selected) {
      audioPath = selected;
      document.getElementById('audio-name').textContent = selected.split('/').pop();
      checkReadyToMerge();
    }
  } catch (error) {
    console.error('Error selecting audio:', error);
  }
}

async function selectOutputFolder() {
  console.log('selectOutputFolder called');
  try {
    const selected = await window.__TAURI__.dialog.open({
      directory: true,
      multiple: false
    });

    console.log('Selected folder:', selected);

    if (selected) {
      customOutputDir = selected;
      const folderName = selected.split('/').pop();
      document.getElementById('output-folder').textContent = `📁 ${folderName}`;
    }
  } catch (error) {
    console.error('Error selecting folder:', error);
  }
}

function checkReadyToMerge() {
  const mergeBtn = document.getElementById('merge-btn');
  if (videoPath && audioPath) {
    mergeBtn.disabled = false;
  }
}

async function mergeFiles() {
  const defaultName = t('outputPlaceholder');
  const baseName = document.getElementById('output-name').value.trim() || defaultName;
  const outputName = baseName + '.mp4';

  const loadingOverlay = document.getElementById('loading-overlay');
  const statusMsg = document.getElementById('status-msg');
  const statusDetail = document.getElementById('status-detail');
  const mergeBtn = document.getElementById('merge-btn');

  // Mostrar overlay de carga
  loadingOverlay.classList.remove('hidden');
  mergeBtn.disabled = true;
  statusMsg.textContent = t('preparingFiles');
  statusDetail.textContent = t('processingWait');

  // Dar tiempo al navegador para renderizar el spinner antes de la operación pesada
  await new Promise(resolve => setTimeout(resolve, 100));

  statusMsg.textContent = t('mergingFiles');

  try {
    const result = await window.__TAURI__.core.invoke('merge_video_audio', {
      videoPath,
      audioPath,
      outputName,
      outputDir: customOutputDir
    });

    // Ocultar loading
    loadingOverlay.classList.add('hidden');

    // Mostrar modal de éxito
    const fileName = result.split('/').pop();
    document.getElementById('result-msg').textContent = t('successMessage', { fileName });
    outputDir = result.substring(0, result.lastIndexOf('/'));
    document.getElementById('success-modal').classList.remove('hidden');
    mergeBtn.disabled = false;

  } catch (error) {
    // Ocultar loading
    loadingOverlay.classList.add('hidden');

    // Mostrar modal de error
    document.getElementById('error-msg').textContent = error;
    document.getElementById('error-modal').classList.remove('hidden');
    mergeBtn.disabled = false;
  }
}

async function openFolder() {
  if (outputDir) {
    try {
      await window.__TAURI__.core.invoke('open_folder', { path: outputDir });
      // Cerrar el modal después de abrir la carpeta
      // document.getElementById('success-modal').classList.add('hidden');
    } catch (error) {
      alert(t('errorOpenFolder', { error }));
    }
  }
}

function closeSuccessModal() {
  document.getElementById('success-modal').classList.add('hidden');
}

// --- Tab switching ---
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// --- Compress functions ---
async function selectCompressVideo() {
  try {
    const selected = await window.__TAURI__.dialog.open({
      multiple: false,
      filters: [{
        name: 'Video',
        extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm']
      }]
    });

    if (selected) {
      compressVideoPath = selected;
      document.getElementById('compress-video-name').textContent = selected.split('/').pop();
      checkReadyToCompress();
    }
  } catch (error) {
    console.error('Error selecting video:', error);
  }
}

async function selectCompressOutputFolder() {
  try {
    const selected = await window.__TAURI__.dialog.open({
      directory: true,
      multiple: false
    });

    if (selected) {
      compressCustomOutputDir = selected;
      const folderName = selected.split('/').pop();
      document.getElementById('compress-output-folder').textContent = `📁 ${folderName}`;
    }
  } catch (error) {
    console.error('Error selecting folder:', error);
  }
}

function checkReadyToCompress() {
  const compressBtn = document.getElementById('compress-btn');
  if (compressVideoPath) {
    compressBtn.disabled = false;
  }
}

async function compressVideo() {
  const defaultName = t('compressOutputPlaceholder');
  const baseName = document.getElementById('compress-output-name').value.trim() || defaultName;
  const outputName = baseName + '.mp4';

  const crf = parseInt(document.getElementById('crf-slider').value);
  const preset = document.getElementById('preset-select').value;
  const audioBitrate = document.getElementById('audio-bitrate-select').value;

  const loadingOverlay = document.getElementById('loading-overlay');
  const statusMsg = document.getElementById('status-msg');
  const statusDetail = document.getElementById('status-detail');
  const compressBtn = document.getElementById('compress-btn');

  loadingOverlay.classList.remove('hidden');
  compressBtn.disabled = true;
  statusMsg.textContent = t('preparingFiles');
  statusDetail.textContent = t('compressingWait');

  await new Promise(resolve => setTimeout(resolve, 100));

  statusMsg.textContent = t('compressingVideo');

  try {
    const result = await window.__TAURI__.core.invoke('compress_video', {
      videoPath: compressVideoPath,
      outputName,
      outputDir: compressCustomOutputDir,
      crf,
      preset,
      audioBitrate,
    });

    loadingOverlay.classList.add('hidden');

    const fileName = result.split('/').pop();
    document.getElementById('result-msg').textContent = t('successMessage', { fileName });
    compressOutputDir = result.substring(0, result.lastIndexOf('/'));
    outputDir = compressOutputDir;
    document.getElementById('success-modal').classList.remove('hidden');
    compressBtn.disabled = false;

  } catch (error) {
    loadingOverlay.classList.add('hidden');
    document.getElementById('error-msg').textContent = error;
    document.getElementById('error-modal').classList.remove('hidden');
    compressBtn.disabled = false;
  }
}

function closeErrorModal() {
  document.getElementById('error-modal').classList.add('hidden');
}

window.addEventListener("DOMContentLoaded", () => {
  console.log('DOM Content Loaded');

  // Initialize i18n and update UI
  window.i18n.updateUI();

  const selectVideoBtn = document.getElementById('select-video');
  const selectAudioBtn = document.getElementById('select-audio');
  const selectOutputBtn = document.getElementById('select-output');
  const mergeBtn = document.getElementById('merge-btn');
  const openFolderBtn = document.getElementById('open-folder-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const closeErrorBtn = document.getElementById('close-error-btn');
  const languageSelector = document.getElementById('language-selector');

  console.log('Buttons found:', { selectVideoBtn, selectAudioBtn, selectOutputBtn, mergeBtn, openFolderBtn, closeModalBtn, closeErrorBtn, languageSelector });

  if (selectVideoBtn) {
    selectVideoBtn.addEventListener('click', selectVideo);
    console.log('Video button listener added');
  }
  if (selectAudioBtn) {
    selectAudioBtn.addEventListener('click', selectAudio);
    console.log('Audio button listener added');
  }
  if (selectOutputBtn) {
    selectOutputBtn.addEventListener('click', selectOutputFolder);
    console.log('Output folder button listener added');
  }
  if (mergeBtn) {
    mergeBtn.addEventListener('click', mergeFiles);
    console.log('Merge button listener added');
  }
  if (openFolderBtn) {
    openFolderBtn.addEventListener('click', openFolder);
    console.log('Open folder button listener added');
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeSuccessModal);
    console.log('Close modal button listener added');
  }
  if (closeErrorBtn) {
    closeErrorBtn.addEventListener('click', closeErrorModal);
    console.log('Close error button listener added');
  }
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Compress tab buttons
  const selectCompressVideoBtn = document.getElementById('select-compress-video');
  const selectCompressOutputBtn = document.getElementById('select-compress-output');
  const compressBtn = document.getElementById('compress-btn');
  const crfSlider = document.getElementById('crf-slider');

  if (selectCompressVideoBtn) {
    selectCompressVideoBtn.addEventListener('click', selectCompressVideo);
  }
  if (selectCompressOutputBtn) {
    selectCompressOutputBtn.addEventListener('click', selectCompressOutputFolder);
  }
  if (compressBtn) {
    compressBtn.addEventListener('click', compressVideo);
  }
  if (crfSlider) {
    crfSlider.addEventListener('input', (e) => {
      document.getElementById('crf-value').textContent = e.target.value;
    });
  }

  if (languageSelector) {
    languageSelector.addEventListener('change', (e) => {
      window.i18n.setLanguage(e.target.value);
      // Reset file names to translated defaults if no files selected
      if (!videoPath) {
        document.getElementById('video-name').textContent = t('notSelected');
      }
      if (!audioPath) {
        document.getElementById('audio-name').textContent = t('notSelected');
      }
      if (!customOutputDir) {
        document.getElementById('output-folder').textContent = t('sameAsVideo');
      }
      if (!compressVideoPath) {
        document.getElementById('compress-video-name').textContent = t('notSelected');
      }
      if (!compressCustomOutputDir) {
        document.getElementById('compress-output-folder').textContent = t('sameAsVideo');
      }
    });
    console.log('Language selector listener added');
  }
});
