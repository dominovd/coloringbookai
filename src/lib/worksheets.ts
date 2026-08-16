// ============================================================
// worksheets.ts: the printables side of the site (server-side data)
// ------------------------------------------------------------
// Eight generator pages + one section hub + four category hubs = 13 URLs
// covering ~1.10M available search volume (KD≤35, no AI Overview) per
// worksheets_keywords.csv.
//
// Deliberately NOT built: per-letter subpages (/letter-tracing/a/ … /z/).
// 26 near-identical pages on a domain with Authority Score 2 is exactly the
// thin-page pattern the coloring artwork gate exists to prevent. Revisit only
// if the parent generator proves it can rank.
// ============================================================

export interface Faq { q: string; a: string; }
export interface Example { label: string; href: string; }
export interface GuideBlock { heading: string; body: string; }

export interface Generator {
  slug: string;            // /tools/<slug>/
  nav: string;             // short label
  h1: string;
  title: string;           // <title>
  description: string;     // meta description
  card: string;            // short, unique copy for listing cards
  imageAlt: string;
  /** Two or three paragraphs of real copy for the left column. */
  intro: string[];
  guide: GuideBlock[];
  /** Optional in-depth material for a broad tool query. */
  article?: GuideBlock[];
  /** Keyword-cluster facts, shown as a small stat strip. */
  stats: { keywords: number; volume: number; medKd: number };
  examples: Example[];
  faqs: Faq[];
  /** Sibling tools to cross-link. */
  related: string[];
  /** Category hubs this tool belongs to. */
  hubs: string[];
  phase: 1 | 2;
}

const A = "abcdefghijklmnopqrstuvwxyz";

