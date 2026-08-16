// ============================================================
// sheetkit.ts — shared client-side engine for every worksheet generator
// ------------------------------------------------------------
// All generators draw onto the same sheet and share style rendering, print,
// PDF and URL-parameter handling. Everything runs in the browser: zero server
// cost, no accounts, no limits.
//
// Feature parity target (competitor's flagship, 1,049 keywords / 48,342
// visits): trace styles, font choice, ink colour, orientation, repetitions.
// The styles are the product — they are rendered procedurally here rather
// than shipped as fonts, see FONTS below.
//
// INDEXING RULE — do not "unify" with the coloring filters:
//   Coloring facets  -> real URLs (/pages/easy-animal-…/), each indexed.
//   Generator params -> query strings (?name=Emma), canonical WITHOUT params.
// Opposite rules on purpose: facets are a finite set worth indexing, the
// name/word space is infinite and would be a thin-duplicate farm.
// ============================================================

import { strokeGlyphs, strokeWidth } from "./strokefont";

export type Orient = "portrait" | "landscape";

/**
 * Weight used for the fallback (non-stroke) fonts. Deliberately light: at 700
 * the outline styles read as thick double lines rather than letters to trace.
 */
const WEIGHT = 400;

const A4 = { w: 1000, h: 1414 };
export function page(o: Orient) {
  return o === "landscape" ? { w: A4.h, h: A4.w } : A4;
}

export const GUIDE = "#b9c2d0";

/**
 * Font stacks.
 *
 * The competitor lists D'Nealian, Zaner Bloser, KG Primary and similar —
 * those are commercial/trademarked handwriting faces and cannot simply be
 * embedded. We expose generically-named equivalents built on fonts that are
 * already on the device or open-licensed. To add a licensed face later, drop
 * it in `public/fonts/`, @font-face it in global.css and add a row here —
 * nothing else changes.
 */
export const STROKE = "__stroke__";

export const FONTS: Record<string, string> = {
  // Default for tracing: our own single-stroke skeleton alphabet. A normal
  // font can only be outlined, which gives two thin lines around a fat
  // letter; real worksheets need ONE line down the middle of the stroke.
  school: STROKE,
  print: "'Century Gothic','Poppins',Verdana,sans-serif",
  rounded: "'Poppins','Trebuchet MS',sans-serif",
  classic: "'Comic Sans MS','Chalkboard SE','Segoe Print',cursive",
  serif: "Georgia,'Times New Roman',serif",
  cursive: "'Segoe Script','Brush Script MT','Snell Roundhand',cursive",
};

export const isStroke = (f: string) => f === STROKE;

export type Style =
  | "solid"          // [2] Normal — filled model letters
  | "outline"        // hollow outline
  | "dotted"         // [3] Dotted — dashed outline
  | "start"          // [4] Starting Dot Outline — outline + start dot
  | "arrows";        // [6] Dotted Arrows — dotted + direction arrows

