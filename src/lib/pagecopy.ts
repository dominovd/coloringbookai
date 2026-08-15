import { buildPages, type Candidate } from "./pagemap";
import { PUBLISHED } from "./taxonomy";

const SMALL = new Set(["for", "and", "the", "of", "to", "a", "in", "on", "with"]);
export function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function h1(c: Candidate): string {
  return titleCase(c.keyword);
}

const intros: Record<string, string> = {
  "christmas-coloring-pages": "Color trees, ornaments, gifts and cozy Christmas scenes made for quiet afternoons and holiday activities.",
  "cute-coloring-pages": "Meet cheerful animals, smiling snacks and playful everyday objects drawn with friendly shapes and expressive faces.",
  "halloween-coloring-pages": "Print pumpkins, friendly ghosts, bats and haunted houses for parties, classrooms or a creative October evening.",
  "unicorn-coloring-pages": "Discover magical unicorns among clouds, stars, rainbows and enchanted gardens, with room for bright color choices.",
  "dinosaur-coloring-pages": "Bring dinosaurs to life in prehistoric landscapes featuring volcanoes, plants and plenty of bold shapes to color.",
  "flower-coloring-pages": "Choose from bouquets, garden blooms and botanical arrangements with petals and leaves suited to varied skill levels.",
  "princess-coloring-pages": "Color original princesses, gowns, castles and royal gardens without licensed characters or copied artwork.",
  "spring-coloring-pages": "Celebrate spring with flowers, butterflies, baby animals and rainy-day scenes inspired by the changing season.",
  "cat-coloring-pages": "Find curious cats napping, playing and exploring cozy rooms, gardens and other familiar places.",
  "easter-coloring-pages": "Get ready for Easter with decorated eggs, spring baskets, cheerful bunnies and newly hatched chicks.",
  "fall-coloring-pages": "Color crisp leaves, pumpkins, woodland animals and harvest scenes that capture the feel of autumn.",
  "mandala-coloring-pages": "Slow down with balanced circular patterns ranging from open floral forms to more intricate geometric designs.",
  "summer-coloring-pages": "Fill beach days, ice cream treats, sunny gardens and outdoor adventures with your favorite summer colors.",
  "winter-coloring-pages": "Print snowy landscapes, warm mittens, woodland animals and indoor scenes for cold-weather creative time.",
  "animal-coloring-pages": "Explore pets, wildlife, farm animals and ocean creatures in clear illustrations made for enjoyable coloring.",
  "dragon-coloring-pages": "Color original dragons flying over mountains, guarding castles and resting in detailed fantasy landscapes.",
  "thanksgiving-coloring-pages": "Set the table for a creative Thanksgiving with turkeys, pumpkins, corn, pies and harvest decorations.",
  "dog-coloring-pages": "Choose playful puppies and friendly dogs in parks, homes and outdoor scenes with recognizable details.",
  "mermaid-coloring-pages": "Dive into original underwater scenes with mermaids, coral reefs, shells, fish and hidden ocean treasures.",
  "valentines-day-coloring-pages": "Create cards and decorations with hearts, flowers and sweet animal scenes for Valentine's Day.",
  "coloring-pages-for-teens": "Try modern rooms, fashion details, nature scenes and expressive patterns with enough detail to stay engaging.",
  "kawaii-coloring-pages": "Color original kawaii food, animals and tiny objects with simple faces, rounded forms and playful details.",
  "anime-coloring-pages": "Practice color choices on original anime-inspired characters, outfits and settings with no franchise artwork.",
  "axolotl-coloring-page": "Color a smiling axolotl swimming among bubbles, water plants, pebbles and small underwater details.",
  "horse-coloring-pages": "Find horses running through meadows, resting near fences and posing in calm countryside scenes.",
  "monster-truck-coloring-pages": "Take on oversized tires, rugged suspension and action scenes featuring original trucks with no brand logos.",
  "car-coloring-pages": "Color sports cars, road scenes and vehicle details drawn with clean lines and easy-to-recognize forms.",
  "detailed-coloring-pages": "Focus on layered animals, botanicals and decorative patterns packed with smaller spaces and fine detail.",
  "stress-relief-coloring-pages": "Unwind with flowing leaves, flowers and repeating shapes arranged into calm, balanced compositions.",
  "mandala-coloring-pages-for-adults": "Settle into intricate floral and geometric mandalas designed for pencils, fine-liners and gel pens.",
  "adult-coloring-pages-to-print": "Relax with detailed interiors, botanicals and decorative scenes created for an unhurried coloring session.",
  "ocean-coloring-pages": "Explore sea turtles, fish, shells, coral and underwater plants in lively ocean scenes.",
  "truck-coloring-pages": "Color work trucks, pickups and countryside roads with clear vehicle details and original designs.",
  "space-coloring-pages": "Travel past rockets, astronauts, planets and moons in playful scenes inspired by space exploration.",
  "food-coloring-pages": "Fill cupcakes, fruit, bakery treats and cheerful kitchen scenes with delicious color combinations.",
  "rainbow-coloring-page": "Use broad bands and large shapes to color a rainbow, clouds, raindrops, stars and simple flowers.",
  "bird-coloring-pages": "Color songbirds, flowering branches, berries and butterflies with natural shapes and feather details.",
  "christmas-coloring-pages-for-adults": "Enjoy detailed wreaths, poinsettias, ornaments and candlelit scenes created for a slower holiday break.",
  "halloween-coloring-pages-for-adults": "Explore intricate pumpkins, gothic florals and atmospheric Halloween details made for adult colorists.",
  "flower-coloring-pages-for-adults": "Work through layered roses, peonies, dahlias and foliage in detailed botanical arrangements.",
  "fall-coloring-pages-for-kids": "Give kids bold pumpkins, large leaves, acorns and friendly woodland animals to color this fall.",
  "summer-coloring-pages-for-kids": "Keep kids busy with simple beaches, sandcastles, sunshine and outdoor summer activities.",
  "thanksgiving-coloring-pages-for-kids": "Print friendly turkeys, harvest baskets and big autumn shapes for an easy Thanksgiving activity.",
  "cute-coloring-pages-for-adults": "Relax with detailed cozy rooms, tiny woodland characters and charming collections of everyday objects.",
  "easy-coloring-pages-for-adults": "Choose elegant flowers and calming motifs with larger spaces, fewer tiny details and clean outlines.",
  "cute-coloring-pages-for-teens": "Color stylish desks, accessories, pets and cozy spaces with a modern look and medium detail.",
  "cute-kawaii-coloring-pages": "Meet smiling desserts, fruit and tiny companions in original kawaii scenes with bold, approachable shapes.",
};

