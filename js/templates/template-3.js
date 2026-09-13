/**
 * Template 3: Minimalist ATS-Optimized
 * Strict single-column, high-density layout, classic typography, zero graphics.
 * Engineered for 100% compatibility with Applicant Tracking Systems (ATS) and recruiters.
 */

export const template3 = {
  id: 'template-3',
  name: 'Minimalist ATS',
  shortName: 'Minimalist',
  category: '100% ATS Optimized',
  description: 'Text-first, high-density single column with horizontal dividers, engineered for ATS recruitment parsers.',
  atsBadge: '100% ATS Match',

  render(data) {
    const basics = data.basics || {};
    const summary = (data.summary || '').trim();
    const skills = data.skills || [];
    const experience = data.experience || [];
    const education = data.education || [];
    const languages = data.languages || [];
    const visible = data.visibleSections || {};

    // 1. Clean Contact Line (ATS parser safe)
    const contacts = [];
    if (basics.phone) contacts.push(basics.phone);
    if (basics.email) contacts.push(`<a href="mailto:${basics.email}">${basics.email}</a>`);
    if (basics.location) contacts.push(basics.location);
    if (basics.linkedin) {
      const cleanLi = basics.linkedin.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/^linkedin\.com\/in\//i, '').replace(/\/$/, '');
      contacts.push(`<a href="https://linkedin.com/in/${cleanLi}" target="_blank" rel="noopener">linkedin.com/in/${cleanLi}</a>`);
    }
    if (basics.github) {
      const cleanGh = basics.github.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/^github\.com\//i, '').replace(/\/$/, '');
      contacts.push(`<a href="https://github.com/${cleanGh}" target="_blank" rel="noopener">github.com/${cleanGh}</a>`);
    }
    if (basics.website) {
      const cleanWeb = basics.website.replace(/^https?:\/\//i, '').replace(/^(www\.)?/i, '').replace(/\/$/, '');
      contacts.push(`<a href="https://${cleanWeb}" target="_blank" rel="noopener">${cleanWeb}</a>`);
    }

    // 2. Summary
    const summaryHtml = (summary && visible.summary !== false) ? `
      <section class="t3-section">
        <h2 class="t3-title">Professional Summary</h2>
        <p class="t3-summary">${summary}</p>
      </section>
    ` : '';

    // 3. Experience
    const hasExperience = experience.length > 0 && experience.some(e => e.title || e.company);
    const experienceHtml = hasExperience ? `
      <section class="t3-section">
        <h2 class="t3-title">Work Experience</h2>
        ${experience.map(exp => {
          if (!exp.title && !exp.company) return '';
          return `
            <div class="t3-entry">
              <div class="t3-entry-header">
                <span class="t3-entry-title"><strong>${exp.title || 'Role'}</strong>${exp.company ? ` | <em>${exp.company}</em>` : ''}</span>
                ${exp.period ? `<span class="t3-entry-date">${exp.period}</span>` : ''}
              </div>
              ${(exp.bullets && exp.bullets.length > 0) ? `
                <ul class="t3-bullets">
                  ${exp.bullets.filter(b => b && b.trim()).map(b => `<li>${b}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `;
        }).join('')}
      </section>
    ` : '';

    // 4. Education
    const hasEducation = education.length > 0 && education.some(edu => edu.degree || edu.institution);
    const educationHtml = hasEducation ? `
      <section class="t3-section">
        <h2 class="t3-title">Education</h2>
        ${education.map(edu => {
          if (!edu.degree && !edu.institution) return '';
          return `
            <div class="t3-entry">
              <div class="t3-entry-header">
                <span class="t3-entry-title"><strong>${edu.degree || 'Degree'}</strong>${edu.institution ? `, ${edu.institution}` : ''}</span>
                ${edu.year ? `<span class="t3-entry-date">${edu.year}</span>` : ''}
              </div>
              ${edu.score ? `<p class="t3-score-line">Grade / Result: ${edu.score}</p>` : ''}
            </div>
          `;
        }).join('')}
      </section>
    ` : '';

    // 5. Skills
    const hasSkills = skills.length > 0 && skills.some(s => (s.items && s.items.length > 0) || (typeof s === 'string' && s.trim()));
    const skillsHtml = hasSkills ? `
      <section class="t3-section">
        <h2 class="t3-title">Technical & Professional Skills</h2>
        <div class="t3-skills-content">
          ${skills.map(s => {
            const catTitle = s.category || 'Core Skills';
            const items = Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []);
            if (items.length === 0) return '';
            return `
              <p class="t3-skill-row">
                <strong>${catTitle}:</strong> ${items.join(', ')}
              </p>
            `;
          }).join('')}
        </div>
      </section>
    ` : '';

    // 6. Languages
    const hasLanguages = languages.length > 0 && languages.some(l => l.name);
    const languagesHtml = hasLanguages ? `
      <section class="t3-section">
        <h2 class="t3-title">Languages</h2>
        <p class="t3-lang-row">
          ${languages.filter(l => l.name).map(l => `<strong>${l.name}</strong>${l.level ? ` (${l.level})` : ''}`).join(' | ')}
        </p>
      </section>
    ` : '';

    return `
      <div class="t3-container">
        <header class="t3-header">
          <h1 class="t3-name">${(basics.fullName || 'Your Name').toUpperCase()}</h1>
          ${basics.headline ? `<p class="t3-headline">${basics.headline}</p>` : ''}
          ${contacts.length > 0 ? `
            <div class="t3-contacts">
              ${contacts.map(c => `<span>${c}</span>`).join(' <span class="t3-sep">|</span> ')}
            </div>
          ` : ''}
        </header>

        ${summaryHtml}
        ${experienceHtml}
        ${educationHtml}
        ${skillsHtml}
        ${languagesHtml}
      </div>
    `;
  }
};
