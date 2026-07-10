import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://vemprapenedo.com.br';

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/o-que-fazer', priority: '0.9', changefreq: 'weekly' },
  { url: '/onde-ficar', priority: '0.9', changefreq: 'weekly' },
  { url: '/gastronomia', priority: '0.9', changefreq: 'weekly' },
  { url: '/compras', priority: '0.9', changefreq: 'weekly' },
  { url: '/blog', priority: '0.7', changefreq: 'daily' },
  { url: '/contato', priority: '0.5', changefreq: 'monthly' },
  { url: '/sobre', priority: '0.5', changefreq: 'monthly' },
  { url: '/politica-privacidade', priority: '0.5', changefreq: 'monthly' },
  { url: '/termos-uso', priority: '0.5', changefreq: 'monthly' }
];

const blogArticles = [
  { slug: 'cachoeiras-penedo', priority: '0.7', changefreq: 'weekly' },
  { slug: 'penedo-guia', priority: '0.7', changefreq: 'weekly' },
  { slug: 'restaurantes', priority: '0.7', changefreq: 'weekly' },
  { slug: 'melhores-hospedagens', priority: '0.7', changefreq: 'weekly' }
];

// Load local business data dynamically
const localesPath = path.resolve(__dirname, '../src/locais.json');
let locaisData = {};
try {
  locaisData = JSON.parse(fs.readFileSync(localesPath, 'utf8'));
} catch (error) {
  console.error('Error loading locais.json:', error);
}

const dynamicUrls = [];
const categories = ['o-que-fazer', 'onde-ficar', 'gastronomia', 'compras'];

categories.forEach(cat => {
  if (locaisData[cat]) {
    locaisData[cat].forEach(item => {
      const isPremium = item.isPremium || item.is_premium;
      if (isPremium) {
        const slug = item.slug || item.id;
        dynamicUrls.push({
          url: `/${cat}/${slug}`,
          priority: '0.8',
          changefreq: 'weekly'
        });
      }
    });
  }
});

const lastmod = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Static Pages
staticPages.forEach(page => {
  xml += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
});

// Blog Articles
blogArticles.forEach(art => {
  xml += `
  <url>
    <loc>${BASE_URL}/blog/artigo/${art.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${art.changefreq}</changefreq>
    <priority>${art.priority}</priority>
  </url>`;
});

// Dynamic Detail Pages
dynamicUrls.forEach(dyn => {
  xml += `
  <url>
    <loc>${BASE_URL}${dyn.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${dyn.changefreq}</changefreq>
    <priority>${dyn.priority}</priority>
  </url>`;
});

xml += '\n</urlset>';

// Ensure public directory exists
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
console.log('sitemap.xml generated successfully in public/sitemap.xml!');

const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
  console.log('sitemap.xml generated successfully in dist/sitemap.xml!');
}
