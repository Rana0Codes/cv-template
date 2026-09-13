/**
 * Template 4: Creative Timeline (Modern Asymmetrical / Timeline Axis)
 * Contemporary design with an integrated vertical timeline connecting milestones,
 * stylish badge pills, and complete data-aware resilience.
 */

import { ICONS } from '../ui/icons.js';

export const template4 = {
  id: 'template-4',
  name: 'Creative Timeline',
  shortName: 'Creative',
  category: 'Creative & Portfolio',
  description: 'Modern asymmetrical design with chronological career timeline milestones and visual skill badges.',
  atsBadge: '95% ATS Match',

  render(data) {
    const basics = data.basics || {};
    const summary = (data.summary || '').trim();
    const skills = data.skills || [];
    const experience = data.experience || [];
    const education = data.education || [];
    const languages = data.languages || [];
    const visible = data.visibleSections || {};

    // 1. Photo Avatar
    const photoHtml = (basics.photoUrl && visible.photo !== false)
      ? `<div class="t4-photo-wrap">
          <img src="${basics.photoUrl}" alt="${basics.fullName || 'Candidate'}" class="t4-avatar">
        </div>`
      : '';

    // 2. Contact Badges
    const contactBadges = [];
    if (basics.email) {
      contactBadges.push(`<a href="mailto:${basics.email}" class="t4-badge">${ICONS.email}<span>${basics.email}</span></a>`);
    }
    if (basics.phone) {
      contactBadges.push(`<a href="tel:${basics.phone}" class="t4-badge">${ICONS.phone}<span>${basics.phone}</span></a>`);
    }
    if (basics.location) {
      contactBadges.push(`<span class="t4-badge">${ICONS.location}<span>${basics.location}</span></span>`);
    }
    if (basics.linkedin) {
      const cleanLi = basics.linkedin.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/^linkedin\.com\/in\//i, '').replace(/\/$/, '');
      contactBadges.push(`<a href="https://linkedin.com/in/${cleanLi}" target="_blank" rel="noopener" class="t4-badge">${ICONS.linkedin}<span>in/${cleanLi}</span></a>`);
    }
    if (basics.github) {
      const cleanGh = basics.github.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/^github\.com\//i, '').replace(/\/$/, '');
      contactBadges.push(`<a href="https://github.com/${cleanGh}" target="_blank" rel="noopener" class="t4-badge">${ICONS.github}<span>${cleanGh}</span></a>`);
    }
    if (basics.website) {
      const cleanWeb = basics.website.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/\/$/, '');
      contactBadges.push(`<a href="https://${cleanWeb}" target="_blank" rel="noopener" class="t4-badge">${ICONS.globe}<span>${cleanWeb}</span></a>`);
    }

    // 3. Summary Callout
    const summaryHtml = (summary && visible.summary !== false) ? `
      <section class="t4-summary-card">
        <p>${summary}</p>
      </section>
    ` : '';

    // 4. Experience Timeline
    const hasExperience = experience.length > 0 && experience.some(e => e.title || e.company);
    const expTimeline = hasExperience ? `
      <section class="t4-section">
        <h2 class="t4-sec-title">Career Milestones</h2>
        <div class="t4-timeline">
          ${experience.map(exp => {
            if (!exp.title && !exp.company) return '';
            return `
              <div class="t4-tl-item">
                <div class="t4-tl-node"></div>
                <div class="t4-tl-content">
                  <div class="t4-tl-header">
                    <h3 class="t4-tl-title">${exp.title || 'Role'}</h3>
                    ${exp.period ? `<span class="t4-tl-date">${exp.period}</span>` : ''}
                  </div>
                  ${exp.company ? `<div class="t4-tl-org">${exp.company}</div>` : ''}
                  ${(exp.bullets && exp.bullets.length > 0) ? `
                    <ul class="t4-bullets">
                      ${exp.bullets.filter(b => b && b.trim()).map(b => `<li>${b}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    ` : '';

    // 5. Education Timeline
    const hasEducation = education.length > 0 && education.some(edu => edu.degree || edu.institution);
    const eduTimeline = hasEducation ? `
      <section class="t4-section">
        <h2 class="t4-sec-title">Academic Milestones</h2>
        <div class="t4-timeline">
          ${education.map(edu => {
            if (!edu.degree && !edu.institution) return '';
            return `
              <div class="t4-tl-item">
                <div class="t4-tl-node"></div>
                <div class="t4-tl-content">
                  <div class="t4-tl-header">
                    <h3 class="t4-tl-title">${edu.degree || 'Degree'}</h3>
                    ${edu.year ? `<span class="t4-tl-date">${edu.year}</span>` : ''}
                  </div>
                  <div class="t4-tl-org">
                    ${edu.institution || ''}
                    ${edu.score ? ` — <span class="t4-edu-grade">${edu.score}</span>` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    ` : '';

    // 6. Skills Groups
    const hasSkills = skills.length > 0 && skills.some(s => (s.items && s.items.length > 0) || (typeof s === 'string' && s.trim()));
    const skillsHtml = hasSkills ? `
      <section class="t4-section">
        <h2 class="t4-sec-title">Core Capabilities</h2>
        <div class="t4-skills-group">
          ${skills.map(s => {
            const catTitle = s.category || 'Specialization';
            const items = Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []);
            if (items.length === 0) return '';
            return `
              <div class="t4-cat-block">
                <h4 class="t4-cat-label">${catTitle}</h4>
                <div class="t4-tags">
                  ${items.map(item => `<span class="t4-tag">${item}</span>`).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    ` : '';

    // 7. Languages
    const hasLanguages = languages.length > 0 && languages.some(l => l.name);
    const languagesHtml = hasLanguages ? `
      <section class="t4-section">
        <h2 class="t4-sec-title">Languages</h2>
        <div class="t4-lang-tags">
          ${languages.map(l => {
            if (!l.name) return '';
            return `<span class="t4-lang-pill"><strong>${l.name}</strong>${l.level ? ` (${l.level})` : ''}</span>`;
          }).join('')}
        </div>
      </section>
    ` : '';

    return `
      <div class="t4-container ${photoHtml ? 'has-photo' : 'no-photo'}">
        <!-- Header -->
        <header class="t4-header">
          ${photoHtml}
          <div class="t4-header-info">
            <h1 class="t4-name">${basics.fullName || 'Your Name'}</h1>
            ${basics.headline ? `<p class="t4-role">${basics.headline}</p>` : ''}
            ${contactBadges.length > 0 ? `
              <div class="t4-badges">
                ${contactBadges.join('')}
              </div>
            ` : ''}
          </div>
        </header>

        <!-- Body -->
        ${summaryHtml}
        ${expTimeline}
        ${eduTimeline}
        ${skillsHtml}
        ${languagesHtml}
      </div>
    `;
  }
};
