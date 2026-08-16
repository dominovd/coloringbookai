// ============================================================
// strokefont.ts — single-stroke ("monoline") school alphabet
// ------------------------------------------------------------
// Why this exists: a normal font has no centre line, only a contour. Stroke
// it and you get TWO thin lines around a fat letter — which is what our first
// pass produced. Real tracing worksheets use a skeleton letterform: one line
// down the middle of each stroke, then dashed. That can only come from a
// single-stroke font, so here is one.
//
// Coordinate system (authored directly in SVG space, y grows downward):
//   baseline  y = 0
//   x-height  y = -500
//   cap/asc   y = -700 / -750
//   descender y = +200
//   em        = 1000 units, so scale = fontSize / 1000
//
// Each glyph is one or more sub-paths. The FIRST point of the first sub-path
// is where the pencil starts, which is what the "starting dot" and direction
// arrow styles hang off — that is why a stroke font also makes those styles
// pedagogically correct instead of decorative.
// ============================================================

export interface Glyph { d: string; w: number; }

const G: Record<string, Glyph> = {
  " ": { d: "", w: 320 },

  /* ---- lowercase ---- */
  // NOTE on arcs: an SVG arc whose endpoints are further apart than 2r gets
  // its radii scaled up silently, which quietly deforms the glyph. Every arc
  // endpoint below is an exact point on its circle: (cx + r·cosθ, cy − r·sinθ).
  a: { d: "M0,-250 A250,250 0 1,0 500,-250 A250,250 0 1,0 0,-250 M500,-500 L500,0", w: 600 },
  b: { d: "M0,-750 L0,0 M0,-250 A250,250 0 1,0 500,-250 A250,250 0 1,0 0,-250", w: 600 },
  c: { d: "M441,-441 A250,250 0 1,0 441,-59", w: 560 },
  d: { d: "M500,-750 L500,0 M500,-250 A250,250 0 1,0 0,-250 A250,250 0 1,0 500,-250", w: 600 },
  e: { d: "M5,-300 L495,-300 A250,250 0 1,0 411,-59", w: 580 },
  f: { d: "M420,-690 A150,150 0 0,0 170,-560 L170,0 M20,-430 L360,-430", w: 420 },
  g: { d: "M0,-250 A250,250 0 1,0 500,-250 A250,250 0 1,0 0,-250 M500,-500 L500,60 C500,150 380,190 250,165", w: 600 },
  h: { d: "M0,-750 L0,0 M0,-290 A250,250 0 0,1 500,-290 L500,0", w: 600 },
  i: { d: "M250,-500 L250,0 M250,-660 A22,22 0 1,0 251,-660", w: 340 },
  j: { d: "M330,-500 L330,60 A200,160 0 0,1 40,160 M330,-660 A22,22 0 1,0 331,-660", w: 400 },
  k: { d: "M0,-750 L0,0 M470,-500 L60,-170 M190,-270 L490,0", w: 560 },
  l: { d: "M250,-750 L250,0", w: 340 },
  m: { d: "M0,-500 L0,0 M0,-310 A200,200 0 0,1 400,-310 L400,0 M400,-310 A200,200 0 0,1 800,-310 L800,0", w: 900 },
  n: { d: "M0,-500 L0,0 M0,-290 A250,250 0 0,1 500,-290 L500,0", w: 600 },
  o: { d: "M0,-250 A250,250 0 1,0 500,-250 A250,250 0 1,0 0,-250", w: 600 },
  p: { d: "M0,-500 L0,200 M0,-250 A250,250 0 1,0 500,-250 A250,250 0 1,0 0,-250", w: 600 },
  q: { d: "M500,-500 L500,200 M500,-250 A250,250 0 1,0 0,-250 A250,250 0 1,0 500,-250", w: 600 },
  r: { d: "M0,-500 L0,0 M0,-300 A240,240 0 0,1 430,-390", w: 480 },
  s: { d: "M450,-405 C450,-520 120,-525 120,-390 C120,-295 380,-300 380,-185 C380,-40 70,-55 45,-140", w: 520 },
  t: { d: "M250,-690 L250,-130 A150,150 0 0,0 480,-50 M50,-500 L450,-500", w: 500 },
  u: { d: "M0,-500 L0,-250 A250,250 0 0,0 500,-250 L500,-500 M500,-250 L500,0", w: 600 },
  v: { d: "M0,-500 L250,0 L500,-500", w: 560 },
  w: { d: "M0,-500 L180,0 L360,-500 L540,0 L720,-500", w: 780 },
  x: { d: "M0,-500 L500,0 M500,-500 L0,0", w: 560 },
  y: { d: "M0,-500 L250,0 M500,-500 L160,200", w: 560 },
  z: { d: "M20,-500 L480,-500 L20,0 L480,0", w: 540 },

  /* ---- uppercase ---- */
  A: { d: "M0,0 L310,-700 L620,0 M115,-260 L505,-260", w: 680 },
  B: { d: "M0,-700 L0,0 M0,-700 L340,-700 A175,175 0 0,1 340,-350 L0,-350 M0,-350 L380,-350 A175,175 0 0,1 380,0 L0,0", w: 620 },
  C: { d: "M519,-587 A310,310 0 1,0 519,-113", w: 680 },
  D: { d: "M0,-700 L0,0 M0,-700 L280,-700 A350,350 0 0,1 280,0 L0,0", w: 660 },
  E: { d: "M580,-700 L0,-700 L0,0 L580,0 M0,-350 L450,-350", w: 620 },
  F: { d: "M580,-700 L0,-700 L0,0 M0,-350 L430,-350", w: 600 },
  G: { d: "M519,-587 A310,310 0 1,0 589,-195 L589,-330 L380,-330", w: 680 },
  H: { d: "M0,-700 L0,0 M600,-700 L600,0 M0,-350 L600,-350", w: 660 },
  I: { d: "M250,-700 L250,0", w: 340 },
  J: { d: "M480,-700 L480,-170 C480,-40 330,20 200,-10 C120,-30 70,-90 60,-160", w: 560 },
  K: { d: "M0,-700 L0,0 M560,-700 L70,-270 M210,-390 L600,0", w: 640 },
  L: { d: "M0,-700 L0,0 L540,0", w: 580 },
  M: { d: "M0,0 L0,-700 L350,-250 L700,-700 L700,0", w: 760 },
  N: { d: "M0,0 L0,-700 L600,0 L600,-700", w: 660 },
  O: { d: "M0,-350 A310,350 0 1,0 620,-350 A310,350 0 1,0 0,-350", w: 680 },
  P: { d: "M0,0 L0,-700 L350,-700 A190,190 0 0,1 350,-320 L0,-320", w: 620 },
  Q: { d: "M0,-350 A310,350 0 1,0 620,-350 A310,350 0 1,0 0,-350 M390,-150 L650,70", w: 680 },
  R: { d: "M0,0 L0,-700 L350,-700 A190,190 0 0,1 350,-320 L0,-320 M330,-320 L620,0", w: 660 },
  S: { d: "M555,-575 C555,-720 130,-725 130,-540 C130,-410 470,-420 470,-265 C470,-60 80,-80 50,-190", w: 620 },
  T: { d: "M0,-700 L620,-700 M310,-700 L310,0", w: 660 },
  U: { d: "M0,-700 L0,-310 A310,310 0 0,0 620,-310 L620,-700", w: 680 },
  V: { d: "M0,-700 L310,0 L620,-700", w: 680 },
  W: { d: "M0,-700 L180,0 L400,-700 L620,0 L800,-700", w: 860 },
  X: { d: "M0,-700 L620,0 M620,-700 L0,0", w: 680 },
  Y: { d: "M0,-700 L310,-330 L620,-700 M310,-330 L310,0", w: 680 },
  Z: { d: "M20,-700 L600,-700 L20,0 L600,0", w: 660 },

  /* ---- digits ---- */
  "0": { d: "M0,-350 A280,350 0 1,0 560,-350 A280,350 0 1,0 0,-350", w: 620 },
  "1": { d: "M110,-560 L300,-700 L300,0", w: 480 },
  "2": { d: "M60,-545 C60,-700 490,-700 490,-475 C490,-350 180,-150 50,0 L520,0", w: 600 },
  "3": { d: "M60,-560 C60,-700 460,-700 460,-520 C460,-420 340,-390 250,-390 C350,-390 480,-355 480,-210 C480,-20 90,-25 45,-150", w: 600 },
  "4": { d: "M400,0 L400,-700 L40,-215 L530,-215", w: 600 },
  "5": { d: "M500,-700 L130,-700 L105,-430 C300,-505 505,-400 505,-215 C505,-25 130,-15 45,-135", w: 600 },
  // 6 and 9: a single sweeping stroke into a closed bowl. Built from cubics
  // rather than arcs so the bowl always closes cleanly at any size.
  "6": { d: "M470,-645 C360,-720 90,-640 75,-380 C62,-150 150,-10 300,-10 C425,-10 505,-100 505,-205 C505,-320 405,-395 300,-395 C195,-395 100,-320 82,-235", w: 600 },
  "7": { d: "M20,-700 L540,-700 L210,0", w: 580 },
  "8": { d: "M310,-390 A155,155 0 1,0 310,-700 A155,155 0 1,0 310,-390 A195,195 0 1,1 310,0 A195,195 0 1,1 310,-390", w: 620 },
  "9": { d: "M130,-55 C240,20 510,-60 525,-320 C538,-550 450,-690 300,-690 C175,-690 95,-600 95,-495 C95,-380 195,-305 300,-305 C405,-305 500,-380 518,-465", w: 600 },

  /* ---- punctuation ---- */
  ".": { d: "M170,-25 A25,25 0 1,0 171,-25", w: 300 },
  ",": { d: "M180,-20 A25,25 0 1,0 181,-20 M175,10 L120,110", w: 300 },
  "'": { d: "M170,-700 L140,-560", w: 240 },
  "-": { d: "M40,-250 L400,-250", w: 460 },
  "!": { d: "M170,-700 L170,-190 M170,-25 A25,25 0 1,0 171,-25", w: 320 },
  "?": { d: "M40,-560 A200,170 0 1,1 300,-380 L300,-200 M300,-25 A25,25 0 1,0 301,-25", w: 520 },
};

