import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import net from 'net';
import zlib from 'zlib';
import puppeteer from 'puppeteer';
import { discoverPrerenderRoutes } from './site-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTION_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://vemprapenedo.com.br')
  .replace(/\/$/, '');
const DIST_DIR = path.resolve(__dirname, '../dist');
const PUPPETEER_PROFILE_DIR = path.join(DIST_DIR, '.puppeteer-profile');

// --- 1. PORT POLLING HELPER ---
const getAvailablePort = () => new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    if (!address || typeof address === 'string') {
      server.close();
      reject(new Error('Não foi possível reservar uma porta para o Vite Preview.'));
      return;
    }
    server.close((error) => error ? reject(error) : resolve(address.port));
  });
});

const waitPort = async (port, timeout = 15000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.createConnection(port, '127.0.0.1');
        socket.on('connect', () => { socket.end(); resolve(); });
        socket.on('error', reject);
      });
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error(`Timeout waiting for port ${port}`);
};

// --- 2. COMPRESSION HELPER ---
const compressFile = (filePath) => {
  const content = fs.readFileSync(filePath);
  
  // Gzip
  const gzip = zlib.gzipSync(content);
  fs.writeFileSync(`${filePath}.gz`, gzip);
  
  // Brotli
  const brotli = zlib.brotliCompressSync(content);
  fs.writeFileSync(`${filePath}.br`, brotli);
};

