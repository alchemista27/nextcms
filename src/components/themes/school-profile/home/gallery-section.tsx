import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import Link from "next/link";

export default function GallerySection({ images }: { images: any[] }) {
  const displayImages = images.length > 0 ? images.slice(0, 3) : [
    { id: 1, title: "Science Fair Winners", url: "https://images.unsplash.com/photo-1523580494112-071d38458a4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Classroom Activities", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Choir Festival", url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 text-schoolPrimary font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-schoolPrimary"></span> Campus Life
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-schoolSecondary">Photo Gallery & Achievements</h2>
          </div>
          <Link href="/gallery" className="text-schoolPrimary font-semibold flex items-center gap-1 mt-4 md:mt-0 hover:gap-2 transition-all">
            View All Gallery <ArrowRightAltIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayImages.map((image, index) => (
            <div key={image.id} className="relative rounded-lg overflow-hidden group cursor-pointer aspect-video animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={image.title} />
              <div className="absolute inset-0 bg-schoolSecondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                <AddCircleOutlineIcon className="w-12 h-12 mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                <h4 className="text-lg font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{image.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
