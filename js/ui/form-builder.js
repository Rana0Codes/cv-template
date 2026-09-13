/**
 * Modern Step-by-Step Content Editor for CV Template.
 * Beginner-friendly 5+1 step workflow with data-aware resilience.
 */

import { store } from '../store.js';
import { setupPhotoUploader } from './photo-uploader.js';
import { ICONS } from './icons.js';

export const POPULAR_LANGUAGES = [
  'English',
  'Bengali (বাংলা)',
  'Hindi (हिन्दी)',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Mandarin Chinese (中文)',
  'Arabic (العربية)',
  'Portuguese (Português)',
  'Russian (Русский)',
  'Japanese (日本語)',
  'Italian (Italiano)',
  'Korean (한국어)',
  'Dutch (Nederlands)',
  'Turkish (Türkçe)',
  'Polish (Polski)',
  'Urdu (اردو)',
  'Tamil (தமிழ்)',
  'Telugu (తెలుగు)',
  'Marathi (मराठी)',
  'Gujarati (ગુજરાતી)',
  'Punjabi (ਪੰਜਾਬੀ)',
  'Swedish (Svenska)',
  'Vietnamese (Tiếng Việt)'
];

const SKILL_SUGGESTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'AWS', 'Docker',
  'SQL', 'Data Analysis', 'Project Management', 'Git', 'Agile',
  'FastAPI', 'Team Leadership', 'Communication'
];

let activeStep = 'sec-personal';

export function getStepCompletion(state) {
  const basics = state?.basics || {};
  return {
    'sec-personal': Boolean(basics.fullName && basics.fullName.trim() && (basics.email || basics.phone)),
    'sec-summary': Boolean((state?.summary || '').trim().length >= 15),
    'sec-experience': Boolean(state?.experience && state.experience.length > 0 && state.experience.some(e => e.title && e.title.trim())),
    'sec-education': Boolean(state?.education && state.education.length > 0 && state.education.some(e => e.degree && e.degree.trim())),
    'sec-skills': Boolean((state?.skills && state.skills.length > 0) || (state?.languages && state.languages.length > 0)),
    'sec-biodata': Boolean(state?.biodata && (state.biodata.fatherName || state.biodata.dob || state.biodata.address || state.declaration?.enabled))
  };
}

export const STEPS_META = [
  { id: 'sec-personal', num: 1, label: 'About You' },
  { id: 'sec-summary', num: 2, label: 'Summary' },
  { id: 'sec-experience', num: 3, label: 'Experience' },
  { id: 'sec-education', num: 4, label: 'Education' },
  { id: 'sec-skills', num: 5, label: 'Skills & Langs' },
  { id: 'sec-biodata', num: 6, label: 'Biodata (Opt)' }
];

