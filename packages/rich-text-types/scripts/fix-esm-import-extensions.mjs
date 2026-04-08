// Rewrite relative `*.js` specifiers to `*.mjs` across built ESM files
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const esmDir = join(here, '..', 'dist', 'esm');

// Recursively walk all .mjs files under `dir`
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (extname(p) === '.mjs') yield p;
  }
}

const REWRITES = [
  // import ... from './x.js'
  [/(from\s+['"])(\.{1,2}\/[^'"]+)\.js(['"])/g, '$1$2.mjs$3'],
  // export ... from './x.js'
  [/(export\s+(?:\*|{[\s\S]*?})\s+from\s+['"])(\.{1,2}\/[^'"]+)\.js(['"])/g, '$1$2.mjs$3'],
  // import('./x.js')
  [/(import\(\s*['"])(\.{1,2}\/[^'"]+)\.js(['"]\s*\))/g, '$1$2.mjs$3'],
];

function rewrite(code) {
  return REWRITES.reduce((s, [re, replacement]) => s.replace(re, replacement), code);
}

for await (const file of walk(esmDir)) {
  const original = await readFile(file, 'utf8');
  const updated = rewrite(original);
  if (updated !== original) {
    await writeFile(file, updated, 'utf8');
  }
}
