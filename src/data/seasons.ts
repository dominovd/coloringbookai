// ============================================================
// Seasonal rotation
// ------------------------------------------------------------
// The homepage "TRENDING NOW" block auto-rotates based on the build date.
// Each window is [start, end) as (month, day). Higher `priority` wins when
// two windows overlap.
//
// Rationale baked into the schedule:
//  - Christmas is the largest cluster in the niche (~377K searches) and demand
//    starts EARLY, so its window opens Oct 1, well before December.
//  - Halloween runs Aug 1 - Nov 1 and outranks Christmas during their Oct
//    overlap (priority 3 > 2), so pumpkins never linger past early November.
//  - After Nov 1 Christmas takes over cleanly, then Valentine's, Easter, Spring.
//
// A dated `TRENDING NOW` badge is a promise: if it lies, trust drops. This
// config is the single source of truth, the site rebuilds pick up the right
// season automatically. Rebuild (or redeploy on a schedule) to rotate.
// ============================================================

export interface Season {
  id: string;
  /** inclusive start as [month (1-12), day] */
  start: [number, number];
  /** exclusive end as [month (1-12), day] */
  end: [number, number];
  priority: number;
  title: string;
  blurb: string;
  /** real landing-page slug (see landings.ts) */
  href: string;
  cta: string;
  accent: "orange" | "teal" | "lilac";
  /** four featured sub-collections shown as cards */
  cards: { label: string; href: string; asset: string }[];
}

export const seasons: Season[] = [
  {
    id: "halloween",
    start: [8, 1],
    end: [11, 1],
    priority: 3,
    title: "Halloween coloring pages",
    blurb: "Spooky, cute, and easy pages to print for October.",
    href: "/pages/halloween-coloring-pages/",
    cta: "Explore Halloween",
    accent: "orange",
    cards: [
      { label: "Pumpkins", href: "/pages/pumpkin-coloring-pages/", asset: "seasonal/pumpkins.png" },
      { label: "Friendly ghosts", href: "/pages/ghost-coloring-pages/", asset: "seasonal/ghosts.png" },
      { label: "Haunted houses", href: "/pages/haunted-house-coloring-pages/", asset: "seasonal/haunted-house.png" },
      { label: "Easy Halloween", href: "/pages/easy-halloween-coloring-pages/", asset: "seasonal/easy-halloween.png" },
    ],
  },
  {
    id: "christmas",
    start: [10, 1],
    end: [12, 27],
    priority: 2,
    title: "Christmas coloring pages",
    blurb: "Print Santa, decorated trees and cozy winter scenes for holiday activities.",
    href: "/pages/christmas-coloring-pages/",
    cta: "Explore Christmas",
    accent: "teal",
    cards: [
      { label: "Santa", href: "/pages/santa-coloring-pages/", asset: "seasonal/santa.png" },
      { label: "Christmas trees", href: "/pages/christmas-tree-coloring-pages/", asset: "seasonal/tree.png" },
      { label: "Reindeer", href: "/pages/reindeer-coloring-pages/", asset: "seasonal/reindeer.png" },
      { label: "Easy Christmas", href: "/pages/easy-christmas-coloring-pages/", asset: "seasonal/easy-christmas.png" },
    ],
  },
  {
    id: "valentines",
    start: [12, 27],
    end: [2, 15],
    priority: 2,
    title: "Valentine's Day coloring pages",
    blurb: "Hearts, cute animals, and love notes to print and share.",
    href: "/pages/valentines-coloring-pages/",
    cta: "Explore Valentine's",
    accent: "orange",
    cards: [
      { label: "Hearts", href: "/pages/heart-coloring-pages/", asset: "seasonal/hearts.png" },
      { label: "Cute love", href: "/pages/cute-valentine-coloring-pages/", asset: "seasonal/cute-love.png" },
      { label: "Be mine cards", href: "/pages/valentine-cards-coloring-pages/", asset: "seasonal/cards.png" },
      { label: "Easy Valentine", href: "/pages/easy-valentines-coloring-pages/", asset: "seasonal/easy-valentine.png" },
    ],
  },
  {
    id: "easter",
    start: [2, 15],
    end: [4, 21],
    priority: 2,
    title: "Easter coloring pages",
    blurb: "Print bunnies, decorated eggs and spring chicks for Easter activities.",
    href: "/pages/easter-coloring-pages/",
    cta: "Explore Easter",
    accent: "lilac",
    cards: [
      { label: "Easter eggs", href: "/pages/easter-egg-coloring-pages/", asset: "seasonal/eggs.png" },
      { label: "Bunnies", href: "/pages/bunny-coloring-pages/", asset: "seasonal/bunny.png" },
      { label: "Spring chicks", href: "/pages/chick-coloring-pages/", asset: "seasonal/chick.png" },
      { label: "Easy Easter", href: "/pages/easy-easter-coloring-pages/", asset: "seasonal/easy-easter.png" },
    ],
  },
  {
    id: "spring",
    start: [4, 21],
    end: [8, 1],
    priority: 2,
    title: "Spring & summer coloring pages",
    blurb: "Flowers, butterflies, and sunny-day scenes to print.",
    href: "/pages/spring-coloring-pages/",
    cta: "Explore spring",
    accent: "teal",
    cards: [
      { label: "Flowers", href: "/pages/flower-coloring-pages/", asset: "seasonal/flowers.png" },
      { label: "Butterflies", href: "/pages/butterfly-coloring-pages/", asset: "seasonal/butterfly.png" },
      { label: "Beach days", href: "/pages/beach-coloring-pages/", asset: "seasonal/beach.png" },
      { label: "Easy spring", href: "/pages/easy-spring-coloring-pages/", asset: "seasonal/easy-spring.png" },
    ],
  },
];

function inWindow(date: Date, s: Season): boolean {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const cur = m * 100 + d;
  const start = s.start[0] * 100 + s.start[1];
  const end = s.end[0] * 100 + s.end[1];
  // wrap-around window (e.g. Dec 27 -> Feb 15)
  if (start > end) return cur >= start || cur < end;
  return cur >= start && cur < end;
}

/** Returns the highest-priority season active on the given date. */
export function activeSeason(date: Date = new Date()): Season {
  const active = seasons
    .filter((s) => inWindow(date, s))
    .sort((a, b) => b.priority - a.priority);
  return active[0] ?? seasons[0];
}