export function renderForm(container) {
  const data = store.getState();
  const completion = getStepCompletion(data);

  container.innerHTML = `
    <div class="editor-workflow-container">
      
      <!-- Studio Quick Template Switcher Strip -->
      <div id="studio-template-bar-slot"></div>

      <!-- Workflow Navigation & ATS Readiness Header -->
      <div class="workflow-header-card">
        <div class="workflow-stepper" role="tablist" aria-label="Resume Steps">
          ${STEPS_META.map(s => `
            <button type="button" class="step-btn ${activeStep === s.id ? 'active' : ''} ${completion[s.id] ? 'completed' : ''}" data-step="${s.id}">
              <span class="step-num">${completion[s.id] ? '✓' : s.num}</span>
              <span class="step-label">${s.label}</span>
            </button>
          `).join('')}
        </div>

        <div class="ats-readiness-slot" id="ats-readiness-slot"></div>
      </div>

      <!-- Popular Languages Datalist -->
      <datalist id="popular-languages-list">
        ${POPULAR_LANGUAGES.map(lang => `<option value="${lang}">${lang}</option>`).join('')}
      </datalist>

      <!-- Active Section View -->
      <div class="workflow-content-card">
        
        <!-- STEP 1: Personal Info -->
        <section class="step-section ${activeStep === 'sec-personal' ? 'active' : ''}" id="sec-personal">
          <div class="step-header">
            <h2 class="step-title">Tell Us About Yourself</h2>
            <p class="step-desc">Enter your primary contact information. Recruiters and hiring managers will use these details to reach you.</p>
          </div>

          <div class="form-group" style="margin-bottom: 16px;">
            <label>Profile Picture (Optional)</label>
            <div id="photo-uploader-slot"></div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="f-fullName">Full Name <span class="required">*</span></label>
              <input type="text" id="f-fullName" data-path="basics.fullName" value="${escapeHtml(data.basics?.fullName || '')}" placeholder="e.g. Alexander Wright">
            </div>
            <div class="form-group">
              <label for="f-headline">Professional Title / Occupation</label>
              <input type="text" id="f-headline" data-path="basics.headline" value="${escapeHtml(data.basics?.headline || '')}" placeholder="e.g. Software Engineer or Marketing Specialist">
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="f-email">Email Address <span class="required">*</span></label>
              <input type="email" id="f-email" data-path="basics.email" value="${escapeHtml(data.basics?.email || '')}" placeholder="name@example.com">
            </div>
            <div class="form-group">
              <label for="f-phone">Phone Number</label>
              <input type="text" id="f-phone" data-path="basics.phone" value="${escapeHtml(data.basics?.phone || '')}" placeholder="+1 (555) 000-0000">
            </div>
          </div>

          <div class="form-group">
            <label for="f-location">Location / City & Country</label>
            <input type="text" id="f-location" data-path="basics.location" value="${escapeHtml(data.basics?.location || '')}" placeholder="e.g. San Francisco, CA or London, UK">
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label for="f-linkedin">LinkedIn Profile (Optional)</label>
              <input type="text" id="f-linkedin" data-path="basics.linkedin" value="${escapeHtml(data.basics?.linkedin || '')}" placeholder="linkedin.com/in/username">
            </div>
            <div class="form-group">
              <label for="f-github">GitHub / Portfolio URL (Optional)</label>
              <input type="text" id="f-github" data-path="basics.github" value="${escapeHtml(data.basics?.github || '')}" placeholder="github.com/username">
            </div>
            <div class="form-group">
              <label for="f-website">Personal Website (Optional)</label>
              <input type="text" id="f-website" data-path="basics.website" value="${escapeHtml(data.basics?.website || '')}" placeholder="https://yourportfolio.com">
            </div>
          </div>

          <div class="step-nav-footer">
            <div></div>
            <button type="button" class="btn-step-next" data-next="sec-summary">Next: Summary →</button>
          </div>
        </section>

        <!-- STEP 2: Summary -->
        <section class="step-section ${activeStep === 'sec-summary' ? 'active' : ''}" id="sec-summary">
          <div class="step-header">
            <div class="step-header-row">
              <div>
                <h2 class="step-title">Professional Summary</h2>
                <p class="step-desc">A short 2-3 sentence overview of your background, key strengths, and career goals. (Optional — leave blank to skip).</p>
              </div>
              <label class="section-opt-toggle" title="Toggle summary visibility on CV">
                <input type="checkbox" data-path="visibleSections.summary" ${data.visibleSections?.summary !== false ? 'checked' : ''}>
                <span>Include in CV</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="f-summary">Summary Statement</label>
            <textarea id="f-summary" data-path="summary" rows="5" placeholder="e.g. Enthusiastic software engineer with expertise in modern web technologies and building scalable systems...">${escapeHtml(data.summary || '')}</textarea>
          </div>

          <div class="step-nav-footer">
            <button type="button" class="btn-step-prev" data-prev="sec-personal">← Previous</button>
            <button type="button" class="btn-step-next" data-next="sec-experience">Next: Experience →</button>
          </div>
        </section>

        <!-- STEP 3: Experience -->
        <section class="step-section ${activeStep === 'sec-experience' ? 'active' : ''}" id="sec-experience">
          <div class="step-header">
            <div class="step-header-row">
              <div>
                <h2 class="step-title">Work Experience</h2>
                <p class="step-desc">List your relevant roles starting with the most recent. Students and fresh graduates can skip this step.</p>
              </div>
              <button type="button" class="btn-add-item-header" id="btn-add-exp">
                ${ICONS.plus} Add Position
              </button>
            </div>
          </div>

          <div id="experience-list-container">
            ${renderExperienceList(data.experience || [])}
          </div>

          <div class="step-nav-footer">
            <button type="button" class="btn-step-prev" data-prev="sec-summary">← Previous</button>
            <button type="button" class="btn-step-next" data-next="sec-education">Next: Education →</button>
          </div>
        </section>

        <!-- STEP 4: Education -->
        <section class="step-section ${activeStep === 'sec-education' ? 'active' : ''}" id="sec-education">
          <div class="step-header">
            <div class="step-header-row">
              <div>
                <h2 class="step-title">Academic Qualifications</h2>
                <p class="step-desc">Add your degrees, diplomas, or school qualifications.</p>
              </div>
              <button type="button" class="btn-add-item-header" id="btn-add-edu">
                ${ICONS.plus} Add Education
              </button>
            </div>
          </div>

          <div id="education-list-container">
            ${renderEducationList(data.education || [])}
          </div>

          <div class="step-nav-footer">
            <button type="button" class="btn-step-prev" data-prev="sec-experience">← Previous</button>
            <button type="button" class="btn-step-next" data-next="sec-skills">Next: Skills & Languages →</button>
          </div>
        </section>

        <!-- STEP 5: Skills & Languages -->
        <section class="step-section ${activeStep === 'sec-skills' ? 'active' : ''}" id="sec-skills">
          <div class="step-header">
            <div class="step-header-row">
              <div>
                <h2 class="step-title">Skills & Languages</h2>
                <p class="step-desc">List your key technical capabilities and languages known.</p>
              </div>
              <div style="display:flex; gap:8px;">
                <button type="button" class="btn-add-item-header" id="btn-add-skill-cat">
                  ${ICONS.plus} Add Skill Group
                </button>
                <button type="button" class="btn-add-item-header" id="btn-add-lang">
                  ${ICONS.plus} Add Language
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Skill Chips -->
          <div class="quick-suggestion-panel">
            <span class="suggestion-label">Quick Suggestions (Click to Add):</span>
            <div class="suggestion-chips-wrap">
              ${SKILL_SUGGESTIONS.map(skill => `
                <button type="button" class="btn-skill-chip" data-skill="${skill}">＋ ${skill}</button>
              `).join('')}
            </div>
          </div>

          <div id="skills-list-container" style="margin-bottom: 20px;">
            ${renderSkillsList(data.skills || [])}
          </div>

          <!-- Languages Sub-Section -->
          <div class="step-header" style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <div class="step-header-row">
              <div>
                <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0;">Languages Known</h3>
                <p class="step-desc">Add the languages you can speak or write.</p>
              </div>
            </div>
          </div>

          <!-- Quick-Add Popular Language Chips -->
          <div class="quick-suggestion-panel">
            <span class="suggestion-label">Popular Languages:</span>
            <div class="suggestion-chips-wrap">
              <button type="button" class="btn-lang-chip" data-lang="English" data-level="Native">＋ English (Native)</button>
              <button type="button" class="btn-lang-chip" data-lang="Bengali (বাংলা)" data-level="Native">＋ Bengali</button>
              <button type="button" class="btn-lang-chip" data-lang="Hindi (हिन्दी)" data-level="Fluent">＋ Hindi</button>
              <button type="button" class="btn-lang-chip" data-lang="Spanish (Español)" data-level="Conversational">＋ Spanish</button>
              <button type="button" class="btn-lang-chip" data-lang="French (Français)" data-level="Working">＋ French</button>
              <button type="button" class="btn-lang-chip" data-lang="German (Deutsch)" data-level="Working">＋ German</button>
            </div>
          </div>

          <div id="languages-list-container">
            ${renderLanguagesList(data.languages || [])}
          </div>

          <div class="step-nav-footer">
            <button type="button" class="btn-step-prev" data-prev="sec-education">← Previous</button>
            <button type="button" class="btn-step-next" data-next="sec-biodata">Next: Biodata (Optional) →</button>
          </div>
        </section>

        <!-- STEP 6: Biodata & Declaration (Optional) -->
        <section class="step-section ${activeStep === 'sec-biodata' ? 'active' : ''}" id="sec-biodata">
          <div class="step-header">
            <div class="step-header-row">
              <div>
                <h2 class="step-title">Personal Biodata & Declaration (Optional)</h2>
                <p class="step-desc">Only needed if you are creating a traditional Indian/formal Biodata or need personal particulars and a formal declaration. Standard CVs safely omit this.</p>
              </div>
              <label class="section-opt-toggle" title="Toggle biodata visibility">
                <input type="checkbox" data-path="visibleSections.biodata" ${data.visibleSections?.biodata !== false ? 'checked' : ''}>
                <span>Include in Biodata</span>
              </label>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="f-fatherName">Father's Name</label>
              <input type="text" id="f-fatherName" data-path="biodata.fatherName" value="${escapeHtml(data.biodata?.fatherName || '')}" placeholder="Father's Full Name">
            </div>
            <div class="form-group">
              <label for="f-dob">Date of Birth</label>
              <input type="date" id="f-dob" data-path="biodata.dob" value="${escapeHtml(data.biodata?.dob || '')}">
            </div>
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label for="f-nationality">Nationality</label>
              <input type="text" id="f-nationality" data-path="biodata.nationality" value="${escapeHtml(data.biodata?.nationality || '')}" placeholder="e.g. American / Indian">
            </div>
            <div class="form-group">
              <label for="f-gender">Gender</label>
              <select id="f-gender" data-path="biodata.gender">
                <option value="">Select Gender (Optional)</option>
                <option value="Male" ${data.biodata?.gender === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Female" ${data.biodata?.gender === 'Female' ? 'selected' : ''}>Female</option>
                <option value="Other" ${data.biodata?.gender === 'Other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="f-marital">Marital Status</label>
              <select id="f-marital" data-path="biodata.maritalStatus">
                <option value="">Select Status (Optional)</option>
                <option value="Unmarried" ${data.biodata?.maritalStatus === 'Unmarried' ? 'selected' : ''}>Unmarried</option>
                <option value="Married" ${data.biodata?.maritalStatus === 'Married' ? 'selected' : ''}>Married</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="f-address">Permanent Address (For Official Biodata)</label>
            <textarea id="f-address" data-path="biodata.address" rows="2" placeholder="Street address, City, PIN/ZIP code, Country">${escapeHtml(data.biodata?.address || '')}</textarea>
          </div>

          <div class="declaration-box-wrapper">
            <label class="declaration-checkbox-label">
              <input type="checkbox" id="f-dec-enabled" data-path="declaration.enabled" ${data.declaration?.enabled ? 'checked' : ''}>
              <span><strong>Include Formal Declaration & Signature Line</strong></span>
            </label>
            
            <div class="form-group" style="margin-top: 10px;">
              <label for="f-dec-text">Declaration Statement</label>
              <textarea id="f-dec-text" data-path="declaration.text" rows="2">${escapeHtml(data.declaration?.text || 'I hereby declare that all particulars and statements stated above are true and complete to the best of my knowledge.')}</textarea>
            </div>

            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label for="f-dec-place">Place / City</label>
                <input type="text" id="f-dec-place" data-path="declaration.place" value="${escapeHtml(data.declaration?.place || '')}">
              </div>
              <div class="form-group">
                <label for="f-dec-date">Date</label>
                <input type="text" id="f-dec-date" data-path="declaration.date" value="${escapeHtml(data.declaration?.date || '')}">
              </div>
              <div class="form-group">
                <label for="f-dec-sig">Signature Name</label>
                <input type="text" id="f-dec-sig" data-path="declaration.signatureName" value="${escapeHtml(data.declaration?.signatureName || '')}" placeholder="e.g. Candidate Full Name">
              </div>
            </div>
          </div>

          <div class="step-nav-footer">
            <button type="button" class="btn-step-prev" data-prev="sec-skills">← Previous</button>
            <button type="button" class="btn-step-finish" id="btn-finish-editor">👁 Review & Preview CV</button>
          </div>
        </section>

      </div>
    </div>
  `;

  // Attach photo uploader
  const photoSlot = container.querySelector('#photo-uploader-slot');
  if (photoSlot) {
    setupPhotoUploader(photoSlot);
  }

  // Bind all event listeners
  bindInputs(container);
  bindStepperNavigation(container);
  bindDynamicButtons(container);

  // Initialize ATS Readiness Gauge
  renderATSReadiness(container);
}

