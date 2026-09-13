/**
 * Responsive Zoom & Fit Controls for the Live A4 Preview paper.
 */

let activeZoom = 0.85;
let currentPreviewContainer = null;
let currentToolbarContainer = null;

export function applyZoom(zoom) {
  if (!currentPreviewContainer) return;
  activeZoom = Math.min(Math.max(zoom, 0.25), 1.6);
  const paper = currentPreviewContainer.querySelector('.cv-paper');
  const deskWrapper = currentPreviewContainer.querySelector('#cv-paper-desk-wrapper') || currentPreviewContainer;

  if (paper) {
    paper.style.transform = `scale(${activeZoom})`;
    paper.style.transformOrigin = 'top center';
    
    // Adjust desk wrapper height so scrolling isn't blocked or clipped
    const baseHeightPx = 1123; // 297mm at ~96dpi
    deskWrapper.style.minHeight = `${Math.round(baseHeightPx * activeZoom + 40)}px`;
  }

  if (currentToolbarContainer) {
    const label = currentToolbarContainer.querySelector('.zoom-value');
    if (label) {
      label.textContent = `${Math.round(activeZoom * 100)}%`;
    }
  }
}

export function autoFitZoom() {
  if (!currentPreviewContainer) return;
  const containerWidth = currentPreviewContainer.clientWidth;
  if (!containerWidth || containerWidth <= 0) return;

  // 210mm in px at 96dpi is ~794px
  const a4WidthPx = 794;
  const padding = containerWidth < 600 ? 20 : 64;
  const availableWidth = Math.max(containerWidth - padding, 240);
  const fitScale = Math.min(Number((availableWidth / a4WidthPx).toFixed(2)), 1.0);

  applyZoom(fitScale);
}

export function setupZoomControls(toolbarContainer, previewContainer) {
  currentToolbarContainer = toolbarContainer;
  currentPreviewContainer = previewContainer;

  toolbarContainer.innerHTML = `
    <div class="zoom-widget">
      <button type="button" class="btn-zoom" id="btn-zoom-out" title="Zoom Out">−</button>
      <span class="zoom-value">85%</span>
      <button type="button" class="btn-zoom" id="btn-zoom-in" title="Zoom In">+</button>
      <button type="button" class="btn-zoom-preset" id="btn-zoom-fit" title="Fit to screen">Fit</button>
      <button type="button" class="btn-zoom-preset" id="btn-zoom-reset" title="100% actual size">100%</button>
    </div>
  `;

  toolbarContainer.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
    applyZoom(activeZoom - 0.08);
  });

  toolbarContainer.querySelector('#btn-zoom-in')?.addEventListener('click', () => {
    applyZoom(activeZoom + 0.08);
  });

  toolbarContainer.querySelector('#btn-zoom-reset')?.addEventListener('click', () => {
    applyZoom(1.0);
  });

  toolbarContainer.querySelector('#btn-zoom-fit')?.addEventListener('click', () => {
    autoFitZoom();
  });

  // Listen to window resize for responsive fit if screen is smaller than A4
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 960) {
      autoFitZoom();
    }
  });

  // Initial smart zoom: If small screen, fit; otherwise comfortable 0.85
  if (window.innerWidth <= 960) {
    setTimeout(autoFitZoom, 60);
  } else {
    setTimeout(() => applyZoom(0.85), 60);
  }
}
