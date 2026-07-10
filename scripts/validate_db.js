import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locaisPath = path.resolve(__dirname, '../src/locais.json');
const detailsPath = path.resolve(__dirname, '../src/data/detailsData.ts');
const publicDir = path.resolve(__dirname, '../public');

let hasErrors = false;

function reportError(file, id, field, message) {
  console.error(`[ERRO] Arquivo: ${file} | ID: ${id} | Campo: ${field} | Mensagem: ${message}`);
  hasErrors = true;
}

console.log('=== INICIANDO VALIDAÇÃO DAS BASES DE DADOS ===\n');

// 10. Validar JSON (locais.json)
let locais;
try {
  const content = fs.readFileSync(locaisPath, 'utf8');
  locais = JSON.parse(content);
  console.log('✔ locais.json é um JSON válido.');
} catch (err) {
  reportError('locais.json', 'N/A', 'N/A', `JSON inválido: ${err.message}`);
  process.exit(1);
}

// Parse detailsData.ts using bracket counting to handle nested arrays correctly
const detailsContent = fs.readFileSync(detailsPath, 'utf8');
const detailsItems = [];

const categories = ['o-que-fazer', 'onde-ficar', 'gastronomia', 'compras'];
categories.forEach(cat => {
  const catKey = `'${cat}':`;
  const keyIndex = detailsContent.indexOf(catKey);
  if (keyIndex === -1) return;
  
  // Find the opening bracket '[' of the array
  const startBracketIndex = detailsContent.indexOf('[', keyIndex);
  if (startBracketIndex === -1) return;
  
  // Count brackets to find the end of the array
  let bracketCount = 1;
  let index = startBracketIndex + 1;
  while (bracketCount > 0 && index < detailsContent.length) {
    const char = detailsContent[index];
    if (char === '[') {
      bracketCount++;
    } else if (char === ']') {
      bracketCount--;
    }
    index++;
  }
  
  const arrayContent = detailsContent.substring(startBracketIndex + 1, index - 1);
  
  // Find all object blocks: { ... }
  // We can find them using braces counting to be equally robust
  let i = 0;
  while (i < arrayContent.length) {
    const startBrace = arrayContent.indexOf('{', i);
    if (startBrace === -1) break;
    
    let braceCount = 1;
    let j = startBrace + 1;
    while (braceCount > 0 && j < arrayContent.length) {
      const char = arrayContent[j];
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
      }
      j++;
    }
    
    const objText = arrayContent.substring(startBrace + 1, j - 1);
    i = j;
    
    // Parse key-value pairs of the object
    const item = { _category: cat };
    const lines = objText.split('\n');
    lines.forEach(line => {
      const pairRegex = /^\s*([a-zA-Z0-9_]+)\s*:\s*(.*?),?\s*$/;
      const pairMatch = pairRegex.exec(line);
      if (pairMatch) {
        const key = pairMatch[1];
        let val = pairMatch[2].trim();
        
        // Remove quotes
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        } else if (val === 'true') {
          val = true;
        } else if (val === 'false') {
          val = false;
          // Format arrays
        } else if (val.startsWith('[') && val.endsWith(']')) {
          val = val.substring(1, val.length - 1).split(',').map(s => s.trim().replace(/['"]/g, ''));
        }
        item[key] = val;
      }
    });
    if (item.id) {
      detailsItems.push(item);
    }
  }
});
console.log(`✔ detailsData.ts analisado com sucesso (encontrados ${detailsItems.length} registros).`);

const newHotelIds = new Set([
  "pousada-doce-mel",
  "le-garden-pousada-boutique",
  "pousada-viking",
  "halloween-inn-penedo",
  "pousada-nova-conquista",
  "recanto-dos-passaros-penedo",
  "pousada-laponia",
  "vilar-hotel",
  "hotel-penedo-inn",
  "chale-na-roca-penedo",
  "pousada-chicle-penedo-mc",
  "pousada-estancia-penedo",
  "casa-de-artista-suites-penedo",
  "pousada-da-praca-penedo",
  "pousada-bela-vista-penedo",
  "pousada-chales-mon-desir",
  "chales-laco-e-no",
  "hotel-moradas-do-penedo",
  "hotel-aromas-de-penedo",
  "pousada-finlandia",
  "city-park-hotel",
  "hotel-do-papai-noel",
  "pousada-penedo-house",
  "pousada-nossa-senhora",
  "hotel-pequena-suecia"
]);

// Helper to validate a generic establishment object
function validateEstablishment(file, item) {
  const id = item.id;
  if (!id || !newHotelIds.has(id)) return; // Only validate the 25 new hotels
  
  // 11. Campos obrigatórios ausentes
  const required = ['id', 'title', 'category', 'image', 'description'];
  required.forEach(field => {
    if (!item[field]) {
      reportError(file, id, field, 'Campo obrigatório ausente.');
    }
  });

  // 5. Existência física dos arquivos de imagem
  // 6. Caminhos de imagem inválidos
  const imageFields = ['image', 'imagem_url'];
  imageFields.forEach(field => {
    const imgPathVal = item[field];
    if (imgPathVal) {
      if (!imgPathVal.startsWith('/') || imgPathVal.includes('\\')) {
        reportError(file, id, field, `Caminho de imagem inválido: "${imgPathVal}"`);
      } else {
        // Resolve absolute path in public folder
        const fullImgPath = path.join(publicDir, imgPathVal);
        if (!fs.existsSync(fullImgPath)) {
          reportError(file, id, field, `Arquivo de imagem não existe fisicamente: "${imgPathVal}"`);
        }
      }
    }
  });

  // 7. Telefones contendo caracteres diferentes de números
  // 9. Telefones em notação científica
  if (item.whatsapp !== undefined) {
    const wa = String(item.whatsapp);
    if (/[^\d]/.test(wa)) {
      reportError(file, id, 'whatsapp', `Número contém caracteres não-numéricos ou está em notação científica: "${wa}"`);
    }
  }

  // 8. Links de WhatsApp fora do padrão https://wa.me/
  if (item.link_whatsapp) {
    if (!item.link_whatsapp.startsWith('https://wa.me/')) {
      reportError(file, id, 'link_whatsapp', `Link do WhatsApp fora do padrão: "${item.link_whatsapp}"`);
    } else {
      const num = item.link_whatsapp.replace('https://wa.me/', '');
      if (/[^\d]/.test(num)) {
        reportError(file, id, 'link_whatsapp', `Link do WhatsApp contém caracteres inválidos após wa.me/: "${item.link_whatsapp}"`);
      }
    }
  }

  // 12. Registros premium sem tag ou badge “Recomendado”
  const isPremium = item.isPremium || item.is_premium;
  if (isPremium) {
    const badge = item.badge || item.tag_destaque;
    if (badge !== 'Recomendado') {
      reportError(file, id, 'badge/tag_destaque', `Registro premium sem tag/badge "Recomendado". Valor atual: "${badge}"`);
    }
  }
}

// 1. IDs duplicados em locais.json
// 2. Slugs duplicados em locais.json
const locaisIds = new Set();
const locaisSlugs = new Set();

Object.keys(locais).forEach(category => {
  locais[category].forEach(item => {
    if (item.id) {
      if (locaisIds.has(item.id)) {
        reportError('locais.json', item.id, 'id', 'ID duplicado.');
      }
      locaisIds.add(item.id);
    }
    const slug = item.slug || item.id;
    if (slug) {
      if (locaisSlugs.has(slug)) {
        reportError('locais.json', item.id, 'slug', `Slug duplicado: "${slug}"`);
      }
      locaisSlugs.add(slug);
    }
    validateEstablishment('locais.json', item);
  });
});

// 3. IDs duplicados em detailsData.ts
const detailsIds = new Set();
detailsItems.forEach(item => {
  if (item.id) {
    if (detailsIds.has(item.id)) {
      reportError('detailsData.ts', item.id, 'id', 'ID duplicado.');
    }
    detailsIds.add(item.id);
  }
  validateEstablishment('detailsData.ts', item);
});

// 4. Correspondência entre os novos IDs de locais.json e detailsData.ts
newHotelIds.forEach(id => {
  if (!locaisIds.has(id)) {
    reportError('Paridade', id, 'N/A', 'Novo ID presente na lista de inclusão mas ausente em locais.json.');
  }
  if (!detailsIds.has(id)) {
    reportError('Paridade', id, 'N/A', 'Novo ID presente na lista de inclusão mas ausente em detailsData.ts.');
  }
});

console.log('\n=== FIM DA VALIDAÇÃO ===');
if (hasErrors) {
  console.log('\n❌ Validação concluída com erros. Verifique as mensagens acima.');
  process.exit(1);
} else {
  console.log('\n✔ Todas as validações passaram com sucesso!');
  process.exit(0);
}
