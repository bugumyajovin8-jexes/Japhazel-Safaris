import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

/** Unsplash CDN helper — same source the client media library uses. */
const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=78&w=${w}`;

const sampleTours = [
  {
    title: "Luxury Serengeti Safari",
    location: "Tanzania",
    price: 4500,
    duration: "7 Days",
    image: u("photo-1516426122078-c23e76319801"),
    description:
      "Seven unhurried days across the Seronera Valley and the central Serengeti, staying in tented camps that move with the herds. Private vehicle throughout, and a guide who has worked these plains for two decades.",
    highlights: [
      "Big Five Spotting",
      "Hot Air Balloon Safari",
      "Luxury Tented Camp",
      "Maasai Cultural Visit",
    ],
  },
  {
    title: "Great Migration River Crossing",
    location: "Kenya",
    price: 5800,
    duration: "8 Days",
    image: u("photo-1518709766631-a6a7f45921c3"),
    description:
      "Timed to the July-October crossings on the Mara River. We camp at the crossing points and park early, so when the herds finally commit you are already in position.",
    highlights: [
      "Mara River Crossings",
      "Private Conservancy Access",
      "Off-road Game Viewing",
      "Dawn & Dusk Drives",
    ],
  },
  {
    title: "Amboseli & the Great Tuskers",
    location: "Kenya",
    price: 3900,
    duration: "6 Days",
    image: u("photo-1564760055775-d63b17a55c44"),
    description:
      "Amboseli holds the last of Africa's great tuskers — bulls carrying ivory that nearly reaches the ground — and Kilimanjaro fills the sky behind them every clear morning.",
    highlights: [
      "Great Tusker Elephants",
      "Kilimanjaro Views",
      "Maasai Community Walk",
      "Observation Hill Sundowners",
    ],
  },
  {
    title: "Ngorongoro Crater & Highlands",
    location: "Tanzania",
    price: 4200,
    duration: "6 Days",
    image: u("photo-1489392191049-fc10c97e64b6"),
    description:
      "A collapsed caldera holding 25,000 animals inside its walls, including one of the last black rhino populations in northern Tanzania. Crater-rim lodge with the whole floor laid out below you.",
    highlights: [
      "Black Rhino Tracking",
      "Crater Floor Full Day",
      "Crater-Rim Lodge",
      "Olduvai Gorge",
    ],
  },
  {
    title: "Serengeti & Zanzibar Combination",
    location: "Tanzania",
    price: 6400,
    duration: "12 Days",
    image: u("photo-1538964173425-93884d739596"),
    description:
      "One week of five o'clock starts on the plains, then a short flight east to Nungwi where nothing at all is scheduled. The classic bush-and-beach, done without a rushed transfer day in the middle.",
    highlights: [
      "Serengeti Game Drives",
      "Stone Town Spice Tour",
      "Beachfront Villa",
      "Reef Diving & Dhow Sunset",
    ],
  },
  {
    title: "Cape Town & Garden Route",
    location: "South Africa",
    price: 3200,
    duration: "10 Days",
    image: u("photo-1580060839134-75a5edca2e99"),
    description:
      "Table Mountain, the Cape peninsula and Boulders Beach, then east along the Garden Route with two nights in the Stellenbosch winelands on the way out.",
    highlights: [
      "Table Mountain Sunset",
      "Stellenbosch Wine Tasting",
      "Penguin Colony Visit",
      "Coastal Scenic Drive",
    ],
  },
  {
    title: "Victoria Falls Adventure",
    location: "Zimbabwe / Zambia",
    price: 1800,
    duration: "4 Days",
    image: u("photo-1547471080-7cc2caa01a7e"),
    description:
      "The Smoke that Thunders from three angles — helicopter, rainforest path, and a Zambezi sunset cruise — with the option to do something considerably more alarming on day three.",
    highlights: [
      "Helicopter over the Falls",
      "Zambezi Sunset Cruise",
      "Guided Rainforest Walk",
      "Bungee Jump (Optional)",
    ],
  },
  {
    title: "Kruger Big Five Explorer",
    location: "South Africa",
    price: 3600,
    duration: "7 Days",
    image: u("photo-1534759846116-5799c33ce22a"),
    description:
      "Private reserves on Kruger's western boundary, where off-road tracking is permitted and leopard sightings are close to routine. Two game drives daily plus a guided bush walk.",
    highlights: [
      "Leopard Tracking",
      "Off-road Traversing Rights",
      "Guided Bush Walk",
      "Malaria-free Options",
    ],
  },
  {
    title: "Balloon Safari & Bush Breakfast",
    location: "Tanzania",
    price: 2400,
    duration: "3 Days",
    image: u("photo-1507608869274-d3177c8bb4c7"),
    description:
      "A short, deliberately indulgent break built around one thing: lifting off in the dark over the Serengeti and watching the plain come up gold beneath you.",
    highlights: [
      "Dawn Balloon Flight",
      "Champagne Bush Breakfast",
      "Luxury Camp Stay",
      "Afternoon Game Drive",
    ],
  },
  {
    title: "Kilimanjaro Trek — Machame Route",
    location: "Tanzania",
    price: 3100,
    duration: "9 Days",
    image: u("photo-1621414050946-1b936a78491f"),
    description:
      "The Machame route over seven days on the mountain, with the extra acclimatisation night that pushes summit success rates well above the four-day scrambles.",
    highlights: [
      "Uhuru Peak Summit",
      "Extra Acclimatisation Day",
      "Private Porter Team",
      "Post-climb Lodge Recovery",
    ],
  },
  {
    title: "Family Safari — Tanzania Northern Circuit",
    location: "Tanzania",
    price: 3800,
    duration: "8 Days",
    image: u("photo-1547721064-da6cfb341d50"),
    description:
      "Built around shorter drives, family tents and guides who are genuinely good with children. Tarangire, Ngorongoro and the Serengeti at a pace that works for under-twelves.",
    highlights: [
      "Family Tents & Interconnects",
      "Shorter Driving Days",
      "Junior Ranger Programme",
      "Baobabs of Tarangire",
    ],
  },
  {
    title: "Photographic Safari — Serengeti",
    location: "Tanzania",
    price: 6900,
    duration: "9 Days",
    image: u("photo-1585468274952-66591eb14165"),
    description:
      "Converted vehicles with bean bags, drop sides and a single row per guest. Timed for the low golden light and led by a guide who shoots as well as he tracks.",
    highlights: [
      "Photographic Vehicles",
      "Maximum Four Guests",
      "Low-angle Hides",
      "Evening Editing Sessions",
    ],
  },
];

const galleryItems = [
  { id: "photo-1516426122078-c23e76319801", caption: "Sundowners on the plains", category: "safari" },
  { id: "photo-1564760055775-d63b17a55c44", caption: "Elephants at dawn", category: "wildlife" },
  { id: "photo-1507608869274-d3177c8bb4c7", caption: "Balloon safari at first light", category: "safari" },
  { id: "photo-1585468274952-66591eb14165", caption: "Eye to eye", category: "wildlife" },
  { id: "photo-1523805009345-7448845a9e53", caption: "The long walk home", category: "landscapes" },
  { id: "photo-1538964173425-93884d739596", caption: "Barefoot, finally", category: "coast" },
  { id: "photo-1578326457399-3b34dbbf23b8", caption: "No two alike", category: "wildlife" },
  { id: "photo-1590490360182-c33d57733427", caption: "Wake up to this", category: "lodges" },
  { id: "photo-1489392191049-fc10c97e64b6", caption: "Kilimanjaro at first light", category: "landscapes" },
  { id: "photo-1527436826045-8805c615a6df", caption: "Rhino, still here", category: "wildlife" },
  { id: "photo-1547471080-7cc2caa01a7e", caption: "Sundown on the plains", category: "landscapes" },
  { id: "photo-1534759846116-5799c33ce22a", caption: "The lookout", category: "wildlife" },
  { id: "photo-1582719508461-905c673771fd", caption: "The pool at camp", category: "lodges" },
  { id: "photo-1518709766631-a6a7f45921c3", caption: "Crossing in single file", category: "wildlife" },
  { id: "photo-1547721064-da6cfb341d50", caption: "Hello up there", category: "wildlife" },
  { id: "photo-1559128010-7c1ad6e1b6a5", caption: "Your own island, for an afternoon", category: "coast" },
  { id: "photo-1504173010664-32509aeebb62", caption: "A pride at rest", category: "wildlife" },
  { id: "photo-1580060839134-75a5edca2e99", caption: "Cape Town from the air", category: "landscapes" },
  { id: "photo-1571003123894-1f0594d2b5d9", caption: "Cabanas at dusk", category: "lodges" },
  { id: "photo-1549366021-9f761d450615", caption: "Out of the treeline", category: "wildlife" },
  { id: "photo-1516026672322-bc52d61a55d5", caption: "Nothing but horizon", category: "landscapes" },
  { id: "photo-1552410260-0fd9b577afa6", caption: "Under armed guard", category: "wildlife" },
  { id: "photo-1611892440504-42a792e24d32", caption: "Your tent, such as it is", category: "lodges" },
  { id: "photo-1535941339077-2dd1c7963098", caption: "Chest-deep in gold", category: "wildlife" },
  { id: "photo-1621414050946-1b936a78491f", caption: "Day four on the mountain", category: "safari" },
  { id: "photo-1526095179574-86e545346ae6", caption: "Stripes in the grass", category: "wildlife" },
  { id: "photo-1523741543316-beb7fc7023d8", caption: "Stellenbosch, late afternoon", category: "landscapes" },
  { id: "photo-1596701062351-8c2c14d1fdd0", caption: "Breakfast, served late", category: "lodges" },
];

export async function seedDatabase() {
  try {
    // --- Default admin -----------------------------------------------------
    // The password comes from ADMIN_PASSWORD. It is never hardcoded here: this
    // file is committed to source control, so anything written in it is public.
    const adminEmail = process.env.ADMIN_EMAIL || "admin@japhazel.com";
    const adminByEmail = await storage.getAdminUserByEmail(adminEmail);

    if (!adminByEmail) {
      let password = process.env.ADMIN_PASSWORD;

      if (!password) {
        if (process.env.NODE_ENV === "production") {
          // Rather than fall back to a known value on a public deployment,
          // mint a random one and print it once so it can be rotated.
          password = randomBytes(18).toString("base64url");
          console.warn(
            `[seed] ADMIN_PASSWORD is not set. Generated a one-time password ` +
            `for ${adminEmail}: ${password}
