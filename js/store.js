/**
 * Reactive State Management for CV Template.
 * Handles state updates, subscriber notifications, and localStorage persistence.
 */

import { EMPTY_CV } from './defaults.js';

const STORAGE_KEY = 'cv_template_state_v1';

class CVStore {
  constructor() {
    this.subscribers = new Set();
    this.state = this.loadInitialState();
  }

  /**
   * Load state from localStorage or fallback to clean EMPTY_CV (Blank) preset.
   */
  loadInitialState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.basics && parsed.selectedTemplate) {
          if (!parsed.fontFamily) parsed.fontFamily = 'sans';
          if (!parsed.themeColor) parsed.themeColor = '#0f766e';
          if (!parsed.visibleSections) {
            parsed.visibleSections = { photo: true, summary: true, biodata: true };
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not load saved state from localStorage:', err);
    }
    const initial = JSON.parse(JSON.stringify(EMPTY_CV));
    initial.fontFamily = initial.fontFamily || 'sans';
    initial.themeColor = initial.themeColor || '#0f766e';
    initial.visibleSections = initial.visibleSections || { photo: true, summary: true, biodata: true };
    return initial;
  }

  /**
   * Persist current state to localStorage.
   */
  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (err) {
      console.warn('Failed to save state to localStorage:', err);
    }
  }

  /**
   * Get current state snapshot.
   */
  getState() {
    return this.state;
  }

  /**
   * Update full state or deep merge.
   * @param {Object} newState
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.saveState();
    this.notify();
  }

  /**
   * Update a specific nested property path.
   * @param {string} path Dot notation path, e.g. 'basics.fullName'
   * @param {any} value
   */
  updateField(path, value) {
    const keys = path.split('.');
    let current = this.state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    this.saveState();
    this.notify();
  }

  /**
   * Set active theme accent color.
   * @param {string} hexColor
   */
  setThemeColor(hexColor) {
    this.state.themeColor = hexColor;
    this.saveState();
    this.notify();
  }

  /**
   * Set active font family ('sans', 'corporate', 'serif', 'mono').
   * @param {string} fontId
   */
  setFontFamily(fontId) {
    this.state.fontFamily = fontId;
    this.saveState();
    this.notify();
  }

  /**
   * Toggle visibility of a specific section ('photo', 'summary', 'biodata').
   * @param {string} sectionKey
   * @param {boolean} [forceState]
   */
  toggleSection(sectionKey, forceState) {
    if (!this.state.visibleSections) {
      this.state.visibleSections = { photo: true, summary: true, biodata: true };
    }
    const current = this.state.visibleSections[sectionKey] !== false;
    this.state.visibleSections[sectionKey] = forceState !== undefined ? forceState : !current;
    this.saveState();
    this.notify();
  }

  /**
   * Select an active template.
   * @param {string} templateId
   */
  setTemplate(templateId) {
    this.state.selectedTemplate = templateId;
    this.saveState();
    this.notify();
  }

  /**
   * Reset or replace state with a specific preset.
   * @param {Object} preset
   */
  loadPreset(preset) {
    this.state = JSON.parse(JSON.stringify(preset));
    this.saveState();
    this.notify();
  }

  /**
   * Subscribe to state changes.
   * @param {Function} callback
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all registered subscribers of state change.
   */
  notify() {
    for (const callback of this.subscribers) {
      try {
        callback(this.state);
      } catch (err) {
        console.error('Subscriber callback error:', err);
      }
    }
  }
}

export const store = new CVStore();
