import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateEvents } from '../src/events/validation';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const events = validateEvents(JSON.parse(fs.readFileSync(path.join(root, 'src/data/events.json'), 'utf8')));
for (const event of events) {
  if (event.image && !fs.existsSync(path.join(root, 'public', event.image))) throw new Error(`Imagem ausente: ${event.id} — ${event.image}`);
}
console.log(`Cadastro de eventos válido: ${events.length} registros.`);
