/**
 * Unified Template Picker & Visual Styler Component for CV Template.
 * Single source of truth using TEMPLATE_LIST from templates registry.
 * Zero duplicate lists, zero disconnected labels.
 */

import { store } from '../store.js';
import { TEMPLATE_LIST, getTemplate } from '../templates/index.js';

export const THEME_COLORS = [
  { id: 'teal', hex: '#0f766e', label: 'Corporate Teal' },
  { id: 'navy', hex: '#1e3a8a', label: 'Royal Navy' },
  { id: 'emerald', hex: '#059669', label: 'Emerald Green' },
  { id: 'indigo', hex: '#4f46e5', label: 'Indigo Purple' },
  { id: 'burgundy', hex: '#881337', label: 'Executive Burgundy' },
  { id: 'slate', hex: '#334155', label: 'Slate Charcoal' }
];

export const FONT_OPTIONS = [
  { id: 'sans', label: 'Modern Sans (Inter)' },
  { id: 'corporate', label: 'Corporate (Plus Jakarta)' },
  { id: 'serif', label: 'Classic Serif (Merriweather)' },
  { id: 'mono', label: 'Technical Mono' }
];

let isStoreSubscribed = false;

/**
 * Initialize template picker and style customizers.
 * @param {HTMLElement} [headerContainer] - Kept empty to maintain clean minimalist header
 * @param {HTMLElement} [canvasToolbarContainer] - Preview modal template switcher slot
 * @param {HTMLElement} [studioToolbarContainer] - In-editor studio template strip slot
 */
export function setupTemplatePicker(headerContainer, canvasToolbarContainer, studioToolbarContainer) {
  const state = store.getState();
  const activeId = state.selectedTemplate || 'template-1';
  const activeTheme = state.themeColor || '#0f766e';
  const activeFont = state.fontFamily || 'sans';

  // 1. Header is kept clean with only Brand, Demo Switcher, and Primary Actions
  if (headerContainer) {
    headerContainer.innerHTML = '';
  }

  // 2. Render Template & Style Bar in Editor
  const studioSlot = studioToolbarContainer || document.getElementById('studio-template-bar-slot');
  if (studioSlot) {
    renderStudioTemplateBar(studioSlot, activeId, activeTheme, activeFont);
  }

  // 3. Render Synchronized Template Switcher in Preview Modal Toolbar
  if (canvasToolbarContainer) {
    canvasToolbarContainer.innerHTML = `
      <div class="template-quick-bar" role="tablist" aria-label="Template Switcher">
        ${TEMPLATE_LIST.map((t) => `
          <button type="button" 
                  class="btn-quick-tpl ${t.id === activeId ? 'active' : ''}" 
                  data-tid="${t.id}"
                  title="${t.name}: ${t.description}">
            <span class="tpl-name">${t.shortName || t.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    canvasToolbarContainer.querySelectorAll('.btn-quick-tpl').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tid = e.currentTarget.getAttribute('data-tid');
        if (tid) {
          store.setTemplate(tid);
        }
      });
    });
  }

  // 4. Render Live Accent Palette & Font Selector in Preview Modal Toolbar
  const canvasStyleBar = document.getElementById('canvas-style-bar');
  if (canvasStyleBar) {
    canvasStyleBar.innerHTML = `
      <div class="modal-theme-strip">
        <span class="studio-theme-label">Accent:</span>
        <div class="theme-swatches-group">
          ${THEME_COLORS.map(c => `
            <button type="button" 
                    class="theme-swatch ${c.hex.toLowerCase() === activeTheme.toLowerCase() ? 'active' : ''}" 
                    data-hex="${c.hex}" 
                    style="background-color: ${c.hex};" 
                    title="${c.label}">
            </button>
          `).join('')}
        </div>
      </div>
      <div class="modal-font-strip" style="display:inline-flex; align-items:center; gap:6px; margin-left:8px;">
        <span class="studio-theme-label">Font:</span>
        <select class="canvas-font-select" aria-label="Preview Typography">
          ${FONT_OPTIONS.map(f => `<option value="${f.id}" ${f.id === activeFont ? 'selected' : ''}>${f.label}</option>`).join('')}
        </select>
      </div>
    `;
    canvasStyleBar.querySelectorAll('.theme-swatch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hex = e.currentTarget.getAttribute('data-hex');
        if (hex) store.setThemeColor(hex);
      });
    });
    canvasStyleBar.querySelector('.canvas-font-select')?.addEventListener('change', (e) => {
      store.setFontFamily(e.target.value);
    });
  }

  // 5. Subscribe to store changes once for seamless synchronization
  if (!isStoreSubscribed) {
    store.subscribe((newState) => {
      updateActiveStates(
        newState.selectedTemplate,
        newState.themeColor,
        newState.fontFamily
      );
    });
    isStoreSubscribed = true;
  }
}