const LETTER_SPACING = 60; // units between glyph boxes

export function hasGlyph(ch: string): boolean {
  return ch in G || ch.toLowerCase() in G;
}

function lookup(ch: string): Glyph {
  return G[ch] ?? G[ch.toLowerCase()] ?? G[ch.toUpperCase()] ?? { d: "", w: 480 };
}

/** Total advance width of `text` in em units (1000 = font size). */
export function strokeWidth(text: string): number {
  let w = 0;
  for (const ch of text) w += lookup(ch).w + LETTER_SPACING;
  return Math.max(0, w - LETTER_SPACING);
}

export interface PlacedGlyph {
  ch: string;
  /** path data, already translated on x within em space */
  d: string;
  x: number;
  w: number;
  /** first pen-down point, for start dots and direction arrows */
  start: { x: number; y: number } | null;
}

function firstPoint(d: string, dx: number): { x: number; y: number } | null {
  const m = /^M\s*(-?[\d.]+)[ ,](-?[\d.]+)/.exec(d.trim());
  return m ? { x: parseFloat(m[1]) + dx, y: parseFloat(m[2]) } : null;
}

/** Lays out `text` and returns glyph paths translated into em space. */
export function strokeGlyphs(text: string): PlacedGlyph[] {
  const out: PlacedGlyph[] = [];
  let x = 0;
  for (const ch of text) {
    const g = lookup(ch);
    if (g.d) {
      // Translate the sub-paths by shifting every absolute M/L command origin.
      const d = translatePath(g.d, x);
      out.push({ ch, d, x, w: g.w, start: firstPoint(g.d, x) });
    } else {
      out.push({ ch, d: "", x, w: g.w, start: null });
    }
    x += g.w + LETTER_SPACING;
  }
  return out;
}

/**
 * Shifts an absolute-command path along x.
 *
 * Every command here takes plain x,y pairs (M, L, C, Q, S, T) except A, whose
 * 7-tuple is `rx ry rot large sweep x y` — only the last pair is a point.
 * Getting this wrong is silent: the glyph still draws, just in the wrong
 * place, so the parser below is explicit about which numbers are coordinates.
 */
function translatePath(d: string, dx: number): string {
  if (!dx) return d;
  return d.replace(
    /([MLCQSTA])\s*([^MLCQSTAZ]+)/g,
    (_, cmd: string, args: string) => {
      const n = args.trim().split(/[\s,]+/).map(Number);
      if (cmd === "A") {
        for (let i = 0; i + 7 <= n.length; i += 7) n[i + 5] += dx;
      } else {
        for (let i = 0; i + 2 <= n.length; i += 2) n[i] += dx;
      }
      return `${cmd}${n.join(",")} `;
    },
  );
}