// --- 4. PRE-RENDERING AND VALIDATION ---
const prerenderAndValidate = async (routes, baseUrl) => {
  console.log('🚀 Iniciando pré-renderização com Puppeteer...');
  const runsAsRoot = typeof process.getuid === 'function' && process.getuid() === 0;
  fs.rmSync(PUPPETEER_PROFILE_DIR, { recursive: true, force: true });
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 60_000,
    userDataDir: PUPPETEER_PROFILE_DIR,
    args: [
      '--disable-crash-reporter',
      ...(runsAsRoot
        ? [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote',
            '--single-process',
          ]
        : []),
    ],
  });
  const page = await browser.newPage();
  // This flag exists only in the browser's JavaScript context. It lets
  // DeferredSection emit the full static page without making real visitors
  // create every below-the-fold carousel during initial rendering.
  await page.evaluateOnNewDocument(() => {
    window.__PRERENDER__ = true;
  });
  
  const validationReport = [];
  let hasFailed = false;
  const allInternalLinks = new Set();
  const definedRoutes = new Set(routes);
  let homeHtmlContent = null;

  // Monitor browser console for hydration errors and general exceptions
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      console.error(`❌ CONSOLE.ERROR: ${text}`);
    } else if (text.includes('hydration') || text.includes('Hydration') || text.includes('Mismatched') || text.includes('does not match')) {
      console.warn(`⚠️ ALERTA DO CONSOLE DO NAVEGADOR: ${text}`);
    }
  });

  page.on('pageerror', err => {
    console.error(`🚨 ERRO CRÍTICO DO CLIENTE (JS CRASH): ${err.toString()}`);
  });

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    console.log(`🔹 Processando rota: ${route}`);
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Wait for App to render
    await page.waitForSelector('#root');
    
    // Extract metadata and content
    const pageSEO = await page.evaluate(() => {
      const getMeta = (name, isProperty = false) => {
        const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        const el = document.querySelector(selector);
        return el ? el.getAttribute('content') : null;
      };
      
      const getCanonical = () => {
        const el = document.querySelector('link[rel="canonical"]');
        return el ? el.getAttribute('href') : null;
      };
      
      const getJsonLd = () => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        const list = Array.from(scripts);
        const hasSchema = list.length > 0;
        let breadcrumbItems = null;
        for (const script of list) {
          try {
            const data = JSON.parse(script.textContent);
            const items = Array.isArray(data) ? data : [data];
            const breadcrumbList = items.find(item => item["@type"] === 'BreadcrumbList');
            if (breadcrumbList && breadcrumbList.itemListElement) {
              breadcrumbItems = breadcrumbList.itemListElement.map(item => item.item);
            }
          } catch (e) {}
        }
        return { hasSchema, breadcrumbItems };
      };

      const getH1 = () => {
        const el = document.querySelector('h1');
        return el ? el.textContent.trim() : null;
      };

      const getLang = () => {
        const el = document.documentElement;
        return el ? el.getAttribute('lang') : null;
      };

      const getInternalLinks = () => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(el => el.getAttribute('href'))
          .filter(href => {
            if (!href) return false;
            return href.startsWith('/') && 
                   !href.startsWith('//') && 
                   !href.includes(':') &&
                   !href.match(/\.(jpg|jpeg|png|gif|svg|pdf|json|xml|txt|gz|br|css|js)$/i) &&
                   !href.includes('#');
          });
      };

      const jsonLdInfo = getJsonLd();

      const checkVisibility = () => {
        const errorsList = [];
        const selectors = [
          { sel: '#root', name: 'Contêiner principal (#root)' },
          { sel: '#root > div', name: 'Wrapper de página interno' },
          { sel: 'h1', name: 'Cabeçalho principal (h1)' },
          { sel: 'main', name: 'Área de conteúdo principal (main)' }
        ];

        selectors.forEach(({ sel, name }) => {
          const el = document.querySelector(sel);
          if (el) {
            const style = window.getComputedStyle(el);
            if (style.opacity === '0') {
              errorsList.push(`${name} está com opacity: 0 (invisível)`);
            }
            if (style.visibility === 'hidden') {
              errorsList.push(`${name} está com visibility: hidden (oculto)`);
            }
            if (style.display === 'none') {
              errorsList.push(`${name} está com display: none (não renderizado)`);
            }
          }
        });
        return errorsList;
      };

      return {
        title: document.title,
        description: getMeta('description') || getMeta('og:description', true),
        canonical: getCanonical(),
        h1: getH1(),
        lang: getLang(),
        viewport: getMeta('viewport'),
        robots: getMeta('robots'),
        // Open Graph
        ogTitle: getMeta('og:title', true),
        ogDescription: getMeta('og:description', true),
        ogImage: getMeta('og:image', true),
        ogType: getMeta('og:type', true),
        // Twitter Card
        twitterCard: getMeta('twitter:card'),
        twitterTitle: getMeta('twitter:title'),
        twitterDescription: getMeta('twitter:description'),
        hasJsonLd: jsonLdInfo.hasSchema,
        breadcrumbItems: jsonLdInfo.breadcrumbItems,
        internalLinks: getInternalLinks(),
        structuralVisibilityErrors: checkVisibility()
      };
    });

    // Validate SEO Requirements
    const errors = [];
    if (pageSEO.structuralVisibilityErrors && pageSEO.structuralVisibilityErrors.length > 0) {
      errors.push(...pageSEO.structuralVisibilityErrors);
    }
    if (!pageSEO.title || pageSEO.title.trim() === '') errors.push('Title ausente ou vazio');
    if (!pageSEO.description || pageSEO.description.trim() === '') errors.push('Meta Description ausente');
    if (!pageSEO.lang || pageSEO.lang !== 'pt-BR') errors.push(`Lang incorreto ou ausente: ${pageSEO.lang}`);
    if (!pageSEO.viewport) errors.push('Meta tag viewport ausente');
    if (!pageSEO.robots) errors.push('Meta tag robots ausente');
    
    // H1 check
    if (!pageSEO.h1 || pageSEO.h1.trim() === '') {
      errors.push('H1 ausente ou vazio');
    }
    
    // Canonical check (normalized trail checks)
    // This campaign URL intentionally uses the exact canonical supplied for ads,
    // while its static directory keeps the usual trailing-slash delivery URL.
    const expectedCanonical = route === '/divulgue-seu-negocio/'
      ? `${PRODUCTION_URL}/divulgue-seu-negocio`
      : `${PRODUCTION_URL}${route}`;
    if (!pageSEO.canonical) {
      errors.push('Canonical Link ausente');
    } else if (expectedCanonical.toLowerCase() !== pageSEO.canonical.toLowerCase()) {
      errors.push(`Canonical Link incorreto: esperado [${expectedCanonical}], obtido [${pageSEO.canonical}]`);
    }

    // Open Graph checks
    if (!pageSEO.ogTitle) errors.push('Open Graph Title (og:title) ausente');
    if (!pageSEO.ogDescription) errors.push('Open Graph Description (og:description) ausente');
    if (!pageSEO.ogImage) errors.push('Open Graph Image (og:image) ausente');
    if (!pageSEO.ogType) errors.push('Open Graph Type (og:type) ausente');

    // Twitter Card checks
    if (!pageSEO.twitterCard) errors.push('Twitter Card (twitter:card) ausente');
    if (!pageSEO.twitterTitle) errors.push('Twitter Title (twitter:title) ausente');
    if (!pageSEO.twitterDescription) errors.push('Twitter Description (twitter:description) ausente');

    // Schema.org check (exclude 404 page)
    if (route !== '/404/' && !pageSEO.hasJsonLd) {
      errors.push('Structured Data JSON-LD Schema.org ausente');
    }

    // Breadcrumbs check (first/last item check with normalized trail, support 1 item for root)
    if (pageSEO.breadcrumbItems) {
      const items = pageSEO.breadcrumbItems;
      const minItems = route === '/' ? 1 : 2;
      if (items.length < minItems) {
        errors.push(`Breadcrumbs schema deve ter pelo menos ${minItems} itens, obtido [${items.length}]`);
      } else {
        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        const expectedHome = `${PRODUCTION_URL}/`;
        if (firstItem.toLowerCase() !== expectedHome.toLowerCase()) {
          errors.push(`Primeiro item do breadcrumb deve ser a home [${expectedHome}], obtido [${firstItem}]`);
        }
        if (lastItem.toLowerCase() !== expectedCanonical.toLowerCase()) {
          errors.push(`Último item do breadcrumb deve ser a URL canônica da página [${expectedCanonical}], obtido [${lastItem}]`);
        }
      }
    } else if (route !== '/404/') {
      errors.push('BreadcrumbList schema ausente no JSON-LD');
    }

    // Collect internal links for validation at the end
    if (pageSEO.internalLinks) {
      pageSEO.internalLinks.forEach(link => allInternalLinks.add(link));
    }

    validationReport.push({
      route,
      title: pageSEO.title,
      h1: pageSEO.h1,
      canonical: pageSEO.canonical,
      hasJsonLd: pageSEO.hasJsonLd,
      errors
    });

    if (errors.length > 0) {
      console.error(`❌ Falha de Validação SEO na rota [${route}]:`, errors.join(', '));
      hasFailed = true;
    }

    const htmlContent = await page.content();

    // To prevent polluting index.html served by preview server, store home HTML and write at the very end
    if (route === '/') {
      homeHtmlContent = htmlContent;
    } else {
      const routeDir = path.join(DIST_DIR, route);
      fs.mkdirSync(routeDir, { recursive: true });
      const outputPath = path.join(routeDir, 'index.html');
      fs.writeFileSync(outputPath, htmlContent, 'utf8');
      compressFile(outputPath);
    }
  }

  // --- Validate internal links ---
  const brokenLinks = [];
  allInternalLinks.forEach(link => {
    const normalizedLink = link === '/' ? '/' : link.replace(/\/$/, '');
    const exists = definedRoutes.has(normalizedLink) || definedRoutes.has(`${normalizedLink}/`);
    if (!exists) {
      brokenLinks.push(link);
    }
  });

  if (brokenLinks.length > 0) {
    console.error('❌ Falha: Encontrados links internos quebrados no site:', brokenLinks.join(', '));
    hasFailed = true;
  }

  await browser.close();

  // Write home page HTML output (safely post-browser close)
  if (homeHtmlContent) {
    const homeOutputPath = path.join(DIST_DIR, 'index.html');
    fs.writeFileSync(homeOutputPath, homeHtmlContent, 'utf8');
    compressFile(homeOutputPath);
    console.log('✅ index.html (home) gerado e comprimido na raiz da build!');
  }

  // Save 404 page fallback as 404.html at root level
  const static404Path = path.join(DIST_DIR, '404/index.html');
  if (fs.existsSync(static404Path)) {
    fs.copyFileSync(static404Path, path.join(DIST_DIR, '404.html'));
    compressFile(path.join(DIST_DIR, '404.html'));
    console.log('✅ 404.html gerado na raiz da build!');
  }

  // --- Output Markdown SEO Report ---
  generateReportFile(validationReport, brokenLinks, routes.length);

  if (hasFailed) {
    console.error('\n🚨 ALERTA: O build falhou devido a erros críticos de SEO ou Links quebrados!');
    process.exit(1);
  }
  
  console.log('✅ Todas as páginas pré-renderizadas, validadas e comprimidas com sucesso!');
};

