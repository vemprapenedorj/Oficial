import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imgPath = 'C:\\Users\\Rafael\\.gemini\\antigravity\\brain\\3443dd50-3527-44d7-ae47-e699ab9de496\\media__1783649499072.png';

sharp(imgPath)
  .metadata()
  .then(meta => {
    console.log('Image dimensions:', meta.width, 'x', meta.height);
  })
  .catch(err => {
    console.error('Error:', err);
  });