export function metaTitle(c: Candidate): string {
  const title = titleCase(c.keyword);
  const suffix = " | Free Printable PDF";
  return `${title}${suffix}`.slice(0, 60);
}

export function metaDescription(c: Candidate): string {
  const lead = intros[c.slug] ?? `Explore original ${c.keyword} with clear outlines and varied levels of detail.`;
  const full = `${titleCase(c.keyword)}: ${lead} Free PDF for A4 and US Letter.`;
  if (full.length <= 158) return full;
  const shortened = full.slice(0, 155).replace(/\s+\S*$/, "").replace(/[,:;.!?]+$/, "");
  return `${shortened}.`;
}

export function shortAnswer(c: Candidate): string {
  return intros[c.slug] ?? `Explore original ${c.keyword} with clear outlines and a difficulty level suited to ${c.ages.toLowerCase()}.`;
}

export interface ParamRow { label: string; value: string; }
export function params(c: Candidate): ParamRow[] {
  const diff = c.difficulty === "easy" ? "Easy" : c.difficulty === "detailed" ? "Detailed" : "Medium";
  const tools = c.difficulty === "detailed" || c.audience === "adults"
    ? "Fine-liners, colored pencils or gel pens"
    : "Crayons, markers or colored pencils";
  return [
    { label: "Recommended age", value: c.ages },
    { label: "Difficulty", value: diff },
    { label: "Page size", value: "A4 and US Letter" },
    { label: "Print setting", value: "Black and white, 100% scale" },
    { label: "Suggested tools", value: tools },
  ];
}

export const printTips: string[] = [
  "Choose A4 or US Letter and print at 100% scale. Turn off Fit to page to protect the margins.",
  "Use the black-and-white setting. The artwork contains outlines only, so color ink is not needed.",
  "Pick paper of 120 gsm or heavier for markers. Standard printer paper works well with crayons and pencils.",
  "For young children, enlarge simple designs when possible. Bigger spaces are easier to color neatly.",
];

function subjectTip(c: Candidate): { q: string; a: string } {
  if (/mandala|stress relief|detailed/.test(c.keyword)) return {
    q: "Which coloring tools work best for the fine details?",
    a: "Colored pencils, fine-liners and gel pens give you better control in small spaces. Test markers on a spare sheet first.",
  };
  if (/car|truck|monster truck/.test(c.keyword)) return {
    q: "Can I use these vehicle pages for a classroom topic?",
    a: "Yes. The original, logo-free vehicle drawings work well for transport lessons, rainy-day activities and home projects.",
  };
  if (/christmas|halloween|easter|thanksgiving|valentine|spring|summer|fall|winter/.test(c.keyword)) return {
    q: "Can I use the finished pictures as decorations?",
    a: "Yes. Print them on heavier paper, color them, then use them for classroom displays, cards or seasonal decorations.",
  };
  if (/for kids|rainbow|dinosaur|unicorn|princess/.test(c.keyword)) return {
    q: "Are the outlines suitable for younger children?",
    a: "The easier designs use broad outlines and larger spaces. Check the difficulty badge to find the best match for the child.",
  };
  return {
    q: `What is included in this ${c.keyword} collection?`,
    a: `${intros[c.slug] ?? "The collection includes original line art with clear spaces for coloring."} New designs can be added without changing this page address.`,
  };
}

export function faqs(c: Candidate): { q: string; a: string }[] {
  return [
    subjectTip(c),
    { q: "How do I print a page?", a: "Open the design you want, choose Print, then select A4 or US Letter and 100% scale in the printer dialog." },
    { q: "Do I need an account to download the PDF?", a: "No. Browsing, printing and PDF downloads work without registration." },
    { q: "May teachers and families reuse the pages?", a: "Yes. You may print copies for personal, classroom and home-school activities. Do not resell or redistribute the source files." },
  ];
}

export function relatedSearches(c: Candidate, limit = 10): { text: string; href: string | null }[] {
  const head = c.keyword.replace(/ coloring page(s)?$/, "").split(" ").slice(-1)[0];
  const sibs = buildPages()
    .filter((x) => x.slug !== c.slug && x.keyword.includes(head))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit);
  return sibs.map((x) => ({
    text: x.keyword,
    href: PUBLISHED.has(x.slug) ? `/pages/${x.slug}/` : null,
  }));
}