function renderLanguagesList(languages) {
  if (!languages || languages.length === 0) {
    return `<p class="empty-list-notice">No languages added yet. Click "+ Add Language" or click suggestions above.</p>`;
  }

  return languages.map((l, idx) => `
    <div class="dynamic-language-card" data-idx="${idx}">
      <div class="lang-input-wrapper">
        <label class="sub-label">Language</label>
        <input type="text" 
               class="input-lang-name" 
               list="popular-languages-list" 
               data-idx="${idx}" 
               value="${escapeHtml(l.name || '')}" 
               placeholder="e.g. English, French, Spanish...">
      </div>

      <div class="lang-level-wrapper">
        <label class="sub-label">Proficiency</label>
        <select class="select-lang-level" data-idx="${idx}">
          <option value="Native" ${l.level === 'Native' ? 'selected' : ''}>Native / Mother Tongue</option>
          <option value="Fluent" ${l.level === 'Fluent' ? 'selected' : ''}>Fluent</option>
          <option value="Professional Working" ${l.level === 'Professional Working' || l.level === 'Working' ? 'selected' : ''}>Professional Working</option>
          <option value="Conversational" ${l.level === 'Conversational' ? 'selected' : ''}>Conversational</option>
          <option value="Basic" ${l.level === 'Basic' ? 'selected' : ''}>Basic Elementary</option>
        </select>
      </div>

      <div class="card-actions">
        <button type="button" class="btn-sort-entry btn-sort-up" data-type="languages" data-idx="${idx}" title="Move Up" ${idx === 0 ? 'disabled' : ''}>${ICONS.chevronUp}</button>
        <button type="button" class="btn-sort-entry btn-sort-down" data-type="languages" data-idx="${idx}" title="Move Down" ${idx === languages.length - 1 ? 'disabled' : ''}>${ICONS.chevronDown}</button>
        <button type="button" class="btn-trash-action btn-del-lang" data-idx="${idx}" title="Delete Language">
          ${ICONS.trash}
        </button>
      </div>
    </div>
  `).join('');
}

