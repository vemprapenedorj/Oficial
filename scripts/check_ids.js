import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locaisPath = path.resolve(__dirname, '../src/locais.json');
const locais = JSON.parse(fs.readFileSync(locaisPath, 'utf8'));

console.log('Categories in locais.json:');
Object.keys(locais).forEach(cat => {
  console.log(`- ${cat}: ${locais[cat].length} items`);
  locais[cat].slice(0, 3).forEach(item => {
    console.log(`  * id: ${item.id} | title: ${item.title}`);
  });
});
