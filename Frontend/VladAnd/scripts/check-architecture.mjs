import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(projectDir, 'src');
const allowed = new Set(['app', 'features', 'shared', 'layouts']);
const errors = [];
const children = readdirSync(root, { withFileTypes: true });
for (const item of children) {
  if (!item.isDirectory() || !allowed.has(item.name)) {
    errors.push(`Disallowed top-level src item: ${item.name}`);
  }
}

function visit(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { visit(full); continue; }
    if (!/\.tsx?$/.test(ent.name)) continue;
    const relative = path.relative(root, full).replaceAll('\\', '/');
    const source = readFileSync(full, 'utf8');
    const matches = [...source.matchAll(/\b(?:from\s*|import\s*)['"]([^'"]+)['"]/g)];
    const [layer, featureName] = relative.split('/');
    for (const [, specifier] of matches) {
      let dest = '';
      if (specifier.startsWith('@/')) dest = specifier.slice(2);
      else if (specifier.startsWith('.')) {
        dest = path.relative(root, path.resolve(path.dirname(full), specifier)).replaceAll('\\', '/');
      } else continue;
      const parts = dest.split('/');
      if (layer === 'features') {
        if (parts[0] === 'app') errors.push(`${relative}: feature imports app (${specifier})`);
        if (parts[0] === 'features' && parts[1] !== featureName) errors.push(`${relative}: cross-feature dependency (${specifier})`);
      }
      if (layer === 'shared' && (parts[0] === 'features' || parts[0] === 'app')) {
        errors.push(`${relative}: shared imports business/app (${specifier})`);
      }
      if (layer !== 'features' && parts[0] === 'features' && parts.length > 2) {
        errors.push(`${relative}: deep import into a feature (${specifier})`);
      }
    }
  }
}
visit(root);
if (errors.length) {
  console.error('Architecture rule violations:');
  for (const error of errors) console.error(` - ${error}`);
  process.exitCode = 1;
} else {
  console.log('Architecture checks passed: folder boundaries and public imports.');
}
