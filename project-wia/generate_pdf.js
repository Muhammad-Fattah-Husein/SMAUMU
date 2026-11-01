const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log('Using browser executable:', executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const htmlFilePath = path.resolve(__dirname, 'WIA_FSDMIA2026_NamaTim.html');
  const fileUrl = 'file:///' + htmlFilePath.replace(/\\/g, '/');

  console.log('Loading HTML file:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const rootOutputPath = path.resolve(__dirname, '..', 'WIA_FSDMIA2026_NamaTim.pdf');
  const projectOutputPath = path.resolve(__dirname, 'WIA_FSDMIA2026_NamaTim.pdf');

  console.log('Generating PDF to:', rootOutputPath);
  await page.pdf({
    path: rootOutputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });

  // Also copy to project folder
  fs.copyFileSync(rootOutputPath, projectOutputPath);

  await browser.close();

  const stats = fs.statSync(rootOutputPath);
  console.log(`PDF successfully generated! Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB (${stats.size} bytes)`);
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
