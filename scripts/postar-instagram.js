import fs from 'node:fs';
import path from 'node:path';

const META_PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const META_IG_USER_ID = process.env.META_IG_USER_ID;
const SITE_URL = (process.env.SITE_URL || 'https://vemprapenedo.com.br').replace(/\/+$/, '');

if (!META_PAGE_ACCESS_TOKEN || !META_IG_USER_ID) {
  console.error('❌ Erro: META_PAGE_ACCESS_TOKEN ou META_IG_USER_ID não definidos no .env');
  process.exit(1);
}

const targetDir = process.argv[2];
if (!targetDir) {
  console.error('Uso: node --env-file=.env scripts/postar-instagram.js <pasta-do-conteudo>');
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
const caption = fs.readFileSync(legendaPath, 'utf8').trim();

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

console.log(`📸 Encontrados ${slides.length} slides para o carrossel (${slug}).`);

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
      console.log(`🚀 Criando container de imagem única: ${imageUrl}...`);

      const container = await callGraphAPI(`${META_IG_USER_ID}/media`, 'POST', {
        image_url: imageUrl,
        caption: caption,
        access_token: META_PAGE_ACCESS_TOKEN
      });

      console.log(`📦 Container criado: ${container.id}. Aguardando processamento...`);
      await sleep(3000);

      const published = await callGraphAPI(`${META_IG_USER_ID}/media_publish`, 'POST', {
        creation_id: container.id,
        access_token: META_PAGE_ACCESS_TOKEN
      });

      console.log(`✅ Post publicado com sucesso! ID: ${published.id}`);
      return;
    }

    // Carrossel (2 ou mais slides)
    console.log(`🚀 Criando containers individuais para os ${slides.length} slides...`);
    const itemIds = [];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const imageUrl = `${SITE_URL}/img/posts/${slug}/${slide}`;
      console.log(`  [${i + 1}/${slides.length}] Registrando item: ${imageUrl}...`);

      const itemRes = await callGraphAPI(`${META_IG_USER_ID}/media`, 'POST', {
        image_url: imageUrl,
        is_carousel_item: true,
        access_token: META_PAGE_ACCESS_TOKEN
      });

      itemIds.push(itemRes.id);
      await sleep(1000);
    }

    console.log(`📦 Criando container principal do carrossel...`);
    const carouselRes = await callGraphAPI(`${META_IG_USER_ID}/media`, 'POST', {
      media_type: 'CAROUSEL',
      children: itemIds,
      caption: caption,
      access_token: META_PAGE_ACCESS_TOKEN
    });

    console.log(`⏳ Container do carrossel criado (${carouselRes.id}). Aguardando processamento da Meta...`);
    
    // Polling de status
    let ready = false;
    for (let attempts = 0; attempts < 10; attempts++) {
      await sleep(3000);
      const statusRes = await callGraphAPI(`${carouselRes.id}?fields=status_code&access_token=${META_PAGE_ACCESS_TOKEN}`, 'GET');
      if (statusRes.status_code === 'FINISHED') {
        ready = true;
        break;
      }
      if (statusRes.status_code === 'ERROR') {
        throw new Error('Meta retornou erro ao processar o container do carrossel.');
      }
      console.log(`   Status: ${statusRes.status_code}... aguardando.`);
    }

    if (!ready) {
      console.log('⚠️ Timeout no status_code, tentando publicar mesmo assim...');
    }

    console.log(`🚀 Publicando carrossel no feed do Instagram...`);
    const published = await callGraphAPI(`${META_IG_USER_ID}/media_publish`, 'POST', {
      creation_id: carouselRes.id,
      access_token: META_PAGE_ACCESS_TOKEN
    });

    console.log(`🎉 Carrossel publicado com sucesso no Instagram!`);
    console.log(`🆔 ID do Post: ${published.id}`);

    try {
      const permalinkRes = await callGraphAPI(`${published.id}?fields=permalink&access_token=${META_PAGE_ACCESS_TOKEN}`, 'GET');
      console.log(`🔗 Link permanente: ${permalinkRes.permalink}`);
    } catch {
      // Ignorar erro se permalink não carregar de imediato
    }

  } catch (err) {
    console.error(`❌ Falha na publicação no Instagram:`, err.message);
    process.exit(1);
  }
}

main();
