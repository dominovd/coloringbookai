// ============================================================
// taxonomy.ts, axes, publish gate, and page relationships
// ------------------------------------------------------------
// Four axes (subject / season / audience / style). Since the 2026-09
// restructure both collections and the axis members that survived it live at
// /[slug]/ — see urls.ts for why. Membership is computed from PUBLISHED pages
// only, so no hub ever links to a page that isn't live.
// ============================================================
import { buildPages, type Candidate, type Axis } from "./pagemap";
import { artworkCount } from "./artwork";
import { pageSlug, hubTargetSlug, COLORING_INDEX } from "./urls";

// ---- Publish gate: launch waves 1 + 2 from the brief (+ a few combos so
// every hub has real members). Promote more by adding slugs here, that is the
// weekly "publish 15-25 pages" lever. Everything else stays a draft in the CSV.
export const PUBLISHED = new Set<string>([
  // Wave 1, heads of clean clusters
  "christmas-coloring-pages", "cute-coloring-pages", "halloween-coloring-pages",
  "unicorn-coloring-pages", "dinosaur-coloring-pages", "flower-coloring-pages",
  "princess-coloring-pages", "spring-coloring-pages", "cat-coloring-pages",
  "easter-coloring-pages", "fall-coloring-pages", "mandala-coloring-pages",
  "summer-coloring-pages", "winter-coloring-pages", "animal-coloring-pages",
  "dragon-coloring-pages", "thanksgiving-coloring-pages", "dog-coloring-pages",
  "mermaid-coloring-pages", "valentines-day-coloring-pages",
  // Wave 2, adult segment, styles, more subjects
  "coloring-pages-for-teens", "kawaii-coloring-pages", "anime-coloring-pages",
  "axolotl-coloring-page", "horse-coloring-pages", "monster-truck-coloring-pages",
  "car-coloring-pages", "detailed-coloring-pages", "stress-relief-coloring-pages",
  "mandala-coloring-pages-for-adults", "adult-coloring-pages-to-print",
  "ocean-coloring-pages", "truck-coloring-pages", "space-coloring-pages",
  "food-coloring-pages", "rainbow-coloring-page", "bird-coloring-pages",
  // Intersections, fill audience/season hubs
  "christmas-coloring-pages-for-adults", "halloween-coloring-pages-for-adults",
  "flower-coloring-pages-for-adults", "fall-coloring-pages-for-kids",
  "summer-coloring-pages-for-kids", "thanksgiving-coloring-pages-for-kids",
  "cute-coloring-pages-for-adults", "easy-coloring-pages-for-adults",
  "cute-coloring-pages-for-teens", "cute-kawaii-coloring-pages",
]);

export interface HubMember {
  slug: string;      // hub member slug, e.g. "animals"
  label: string;
  match: (c: Candidate) => boolean;
  asset: string;
}
export interface AxisDef {
  key: "subject" | "season" | "audience" | "style";
  title: string;
  blurb: string;
  members: HubMember[];
}

const kw = (c: Candidate, re: RegExp) => re.test(c.keyword);

