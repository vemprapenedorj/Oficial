import { execSync } from 'child_process';

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

  // 4. A pré-renderização é obrigatória: as regras do servidor só publicam
  // rotas válidas quando existe dist/rota/index.html. Nunca publique o fallback
  // SPA, pois ele remove canonicals do HTML inicial e transforma 404 em soft 404.
  console.log('🚀 Iniciando pré-renderização estática (SSG) com Puppeteer...');
  execSync('node scripts/prerender.js', { stdio: 'inherit' });
  
  console.log('🎉 Pipeline de build finalizado com sucesso!');
} catch (error) {
  console.error('❌ Erro na pipeline de build:', error);
  process.exit(1);
}
