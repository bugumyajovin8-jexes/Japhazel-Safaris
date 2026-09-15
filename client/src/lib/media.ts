/**
 * Curated media library for the marketing site.
 *
 * Two kinds of art live here:
 *
 *  1. `u(id, w)` — photographs served from the Unsplash CDN. Width is a URL
 *     parameter, so we ask for exactly the size a slot needs instead of
 *     shipping one huge file to every device.
 *  2. `/images/...` — photographs bundled into `client/public`, used where we
 *     need a specific subject (a leopard in a tree, elephants under
 *     Kilimanjaro) and want it to keep working with no third party involved.
 *
 * Replacing any photo is a one-line edit here; nothing else references
 * image URLs directly.
 */

export interface Photo {
  slug: string;
  /** ~1100px wide — cards, grid tiles, carousels. */
  src: string;
  /** ~1920px wide — full-bleed sections, hero stills, lightbox. */
  wide: string;
  /** ~500px wide — thumbnails and rails. */
  thumb: string;
  alt: string;
  caption: string;
  category: string;
  /** Average colour, painted while the file downloads. */
  tint: string;
  /** width / height — reserves layout space so the page never jumps. */
  ratio: number;
}

/** Build an Unsplash CDN URL at a given width. */
const u = (id: string, w: number, q = 78) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=${q}&w=${w}`;

/** Shorthand for a photo whose three renditions all come from Unsplash. */
function unsplash(
  id: string,
  opts: {
    slug: string;
    alt: string;
    caption: string;
    category: string;
    tint: string;
    ratio?: number;
  },
): Photo {
  return {
    slug: opts.slug,
    src: u(id, 1100),
    wide: u(id, 1920),
    thumb: u(id, 500, 70),
    alt: opts.alt,
    caption: opts.caption,
    category: opts.category,
    tint: opts.tint,
    ratio: opts.ratio ?? 1.5,
  };
}

/** Shorthand for a photo bundled under client/public/images. */
function local(
  slug: string,
  opts: {
    alt: string;
    caption: string;
    category: string;
    tint: string;
    ratio?: number;
    dir?: string;
  },
): Photo {
  const dir = opts.dir ?? "wildlife";
  return {
    slug,
    src: `/images/${dir}/${slug}-960.webp`,
    wide: `/images/${dir}/${slug}-960.webp`,
    thumb: `/images/${dir}/${slug}-500.webp`,
    alt: opts.alt,
    caption: opts.caption,
    category: opts.category,
    tint: opts.tint,
    ratio: opts.ratio ?? 1.5,
  };
}

/* ------------------------------------------------------------------ *
 * Core photography
 * ------------------------------------------------------------------ */

export const PHOTOS = {
  // --- Landscapes & light -------------------------------------------------
  kilimanjaroPlain: unsplash("photo-1489392191049-fc10c97e64b6", {
    slug: "kilimanjaro-plain",
    alt: "Snow-capped Kilimanjaro rising above an open acacia plain",
    caption: "Kilimanjaro at first light",
    category: "landscapes",
    tint: "#6b7a74",
    ratio: 1.5,
  }),
  acaciaSunset: unsplash("photo-1547471080-7cc2caa01a7e", {
    slug: "acacia-sunset",
    alt: "Lone acacia tree silhouetted against a burning savanna sunset",
    caption: "Sundown on the plains",
    category: "landscapes",
    tint: "#8a5a31",
    ratio: 1.5,
  }),
  acaciaSolitude: unsplash("photo-1516026672322-bc52d61a55d5", {
    slug: "acacia-solitude",
    alt: "A single flat-topped acacia on an empty golden plain at dusk",
    caption: "Nothing but horizon",
    category: "landscapes",
    tint: "#7d6a4d",
    ratio: 1.5,
  }),
  giraffeSunset: unsplash("photo-1523805009345-7448845a9e53", {
    slug: "giraffe-sunset",
    alt: "Giraffe and acacia silhouetted against an orange evening sky",
    caption: "The long walk home",
    category: "landscapes",
    tint: "#a2643a",
    ratio: 1.5,
  }),
  savannaDusk: unsplash("photo-1547970810-dc1eac37d174", {
    slug: "savanna-dusk",
    alt: "Elephant crossing golden grassland in low evening light",
    caption: "Golden hour crossing",
    category: "landscapes",
    tint: "#7a6540",
    ratio: 1.5,
  }),

  // --- Big cats -----------------------------------------------------------
  lionPair: unsplash("photo-1504173010664-32509aeebb62", {
    slug: "lion-pair-grass",
    alt: "A lion and lioness lying together in long green grass",
    caption: "A pride at rest",
    category: "wildlife",
    tint: "#3f4a30",
    ratio: 1.5,
  }),
  lionFace: unsplash("photo-1585468274952-66591eb14165", {
    slug: "lion-face",
    alt: "Close portrait of a male lion staring directly at the camera",
    caption: "Eye to eye",
    category: "wildlife",
    tint: "#4e4032",
    ratio: 1.5,
  }),
  lionWalking: unsplash("photo-1546182990-dffeafbe841d", {
    slug: "lion-walking",
    alt: "Male lion walking through open grassland",
    caption: "On patrol",
    category: "wildlife",
    tint: "#6b6247",
    ratio: 1.5,
  }),
  lionsUnderTree: unsplash("photo-1575550959106-5a7defe28b56", {
    slug: "lions-under-tree",
    alt: "A lion and lioness resting in shade beneath a tree",
    caption: "Out of the midday sun",
    category: "wildlife",
    tint: "#55583a",
    ratio: 1.5,
  }),
  lionWhitePortrait: unsplash("photo-1534188753412-3e26d0d618d6", {
    slug: "lion-portrait-pale",
    alt: "Portrait of a pale-maned lion looking into the distance",
    caption: "The old king",
    category: "wildlife",
    tint: "#7d7059",
    ratio: 1.5,
  }),
  leopardOnRock: unsplash("photo-1534759846116-5799c33ce22a", {
    slug: "leopard-on-rock",
    alt: "Leopard sitting alert on a rocky outcrop",
    caption: "The lookout",
    category: "wildlife",
    tint: "#6d5c4e",
    ratio: 1.5,
  }),

  // --- Local, self-hosted wildlife ---------------------------------------
  lionProwling: local("lion-male-prowling", {
    alt: "Male lion prowling through dry grass in the Serengeti",
    caption: "Serengeti, first light",
    category: "wildlife",
    tint: "#8a6f52",
    ratio: 1.498,
  }),
  lionKing: local("lion-king-serengeti", {
    alt: "Full-maned male lion standing in golden Serengeti grass",
    caption: "Lord of the grass",
    category: "wildlife",
    tint: "#9a7c5a",
    ratio: 1.5,
  }),
  lionPortrait: local("lion-serengeti-portrait", {
    alt: "Male lion lying in grass, watching the horizon",
    caption: "Watching the plain",
    category: "wildlife",
    tint: "#5b4c37",
    ratio: 1.5,
  }),
  lionMara: local("lion-masai-mara", {
    alt: "Male lion in the Masai Mara National Reserve",
    caption: "Masai Mara",
    category: "wildlife",
    tint: "#8f815c",
    ratio: 1.5,
  }),
  lionResting: local("lion-resting-mara", {
    alt: "Lion resting on a grassy mound in the Masai Mara",
    caption: "Afternoon shade",
    category: "wildlife",
    tint: "#87765d",
    ratio: 1.5,
  }),
  lionCub: local("lion-cub-mara", {
    alt: "Lion cub in long grass in the Masai Mara",
    caption: "Next generation",
    category: "wildlife",
    tint: "#91907c",
    ratio: 1.498,
  }),
  lionMane: local("lion-male-mane", {
    alt: "Male lion with a thick dark mane",
    caption: "The mane event",
    category: "wildlife",
    tint: "#7a7369",
    ratio: 1.498,
  }),
  lionFamily: local("lion-family-portrait", {
    alt: "A lion pride resting together in the Masai Mara",
    caption: "Family portrait",
    category: "wildlife",
    tint: "#66553a",
    ratio: 1.5,
  }),
  leopardTree: local("leopard-in-tree-serengeti", {
    alt: "Leopard draped along a bare branch in a Serengeti tree",
    caption: "Leopard in the fig tree",
    category: "wildlife",
    tint: "#7f7971",
    ratio: 1.5,
  }),
  leopardWalking: local("leopard-walking", {
    alt: "Leopard walking through green bush in Kruger",
    caption: "Silent as smoke",
    category: "wildlife",
    tint: "#676859",
    ratio: 1.5,
  }),
  leopardStalking: local("leopard-stalking-grass", {
    alt: "Leopard moving low through long grass",
    caption: "On the hunt",
    category: "wildlife",
    tint: "#6d7161",
    ratio: 1.5,
  }),
  leopardYoung: local("leopard-young-female-tree", {
    alt: "Young female leopard resting in the fork of a tree",
    caption: "Young and watchful",
    category: "wildlife",
    tint: "#717273",
    ratio: 1.5,
  }),
  elephantKilimanjaro: local("elephant-kilimanjaro", {
    alt: "Elephants grazing on the Amboseli marsh below Mount Kilimanjaro",
    caption: "Amboseli, beneath Kilimanjaro",
    category: "wildlife",
    tint: "#647173",
    ratio: 1.502,
  }),
  elephantTusker: local("elephant-tusker-amboseli", {
    alt: "Great tusker elephant with a calf in Amboseli National Park",
    caption: "A great tusker and calf",
    category: "wildlife",
    tint: "#565c56",
    ratio: 1.546,
  }),
  elephantBull: local("elephant-bull-walking", {
    alt: "Elephant bull with long tusks walking across open ground",
    caption: "Right of way",
    category: "wildlife",
    tint: "#8b765b",
    ratio: 1.5,
  }),
  elephantClose: local("elephant-bull-close", {
    alt: "Elephant bull close to the vehicle, ears spread",
    caption: "Close enough",
    category: "wildlife",
    tint: "#68674d",
    ratio: 1.488,
  }),
  elephantWaterhole: local("elephant-family-waterhole", {
    alt: "Elephant family digging for water in a sandy riverbed",
    caption: "Digging for water",
    category: "wildlife",
    tint: "#6f604c",
    ratio: 1.5,
  }),
  elephantDrinking: local("elephant-herd-drinking", {
    alt: "Elephant herd drinking together at a waterhole",
    caption: "The whole herd drinks",
    category: "wildlife",
    tint: "#71685e",
    ratio: 1.624,
  }),
  elephantPlain: local("elephant-herd-plain", {
    alt: "Elephant herd moving across an open green plain",
    caption: "Crossing the plain",
    category: "wildlife",
    tint: "#3e3b2d",
    ratio: 1.333,
  }),

  // --- Other game ---------------------------------------------------------
  elephantsSunrise: unsplash("photo-1564760055775-d63b17a55c44", {
    slug: "elephants-sunrise",
    alt: "Two elephants walking beneath a soft pink sunrise",
    caption: "Dawn on the plain",
    category: "wildlife",
    tint: "#9a7f7c",
    ratio: 1.5,
  }),
  elephantFrontal: unsplash("photo-1557050543-4d5f4e07ef46", {
    slug: "elephant-frontal",
    alt: "Elephant facing the camera head-on in dry grassland",
    caption: "Straight at us",
    category: "wildlife",
    tint: "#7b6e50",
    ratio: 1.5,
  }),
  elephantGrass: unsplash("photo-1535941339077-2dd1c7963098", {
    slug: "elephant-golden-grass",
    alt: "Elephant standing in tall golden grass",
    caption: "Chest-deep in gold",
    category: "wildlife",
    tint: "#8a7148",
    ratio: 1.5,
  }),
  elephantForest: unsplash("photo-1549366021-9f761d450615", {
    slug: "elephant-forest",
    alt: "Elephant emerging from dense green forest",
    caption: "Out of the treeline",
    category: "wildlife",
    tint: "#3c4a2f",
    ratio: 1.5,
  }),
  elephantsHerd: unsplash("photo-1521651201144-634f700b36ef", {
    slug: "elephants-herd-grass",
    alt: "Elephants walking in single file through golden grass",
    caption: "Following the matriarch",
    category: "wildlife",
    tint: "#8b7350",
    ratio: 1.5,
  }),
  zebraGrass: unsplash("photo-1526095179574-86e545346ae6", {
    slug: "zebra-grass",
    alt: "Zebra standing in long grass, looking toward the camera",
    caption: "Stripes in the grass",
    category: "wildlife",
    tint: "#6f6a4c",
    ratio: 1.5,
  }),
  zebraStudy: unsplash("photo-1578326457399-3b34dbbf23b8", {
    slug: "zebra-study",
    alt: "Dramatic study of a zebra against a dark background",
    caption: "No two alike",
    category: "wildlife",
    tint: "#2a2a2a",
    ratio: 1.5,
  }),
  giraffeTree: unsplash("photo-1534567110243-8875d64ca8ff", {
    slug: "giraffe-tree",
    alt: "Giraffe standing beside a broad acacia tree",
    caption: "Room with a view",
    category: "wildlife",
    tint: "#5f6247",
    ratio: 1.5,
  }),
  giraffeClose: unsplash("photo-1547721064-da6cfb341d50", {
    slug: "giraffe-close",
    alt: "Giraffe leaning toward the camera against a clear blue sky",
    caption: "Hello up there",
    category: "wildlife",
    tint: "#7fa3bd",
    ratio: 1.5,
  }),
  rhinoPair: unsplash("photo-1527436826045-8805c615a6df", {
    slug: "rhino-pair",
    alt: "Two white rhinos grazing in open savanna",
    caption: "Rhino, still here",
    category: "wildlife",
    tint: "#7e7452",
    ratio: 1.5,
  }),
  rhinoBush: unsplash("photo-1552410260-0fd9b577afa6", {
    slug: "rhino-bush",
    alt: "Rhinos walking through autumn-coloured bush",
    caption: "Under armed guard",
    category: "wildlife",
    tint: "#7a5c3c",
    ratio: 1.5,
  }),
  antelopeHerd: unsplash("photo-1518709766631-a6a7f45921c3", {
    slug: "antelope-herd",
    alt: "A line of eland antelope crossing golden grassland",
    caption: "Crossing in single file",
    category: "wildlife",
    tint: "#8b7b4e",
    ratio: 1.5,
  }),

  // --- On safari ----------------------------------------------------------
  gameDrive: unsplash("photo-1516426122078-c23e76319801", {
    slug: "game-drive-sunset",
    alt: "Open safari vehicle parked on the plains at sunset",
    caption: "Sundowners, somewhere out there",
    category: "safari",
    tint: "#8d5f34",
    ratio: 1.5,
  }),
  balloons: unsplash("photo-1507608869274-d3177c8bb4c7", {
    slug: "balloon-safari",
    alt: "A sky full of hot air balloons drifting at dawn",
    caption: "Balloon safari at dawn",
    category: "safari",
    tint: "#4aa8c4",
    ratio: 1.5,
  }),
  trekking: unsplash("photo-1621414050946-1b936a78491f", {
    slug: "trekking-ridge",
    alt: "A line of trekkers walking a high ridge in single file",
    caption: "Day four on the mountain",
    category: "safari",
    tint: "#6b6f5c",
    ratio: 1.5,
  }),

  // --- Coast & city -------------------------------------------------------
  beachAerial: unsplash("photo-1538964173425-93884d739596", {
    slug: "beach-aerial",
    alt: "Aerial view of a white sand beach fringed with palms",
    caption: "Barefoot, finally",
    category: "coast",
    tint: "#3fa6a8",
    ratio: 1.5,
  }),
  island: unsplash("photo-1559128010-7c1ad6e1b6a5", {
    slug: "island",
    alt: "A tiny green island surrounded by turquoise water",
    caption: "Your own island, for an afternoon",
    category: "coast",
    tint: "#38a0b4",
    ratio: 1.5,
  }),
  coastAerial: unsplash("photo-1518623489648-a173ef7824f3", {
    slug: "coast-aerial",
    alt: "Aerial view of a rugged coastline meeting turquoise sea",
    caption: "Where the reef begins",
    category: "coast",
    tint: "#3f92a6",
    ratio: 1.5,
  }),
  capeTown: unsplash("photo-1580060839134-75a5edca2e99", {
    slug: "cape-town",
    alt: "Aerial view of Cape Town beneath Table Mountain",
    caption: "Cape Town from the air",
    category: "landscapes",
    tint: "#5b7284",
    ratio: 1.5,
  }),
  winelands: unsplash("photo-1523741543316-beb7fc7023d8", {
    slug: "winelands",
    alt: "Rows of vines running toward green hills in the winelands",
    caption: "Stellenbosch, late afternoon",
    category: "landscapes",
    tint: "#6f8a4a",
    ratio: 1.5,
  }),

  // --- Camps & lodges -----------------------------------------------------
  infinityPool: unsplash("photo-1582719508461-905c673771fd", {
    slug: "infinity-pool",
    alt: "Infinity pool and loungers looking out over open water at sunset",
    caption: "The pool at camp",
    category: "lodges",
    tint: "#6d8a94",
    ratio: 1.5,
  }),
  poolCabana: unsplash("photo-1571003123894-1f0594d2b5d9", {
    slug: "pool-cabana",
    alt: "Curtained cabanas beside a still pool under palms at dusk",
    caption: "Cabanas at dusk",
    category: "lodges",
    tint: "#5d6f84",
    ratio: 1.5,
  }),
  lodgeSuite: unsplash("photo-1611892440504-42a792e24d32", {
    slug: "lodge-suite",
    alt: "Warmly lit timber suite opening onto a garden",
    caption: "Your tent, such as it is",
    category: "lodges",
    tint: "#6a4f36",
    ratio: 1.5,
  }),
  lodgeBedroomView: unsplash("photo-1590490360182-c33d57733427", {
    slug: "lodge-bedroom-view",
    alt: "Bedroom with floor-to-ceiling glass looking onto the bush",
    caption: "Wake up to this",
    category: "lodges",
    tint: "#7d7365",
    ratio: 1.5,
  }),
  lodgeInterior: unsplash("photo-1578683010236-d716f9a3f461", {
    slug: "lodge-interior",
    alt: "Elegant lodge bedroom with a large bed and warm lamplight",
    caption: "Turn-down service, in the bush",
    category: "lodges",
    tint: "#6a5c4c",
    ratio: 1.5,
  }),
  lodgeTerrace: unsplash("photo-1445019980597-93fa8acb246c", {
    slug: "lodge-terrace",
    alt: "Loungers on a terrace looking out over a wide valley",
    caption: "Afternoon on the deck",
    category: "lodges",
    tint: "#7d7f7a",
    ratio: 1.5,
  }),
  resortPool: unsplash("photo-1571896349842-33c89424de2d", {
    slug: "resort-pool",
    alt: "Palm-fringed resort pool at twilight",
    caption: "The last night",
    category: "lodges",
    tint: "#5d6d80",
    ratio: 1.5,
  }),
  lodgeDining: unsplash("photo-1596701062351-8c2c14d1fdd0", {
    slug: "lodge-dining",
    alt: "Breakfast laid out on a table with juice and fresh food",
    caption: "Breakfast, served late",
    category: "lodges",
    tint: "#9a8f7c",
    ratio: 1.5,
  }),
  bedroomLight: unsplash("photo-1584132905271-512c958d674a", {
    slug: "bedroom-light",
    alt: "Bright bedroom with polished floors and open curtains",
    caption: "Light through the canvas",
    category: "lodges",
    tint: "#8b8378",
    ratio: 1.5,
  }),
  suiteView: unsplash("photo-1551882547-ff40c63fe5fa", {
    slug: "suite-view",
    alt: "Suite with a wall of glass opening onto the landscape",
    caption: "Nothing between you and it",
    category: "lodges",
    tint: "#7a7468",
    ratio: 1.5,
  }),

  // --- Buffalo, cheetah, and the rest of the game ------------------------
  buffaloHerd: local("buffalo-herd-grass", {
    alt: "Cape buffalo herd grazing in long grass",
    caption: "A herd that runs to hundreds",
    category: "wildlife",
    tint: "#52533d",
    ratio: 1.5,
  }),
  buffaloBull: local("buffalo-bull", {
    alt: "Old cape buffalo bull standing alone in dry grass",
    caption: "The one to respect",
    category: "wildlife",
    tint: "#8e886f",
    ratio: 1.778,
  }),
  buffaloHeadOn: local("buffalo-head-on", {
    alt: "Cape buffalo facing the camera with heavy curved horns",
    caption: "Full-frontal buffalo",
    category: "wildlife",
    tint: "#6a5f56",
    ratio: 1.399,
  }),
  cheetahMara: local("cheetah-mara", {
    alt: "Cheetah standing on a fallen log scanning the plain",
    caption: "Cheetah on the lookout",
    category: "wildlife",
    tint: "#564d36",
    ratio: 1.5,
  }),
  cheetahStalking: local("cheetah-stalking", {
    alt: "Cheetah moving low through green grass",
    caption: "Built for one thing",
    category: "wildlife",
    tint: "#5a5c43",
    ratio: 1.5,
  }),
  cheetahFamily: local("cheetah-family", {
    alt: "A cheetah mother and two cubs crossing open ground",
    caption: "Mother and cubs",
    category: "wildlife",
    tint: "#686b4d",
    ratio: 1.5,
  }),
  cheetahRunning: local("cheetah-running", {
    alt: "Cheetah at full stretch across the savanna",
    caption: "Nought to sixty",
    category: "wildlife",
    tint: "#534c36",
    ratio: 1.5,
  }),
  balloonLanding: local("balloon-landing-serengeti", {
    alt: "Hot air balloon coming down beside waiting safari vehicles",
    caption: "Touchdown, breakfast next",
    category: "safari",
    tint: "#807a6f",
    ratio: 1.5,
  }),
  balloonSerengeti: local("balloon-over-serengeti", {
    alt: "Hot air balloon drifting low over the Serengeti plain",
    caption: "Over the Serengeti",
    category: "safari",
    tint: "#827a68",
    ratio: 1.778,
  }),
  sunriseBeams: local("serengeti-sunrise-beams", {
    alt: "Sunbeams breaking over the Serengeti at dawn",
    caption: "First light",
    category: "landscapes",
    tint: "#76614f",
    ratio: 1.778,
  }),
  flamingos: local("flamingos-lake-nakuru", {
    alt: "Lesser flamingos wading in the shallows of Lake Nakuru",
    caption: "Flamingos at Nakuru",
    category: "wildlife",
    tint: "#5d6572",
    ratio: 1.5,
  }),
  roller: local("lilac-breasted-roller", {
    alt: "Lilac-breasted roller perched on a thorn branch",
    caption: "The lilac-breasted roller",
    category: "wildlife",
    tint: "#616d2e",
    ratio: 1.5,
  }),
  rollerFlight: local("roller-in-flight", {
    alt: "Lilac-breasted roller in flight with wings spread",
    caption: "Colour in flight",
    category: "wildlife",
    tint: "#968468",
    ratio: 1.5,
  }),
  fishEagle: local("african-fish-eagle", {
    alt: "African fish eagle perched above the water",
    caption: "The fish eagle's call",
    category: "wildlife",
    tint: "#58593f",
    ratio: 1.5,
  }),
  maasaiDance: local("maasai-jumping-dance", {
    alt: "Maasai men performing the adumu jumping dance",
    caption: "The adumu",
    category: "people",
    tint: "#67534e",
    ratio: 1.502,
  }),
  maasaiGathering: local("maasai-gathering", {
    alt: "Maasai community gathered in red shukas beneath acacia trees",
    caption: "Visiting the manyatta",
    category: "people",
    tint: "#75504a",
    ratio: 1.5,
  }),
  samburuWomen: local("samburu-women-dancing", {
    alt: "Samburu women in beaded collars performing a neck dance",
    caption: "Samburu beadwork",
    category: "people",
    tint: "#433b3c",
    ratio: 1.505,
  }),
  victoriaFalls: local("victoria-falls-wide", {
    alt: "Victoria Falls in full flow across the Zambezi gorge",
    caption: "The smoke that thunders",
    category: "landscapes",
    tint: "#6e6c65",
    ratio: 1.5,
  }),
  victoriaRainbow: local("victoria-falls-rainbow", {
    alt: "A rainbow arcing through the spray at Victoria Falls",
    caption: "Rainbow in the spray",
    category: "landscapes",
    tint: "#1b1b19",
    ratio: 1.5,
  }),
  victoriaGorge: local("victoria-falls-gorge", {
    alt: "The gorge below Victoria Falls with water pouring over the lip",
    caption: "Into the gorge",
    category: "landscapes",
    tint: "#7e888d",
    ratio: 1.333,
  }),
  safariVehicleAcacia: local("safari-vehicle-acacia", {
    alt: "Safari vehicle parked beneath a flat-topped acacia",
    caption: "Lunch under an acacia",
    category: "safari",
    tint: "#7e7a6b",
    ratio: 1.5,
  }),
  gameDrivePlains: local("game-drive-plains", {
    alt: "Game drive vehicle on the open plains among grazing herds",
    caption: "Out on the plains",
    category: "safari",
    tint: "#77746f",
    ratio: 1.611,
  }),
  safariVehicle: local("safari-vehicle-serengeti", {
    alt: "Open-sided safari vehicle on a Serengeti track",
    caption: "Your vehicle, your call",
    category: "safari",
    tint: "#727d88",
    ratio: 1.333,
  }),
  giraffeSerengeti: local("giraffe-masai-serengeti", {
    alt: "Masai giraffe standing in golden Serengeti grass",
    caption: "Masai giraffe",
    category: "wildlife",
    tint: "#a18a68",
    ratio: 1.5,
  }),
  giraffeBrowsing: local("giraffe-browsing", {
    alt: "Giraffe browsing the top of a thorn tree",
    caption: "Browsing the treetops",
    category: "wildlife",
    tint: "#918e7d",
    ratio: 1.5,
  }),
  giraffeAmboseli: local("giraffe-amboseli-sunset", {
    alt: "Giraffe silhouetted against an Amboseli sunset",
    caption: "Amboseli sunset",
    category: "landscapes",
    tint: "#4e4232",
    ratio: 1.426,
  }),
  hippoPod: local("hippo-pod", {
    alt: "A pod of hippos crowded together in shallow water",
    caption: "The pod",
    category: "wildlife",
    tint: "#584f4f",
    ratio: 1.5,
  }),
  hippoYawn: local("hippo-yawning-zambezi", {
    alt: "Hippo yawning wide in the Zambezi",
    caption: "A warning, not a yawn",
    category: "wildlife",
    tint: "#989da8",
    ratio: 1.5,
  }),
  gorilla: local("mountain-gorilla", {
    alt: "Mountain gorilla sitting in dense green vegetation",
    caption: "Mountain gorilla, Bwindi",
    category: "wildlife",
    tint: "#3f4734",
    ratio: 1.5,
  }),
  gorillaJuvenile: local("gorilla-juvenile", {
    alt: "Juvenile mountain gorilla resting in the foliage",
    caption: "Two years old",
    category: "wildlife",
    tint: "#5d5f44",
    ratio: 1.5,
  }),
  chimpanzee: local("chimpanzee", {
    alt: "Chimpanzee among green leaves in the forest",
    caption: "Chimpanzee, Gombe",
    category: "wildlife",
    tint: "#5d6c4f",
    ratio: 1.493,
  }),
  blackRhino: local("black-rhino-grass", {
    alt: "Black rhinoceros walking through golden grass",
    caption: "Black rhino",
    category: "wildlife",
    tint: "#7f7f80",
    ratio: 1.5,
  }),
  blackRhinoCrater: local("black-rhino-ngorongoro", {
    alt: "Black rhino grazing on the floor of the Ngorongoro Crater",
    caption: "Ngorongoro's rhino",
    category: "wildlife",
    tint: "#a09081",
    ratio: 1.5,
  }),
  whiteRhino: local("white-rhino", {
    alt: "White rhinoceros grazing in open bush",
    caption: "White rhino",
    category: "wildlife",
    tint: "#67604a",
    ratio: 1.5,
  }),
  maraCrossing: local("wildebeest-mara-crossing", {
    alt: "Wildebeest leaping into the Mara River during the crossing",
    caption: "The Mara crossing",
    category: "wildlife",
    tint: "#857a70",
    ratio: 1.644,
  }),
  migrationHerds: local("great-migration-herds", {
    alt: "Vast wildebeest herds spread across the northern Serengeti",
    caption: "The Great Migration",
    category: "wildlife",
    tint: "#716d4a",
    ratio: 1.5,
  }),
  migrationRiver: local("migration-river", {
    alt: "Wildebeest surging through a river during the migration",
    caption: "Committing to the water",
    category: "wildlife",
    tint: "#5a534e",
    ratio: 1.404,
  }),
  zebraPortrait: local("zebra-portrait-mara", {
    alt: "Close portrait of a zebra in the Masai Mara",
    caption: "No two alike",
    category: "wildlife",
    tint: "#887552",
    ratio: 1.505,
  }),
  zebraPair: local("zebra-pair-plains", {
    alt: "Two zebras standing together on the open plains",
    caption: "Watching each other's backs",
    category: "wildlife",
    tint: "#6a694f",
    ratio: 1.5,
  }),
  zebraHerd: local("zebra-herd-mara", {
    alt: "Zebra herd grazing in the Masai Mara",
    caption: "Zebra, everywhere",
    category: "wildlife",
    tint: "#62563b",
    ratio: 1.5,
  }),

  // --- People -------------------------------------------------------------
  guideCulture: unsplash("photo-1547036967-23d11aacaee0", {
    slug: "guide-culture",
    alt: "Traveller standing on a ridge looking out over a wide landscape",
    caption: "Just stop and look",
    category: "people",
    tint: "#8a6a58",
    ratio: 1.5,
  }),
} satisfies Record<string, Photo>;

/* ------------------------------------------------------------------ *
 * Hero reel
 * ------------------------------------------------------------------ */

export interface HeroSlide {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
  eyebrow: string;
  title: string;
  place: string;
  tint?: string;
  /** CSS object-position — keeps the subject in frame on portrait screens. */
  focal?: string;
}

/**
 * Stills first — they carry the reel on phones, where the videos are skipped.
 * `victoria-falls` and `zanzibar-beach` are swapped for the bundled MP4s by
 * the Hero component.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "elephants-dawn",
    focal: "center 55%",
    type: "image",
    src: PHOTOS.elephantsSunrise.wide,
    alt: PHOTOS.elephantsSunrise.alt,
    eyebrow: "Amboseli, Kenya",
    title: "Elephants at dawn",
    place: "Beneath Kilimanjaro",
    tint: PHOTOS.elephantsSunrise.tint,
  },
  {
    id: "lion-serengeti",
    focal: "center 45%",
    type: "image",
    src: PHOTOS.lionKing.wide,
    alt: PHOTOS.lionKing.alt,
    eyebrow: "Serengeti, Tanzania",
    title: "The lion king",
    place: "Seronera Valley",
    tint: PHOTOS.lionKing.tint,
  },
  {
    id: "game-drive",
    focal: "center 50%",
    type: "image",
    src: PHOTOS.gameDrive.wide,
    alt: PHOTOS.gameDrive.alt,
    eyebrow: "Masai Mara, Kenya",
    title: "Sundowners on the plains",
    place: "Mara North Conservancy",
    tint: PHOTOS.gameDrive.tint,
  },
  {
    id: "victoria-falls",
    type: "video",
    src: "",
    poster: PHOTOS.acaciaSunset.wide,
    eyebrow: "Zambezi River",
    title: "Victoria Falls",
    place: "Zimbabwe & Zambia",
    tint: "#2f4038",
  },
  {
    id: "balloon-dawn",
    focal: "center 45%",
    type: "image",
    src: PHOTOS.balloonSerengeti.wide,
    alt: PHOTOS.balloonSerengeti.alt,
    eyebrow: "Serengeti, Tanzania",
    title: "Balloon safari at first light",
    place: "Over the migration",
    tint: PHOTOS.balloonSerengeti.tint,
  },
  {
    id: "leopard-tree",
    focal: "72% 40%",
    type: "image",
    src: PHOTOS.leopardTree.wide,
    alt: PHOTOS.leopardTree.alt,
    eyebrow: "Serengeti, Tanzania",
    title: "Leopard in the fig tree",
    place: "Seronera",
    tint: PHOTOS.leopardTree.tint,
  },
  {
    id: "zanzibar-beach",
    type: "video",
    src: "",
    poster: PHOTOS.beachAerial.wide,
    eyebrow: "Zanzibar",
    title: "The Indian Ocean finish",
    place: "Nungwi & Paje",
    tint: "#2b6f7a",
  },
  {
    id: "kilimanjaro",
    focal: "center 45%",
    type: "image",
    src: PHOTOS.elephantKilimanjaro.wide,
    alt: PHOTOS.elephantKilimanjaro.alt,
    eyebrow: "Amboseli, Kenya",
    title: "Under the mountain",
    place: "Amboseli marshes",
    tint: PHOTOS.elephantKilimanjaro.tint,
  },
{
    id: "mara-crossing",
    type: "image",
    focal: "center 50%",
    src: PHOTOS.maraCrossing.wide,
    alt: PHOTOS.maraCrossing.alt,
    eyebrow: "Mara River, Kenya",
    title: "The crossing",
    place: "July to October",
    tint: PHOTOS.maraCrossing.tint,
  },
  {
    id: "maasai",
    type: "image",
    focal: "center 40%",
    src: PHOTOS.maasaiDance.wide,
    alt: PHOTOS.maasaiDance.alt,
    eyebrow: "Loita Hills, Kenya",
    title: "The adumu",
    place: "Maasai community visit",
    tint: PHOTOS.maasaiDance.tint,
  },
  {
    id: "cheetah",
    type: "image",
    focal: "center 45%",
    src: PHOTOS.cheetahMara.wide,
    alt: PHOTOS.cheetahMara.alt,
    eyebrow: "Masai Mara, Kenya",
    title: "Cheetah on the lookout",
    place: "Naboisho Conservancy",
    tint: PHOTOS.cheetahMara.tint,
  },
];

/* ------------------------------------------------------------------ *
 * Destinations
 * ------------------------------------------------------------------ */

export interface Destination {
  slug: string;
  name: string;
  country: string;
  blurb: string;
  href: string;
  src: string;
  wide: string;
  alt: string;
  tint: string;
}

const dest = (
  photo: Photo,
  d: Omit<Destination, "src" | "wide" | "alt" | "tint">,
): Destination => ({
  ...d,
  src: photo.src,
  wide: photo.wide,
  alt: photo.alt,
  tint: photo.tint,
});

export const DESTINATIONS: Destination[] = [
  dest(PHOTOS.lionProwling, {
    slug: "serengeti",
    name: "The Serengeti",
    country: "Tanzania",
    blurb:
      "Endless plains, the Great Migration, and the densest concentration of big cats anywhere on earth.",
    href: "/tours",
  }),
  dest(PHOTOS.elephantKilimanjaro, {
    slug: "amboseli",
    name: "Amboseli",
    country: "Kenya",
    blurb: "Great tuskers on the marsh, with Kilimanjaro filling the sky behind them.",
    href: "/tours",
  }),
  dest(PHOTOS.maraCrossing, {
    slug: "masai-mara",
    name: "Masai Mara",
    country: "Kenya",
    blurb: "River crossings, private conservancies, and off-road access others do not get.",
    href: "/tours",
  }),
  dest(PHOTOS.beachAerial, {
    slug: "zanzibar",
    name: "Zanzibar",
    country: "Tanzania",
    blurb: "Stone Town spice markets, dhow sunsets, and a reef that earns the flight.",
    href: "/tours",
  }),
  dest(PHOTOS.capeTown, {
    slug: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    blurb: "Table Mountain, the Cape peninsula, and the winelands an hour inland.",
    href: "/tours",
  }),
  dest(PHOTOS.victoriaRainbow, {
    slug: "victoria-falls",
    name: "Victoria Falls",
    country: "Zimbabwe & Zambia",
    blurb: "The smoke that thunders — best seen from a helicopter, then a sunset cruise.",
    href: "/tours",
  }),
];

/* ------------------------------------------------------------------ *
 * Big Five
 * ------------------------------------------------------------------ */

export interface BigFiveEntry {
  slug: string;
  name: string;
  latin: string;
  blurb: string;
  bestIn: string;
  odds: string;
  src: string;
  wide: string;
  thumb: string;
  alt: string;
  tint: string;
}

const five = (
  photo: Photo,
  d: Omit<BigFiveEntry, "src" | "wide" | "thumb" | "alt" | "tint">,
): BigFiveEntry => ({
  ...d,
  src: photo.src,
  wide: photo.wide,
  thumb: photo.thumb,
  alt: photo.alt,
  tint: photo.tint,
});

export const BIG_FIVE: BigFiveEntry[] = [
  five(PHOTOS.lionKing, {
    slug: "lion",
    name: "Lion",
    latin: "Panthera leo",
    blurb:
      "The Serengeti and Mara hold prides twenty strong. Go out at first light and you will usually find them before they find shade.",
    bestIn: "Serengeti",
    odds: "Very high",
  }),
  five(PHOTOS.leopardTree, {
    slug: "leopard",
    name: "Leopard",
    latin: "Panthera pardus",
    blurb:
      "The hardest of the five and the most rewarding. Look up: a kill hauled into a sausage tree is the usual giveaway.",
    bestIn: "Seronera & Kruger",
    odds: "Moderate",
  }),
  five(PHOTOS.elephantTusker, {
    slug: "elephant",
    name: "African Elephant",
    latin: "Loxodonta africana",
    blurb:
      "Amboseli's great tuskers are among the last of their kind — bulls carrying ivory that nearly reaches the ground.",
    bestIn: "Amboseli",
    odds: "Near certain",
  }),
  five(PHOTOS.blackRhinoCrater, {
    slug: "rhino",
    name: "Rhinoceros",
    latin: "Diceros & Ceratotherium",
    blurb:
      "Ngorongoro Crater still shelters a small black rhino population, watched around the clock by armed rangers.",
    bestIn: "Ngorongoro",
    odds: "Low to moderate",
  }),
  five(PHOTOS.buffaloBull, {
    slug: "buffalo",
    name: "Cape Buffalo",
    latin: "Syncerus caffer",
    blurb:
      "Herds run to hundreds and old bulls travel alone. Guides will tell you these are the ones to respect most.",
    bestIn: "Everywhere",
    odds: "Near certain",
  }),
];

/* ------------------------------------------------------------------ *
 * Signature experiences
 * ------------------------------------------------------------------ */

export interface Experience {
  slug: string;
  title: string;
  place: string;
  body: string;
  points: string[];
  wide: string;
  alt: string;
  tint: string;
}

export const EXPERIENCES: Experience[] = [
  {
    slug: "balloon",
    title: "Float over the Serengeti before sunrise",
    place: "Serengeti, Tanzania",
    body: "You lift off in the dark and watch the plain come up gold beneath you — herds scattering, the shadow of the balloon running ahead. You land to a table set with linen and a champagne breakfast in the middle of nowhere.",
    points: [
      "Dawn launch, roughly one hour aloft",
      "Champagne bush breakfast on landing",
      "Flight certificate and transfers included",
    ],
    wide: PHOTOS.balloonSerengeti.wide,
    alt: PHOTOS.balloonSerengeti.alt,
    tint: PHOTOS.balloonSerengeti.tint,
  },
  {
    slug: "migration",
    title: "Sit with the migration as it crosses",
    place: "Mara River, Kenya",
    body: "Between July and October the herds stack up on the riverbank, hesitating for hours. We time camps to the crossing points and park early, so when it finally goes you are already there.",
    points: [
      "Camps moved seasonally to follow the herds",
      "Private vehicle — you decide when to leave",
      "Guides in radio contact across the reserve",
    ],
    wide: PHOTOS.maraCrossing.wide,
    alt: PHOTOS.maraCrossing.alt,
    tint: PHOTOS.maraCrossing.tint,
  },
  {
    slug: "camps",
    title: "Sleep where the only sound is outside",
    place: "Private conservancies",
    body: "Canvas with a proper bed, hot water, and a deck facing the waterhole. Most of our camps sit on community-owned conservancies, so the fees go to the people who live alongside the wildlife.",
    points: [
      "Tented camps and permanent lodges",
      "Most properties under twelve rooms",
      "Conservancy fees fund ranger patrols",
    ],
    wide: PHOTOS.lodgeBedroomView.wide,
    alt: PHOTOS.lodgeBedroomView.alt,
    tint: PHOTOS.lodgeBedroomView.tint,
  },
  {
    slug: "coast",
    title: "Finish barefoot on the Indian Ocean",
    place: "Zanzibar, Tanzania",
    body: "After a week of five o'clock starts, the coast is the point. Stone Town for a day, then north to Nungwi where the reef is twenty metres off the sand and nothing is scheduled.",
    points: [
      "Direct flights from the Serengeti airstrips",
      "Stone Town spice tour and dhow sunset",
      "Diving, kite-surfing, or nothing at all",
    ],
    wide: PHOTOS.beachAerial.wide,
    alt: PHOTOS.beachAerial.alt,
    tint: PHOTOS.beachAerial.tint,
  },
];

/* ------------------------------------------------------------------ *
 * Gallery + page furniture
 * ------------------------------------------------------------------ */

/** Everything worth showing in the gallery grid, ordered for visual rhythm. */
export const GALLERY: Photo[] = [
  PHOTOS.lionKing,
  PHOTOS.elephantKilimanjaro,
  PHOTOS.maraCrossing,
  PHOTOS.balloonLanding,
  PHOTOS.leopardTree,
  PHOTOS.gameDrive,
  PHOTOS.cheetahMara,
  PHOTOS.giraffeSunset,
  PHOTOS.elephantsSunrise,
  PHOTOS.zebraPortrait,
  PHOTOS.lionFace,
  PHOTOS.victoriaRainbow,
  PHOTOS.beachAerial,
  PHOTOS.maasaiDance,
  PHOTOS.elephantTusker,
  PHOTOS.acaciaSunset,
  PHOTOS.leopardOnRock,
  PHOTOS.blackRhino,
  PHOTOS.lodgeBedroomView,
  PHOTOS.migrationHerds,
  PHOTOS.giraffeClose,
  PHOTOS.lionCub,
  PHOTOS.infinityPool,
  PHOTOS.buffaloHerd,
  PHOTOS.roller,
  PHOTOS.lionPair,
  PHOTOS.elephantForest,
  PHOTOS.kilimanjaroPlain,
  PHOTOS.leopardStalking,
  PHOTOS.hippoYawn,
  PHOTOS.zebraGrass,
  PHOTOS.island,
  PHOTOS.lionFamily,
  PHOTOS.elephantBull,
  PHOTOS.capeTown,
  PHOTOS.gorilla,
  PHOTOS.lionMane,
  PHOTOS.poolCabana,
  PHOTOS.whiteRhino,
  PHOTOS.giraffeTree,
  PHOTOS.lionProwling,
  PHOTOS.flamingos,
  PHOTOS.elephantWaterhole,
  PHOTOS.acaciaSolitude,
  PHOTOS.leopardWalking,
  PHOTOS.lodgeSuite,
  PHOTOS.elephantsHerd,
  PHOTOS.samburuWomen,
  PHOTOS.coastAerial,
  PHOTOS.lionResting,
  PHOTOS.cheetahFamily,
  PHOTOS.trekking,
  PHOTOS.elephantPlain,
  PHOTOS.winelands,
  PHOTOS.lodgeDining,
  PHOTOS.safariVehicle,
  PHOTOS.lionMara,
  PHOTOS.elephantClose,
  PHOTOS.leopardYoung,
  PHOTOS.savannaDusk,
  PHOTOS.balloonSerengeti,
  PHOTOS.lodgeTerrace,
  PHOTOS.elephantFrontal,
  PHOTOS.buffaloHeadOn,
  PHOTOS.lionPortrait,
  PHOTOS.resortPool,
  PHOTOS.elephantGrass,
  PHOTOS.lionWalking,
  PHOTOS.suiteView,
  PHOTOS.victoriaFalls,
  PHOTOS.giraffeSerengeti,
  PHOTOS.hippoPod,
  PHOTOS.cheetahStalking,
  PHOTOS.zebraPair,
  PHOTOS.antelopeHerd,
  PHOTOS.fishEagle,
  PHOTOS.maasaiGathering,
  PHOTOS.gorillaJuvenile,
  PHOTOS.rhinoBush,
  PHOTOS.sunriseBeams,
  PHOTOS.giraffeAmboseli,
  PHOTOS.zebraHerd,
  PHOTOS.migrationRiver,
  PHOTOS.buffaloBull,
  PHOTOS.chimpanzee,
  PHOTOS.rollerFlight,
  PHOTOS.victoriaGorge,
  PHOTOS.zebraStudy,
  PHOTOS.cheetahRunning,
  PHOTOS.giraffeBrowsing,
  PHOTOS.gameDrivePlains,
  PHOTOS.blackRhinoCrater,
  PHOTOS.safariVehicleAcacia,
  PHOTOS.lionWhitePortrait,
  PHOTOS.bedroomLight,
  PHOTOS.lodgeInterior,
  PHOTOS.lionsUnderTree,
  PHOTOS.rhinoPair,
  PHOTOS.guideCulture,
  PHOTOS.balloons,
];

export const GALLERY_HEADER = PHOTOS.zebraStudy;
export const ABOUT_HEADER = PHOTOS.acaciaSunset;
export const ABOUT_TEASER = PHOTOS.lodgeBedroomView;
export const ABOUT_STORY = PHOTOS.gameDrive;
export const CONSERVATION = PHOTOS.rhinoBush;
export const TESTIMONIAL_BACKDROP = PHOTOS.acaciaSolitude;
export const CTA_BACKDROP = PHOTOS.elephantsSunrise;
export const TOURS_HEADER = PHOTOS.lionProwling;
export const BLOG_HEADER = PHOTOS.giraffeSunset;
export const BOOKING_HEADER = PHOTOS.elephantsSunrise;
export const CONTACT_HEADER = PHOTOS.kilimanjaroPlain;
export const PLANNING_HEADER = PHOTOS.balloons;

/* ------------------------------------------------------------------ *
 * People
 * ------------------------------------------------------------------ */

export interface TeamMember {
  name: string;
  role: string;
  note: string;
  src: string;
  alt: string;
  tint: string;
}

/**
 * Placeholder portraits. Swap `src` for the client's own team photographs
 * before this goes anywhere near production.
 */
export const TEAM: TeamMember[] = [
  {
    name: "Joseph Mollel",
    role: "Founder & Head Guide",
    note: "Twenty-two years in the Serengeti. Knows every pride by sight.",
    src: u("photo-1547036967-23d11aacaee0", 700),
    alt: "Portrait placeholder for Joseph Mollel, founder and head guide",
    tint: "#8a6a58",
  },
  {
    name: "Hazel Wanjiru",
    role: "Head of Itineraries",
    note: "Plans every trip personally, then answers the phone at 3am.",
    src: u("photo-1621414050946-1b936a78491f", 700),
    alt: "Portrait placeholder for Hazel Wanjiru, head of itineraries",
    tint: "#6b6f5c",
  },
  {
    name: "Daniel Kimaro",
    role: "Senior Guide",
    note: "Birder, tracker, and the reason guests find leopard.",
    src: u("photo-1516426122078-c23e76319801", 700),
    alt: "Portrait placeholder for Daniel Kimaro, senior guide",
    tint: "#8d5f34",
  },
  {
    name: "Amina Said",
    role: "Coast & Zanzibar",
    note: "Stone Town born. Books the dhow before you think to ask.",
    src: u("photo-1538964173425-93884d739596", 700),
    alt: "Portrait placeholder for Amina Said, coast and Zanzibar specialist",
    tint: "#3fa6a8",
  },
];
