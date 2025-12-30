// Translation system for Video Audio Merger

const translations = {
  en: {
    // Page title and main header
    title: 'Mux - Video and Audio Merger',
    mainHeader: 'Mux - Video and Audio Merger',

    // File selection section
    videoLabel: '📹 Video',
    audioLabel: '🎵 Audio',
    outputFolderLabel: '📁 Output folder',
    outputNameLabel: '💾 Output name',

    // Buttons
    selectButton: 'Select',
    mergeButton: 'Merge',
    openFolderButton: 'Open folder',
    closeButton: 'Close',

    // File status
    notSelected: 'Not selected',
    sameAsVideo: 'Same folder as video',

    // Loading overlay
    preparingFiles: 'Preparing files...',
    mergingFiles: 'Merging video and audio...',
    processingWait: 'This may take several minutes depending on file size',

    // Success modal
    successTitle: 'Success!',
    successMessage: 'The file "{fileName}" has been created successfully.',

    // Error modal
    errorTitle: 'Error',
    errorOpenFolder: 'Error opening folder: {error}',

    // Placeholder
    outputPlaceholder: 'merged_video',

    // Language selector
    languageLabel: '🌐',
  },
  es: {
    // Page title and main header
    title: 'Mux - Video y Audio Fusionador',
    mainHeader: 'Mux - Video y Audio Fusionador',

    // File selection section
    videoLabel: '📹 Video',
    audioLabel: '🎵 Audio',
    outputFolderLabel: '📁 Carpeta de salida',
    outputNameLabel: '💾 Nombre de salida',

    // Buttons
    selectButton: 'Seleccionar',
    mergeButton: 'Fusionar',
    openFolderButton: 'Abrir carpeta',
    closeButton: 'Cerrar',

    // File status
    notSelected: 'Sin seleccionar',
    sameAsVideo: 'Misma carpeta que el video',

    // Loading overlay
    preparingFiles: 'Preparando archivos...',
    mergingFiles: 'Fusionando video y audio...',
    processingWait: 'Esto puede tardar varios minutos dependiendo del tamaño de los archivos',

    // Success modal
    successTitle: '¡Éxito!',
    successMessage: 'El archivo "{fileName}" ha sido creado exitosamente.',

    // Error modal
    errorTitle: 'Error',
    errorOpenFolder: 'Error al abrir carpeta: {error}',

    // Placeholder
    outputPlaceholder: 'video_fusionado',

    // Language selector
    languageLabel: '🌐',
  }
};

class I18n {
  constructor() {
    this.currentLanguage = this.loadLanguage();
  }

  loadLanguage() {
    const saved = localStorage.getItem('language');
    return saved || 'en'; // Default to English
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      this.updateUI();
    }
  }

  t(key, params = {}) {
    let text = translations[this.currentLanguage][key] || key;

    // Replace parameters in text
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });

    return text;
  }

  updateUI() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });

    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Update document title
    document.title = this.t('title');

    // Update language attribute
    document.documentElement.lang = this.currentLanguage;

    // Update language selector value
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
      langSelector.value = this.currentLanguage;
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// Export i18n instance
window.i18n = new I18n();
