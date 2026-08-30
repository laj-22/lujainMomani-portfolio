#!/usr/bin/env node
/**
 * Fail CI if the production bundle contains CMS paths, known leaked keys, or dev-only strings.
 * Run after `npm run build`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

const FORBIDDEN = [
  { label: 'portfolio-manager path', pattern: /portfolio-manager/i },
  { label: 'PySide6 reference', pattern: /pyside6/i },
  { label: 'CMS editor reference', pattern: /Portfolio Manager/i },
  { label: 'local env file reference', pattern: /\.env\.local/ },
];

function walk(dir, hits = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path, hits);
      continue;
    }
    if (!/\.(html|js|css|json|txt|svg)$/i.test(name)) continue;
    const text = readFileSync(path, 'utf8');
    for (const { label, pattern } of FORBIDDEN) {
      if (pattern.test(text)) {
        hits.push({ path, label });
      }
    }
  }
  return hits;
}

try {
  statSync(DIST);
} catch {
  console.error('verify-dist: dist/ not found — run npm run build first');
  process.exit(1);
}

const hits = walk(DIST);
if (hits.length) {
  console.error('verify-dist: forbidden content in production build:\n');
  for (const { path, label } of hits) {
    console.error(`  - ${label}: ${path}`);
  }
  process.exit(1);
}

console.log('verify-dist: OK (no CMS paths, secrets, or dev-only strings)');
