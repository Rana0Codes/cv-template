/**
 * Template 1: Modern Clean (Single Column)
 * Contemporary, tech-forward single-column layout with crisp typography,
 * categorical skills matrix, micro-icons, and complete data-aware resilience.
 */

import { ICONS } from '../ui/icons.js';

export const template1 = {
  id: 'template-1',
  name: 'Modern Clean',
  shortName: 'Modern',
  category: 'Tech & Modern Professional',
  description: 'Crisp single-column layout with contemporary typography, categorical skills, and clean section dividers.',
  atsBadge: '98% ATS Match',

  render(data) {
    const basics = data.basics || {};
    const summary = (data.summary || '').trim();
    const skills = data.skills || [];
    const experience = data.experience || [];
    const education = data.education || [];
    const languages = data.languages || [];
    const visible = data.visibleSections || {};

    // 1. Header Photo (Only if provided and not hidden)
    const photoHtml = (basics.photoUrl && visible.photo !== false)
      ? `<div class="t1-photo-wrap">
          <img src="${basics.photoUrl}" alt="${basics.fullName || 'Profile'}" class="t1-profile-photo">
        </div>`
      : '';

    // 2. Contact Items (Only populated items, using crisp SVG icons)
    const contacts = [];
    if (basics.location) {
      contacts.push(`<span class="t1-contact-item">${ICONS.location}<span>${basics.location}</span></span>`);
    }
    if (basics.email) {
      contacts.push(`<span class="t1-contact-item">${ICONS.email}<a href="mailto:${basics.email}">${basics.email}</a></span>`);
    }
    if (basics.phone) {
      contacts.push(`<span class="t1-contact-item">${ICONS.phone}<a href="tel:${basics.phone}">${basics.phone}</a></span>`);
    }
    if (basics.linkedin) {
      const cleanLi = basics.linkedin.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/^linkedin\.com\/in\//i, '').replace(/\/$/, '');
      contacts.push(`<span class="t1-contact-item">${ICONS.linkedin}<a href="https://linkedin.com/in/${cleanLi}" target="_blank" rel="noopener">linkedin.com/in/${cleanLi}</a></span>`);
    }
    if (basics.github) {
      const cleanGh = basics.github.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/^github\.com\//i, '').replace(/\/$/, '');
      contacts.push(`<span class="t1-contact-item">${ICONS.github}<a href="https://github.com/${cleanGh}" target="_blank" rel="noopener">github.com/${cleanGh}</a></span>`);
    }
    if (basics.website) {
      const cleanWeb = basics.website.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/\/$/, '');
      contacts.push(`<span class="t1-contact-item">${ICONS.globe}<a href="https://${cleanWeb}" target="_blank" rel="noopener">${cleanWeb}</a></span>`);
    }

    // 3. Professional Summary (Completely omitted if empty)
    const summaryHtml = (summary && visible.summary !== false) ? `
      <section class="t1-section">
        <h2 class="t1-section-title">Professional Summary</h2>
        <p class="t1-summary-text">${summary}</p>
      </section>
    ` : '';

    // 4. Skills (Supports category objects or plain items; omitted if empty)
    const hasSkills = skills.length > 0 && skills.some(s => (s.items && s.items.length > 0) || (typeof s === 'string' && s.trim()));
    const skillsHtml = hasSkills ? `
      <section class="t1-section">
        <h2 class="t1-section-title">Skills & Competencies</h2>
        <div class="t1-skills-grid">
          ${skills.map(s => {
            const catTitle = s.category || 'Core Skills';
            const items = Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []);
            if (items.length === 0) return '';
            return `
              <div class="t1-skill-category">
                <h3 class="t1-skill-heading">${catTitle}</h3>
                <div class="t1-skill-pills">
                  ${items.map(item => `<span class="t1-skill-tag">${item}</span>`).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    ` : '';

    // 5. Experience (Omitted if empty)
    const hasExperience = experience.length > 0 && experience.some(e => e.title || e.company);
    const experienceHtml = hasExperience ? `
      <section class="t1-section">
        <h2 class="t1-section-title">Work Experience</h2>
        ${experience.map(exp => {
          if (!exp.title && !exp.company) return '';
          return `
            <div class="t1-experience-item">
              <div class="t1-exp-header">
                <h3 class="t1-exp-title">${exp.title || 'Role'}</h3>
                ${exp.period ? `<span class="t1-exp-date">${exp.period}</span>` : ''}
              </div>
              ${exp.company ? `<div class="t1-exp-company">${exp.company}</div>` : ''}
              ${(exp.bullets && exp.bullets.length > 0) ? `
                <ul class="t1-exp-bullets">
                  ${exp.bullets.filter(b => b && b.trim()).map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `;
        }).join('')}
      </section>
    ` : '';

    // 6. Education (Omitted if empty)
    const hasEducation = education.length > 0 && education.some(edu => edu.degree || edu.institution);
    const educationHtml = hasEducation ? `
      <section class="t1-section">
        <h2 class="t1-section-title">Education</h2>
        ${education.map(edu => {
          if (!edu.degree && !edu.institution) return '';
          return `
            <div class="t1-edu-item">
              <div class="t1-edu-header">
                <h3 class="t1-edu-degree">${edu.degree || 'Degree'}</h3>
                ${edu.year ? `<span class="t1-edu-date">${edu.year}</span>` : ''}
              </div>
              <div class="t1-edu-subrow">
                <span class="t1-edu-school">${edu.institution || ''}</span>
                ${edu.score ? `<span class="t1-edu-score">Grade: <strong>${edu.score}</strong></span>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </section>
    ` : '';

    // 7. Languages (Omitted if empty)
    const hasLanguages = languages.length > 0 && languages.some(l => l.name);
    const languagesHtml = hasLanguages ? `
      <section class="t1-section">
        <h2 class="t1-section-title">Languages</h2>
        <div class="t1-language-grid">
          ${languages.map(l => {
            if (!l.name) return '';
            return `
              <div class="t1-language-item">
                <span class="t1-language-name">${l.name}</span>
                ${l.level ? `<span class="t1-language-level">${l.level}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    ` : '';

    return `
      <div class="t1-container ${photoHtml ? 'has-photo' : 'no-photo'}">
        <!-- Header -->
        <header class="t1-header">
          ${photoHtml}
          <div class="t1-header-content">
            <h1 class="t1-name">${basics.fullName || 'Your Name'}</h1>
            ${basics.headline ? `<p class="t1-tagline">${basics.headline}</p>` : ''}
            ${contacts.length > 0 ? `
              <div class="t1-contacts">
                ${contacts.join('')}
              </div>
            ` : ''}
          </div>
        </header>

        <!-- Body Sections -->
        ${summaryHtml}
        ${skillsHtml}
        ${experienceHtml}
        ${educationHtml}
        ${languagesHtml}
      </div>
    `;
  }
};
