/**
 * Main Application Orchestrator for CV Template.
 */

import { store } from './store.js';
import { DEMO_TECH, DEMO_EXECUTIVE, EMPTY_CV } from './defaults.js';
import { getTemplate } from './templates/index.js';
import { renderForm } from './ui/form-builder.js';
import { setupTemplatePicker } from './ui/template-picker.js';
import { setupZoomControls, autoFitZoom } from './ui/zoom-controls.js';
import { exportToPDF } from './export/print-exporter.js';

export const FONT_MAP = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  corporate: "'Plus Jakarta Sans', Calibri, 'Trebuchet MS', 'Segoe UI', sans-serif",
  serif: "'Merriweather', Georgia, 'Times New Roman', serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
};

document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.getElementById('form-container');
  const previewPaper = document.getElementById('cv-paper');
  const templatePickerSlot = document.getElementById('template-picker-slot');
  const canvasTemplateBar = document.getElementById('canvas-template-bar');
  const zoomControlsSlot = document.getElementById('zoom-controls-slot');
  const previewArea = document.getElementById('preview-area');
  const cvPreviewModal = document.getElementById('cv-preview-modal');
  const btnHeaderPreview = document.getElementById('btn-header-preview');
  const btnClosePreview = document.getElementById('btn-close-preview');
  const btnModalDownloadPdf = document.getElementById('btn-modal-download-pdf');
  const previewActiveTplBadge = document.getElementById('preview-active-tpl-badge');

  // Initialize UI components
  renderForm(formContainer);
  setupTemplatePicker(templatePickerSlot, canvasTemplateBar);
  setupZoomControls(zoomControlsSlot, previewArea);

  // Render preview initially
  renderPreview();

  // Sync active preset button on load
  const initialState = store.getState();
  if (initialState.basics?.fullName === 'Alexander Wright') {
    setActivePresetPill('tech');
  } else if (initialState.basics?.fullName === 'Elena Vance') {
    setActivePresetPill('exec');
  } else {
    setActivePresetPill('empty');
  }

  // Subscribe to store updates
  store.subscribe(() => {
    renderPreview();
  });

  // Preset Buttons (Demo profiles) - Order: 1. Blank, 2. Tech Demo, 3. Executive Demo
  function setActivePresetPill(presetId) {
    document.querySelectorAll('.btn-preset-pill').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`btn-preset-${presetId}`);
    if (activeBtn) activeBtn.classList.add('active');

    const mobileSelect = document.getElementById('mobile-preset-select');
    if (mobileSelect) mobileSelect.value = presetId;
  }

  function loadEmptyPreset() {
    store.loadPreset(EMPTY_CV);
    renderForm(formContainer);
    setupTemplatePicker(templatePickerSlot, canvasTemplateBar);
    setActivePresetPill('empty');
    showToast('Created Blank CV — Start typing your details', 'info');
  }

  function loadTechPreset() {
    store.loadPreset(DEMO_TECH);
    renderForm(formContainer);
    setupTemplatePicker(templatePickerSlot, canvasTemplateBar);
    setActivePresetPill('tech');
    showToast('Loaded Demo: Alexander Wright (Tech Architect)', 'success');
  }

  function loadExecPreset() {
    store.loadPreset(DEMO_EXECUTIVE);
    renderForm(formContainer);
    setupTemplatePicker(templatePickerSlot, canvasTemplateBar);
    setActivePresetPill('exec');
    showToast('Loaded Demo: Elena Vance (Operations Director)', 'success');
  }

  document.getElementById('btn-preset-empty')?.addEventListener('click', loadEmptyPreset);
  document.getElementById('btn-preset-tech')?.addEventListener('click', loadTechPreset);
  document.getElementById('btn-preset-exec')?.addEventListener('click', loadExecPreset);

  document.getElementById('mobile-preset-select')?.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'empty') loadEmptyPreset();
    else if (val === 'tech') loadTechPreset();
    else if (val === 'exec') loadExecPreset();
  });

  // Download PDF Action
  document.getElementById('btn-download-pdf')?.addEventListener('click', () => {
    exportToPDF();
  });

  function showToast(message, type = 'info') {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    const icon = type === 'success' ? '✓' : 'ℹ';
    toast.innerHTML = `<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:${type === 'success' ? '#059669' : '#0f766e'};color:#fff;font-size:11px;font-weight:bold;">${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  // Preview Modal Handlers
  function openPreviewModal() {
    if (cvPreviewModal) {
      cvPreviewModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (btnViewPreview && btnViewEdit) {
        btnViewPreview.classList.add('active');
        btnViewEdit.classList.remove('active');
      }
      renderPreview();
      setTimeout(autoFitZoom, 60);
    }
  }

  function closePreviewModal() {
    if (cvPreviewModal) {
      cvPreviewModal.classList.add('hidden');
      document.body.style.overflow = '';
      if (btnViewEdit && btnViewPreview) {
        btnViewEdit.classList.add('active');
        btnViewPreview.classList.remove('active');
      }
    }
  }

  btnHeaderPreview?.addEventListener('click', openPreviewModal);
  btnClosePreview?.addEventListener('click', closePreviewModal);
  btnModalDownloadPdf?.addEventListener('click', () => {
    exportToPDF();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const atsModal = document.getElementById('ats-checklist-modal');
      if (atsModal && !atsModal.classList.contains('hidden')) {
        atsModal.classList.add('hidden');
        return;
      }
      if (cvPreviewModal && !cvPreviewModal.classList.contains('hidden')) {
        closePreviewModal();
      }
    }
  });

  // Mobile View Switcher (Edit vs Preview tabs)
  const btnViewEdit = document.getElementById('btn-tab-edit');
  const btnViewPreview = document.getElementById('btn-tab-preview');

  if (btnViewEdit && btnViewPreview) {
    btnViewEdit.addEventListener('click', () => {
      btnViewEdit.classList.add('active');
      btnViewPreview.classList.remove('active');
      closePreviewModal();
    });

    btnViewPreview.addEventListener('click', () => {
      btnViewPreview.classList.add('active');
      btnViewEdit.classList.remove('active');
      openPreviewModal();
    });
  }

  function renderPreview() {
    const state = store.getState();
    const templateRenderer = getTemplate(state.selectedTemplate);
    if (previewPaper) {
      const visible = state.visibleSections || {};
      const classList = ['cv-paper', state.selectedTemplate];
      if (visible.photo === false) classList.push('hide-photo');
      if (visible.summary === false) classList.push('hide-summary');
      if (visible.biodata === false) classList.push('hide-biodata');
      previewPaper.className = classList.join(' ');

      previewPaper.innerHTML = templateRenderer.render(state);
      previewPaper.style.setProperty('--theme-accent', state.themeColor || '#0f766e');

      const fontStack = FONT_MAP[state.fontFamily] || FONT_MAP.sans;
      previewPaper.style.setProperty('--theme-font', fontStack);
      previewPaper.style.fontFamily = fontStack;
    }
    if (previewActiveTplBadge) {
      const tpl = getTemplate(state.selectedTemplate);
      previewActiveTplBadge.textContent = 'Template: ' + (tpl.shortName || tpl.name);
    }
  }

  // Unregister legacy service workers and purge caches to guarantee live updates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      for (const key of keys) {
        caches.delete(key);
      }
    });
  }
});