function renderSkillsList(skills) {
  if (!skills || skills.length === 0) {
    return `<p class="empty-list-notice">No skills added yet. Click a suggestion above or "+ Add Skill Group".</p>`;
  }

  return skills.map((s, idx) => {
    const category = s.category || 'Skills';
    const items = Array.isArray(s.items) ? s.items.join(', ') : (typeof s === 'string' ? s : '');
    return `
      <div class="dynamic-skill-card" data-idx="${idx}">
        <div class="card-top-row">
          <span class="card-badge">Skill Group #${idx + 1}</span>
          <div class="card-actions">
            <button type="button" class="btn-sort-entry btn-sort-up" data-type="skills" data-idx="${idx}" title="Move Up" ${idx === 0 ? 'disabled' : ''}>${ICONS.chevronUp}</button>
            <button type="button" class="btn-sort-entry btn-sort-down" data-type="skills" data-idx="${idx}" title="Move Down" ${idx === skills.length - 1 ? 'disabled' : ''}>${ICONS.chevronDown}</button>
            <button type="button" class="btn-trash-action btn-del-skill" data-idx="${idx}" title="Delete Category">
              ${ICONS.trash}
            </button>
          </div>
        </div>
        <div class="form-group">
          <label>Group Title</label>
          <input type="text" class="input-skill-cat" data-idx="${idx}" value="${escapeHtml(category)}" placeholder="e.g. Technical Skills, Tools, or Core Competencies">
        </div>
        <div class="form-group">
          <label>Skills / Items (Comma-separated)</label>
          <input type="text" class="input-skill-items" data-idx="${idx}" value="${escapeHtml(items)}" placeholder="e.g. Python, Docker, AWS, React">
        </div>
      </div>
    `;
  }).join('');
}

