import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const detailsPath = path.resolve(__dirname, '../src/data/detailsData.ts');
const publicDir = path.resolve(__dirname, '../public');
const allowedCategories = ['o-que-fazer', 'onde-ficar', 'gastronomia', 'compras', 'blog'];
const legacyFields = [
  'is_premium', 'imagem_url', 'link_whatsapp', 'link_instagram',
  'link_maps', 'link_video', 'link_booking', 'link_site', 'tag_destaque',
  'instagram', 'mapUrl',
];
const forbiddenPatterns = [
  [/picsum\.photos/i, 'Imagem temporária do Picsum não é permitida.'],
  [/(?:24|5524)(\d)\1{7,}/, 'Telefone com sequência fictícia não é permitido.'],
  [/instagram\.com\/penedonatureza(?:\/|["'])/i, 'Perfil social provisório não é permitido.'],
];

let hasErrors = false;
const error = (id, field, message) => {
  console.error(`[ERRO] ID: ${id} | Campo: ${field} | ${message}`);
  hasErrors = true;
};

console.log('=== VALIDANDO FONTE CANÔNICA DE CONTEÚDO ===\n');

const source = fs.readFileSync(detailsPath, 'utf8');
let data;
try {
  data = JSON.parse(source.slice(source.indexOf('=') + 1, source.lastIndexOf(';')));
} catch (cause) {
  console.error(`Falha ao interpretar detailsData.ts: ${cause.message}`);
  process.exit(1);
}

forbiddenPatterns.forEach(([pattern, message]) => {
  if (pattern.test(source)) error('N/A', 'conteudo', message);
});

const ids = new Set();
const slugs = new Set();
let count = 0;

for (const [category, items] of Object.entries(data)) {
  if (!allowedCategories.includes(category)) error(category, 'categoria', 'Categoria de aba inválida.');
  if (!Array.isArray(items)) {
    error(category, 'categoria', 'A categoria deve conter uma lista.');
    continue;
  }

  for (const item of items) {
    count += 1;
    const id = item.id || 'SEM_ID';
    ['id', 'title', 'category', 'image', 'description', 'fullInfo'].forEach(field => {
      if (!item[field]) error(id, field, 'Campo obrigatório ausente.');
    });

    if (ids.has(id)) error(id, 'id', 'ID duplicado.');
    ids.add(id);

    const slug = item.slug || id;
    if (slugs.has(slug)) error(id, 'slug', `Slug duplicado: ${slug}`);
    slugs.add(slug);

    legacyFields.forEach(field => {
      if (field in item) error(id, field, 'Campo legado não permitido na fonte canônica.');
    });

    if (item.image?.startsWith('/')) {
      const imagePath = path.join(publicDir, item.image);
      if (!fs.existsSync(imagePath)) error(id, 'image', `Arquivo não encontrado: ${item.image}`);
    }

    if (Array.isArray(item.galeria)) {
      item.galeria.forEach(image => {
        if (image.startsWith('/') && !fs.existsSync(path.join(publicDir, image))) {
          error(id, 'galeria', `Arquivo não encontrado: ${image}`);
        }
      });
    }

    if (item.whatsapp && /[^\d]/.test(String(item.whatsapp))) {
      error(id, 'whatsapp', 'Telefone deve conter apenas números.');
    }
    if (item.whatsappUrl && !/^https:\/\/wa\.me\/\d+$/.test(item.whatsappUrl)) {
      error(id, 'whatsappUrl', 'URL deve seguir https://wa.me/NUMERO.');
    }
    if (item.isPremium && item.badge !== 'Recomendado') {
      error(id, 'badge', 'Registro Premium deve usar o badge Recomendado.');
    }
  }
}

console.log(`Registros analisados: ${count}`);
console.log(`IDs únicos: ${ids.size}`);
console.log(`Slugs únicos: ${slugs.size}`);

if (hasErrors) {
  console.error('\n❌ Validação concluída com erros.');
  process.exit(1);
}

console.log('\n✔ Fonte canônica validada com sucesso!');