// --- 5. REPORT GENERATOR ---
const generateReportFile = (report, brokenLinks, totalPages) => {
  const reportPath = path.join(DIST_DIR, 'seo-audit-report.md');
  const lastmod = new Date().toISOString();
  
  let markdown = `# Relatório de Auditoria SEO e Pré-renderização

Gerado em: **${lastmod}**
Total de Páginas Pré-renderizadas: **${totalPages}**
Status do Build: **${report.some(r => r.errors.length > 0) || brokenLinks.length > 0 ? 'FALHOU ❌' : 'SUCESSO ✅'}**

---

## 🔗 Auditoria de Links Internos
*   Total de links internos únicos rastreados: **${brokenLinks.length + report.reduce((acc, cur) => acc + (cur.errors.length === 0 ? 1 : 0), 0)}**
*   Links quebrados encontrados: **${brokenLinks.length}**
${brokenLinks.map(l => `    *   [Link Quebrado] \`${l}\` ❌`).join('\n')}

---

## 📄 Detalhamento por Página
| Rota | Title | H1 | Canonical | Schema.org | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

  report.forEach(r => {
    markdown += `| \`${r.route}\` | ${r.title || 'N/A'} | ${r.h1 || 'N/A'} | ${r.canonical ? 'Sim' : 'Não'} | ${r.hasJsonLd ? 'Sim' : 'Não'} | ${r.errors.length > 0 ? 'FALHOU ❌' : 'OK ✅'} |\n`;
  });

  if (report.some(r => r.errors.length > 0)) {
    markdown += '\n### 🚨 Erros Detectados\n';
    report.forEach(r => {
      if (r.errors.length > 0) {
        markdown += `*   **Rota \`${r.route}\`**:\n`;
        r.errors.forEach(e => {
          markdown += `    *   ${e}\n`;
        });
      }
    });
  }

  fs.writeFileSync(reportPath, markdown, 'utf8');
  console.log('✅ Relatório seo-audit-report.md gerado com sucesso em dist/!');
};