export const axes: AxisDef[] = [
  {
    key: "subject",
    title: "By subject",
    blurb: "Animals, flowers, the ocean, vehicles and more.",
    members: [
      { slug: "animals", label: "Animals", asset: "hub/animals.png", match: (c) => c.axis === "animals" },
      { slug: "flowers", label: "Flowers & nature", asset: "hub/flowers.png", match: (c) => c.axis === "nature-flowers" },
      { slug: "ocean", label: "Ocean & sea", asset: "hub/ocean.png", match: (c) => c.axis === "ocean-sea" },
      { slug: "vehicles", label: "Vehicles", asset: "hub/vehicles.png", match: (c) => c.axis === "vehicles" },
      { slug: "food", label: "Food", asset: "hub/food.png", match: (c) => c.axis === "food" },
      { slug: "space", label: "Space", asset: "hub/space.png", match: (c) => kw(c, /\bspace\b|\bplanet\b|\brocket\b|\bastronaut\b|\bgalaxy\b|\bsolar\b/) },
    ],
  },
  {
    key: "season",
    title: "By season",
    blurb: "Holiday and seasonal collections for timely activities throughout the year.",
    members: [
      { slug: "christmas", label: "Christmas", asset: "hub/christmas.png", match: (c) => c.season === "christmas" },
      { slug: "halloween", label: "Halloween", asset: "hub/halloween.png", match: (c) => c.season === "halloween" },
      { slug: "easter", label: "Easter", asset: "hub/easter.png", match: (c) => c.season === "easter" },
      { slug: "thanksgiving", label: "Thanksgiving", asset: "hub/thanksgiving.png", match: (c) => c.season === "thanksgiving" },
      { slug: "valentines", label: "Valentine's Day", asset: "hub/valentines.png", match: (c) => c.season === "valentines" },
      { slug: "spring", label: "Spring", asset: "hub/spring.png", match: (c) => c.season === "spring" },
      { slug: "summer", label: "Summer", asset: "hub/summer.png", match: (c) => c.season === "summer" },
      { slug: "fall", label: "Fall", asset: "hub/fall.png", match: (c) => c.season === "fall" },
      { slug: "winter", label: "Winter", asset: "hub/winter.png", match: (c) => c.season === "winter" },
    ],
  },
  {
    key: "audience",
    title: "By age",
    blurb: "Matched to attention span, motor skills and detail level.",
    members: [
      { slug: "toddlers", label: "Toddlers", asset: "hub/toddlers.png", match: (c) => c.audience === "toddlers" },
      { slug: "kids", label: "Kids (4-8)", asset: "hub/kids.png", match: (c) => c.audience === "kids" },
      { slug: "teens", label: "Teens", asset: "hub/teens.png", match: (c) => c.audience === "teens" },
      { slug: "adults", label: "Adults", asset: "hub/adults.png", match: (c) => c.audience === "adults" },
    ],
  },
  {
    key: "style",
    title: "By style",
    blurb: "From cute and easy to detailed, relaxing patterns.",
    members: [
      { slug: "cute", label: "Cute", asset: "hub/cute.png", match: (c) => c.axis === "style-cute" || kw(c, /\bcute\b/) },
      { slug: "kawaii", label: "Kawaii", asset: "hub/kawaii.png", match: (c) => kw(c, /\bkawaii\b/) },
      { slug: "easy", label: "Easy", asset: "hub/easy.png", match: (c) => c.difficulty === "easy" },
      { slug: "detailed", label: "Detailed", asset: "hub/detailed.png", match: (c) => c.difficulty === "detailed" },
      { slug: "mandala", label: "Mandala & patterns", asset: "hub/mandala.png", match: (c) => c.axis === "mandala-patterns" },
    ],
  },
];

// ---- Published pages ----
// ---- Quality gate -------------------------------------------------------
// A slug must be in PUBLISHED *and* have at least this many real artwork
// files (public/images/<slug>/page-N.png) to render at all.
//
// Why this is enforced in code rather than by discipline: on a domain with
// Authority Score 2, thin pages don't rank and they dilute the pages that
// could. A one-image page also wastes the two channels we're about to spend
// effort on — a Pinterest pin and a teacher outreach email each get one shot.
// The gate is self-healing: drop more artwork into the folder and the page
// comes back on the next build. Nothing to remember, nothing to undo.
export const MIN_ARTWORK = 6;

export function publishedPages(): Candidate[] {
  return buildPages().filter(
    (c) => PUBLISHED.has(c.slug) && artworkCount(c.slug) >= MIN_ARTWORK,
  );
}

/** In PUBLISHED but held back by the artwork gate — used by the audit script. */
export function draftPages(): { slug: string; have: number; need: number }[] {
  return buildPages()
    .filter((c) => PUBLISHED.has(c.slug) && artworkCount(c.slug) < MIN_ARTWORK)
    .map((c) => ({ slug: c.slug, have: artworkCount(c.slug), need: MIN_ARTWORK }))
    .sort((a, b) => b.have - a.have);
}

const _bySlug = new Map(publishedPages().map((c) => [c.slug, c]));
export function pageBySlug(slug: string): Candidate | undefined {
  return _bySlug.get(slug);
}