/**
 * Render clean in-studio template switcher, style customizer, and role guidance banner.
 * @param {HTMLElement} container
 * @param {string} activeId
 * @param {string} activeTheme
 * @param {string} activeFont
 */
function renderStudioTemplateBar(container, activeId, activeTheme = '#0f766e', activeFont = 'sans') {
  const currentTpl = getTemplate(activeId);

  container.innerHTML = `
    <div class="studio-template-bar">
      <!-- Top Row: Template Pills & Styling Controls -->
      <div class="studio-bar-top">
        <div class="studio-bar-section template-section">
          <span class="studio-row-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Design Layout:
          </span>
          <div class="studio-tpl-switcher" role="tablist" aria-label="Resume Design Template">
            ${TEMPLATE_LIST.map((t) => `
              <button type="button" 
                      class="btn-studio-tpl ${t.id === activeId ? 'active' : ''}" 
                      data-tid="${t.id}"
                      title="${t.name}: ${t.description}">
                <span class="studio-pill-name">${t.shortName || t.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="studio-bar-section style-section">
          <div class="studio-style-item">
            <span class="studio-row-label">Accent:</span>
            <div class="theme-swatches-group">
              ${THEME_COLORS.map(c => `
                <button type="button" 
                        class="theme-swatch ${c.hex.toLowerCase() === activeTheme.toLowerCase() ? 'active' : ''}" 
                        data-hex="${c.hex}" 
                        style="background-color: ${c.hex};" 
                        title="${c.label}">
                </button>
              `).join('')}
              <label class="theme-picker-label" title="Custom Accent Color">
                <input type="color" class="theme-color-input" value="${activeTheme}">
                <span class="theme-picker-icon">🎨</span>
              </label>
            </div>
          </div>

          <div class="studio-style-item">
            <span class="studio-row-label">Font:</span>
            <select class="studio-font-select" aria-label="Resume Typography">
              ${FONT_OPTIONS.map(f => `<option value="${f.id}" ${f.id === activeFont ? 'selected' : ''}>${f.label}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Live Template Guidance Banner -->
      <div class="studio-tpl-guide-banner" id="studio-tpl-guide-banner">
        <div class="guide-banner-left">
          <span class="guide-badge">${currentTpl.category}</span>
          <span class="guide-text">${currentTpl.description}</span>
        </div>
        <span class="guide-ats-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ${currentTpl.atsBadge}
        </span>
      </div>
    </div>
  `;

  // Pill click handlers
  container.querySelectorAll('.btn-studio-tpl').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tid = e.currentTarget.getAttribute('data-tid');
      if (tid) {
        store.setTemplate(tid);
      }
    });
  });

  // Theme color swatches & custom input
  container.querySelectorAll('.theme-swatch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const hex = e.currentTarget.getAttribute('data-hex');
      if (hex) store.setThemeColor(hex);
    });
  });

  container.querySelectorAll('.theme-color-input').forEach(input => {
    input.addEventListener('input', (e) => {
      store.setThemeColor(e.target.value);
    });
  });

  container.querySelectorAll('.studio-font-select').forEach(select => {
    select.addEventListener('change', (e) => {
      store.setFontFamily(e.target.value);
    });
  });
}

/**
 * Synchronize active states across template selectors, style controls, and guide banner.
 * @param {string} activeId
 * @param {string} [activeTheme]
 * @param {string} [activeFont]
 */
function updateActiveStates(activeId, activeTheme, activeFont) {
  const currentTheme = activeTheme || store.getState().themeColor || '#0f766e';
  const currentFont = activeFont || store.getState().fontFamily || 'sans';
  const currentTpl = getTemplate(activeId);

  // Update studio bar pills
  document.querySelectorAll('.btn-studio-tpl').forEach(btn => {
    if (btn.getAttribute('data-tid') === activeId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update preview modal toolbar pills
  document.querySelectorAll('.btn-quick-tpl').forEach(btn => {
    if (btn.getAttribute('data-tid') === activeId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update guide banner text & badge
  const guideBanner = document.getElementById('studio-tpl-guide-banner');
  if (guideBanner) {
    guideBanner.innerHTML = `
      <div class="guide-banner-left">
        <span class="guide-badge">${currentTpl.category}</span>
        <span class="guide-text">${currentTpl.description}</span>
      </div>
      <span class="guide-ats-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ${currentTpl.atsBadge}
      </span>
    `;
  }

  // Update theme swatches and color inputs
  document.querySelectorAll('.theme-swatch').forEach(btn => {
    const btnHex = btn.getAttribute('data-hex');
    if (btnHex && btnHex.toLowerCase() === currentTheme.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.theme-color-input').forEach(input => {
    input.value = currentTheme;
  });

  // Update font selectors
  document.querySelectorAll('.studio-font-select, .canvas-font-select').forEach(sel => {
    sel.value = currentFont;
  });
}
