import { execSync } from 'child_process';

const skipPrerender = process.env.SKIP_PRERENDER === 'true';

console.log('📡 [Build Pipeline] Preparando pacote para hospedagem estática.');

try {
  // 1. Generate environment-specific crawler directives.
  console.log('🤖 Gerando robots.txt para o ambiente...');
  execSync('node scripts/generate-robots.js', { stdio: 'inherit' });

  // 2. Generate the public sitemap from the current content source.
  console.log('🗺️ Gerando sitemap.xml...');
  execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });

  // 3. Run standard Vite compilation
  console.log('📦 Executando vite build...');
  execSync('npx vite build', { stdio: 'inherit' });

  // 4. Pré-renderização é uma otimização de SEO. O pacote Vite já está apto
  // para publicação, portanto a indisponibilidade do Chromium no servidor de
  // build não deve interromper o deploy do site.
  if (skipPrerender) {
    console.log('⚡ SKIP_PRERENDER=true: pré-renderização estática ignorada.');
  } else {
    try {
      console.log('🚀 Iniciando pré-renderização estática (SSG) com Puppeteer...');
      execSync('node scripts/prerender.js', { stdio: 'inherit' });
    } catch {
      console.warn('⚠️ O Chromium não iniciou. O deploy continuará com a versão SPA funcional.');
    }
  }
  
  console.log('🎉 Pipeline de build finalizado com sucesso!');
} catch (error) {
  console.error('❌ Erro na pipeline de build:', error);
  process.exit(1);
}
