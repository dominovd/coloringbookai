#!/usr/bin/env node
/**
 * Builds the vertical 2:3 composite for every published coloring set.
 *
 * Why 2:3 / 1000x1500 (see LINKS-AND-AUTHORITY.md §4, PIPELINE-SVG.md §3):
 * one asset serves two channels — Google's image pack (present in ~98% of this
 * niche's SERPs) and Pinterest. The composite, not the individual sheet, is
 * what gets picked up, so it carries a readable title burned into the image.
 *
 * Output: public/images/<slug>/composite.png  (+ .webp)
 * Used as og:image / twitter:image and as the Pinterest "Save" target.
 *
 * Usage:
 *   node scripts/make-composites.mjs           # all sets, skip up-to-date
 *   node scripts/make-composites.mjs --force   # rebuild everything
 *   node scripts/make-composites.mjs unicorn-coloring-pages
 */
import { readdirSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { WATERMARK } from "../site.config.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = join(ROOT, "public", "images");

const W = 1000, H = 1500;          // Pinterest standard 2:3
const PAD = 28;                    // outer padding
const GAP = 20;                    // gap between tiles
const TITLE_H = 150;               // title band height
const FOOTER_H = 62;               // domain strip
const BG = "#ffffff";

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

// Slugs that aren't coloring sets.
const SKIP = new Set(["hero", "hub", "adult", "misc", "seasonal", "build", "new", "popular", "cat"]);

function titleFromSlug(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace(/\bFor\b/g, "for")
    .replace(/\bAnd\b/g, "and");
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Wrap a title onto at most 2 lines, shrinking to fit. */
function titleSvg(title) {
  const max = 22;
  let l1 = title, l2 = "";
  if (title.length > max) {
    const words = title.split(" ");
    l1 = "";
    for (const w of words) {
      if ((l1 + " " + w).trim().length <= max) l1 = (l1 + " " + w).trim();
      else l2 += (l2 ? " " : "") + w;
    }
  }
  const size = l2 ? 62 : 72;
  const y1 = l2 ? 66 : 92;
  return Buffer.from(`
    <svg width="${W}" height="${TITLE_H}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .t { font-family: Poppins, Verdana, sans-serif; font-weight: 700; fill: #2b2b3a; }
        .s { font-family: Verdana, sans-serif; font-weight: 600; fill: #f5683c; letter-spacing: 2px; }
      </style>
      <text x="${W / 2}" y="34" text-anchor="middle" class="s" font-size="22">FREE PRINTABLE PDF</text>
      <text x="${W / 2}" y="${y1 + 20}" text-anchor="middle" class="t" font-size="${size}">${esc(l1)}</text>
      ${l2 ? `<text x="${W / 2}" y="${y1 + 20 + size + 6}" text-anchor="middle" class="t" font-size="${size}">${esc(l2)}</text>` : ""}
    </svg>`);
}

function footerSvg(count) {
  return Buffer.from(`
    <svg width="${W}" height="${FOOTER_H}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .d { font-family: Poppins, Verdana, sans-serif; font-weight: 700; fill: #17b3a6; }
        .n { font-family: Verdana, sans-serif; fill: #8a8a99; }
      </style>
      <text x="${W / 2}" y="30" text-anchor="middle" class="d" font-size="30">${WATERMARK}</text>
      <text x="${W / 2}" y="54" text-anchor="middle" class="n" font-size="19">${count} pages · A4 &amp; US Letter · no sign-up</text>
    </svg>`);
}

function sheetsFor(dir) {
  return readdirSync(dir)
    .filter((f) => /^page-\d+\.png$/.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));
}

async function buildOne(slug) {
  const dir = join(IMAGES, slug);
  const files = sheetsFor(dir);
  if (files.length < 2) return { slug, skipped: "needs at least 2 sheets" };

  const out = join(dir, "composite.png");
  if (!force && existsSync(out)) {
    const newest = Math.max(...files.map((f) => statSync(join(dir, f)).mtimeMs));
    if (statSync(out).mtimeMs > newest) return { slug, skipped: "up to date" };
  }

  // 2 columns; use 3 rows when we have 6+ sheets, else 2.
  const cols = 2;
  const rows = files.length >= 6 ? 3 : 2;
  const use = files.slice(0, cols * rows);

  const gridTop = TITLE_H;
  const gridH = H - TITLE_H - FOOTER_H;
  const tileW = Math.floor((W - PAD * 2 - GAP * (cols - 1)) / cols);
  const tileH = Math.floor((gridH - PAD - GAP * (rows - 1)) / rows);

  const tiles = [];
  for (let i = 0; i < use.length; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const buf = await sharp(join(dir, use[i]))
      .resize(tileW, tileH, { fit: "contain", background: BG })
      .flatten({ background: BG })
      .toBuffer();
    tiles.push({
      input: buf,
      left: PAD + c * (tileW + GAP),
      top: gridTop + r * (tileH + GAP),
    });
  }

  await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite([
      ...tiles,
      { input: titleSvg(titleFromSlug(slug)), top: 18, left: 0 },
      { input: footerSvg(files.length), top: H - FOOTER_H + 2, left: 0 },
    ])
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(out);

  await sharp(out).webp({ quality: 82 }).toFile(join(dir, "composite.webp"));
  return { slug, built: `${use.length} tiles (${cols}x${rows})` };
}

const slugs = (only.length ? only : readdirSync(IMAGES))
  .filter((s) => !SKIP.has(s))
  .filter((s) => {
    try { return statSync(join(IMAGES, s)).isDirectory(); } catch { return false; }
  });

let built = 0, skipped = 0;
for (const slug of slugs) {
  try {
    const r = await buildOne(slug);
    if (r.built) { built++; console.log(`  ✓ ${slug} — ${r.built}`); }
    else { skipped++; console.log(`  · ${slug} — ${r.skipped}`); }
  } catch (e) {
    console.error(`  ✗ ${slug} — ${e.message}`);
  }
}
console.log(`\nComposites: ${built} built, ${skipped} skipped.`);
