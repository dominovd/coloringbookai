// ============================================================
// draws.ts — every generator's sheet rendering, in one place
// ------------------------------------------------------------
// These used to live inside each .astro page, which meant nothing else could
// render a sheet — including the script that produces the social/preview
// images. Both the live tool and scripts/make-worksheet-previews.mjs now call
// the same function, so a preview can never drift from what the tool prints.
// ============================================================
import {
  header, rules, slant, traceText, fitSize, layout, FONTS, page, GUIDE,
  type Orient, type Style,
} from "./sheetkit";

export type Params = Record<string, string>;

/* ---------- shared input handling ---------- */

/**
 * Normalises a typed name.
 * - trims first, so "   " counts as empty (it used to render a blank sheet)
 * - optionally capitalises each word: a parent typing "ann" expects "Ann"
 * - caps length generously; the layout shrinks or wraps rather than truncating
 */
export function cleanName(raw: string, fallback: string, caps = true): string {
  let s = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!s) s = fallback;
  if (caps) s = s.replace(/(^|[\s'-])([a-z])/g, (_m, p, c) => p + c.toUpperCase());
  return s.slice(0, 40);
}

const orientOf = (p: Params): Orient => (p.orient === "landscape" ? "landscape" : "portrait");
const styleOf = (p: Params): Style => (p.style as Style) || "dotted";
const fontOf = (p: Params) => FONTS[p.font] ?? FONTS.school;
const colorOf = (p: Params) => p.color || "#111111";
const rowsOf = (p: Params, def: number) =>
  Math.max(3, Math.min(8, parseInt(p.rows, 10) || def));

/**
 * Sizes the text to fit, falling back to two lines rather than truncating.
 *
 * A long name *can* be squeezed onto one line, but past a point the letters
 * get too small to trace with a pencil — which defeats the sheet. So if the
 * fitted size drops below `comfort` of the ideal, we wrap on a space instead.
 * Nothing is ever silently cut off.
 */
function fitOrWrap(text: string, font: string, maxW: number, start: number, min = 26) {
  const size = fitSize(text, font, maxW, start, min);
  const comfort = start * 0.62;
  const fitsOneLine = layout(text, font, size).width <= maxW;
  if (fitsOneLine && (size >= comfort || !text.includes(" "))) {
    return { lines: [text], size };
  }

  // Split on the space nearest the middle; fall back to a hard midpoint.
  const mid = Math.floor(text.length / 2);
  let cut = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " " && (cut === -1 || Math.abs(i - mid) < Math.abs(cut - mid))) cut = i;
  }
  const parts = cut > 0
    ? [text.slice(0, cut), text.slice(cut + 1)]
    : [text.slice(0, mid), text.slice(mid)];
  const s2 = Math.min(
    ...parts.map((t) => fitSize(t, font, maxW, start * 0.62, min * 0.8)),
  );
  return { lines: parts, size: s2 };
}

/* ---------- generators ---------- */

