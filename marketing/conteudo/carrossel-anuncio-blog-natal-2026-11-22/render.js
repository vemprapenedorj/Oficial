import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const directory = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(directory, 'instagram');
await fs.mkdir(output, { recursive: true });

console.log('🚀 Iniciando renderização dos slides 1080x1350...');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  await page.goto(new URL('./carrossel.html', import.meta.url).href, { waitUntil: 'load' });
  
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.complete ? undefined : new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    })));
  });

  const slides = await page.$$('.slide');
  console.log(`📸 Localizados ${slides.length} slides.`);
  
  for (let index = 0; index < slides.length; index++) {
    const filename = `slide-${String(index + 1).padStart(2, '0')}.png`;
    const dest = path.join(output, filename);
    await slides[index].screenshot({ path: dest });
    console.log(`✅ Gerado: ${filename}`);
  }

  console.log('🎉 Renderização concluída com sucesso!');
} finally {
  await browser.close();
}
