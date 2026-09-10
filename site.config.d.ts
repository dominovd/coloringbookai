// Type surface for site.config.mjs. Kept alongside it so TypeScript sees the
// shape without needing allowJs.
export const DOMAIN: string;
export const ORIGIN: string;
export const BRAND: string;
export const BRAND_HEAD: string;
export const BRAND_TAIL: string;
export const TAGLINE: string;
export const EMAIL: string;
export const WATERMARK: string;

export interface SiteConfig {
  name: string;
  head: string;
  tail: string;
  tagline: string;
  domain: string;
  origin: string;
  email: string;
}

export const site: SiteConfig;
export default site;
