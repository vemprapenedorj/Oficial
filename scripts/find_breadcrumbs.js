import fs from 'fs';
import path from 'path';

function walk(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file, filter));
    } else {
      if (filter(file)) results.push(file);
    }
  });
  return results;
}

const files = walk('src', file => file.endsWith('.ts') || file.endsWith('.tsx'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.toLowerCase().includes('breadcrumb')) {
    console.log(`Breadcrumb reference in ${f}`);
  }
});