export const generators: Generator[] = [
  {
    slug: "name-tracing-worksheet",
    nav: "Name tracing",
    h1: "Name tracing worksheet maker",
    title: "Free Name Tracing Worksheets | Printable PDF Maker",
    description:
      "Create a printable name tracing worksheet with dotted letters, ruled handwriting lines, adjustable rows and letter case. Download an A4 or US Letter PDF.",
    card: "Turn any child's name into a ruled practice sheet with adjustable rows, letter case and trace style.",
    imageAlt: "Child tracing a name on ruled handwriting paper",
    intro: [
      "Type a child's name and the worksheet builds itself: dotted letters on proper handwriting rules, ready to print. Nothing to install and no account to create.",
      "Tracing a name is usually the first writing a child does, because the letters already mean something to them. Start with a model row to copy, then let them trace, then leave a blank row to try it alone.",
      "Best for ages 3 to 6. Print on standard paper for pencils, or slide the sheet into a plastic sleeve and use a dry-erase marker to practise the same name over and over.",
    ],
    guide: [
      { heading: "Choose a useful letter format", body: "For a first name sheet, use one capital followed by lowercase letters. That matches the form a child sees on labels, coat pegs and school work. Use all capitals only when simpler straight strokes are genuinely needed." },
      { heading: "Move from tracing to recall", body: "Begin with one model row, continue with two or three dotted rows, then ask the child to write the name on a blank ruled line. This short sequence checks whether the movement was remembered instead of simply copied." },
      { heading: "Keep practice short", body: "Three to five careful attempts are more useful than filling a page with rushed marks. A plastic sleeve and dry-erase pen let families reuse the same sheet while keeping the printed guide clear." },
    ],
    article: [
      { heading: "Why a name works well as a first written word", body: "A young child usually recognises their own name before they can read a sentence. It appears on drawings, bedroom doors, bags and classroom labels, so the letter sequence already has meaning. That familiarity reduces the mental load of deciding what the word says. The child can concentrate on pencil movement, letter order and the shape of each form. Name writing also has an immediate purpose: it lets children identify their work and take ownership of something they made." },
      { heading: "First name, surname or full name", body: "Start with the version the child sees most often. For many preschoolers that is a first name with one capital and the remaining letters in lowercase. Add a surname only when the first name can be copied without losing the baseline or changing letter order. Long double names and full names may need a landscape page or fewer rows so each letter remains large enough to trace comfortably. Teaching one stable version first is less confusing than changing capitals and spacing from sheet to sheet." },
      { heading: "Adjust rows, guides and trace style", body: "The settings should follow the learner rather than their age. Three large rows suit a child who is still controlling broad movements. More rows create smaller letters for a child with steadier fine-motor control. Keep the middle handwriting line visible while lowercase height is inconsistent. Dotted strokes are useful for tracing, while a solid model works for copying onto a blank ruled line. Print a new version with less support once the current page feels easy." },
      { heading: "Set up the page for comfortable writing", body: "Place the paper so the writing hand can move without covering the next letter. A right-handed child may angle the top of the page slightly left; a left-handed child may find a slight right angle more comfortable. Feet should be supported and the forearm should rest on the table. Use a pencil that makes a clear mark without heavy pressure. If fingers become tight or the shoulder lifts, stop and return later instead of asking for another row." },
      { heading: "Make name practice more memorable", body: "The worksheet does not need to be the whole activity. Ask the child to find the first letter on a book cover, build the name with letter tiles or trace it with a finger in sand before using a pencil. After printing, the child can circle the first letter, decorate the page border or write the name on a drawing. These small variations reinforce letter recognition while keeping the actual handwriting task short and focused." },
      { heading: "Know when to move beyond tracing", body: "Tracing has done its job when the child can write the name from a model and then from memory. At that point, reduce the dotted rows instead of making the same worksheet harder. Use blank ruled paper for independent name writing, or move to the letter tracing maker for a specific form that still causes trouble. Older children who already write their name confidently will usually gain more from spelling lists, cursive joins or sentence practice." },
    ],
    stats: { keywords: 784, volume: 213370, medKd: 23 },
    examples: ["Emma", "Liam", "Olivia", "Noah", "Ava", "Sophia", "Jackson", "Mia"].map((n) => ({
      label: n,
      href: `/tools/name-tracing-worksheet/?name=${n}`,
    })),
    faqs: [
      { q: "How do I make a name tracing worksheet?", a: "Type the name in the box, choose how many rows you want, then press Print or Download PDF. The preview updates as you type." },
      { q: "Is it really free?", a: "Yes. There is no account, no watermark and no limit on how many names you make." },
      { q: "Can I print the same name several times?", a: "Yes. The Rows setting repeats the name down the page, from 3 up to 8 rows." },
      { q: "Which letter case should I use for a preschooler?", a: "Start with a capital first letter and lowercase for the rest, the way the name is normally written. All-capitals is easier to trace but has to be un-learned later." },
      { q: "What paper works best?", a: "Ordinary copy paper is fine for pencils. Use 120gsm or heavier if the child presses hard or you want to reuse sheets in a sleeve." },
    ],
    related: ["letter-tracing-worksheet", "word-tracing-worksheet", "cursive-name-tracing"],
    hubs: ["handwriting", "preschool", "tracing"],
    phase: 1,
  },
  {
    slug: "letter-tracing-worksheet",
    nav: "Letter tracing",
    h1: "Letter tracing worksheet maker",
    title: "Free Letter Tracing Worksheets A-Z | Printable PDF",
    description:
      "Build alphabet tracing worksheets for one letter or A-Z. Choose uppercase, lowercase or both, add handwriting guides and download a printable PDF.",
    card: "Practise one troublesome letter or print the full alphabet in uppercase, lowercase or both.",
    imageAlt: "Child tracing alphabet letter shapes beside wooden blocks",
    intro: [
      "Choose a single letter to drill or run the whole alphabet, in capitals, lowercase or both. The sheet redraws instantly and prints on A4 or US Letter.",
      "Children learn letter shapes faster when they trace the same form several times in a row rather than meeting 26 letters at once. Pick the letters in the child's name first because those carry meaning and motivation.",
      "Best for ages 3 to 6, and for older children who need extra practice on a few troublesome letters like b, d, p and q.",
    ],
    guide: [
      { heading: "Start with one letter", body: "A single-letter sheet gives a beginner enough space to notice where the stroke starts and where it changes direction. The whole alphabet option is better for review after individual forms are familiar." },
      { heading: "Separate commonly reversed forms", body: "Letters such as b, d, p and q are easier to compare after each one has been practised alone. Mixing all four on the first sheet can reinforce guessing instead of a reliable movement pattern." },
      { heading: "Use the guide lines deliberately", body: "The top, middle and baseline show letter height. Keep them visible while lowercase size is inconsistent, then remove guides gradually when the child can place letters without help." },
    ],
    stats: { keywords: 1851, volume: 421250, medKd: 21 },
    examples: ["a", "b", "c", "e", "i", "s", "m", "r"].map((l) => ({
      label: `Letter ${l.toUpperCase()}`,
      href: `/tools/letter-tracing-worksheet/?letter=${l}`,
    })),
    faqs: [
      { q: "Can I print the whole alphabet on one sheet?", a: "Yes. Set Letter to “Whole alphabet” and the sheet lays out A to Z in tracing rows." },
      { q: "Uppercase or lowercase first?", a: "Most curricula introduce capitals first because the shapes are simpler, then lowercase, which is what children read most. The Case setting covers all three options." },
      { q: "What are the dashed middle lines for?", a: "They mark the x-height, so a child can see how tall lowercase letters should be relative to capitals. Turn them off once the child writes confidently." },
      { q: "Which letters are hardest?", a: "b, d, p and q get confused because they are the same shape rotated. Drilling them one at a time, well apart, helps more than doing them together." },
      { q: "Can I use this for a classroom?", a: "Yes, print as many copies as you need for home or classroom use." },
    ],
    related: ["name-tracing-worksheet", "number-tracing-worksheet", "prewriting-practice"],
    hubs: ["handwriting", "preschool", "tracing", "kindergarten"],
    phase: 1,
  },
  {
    slug: "cursive-practice-sheets",
    nav: "Cursive practice",
    h1: "Cursive practice sheet maker",
    title: "Free Cursive Practice Sheets | Printable Handwriting PDF",
    description:
      "Create cursive handwriting practice sheets for the alphabet or your own words. Adjust rows, dotted strokes and slant guides, then download a PDF.",
    card: "Make joined handwriting practice from the alphabet, useful words or a spelling list, with optional slant guides.",
    imageAlt: "Student following joined cursive strokes on slanted guide paper",
    intro: [
      "Practise the cursive alphabet or type your own words. The sheet draws dotted cursive letters between handwriting rules so the size and slant stay consistent.",
      "Cursive is usually taught around ages 7 to 9, once printing is comfortable. Work in short sessions on a few connected letters rather than whole pages of the alphabet.",
      "This tool makes practice sheets, not lessons. If you want the letter shapes explained, any handwriting curriculum will cover formation better than a printable can.",
    ],
    guide: [
      { heading: "Practise joins in small groups", body: "Cursive becomes easier when letters with similar movements are grouped together. Work on a few joins such as ar, an or th before moving to full sentences. The goal is an even connection, not speed." },
      { heading: "Use slant guides as feedback", body: "The diagonal guides make inconsistent leaning easy to spot. Keep them on while a learner is establishing rhythm, then print a second version without them to see whether the angle stays steady." },
      { heading: "Choose words that repeat the target", body: "A useful practice list repeats the same join in several real words. Four carefully chosen words usually teach more than copying the entire alphabet with no attention to a particular movement." },
    ],
    stats: { keywords: 999, volume: 270450, medKd: 26 },
    examples: [
      { label: "Full alphabet", href: "/tools/cursive-practice-sheets/?text=alphabet" },
      { label: "Days of the week", href: "/tools/cursive-practice-sheets/?text=Monday%20Tuesday" },
      { label: "Practise “the”", href: "/tools/cursive-practice-sheets/?text=the" },
      { label: "Numbers in words", href: "/tools/cursive-practice-sheets/?text=one%20two%20three" },
    ],
    faqs: [
      { q: "At what age should cursive start?", a: "Most schools introduce it between 7 and 9, after printing is fluent. There is no benefit to starting before a child can print comfortably." },
      { q: "Can I practise my own words?", a: "Yes. Type anything into the text box and the sheet redraws in cursive with guide lines." },
      { q: "What does the slant guide do?", a: "It adds faint diagonal lines so letters lean at a consistent angle, which is what makes cursive look even." },
      { q: "Why is my browser's cursive different from my school's?", a: "The preview uses the script font available on your device, so it will vary a little between computers. The letter proportions and guide lines stay the same." },
      { q: "Is this suitable for adults?", a: "Yes. Adults relearning cursive can use the same sheets with fewer rows and larger text." },
    ],
    related: ["cursive-name-tracing", "word-tracing-worksheet", "name-tracing-worksheet"],
    hubs: ["handwriting"],
    phase: 1,
  },
  {
    slug: "number-tracing-worksheet",
    nav: "Number tracing",
    h1: "Number tracing worksheet maker",
    title: "Free Number Tracing Worksheets 1-100 | Printable PDF",
    description:
      "Create number tracing worksheets from 1-10 through 1-100. Add number words, handwriting guides and a trace style, then print a PDF.",
    card: "Build number practice from 1-10 to 1-100, with optional number words and handwriting guides.",
    imageAlt: "Child tracing dotted numbers with counting blocks nearby",
    intro: [
      "Pick a range from 1 to 10, 1 to 20, 1 to 50 or 1 to 100, and the sheet lays the numbers out in tracing rows. Add the number word to link the digit with how it is written.",
      "Digits have their own reversal traps: 2, 3, 5, 7 and 9 are the ones most often written back to front. Tracing the same digit several times in a row fixes direction faster than mixed practice.",
      "Best for ages 3 to 7. Pair with a letter tracing sheet when a child is ready to practise symbols from both writing systems in one sitting.",
    ],
    guide: [
      { heading: "Match the range to counting skill", body: "Use 1 to 10 until a child can identify each digit and say the sequence without prompting. A crowded 1 to 100 sheet is useful for review, but it gives a beginner too little space for careful formation." },
      { heading: "Teach a consistent starting point", body: "Reversed digits often come from changing the starting position. Ask the child to point to the start before tracing 2, 3, 5, 7 or 9, then repeat the same movement several times." },
      { heading: "Add words after digits are familiar", body: "Number words connect handwriting with early reading, but they add visual load. Begin with digits only and turn words on once the numeral itself is recognised quickly." },
    ],
    stats: { keywords: 267, volume: 44030, medKd: 16 },
    examples: [
      { label: "Numbers 1-10", href: "/tools/number-tracing-worksheet/?range=10" },
      { label: "Numbers 1-20", href: "/tools/number-tracing-worksheet/?range=20" },
      { label: "Numbers 1-50", href: "/tools/number-tracing-worksheet/?range=50" },
      { label: "With number words", href: "/tools/number-tracing-worksheet/?range=10&words=yes" },
    ],
    faqs: [
      { q: "Which range should I start with?", a: "Start with 1 to 10 and only extend once those are formed correctly. Big ranges look impressive but crowd the page." },
      { q: "Should I include number words?", a: "Once a child recognises the digits, yes. Writing “seven” next to 7 links the symbol to the word they hear and read." },
      { q: "Which digits are hardest?", a: "2, 3, 5, 7 and 9 are reversed most often. Practise them individually rather than in a long sequence." },
      { q: "Can I print several copies?", a: "Yes, print as many as you need for home or classroom use." },
    ],
    related: ["letter-tracing-worksheet", "prewriting-practice", "dot-to-dot-printable"],
    hubs: ["preschool", "tracing", "kindergarten"],
    phase: 2,
  },
  {
    slug: "prewriting-practice",
    nav: "Pre-writing lines",
    h1: "Pre-writing practice sheet maker",
    title: "Free Pre-Writing Practice Sheets | Printable Tracing PDF",
    description:
      "Create pre-writing practice sheets with lines, waves, zigzags, arches, loops and spirals. Choose a difficulty and print a preschool PDF.",
    card: "Build fine-motor practice from straight lines, waves, zigzags, arches, loops or a mixed pattern set.",
    imageAlt: "Child tracing waves, zigzags and loops with a chunky crayon",
    intro: [
      "Before letters come strokes. These sheets drill the six shapes every letter is built from: straight lines, waves, zigzags, loops, spirals and arches.",
      "A child who cannot yet control a curve will not form an “s”, no matter how many alphabet sheets you print. Pre-writing patterns build that control without the frustration of getting letters wrong.",
      "Best for ages 2 to 5. Keep sessions short, use a fat pencil or crayon, and let the child trace with a finger first.",
    ],
    guide: [
      { heading: "Follow a simple progression", body: "Begin with horizontal and vertical lines, then introduce arches and waves. Zigzags require sharper direction changes, while loops and spirals ask the hand to cross or continue a curve without stopping." },
      { heading: "Choose a size the child can control", body: "The easy setting gives a young child room to move from the shoulder and elbow. Move to smaller patterns only when the line stays close to the guide without a tight or uncomfortable pencil grip." },
      { heading: "Trace with a finger first", body: "A finger pass lets the child feel the route before controlling a pencil. Say the movement aloud, such as up, down or around, then repeat it with a chunky crayon for a short second pass." },
    ],
    stats: { keywords: 134, volume: 27340, medKd: 13 },
    examples: [
      { label: "Straight lines", href: "/tools/prewriting-practice/?pattern=lines" },
      { label: "Waves", href: "/tools/prewriting-practice/?pattern=waves" },
      { label: "Zigzags", href: "/tools/prewriting-practice/?pattern=zigzag" },
      { label: "Loops", href: "/tools/prewriting-practice/?pattern=loops" },
    ],
    faqs: [
      { q: "What age are pre-writing sheets for?", a: "Roughly 2 to 5, or any child who is not yet forming letters comfortably." },
      { q: "In what order should the patterns come?", a: "Use straight lines first, then arches and waves, followed by zigzags, loops and spirals. This moves from the simplest control to the hardest." },
      { q: "How long should a session be?", a: "A few minutes. Fine-motor work tires small hands quickly, and stopping while it is still fun matters more than finishing the page." },
      { q: "Do these need special pencils?", a: "No, but chunky pencils and crayons are easier for small hands to control than standard pencils." },
    ],
    related: ["letter-tracing-worksheet", "number-tracing-worksheet", "dot-to-dot-printable"],
    hubs: ["preschool", "tracing"],
    phase: 2,
  },
  {
    slug: "word-tracing-worksheet",
    nav: "Word tracing",
    h1: "Word tracing worksheet maker",
    title: "Free Word Tracing Worksheets | Sight Words PDF Maker",
    description:
      "Create word tracing worksheets from a spelling list or common sight words. Add dotted letters and handwriting guides, then download a printable PDF.",
    card: "Turn sight words, weekly spellings or vocabulary into a clean tracing sheet with one word per row.",
    imageAlt: "Child tracing short words beside flash cards and letter shapes",
    intro: [
      "Type your own words or load a ready-made sight-word set. Each word gets its own tracing row with handwriting guide lines.",
      "Sight words are high-frequency words a child should recognise without sounding out each letter, including the, and, said and was. Tracing them combines spelling recall with handwriting practice.",
      "Best for ages 4 to 7, and useful for spelling practice at any age when you want the week's list on one sheet.",
    ],
    guide: [
      { heading: "Keep each list focused", body: "Use five to eight words that belong to the same lesson, story or spelling pattern. A focused list makes it easier to notice what was learned and which word still needs direct teaching." },
      { heading: "Read before tracing", body: "Ask the child to say each word and use it orally before picking up a pencil. Tracing should reinforce a word that has meaning, not become a way to copy an unfamiliar string of letters." },
      { heading: "Finish with one independent attempt", body: "After the dotted row, cover the model and ask for the word once on a blank line or separate paper. That quick recall check is more informative than adding several extra tracing rows." },
    ],
    stats: { keywords: 43, volume: 6990, medKd: 21 },
    examples: [
      { label: "Sight words: level 1", href: "/tools/word-tracing-worksheet/?words=the%20and%20a%20to%20I" },
      { label: "Colour words", href: "/tools/word-tracing-worksheet/?words=red%20blue%20green%20yellow" },
      { label: "Days of the week", href: "/tools/word-tracing-worksheet/?words=Monday%20Tuesday%20Wednesday" },
      { label: "Family words", href: "/tools/word-tracing-worksheet/?words=mum%20dad%20baby%20home" },
    ],
    faqs: [
      { q: "How many words fit on a sheet?", a: "Up to eight words, one per row. Fewer words means bigger letters, which is better for younger children." },
      { q: "What are sight words?", a: "They are common words a child should read instantly instead of decoding letter by letter, such as the, and, said, was and you." },
      { q: "Can I use my child's spelling list?", a: "Yes. Type the week's words and print a sheet that matches the current lesson." },
      { q: "Does it work for other languages?", a: "Any word using the Latin alphabet will render. Accented characters print correctly too." },
    ],
    related: ["name-tracing-worksheet", "letter-tracing-worksheet", "cursive-practice-sheets"],
    hubs: ["handwriting", "kindergarten", "tracing"],
    phase: 2,
  },
  {
    slug: "cursive-name-tracing",
    nav: "Cursive name",
    h1: "Cursive name tracing worksheet maker",
    title: "Free Cursive Name Tracing Worksheets | Printable PDF",
    description:
      "Create a cursive name tracing worksheet with joined dotted letters, ruled rows and optional slant guides. Print an A4 or US Letter PDF.",
    card: "Practise a familiar name in joined cursive with dotted strokes, ruled rows and optional slant guides.",
    imageAlt: "Student practising a joined cursive name on slanted guide paper",
    intro: [
      "Type a name and get it in dotted cursive, on ruled lines with an optional slant guide. Signing your own name is usually the first cursive anyone actually wants to write.",
      "Use it after a child can print their name confidently and has met the basic cursive letter shapes. The joins in a familiar word are much easier to learn than joins in random letter strings.",
      "Best for ages 7 to 10, and for adults practising a tidier signature.",
    ],
    guide: [
      { heading: "Learn the letters before the signature", body: "A name worksheet works best after each cursive letter is recognisable on its own. If one join keeps breaking, practise that pair separately and return to the full name once the movement feels natural." },
      { heading: "Aim for rhythm before speed", body: "Trace slowly enough to keep every letter on the baseline and every join visible. Speed develops after the movement is consistent; pushing it early often produces cramped letters and missing joins." },
      { heading: "Compare two versions", body: "Print one sheet with slant guides and one without. The second version shows whether the learner can keep a consistent angle independently, which is a more useful goal than copying a decorative signature." },
    ],
    stats: { keywords: 41, volume: 3760, medKd: 23 },
    examples: ["Emma", "Liam", "Olivia", "Noah"].map((n) => ({
      label: n,
      href: `/tools/cursive-name-tracing/?name=${n}`,
    })),
    faqs: [
      { q: "When should a child write their name in cursive?", a: "Once they print it confidently and know the basic cursive shapes, usually around 7 to 9." },
      { q: "Does it join the letters?", a: "The sheet renders the name in a connected script face, so the joins are visible as the child traces." },
      { q: "Can adults use it?", a: "Yes. It is a practical way to work on a steadier, more legible signature." },
      { q: "Why does the script look different on my phone?", a: "The preview uses the script font on your device, so it varies slightly. The guide lines and proportions do not." },
    ],
    related: ["cursive-practice-sheets", "name-tracing-worksheet", "word-tracing-worksheet"],
    hubs: ["handwriting"],
    phase: 2,
  },
  {
    slug: "dot-to-dot-printable",
    nav: "Dot to dot",
    h1: "Dot to dot printable maker",
    title: "Free Dot to Dot Printables | Connect the Dots PDF Maker",
    description:
      "Create connect-the-dots printables with a chosen shape and 10 to 40 numbered points. Add an outline hint, then print or download the PDF.",
    card: "Choose a shape and 10 to 40 dots to make a counting puzzle with an optional outline hint.",
    imageAlt: "Child connecting numbered dots to reveal a butterfly outline",
    intro: [
      "Pick a shape, choose how many dots it should have, and print. Fewer dots make an easy puzzle for a preschooler; more dots make a picture that only appears at the end.",
      "Connect-the-dots does two jobs at once: it drills counting in order and it builds the pencil control that handwriting needs. Finish by colouring the shape in.",
      "Best for ages 3 to 8. Set the range to 1-10 for the youngest, then raise the dot count as counting gets fluent.",
    ],
    guide: [
      { heading: "Set dots by counting fluency", body: "Choose 10 dots for a child who is still checking every number. Use 20 or 30 when the sequence is secure, and reserve 40 for children who can scan a busier page without losing their place." },
      { heading: "Decide whether to show the outline", body: "The outline hint supports younger children and anyone working mainly on pencil control. Hide it when the aim is number order and visual problem solving, since the picture should emerge from the completed path." },
      { heading: "Use the finished picture", body: "After the last dot, ask the child to name the shape, strengthen the connecting line and colour the picture. This turns a short counting task into extra fine-motor practice without another worksheet." },
    ],
    stats: { keywords: 428, volume: 108630, medKd: 11 },
    examples: [
      { label: "Star", href: "/tools/dot-to-dot-printable/?shape=star" },
      { label: "Heart", href: "/tools/dot-to-dot-printable/?shape=heart" },
      { label: "Flower", href: "/tools/dot-to-dot-printable/?shape=flower" },
      { label: "Butterfly", href: "/tools/dot-to-dot-printable/?shape=butterfly" },
      { label: "Sun", href: "/tools/dot-to-dot-printable/?shape=sun" },
      { label: "Spiral snail", href: "/tools/dot-to-dot-printable/?shape=spiral" },
    ],
    faqs: [
      { q: "How many dots should I choose?", a: "Ten to twenty for a first puzzle, thirty or more once a child counts confidently. More dots means a clearer picture but a longer task." },
      { q: "Do the numbers have to start at 1?", a: "They always start at 1 and run in order, which is what makes the puzzle work as counting practice." },
      { q: "Can the finished picture be coloured?", a: "Yes. The outline is left clean, so it works as a coloring page once the dots are joined." },
      { q: "What age is connect the dots for?", a: "Roughly 3 to 8, depending on how far the child can count. Match the dot count to that, not to their age." },
    ],
    related: ["number-tracing-worksheet", "prewriting-practice"],
    hubs: ["preschool", "kindergarten"],
    phase: 2,
  },
];

