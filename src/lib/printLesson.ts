// ============================================================
// printLesson.ts — the printable version of a drawing lesson.
// ------------------------------------------------------------
// One source for both lessons. The same document was previously inlined
// verbatim in cat.astro and rose.astro, which is how a single sizing mistake
// shipped twice: the page was declared A4 landscape (277x190mm printable at
// 10mm margins) while the closing artwork was set to height:230mm, so it ran
// 40mm past the sheet and every print came out three pages instead of two.
//
// Two decisions follow from that:
//
//   Portrait, not landscape. Named pages (@page final { size: portrait })
//   would let the steps stay landscape, but support is uneven and a fallback
//   silently reintroduces the overflow. Portrait throughout fits the step grid
//   comfortably (see the arithmetic by .steps) and gives the closing artwork a
//   190mm-wide sheet, which is larger than landscape could offer anyway.
//
//   Nothing is sized to a fixed height. Artwork is capped with max-height and
//   max-width and left to scale, so a future asset of any proportion cannot
//   push past the sheet.
//
// The closing page is the OUTLINE, not the colour illustration: this is a
// colouring site, the page exists to be coloured in by hand, and a full-bleed
// colour sheet would also spend a colour cartridge on something the child is
// about to draw over.
// ============================================================
import { WATERMARK } from "../../site.config.mjs";

/** Replaced with location.origin on the client — a document.write'd window
 *  has no URL of its own, so relative image paths would not resolve. */
export const ORIGIN_TOKEN = "%ORIGIN%";

export interface PrintableLesson {
  title: string;
  steps: string[];
  stepImages: string[];
  /** Clean line art with no instruction banner — the sheet to colour. */
  outline: string;
  outlineTitle: string;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function printDocument(lesson: PrintableLesson): string {
  const figures = lesson.stepImages
    .map(
      (src, i) => `<figure>
      <img src="${ORIGIN_TOKEN}${src}" alt="Step ${i + 1}">
      <figcaption>Step ${i + 1}: ${esc(lesson.steps[i] ?? "")}</figcaption>
    </figure>`,
    )
    .join("");

  // A4 portrait at 10mm margins = 190 x 277mm of printable area.
  //   steps: 2 columns -> 92mm wide, 3:2 art -> 61mm tall, +9mm caption = 70mm
  //          3 rows + 2 gaps = 222mm, plus the 14mm heading = 236mm. Fits.
  //   final: 277mm less the 14mm heading and 8mm lead-in leaves 255mm,
  //          so the 245mm cap can never be the thing that overflows.
  const css = `
    @page { size: A4 portrait; margin: 10mm }
    * { box-sizing: border-box }
    body { font-family: Arial, Helvetica, sans-serif; color: #202030; margin: 0 }
    h1 { text-align: center; font-size: 20pt; margin: 0 0 6mm }
    .steps { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6mm }
    figure { margin: 0; border: 1px solid #dce4eb; border-radius: 4mm; overflow: hidden; break-inside: avoid; page-break-inside: avoid }
    figure img { display: block; width: 100%; aspect-ratio: 3 / 2; object-fit: contain }
    figcaption { padding: 3mm; font-size: 9pt; font-weight: 600 }
    .final { break-before: page; page-break-before: always; text-align: center; padding-top: 8mm }
    .final img { display: block; width: auto; height: auto; max-width: 100%; max-height: 245mm; object-fit: contain; margin: 0 auto }
    .mark { margin-top: 5mm; text-align: center; font-size: 8pt; color: #8a8a99 }
  `;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(lesson.title)}</title>
<style>${css}</style></head>
<body>
  <h1>${esc(lesson.title)}</h1>
  <div class="steps">${figures}</div>
  <p class="mark">${WATERMARK}</p>
  <section class="final">
    <h1>${esc(lesson.outlineTitle)}</h1>
    <img src="${ORIGIN_TOKEN}${lesson.outline}" alt="${esc(lesson.outlineTitle)}">
    <p class="mark">${WATERMARK}</p>
  </section>
</body></html>`;
}