function renderExperienceList(experience) {
  if (!experience || experience.length === 0) {
    return `<p class="empty-list-notice">No work experience entries added. Click "+ Add Position" above, or continue if you are a student/fresh grad.</p>`;
  }

  return experience.map((exp, idx) => {
    const summaryTitle = [exp.title, exp.company].filter(Boolean).join(' · ') || 'Untitled Position';
    return `
      <div class="dynamic-entry-card" data-idx="${idx}">
        <div class="card-top-row">
          <div class="card-title-group" title="Click to collapse or expand">
            <button type="button" class="btn-card-collapse" aria-label="Toggle details">
              ${ICONS.chevronDown}
            </button>
            <span class="card-badge">Position #${idx + 1}</span>
            <span class="card-summary-title">${escapeHtml(summaryTitle)}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn-sort-entry btn-sort-up" data-type="experience" data-idx="${idx}" title="Move Up" ${idx === 0 ? 'disabled' : ''}>${ICONS.chevronUp}</button>
            <button type="button" class="btn-sort-entry btn-sort-down" data-type="experience" data-idx="${idx}" title="Move Down" ${idx === experience.length - 1 ? 'disabled' : ''}>${ICONS.chevronDown}</button>
            <button type="button" class="btn-trash-action btn-del-exp" data-idx="${idx}" title="Delete Position">
              ${ICONS.trash}
            </button>
          </div>
        </div>
        <div class="entry-card-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label>Job Title / Role</label>
              <input type="text" class="input-exp-title" data-idx="${idx}" value="${escapeHtml(exp.title || '')}" placeholder="e.g. Senior Software Engineer">
            </div>
            <div class="form-group">
              <label>Company / Organization</label>
              <input type="text" class="input-exp-company" data-idx="${idx}" value="${escapeHtml(exp.company || '')}" placeholder="e.g. Acme Tech Solutions">
            </div>
          </div>
          <div class="form-group">
            <label>Period / Duration</label>
            <input type="text" class="input-exp-period" data-idx="${idx}" value="${escapeHtml(exp.period || '')}" placeholder="e.g. 2022 – Present">
          </div>
          <div class="form-group">
            <label>Key Accomplishments & Responsibilities (One bullet per line)</label>
            <textarea class="input-exp-bullets" data-idx="${idx}" rows="3" placeholder="• Led development of core microservices&#10;• Reduced latency by 30% through caching">${escapeHtml((exp.bullets || []).join('\n'))}</textarea>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderEducationList(education) {
  if (!education || education.length === 0) {
    return `<p class="empty-list-notice">No education entries added. Click "+ Add Education" above.</p>`;
  }

  return education.map((edu, idx) => {
    const summaryTitle = [edu.degree, edu.institution].filter(Boolean).join(' · ') || 'Untitled Qualification';
    return `
      <div class="dynamic-entry-card" data-idx="${idx}">
        <div class="card-top-row">
          <div class="card-title-group" title="Click to collapse or expand">
            <button type="button" class="btn-card-collapse" aria-label="Toggle details">
              ${ICONS.chevronDown}
            </button>
            <span class="card-badge">Qualification #${idx + 1}</span>
            <span class="card-summary-title">${escapeHtml(summaryTitle)}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn-sort-entry btn-sort-up" data-type="education" data-idx="${idx}" title="Move Up" ${idx === 0 ? 'disabled' : ''}>${ICONS.chevronUp}</button>
            <button type="button" class="btn-sort-entry btn-sort-down" data-type="education" data-idx="${idx}" title="Move Down" ${idx === education.length - 1 ? 'disabled' : ''}>${ICONS.chevronDown}</button>
            <button type="button" class="btn-trash-action btn-del-edu" data-idx="${idx}" title="Delete Degree">
              ${ICONS.trash}
            </button>
          </div>
        </div>
        <div class="entry-card-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label>Degree / Examination</label>
              <input type="text" class="input-edu-degree" data-idx="${idx}" value="${escapeHtml(edu.degree || '')}" placeholder="e.g. Bachelor of Science in Computer Science">
            </div>
            <div class="form-group">
              <label>Board / University / School</label>
              <input type="text" class="input-edu-inst" data-idx="${idx}" value="${escapeHtml(edu.institution || '')}" placeholder="e.g. University of California, Berkeley">
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>Graduation Year / Period</label>
              <input type="text" class="input-edu-year" data-idx="${idx}" value="${escapeHtml(edu.year || '')}" placeholder="e.g. 2022">
            </div>
            <div class="form-group">
              <label>Grade / Percentage / GPA (Optional)</label>
              <input type="text" class="input-edu-score" data-idx="${idx}" value="${escapeHtml(edu.score || '')}" placeholder="e.g. 3.85 GPA or First Class">
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function bindInputs(container) {
  const inputs = container.querySelectorAll('input[data-path], textarea[data-path], select[data-path]');
  inputs.forEach((input) => {
    const eventType = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
    input.addEventListener(eventType, (e) => {
      const path = e.target.getAttribute('data-path');
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      store.updateField(path, val);
      renderATSReadiness(container);
    });
  });
}

function bindStepperNavigation(container) {
  // Top step buttons
  const stepBtns = container.querySelectorAll('.step-btn');
  stepBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStep = btn.getAttribute('data-step');
      switchStep(container, targetStep);
    });
  });

  // Next / Prev buttons
  container.querySelectorAll('.btn-step-next').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextStep = btn.getAttribute('data-next');
      switchStep(container, nextStep);
    });
  });

  container.querySelectorAll('.btn-step-prev').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prevStep = btn.getAttribute('data-prev');
      switchStep(container, prevStep);
    });
  });

  container.querySelector('#btn-finish-editor')?.addEventListener('click', () => {
    const btnPreview = document.getElementById('btn-header-preview');
    if (btnPreview) {
      btnPreview.click();
    } else {
      document.getElementById('btn-download-pdf')?.click();
    }
  });
}

