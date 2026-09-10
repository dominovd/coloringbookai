// ============================================================
// pagemap.ts, the CSV is the source of truth
// ------------------------------------------------------------
// Parses coloring_pagemap.csv at build time, drops SKIP-licensed rows, and
// enriches every BUILD keyword with the facets the templates and hubs need.
//
// The architecture supports all 1,808 BUILD candidates, but only rows whose
// slug is in the PUBLISHED set (see waves in taxonomy.ts) are actually
// rendered and put in the sitemap, that's how we honor the brief's rule to
// publish in waves of 15-25/week instead of dumping hundreds at once (which
// trips Google's mass-generated-content filter).
// ============================================================
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Axis =
  | "animals" | "nature-flowers" | "ocean-sea" | "vehicles" | "food"
  | "season-holiday" | "audience-adults" | "audience-kids"
  | "style-cute" | "style-detailed" | "style-easy" | "mandala-patterns"
  | "letters-numbers" | "flags-geo" | "other";

export type Audience = "toddlers" | "kids" | "teens" | "adults" | null;
export type Difficulty = "easy" | "medium" | "detailed";

export interface Candidate {
  keyword: string;
  slug: string;
  volume: number;
  kd: number;
  cpc: number;
  aiOverview: boolean;
  axis: Axis;
  licensed: boolean;
  build: boolean;
  // enriched
  audience: Audience;
  difficulty: Difficulty;
  season: string | null;
  sheets: number;
  ages: string;
}

export function slugify(k: string): string {
  return k.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function detectAudience(k: string): Audience {
  if (/\bfor toddlers\b|\btoddler\b/.test(k)) return "toddlers";
  if (/\bfor kids\b|\bfor children\b/.test(k)) return "kids";
  if (/\bfor teens\b|\bteen\b/.test(k)) return "teens";
  if (/\bfor adults\b|\badult\b|stress relief\b/.test(k)) return "adults";
  return null;
}

function detectDifficulty(k: string): Difficulty {
  if (/\beasy\b|\bsimple\b|\bpreschool\b/.test(k)) return "easy";
  if (/\bdetailed\b|\bintricate\b|\bhard\b|\badvanced\b|\bcomplex\b/.test(k)) return "detailed";
  return "medium";
}

const SEASONS = [
  ["christmas", /\bchristmas\b|\bsanta\b|\breindeer\b/],
  ["halloween", /\bhalloween\b|\bpumpkin\b|\bspooky\b|\bghost\b/],
  ["easter", /\beaster\b|\bbunny\b/],
  ["thanksgiving", /\bthanksgiving\b/],
  ["valentines", /\bvalentine/],
  ["spring", /\bspring\b/],
  ["summer", /\bsummer\b/],
  ["fall", /\bfall\b|\bautumn\b/],
  ["winter", /\bwinter\b|\bsnow/],
] as const;

function detectSeason(k: string): string | null {
  for (const [name, re] of SEASONS) if (re.test(k)) return name;
  return null;
}

// Sheet count + age band are lightweight heuristics so each page shows real
// parameters (block 7). Tune freely.
function sheetCount(volume: number): number {
  if (volume >= 20000) return 24;
  if (volume >= 8000) return 20;
  if (volume >= 2000) return 16;
  return 12;
}
function ageBand(a: Audience, d: Difficulty): string {
  if (a === "toddlers") return "Ages 1-3";
  if (a === "kids") return "Ages 4-8";
  if (a === "teens") return "Ages 9-14";
  if (a === "adults") return "Adults";
  if (d === "easy") return "Ages 3-6";
  if (d === "detailed") return "Ages 10+ & adults";
  return "All ages";
}

/**
 * Trademark blocklist — a safety net over the CSV's `licensed_character` flag.
 *
 * That flag is not reliable: 7 rows carrying other people's marks (Jurassic
 * World/Park, LEGO, Ninjago, Pixar) were exported as `no` + `BUILD`, and the
 * brand names surfaced in the "Related searches" block on live pages. A missed
 * flag in a data export must not be able to put a trademark on the site, so
 * the name itself is checked here too.
 *
 * Matching is word-boundary and phrase-based to avoid false positives — plain
 * "star" or "stitch" is fine, "star wars" and "lilo and stitch" are not.
 */
const TRADEMARKS = [
  // film / TV / games
  "jurassic", "pixar", "disney", "marvel", "spiderman", "spider-man",
  "star wars", "harry potter", "batman", "superman", "minions?",
  "pokemon", "pikachu", "mario", "sonic the hedgehog", "minecraft", "roblox",
  "among us", "naruto", "spongebob", "paw patrol", "bluey", "peppa",
  "cocomelon", "encanto", "moana", "frozen elsa", "\\belsa\\b", "mickey mouse",
  "lilo and stitch", "lilo & stitch", "hello kitty", "sanrio", "barbie",
  "labubu", "gabby'?s dollhouse", "unicorn academy", "pete the cat",
  // toy / product brands
  "legos?", "ninjago", "crayola", "abcmouse", "play-?doh", "melissa and doug",
];
const TRADEMARK_RE = new RegExp(`(^|\\s)(${TRADEMARKS.join("|")})(\\s|$)`, "i");

export function isTrademarked(keyword: string): boolean {
  return TRADEMARK_RE.test(keyword);
}

let _cache: Candidate[] | null = null;

export function loadCandidates(): Candidate[] {
  if (_cache) return _cache;
  const csv = readFileSync(join(process.cwd(), "coloring_pagemap.csv"), "utf8");
  const lines = csv.trim().split(/\r?\n/);
  const out: Candidate[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length < 8) continue;
    const [keyword, volume, kd, cpc, aio, axis, licensed, rec] = parts;
    const kw = keyword.trim();
    out.push({
      keyword: kw,
      slug: slugify(kw),
      volume: parseInt(volume, 10) || 0,
      kd: parseInt(kd, 10) || 0,
      cpc: parseFloat(cpc) || 0,
      aiOverview: aio.trim() === "yes",
      axis: (axis.trim() as Axis) || "other",
      // Flag from the CSV OR the name itself — whichever catches it first.
      licensed: /yes/i.test(licensed) || isTrademarked(kw),
      build: rec.trim() === "BUILD",
      audience: detectAudience(kw),
      difficulty: detectDifficulty(kw),
      season: detectSeason(kw),
      sheets: sheetCount(parseInt(volume, 10) || 0),
      ages: "",
    });
  }
  for (const c of out) c.ages = ageBand(c.audience, c.difficulty);
  // Guardrail: licensed rows must never be buildable, no matter the flag mix.
  for (const c of out) if (c.licensed) c.build = false;
  _cache = out;
  return out;
}

/** BUILD-flagged, de-duplicated by slug (first/highest-volume wins). */
export function buildPages(): Candidate[] {
  const byslug = new Map<string, Candidate>();
  for (const c of loadCandidates().filter((c) => c.build)) {
    const prev = byslug.get(c.slug);
    if (!prev || c.volume > prev.volume) byslug.set(c.slug, c);
  }
  return [...byslug.values()].sort((a, b) => b.volume - a.volume);
}
