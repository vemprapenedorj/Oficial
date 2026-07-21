import fs from 'fs';
import path from 'path';

const file = 'src/seo/index.ts';
if (fs.existsSync(file)) {
  console.log('src/seo/index.ts:');
  console.log(fs.readFileSync(file, 'utf8'));
} else {
  // Let's find files under src/seo
  console.log('src/seo/ contents:');
  const list = fs.readdirSync('src/seo');
  console.log(list);
}