function switchStep(container, stepId) {
  activeStep = stepId;
  container.querySelectorAll('.step-btn').forEach(b => {
    if (b.getAttribute('data-step') === stepId) b.classList.add('active');
    else b.classList.remove('active');
  });

  container.querySelectorAll('.step-section').forEach(s => {
    if (s.id === stepId) s.classList.add('active');
    else s.classList.remove('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindDynamicButtons(container) {
  // Add Experience
  container.querySelector('#btn-add-exp')?.addEventListener('click', () => {
    const state = store.getState();
    const experience = state.experience || [];
    experience.push({
      id: 'e_' + Date.now(),
      title: 'Professional Role',
      company: 'Organization / Company',
      period: '2023 – Present',
      bullets: ['Accomplished key strategic objectives and optimized performance.']
    });
    store.updateField('experience', experience);
    refreshExperience(container);
  });

  // Add Education
  container.querySelector('#btn-add-edu')?.addEventListener('click', () => {
    const state = store.getState();
    const education = state.education || [];
    education.push({
      id: 'ed_' + Date.now(),
      degree: "Bachelor's Degree",
      institution: 'University / College',
      year: '2023',
      score: ''
    });
    store.updateField('education', education);
    refreshEducation(container);
  });

  // Add Skill Category
  container.querySelector('#btn-add-skill-cat')?.addEventListener('click', () => {
    const state = store.getState();
    const skills = state.skills || [];
    skills.push({
      id: 's_' + Date.now(),
      category: 'Key Capabilities',
      items: ['Skill A', 'Skill B']
    });
    store.updateField('skills', skills);
    refreshSkills(container);
  });

  // Add Language
  container.querySelector('#btn-add-lang')?.addEventListener('click', () => {
    const state = store.getState();
    const languages = state.languages || [];
    languages.push({
      id: 'l_' + Date.now(),
      name: 'English',
      level: 'Native'
    });
    store.updateField('languages', languages);
    refreshLanguages(container);
  });

  // Quick-Add Language Chips
  container.querySelectorAll('.btn-lang-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const currentChip = e.currentTarget;
      const langName = currentChip.getAttribute('data-lang');
      const langLevel = currentChip.getAttribute('data-level') || 'Fluent';
      const state = store.getState();
      const languages = state.languages || [];
      
      if (!languages.some(l => l.name && l.name.toLowerCase().includes(langName.toLowerCase()))) {
        languages.push({ id: 'l_' + Date.now(), name: langName, level: langLevel });
        store.updateField('languages', languages);
        refreshLanguages(container);
        
        currentChip.classList.add('added');
        const origText = currentChip.textContent;
        currentChip.textContent = 'Added ✓';
        setTimeout(() => {
          currentChip.classList.remove('added');
          currentChip.textContent = origText;
        }, 1200);
      }
    });
  });

  // Quick-Add Skill Chips
  container.querySelectorAll('.btn-skill-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const currentChip = e.currentTarget;
      const skillName = currentChip.getAttribute('data-skill');
      const state = store.getState();
      const skills = state.skills || [];

      if (skills.length === 0) {
        skills.push({ id: 's_' + Date.now(), category: 'Core Skills', items: [skillName] });
      } else {
        const lastCat = skills[skills.length - 1];
        if (!Array.isArray(lastCat.items)) lastCat.items = [];
        if (!lastCat.items.includes(skillName)) {
          lastCat.items.push(skillName);
        }
      }
      store.updateField('skills', skills);
      refreshSkills(container);

      currentChip.classList.add('added');
      const origText = currentChip.textContent;
      currentChip.textContent = 'Added ✓';
      setTimeout(() => {
        currentChip.classList.remove('added');
        currentChip.textContent = origText;
      }, 1200);
    });
  });

  bindDynamicListListeners(container);
}

