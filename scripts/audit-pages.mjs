#!/usr/bin/env node
/**
 * Shows what is live, what the artwork gate is holding back, and how many
 * sheets each held-back page still needs. Run before each publishing wave.
 *
 *   npm run audit
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = join(ROOT, "public", "images");

// Keep in sync with MIN_ARTWORK in src/lib/taxonomy.ts
const MIN = 6;

const tax = readFileSync(join(ROOT, "src", "lib", "taxonomy.ts"), "utf8");
const block = tax.match(/PUBLISHED = new Set<string>\(\[([\s\S]*?)\]\)/)[1];
const published = [...block.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);

const count = (slug) => {
  const dir = join(IMAGES, slug);
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => /^page-\d+\.png$/.test(f)).length;
};
const hasComposite = (slug) => existsSync(join(IMAGES, slug, "composite.png"));

const rows = published.map((s) => ({ slug: s, n: count(s), comp: hasComposite(s) }));
const live = rows.filter((r) => r.n >= MIN).sort((a, b) => b.n - a.n);
const held = rows.filter((r) => r.n < MIN).sort((a, b) => b.n - a.n);

console.log(`\nArtwork gate: MIN_ARTWORK = ${MIN}\n`);
console.log(`LIVE (${live.length})`);
for (const r of live) {
  console.log(`  ${String(r.n).padStart(3)} sheets  ${r.comp ? "composite ✓" : "composite ✗"}  ${r.slug}`);
}
console.log(`\nHELD BACK (${held.length}) — in PUBLISHED but below the gate`);
for (const r of held) {
  console.log(`  ${String(r.n).padStart(3)} sheets  needs +${MIN - r.n}   ${r.slug}`);
}
const missingComp = live.filter((r) => !r.comp);
if (missingComp.length) {
  console.log(`\n⚠ ${missingComp.length} live page(s) without a composite — run: npm run composites`);
}
console.log(
  `\nTotal sheets on live pages: ${live.reduce((s, r) => s + r.n, 0)}. ` +
  `To publish all held-back pages you need ${held.reduce((s, r) => s + (MIN - r.n), 0)} more sheets.\n`,
);
