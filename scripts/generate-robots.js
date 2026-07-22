import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/robots.txt');
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://vemprapenedo.com.br')
  .replace(/\/$/, '');
const allowIndexing = process.env.ALLOW_INDEXING === 'true';

const content = allowIndexing
  ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n';

fs.writeFileSync(outputPath, content, 'utf8');
console.log(`robots.txt gerado: ${allowIndexing ? 'indexação permitida' : 'indexação bloqueada'}`);
