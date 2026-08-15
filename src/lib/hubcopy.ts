type HubAxis = "subject" | "season" | "audience" | "style";

const copy: Record<string, string> = {
  animals: "Browse printable animal collections featuring pets, wildlife, farm favorites and sea creatures for different ages.",
  flowers: "Find floral and nature coloring sets, from open garden shapes to detailed botanical arrangements for adults.",
  ocean: "Explore printable ocean scenes with sea turtles, fish, mermaids, shells, coral reefs and underwater plants.",
  vehicles: "Choose cars, pickups and monster trucks with clean outlines, original designs and no brand logos.",
  food: "Color fruit, baked treats and cheerful kitchen scenes with easy shapes and playful details.",
  space: "Print rockets, astronauts, planets and stars for creative activities inspired by space exploration.",
  christmas: "Prepare holiday activities with printable trees, ornaments, gifts, winter scenes and detailed Christmas designs.",
  halloween: "Plan October crafts with pumpkins, friendly ghosts and atmospheric Halloween scenes for kids and adults.",
  easter: "Print Easter eggs, bunnies, baskets and spring animals for home, classroom and holiday activities.",
  thanksgiving: "Find turkeys, pumpkins and harvest scenes for Thanksgiving crafts, classroom tables and quiet family time.",
  valentines: "Create Valentine's Day cards and decorations with hearts, flowers and friendly animal illustrations.",
  spring: "Welcome spring with flowers, butterflies, baby animals and rainy-day pictures ready to print and color.",
  summer: "Choose sunny beaches, sandcastles, outdoor adventures and seasonal designs for summer break.",
  fall: "Color pumpkins, autumn leaves, acorns and woodland animals in printable fall collections.",
  winter: "Enjoy snowy landscapes, warm clothing and cozy indoor scenes during cold-weather creative time.",
  toddlers: "Start with large shapes, broad outlines and simple subjects that are easier for small hands to color.",
  kids: "Browse kid-friendly coloring sets organized by subject, season and difficulty for quick activity planning.",
  teens: "Find modern rooms, anime-inspired characters, nature scenes and patterns with engaging medium detail.",
  adults: "Relax with botanical art, mandalas, interiors and intricate seasonal designs made for adult colorists.",
  cute: "Meet friendly animals, smiling food and charming everyday objects in playful original illustrations.",
  kawaii: "Explore original kawaii collections built around rounded shapes, expressive faces and cheerful small details.",
  easy: "Pick simple coloring pages with bold outlines, fewer details and larger open areas.",
  detailed: "Focus on intricate animals, botanicals and patterns with many small spaces for careful coloring.",
  mandala: "Slow down with balanced floral and geometric patterns suited to pencils, gel pens and fine-liners.",
};

export function hubLead(slug: string): string {
  return copy[slug] ?? "Browse original coloring collections organized to help you find the right subject and difficulty.";
}

export function hubMetaDescription(axis: HubAxis, slug: string, label: string): string {
  const lead = hubLead(slug);
  const prefix = axis === "audience" ? `${label} coloring pages. ` : `${label} coloring pages to print. `;
  return `${prefix}${lead} Free PDF downloads.`.slice(0, 150).replace(/\s+\S*$/, "").replace(/[,:;.!?]+$/, "") + ".";
}