// --- MAIN RUNNER ---
const main = async () => {
  console.log('🏁 Iniciando pipeline de Pré-renderização e Otimização SEO...');
  
  // 1. Discover all routes
  const routes = discoverPrerenderRoutes();
  
  // 2. Start Vite Preview server helper
  console.log('🔌 Iniciando servidor de preview do Vite...');
  let previewProcess;

  try {
    // Reserve a free port so shared build runners cannot serve another process.
    const port = await getAvailablePort();
    const baseUrl = `http://127.0.0.1:${port}`;
    const viteEntry = path.resolve(__dirname, '../node_modules/vite/bin/vite.js');
    previewProcess = spawn(process.execPath, [
      viteEntry,
      'preview',
      '--host', '127.0.0.1',
      '--port', port.toString(),
      '--strictPort',
    ], { stdio: 'ignore' });

    // 3. Poll the exact preview process port before crawling.
    await waitPort(port);
    console.log(`🔌 Servidor de preview ativo em ${baseUrl}.`);
    
    // 4. Prerender routes and validate
    await prerenderAndValidate(routes, baseUrl);
    
    // 5. Generate sitemap
    
    console.log('🎉 Pipeline finalizado com sucesso absoluto!');
  } catch (error) {
    console.error('🚨 Erro crítico na pipeline de pré-renderização:', error);
    previewProcess?.kill();
    process.exit(1);
  } finally {
    console.log('🔌 Encerrando servidor de preview do Vite...');
    previewProcess?.kill();
    fs.rmSync(PUPPETEER_PROFILE_DIR, { recursive: true, force: true });
  }
};

main();
