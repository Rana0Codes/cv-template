/**
 * Automated Verification Suite for CV Template
 * Tests initial load, preset loading, minimal data adaptation across 5 templates,
 * and responsive reflows across multiple viewports.
 */

import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('tests/output/screenshots');
const STATIC_DIR = path.resolve('.');
const PORT = 8089;
const URL = process.env.TEST_URL || `http://localhost:${PORT}/`;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function createStaticServer(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/') reqPath = '/index.html';
      const filePath = path.join(STATIC_DIR, decodeURIComponent(reqPath));
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not Found: ' + reqPath);
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(port, () => resolve(server));
    server.on('error', reject);
  });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runTests() {
  console.log('=== RUNNING CV TEMPLATE VERIFICATION SUITE ===');
  let server = null;
  if (!process.env.TEST_URL) {
    server = await createStaticServer(PORT);
    console.log(`Local test server started at ${URL}`);
  }

  let browser;
  const consoleErrors = [];

  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    // 1. Initial Load Test
    console.log('[1/4] Testing initial page load & UI mounting...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    const title = await page.title();
    console.log(`✓ Page Title: "${title}"`);

    // Verify header controls exist
    const hasHeaderPreview = await page.$('#btn-header-preview') !== null;
    const hasDownloadPdf = await page.$('#btn-download-pdf') !== null;
    if (!hasHeaderPreview || !hasDownloadPdf) {
      throw new Error('Critical header action buttons missing!');
    }
    console.log('✓ Header controls mounted successfully.');

    // 2. Preset Switching Test
    console.log('[2/4] Testing preset switches...');
    await page.click('#btn-preset-tech');
    await new Promise(r => setTimeout(r, 250));
    await page.click('#btn-preset-exec');
    await new Promise(r => setTimeout(r, 250));
    console.log('✓ Preset switching verified without errors.');

    // 3. Template Minimal Data Adaptation
    console.log('[3/4] Testing all 5 templates with minimal content...');
    const minimalData = {
      selectedTemplate: 'template-1',
      themeColor: '#0f766e',
      fontFamily: 'sans',
      basics: {
        fullName: 'Jordan Taylor',
        headline: 'Senior Engineer',
        photoUrl: '',
        email: 'jordan.taylor@example.com',
        phone: '+1 (555) 019-2831',
        location: 'San Francisco, CA',
        website: '',
        linkedin: '',
        github: ''
      },
      summary: '',
      skills: [{ id: 's1', category: 'Core', items: ['TypeScript', 'Cloud', 'System Architecture'] }],
      languages: [],
      experience: [],
      education: [{ id: 'ed1', degree: 'B.S. in Computer Science', institution: 'UC Berkeley', year: '2022', score: '' }],
      biodata: { fatherName: '', dob: '', nationality: '', gender: '', maritalStatus: '', address: '' },
      declaration: { enabled: false, text: '', place: '', date: '', signatureName: '' }
    };

    const templates = ['template-1', 'template-2', 'template-3', 'template-4', 'template-5'];

    for (const tid of templates) {
      minimalData.selectedTemplate = tid;
      await page.evaluate((data) => {
        localStorage.setItem('cv_template_state_v1', JSON.stringify(data));
        location.reload();
      }, minimalData);

      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      await page.click('#btn-header-preview');
      await new Promise(r => setTimeout(r, 300));

      const report = await page.evaluate(() => {
        const paper = document.getElementById('cv-paper');
        const text = paper ? paper.innerText : '';
        return {
          hasUndefined: text.includes('undefined'),
          hasNull: text.includes('null'),
          hasNaN: text.includes('NaN'),
          hasEmptyExperienceHeading: text.toLowerCase().includes('work experience') || text.toLowerCase().includes('career milestones')
        };
      });

      if (report.hasUndefined || report.hasNull || report.hasNaN) {
        throw new Error(`Template ${tid} contained invalid text literals!`);
      }
      if (report.hasEmptyExperienceHeading) {
        throw new Error(`Template ${tid} displayed empty experience section heading!`);
      }

      const paperEl = await page.$('#cv-paper');
      if (paperEl) {
        await paperEl.screenshot({ path: path.join(OUTPUT_DIR, `minimal-${tid}.png`) });
      }
      await page.click('#btn-close-preview');
      await new Promise(r => setTimeout(r, 200));
    }
    console.log('✓ All 5 templates adapt gracefully with zero undefined or empty headings.');

    // 4. Responsive Viewports Test
    console.log('[4/4] Testing responsive viewports...');
    const viewports = [
      { width: 1440, height: 900, label: 'Desktop 1440x900' },
      { width: 1024, height: 768, label: 'Laptop 1024x768' },
      { width: 768, height: 1024, label: 'Tablet 768x1024' },
      { width: 375, height: 812, label: 'Mobile 375x812' }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 150));

      const hasOverflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth;
      });

      if (hasOverflow) {
        throw new Error(`Horizontal overflow detected at viewport ${vp.label}!`);
      }
    }
    console.log('✓ Zero horizontal overflow detected across all target viewports.');

    console.log('\n=== ALL VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
    console.log('Console Errors:', consoleErrors);
    if (consoleErrors.length > 0) {
      throw new Error('Test run encountered browser console errors: ' + JSON.stringify(consoleErrors));
    }
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }
}

runTests().catch(err => {
  console.error('FATAL VERIFICATION ERROR:', err);
  process.exit(1);
});
