/**
 * Template 2: Corporate Executive (Two-Column Sidebar)
 * Professional two-column layout with fixed accent sidebar, executive typography,
 * competency tags, structured academic table, and data-aware resilience.
 */

import { ICONS } from '../ui/icons.js';

export const template2 = {
  id: 'template-2',
  name: 'Corporate Executive',
  shortName: 'Executive',
  category: 'Leadership & Management',
  description: 'Two-column layout with executive accent sidebar, core competencies, and structured career history.',
  atsBadge: '96% ATS Match',

  render(data) {
    const basics = data.basics || {};
    const biodata = data.biodata || {};
    const summary = (data.summary || '').trim();
    const skills = data.skills || [];
    const experience = data.experience || [];
    const education = data.education || [];
    const languages = data.languages || [];
    const declaration = data.declaration || {};
    const visible = data.visibleSections || {};

    // 1. Sidebar Photo (Omitted completely if missing)
    const photoHtml = (basics.photoUrl && visible.photo !== false)
      ? `<div class="t2-profile-frame">
          <img src="${basics.photoUrl}" alt="${basics.fullName || 'Executive'}" class="t2-profile-img">
        </div>`
      : '';

    // 2. Sidebar Contact Items
    const contactItems = [];
    if (basics.phone) {
      contactItems.push(`
        <div class="t2-contact-item">
          <span class="t2-icon">${ICONS.phone}</span>
          <div class="t2-contact-text">
            <span class="t2-label">Phone</span>
            <a href="tel:${basics.phone}">${basics.phone}</a>
          </div>
        </div>
      `);
    }
    if (basics.email) {
      contactItems.push(`
        <div class="t2-contact-item">
          <span class="t2-icon">${ICONS.email}</span>
          <div class="t2-contact-text">
            <span class="t2-label">Email</span>
            <a href="mailto:${basics.email}">${basics.email}</a>
          </div>
        </div>
      `);
    }
    if (basics.location) {
      contactItems.push(`
        <div class="t2-contact-item">
          <span class="t2-icon">${ICONS.location}</span>
          <div class="t2-contact-text">
            <span class="t2-label">Location</span>
            <span>${basics.location}</span>
          </div>
        </div>
      `);
    }
    if (basics.linkedin) {
      const cleanLi = basics.linkedin.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/^linkedin\.com\/in\//i, '').replace(/\/$/, '');
      contactItems.push(`
        <div class="t2-contact-item">
          <span class="t2-icon">${ICONS.linkedin}</span>
          <div class="t2-contact-text">
            <span class="t2-label">LinkedIn</span>
            <a href="https://linkedin.com/in/${cleanLi}" target="_blank" rel="noopener">in/${cleanLi}</a>
          </div>
        </div>
      `);
    }
    if (basics.github) {
      const cleanGh = basics.github.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/^github\.com\//i, '').replace(/\/$/, '');
      contactItems.push(`
        <div class="t2-contact-item">
          <span class="t2-icon">${ICONS.github}</span>
          <div class="t2-contact-text">
            <span class="t2-label">GitHub</span>
            <a href="https://github.com/${cleanGh}" target="_blank" rel="noopener">github.com/${cleanGh}</a>
          </div>
        </div>
      `);
    }
    if (basics.website) {
      const cleanWeb = basics.website.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/\/$/, '');
      contactItems.push(`
        <div class="t2-contact-item">
          <span class="t2-icon">${ICONS.globe}</span>
          <div class="t2-contact-text">
            <span class="t2-label">Portfolio</span>
            <a href="https://${cleanWeb}" target="_blank" rel="noopener">${cleanWeb}</a>
          </div>
        </div>
      `);
    }

    // 3. Sidebar Skills
    const hasSkills = skills.length > 0 && skills.some(s => (s.items && s.items.length > 0) || (typeof s === 'string' && s.trim()));
    const skillsHtml = hasSkills ? `
      <div class="t2-sidebar-section">
        <h3 class="t2-sidebar-title">Core Competencies</h3>
        ${skills.map(s => {
          const catTitle = s.category;
          const items = Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []);
          if (items.length === 0) return '';
          return `
            <div class="t2-skill-category">
              ${catTitle ? `<p class="t2-cat-title">${catTitle}</p>` : ''}
              <div class="t2-pill-group">
                ${items.map(item => `<span class="t2-pill">${item}</span>`).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : '';

    // 4. Sidebar Languages
    const hasLanguages = languages.length > 0 && languages.some(l => l.name);
    const languagesHtml = hasLanguages ? `
      <div class="t2-sidebar-section">
        <h3 class="t2-sidebar-title">Languages Known</h3>
        <ul class="t2-language-list">
          ${languages.map(l => {
            if (!l.name) return '';
            return `
              <li>
                <strong>${l.name}</strong>
                ${l.level ? `<span class="t2-lang-level">${l.level}</span>` : ''}
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    ` : '';

    // 5. Optional Personal Particulars (For Biodata users)
    const biodataItems = [];
    if (biodata.nationality) biodataItems.push(`<li><span class="t2-detail-label">Nationality</span> <span class="t2-detail-val">${biodata.nationality}</span></li>`);
    if (biodata.gender) biodataItems.push(`<li><span class="t2-detail-label">Gender</span> <span class="t2-detail-val">${biodata.gender}</span></li>`);
    if (biodata.maritalStatus) biodataItems.push(`<li><span class="t2-detail-label">Marital Status</span> <span class="t2-detail-val">${biodata.maritalStatus}</span></li>`);
    if (biodata.dob) biodataItems.push(`<li><span class="t2-detail-label">Date of Birth</span> <span class="t2-detail-val">${biodata.dob}</span></li>`);
    if (biodata.address) biodataItems.push(`<li><span class="t2-detail-label">Address</span> <span class="t2-detail-val">${biodata.address}</span></li>`);

    const biodataHtml = (biodataItems.length > 0 && visible.biodata !== false) ? `
      <div class="t2-sidebar-section">
        <h3 class="t2-sidebar-title">Personal Details</h3>
        <ul class="t2-details-list">
          ${biodataItems.join('')}
        </ul>
      </div>
    ` : '';

    // 6. Main: Summary
    const summaryHtml = (summary && visible.summary !== false) ? `
      <section class="t2-main-section">
        <h3 class="t2-section-title">Executive Summary</h3>
        <p class="t2-summary-text">${summary}</p>
      </section>
    ` : '';

    // 7. Main: Experience
    const hasExperience = experience.length > 0 && experience.some(e => e.title || e.company);
    const experienceHtml = hasExperience ? `
      <section class="t2-main-section">
        <h3 class="t2-section-title">Professional Experience</h3>
        ${experience.map(exp => {
          if (!exp.title && !exp.company) return '';
          return `
            <div class="t2-experience-block">
              <div class="t2-exp-header">
                <h4 class="t2-exp-title">${exp.title || 'Role'}${exp.company ? ` — <span class="t2-company-name">${exp.company}</span>` : ''}</h4>
                ${exp.period ? `<span class="t2-exp-tag">${exp.period}</span>` : ''}
              </div>
              ${(exp.bullets && exp.bullets.length > 0) ? `
                <ul class="t2-custom-bullets">
                  ${exp.bullets.filter(b => b && b.trim()).map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `;
        }).join('')}
      </section>
    ` : '';

    // 8. Main: Education Table
    const hasEducation = education.length > 0 && education.some(edu => edu.degree || edu.institution);
    const educationHtml = hasEducation ? `
      <section class="t2-main-section">
        <h3 class="t2-section-title">Academic Background</h3>
        <div class="t2-table-wrapper">
          <table class="t2-academic-table">
            <thead>
              <tr>
                <th style="width: 40%;">Degree / Qualification</th>
                <th style="width: 38%;">Institution</th>
                <th style="width: 11%; text-align: center;">Year</th>
                <th style="width: 11%; text-align: center;">Score</th>
              </tr>
            </thead>
            <tbody>
              ${education.map(edu => {
                if (!edu.degree && !edu.institution) return '';
                return `
                  <tr>
                    <td><strong>${edu.degree || 'Degree'}</strong></td>
                    <td>${edu.institution || '—'}</td>
                    <td style="text-align: center;">${edu.year || '—'}</td>
                    <td style="text-align: center;"><strong>${edu.score || '—'}</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    ` : '';

    // 9. Main: Optional Declaration Block
    const declarationHtml = (declaration && declaration.enabled && visible.biodata !== false) ? `
      <footer class="t2-declaration-block">
        ${declaration.text ? `<p class="t2-declaration-text"><em>"${declaration.text}"</em></p>` : ''}
        <div class="t2-sign-container">
          <div class="t2-sign-left">
            ${declaration.place ? `<p><strong>Place:</strong> ${declaration.place}</p>` : ''}
            ${declaration.date ? `<p><strong>Date:</strong> ${declaration.date}</p>` : ''}
          </div>
          <div class="t2-sign-right">
            <p class="t2-name-caps"><strong>${declaration.signatureName || basics.fullName || ''}</strong></p>
            <span class="t2-sig-note">Signature of Candidate</span>
          </div>
        </div>
      </footer>
    ` : '';

    return `
      <div class="t2-document ${photoHtml ? 'has-photo' : 'no-photo'}">
        <!-- Left Sidebar -->
        <aside class="t2-sidebar">
          ${photoHtml}
          ${contactItems.length > 0 ? `
            <div class="t2-sidebar-section">
              <h3 class="t2-sidebar-title">Contact Info</h3>
              ${contactItems.join('')}
            </div>
          ` : ''}
          ${skillsHtml}
          ${languagesHtml}
          ${biodataHtml}
        </aside>

        <!-- Right Main Column -->
        <main class="t2-main">
          <header class="t2-main-header">
            <h1 class="t2-name">${(basics.fullName || 'Your Name').toUpperCase()}</h1>
            ${basics.headline ? `<div class="t2-role-badge">${basics.headline}</div>` : ''}
          </header>

          ${summaryHtml}
          ${experienceHtml}
          ${educationHtml}
          ${declarationHtml}
        </main>
      </div>
    `;
  }
};