` +
            `[seed] Set ADMIN_PASSWORD in your environment and redeploy.`,
          );
        } else {
          password = "devpassword";
          console.warn(
            `[seed] ADMIN_PASSWORD not set — using "devpassword" for local ` +
            `development only. Set ADMIN_PASSWORD before deploying.`,
          );
        }
      }

      await storage.createAdminUser({
        name: "Admin User",
        email: adminEmail,
        hashedPassword: await bcrypt.hash(password, 10),
        role: "admin",
      });
      console.log(`Default admin user created: ${adminEmail}`);
    }

    // --- Tours -------------------------------------------------------------
    const existingTours = await storage.getAllTours();
    if (existingTours.length === 0) {
      for (const tour of sampleTours) {
        await storage.createTour(tour);
      }
      console.log(`Seeded ${sampleTours.length} sample tours`);
    }

    // --- Gallery -----------------------------------------------------------
    // Without this the home carousel and gallery page render empty on a fresh
    // install, which is the first thing anyone notices.
    const existingGallery = await storage.getAllGalleryItems();
    if (existingGallery.length === 0) {
      for (const item of galleryItems) {
        await storage.createGalleryItem({
          url: u(item.id, 1400),
          caption: item.caption,
          category: item.category,
        });
      }
      console.log(`Seeded ${galleryItems.length} gallery images`);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
