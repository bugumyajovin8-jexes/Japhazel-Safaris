import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { PHOTOS, BLOG_HEADER } from "@/lib/media";

const posts = [
  {
    id: 1,
    title: "When to visit the Serengeti — month by month",
    excerpt:
      "The herds are somewhere different every month of the year. Here is where they actually are, and which camps put you closest.",
    date: "12 December 2024",
    author: "Joseph Mollel",
    photo: PHOTOS.antelopeHerd,
    category: "Travel tips",
    readTime: "7 min read",
  },
  {
    id: 2,
    title: "Five camps worth rearranging your trip for",
    excerpt:
      "From a six-tent camp that moves with the migration to a crater-rim lodge with the whole floor laid out below you.",
    date: "28 November 2024",
    author: "Hazel Wanjiru",
    photo: PHOTOS.lodgeBedroomView,
    category: "Accommodation",
    readTime: "9 min read",
  },
  {
    id: 3,
    title: "What to actually pack for your first safari",
    excerpt:
      "Soft bag, not hard. Two pairs of trousers, not six. And the one thing almost everybody forgets until the first evening drive.",
    date: "15 October 2024",
    author: "Daniel Kimaro",
    photo: PHOTOS.gameDrive,
    category: "Guides",
    readTime: "5 min read",
  },
  {
    id: 4,
    title: "Photographing big cats without a 600mm lens",
    excerpt:
      "Most of the best safari photographs are about light and patience, not focal length. A guide to getting them on the kit you own.",
    date: "2 October 2024",
    author: "Daniel Kimaro",
    photo: PHOTOS.lionFace,
    category: "Photography",
    readTime: "8 min read",
  },
  {
    id: 5,
    title: "Is a balloon safari worth the money?",
    excerpt:
      "It costs about as much as a night in camp and lasts an hour. We asked forty guests afterwards, and thirty-nine said yes.",
    date: "18 September 2024",
    author: "Hazel Wanjiru",
    photo: PHOTOS.balloons,
    category: "Experiences",
    readTime: "4 min read",
  },
  {
    id: 6,
    title: "Bush and beach: how long do you need in Zanzibar?",
    excerpt:
      "Three nights is the usual answer and the usual mistake. Here is how to work out the right number for your trip.",
    date: "4 September 2024",
    author: "Amina Said",
    photo: PHOTOS.beachAerial,
    category: "Itineraries",
    readTime: "6 min read",
  },
];

export default function Blog() {
  const [lead, ...rest] = posts;

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <PageHeader
        eyebrow="Field notes"
        title="Travel Journal"
        subtitle="Stories, timings and hard-won practicalities from the people who run the trips."
        image={BLOG_HEADER.wide}
        tint={BLOG_HEADER.tint}
      />

      <main className="container mx-auto flex-grow px-5 py-14 md:px-6 sm:py-20">
        {/* Lead article */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group mb-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12"
        >
          <div className="relative overflow-hidden">
            <SmartImage
              src={lead.photo.wide}
              alt={lead.photo.alt}
              tint={lead.photo.tint}
              priority
              wrapperClassName="aspect-[16/10] w-full"
              className="transition-transform duration-[1200ms] group-hover:scale-105"
            />
            <span className="absolute left-4 top-4 bg-accent px-3 py-1 text-[0.62rem] font-bold uppercase tracking-widest text-white">
              {lead.category}
            </span>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-accent" /> {lead.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-accent" /> {lead.author}
              </span>
              <span>{lead.readTime}</span>
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-primary transition-colors group-hover:text-accent sm:text-4xl">
              {lead.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {lead.excerpt}
            </p>
            <Button
              variant="link"
              className="mt-5 p-0 text-sm font-bold uppercase tracking-widest text-accent hover:text-primary hover:no-underline"
            >
              Read the article <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </motion.article>

        {/* Remaining posts */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group flex flex-col bg-card shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative overflow-hidden">
                <SmartImage
                  src={post.photo.src}
                  alt={post.photo.alt}
                  tint={post.photo.tint}
                  wrapperClassName="h-56 w-full"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 bg-accent px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-white">
                  {post.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-accent" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-accent" /> {post.author}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold leading-snug transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <Button
                    variant="link"
                    className="p-0 text-xs font-bold uppercase tracking-widest text-accent hover:text-primary hover:no-underline"
                  >
                    Read more <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                  <span className="text-[0.68rem] text-muted-foreground">
                    {post.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
