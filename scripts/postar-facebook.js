import fs from 'node:fs';
import path from 'node:path';

const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const META_PAGE_ID = process.env.META_PAGE_ID;
const SITE_URL = (process.env.SITE_URL || 'https://vemprapenedo.com.br').replace(/\/+$/, '');

if (!META_PAGE_ACCESS_TOKEN || !META_PAGE_ID) {
  console.error('❌ Erro: META_PAGE_ACCESS_TOKEN ou META_PAGE_ID não definidos no .env');
  process.exit(1);
}

const targetDir = process.argv[2];
if (!targetDir) {
  console.error('Uso: node --env-file=.env scripts/postar-facebook.js <pasta-do-conteudo>');
  process.exit(1);
}

const fullTargetDir = path.resolve(targetDir);
const slug = path.basename(fullTargetDir);

// Ler a legenda
const legendaPath = path.join(fullTargetDir, 'legenda.md');
if (!fs.existsSync(legendaPath)) {
  console.error(`❌ Erro: arquivo legenda.md não encontrado em ${fullTargetDir}`);
  process.exit(1);
}
const message = fs.readFileSync(legendaPath, 'utf8').trim();

// Localizar slides
const instaDir = path.join(fullTargetDir, 'instagram');
if (!fs.existsSync(instaDir)) {
  console.error(`❌ Erro: pasta instagram/ não encontrada em ${fullTargetDir}`);
  process.exit(1);
}

const slides = fs.readdirSync(instaDir)
  .filter(f => /^slide-\d+\.png$/i.test(f))
  .sort();

if (slides.length === 0) {
  console.error('❌ Erro: nenhum slide (slide-XX.png) encontrado na pasta instagram/');
  process.exit(1);
}

console.log(`📘 Preparando publicação no Facebook (${slides.length} imagens) para a página ${META_PAGE_ID}...`);

async function callGraphAPI(endpoint, method = 'POST', body = null) {
  const url = `https://graph.facebook.com/v21.0/${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const json = await res.json();
  if (json.error) {
    throw new Error(`Meta Graph API: ${json.error.message} (code ${json.error.code})`);
  }
  return json;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  try {
    const isSingleImage = slides.length === 1;

    if (isSingleImage) {
      const imageUrl = `${SITE_URL}/img/posts/${slug}/${slides[0]}`;
      console.log(`🚀 Publicando foto única no Facebook: ${imageUrl}...`);

      const res = await callGraphAPI(`${META_PAGE_ID}/photos`, 'POST', {
        url: imageUrl,
        caption: message,
        access_token: META_PAGE_ACCESS_TOKEN
      });

      console.log(`✅ Post publicado com sucesso no Facebook! ID: ${res.post_id || res.id}`);
      return;
    }

    // Carrossel / Álbum multi-fotos no Facebook
    console.log(`🚀 Fazendo upload das ${slides.length} imagens na página...`);
    const mediaFbids = [];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const imageUrl = `${SITE_URL}/img/posts/${slug}/${slide}`;
      console.log(`  [${i + 1}/${slides.length}] Enviando: ${imageUrl}...`);

      const photoRes = await callGraphAPI(`${META_PAGE_ID}/photos`, 'POST', {
        url: imageUrl,
        published: false,
        access_token: META_PAGE_ACCESS_TOKEN
      });

      mediaFbids.push({ media_fbid: photoRes.id });
      await sleep(1000);
    }

    console.log(`📦 Publicando álbum com as imagens e o texto no feed da Página...`);
    const postRes = await callGraphAPI(`${META_PAGE_ID}/feed`, 'POST', {
      message: message,
      attached_media: mediaFbids,
      access_token: META_PAGE_ACCESS_TOKEN
    });

    console.log(`🎉 Álbum/Carrossel publicado com sucesso no Facebook!`);
    console.log(`🆔 ID do Post: ${postRes.id}`);
    console.log(`🔗 Link: https://www.facebook.com/${postRes.id}`);

  } catch (err) {
    console.error(`❌ Falha na publicação no Facebook:`, err.message);
    process.exit(1);
  }
}

main();
