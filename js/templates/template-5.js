/**
 * Template 5: Academic & Biodata
 * Formal document structure with centered heading, tabular personal particulars,
 * bordered marksheet table, and candidate declaration signature block.
 */

export const template5 = {
  id: 'template-5',
  name: 'Academic & Biodata',
  shortName: 'Biodata',
  category: 'Academic & Formal Biodata',
  description: 'Comprehensive formal format with structured personal particulars, academic qualifications marksheet, and signature block.',
  atsBadge: '94% ATS Match',

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

    // 1. Photo Box (Only if provided and not hidden)
    const hasPhoto = Boolean(basics.photoUrl && visible.photo !== false);
    const photoHtml = hasPhoto
      ? `<div class="t5-photo-box">
          <img src="${basics.photoUrl}" alt="${basics.fullName || 'Applicant'}">
        </div>`
      : '';

    // 2. Personal Particulars Rows (Only rows that have actual values)
    const bioRows = [];
    if (basics.fullName) {
      bioRows.push(`<tr><th class="t5-th">Full Name</th><td class="t5-td">: <strong>${basics.fullName}</strong></td></tr>`);
    }
    if (biodata.fatherName) {
      bioRows.push(`<tr><th class="t5-th">Father's Name</th><td class="t5-td">: ${biodata.fatherName}</td></tr>`);
    }
    if (biodata.dob) {
      bioRows.push(`<tr><th class="t5-th">Date of Birth</th><td class="t5-td">: ${biodata.dob}</td></tr>`);
    }
    if (biodata.gender) {
      bioRows.push(`<tr><th class="t5-th">Gender</th><td class="t5-td">: ${biodata.gender}</td></tr>`);
    }
    if (biodata.maritalStatus) {
      bioRows.push(`<tr><th class="t5-th">Marital Status</th><td class="t5-td">: ${biodata.maritalStatus}</td></tr>`);
    }
    if (biodata.nationality) {
      bioRows.push(`<tr><th class="t5-th">Nationality</th><td class="t5-td">: ${biodata.nationality}</td></tr>`);
    }
    if (languages.length > 0 && languages.some(l => l.name)) {
      const langStr = languages.filter(l => l.name).map(l => `${l.name}${l.level ? ` (${l.level})` : ''}`).join(', ');
      bioRows.push(`<tr><th class="t5-th">Languages Known</th><td class="t5-td">: ${langStr}</td></tr>`);
    }
    if (basics.phone) {
      bioRows.push(`<tr><th class="t5-th">Contact Number</th><td class="t5-td">: ${basics.phone}</td></tr>`);
    }
    if (basics.email) {
      bioRows.push(`<tr><th class="t5-th">Email ID</th><td class="t5-td">: ${basics.email}</td></tr>`);
    }
    if (basics.location) {
      bioRows.push(`<tr><th class="t5-th">Present Location</th><td class="t5-td">: ${basics.location}</td></tr>`);
    }
    if (biodata.address) {
      bioRows.push(`<tr><th class="t5-th">Permanent Address</th><td class="t5-td">: ${biodata.address.replace(/\n/g, ', ')}</td></tr>`);
    }

    // 3. Education Qualifications Table
    const hasEducation = education.length > 0 && education.some(edu => edu.degree || edu.institution);
    const eduTable = hasEducation ? `
      <section class="t5-section">
        <h3 class="t5-sec-heading">Educational Qualifications</h3>
        <table class="t5-table">
          <thead>
            <tr>
              <th style="width: 35%;">Examination / Degree</th>
              <th style="width: 37%;">Board / University</th>
              <th style="width: 14%; text-align: center;">Year</th>
              <th style="width: 14%; text-align: center;">Marks / GPA</th>
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
      </section>
    ` : '';

    // 4. Skills Section
    const hasSkills = skills.length > 0 && skills.some(s => (s.items && s.items.length > 0) || (typeof s === 'string' && s.trim()));
    const skillsSection = hasSkills ? `
      <section class="t5-section">
        <h3 class="t5-sec-heading">Technical & Professional Capabilities</h3>
        <ul class="t5-list">
          ${skills.map(s => {
            const catTitle = s.category || 'Competencies';
            const items = Array.isArray(s.items) ? s.items : (typeof s === 'string' ? [s] : []);
            if (items.length === 0) return '';
            return `<li><strong>${catTitle}:</strong> ${items.join(', ')}</li>`;
          }).join('')}
        </ul>
      </section>
    ` : '';

    // 5. Experience Section
    const hasExperience = experience.length > 0 && experience.some(e => e.title || e.company);
    const expSection = hasExperience ? `
      <section class="t5-section">
        <h3 class="t5-sec-heading">Work Experience & Practical Training</h3>
        <ul class="t5-list">
          ${experience.map(exp => {
            if (!exp.title && !exp.company) return '';
            return `
              <li>
                <strong>${exp.title || 'Role'}</strong>${exp.period ? ` (${exp.period})` : ''}${exp.company ? ` — <em>${exp.company}</em>` : ''}
                ${(exp.bullets && exp.bullets.length > 0) ? `
                  <ul class="t5-sublist">
                    ${exp.bullets.filter(b => b && b.trim()).map(b => `<li>${b}</li>`).join('')}
                  </ul>
                ` : ''}
              </li>
            `;
          }).join('')}
        </ul>
      </section>
    ` : '';

    // 6. Summary / Objective
    const summarySection = (summary && visible.summary !== false) ? `
      <section class="t5-section">
        <h3 class="t5-sec-heading">Career Objective / Profile Summary</h3>
        <p class="t5-summary-text">${summary}</p>
      </section>
    ` : '';

    // 7. Declaration Block (Only if enabled and visible)
    const declarationHtml = (declaration && declaration.enabled && visible.biodata !== false) ? `
      <footer class="t5-declaration">
        <h3 class="t5-sec-heading">Declaration</h3>
        <p class="t5-dec-text">
          ${declaration.text || 'I hereby declare that the particulars provided above are authentic and true to the best of my knowledge and belief.'}
        </p>
        <div class="t5-sign-row">
          <div class="t5-sign-left">
            ${declaration.place ? `<p><strong>Place:</strong> ${declaration.place}</p>` : ''}
            ${declaration.date ? `<p><strong>Date:</strong> ${declaration.date}</p>` : ''}
          </div>
          <div class="t5-sign-right">
            <div class="t5-signature-line"></div>
            <p class="t5-sig-name"><strong>(${declaration.signatureName || basics.fullName || ''})</strong></p>
            <span class="t5-sig-title">Signature of Applicant</span>
          </div>
        </div>
      </footer>
    ` : '';

    return `
      <div class="t5-container">
        <!-- Centered Title Banner -->
        <div class="t5-title-banner">
          <h1 class="t5-main-title">CURRICULUM VITAE</h1>
        </div>

        <!-- Top Particulars (Clean grid: 100% width if no photo, or 2-col if photo present) -->
        <div class="t5-top-grid ${hasPhoto ? 'has-photo' : 'no-photo'}">
          <div class="t5-bio-table-wrap">
            <h3 class="t5-sec-heading">Personal Particulars</h3>
            <table class="t5-bio-table">
              <tbody>
                ${bioRows.join('')}
              </tbody>
            </table>
          </div>
          ${photoHtml}
        </div>

        ${summarySection}
        ${eduTable}
        ${skillsSection}
        ${expSection}
        ${declarationHtml}
      </div>
    `;
  }
};