export const draws: Record<string, (p: Params) => string> = {
  "name-tracing-worksheet"(p) {
    const o = orientOf(p);
    const { w, h } = page(o);
    const font = fontOf(p), color = colorOf(p), style = styleOf(p);
    const guides = p.guides !== "no";
    const rows = rowsOf(p, 5);
    const name = cleanName(p.name, "Name", p.caps !== "no");

    let out = header(name, "Trace the name, then write it on your own", w, h);
    const top = 168, bottom = h - 90;
    const band = (bottom - top) / rows;
    const rowH = band * 0.62;
    const { lines, size } = fitOrWrap(name, font, w - 150, rowH * 1.05);

    for (let i = 0; i < rows; i++) {
      const y = top + i * band;
      if (guides) out += rules(y, rowH, w);
      if (i === rows - 1) continue; // free row to write unaided
      const st: Style = i === 0 && style !== "solid" ? "solid" : style;
      if (lines.length === 1) {
        out += traceText(lines[0], 76, y + rowH, { style: st, color, font, size });
      } else {
        // Two short lines share the row so nothing is ever cut off.
        out += traceText(lines[0], 76, y + rowH * 0.52, { style: st, color, font, size });
        out += traceText(lines[1], 76, y + rowH, { style: st, color, font, size });
      }
    }
    return out;
  },

  "letter-tracing-worksheet"(p) {
    const o = orientOf(p);
    const { w, h } = page(o);
    const font = fontOf(p), color = colorOf(p), style = styleOf(p);
    const guides = p.guides !== "no";
    const pair = (l: string) =>
      p.case === "upper" ? l.toUpperCase() : p.case === "lower" ? l : `${l.toUpperCase()}${l}`;

    const top = 168, bottom = h - 90;

    if (p.letter === "all") {
      let out = header("Alphabet tracing", "Trace each letter, then write your own", w, h);
      const cols = 2, per = 13;
      const colW = (w - 120) / cols;
      const band = (bottom - top) / per;
      const rowH = band * 0.6;
      "abcdefghijklmnopqrstuvwxyz".split("").forEach((l, i) => {
        const c = Math.floor(i / per), r = i % per;
        const x = 60 + c * colW, y = top + r * band;
        const text = `${pair(l)} ${pair(l)} ${pair(l)}`;
        const size = fitSize(text, font, colW - 40, rowH * 1.0, 18);
        if (guides) {
          const mid = y + rowH * 0.55;
          out += `<line x1="${x}" y1="${y}" x2="${x + colW - 30}" y2="${y}" stroke="${GUIDE}" stroke-width="1.5"/>
                  <line x1="${x}" y1="${mid}" x2="${x + colW - 30}" y2="${mid}" stroke="${GUIDE}" stroke-width="1.5" stroke-dasharray="8 10"/>
                  <line x1="${x}" y1="${y + rowH}" x2="${x + colW - 30}" y2="${y + rowH}" stroke="${GUIDE}" stroke-width="2.5"/>`;
        }
        out += traceText(text, x + 6, y + rowH, { style, color, font, size });
      });
      return out;
    }

    const l = /^[a-z]$/.test(p.letter) ? p.letter : "a";
    let out = header(`Letter ${l.toUpperCase()} ${l}`, "Trace the letters, then write your own", w, h);
    const rows = 6;
    const band = (bottom - top) / rows;
    const rowH = band * 0.62;
    const line = `${pair(l)} ${pair(l)} ${pair(l)} ${pair(l)}`;
    const size = fitSize(line, font, w - 150, rowH * 1.05);
    for (let i = 0; i < rows; i++) {
      const y = top + i * band;
      if (guides) out += rules(y, rowH, w);
      if (i === rows - 1) continue;
      out += traceText(line, 76, y + rowH, {
        style: i === 0 && style !== "solid" ? "solid" : style, color, font, size,
      });
    }
    return out;
  },

  "cursive-practice-sheets"(p) {
    const o = orientOf(p);
    const { w, h } = page(o);
    const font = FONTS.cursive, color = colorOf(p), style = styleOf(p);
    const guides = p.guides !== "no";
    const rows = rowsOf(p, 5);
    const raw = (p.text ?? "").trim() || "alphabet";
    const isAlpha = /^alphabet$/i.test(raw);

    const lines: string[] = [];
    if (isAlpha) {
      const az = "abcdefghijklmnopqrstuvwxyz";
      const per = Math.ceil(az.length / rows);
      for (let i = 0; i < rows; i++) {
        const chunk = az.slice(i * per, (i + 1) * per);
        lines.push(chunk ? chunk.split("").join(" ") : "");
      }
    } else {
      for (let i = 0; i < rows; i++) lines.push(raw);
    }

    let out = header(isAlpha ? "Cursive alphabet practice" : "Cursive practice",
      "Trace the letters, keeping the slant even", w, h);
    const top = 172, bottom = h - 90;
    const band = (bottom - top) / rows;
    const rowH = band * 0.6;
    const widest = lines.reduce((a, b) => (a.length > b.length ? a : b), "");
    const size = fitSize(widest || "abc", font, w - 150, rowH * 1.1);

    for (let i = 0; i < rows; i++) {
      const y = top + i * band;
      if (guides) out += rules(y, rowH, w);
      if (p.slant !== "no") out += slant(y, rowH, w);
      if (!lines[i]) continue;
      out += traceText(lines[i], 76, y + rowH, {
        style: i === 0 && style !== "solid" ? "solid" : style, color, font, size,
      });
    }
    return out;
  },

  "number-tracing-worksheet"(p) {
    const o = orientOf(p);
    const { w, h } = page(o);
    const font = fontOf(p), color = colorOf(p), style = styleOf(p);
    const guides = p.guides !== "no";
    const max = parseInt(p.range, 10) || 10;
    const WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten",
      "eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
    const withWords = p.words === "yes" && max <= 20;

    let out = header(`Numbers 1 to ${max}`, "Trace each number, then write it yourself", w, h);
    const top = 168, bottom = h - 90;

    if (max <= 20) {
      const band = (bottom - top) / max;
      const rowH = band * 0.62;
      for (let n = 1; n <= max; n++) {
        const y = top + (n - 1) * band;
        if (guides) out += rules(y, rowH, w);
        const digits = `${n} ${n} ${n} ${n}`;
        const size = fitSize(digits, font, w * 0.42, rowH * 1.0);
        out += traceText(digits, 76, y + rowH, { style, color, font, size });
        if (withWords) {
          const word = WORDS[n] ?? "";
          const ws = fitSize(word, font, w * 0.32, rowH * 0.62);
          out += traceText(word, w * 0.6, y + rowH, { style, color, font, size: ws });
        }
      }
      return out;
    }

    const cols = max > 50 ? 10 : 5;
    const rowsN = Math.ceil(max / cols);
    const cw = (w - 120) / cols, ch = (bottom - top) / rowsN;
    for (let n = 1; n <= max; n++) {
      const i = n - 1;
      const x = 60 + (i % cols) * cw, y = top + Math.floor(i / cols) * ch;
      if (guides) {
        out += `<line x1="${x}" y1="${y + ch * 0.78}" x2="${x + cw - 12}" y2="${y + ch * 0.78}" stroke="${GUIDE}" stroke-width="2"/>`;
      }
      const size = fitSize(String(n), font, cw - 20, ch * 0.66, 16);
      out += traceText(String(n), x + 8, y + ch * 0.78, { style, color, font, size });
    }
    return out;
  },

  "word-tracing-worksheet"(p) {
    const o = orientOf(p);
    const { w, h } = page(o);
    const font = fontOf(p), color = colorOf(p), style = styleOf(p);
    const guides = p.guides !== "no";
    const words = ((p.words ?? "").trim() || "the and said was you")
      .split(/[\s,]+/).filter(Boolean).slice(0, 8);

    let out = header("Word tracing", "Trace each word, then write it on the empty line", w, h);
    const top = 168, bottom = h - 90;
    const band = (bottom - top) / words.length;
    const rowH = band * 0.58;

    words.forEach((word, i) => {
      const y = top + i * band;
      if (guides) out += rules(y, rowH, w);
      const size = fitSize(`${word}  ${word}`, font, w - 150, rowH * 1.05);
      out += traceText(word, 76, y + rowH, { style: "solid", color, font, size });
      const modelW = layout(word, font, size).width;
      out += traceText(word, 76 + modelW + size * 0.6, y + rowH, { style, color, font, size });
    });
    return out;
  },

  "cursive-name-tracing"(p) {
    const o = orientOf(p);
    const { w, h } = page(o);
    const font = FONTS.cursive, color = colorOf(p), style = styleOf(p);
    const guides = p.guides !== "no";
    const rows = rowsOf(p, 5);
    const name = cleanName(p.name, "Name", p.caps !== "no");

    let out = header(name, "Trace the name in cursive, keeping the slant even", w, h);
    const top = 172, bottom = h - 90;
    const band = (bottom - top) / rows;
    const rowH = band * 0.6;
    const { lines, size } = fitOrWrap(name, font, w - 150, rowH * 1.15);

    for (let i = 0; i < rows; i++) {
      const y = top + i * band;
      if (guides) out += rules(y, rowH, w);
      if (p.slant !== "no") out += slant(y, rowH, w);
      if (i === rows - 1) continue;
      const st: Style = i === 0 && style !== "solid" ? "solid" : style;
      if (lines.length === 1) {
        out += traceText(lines[0], 76, y + rowH, { style: st, color, font, size });
      } else {
        out += traceText(lines[0], 76, y + rowH * 0.52, { style: st, color, font, size });
        out += traceText(lines[1], 76, y + rowH, { style: st, color, font, size });
      }
    }
    return out;
  },

  "prewriting-practice"(p) {
    const o = orientOf(p);
    const { w, h } = page(o);
    const color = colorOf(p);
    const rows = rowsOf(p, 6);
    type P = "lines" | "waves" | "zigzag" | "loops" | "spirals" | "arches";
    const order: P[] = ["lines", "waves", "zigzag", "arches", "loops", "spirals"];
    const mixed = p.pattern === "mixed";
    const label: Record<string, string> = {
      lines: "Straight lines", waves: "Waves", zigzag: "Zigzags",
      loops: "Loops", spirals: "Spirals", arches: "Arches", mixed: "Mixed patterns",
    };

    function pathFor(kind: P, x0: number, x1: number, y: number, amp: number, step: number) {
      if (kind === "lines") {
        let s = "";
        for (let x = x0; x <= x1; x += step) s += `M${x} ${y - amp} L${x} ${y + amp} `;
        return s;
      }
      if (kind === "zigzag") {
        let d = `M${x0} ${y + amp}`; let up = true;
        for (let x = x0 + step / 2; x <= x1; x += step / 2) { d += ` L${x} ${up ? y - amp : y + amp}`; up = !up; }
        return d;
      }
      if (kind === "waves") {
        let d = `M${x0} ${y}`;
        for (let x = x0; x < x1; x += step) d += ` q ${step / 4} ${-amp} ${step / 2} 0 q ${step / 4} ${amp} ${step / 2} 0`;
        return d;
      }
      if (kind === "arches") {
        let d = `M${x0} ${y + amp}`;
        for (let x = x0; x < x1; x += step) d += ` a ${step / 2} ${amp} 0 0 1 ${step} 0`;
        return d;
      }
      if (kind === "loops") {
        let d = `M${x0} ${y + amp}`;
        for (let x = x0; x < x1; x += step) d += ` c ${step * 0.1} ${-amp * 2.2} ${step * 0.9} ${-amp * 2.2} ${step} 0`;
        return d;
      }
      let s = "";
      for (let cx = x0 + step / 2; cx <= x1; cx += step) {
        let d = `M${cx} ${y}`;
        const turns = 2.2, pts = 40;
        for (let i = 1; i <= pts; i++) {
          const t = (i / pts) * turns * Math.PI * 2;
          const r = (amp / (turns * Math.PI * 2)) * t;
          d += ` L${(cx + r * Math.cos(t)).toFixed(1)} ${(y + r * Math.sin(t)).toFixed(1)}`;
        }
        s += d + " ";
      }
      return s;
    }

    let out = header(label[p.pattern] ?? "Pre-writing practice", "Trace each row from left to right", w, h);
    const top = 175, bottom = h - 90;
    const band = (bottom - top) / rows;
    const scale = p.level === "hard" ? 0.42 : p.level === "medium" ? 0.62 : 0.82;
    const amp = band * 0.3 * scale, step = band * 0.9 * scale;

    for (let i = 0; i < rows; i++) {
      const cy = top + i * band + band / 2;
      const kind: P = mixed ? order[i % order.length] : ((p.pattern as P) || "lines");
      out += `<line x1="60" y1="${cy - amp}" x2="${w - 60}" y2="${cy - amp}" stroke="${GUIDE}" stroke-width="1.5" stroke-dasharray="6 8"/>
              <line x1="60" y1="${cy + amp}" x2="${w - 60}" y2="${cy + amp}" stroke="${GUIDE}" stroke-width="1.5" stroke-dasharray="6 8"/>
              <circle cx="64" cy="${cy}" r="6" fill="${color}"/>`;
      out += `<path d="${pathFor(kind, 78, w - 70, cy, amp, step)}" fill="none" stroke="${color}"
               stroke-width="3" stroke-dasharray="7 11" stroke-linecap="round"/>`;
    }
    return out;
  },

  "dot-to-dot-printable"(p) {
    const o = orientOf(p);
    const { w, h } = page(o);
    const color = colorOf(p);
    const n = Math.max(6, Math.min(40, parseInt(p.dots, 10) || 20));
    type Pt = { x: number; y: number };
    const SHAPES: Record<string, (t: number) => Pt> = {
      star: (t) => { const a = t * Math.PI * 2; const k = Math.floor(t * 10) % 2 === 0 ? 1 : 0.42;
        return { x: Math.sin(a) * k, y: -Math.cos(a) * k }; },
      heart: (t) => { const a = t * Math.PI * 2;
        return { x: (16 * Math.sin(a) ** 3) / 17,
          y: -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17 }; },
      flower: (t) => { const a = t * Math.PI * 2, r = 0.45 + 0.55 * Math.abs(Math.cos(3 * a));
        return { x: Math.cos(a) * r, y: Math.sin(a) * r }; },
      butterfly: (t) => { const a = t * Math.PI * 4;
        const r = (Math.exp(Math.cos(a)) - 2 * Math.cos(4 * a) - Math.sin(a / 12) ** 5) / 4;
        return { x: Math.sin(a) * r * 0.8, y: -Math.cos(a) * r * 0.8 }; },
      sun: (t) => { const a = t * Math.PI * 2; const k = Math.floor(t * 24) % 2 === 0 ? 1 : 0.62;
        return { x: Math.cos(a) * k, y: Math.sin(a) * k }; },
      spiral: (t) => { const a = t * Math.PI * 2 * 2.6, r = 0.18 + t * 0.82;
        return { x: Math.cos(a) * r, y: Math.sin(a) * r }; },
      fish: (t) => { const a = t * Math.PI * 2;
        return { x: Math.cos(a) * (1 - 0.35 * Math.cos(a) ** 2), y: Math.sin(a) * 0.55 * (1 + 0.4 * Math.cos(a)) }; },
      moon: (t) => { const a = t * Math.PI * 2; const outer = t < 0.5;
        const b = outer ? a : Math.PI * 2 - a; const r = outer ? 1 : 0.94; const off = outer ? 0 : 0.34;
        return { x: Math.cos(b) * r + off, y: Math.sin(b) * r }; },
    };
    const fn = SHAPES[p.shape] ?? SHAPES.star;
    const name = (p.shape || "star").replace(/^\w/, (c) => c.toUpperCase());

    let out = header(`Connect the dots: ${name}`, `Join the dots from 1 to ${n}, then colour the picture`, w, h);
    const top = 190, bottom = h - 120;
    const pts: Pt[] = [];
    for (let i = 0; i < n; i++) pts.push(fn(i / n));
    const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const bw = maxX - minX || 1, bh = maxY - minY || 1;
    const s = Math.min((w - 200) / bw, (bottom - top) / bh) * 0.92;
    const cx = w / 2, cy = (top + bottom) / 2;
    const P = pts.map((q) => ({
      x: cx + (q.x - (minX + maxX) / 2) * s,
      y: cy + (q.y - (minY + maxY) / 2) * s,
    }));

    if (p.hint === "yes") {
      out += `<path d="M${P.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" L")} Z"
               fill="none" stroke="#c9d2dd" stroke-width="2" stroke-dasharray="6 8"/>`;
    }
    const fs = Math.max(15, Math.min(26, 520 / Math.sqrt(n)));
    P.forEach((q, i) => {
      const dx = q.x - cx, dy = q.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      const lx = q.x + (dx / len) * (fs * 1.15);
      const ly = q.y + (dy / len) * (fs * 1.15) + fs * 0.34;
      out += `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="4.5" fill="${color}"/>`;
      out += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle"
               font-family="Verdana,sans-serif" font-size="${fs.toFixed(0)}" fill="${color}">${i + 1}</text>`;
    });
    return out;
  },
};

/** Representative params used for the social preview of each tool. */
export const previewParams: Record<string, Params> = {
  "name-tracing-worksheet": { name: "Emma", rows: "5", style: "dotted", font: "school" },
  "letter-tracing-worksheet": { letter: "a", case: "both", style: "dotted", font: "school" },
  "cursive-practice-sheets": { text: "alphabet", rows: "5", style: "dotted", slant: "yes" },
  "number-tracing-worksheet": { range: "10", words: "no", style: "dotted", font: "school" },
  "prewriting-practice": { pattern: "mixed", level: "easy", rows: "6" },
  "word-tracing-worksheet": { words: "the and said was you", style: "dotted", font: "school" },
  "cursive-name-tracing": { name: "Emma", rows: "5", style: "dotted", slant: "yes" },
  "dot-to-dot-printable": { shape: "star", dots: "20", hint: "no" },
};
