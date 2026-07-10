import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import net from 'net';
import zlib from 'zlib';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const PRODUCTION_URL = 'https://vemprapenedo.com.br';
const DIST_DIR = path.resolve(__dirname, '../dist');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// --- 1. PORT POLLING HELPER ---
const waitPort = async (port, timeout = 15000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.createConnection(port, 'localhost');
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

// --- 2. ROUTE DISCOVERY ---
const discoverRoutes = () => {
  console.log('🔍 Iniciando descoberta automática de rotas...');
  const routes = new Set(['/', '/blog', '/contato', '/404']);
  const explicitSlugs = new Map();

  // 1. First Pass: Read detailsData.ts to collect explicit slugs
  let DETAILS_DATA = null;
  const detailsDataPath = path.resolve(__dirname, '../src/data/detailsData.ts');
  if (fs.existsSync(detailsDataPath)) {
    try {
      const tsContent = fs.readFileSync(detailsDataPath, 'utf8');
      const jsContent = tsContent
        .replace(/import\s+.*;/g, '')
        .replace(/export\s+/g, '')
        .replace(/: Record<string, DetailItem\[\]>/g, '');
      
      const context = {};
      const runContext = new Function('exports', `${jsContent}\nexports.DETAILS_DATA = DETAILS_DATA;`);
      runContext(context);
      DETAILS_DATA = context.DETAILS_DATA;
      
      if (DETAILS_DATA) {
        Object.keys(DETAILS_DATA).forEach(cat => {
          if (cat !== 'blog') {
            DETAILS_DATA[cat].forEach(item => {
              if (item.slug && item.id) {
                explicitSlugs.set(item.id, item.slug);
              }
            });
          }
        });
      }
    } catch (err) {
      console.error('⚠️ Erro ao ler detailsData.ts para mapear slugs:', err);
    }
  }

  // 2. First Pass: Read locais.json to collect explicit slugs
  let locaisData = null;
  const locaisPath = path.resolve(__dirname, '../src/locais.json');
  if (fs.existsSync(locaisPath)) {
    try {
      locaisData = JSON.parse(fs.readFileSync(locaisPath, 'utf8'));
      if (locaisData) {
        Object.keys(locaisData).forEach(cat => {
          locaisData[cat].forEach(item => {
            if (item.slug && item.id) {
              explicitSlugs.set(item.id, item.slug);
            }
          });
        });
      }
    } catch (err) {
      console.error('⚠️ Erro ao ler locais.json para mapear slugs:', err);
    }
  }

  // 3. Second Pass: Add category routes and details routes using final slugs
  if (DETAILS_DATA) {
    Object.keys(DETAILS_DATA).forEach(cat => {
      if (cat === 'blog') {
        DETAILS_DATA[cat].forEach(item => {
          const slug = item.slug || item.id;
          if (slug) {
            routes.add(`/blog/artigo/${slug}`);
          }
        });
      } else {
        routes.add(`/${cat}`);
        DETAILS_DATA[cat].forEach(item => {
          const slug = explicitSlugs.get(item.id) || item.slug || item.id;
          const isPremium = item.isPremium || item.is_premium;
          if (slug && isPremium) {
            routes.add(`/${cat}/${slug}`);
          }
        });
      }
    });
  }

  if (locaisData) {
    Object.keys(locaisData).forEach(cat => {
      routes.add(`/${cat}`);
      locaisData[cat].forEach(item => {
        const slug = explicitSlugs.get(item.id) || item.slug || item.id;
        const isPremium = item.isPremium || item.is_premium;
        if (slug && isPremium) {
          routes.add(`/${cat}/${slug}`);
        }
      });
    });
  }

  console.log(`✅ Descobertas ${routes.size} rotas únicas.`);
  return Array.from(routes);
};

// --- 3. COMPRESSION HELPER ---
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
const prerenderAndValidate = async (routes) => {
  console.log('🚀 Iniciando pré-renderização com Puppeteer...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
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
    const url = `${BASE_URL}${route}`;
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
    const expectedCanonical = `${PRODUCTION_URL}${route === '/' ? '' : route}`;
    const cleanExpected = expectedCanonical.replace(/\/$/, '').toLowerCase();
    const cleanObtained = (pageSEO.canonical || '').replace(/\/$/, '').toLowerCase();
    if (!pageSEO.canonical) {
      errors.push('Canonical Link ausente');
    } else if (cleanExpected !== cleanObtained) {
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
    if (route !== '/404' && !pageSEO.hasJsonLd) {
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
        const cleanFirst = firstItem.replace(/\/$/, '').toLowerCase();
        const cleanHome = expectedHome.replace(/\/$/, '').toLowerCase();
        if (cleanFirst !== cleanHome) {
          errors.push(`Primeiro item do breadcrumb deve ser a home [${expectedHome}], obtido [${firstItem}]`);
        }
        const cleanLast = lastItem.replace(/\/$/, '').toLowerCase();
        const cleanExpectedCanonical = expectedCanonical.replace(/\/$/, '').toLowerCase();
        if (cleanLast !== cleanExpectedCanonical) {
          errors.push(`Último item do breadcrumb deve ser a URL canônica da página [${expectedCanonical}], obtido [${lastItem}]`);
        }
      }
    } else if (route !== '/404') {
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

// --- 6. SITEMAP GENERATION ---
const generateSitemap = (routes) => {
  console.log('xml 🗺️ Gerando sitemap.xml baseado nas páginas geradas...');
  const lastmod = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  routes.forEach(route => {
    if (route === '/404') return; // Exclude 404 page from sitemap

    let priority = '0.6';
    let changefreq = 'weekly';
    
    if (route === '/') {
      priority = '1.0';
      changefreq = 'daily';
    } else if (['/o-que-fazer', '/onde-ficar', '/gastronomia', '/compras'].includes(route)) {
      priority = '0.9';
    } else if (route === '/blog') {
      priority = '0.8';
      changefreq = 'daily';
    } else if (route.startsWith('/blog/')) {
      priority = '0.7';
    } else if (route === '/contato') {
      priority = '0.5';
      changefreq = 'monthly';
    }

    xml += `
  <url>
    <loc>${PRODUCTION_URL}${route === '/' ? '' : route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  xml += '\n</urlset>';
  
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log('✅ sitemap.xml gerado em public/ e dist/!');
};

// --- MAIN RUNNER ---
const main = async () => {
  console.log('🏁 Iniciando pipeline de Pré-renderização e Otimização SEO...');
  
  // 1. Discover all routes
  const routes = discoverRoutes();
  
  // 2. Start Vite Preview server helper
  console.log('🔌 Iniciando servidor de preview do Vite...');
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', PORT.toString()], {
    shell: true,
    stdio: 'ignore'
  });
  
  try {
    // 3. Poll server until active
    await waitPort(PORT);
    console.log(`🔌 Servidor de preview ativo em localhost:${PORT}.`);
    
    // 4. Prerender routes and validate
    await prerenderAndValidate(routes);
    
    // 5. Generate sitemap
    generateSitemap(routes);
    
    console.log('🎉 Pipeline finalizado com sucesso absoluto!');
  } catch (error) {
    console.error('🚨 Erro crítico na pipeline de pré-renderização:', error);
    previewProcess.kill();
    process.exit(1);
  } finally {
    console.log('🔌 Encerrando servidor de preview do Vite...');
    previewProcess.kill();
  }
};

main();
