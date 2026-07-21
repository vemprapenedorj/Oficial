import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { discoverSiteRoutes, getSitemapSettings } from './site-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://vemprapenedo.com.br').replace(/\/$/, '');
const routes = discoverSiteRoutes().filter((route) => route !== '/404');

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

routes.forEach((route) => {
  const { changefreq, priority } = getSitemapSettings(route);
  xml += `
  <url>
    <loc>${BASE_URL}${route === '/' ? '' : route}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

xml += '\n</urlset>\n';

const publicDir = path.resolve(__dirname, '../public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml gerado com ${routes.length} URLs em public/sitemap.xml`);

const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.log('sitemap.xml copiado para dist/sitemap.xml');
}