function bindDynamicListListeners(container) {
  // Collapsible toggle for dynamic entry cards
  container.querySelectorAll('.card-title-group, .btn-card-collapse').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.card-actions')) return;
      const card = e.currentTarget.closest('.dynamic-entry-card');
      if (card) {
        card.classList.toggle('collapsed');
      }
    });
  });

  // Language inputs & delete
  container.querySelectorAll('.input-lang-name').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.languages && state.languages[idx]) {
        state.languages[idx].name = e.target.value;
        store.updateField('languages', state.languages);
      }
    });
  });

  container.querySelectorAll('.select-lang-level').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.languages && state.languages[idx]) {
        state.languages[idx].level = e.target.value;
        store.updateField('languages', state.languages);
      }
    });
  });

  container.querySelectorAll('.btn-del-lang').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
      const state = store.getState();
      state.languages.splice(idx, 1);
      store.updateField('languages', state.languages);
      refreshLanguages(container);
    });
  });

  // Skills
  container.querySelectorAll('.input-skill-cat').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.skills && state.skills[idx]) {
        state.skills[idx].category = e.target.value;
        store.updateField('skills', state.skills);
      }
    });
  });

  container.querySelectorAll('.input-skill-items').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.skills && state.skills[idx]) {
        state.skills[idx].items = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
        store.updateField('skills', state.skills);
      }
    });
  });

  container.querySelectorAll('.btn-del-skill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
      const state = store.getState();
      state.skills.splice(idx, 1);
      store.updateField('skills', state.skills);
      refreshSkills(container);
    });
  });

  // Experience
  container.querySelectorAll('.input-exp-title').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.experience && state.experience[idx]) {
        state.experience[idx].title = e.target.value;
        store.updateField('experience', state.experience);
      }
    });
  });

  container.querySelectorAll('.input-exp-company').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.experience && state.experience[idx]) {
        state.experience[idx].company = e.target.value;
        store.updateField('experience', state.experience);
      }
    });
  });

  container.querySelectorAll('.input-exp-period').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.experience && state.experience[idx]) {
        state.experience[idx].period = e.target.value;
        store.updateField('experience', state.experience);
      }
    });
  });

  container.querySelectorAll('.input-exp-bullets').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.experience && state.experience[idx]) {
        state.experience[idx].bullets = e.target.value.split('\n').filter(line => line.trim().length > 0);
        store.updateField('experience', state.experience);
      }
    });
  });

  container.querySelectorAll('.btn-del-exp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
      const state = store.getState();
      state.experience.splice(idx, 1);
      store.updateField('experience', state.experience);
      refreshExperience(container);
    });
  });

  // Education
  container.querySelectorAll('.input-edu-degree').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.education && state.education[idx]) {
        state.education[idx].degree = e.target.value;
        store.updateField('education', state.education);
      }
    });
  });

  container.querySelectorAll('.input-edu-inst').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.education && state.education[idx]) {
        state.education[idx].institution = e.target.value;
        store.updateField('education', state.education);
      }
    });
  });

  container.querySelectorAll('.input-edu-year').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.education && state.education[idx]) {
        state.education[idx].year = e.target.value;
        store.updateField('education', state.education);
      }
    });
  });

  container.querySelectorAll('.input-edu-score').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      const state = store.getState();
      if (state.education && state.education[idx]) {
        state.education[idx].score = e.target.value;
        store.updateField('education', state.education);
      }
    });
  });

  container.querySelectorAll('.btn-del-edu').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
      const state = store.getState();
      state.education.splice(idx, 1);
      store.updateField('education', state.education);
      refreshEducation(container);
    });
  });

  // Dynamic Entry Reordering (Move Up / Move Down)
  container.querySelectorAll('.btn-sort-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.getAttribute('data-type');
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
      if (idx > 0) {
        const state = store.getState();
        const list = state[type];
        if (list && list.length > idx) {
          [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
          store.updateField(type, list);
          if (type === 'experience') refreshExperience(container);
          else if (type === 'education') refreshEducation(container);
          else if (type === 'skills') refreshSkills(container);
          else if (type === 'languages') refreshLanguages(container);
          renderATSReadiness(container);
        }
      }
    });
  });

  container.querySelectorAll('.btn-sort-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.getAttribute('data-type');
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
      const state = store.getState();
      const list = state[type];
      if (list && idx < list.length - 1) {
        [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
        store.updateField(type, list);
        if (type === 'experience') refreshExperience(container);
        else if (type === 'education') refreshEducation(container);
        else if (type === 'skills') refreshSkills(container);
        else if (type === 'languages') refreshLanguages(container);
        renderATSReadiness(container);
      }
    });
  });
}

function refreshLanguages(container) {
  const slot = container.querySelector('#languages-list-container');
  if (slot) {
    slot.innerHTML = renderLanguagesList(store.getState().languages || []);
    bindDynamicListListeners(container);
    renderATSReadiness(container);
  }
}

function refreshSkills(container) {
  const slot = container.querySelector('#skills-list-container');
  if (slot) {
    slot.innerHTML = renderSkillsList(store.getState().skills || []);
    bindDynamicListListeners(container);
    renderATSReadiness(container);
  }
}

function refreshExperience(container) {
  const slot = container.querySelector('#experience-list-container');
  if (slot) {
    slot.innerHTML = renderExperienceList(store.getState().experience || []);
    bindDynamicListListeners(container);
    renderATSReadiness(container);
  }
}

function refreshEducation(container) {
  const slot = container.querySelector('#education-list-container');
  if (slot) {
    slot.innerHTML = renderEducationList(store.getState().education || []);
    bindDynamicListListeners(container);
    renderATSReadiness(container);
  }
}

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Calculate dynamic ATS readiness score (0-100%) without penalizing optional sections.
 * @param {Object} state
 */
