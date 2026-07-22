import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogPath = path.resolve(__dirname, '../src/pages/BlogPage.tsx');
const content = fs.readFileSync(blogPath, 'utf8');

const targetIdx = content.indexOf("if (activeArticle === 'melhores-hospedagens')");
if (targetIdx !== -1) {
  console.log('=== ROUTING SECTION 2 ===');
  console.log(content.substring(targetIdx, targetIdx + 1000));
} else {
  console.log('Routing section 2 not found');
}