export const generatorBySlug = new Map(generators.map((g) => [g.slug, g]));

/* ---------- category hubs ---------- */

export interface WorksheetHub {
  slug: string;
  h1: string;
  title: string;
  description: string;
  intro: string[];
  guide: GuideBlock[];
}

// Four hubs. Note: their head terms (kindergarten worksheets 18,100/KD55,
// preschool worksheets 9,900/KD42) are out of reach for a young domain.
// these exist to organise the tools and carry internal links, not to rank
// on the head. See the analysis in WORKSHEETS.md §6 (static-or-hub).
export const worksheetHubs: WorksheetHub[] = [
  {
    slug: "handwriting",
    h1: "Handwriting worksheets",
    title: "Free Handwriting Worksheets | Printable PDF Makers",
    description: "Printable handwriting worksheet makers for names, letters, words and cursive. Choose your text, adjust the guides and download a PDF.",
    intro: [
      "Build handwriting practice around text the learner already needs, from a first name and individual letters to spelling words and joined cursive.",
      "Each maker produces a real printable rather than a fixed worksheet. Choose the content, letter style, guide lines and page format, then print only the practice that fits the current lesson.",
    ],
    guide: [
      { heading: "Start with meaningful text", body: "Names and familiar words give beginners a reason to pay attention to each letter. Move to isolated forms when a particular movement or reversal needs focused practice." },
      { heading: "Reduce support gradually", body: "Begin with dotted strokes and handwriting rules. Later, use a model row with blank ruled space so the learner recalls the movement instead of tracing every attempt." },
      { heading: "Protect handwriting quality", body: "Short sessions keep grip and posture from deteriorating. Stop when letters become rushed, then return with a smaller, more focused sheet." },
    ],
  },
  {
    slug: "preschool",
    h1: "Preschool worksheets",
    title: "Free Preschool Worksheets | Printable PDF Makers",
    description: "Printable preschool worksheet makers for pre-writing strokes, letters, numbers and dot to dot. Adjust the level and download a classroom-ready PDF.",
    intro: [
      "These preschool worksheet makers cover the fine-motor steps that come before fluent handwriting: controlled lines and curves, then familiar letters, digits and simple counting paths.",
      "The age label is only a guide. Choose a sheet by what the child can do comfortably, keep the marks large and leave enough white space for a relaxed pencil grip.",
    ],
    guide: [
      { heading: "Begin before letter formation", body: "Lines, arches, waves and loops develop the movements used inside letters. A child can practise these successfully even when alphabet forms still feel too abstract." },
      { heading: "Use larger marks first", body: "Large patterns allow movement from the shoulder and elbow. Smaller handwriting becomes appropriate after the child can follow a broad path without gripping the pencil tightly." },
      { heading: "Mix paper with hands-on play", body: "Threading beads, building with blocks and drawing in sand support the same coordination. A printable works best as one short part of a varied preschool activity." },
    ],
  },
  {
    slug: "kindergarten",
    h1: "Kindergarten worksheets",
    title: "Free Kindergarten Worksheets | Printable PDF Makers",
    description: "Printable kindergarten worksheet makers for alphabet tracing, numbers, sight words and connect the dots. Set the content and download a PDF.",
    intro: [
      "Create kindergarten practice for the exact letters, numbers or words being taught this week instead of printing a generic packet with several unrelated skills.",
      "The tools cover early handwriting, counting order and common words. Settings let families and teachers simplify the page for a beginner or remove guides when independent work is the goal.",
    ],
    guide: [
      { heading: "Match one sheet to one objective", body: "A page for letter formation should not also test spelling and counting. Keeping the objective narrow makes errors easier to notice and feedback easier to understand." },
      { heading: "Choose words the child can read", body: "Tracing supports handwriting, but it does not teach an unknown word by itself. Read each sight word first, discuss its meaning and then trace it." },
      { heading: "Check the final independent mark", body: "End with one letter, number or word written without dots. That attempt shows whether the pattern transferred beyond the tracing guide." },
    ],
  },
  {
    slug: "tracing",
    h1: "Tracing worksheets",
    title: "Free Tracing Worksheets | Printable PDF Makers",
    description: "Printable tracing worksheet makers for names, letters, numbers, words and pre-writing patterns. Choose dotted guides, ruled lines and page format.",
    intro: [
      "Find every tracing maker in one collection, including names, letters, numbers, words and the pre-writing patterns that prepare a hand for those forms.",
      "Tracing is most useful when the guide is matched to a specific movement. Select a small target, watch the starting point and follow with one attempt that does not use dots.",
    ],
    guide: [
      { heading: "Pick the right trace style", body: "Dotted strokes are clear for most learners. A solid model is useful for copying, while ruled blank space checks whether the movement can be produced from memory." },
      { heading: "Watch direction, not only accuracy", body: "A pencil can stay on the dots while moving in an inefficient direction. Point out the starting place and describe the stroke before asking for repeated rows." },
      { heading: "Fade the guide", body: "Move from finger tracing to dotted pencil strokes, then to a copied model and finally an independent attempt. This progression keeps tracing from becoming the only way the learner can write." },
    ],
  },
];

export const hubBySlug = new Map(worksheetHubs.map((h) => [h.slug, h]));

export function generatorsInHub(hub: string): Generator[] {
  return generators.filter((g) => g.hubs.includes(hub));
}

/** Totals shown on the section hub, computed rather than hand-typed. */
export function worksheetTotals() {
  return {
    tools: generators.length,
    keywords: generators.reduce((s, g) => s + g.stats.keywords, 0),
    volume: generators.reduce((s, g) => s + g.stats.volume, 0),
  };
}

export const ALPHABET = A;
