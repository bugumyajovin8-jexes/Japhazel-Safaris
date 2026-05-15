import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2 } from "lucide-react";
import heroVideo from "@assets/generated_videos/zanzibar_beach_aerial.mp4";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Header with Video */}
      <div className="relative h-[40vh] flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Our Story</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">Founded on a love for the wild and a commitment to conservation.</p>
        </div>
      </div>

      <main className="flex-grow py-20 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-2">The Beginning</h2>
            <h3 className="text-3xl font-serif font-bold mb-6 text-primary">A Journey of Passion</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Japhazel Safaris began 15 years ago with a simple mission: to share the breathtaking beauty of East Africa with the world while preserving it for future generations. What started as a small family operation has grown into a premier luxury travel company, known for our exclusive access and personalized service.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We don't just sell tours; we craft experiences. Every itinerary is meticulously planned to ensure that you see the Africa of your dreams, away from the crowds, in total comfort.
            </p>
          </section>

          <section className="bg-secondary/30 p-8 rounded-lg">
             <h3 className="text-2xl font-serif font-bold mb-6 text-primary">Why Choose Us?</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 "100% Local Guides with expert knowledge",
                 "Exclusive partnerships with top-tier lodges",
                 "24/7 Support during your trip",
                 "Contribution to local conservation projects"
               ].map((item) => (
                 <div key={item} className="flex items-center gap-3">
                   <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                   <span className="text-primary font-medium">{item}</span>
                 </div>
               ))}
             </div>
          </section>

          <section>
            <h3 className="text-3xl font-serif font-bold mb-8 text-primary">Meet the Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                    <img src={`https://avatar.vercel.sh/member${i}`} alt="Team Member" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-lg">Team Member {i}</h4>
                  <p className="text-sm text-accent">Safari Specialist</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
