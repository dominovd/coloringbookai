// ============================================================
// site.config.mjs — the only place the domain and brand name live.
// ------------------------------------------------------------
// Plain ESM on purpose: this file is imported by astro.config.mjs, by the
// Node scripts in scripts/, and (through src/data/site.ts) by every .astro
// component. A .ts file could not be imported by the plain-node scripts.
//
// The 2026-09 migration from coloringbookai.net proved why this has to be
// one constant: the old domain was hardcoded in nine places, including two
// image generators that burned it into PNGs. See MIGRATION.md §5, item 4 —
// leftover absolute links to the old domain are the most common way a
// domain move loses traffic.
// ============================================================

/** Bare hostname, no scheme, no trailing slash. */
export const DOMAIN = "coloringpagekit.com";

/** Origin used for canonicals, JSON-LD, og:url and the sitemap. */
export const ORIGIN = `https://${DOMAIN}`;

/** Brand name as written in prose and <title>. */
export const BRAND = "ColoringPageKit";

/** Brand split for the logo lockup: <b>{head}</b><i>{tail}</i>. */
export const BRAND_HEAD = "ColoringPage";
export const BRAND_TAIL = "Kit";

export const TAGLINE = "Free printable coloring pages";
export const EMAIL = `info@${DOMAIN}`;

/** Wordmark stamped onto generated worksheets and composite images. */
export const WATERMARK = DOMAIN;

export const site = {
  name: BRAND,
  head: BRAND_HEAD,
  tail: BRAND_TAIL,
  tagline: TAGLINE,
  domain: DOMAIN,
  origin: ORIGIN,
  email: EMAIL,
};

export default site;