export interface TextOpts {
  style: Style;
  color: string;
  font: string;
  size: number;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- measuring ---------- */

let _ctx: CanvasRenderingContext2D | null = null;
function ctx(): CanvasRenderingContext2D | null {
  // No DOM when the preview renderer runs this in Node. Callers fall back to
  // estimated metrics; the browser still measures for real.
  if (typeof document === "undefined") return null;
  if (!_ctx) _ctx = document.createElement("canvas").getContext("2d");
  return _ctx;
}

/** Rough advance width per character, used only when canvas is unavailable. */
function estimateWidth(ch: string, font: string, size: number): number {
  const narrow = "iljItf.,'!:;|";
  const wide = "mwMW@";
  const base = /cursive|Script|Snell|Brush/i.test(font) ? 0.44 : 0.55;
  const k = narrow.includes(ch) ? 0.34 : wide.includes(ch) ? 0.86 : ch === " " ? 0.3 : base;
  return size * k;
}

/** Per-character positions, needed for start dots and direction arrows. */
export function layout(text: string, font: string, size: number) {
  if (isStroke(font)) {
    const k = size / 1000;
    const out = strokeGlyphs(text).map((g) => ({ ch: g.ch, x: g.x * k, w: g.w * k }));
    return { chars: out, width: strokeWidth(text) * k };
  }
  const c = ctx();
  if (c) c.font = `${WEIGHT} ${size}px ${font}`;
  const out: { ch: string; x: number; w: number }[] = [];
  let x = 0;
  for (const ch of text) {
    const w = c ? c.measureText(ch).width : estimateWidth(ch, font, size);
    out.push({ ch, x, w });
    x += w;
  }
  return { chars: out, width: x };
}

/** Largest size at which `text` fits `maxW`. */
export function fitSize(text: string, font: string, maxW: number, start: number, min = 24) {
  let s = start;
  while (s > min && layout(text, font, s).width > maxW) s -= 2;
  return s;
}

/* ---------- drawing ---------- */

export function header(title: string, sub: string, w: number, h: number) {
  return `
    <text x="60" y="74" font-family="Poppins,Verdana,sans-serif" font-weight="700"
          font-size="36" fill="#111">${esc(title)}</text>
    ${sub ? `<text x="60" y="106" font-family="Verdana,sans-serif" font-size="20" fill="#7b8794">${esc(sub)}</text>` : ""}
    <line x1="60" y1="126" x2="${w - 60}" y2="126" stroke="#dfe4ea" stroke-width="2"/>
    <text x="${w - 60}" y="${h - 32}" text-anchor="end" font-family="Verdana,sans-serif"
          font-size="16" fill="#9aa4b2">coloringbookai.net</text>`;
}

/** Handwriting rule: top line, dashed midline, solid baseline. */
export function rules(y: number, h: number, w: number) {
  const mid = y + h * 0.55;
  return `
    <line x1="60" y1="${y}" x2="${w - 60}" y2="${y}" stroke="${GUIDE}" stroke-width="2"/>
    <line x1="60" y1="${mid}" x2="${w - 60}" y2="${mid}" stroke="${GUIDE}" stroke-width="2" stroke-dasharray="10 12"/>
    <line x1="60" y1="${y + h}" x2="${w - 60}" y2="${y + h}" stroke="${GUIDE}" stroke-width="3"/>`;
}

/** Faint diagonal slant guides, for cursive. */
export function slant(y: number, h: number, w: number, step = 90) {
  let out = "";
  const dx = h * 0.35;
  for (let x = 60; x < w - 60; x += step) {
    out += `<line x1="${x}" y1="${y + h}" x2="${x + dx}" y2="${y}" stroke="${GUIDE}" stroke-width="1.2" opacity="0.7"/>`;
  }
  return out;
}

/** Line weight of the traceable letterform — thin, like a pencil guide. */
function lineWeight(size: number, style: Style) {
  return style === "solid" ? Math.max(2.2, size * 0.03) : Math.max(1.6, size * 0.022);
}

function dashFor(size: number, style: Style) {
  if (style === "dotted" || style === "arrows") {
    // Round caps + a gap slightly longer than the dash reads as dots.
    return ` stroke-dasharray="${(size * 0.035).toFixed(1)} ${(size * 0.055).toFixed(1)}" stroke-linecap="round"`;
  }
  return ` stroke-linecap="round" stroke-linejoin="round"`;
}

function markers(
  pts: { x: number; y: number }[],
  o: TextOpts,
): string {
  let out = "";
  for (const p of pts) {
    if (o.style === "start") {
      out += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${Math.max(2.6, o.size * 0.05).toFixed(1)}" fill="${o.color}"/>`;
    } else {
      const a = Math.max(5, o.size * 0.075);
      out += `<path d="M${p.x.toFixed(1)},${(p.y - a).toFixed(1)} L${p.x.toFixed(1)},${(p.y + a * 0.55).toFixed(1)}
        M${(p.x - a * 0.4).toFixed(1)},${(p.y + a * 0.02).toFixed(1)} L${p.x.toFixed(1)},${(p.y + a * 0.55).toFixed(1)}
        L${(p.x + a * 0.4).toFixed(1)},${(p.y + a * 0.02).toFixed(1)}"
        fill="none" stroke="${o.color}" stroke-width="${Math.max(1.3, o.size * 0.016).toFixed(1)}"
        stroke-linecap="round" stroke-linejoin="round"/>`;
    }
  }
  return out;
}

/**
 * Draws traceable text at (x, baseline).
 *
 * With the stroke font this emits real skeleton paths — one line per stroke —
 * which is what makes the dotted styles look like a worksheet rather than an
 * outlined logo. Start dots and arrows are placed on each glyph's actual
 * pen-down point, so they teach where to begin the letter.
 */
export function traceText(text: string, x: number, baseline: number, o: TextOpts) {
  const sw = lineWeight(o.size, o.style);

  if (isStroke(o.font)) {
    // Everything inside the <g> is in em units (1000/em), so widths and dash
    // lengths are divided by the scale to keep their on-page size.
    const k = o.size / 1000;
    const glyphs = strokeGlyphs(text);
    const d = glyphs.map((g) => g.d).filter(Boolean).join(" ");
    // "solid" here means the model letter: same skeleton, drawn heavier.
    const emW = ((o.style === "solid" ? sw * 2 : sw) / k).toFixed(0);
    const dash =
      o.style === "dotted" || o.style === "arrows"
        ? ` stroke-dasharray="${(o.size * 0.035 / k).toFixed(0)} ${(o.size * 0.055 / k).toFixed(0)}"`
        : "";
    const body = `<g transform="translate(${x},${baseline}) scale(${k})">
      <path d="${d}" fill="none" stroke="${o.color}" stroke-width="${emW}"${dash}
        stroke-linecap="round" stroke-linejoin="round"/></g>`;

    if (o.style !== "start" && o.style !== "arrows") return body;
    const pts = glyphs
      .filter((g) => g.start)
      .map((g) => ({ x: x + g.start!.x * k, y: baseline + g.start!.y * k }));
    return body + markers(pts, o);
  }

  // Fallback: real font, outlined. Lighter weight so it stays traceable.
  const attrs = o.style === "solid"
    ? `fill="${o.color}"`
    : `fill="none" stroke="${o.color}" stroke-width="${sw}"${dashFor(o.size, o.style)}`;
  const body = `<text x="${x}" y="${baseline}" font-family="${o.font}" font-weight="${WEIGHT}"
      font-size="${o.size}" ${attrs}>${esc(text)}</text>`;
  if (o.style !== "start" && o.style !== "arrows") return body;

  const { chars } = layout(text, o.font, o.size);
  const pts = chars
    .filter((c) => c.ch !== " ")
    .map((c) => ({ x: x + c.x + c.w * 0.22, y: baseline - o.size * 0.62 }));
  return body + markers(pts, o);
}

export function sheetSvg(inner: string, o: Orient) {
  const p = page(o);
  return `<svg id="sheet-svg" viewBox="0 0 ${p.w} ${p.h}" xmlns="http://www.w3.org/2000/svg"
    role="img" aria-label="Worksheet preview">
    <rect width="${p.w}" height="${p.h}" fill="#ffffff"/>${inner}</svg>`;
}

/* ---------- output ---------- */

const ser = (el: SVGSVGElement) => new XMLSerializer().serializeToString(el);

export function printSheet(el: SVGSVGElement, title: string, o: Orient) {
  const w = window.open("", "_blank");
  if (!w) { alert("Please allow pop-ups to print."); return; }
  w.document.write(
    `<html><head><title>${title}</title><style>@page{size:A4 ${o};margin:0}
     html,body{margin:0;padding:0}svg{width:100%;height:auto;display:block}</style></head>
     <body onload="window.print()">${ser(el)}</body></html>`,
  );
  w.document.close();
}

export async function downloadSheet(el: SVGSVGElement, file: string, o: Orient) {
  const p = page(o);
  const png = await rasterize(el, p.w, p.h, 2);
  // Loaded from CDN at runtime so jsPDF never enters the main bundle.
  // @ts-ignore - remote ESM URL has no local type declarations
  const { jsPDF } = await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm");
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: o });
  const [pw, ph] = o === "landscape" ? [297, 210] : [210, 297];
  doc.addImage(png, "PNG", 0, 0, pw, ph);
  doc.save(`${file}.pdf`);
}

