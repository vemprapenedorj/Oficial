import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { discoverPrerenderRoutes } from './site-routes.js';

const writeClientRoutes = () => {
  const distDir = path.resolve('dist');
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'));
  const routes = discoverPrerenderRoutes();

  for (const route of routes) {
    if (route === '/') continue;
    const routeDir = path.join(distDir, route.replace(/^\/+|\/+$/g, ''));
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml);
  }

  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);
  console.log(`✅ ${routes.length} rotas preparadas para navegação direta sem Chromium.`);
};

console.log('📡 [Build Pipeline] Preparando pacote para hospedagem estática.');

try {
  execSync('npm run validate:events', { stdio: 'inherit' });
  // 1. Generate environment-specific crawler directives.
  console.log('🤖 Gerando robots.txt para o ambiente...');
  execSync('node scripts/generate-robots.js', { stdio: 'inherit' });

  // 2. Generate the public sitemap from the current content source.
  console.log('🗺️ Gerando sitemap.xml...');
  execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });

  // 3. Run standard Vite compilation
  console.log('📦 Executando vite build...');
  execSync('npx vite build', { stdio: 'inherit' });

  // 4. O servidor só atende rotas diretas com dist/rota/index.html. Quando
  // Chromium não está disponível na homologação, crie essas entradas para
  // que a aplicação cliente consiga abrir as páginas internas.
  if (process.env.SKIP_PRERENDER === 'true') {
    console.log('⏭️ [Build Pipeline] SKIP_PRERENDER=true detectado: preparando rotas para a aplicação cliente.');
    writeClientRoutes();
  } else {
    console.log('🚀 Iniciando pré-renderização estática (SSG) com Puppeteer...');
    execSync('node scripts/prerender.js', { stdio: 'inherit' });
  }
  
  console.log('🎉 Pipeline de build finalizado com sucesso!');
} catch (error) {
  console.error('❌ Erro na pipeline de build:', error);
  process.exit(1);
}
