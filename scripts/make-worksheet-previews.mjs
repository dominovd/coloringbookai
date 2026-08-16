#!/usr/bin/env node
/**
 * Renders a real 2:3 preview of every worksheet generator and hub.
 *
 * Why this exists: og:image was falling back to a unicorn coloring page on all
 * twelve worksheet URLs, so sharing "name tracing worksheet maker" showed a
 * unicorn. Pinterest is the channel meant to bring the first real links, and
 * 2:3 / 1000x1500 is its native ratio — the same asset Google's image pack
 * picks up.
 *
 * The sheet itself comes from src/lib/draws.ts — the exact code the live tool
 * runs — so a preview can never drift from what a visitor actually prints.
 *
 * Output: public/images/worksheets/<slug>.png (+ .webp)
 *
 * Usage: npm run previews  [--force]
 */
import { mkdirSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "worksheets");
const TMP = join(ROOT, ".preview-tmp");

const W = 1000, H = 1500;      // Pinterest 2:3
const TITLE_H = 168, FOOT_H = 58;

const force = process.argv.includes("--force");

// draws.ts is TypeScript and imports sheetkit; bundle both to plain ESM so
// Node can import them without a loader.
mkdirSync(TMP, { recursive: true });
await build({
  entryPoints: [join(ROOT, "src", "lib", "draws.ts")],
  bundle: true, format: "esm", platform: "neutral",
  outfile: join(TMP, "draws.mjs"), logLevel: "error",
});
const { draws, previewParams } = await import(join(TMP, "draws.mjs"));
const { sheetSvg } = await import(join(TMP, "draws.mjs")).then(async () => {
  await build({
    entryPoints: [join(ROOT, "src", "lib", "sheetkit.ts")],
    bundle: true, format: "esm", platform: "neutral",
    outfile: join(TMP, "kit.mjs"), logLevel: "error",
  });
  return import(join(TMP, "kit.mjs"));
});

const { generators, worksheetHubs, generatorsInHub } = await (async () => {
  await build({
    entryPoints: [join(ROOT, "src", "lib", "worksheets.ts")],
    bundle: true, format: "esm", platform: "neutral",
    outfile: join(TMP, "ws.mjs"), logLevel: "error",
  });
  return import(join(TMP, "ws.mjs"));
})();

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function titleBand(title, sub) {
  const size = title.length > 26 ? 50 : title.length > 18 ? 58 : 66;
  return Buffer.from(`
    <svg width="${W}" height="${TITLE_H}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .k{font-family:Verdana,sans-serif;font-weight:700;fill:#f5683c;letter-spacing:2px}
        .t{font-family:Poppins,Verdana,sans-serif;font-weight:700;fill:#2b2b3a}
        .s{font-family:Verdana,sans-serif;fill:#5c5c6e}
      </style>
      <text x="${W / 2}" y="34" text-anchor="middle" class="k" font-size="21">FREE PRINTABLE PDF</text>
      <text x="${W / 2}" y="${34 + size}" text-anchor="middle" class="t" font-size="${size}">${esc(title)}</text>
      <text x="${W / 2}" y="${52 + size + 32}" text-anchor="middle" class="s" font-size="24">${esc(sub)}</text>
    </svg>`);
}

function footBand(note) {
  return Buffer.from(`
    <svg width="${W}" height="${FOOT_H}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .d{font-family:Poppins,Verdana,sans-serif;font-weight:700;fill:#17b3a6}
        .n{font-family:Verdana,sans-serif;fill:#8a8a99}
      </style>
      <text x="${W / 2}" y="28" text-anchor="middle" class="d" font-size="28">coloringbookai.net</text>
      <text x="${W / 2}" y="50" text-anchor="middle" class="n" font-size="18">${esc(note)}</text>
    </svg>`);
}

/** Renders one generator sheet to a PNG buffer at the given width. */
async function sheetPng(slug, width) {
  const svg = sheetSvg(draws[slug](previewParams[slug] ?? {}), "portrait");
  return sharp(Buffer.from(svg), { density: 200 })
    .resize({ width: Math.round(width) })
    .png()
    .toBuffer();
}