function rasterize(el: SVGSVGElement, w: number, h: number, scale = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([ser(el)], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = w * scale; c.height = h * scale;
      const g = c.getContext("2d")!;
      g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/png"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("render failed")); };
    img.src = url;
  });
}

/* ---------- wiring ---------- */

export interface ToolConfig {
  /** Returns the inner SVG markup for the current params. */
  draw: (p: Record<string, string>) => string;
  params: { name: string; def: string }[];
  file: string;
  /** Optional hook after each render, for UI hints about the input. */
  onRender?: (p: Record<string, string>) => void;
}

export function mountTool(cfg: ToolConfig) {
  const stage = document.getElementById("sheet-stage");
  if (!stage) return;

  const field = (n: string) =>
    document.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-p="${n}"]`);

  // Restore state from the URL so a shared link reopens the same sheet.
  const q = new URLSearchParams(location.search);
  for (const p of cfg.params) {
    const v = q.get(p.name);
    const f = field(p.name);
    if (f && v !== null) f.value = v;
  }

  const read = () => {
    const out: Record<string, string> = {};
    for (const p of cfg.params) out[p.name] = (field(p.name)?.value ?? q.get(p.name) ?? p.def).toString();
    return out;
  };

  const orient = (p: Record<string, string>): Orient =>
    p.orient === "landscape" ? "landscape" : "portrait";

  const render = () => {
    const p = read();
    stage.innerHTML = sheetSvg(cfg.draw(p), orient(p));
    const next = new URLSearchParams();
    for (const c of cfg.params) if (p[c.name] !== c.def) next.set(c.name, p[c.name]);
    const qs = next.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
    cfg.onRender?.(p);
  };

  document.querySelectorAll("[data-p]").forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  const svg = () => stage.querySelector("svg") as SVGSVGElement | null;
  document.getElementById("sheet-print")?.addEventListener("click", () => {
    const s = svg(); if (s) printSheet(s, cfg.file, orient(read()));
  });
  document.getElementById("sheet-pdf")?.addEventListener("click", async () => {
    const s = svg(); if (!s) return;
    const b = document.getElementById("sheet-pdf") as HTMLButtonElement;
    const label = b.textContent;
    b.textContent = "Preparing PDF…"; b.disabled = true;
    try { await downloadSheet(s, cfg.file, orient(read())); }
    finally { b.textContent = label; b.disabled = false; }
  });

  // Fonts change metrics; re-render once they're ready so autofit is correct.
  if ((document as any).fonts?.ready) (document as any).fonts.ready.then(render);
  render();
}
