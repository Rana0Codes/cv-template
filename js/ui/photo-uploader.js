/**
 * Modern Photo Uploader with visible, high-contrast controls,
 * client-side canvas compression, and shape toggling.
 */

import { store } from '../store.js';

export function setupPhotoUploader(container) {
  const state = store.getState();
  const currentPhoto = state.basics.photoUrl || '';
  const currentShape = state.basics.photoShape || 'round';

  container.innerHTML = `
    <div class="photo-uploader-card">
      <div class="photo-avatar-wrap">
        ${currentPhoto 
          ? `<img src="${currentPhoto}" class="avatar-img ${currentShape}" id="photo-preview-element" alt="Profile photo preview">`
          : `<div class="avatar-placeholder ${currentShape}" id="photo-preview-element">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>`
        }
      </div>

      <div class="photo-details-col">
        <div class="photo-actions-row">
          <input type="file" id="photo-file-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
          <button type="button" class="btn-photo-upload" id="btn-trigger-photo-file">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span>Upload Photo</span>
          </button>
          ${currentPhoto ? `
            <button type="button" class="btn-photo-remove" id="btn-remove-photo" title="Remove current photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              <span>Remove</span>
            </button>
          ` : ''}
        </div>

        <div class="photo-controls-row">
          <div class="photo-shape-row">
            <span class="shape-title">Shape:</span>
            <div class="shape-pill-group">
              <button type="button" class="btn-shape-pill ${currentShape === 'round' ? 'active' : ''}" data-shape="round">
                ● Circle
              </button>
              <button type="button" class="btn-shape-pill ${currentShape === 'square' ? 'active' : ''}" data-shape="square">
                ■ Square
              </button>
            </div>
          </div>
          <label class="section-opt-toggle" title="Toggle photo display on CV">
            <input type="checkbox" id="check-photo-visible" ${state.visibleSections?.photo !== false ? 'checked' : ''}>
            <span>Show on CV</span>
          </label>
        </div>

        <span class="photo-format-hint">Formats: JPG, PNG, WebP • Auto-optimized for high-resolution A4 print</span>
      </div>
    </div>
  `;

  const fileInput = container.querySelector('#photo-file-input');
  const triggerBtn = container.querySelector('#btn-trigger-photo-file');
  const removeBtn = container.querySelector('#btn-remove-photo');
  const shapePills = container.querySelectorAll('.btn-shape-pill');
  const photoVisibleCheck = container.querySelector('#check-photo-visible');

  if (photoVisibleCheck) {
    photoVisibleCheck.addEventListener('change', (e) => {
      store.toggleSection('photo', e.target.checked);
    });
  }

  if (triggerBtn && fileInput) {
    triggerBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, or WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Downscale via canvas to keep localStorage light & fast
          const maxDim = 450;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          store.updateField('basics.photoUrl', compressedDataUrl);
          setupPhotoUploader(container);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      store.updateField('basics.photoUrl', '');
      setupPhotoUploader(container);
    });
  }

  shapePills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      const shape = e.currentTarget.getAttribute('data-shape');
      store.updateField('basics.photoShape', shape);
      shapePills.forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });
}
