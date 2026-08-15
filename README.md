# ColoringBookAI

Static [Astro](https://astro.build) site for `coloringbookai.net` — free printable coloring pages, built to the project brief (`PROJECT.md`): programmatic printables-SEO, pages driven by `coloring_pagemap.csv`.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview
```

Node 18+. Deploy `dist/` to any static host.

## How it's wired (the brief, in code)

### The CSV is the source of truth
`coloring_pagemap.csv` (2,116 rows) drives everything. `src/lib/pagemap.ts` parses it at
build time, drops the **308 SKIP-licensed** rows, and enriches each of the **1,808 BUILD**
keywords with facets (audience, difficulty, season, sheet count, age band).

### Publish gate — waves, not a dump
The architecture supports all 1,808 pages, but only slugs listed in `PUBLISHED`
(`src/lib/taxonomy.ts`) actually render and enter the sitemap. That's the brief's "publish
15–25/week" rule enforced in code: **currently ~47 live** (waves 1 + 2 + a few intersection
pages). To publish more, add slugs to `PUBLISHED` — nothing else. Drafts never leak into the
build or sitemap. Licensed rows are hard-blocked twice (flag + guardrail) and can never render.

### Taxonomy (four axes + combos)
```
/                              hub: entry points into every axis
/subject/[animals|flowers|ocean|vehicles|food|space]/
/season/[christmas|halloween|easter|thanksgiving|valentines|spring|summer|fall|winter]/
/audience/[toddlers|kids|teens|adults]/
/style/[cute|kawaii|easy|detailed|mandala]/
/pages/[slug]/                 the printable pages (mass) — e.g. /pages/unicorn-coloring-pages/
/pages/                        browse-all index
/tools/coloring-book-builder/  select pages → one custom PDF (jsPDF)
/tools/custom-name-page/       client-side SVG name page → print / PDF
```
Hubs only ever list **published** members (`liveMembers` / `hubPages`), so no link dead-ends.

### 11-block page template
`src/components/ColoringPageTemplate.astro` renders every page identically to the internal
mockup: H1, two-line short answer, spec chips + "Download all / Build a custom PDF", the
Age/Difficulty/Scene/Layout **filter block (all real `<a href>` hub links, no query strings)**,
12–24 preview grid with per-card Print/PDF, an ad slot after the 8th preview, "Choose your
favorites → one PDF", params table, print tips, adjacent combinations, FAQ, and related searches.
Copy is generated per page from facets (`src/lib/pagecopy.ts`) so 1,800 pages stay unique
without hand-writing them.

### Schema & discovery
Every page emits `BreadcrumbList`, `FAQPage`, and `ImageGallery`/`ImageObject` JSON-LD
(`src/lib/schema.ts`) — the image pack shows in ~98% of this niche's SERPs, so it's a real
traffic channel. `@astrojs/sitemap` builds `sitemap-index.xml`; `public/robots.txt` points to it.

### Seasonal rotation
`src/lib/../data/seasons.ts` + `activeSeason()` pick the homepage "Trending now" block by build
date. Halloween Aug 1→Nov 1 (wins the Oct overlap), **Christmas opens Oct 1** (biggest cluster,
~377K, demand starts early), then Valentine's → Easter → Spring. Rebuild/redeploy to rotate —
set a scheduled deploy so seasonal pages go live ahead of the date (brief's hard deadlines).

## Project structure
```
src/
  lib/        pagemap.ts · taxonomy.ts · pagecopy.ts · schema.ts   (the engine)
  data/       site.ts · seasons.ts · content.ts (nav/footer/faq)
  components/ ColoringPageTemplate · HubPage · Header · Footer · PageCard · Logo · Ph
  layouts/    BaseLayout.astro
  pages/      index · pages/[slug] · pages/index · {subject,season,audience,style}/[slug] · tools/*
public/       favicon.svg · robots.txt · images/  ← artwork goes here
coloring_pagemap.csv   ← edit/extend to change what can be built
PROJECT.md             ← the strategy brief
```

## Images
All artwork is a labeled placeholder (`Ph.astro`) showing the file path it expects. Drop
print-ready **black-and-white line art** into `public/images/<slug>/page-N.png` (portrait 3:4,
WebP/PNG ≤50KB per the brief). Preview thumbnails and the hero/hub icons all follow the paths
shown in each placeholder.

## Fixes carried over from the first pass
New Pages block on the homepage · library counter in the hero · "Holiday" typo fixed ·
"Color by number" not linked (different product, no pages yet).

## Publish next (edit `PUBLISHED` in `src/lib/taxonomy.ts`)
Wave 3 is seasonal and **date-driven**: Halloween live by late August, Christmas by early
October, Thanksgiving by mid-September. After that, work down the CSV by volume × low KD.
```
