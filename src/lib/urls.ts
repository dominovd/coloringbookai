// ============================================================
// urls.ts — the only place a public URL is constructed.
// ------------------------------------------------------------
// Before the 2026-09 restructure every template built its own paths, so the
// site carried three URL shapes for two kinds of page and eighteen pairs of
// addresses that pointed at the same thing (MIGRATION.md §3.2). The scheme
// now is deliberately flat:
//
//   /                             home
//   /coloring-pages/              index of every collection (was /pages/)
//   /{slug}/                      one collection      (was /pages/{slug}/)
//   /{hub-slug}/                  an axis hub that has no collection of its
//                                 own name (was /subject|season|style|audience/{x}/)
//   /worksheets/…  /tools/…       unchanged
//
// The `/pages/` segment is gone because it said nothing — everything on the
// site is a page, and `/pages/coloring-pages-for-teens/` read as "pages"
// twice. Hubs and collections share the root namespace on purpose: a reader
// looking for Christmas should land on one URL, not choose between
// `/season/christmas/` and `/christmas-coloring-pages/`.
//
// This module imports nothing from taxonomy.ts — taxonomy imports it. Keeping
// the dependency one-directional is what stops the hub/leaf merge logic from
// becoming a cycle.
// ============================================================

/** Index of every collection. */
export const COLORING_INDEX = "/coloring-pages/";

/**
 * Collections whose CSV-derived slug is not the URL we want.
 *
 * Only for URLs — `public/images/<slug>/` still uses the raw CSV slug, so the
 * artwork gate and the image paths are unaffected. Add sparingly: every entry
 * here is a redirect someone has to maintain forever.
 */
const SLUG_ALIASES: Record<string, string> = {
  // "adult coloring pages to print" absorbed the /audience/adults/ hub; the
  // shorter form is the one people search for.
  "adult-coloring-pages-to-print": "adult-coloring-pages",
};

/** CSV slug -> URL slug. */
export function pageSlug(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug;
}

/** Canonical path of a collection page. */
export function pageHref(slug: string): string {
  return `/${pageSlug(slug)}/`;
}

/**
 * axis/member -> the slug that owns that concept.
 *
 * Where the target matches a published collection, the hub has no page of its
 * own: both used to exist and say the same thing, so the one carrying the
 * search term wins and the other 301s into it. Where the target matches
 * nothing, the hub keeps a page under a keyword-bearing name — `vehicles` is
 * the clear case, it collects car, truck and monster-truck, which are three
 * different sheets rather than one duplicated idea (MIGRATION.md §3.2).
 */
const HUB_TARGET: Record<string, string> = {
  "subject/animals": "animal-coloring-pages",
  "subject/flowers": "flower-coloring-pages",
  "subject/ocean": "ocean-coloring-pages",
  "subject/vehicles": "vehicle-coloring-pages",
  "subject/food": "food-coloring-pages",
  "subject/space": "space-coloring-pages",

  "season/christmas": "christmas-coloring-pages",
  "season/halloween": "halloween-coloring-pages",
  "season/easter": "easter-coloring-pages",
  "season/thanksgiving": "thanksgiving-coloring-pages",
  "season/valentines": "valentines-day-coloring-pages",
  "season/spring": "spring-coloring-pages",
  "season/summer": "summer-coloring-pages",
  "season/fall": "fall-coloring-pages",
  "season/winter": "winter-coloring-pages",

  "audience/toddlers": "coloring-pages-for-toddlers",
  "audience/kids": "coloring-pages-for-kids",
  "audience/teens": "coloring-pages-for-teens",
  "audience/adults": "adult-coloring-pages",

  "style/cute": "cute-coloring-pages",
  "style/kawaii": "kawaii-coloring-pages",
  "style/easy": "easy-coloring-pages-for-adults",
  "style/detailed": "detailed-coloring-pages",
  "style/mandala": "mandala-coloring-pages",
};

/** The slug an axis member resolves to, collection or hub. */
export function hubTargetSlug(axisKey: string, memberSlug: string): string | undefined {
  return HUB_TARGET[`${axisKey}/${memberSlug}`];
}

/** Canonical path of an axis member. */
export function hubHref(axisKey: string, memberSlug: string): string {
  const target = hubTargetSlug(axisKey, memberSlug);
  return target ? `/${target}/` : COLORING_INDEX;
}

/** Every axis/member key that has a target, for build-time validation. */
export function hubKeys(): string[] {
  return Object.keys(HUB_TARGET);
}
