import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import Stats from "@/components/home/Stats";
import { CheckCircle2, Leaf, Users, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { ABOUT_STORY, ABOUT_HEADER, TEAM, CONSERVATION } from "@/lib/media";
import heroVideo from "@assets/generated_videos/zanzibar_beach_aerial.mp4";

const VALUES = [
  {
    icon: Users,
    title: "Guides who grew up here",
    body: "Every drive is led by a Tanzanian or Kenyan guide with a decade or more in the parks — not a driver with a checklist.",
  },
  {
    icon: ShieldCheck,
    title: "One trip at a time",
    body: "We cap the number of departures we run each season so your itinerary gets a real person, not a queue ticket.",
  },
  {
    icon: Leaf,
    title: "Camps that give back",
    body: "We book properties on community-owned land and conservancies, where your bed night funds anti-poaching patrols.",
  },
  {
    icon: HeartHandshake,
    title: "Reachable at 3am",
    body: "Flight cancelled, bag lost, plans changed? One WhatsApp number, answered by the person who planned your trip.",
  },
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <PageHeader
        eyebrow="Since 2010"
        title="Our Story"
        subtitle="Founded on a love for the wild, and a stubborn belief that safari should feel personal."
        video={heroVideo}
        image={ABOUT_HEADER.wide}
        tint={ABOUT_HEADER.tint}
      />

      <main className="flex-grow">
        {/* ---------- Origin story ---------- */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-5 md:px-6 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <span className="absolute -left-3 -top-3 hidden h-20 w-20 border-l-2 border-t-2 border-accent md:block" />
              <SmartImage
                src={ABOUT_STORY.wide}
                alt={ABOUT_STORY.alt}
                tint={ABOUT_STORY.tint}
                wrapperClassName="aspect-[4/5] w-full shadow-2xl sm:aspect-[4/3] lg:aspect-[4/5]"
              />
              <span className="absolute -bottom-3 -right-3 hidden h-20 w-20 border-b-2 border-r-2 border-accent md:block" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h2 className="rule-accent text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
                The beginning
              </h2>
              <h3 className="mt-5 font-serif font-bold text-primary text-display-sm">
                A family business that never stopped being one
              </h3>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  Japhazel Safaris began fifteen years ago with one Land Cruiser, a
                  second-hand pair of binoculars, and a conviction that East Africa
                  deserved to be shown properly — slowly, and by the people who call it
                  home.
                </p>
                <p>
                  We have grown since. What has not changed is who answers the phone: the
                  same small team that will meet you at the airstrip, know which pride
                  moved north last week, and remember that you take your coffee black.
                </p>
                <p className="border-l-2 border-accent pl-5 font-serif text-lg italic text-primary sm:text-xl">
                  &ldquo;We do not sell tours. We take people somewhere, and we stay with
                  them while they are there.&rdquo;
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "100% local, licensed guides",
                  "Private vehicle on every safari",
                  "Conservancy & community camps",
                  "24/7 support while you travel",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium text-primary">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <Stats />

        {/* ---------- Values ---------- */}
        <section className="bg-secondary/40 py-16 sm:py-24">
          <div className="container mx-auto px-5 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="rule-accent rule-accent-center text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
                How we work
              </h2>
              <h3 className="mt-5 font-serif font-bold text-primary text-display-sm">
                Four promises we actually keep
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="border border-border bg-card p-7 transition-colors hover:border-accent"
                >
                  <v.icon className="h-8 w-8 text-accent" />
                  <h4 className="mt-5 font-serif text-xl font-bold text-primary">
                    {v.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Conservation strip ---------- */}
        <section className="relative overflow-hidden py-20 text-white sm:py-28">
          <img
            src={CONSERVATION.wide}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="container relative z-10 mx-auto max-w-3xl px-5 text-center md:px-6">
            <h2 className="text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
              Conservation
            </h2>
            <h3 className="mt-5 font-serif font-bold text-display-sm text-shadow-soft">
              5% of every booking stays in the bush
            </h3>
            <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
              It funds ranger salaries in the Mara North Conservancy, a rhino monitoring
              unit in Tanzania, and school fees for the children of the guides who take
              you out each morning. We publish the numbers every year.
            </p>
          </div>
        </section>

        {/* ---------- Team ---------- */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-5 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="rule-accent rule-accent-center text-[0.7rem] font-bold uppercase tracking-eyebrow text-accent">
                The people
              </h2>
              <h3 className="mt-5 font-serif font-bold text-primary text-display-sm">
                Who you will actually be travelling with
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
              {TEAM.map((person, i) => (
                <motion.figure
                  key={person.name}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group text-center"
                >
                  <div className="relative overflow-hidden">
                    <SmartImage
                      src={person.src}
                      alt={person.alt}
                      tint={person.tint}
                      wrapperClassName="aspect-[3/4] w-full"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 border-2 border-accent/0 transition-colors duration-500 group-hover:border-accent/70" />
                  </div>
                  <figcaption className="mt-4">
                    <p className="font-serif text-lg font-bold text-primary">
                      {person.name}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-accent">
                      {person.role}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{person.note}</p>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
