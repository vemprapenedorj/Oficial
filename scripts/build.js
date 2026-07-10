import { execSync } from 'child_process';

const isNetlify = process.env.NETLIFY === 'true';

console.log(`📡 [Build Pipeline] Ambiente detectado: ${isNetlify ? 'NETLIFY (Cloud)' : 'LOCAL / HOSTINGER'}`);

try {
  // 1. Run standard Vite compilation
  console.log('📦 Executando vite build...');
  execSync('npx vite build', { stdio: 'inherit' });

  // 2. Conditionally execute static pre-rendering (SSG) with Puppeteer
  if (isNetlify) {
    console.log('⚡ Detectado ambiente Netlify. Ignorando a pré-renderização estática (SSG) para evitar dependências de Chrome/Puppeteer.');
  } else {
    console.log('🚀 Iniciando pipeline de pré-renderização estática (SSG) com Puppeteer...');
    execSync('node scripts/prerender.js', { stdio: 'inherit' });
  }
  
  console.log('🎉 Pipeline de build finalizado com sucesso!');
} catch (error) {
  console.error('❌ Erro na pipeline de build:', error);
  process.exit(1);
}
