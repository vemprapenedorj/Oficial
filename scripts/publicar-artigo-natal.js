import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const articleEntry = {
  id: "natal-luz-penedo",
  title: "Natal Luz em Penedo 2026/2027: Guia Completo, Datas e Atrações",
  category: "Destaque",
  image: "/assets/imagens/eventos/natal-luz-penedo-tunel-de-luz.webp",
  description: "Tudo sobre o Natal Luz em Penedo 2026/2027: datas oficiais de 28/11 ao Carnaval, Túnel de Luz gigante, Casa do Papai Noel e dicas de viagem.",
  fullInfo: "Guia completo com tudo o que você precisa saber para curtir o Natal Luz em Penedo: programação oficial, Túnel de Luz, Pequena Finlândia, gastronomia e onde ficar.",
  tags: [
    "natal luz em penedo",
    "natal em penedo 2026",
    "tunel de luz penedo",
    "o que fazer em penedo",
    "pequena finlandia natal",
    "casa do papai noel penedo",
    "turismo penedo"
  ],
  date: "22/11/2026"
};

async function main() {
  console.log('🚀 [Publicação Oficial] Publicando Artigo do Natal Luz no portal e redes...');

  const detailsPath = path.join(rootDir, 'src', 'data', 'detailsData.ts');
  let content = fs.readFileSync(detailsPath, 'utf8');

  if (content.includes('"id": "natal-luz-penedo"')) {
    console.log('ℹ️ Artigo natal-luz-penedo já está presente em detailsData.ts.');
  } else {
    const blogMarker = '"blog": [\n';
    const insertIndex = content.indexOf(blogMarker);
    if (insertIndex === -1) {
      throw new Error('Não foi possível encontrar a chave "blog": [ em detailsData.ts');
    }

    const entryJson = '    ' + JSON.stringify(articleEntry, null, 6)
      .replace(/\n/g, '\n    ') + ',\n';

    content = content.slice(0, insertIndex + blogMarker.length) + entryJson + content.slice(insertIndex + blogMarker.length);
    fs.writeFileSync(detailsPath, content, 'utf8');
    console.log('✅ Artigo inserido em src/data/detailsData.ts.');
  }

  // Build local para validar
  console.log('📦 Executando build de validação...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  // Commit e push para o GitHub
  console.log('📡 Enviando commit para o GitHub para atualizar a Hostinger...');
  execSync('git add src/data/detailsData.ts', { cwd: rootDir, stdio: 'inherit' });
  try {
    execSync('git commit -m "feat(blog): publica artigo Natal Luz em Penedo no portal"', { cwd: rootDir, stdio: 'inherit' });
    execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Push enviado para origin main. A Hostinger fará o deploy automático!');
  } catch (err) {
    console.log('ℹ️ Sem novas alterações para commit no git.');
  }

  // Publicar no Instagram
  console.log('📸 Publicando carrossel de anúncio no Instagram...');
  try {
    execSync('node --env-file=.env scripts/postar-instagram.js marketing/conteudo/carrossel-anuncio-blog-natal-2026-11-22', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Post publicado no Instagram com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao postar no Instagram:', err.message);
  }

  // Publicar no Facebook
  console.log('📘 Publicando carrossel de anúncio no Facebook...');
  try {
    execSync('node --env-file=.env scripts/postar-facebook.js marketing/conteudo/carrossel-anuncio-blog-natal-2026-11-22', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Post publicado no Facebook com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao postar no Facebook:', err.message);
  }

  console.log('🎉 Publicação concluída com sucesso!');
}

main().catch(err => {
  console.error('❌ Falha na execução da publicação:', err);
  process.exit(1);
});
