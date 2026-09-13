/**
 * Automated Vector PDF Export Test for CV Template
 * Emulates print media and validates standard A4 vector PDF generation across all 5 templates.
 */

import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PDF_OUTPUT_DIR = path.resolve('tests/output/pdfs');
const STATIC_DIR = path.resolve('.');
const PORT = 8090;
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

if (!fs.existsSync(PDF_OUTPUT_DIR)) {
  fs.mkdirSync(PDF_OUTPUT_DIR, { recursive: true });
}

async function testPdfExport() {
  console.log('=== RUNNING A4 VECTOR PDF EXPORT SUITE ===');
  let server = null;
  if (!process.env.TEST_URL) {
    server = await createStaticServer(PORT);
    console.log(`Local test server started at ${URL}`);
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // Load rich tech profile
    await page.click('#btn-preset-tech');
    await new Promise(r => setTimeout(r, 300));

    const templates = ['template-1', 'template-2', 'template-3', 'template-4', 'template-5'];

    for (const tid of templates) {
      console.log(`Generating vector PDF for ${tid}...`);
      await page.click(`.btn-studio-tpl[data-tid="${tid}"]`);
      await new Promise(r => setTimeout(r, 200));

      await page.click('#btn-header-preview');
      await new Promise(r => setTimeout(r, 400));
      await page.emulateMediaType('print');

      const pdfPath = path.join(PDF_OUTPUT_DIR, `cv-${tid}.pdf`);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });

      const stats = fs.statSync(pdfPath);
      if (stats.size < 1000) {
        throw new Error(`Generated PDF ${tid} is abnormally small (${stats.size} bytes)!`);
      }
      console.log(`✓ Generated ${path.basename(pdfPath)} (${Math.round(stats.size / 1024)} KB)`);

      await page.emulateMediaType('screen');
      await page.click('#btn-close-preview');
      await new Promise(r => setTimeout(r, 200));
    }

    console.log('=== ALL 5 TEMPLATES EXPORTED VECTOR-SHARP A4 PDFS SUCCESSFULLY ===');
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }
}

testPdfExport().catch(err => {
  console.error('FATAL PDF EXPORT TEST ERROR:', err);
  process.exit(1);
});