export function axisDef(key: string): AxisDef | undefined {
  return axes.find((a) => a.key === key);
}
export function hubMember(key: string, memberSlug: string): HubMember | undefined {
  return axisDef(key)?.members.find((m) => m.slug === memberSlug);
}

/** Published pages that belong to a hub member (e.g. subject/animals). */
export function hubPages(key: string, memberSlug: string): Candidate[] {
  const m = hubMember(key, memberSlug);
  if (!m) return [];
  return publishedPages().filter(m.match).sort((a, b) => b.volume - a.volume);
}

/** Which hub members actually have -1 published page (for nav that never dead-ends). */
export function liveMembers(key: string): HubMember[] {
  return (axisDef(key)?.members ?? []).filter((m) => publishedPages().some(m.match));
}

// ---- Relationships used by the page template ----
/** Adjacent combinations: shared subject axis, season or audience. */
export function adjacentCombos(page: Candidate, limit = 8): Candidate[] {
  return publishedPages()
    .filter((c) => c.slug !== page.slug)
    .map((c) => {
      let score = 0;
      if (c.axis === page.axis && page.axis !== "other") score += 3;
      if (c.season && c.season === page.season) score += 3;
      if (c.audience && c.audience === page.audience) score += 2;
      if (c.difficulty === page.difficulty) score += 1;
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.c.volume - a.c.volume)
    .slice(0, limit)
    .map((x) => x.c);
}

/**
 * Axis members that still get a page of their own after the 2026-09 merge.
 *
 * A member is standalone only when its target slug (urls.ts `HUB_TARGET`) is
 * not already a published collection. Where the two collide — `season/christmas`
 * and the `christmas-coloring-pages` collection — the pair was two addresses
 * for one idea, so only the collection survives and the hub 301s into it
 * (MIGRATION.md §3.2). Deriving this instead of listing it means promoting a
 * slug into PUBLISHED automatically retires the duplicate hub, with no second
 * list to keep in step.
 */
export function standaloneHubs(): { key: AxisDef["key"]; member: HubMember }[] {
  const leaves = new Set(publishedPages().map((c) => pageSlug(c.slug)));
  const out: { key: AxisDef["key"]; member: HubMember }[] = [];
  for (const a of axes) {
    for (const m of a.members) {
      if (hubPages(a.key, m.slug).length === 0) continue; // artwork gate emptied it
      const target = hubTargetSlug(a.key, m.slug);
      if (target && !leaves.has(target)) out.push({ key: a.key, member: m });
    }
  }
  return out;
}

/** True when this axis member resolves to a URL that is actually built. */
export function hubIsLive(axisKey: string, memberSlug: string): boolean {
  const target = hubTargetSlug(axisKey, memberSlug);
  if (!target) return false;
  if (publishedPages().some((c) => pageSlug(c.slug) === target)) return true;
  return hubPages(axisKey, memberSlug).length > 0;
}

/**
 * Resolves a list of axis members to the first URL that actually exists.
 *
 * The artwork gate can empty a hub, and a nav item pointing at an empty hub
 * would 404. Pass [axis, member] pairs in order of preference; the first live
 * one wins, falling back to the coloring index, which is always built.
 */
export function resolveHub(...candidates: [string, string][]): string {
  for (const [axisKey, memberSlug] of candidates) {
    if (hubIsLive(axisKey, memberSlug)) {
      const target = hubTargetSlug(axisKey, memberSlug)!;
      return `/${target}/`;
    }
  }
  return COLORING_INDEX;
}

/**
 * Which hub(s) a page belongs to, for breadcrumbs and internal linking.
 *
 * Self-matches are dropped: after the merge, `christmas-coloring-pages` is a
 * member of `season/christmas`, whose URL is that same page — a breadcrumb
 * reading Home / Christmas / Christmas, linking to itself.
 */
export function pageHubs(page: Candidate): { key: string; member: HubMember }[] {
  const self = pageSlug(page.slug);
  const out: { key: string; member: HubMember }[] = [];
  for (const a of axes) {
    for (const m of a.members) {
      if (!m.match(page)) continue;
      if (hubTargetSlug(a.key, m.slug) === self) continue;
      if (!hubIsLive(a.key, m.slug)) continue;
      out.push({ key: a.key, member: m });
    }
  }
  return out;
}
