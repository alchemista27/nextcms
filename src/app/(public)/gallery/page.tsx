import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery",
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      {/* Page Hero */}
      <section 
        className="py-24 lg:py-36 bg-cover bg-center relative"
        style={{ backgroundImage: "linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Photo Gallery</h1>
          <p className="text-gray-300 text-lg mb-6">Moments and memories from our vibrant community.</p>
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#E3E8E7]">Gallery</span>
          </nav>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                  <img 
                    src={img.url} 
                    alt={img.title || "Gallery Image"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-[#0f7f6d]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-6 text-white">
                    <span className="material-icons-outlined text-4xl mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">zoom_in</span>
                    {img.title && <h3 className="font-bold text-lg mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{img.title}</h3>}
                    {img.category && <p className="text-xs uppercase tracking-wider text-[#E3E8E7] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">{img.category}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No photos found</h3>
              <p className="text-gray-500">Gallery images will appear here once added to the CMS.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
