export type DrawingLesson = {
  slug: string;
  title: string;
  subject: string;
  level: "Easy" | "Medium";
  duration: string;
  description: string;
  steps: string[];
  /** Clean line art with no instruction banner — what actually gets printed
   *  to colour in. Generated from the last step image; the `-final` asset is
   *  the coloured showcase and belongs on screen, not on paper. */
  outline: string;
};

export const catLesson: DrawingLesson = {
  slug: "cat",
  outline: "/images/how-to-draw/cat-outline.webp",
  title: "How to draw a cute cat",
  subject: "Cat",
  level: "Easy",
  duration: "10 min",
  description: "Build a friendly sitting cat from simple shapes, then turn the finished outline into a colouring page.",
  steps: [
    "Draw a circle for the head.",
    "Add the body. Draw a rounded oval below the head.",
    "Add ears and guidelines for the face.",
    "Draw the face.",
    "Add the legs and paws.",
    "Add the tail and final details.",
  ],
};

export const roseLesson: DrawingLesson = {
  slug: "rose",
  outline: "/images/how-to-draw/rose-outline.webp",
  title: "How to draw a rose",
  subject: "Rose",
  level: "Easy",
  duration: "12 min",
  description: "Build a rose petal by petal, then add a stem and leaves.",
  steps: [
    "Draw a small spiral for the center.",
    "Add the inner petals around the spiral.",
    "Draw more petals around the center.",
    "Add the outer petals to complete the flower.",
    "Draw the stem.",
    "Add leaves.",
  ],
};

/** The paths are deliberately grouped by lesson step: the same drawing can later render a tutorial, printable and colouring page. */
export function catSvg(visibleStep = 6, finalOnly = false) {
  const guide = !finalOnly && visibleStep >= 1 ? `<g stroke="#b8a6f0" stroke-width="5" stroke-dasharray="12 12" fill="none" opacity=".85"><ellipse cx="500" cy="390" rx="190" ry="165"/><ellipse cx="510" cy="660" rx="150" ry="200"/></g>` : "";
  const ears = visibleStep >= 2 ? `<path d="M365 275 405 160 465 255M535 255 595 160 635 275"/>` : "";
  const face = visibleStep >= 3 ? `<g><ellipse cx="435" cy="365" rx="12" ry="18" fill="#2b2b3a"/><ellipse cx="565" cy="365" rx="12" ry="18" fill="#2b2b3a"/><path d="M485 410q15 12 30 0M500 390l10 8-10 8"/><path d="M425 425 340 405M425 445l-88 12M575 425l85-20M575 445l88 12"/></g>` : "";
  const paws = visibleStep >= 4 ? `<path d="M405 600v190q0 32 42 32t42-32v-105M595 600v190q0 32-42 32t-42-32v-105M450 735h100"/>` : "";
  const tail = visibleStep >= 5 ? `<path d="M650 745q170 55 155-115-5-70-72-58-35 8-17 47 17 35 57 18"/><path d="M455 520l-24 36M500 535v40M545 520l24 36"/>` : "";
  const outline = visibleStep >= 6 ? `<g><ellipse cx="500" cy="390" rx="190" ry="165"/><ellipse cx="510" cy="660" rx="150" ry="200"/><path d="M366 276q-55 60-44 150 10 95 88 128-40 50-34 146M635 276q55 60 44 150-10 95-88 128 40 50 34 146" opacity=".28"/></g>` : "";
  return `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Step-by-step cat drawing" fill="none" stroke="#2b2b3a" stroke-width="13" stroke-linecap="round" stroke-linejoin="round">${guide}<g id="step-2">${ears}</g><g id="step-3">${face}</g><g id="step-4">${paws}</g><g id="step-5">${tail}</g><g id="step-6">${outline}</g></svg>`;
}

/**
 * `available: false` means the lesson has no page yet. It must stay out of the
 * ItemList JSON-LD and must not render as a link — an entry pointing at
 * /how-to-draw/dragon/ is a 404 handed to Google in structured data.
 */
export const featuredLessons: (Pick<DrawingLesson, "slug" | "title" | "level" | "duration" | "description"> & { available: boolean })[] = [
  { ...catLesson, available: true },
  { ...roseLesson, available: true },
  { slug: "dragon", title: "How to draw a friendly dragon", level: "Medium", duration: "15 min", description: "Use round shapes and a curled tail for a gentle dragon.", available: false },
];
