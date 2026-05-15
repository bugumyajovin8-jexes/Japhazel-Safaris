import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { galleryApi } from "@/lib/api";
import heroImage from "@assets/generated_images/zebras_migrating.png";

export default function Gallery() {
  const { data: dbImages = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: galleryApi.getAll,
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="relative h-[40vh] flex items-center justify-center bg-black text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Gallery</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">Moments captured in the wild.</p>
        </div>
      </div>

      <main className="flex-grow py-20 container mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : dbImages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg italic">Our wilderness story is beginning soon. Check back shortly for new captures.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dbImages.map((img, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-100">
                <img 
                  src={img.url} 
                  alt={img.caption || "Gallery item"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-serif text-xl border-b border-accent pb-1">
                    {img.category.charAt(0).toUpperCase() + img.category.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
