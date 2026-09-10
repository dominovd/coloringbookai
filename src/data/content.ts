// Shared UI content that isn't derived from the pagemap.
import { resolveHub } from "../lib/taxonomy";
import { COLORING_INDEX } from "../lib/urls";

// Hub destinations are resolved against what's actually live, so the artwork
// gate can hold a whole axis back without leaving a 404 in the header.
const adultsHref = resolveHub(["audience", "adults"], ["style", "detailed"], ["style", "mandala"]);
const seasonalHref = resolveHub(["season", "christmas"], ["season", "halloween"], ["season", "winter"]);

export const nav = [
  { label: "Coloring Pages", href: COLORING_INDEX },
  { label: "Worksheets", href: "/worksheets/" },
  { label: "For Adults", href: adultsHref },
  { label: "Seasonal", href: seasonalHref },
  { label: "PDF Builder", href: "/tools/coloring-book-builder/" },
];

export const footerCols = [
  {
    title: "Explore",
    items: [
      { label: "Coloring Pages", href: COLORING_INDEX },
      { label: "Worksheets", href: "/worksheets/" },
      { label: "For Adults", href: adultsHref },
      { label: "Seasonal", href: seasonalHref },
      { label: "New Pages", href: `${COLORING_INDEX}#new-pages` },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "PDF Builder", href: "/tools/coloring-book-builder/" },
      { label: "Name Tracing", href: "/tools/name-tracing-worksheet/" },
      { label: "Letter Tracing", href: "/tools/letter-tracing-worksheet/" },
      { label: "Dot to Dot", href: "/tools/dot-to-dot-printable/" },
      { label: "Custom Name Page", href: "/tools/custom-name-page/" },
      // Guides aren't built yet — re-add when /guides/* exists.
    ],
  },
  {
    title: "About",
    items: [
      { label: "About Us", href: "/about/" },
      { label: "Contact", href: "/contact/" },
      { label: "Privacy Policy", href: "/privacy/" },
      { label: "Terms of Use", href: "/terms/" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "FAQ", href: "/#faq" },
      { label: "Printing help", href: "/#faq" },
      { label: "Support", href: "/contact/" },
    ],
  },
];

export const homeFaqs = [
  { q: "Does printing or downloading cost anything?", a: "No. Open a design and use its print or PDF button without creating an account." },
  { q: "Which paper size should I choose?", a: "The artwork fits both A4 and US Letter paper. Select 100% scale in the print dialog to keep the margins intact." },
  { q: "How can I combine several designs?", a: "Select the pages you like and use the coloring book builder to save them in one PDF." },
  { q: "What should I pick for a young child?", a: "Start with the Easy style or the kids section. These designs have bolder outlines and larger spaces." },
  { q: "What works well for adults?", a: "Try detailed botanicals, mandalas and stress-relief patterns with colored pencils, gel pens or fine-liners." },
  { q: "May I print copies for my class?", a: "Yes. Teachers and home-school families may print the pages for educational activities. Source files may not be resold." },
];
