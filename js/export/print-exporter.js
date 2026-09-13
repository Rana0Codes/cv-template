/**
 * Vector Print-to-PDF Exporter.
 * Configures document title for default PDF filename and triggers browser print.
 */

import { store } from '../store.js';

export function exportToPDF() {
  const state = store.getState();
  const rawName = state.basics.fullName || 'My';
  const cleanName = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const originalTitle = document.title;

  // Ensure modal is visible for crisp vector printing
  const modal = document.getElementById('cv-preview-modal');
  if (modal && modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  window.print();

  // Restore title after print dialog closes
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
