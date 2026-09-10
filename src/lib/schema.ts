// JSON-LD builders. The image pack shows in ~98% of this niche's SERPs, so
// ImageObject on every preview is a real traffic channel, not decoration.
import { ORIGIN, BRAND } from "../../site.config.mjs";

const SITE = ORIGIN;

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE + it.url,
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND,
    url: SITE + "/",
    logo: SITE + "/favicon.svg",
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    url: SITE + "/",
  };
}

/** CollectionPage + ItemList for hub / listing pages. */
export function collectionLd(name: string, url: string, items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: SITE + url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: SITE + it.url,
      })),
    },
  };
}

export function imageGalleryLd(pageName: string, pageUrl: string, images: { url: string; caption: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: pageName,
    url: SITE + pageUrl,
    associatedMedia: images.map((im) => ({
      "@type": "ImageObject",
      contentUrl: SITE + im.url,
      caption: im.caption,
      encodingFormat: "image/png",
    })),
  };
}
