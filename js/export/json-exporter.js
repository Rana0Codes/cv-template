/**
 * JSON Data Exporter & Importer.
 * Allows users to backup and restore their resume data locally anytime.
 */

import { store } from '../store.js';

export function exportToJSON() {
  const state = store.getState();
  const rawName = state.basics.fullName || 'cv_data';
  const cleanName = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${cleanName}_data.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJSON(file, onSuccess, onError) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || !parsed.basics) {
        throw new Error('Invalid CV data format');
      }
      store.setState(parsed);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Import failed:', err);
      if (onError) onError(err);
      else alert('Failed to import JSON file. Please ensure it is a valid CV Template JSON backup.');
    }
  };
  reader.readAsText(file);
}
