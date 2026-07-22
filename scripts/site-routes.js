import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIC_ROUTES = ['/', '/blog', '/contato', '/politica-de-privacidade', '/politica-de-cookies', '/404'];

const loadDetailsData = () => {
  const detailsPath = path.resolve(__dirname, '../src/data/detailsData.ts');
  const source = fs.readFileSync(detailsPath, 'utf8');
  const declarationStart = source.indexOf('export const DETAILS_DATA');
  const objectStart = source.indexOf('{', declarationStart);
  const objectEnd = source.lastIndexOf('};');
  if (declarationStart === -1 || objectStart === -1 || objectEnd === -1) {
    throw new Error('Não foi possível localizar DETAILS_DATA em src/data/detailsData.ts');
  }
  return JSON.parse(source.slice(objectStart, objectEnd + 1));
};

export const discoverSiteRoutes = () => {
  const routes = new Set(STATIC_ROUTES);
  const detailsData = loadDetailsData();

  Object.entries(detailsData).forEach(([category, items]) => {
    if (category === 'blog') {
      items.forEach((item) => {
        const slug = item.slug || item.id;
        if (slug) routes.add(`/blog/artigo/${slug}`);
      });
      return;
    }
    routes.add(`/${category}`);
    items.forEach((item) => {
      const slug = item.slug || item.id;
      if (slug && item.isPremium) routes.add(`/${category}/${slug}`);
    });
  });
  return Array.from(routes);
};

export const getSitemapSettings = (route) => {
  if (route === '/') return { changefreq: 'daily', priority: '1.0' };
  if (['/o-que-fazer', '/onde-ficar', '/gastronomia', '/compras'].includes(route)) {
    return { changefreq: 'weekly', priority: '0.9' };
  }
  if (route === '/blog') return { changefreq: 'daily', priority: '0.8' };
  if (route.startsWith('/blog/artigo/')) return { changefreq: 'weekly', priority: '0.7' };
  if (route === '/contato') return { changefreq: 'monthly', priority: '0.5' };
  if (route.startsWith('/politica-de-')) return { changefreq: 'yearly', priority: '0.3' };
  if (route.split('/').filter(Boolean).length === 2) return { changefreq: 'weekly', priority: '0.8' };
  return { changefreq: 'weekly', priority: '0.6' };
};
