// Decodes embedded base64 PNG payloads into public/ before Vite build.
// Source-of-truth icons live alongside this script as *.b64 text files.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MAP = {
  'public/icons/icon-192.png':          'icon-192.png.b64',
  'public/icons/icon-512.png':          'icon-512.png.b64',
  'public/icons/icon-512-maskable.png': 'icon-512-maskable.png.b64',
  'public/apple-touch-icon.png':        'apple-touch-icon.png.b64'
};

for (const [outPath, src] of Object.entries(MAP)) {
  const b64 = readFileSync(join(HERE, src), 'utf8').replace(/\s+/g, '');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, Buffer.from(b64, 'base64'));
}
console.log('[icons] decoded', Object.keys(MAP).length, 'icons → public/');
