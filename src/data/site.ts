// Re-export of the root site config so .astro components have a short,
// stable import. The values themselves live in site.config.mjs, which the
// Node scripts and astro.config.mjs also read.
export { site } from "../../site.config.mjs";
export { ORIGIN, DOMAIN, BRAND, EMAIL } from "../../site.config.mjs";