export function calculateATSReadiness(state) {
  const basics = state?.basics || {};
  const hasContact = Boolean(basics.fullName && basics.fullName.trim().length > 0 && (basics.email || basics.phone));
  const summaryText = state?.summary || '';
  const hasSummary = Boolean(summaryText && summaryText.trim().length >= 20);
  const hasExperience = Boolean(state?.experience && state.experience.length > 0 && state.experience.some(e => e.title && e.title.trim()));
  const hasEducation = Boolean(state?.education && state.education.length > 0 && state.education.some(e => e.degree && e.degree.trim()));
  const totalSkillsCount = (state?.skills || []).reduce((acc, cat) => acc + (cat.items ? cat.items.length : (typeof cat === 'string' ? 1 : 0)), 0);
  const hasSkills = totalSkillsCount >= 2;
  const hasLanguages = Boolean(state?.languages && state.languages.length > 0 && state.languages.some(l => l.name && l.name.trim()));

  const checks = [
    { id: 'contact', label: 'Contact Details', passed: hasContact, weight: 25 },
    { id: 'education', label: 'Academic Qualifications', passed: hasEducation, weight: 25 },
    { id: 'skills', label: 'Skills & Capabilities', passed: hasSkills, weight: 20 },
    { id: 'experience', label: 'Work Experience (or Projects)', passed: hasExperience, weight: 15 },
    { id: 'summary', label: 'Professional Summary', passed: hasSummary, weight: 15 }
  ];

  const score = checks.reduce((acc, c) => acc + (c.passed ? c.weight : 0), 0);

  let level = { text: 'Needs Content 📝', color: '#e11d48' };
  if (score >= 85) {
    level = { text: 'ATS Ready 🚀', color: '#059669' };
  } else if (score >= 65) {
    level = { text: 'Good Quality 👍', color: '#0f766e' };
  } else if (score >= 40) {
    level = { text: 'In Progress ⚠️', color: '#d97706' };
  }

  return { score, checks, level };
}

/**
 * Render the live ATS Readiness Meter in the container slot.
 * @param {HTMLElement} container
 */
export function renderATSReadiness(container) {
  const slot = container.querySelector('#ats-readiness-slot');
  if (!slot) return;

  const state = store.getState();
  const { score, checks, level } = calculateATSReadiness(state);

  // Update live stepper badges
  const completion = getStepCompletion(state);
  container.querySelectorAll('.step-btn').forEach(btn => {
    const stepId = btn.getAttribute('data-step');
    const isDone = !!completion[stepId];
    const numEl = btn.querySelector('.step-num');
    if (isDone) {
      btn.classList.add('completed');
      if (numEl) numEl.textContent = '✓';
    } else {
      btn.classList.remove('completed');
      const stepIdx = STEPS_META.find(s => s.id === stepId)?.num;
      if (numEl && stepIdx) numEl.textContent = String(stepIdx);
    }
  });

  slot.innerHTML = `
    <div class="ats-readiness-bar" title="Click to view ATS Optimization Checklist">
      <div class="ats-bar-left">
        <svg class="ats-meter-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${level.color}" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <span class="ats-label">ATS Readiness:</span>
        <span class="ats-status-badge" style="color: ${level.color}; border-color: ${level.color}44; background-color: ${level.color}15;">
          ${score}% • ${level.text}
        </span>
      </div>
      <div class="ats-bar-right-group">
        <div class="ats-bar-track">
          <div class="ats-bar-fill" style="width: ${score}%; background-color: ${level.color};"></div>
        </div>
        <span class="ats-hint-link">Checklist ↗</span>
      </div>
    </div>
  `;

  const bar = slot.querySelector('.ats-readiness-bar');
  if (bar) {
    bar.onclick = () => {
      openATSChecklistModal(container, score, checks, level);
    };
  }
}

function openATSChecklistModal(container, score, checks, level) {
  const modal = document.getElementById('ats-checklist-modal');
  const body = document.getElementById('ats-modal-body');
  if (!modal || !body) return;

  const stepMapping = {
    contact: { step: 'sec-personal', desc: 'Full Name + Email or Phone for recruiter outreach.' },
    education: { step: 'sec-education', desc: 'Degree and educational institution listed.' },
    skills: { step: 'sec-skills', desc: 'At least 2 core skills across your domain.' },
    experience: { step: 'sec-experience', desc: 'Relevant positions or project experience.' },
    summary: { step: 'sec-summary', desc: 'Concise summary highlighting your background.' }
  };

  body.innerHTML = `
    <div class="ats-score-hero-box">
      <div class="ats-score-hero-left">
        <div class="ats-hero-pct">${score}%</div>
        <div class="ats-hero-label">ATS Readiness Index</div>
      </div>
      <div class="ats-hero-status-pill" style="color: ${level.color};">
        ${level.text}
      </div>
    </div>

    <div class="ats-checklist-list">
      ${checks.map(c => {
        const meta = stepMapping[c.id] || { step: 'sec-personal', desc: '' };
        return `
          <div class="ats-checklist-row ${c.passed ? 'passed' : 'failed'}">
            <div class="ats-check-left">
              <div class="ats-check-status-icon ${c.passed ? 'pass' : 'fail'}">
                ${c.passed ? ICONS.check : '!'}
              </div>
              <div class="ats-check-info">
                <span class="ats-check-label">${escapeHtml(c.label)} (${c.weight}%)</span>
                <span class="ats-check-hint">${escapeHtml(meta.desc)}</span>
              </div>
            </div>
            ${!c.passed ? `
              <button type="button" class="btn-ats-jump" data-jump="${meta.step}">
                Fix Now →
              </button>
            ` : `
              <span style="color: #059669; font-size: 11.5px; font-weight: 700;">Completed ✓</span>
            `}
          </div>
        `;
      }).join('')}
    </div>
  `;

  modal.classList.remove('hidden');

  // Jump buttons
  body.querySelectorAll('.btn-ats-jump').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetStep = e.currentTarget.getAttribute('data-jump');
      if (targetStep) {
        modal.classList.add('hidden');
        switchStep(container, targetStep);
      }
    });
  });

  const closeBtn = document.getElementById('btn-ats-modal-close');
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.add('hidden');
  }

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  };
}
