import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const port = 4317;
const baseUrl = `http://127.0.0.1:${port}`;

const waitForServer = async () => {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('Servidor Vite não iniciou dentro de 20 segundos');
};

test('histórico voltar e avançar mantém URL e conteúdo sincronizados', { timeout: 60_000 }, async (t) => {
  const viteEntry = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
  const server = spawn(process.execPath, [viteEntry, '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: projectRoot,
    stdio: 'ignore'
  });
  let browser;
  let stage = 'iniciar servidor';

  try {
    await waitForServer();
    stage = 'abrir Chromium';
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(10_000);
    page.setDefaultNavigationTimeout(10_000);
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname !== '127.0.0.1') request.abort();
      else request.continue();
    });

    stage = 'abrir página inicial';
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    stage = 'navegar para O Que Fazer';
    await page.click('a[href="/o-que-fazer"]');
    await page.waitForFunction(() => location.pathname === '/o-que-fazer');
    assert.match(await page.$eval('h1', (element) => element.textContent || ''), /O Que Fazer/);

    stage = 'voltar para a home';
    await page.evaluate(() => history.back());
    await page.waitForFunction(() => location.pathname === '/');
    assert.equal(new URL(page.url()).pathname, '/');

    stage = 'avançar para O Que Fazer';
    await page.evaluate(() => history.forward());
    await page.waitForFunction(() => location.pathname === '/o-que-fazer');
    assert.match(await page.$eval('h1', (element) => element.textContent || ''), /O Que Fazer/);
  } catch (error) {
    if (stage === 'abrir Chromium') {
      t.skip(`Chromium indisponível neste ambiente: ${error.message}`);
      return;
    }
    throw new Error(`Falha na etapa "${stage}": ${error.message}`, { cause: error });
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
});