async function buildTool(gen) {
  const file = join(OUT, `${gen.slug}.png`);
  if (!force && existsSync(file)) return { slug: gen.slug, skipped: true };

  const innerW = W - 200;                       // side margins
  const sheet = await sheetPng(gen.slug, innerW);
  const meta = await sharp(sheet).metadata();
  const availH = H - TITLE_H - FOOT_H - 40;
  // Fit the A4 sheet into the band, keeping its ratio.
  const scale = Math.min(1, availH / meta.height);
  const sw = Math.round(meta.width * scale), sh = Math.round(meta.height * scale);
  const sheetFit = await sharp(sheet).resize({ width: sw, height: sh }).png().toBuffer();

  await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
    .composite([
      { input: titleBand(gen.nav + " worksheets", "Type your own · print or save as PDF"), top: 14, left: 0 },
      // subtle page shadow so the sheet reads as paper
      { input: Buffer.from(`<svg width="${sw + 16}" height="${sh + 16}" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="${sw}" height="${sh}" fill="#e9edf2"/></svg>`),
        top: TITLE_H + 18, left: Math.round((W - sw) / 2) - 4 },
      { input: sheetFit, top: TITLE_H + 14, left: Math.round((W - sw) / 2) },
      { input: footBand("Free · No sign-up · A4 and US Letter"), top: H - FOOT_H - 10, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(file);

  await sharp(file).webp({ quality: 82 }).toFile(join(OUT, `${gen.slug}.webp`));
  return { slug: gen.slug, built: true };
}

/** Hubs get a 2x2 grid of their tools' sheets. */
async function buildHub(hub) {
  const file = join(OUT, `hub-${hub.slug}.png`);
  if (!force && existsSync(file)) return { slug: hub.slug, skipped: true };

  const tools = generatorsInHub(hub.slug).slice(0, 4);
  if (!tools.length) return { slug: hub.slug, skipped: true };

  const gap = 22;
  const cols = tools.length > 1 ? 2 : 1;
  const rows = Math.ceil(tools.length / cols);
  const cellW = Math.floor((W - 160 - gap * (cols - 1)) / cols);
  const availH = H - TITLE_H - FOOT_H - 40;
  const cellH = Math.floor((availH - gap * (rows - 1)) / rows);

  const tiles = [];
  for (let i = 0; i < tools.length; i++) {
    const png = await sheetPng(tools[i].slug, cellW);
    const fitted = await sharp(png)
      .resize({ width: cellW, height: cellH, fit: "contain", background: "#ffffff" })
      .png().toBuffer();
    tiles.push({
      input: fitted,
      left: 80 + (i % cols) * (cellW + gap),
      top: TITLE_H + 16 + Math.floor(i / cols) * (cellH + gap),
    });
  }

  await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
    .composite([
      { input: titleBand(hub.h1, `${generatorsInHub(hub.slug).length} free printable makers`), top: 14, left: 0 },
      ...tiles,
      { input: footBand("Free · No sign-up · A4 and US Letter"), top: H - FOOT_H - 10, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(file);

  await sharp(file).webp({ quality: 82 }).toFile(join(OUT, `hub-${hub.slug}.webp`));
  return { slug: hub.slug, built: true };
}

mkdirSync(OUT, { recursive: true });
let built = 0, skipped = 0;
for (const g of generators) {
  const r = await buildTool(g);
  r.built ? built++ : skipped++;
  console.log(`  ${r.built ? "✓" : "·"} ${r.slug}`);
}
for (const hb of worksheetHubs) {
  const r = await buildHub(hb);
  r.built ? built++ : skipped++;
  console.log(`  ${r.built ? "✓" : "·"} hub-${r.slug}`);
}
// Section hub reuses the handwriting collage.
const idx = join(OUT, "index.png");
if (force || !existsSync(idx)) {
  const src = join(OUT, "hub-handwriting.png");
  if (existsSync(src)) {
    await sharp(src).toFile(idx);
    await sharp(idx).webp({ quality: 82 }).toFile(join(OUT, "index.webp"));
    console.log("  ✓ index");
  }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nWorksheet previews: ${built} built, ${skipped} skipped.`);
