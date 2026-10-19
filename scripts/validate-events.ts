import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateEvents } from '../src/events/validation';
import { getEventImages } from '../src/events/eventImages';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const events = validateEvents(JSON.parse(fs.readFileSync(path.join(root, 'src/data/events.json'), 'utf8')));
for (const event of events) {
  for (const image of getEventImages(event)) {
    if (!fs.existsSync(path.join(root, 'public', image.src))) throw new Error(`Imagem ausente: ${event.id} — ${image.src}`);
  }
}
console.log(`Cadastro de eventos válido: ${events.length} registros.`);
