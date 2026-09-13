/**
 * ATS-Optimized Plain Text Resume Exporter (.txt)
 * Generates clean, structured plain text suitable for ATS copy-pasting.
 */

import { store } from '../store.js';

export function generateATSText(data) {
  const basics = data.basics || {};
  const visible = data.visibleSections || {};
  const lines = [];

  // Name & Headline
  lines.push((basics.fullName || 'RESUME').toUpperCase());
  if (basics.headline) lines.push(basics.headline);
  lines.push('='.repeat(60));
  lines.push('');

  // Contact Info
  const contacts = [];
  if (basics.email) contacts.push(`Email: ${basics.email}`);
  if (basics.phone) contacts.push(`Phone: ${basics.phone}`);
  if (basics.location) contacts.push(`Location: ${basics.location}`);
  if (basics.linkedin) contacts.push(`LinkedIn: ${basics.linkedin}`);
  if (basics.github) contacts.push(`GitHub: ${basics.github}`);
  if (basics.website) contacts.push(`Website: ${basics.website}`);
  if (contacts.length > 0) {
    lines.push(contacts.join(' | '));
    lines.push('');
  }

  // Summary
  if (data.summary && visible.summary !== false) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('-'.repeat(40));
    lines.push(data.summary);
    lines.push('');
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('-'.repeat(40));
    data.experience.forEach(exp => {
      lines.push(`${exp.title || 'Role'} | ${exp.company || 'Company'} (${exp.period || ''})`);
      if (exp.tag) lines.push(`Type: ${exp.tag}`);
      (exp.bullets || []).forEach(b => {
        lines.push(`  • ${b}`);
      });
      lines.push('');
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    lines.push('EDUCATION & QUALIFICATIONS');
    lines.push('-'.repeat(40));
    data.education.forEach(edu => {
      lines.push(`${edu.degree || 'Degree'} - ${edu.institution || ''} (${edu.year || ''})`);
      if (edu.score) lines.push(`  Grade / Score: ${edu.score}`);
      lines.push('');
    });
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    lines.push('SKILLS & CORE COMPETENCIES');
    lines.push('-'.repeat(40));
    data.skills.forEach(s => {
      lines.push(`${s.category}: ${(s.items || []).join(', ')}`);
    });
    lines.push('');
  }

  // Languages
  if (data.languages && data.languages.length > 0) {
    lines.push('LANGUAGES');
    lines.push('-'.repeat(40));
    lines.push(data.languages.map(l => `${l.name} (${l.level})`).join(', '));
    lines.push('');
  }

  // Biodata if enabled
  if (data.biodata && visible.biodata !== false) {
    const bio = data.biodata;
    const bioRows = [];
    if (bio.fatherName) bioRows.push(`Father's Name: ${bio.fatherName}`);
    if (bio.dob) bioRows.push(`Date of Birth: ${bio.dob}`);
    if (bio.gender) bioRows.push(`Gender: ${bio.gender}`);
    if (bio.nationality) bioRows.push(`Nationality: ${bio.nationality}`);
    if (bio.maritalStatus) bioRows.push(`Marital Status: ${bio.maritalStatus}`);
    if (basics.address) bioRows.push(`Permanent Address: ${basics.address}`);
    if (bioRows.length > 0) {
      lines.push('PERSONAL BIODATA');
      lines.push('-'.repeat(40));
      bioRows.forEach(r => lines.push(r));
      lines.push('');
    }
  }

  return lines.join('\n');
}

export function exportToTXT() {
  const data = store.getState();
  const textContent = generateATSText(data);
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (data.basics?.fullName || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.href = url;
  a.download = `${safeName}_ATS_Resume.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
