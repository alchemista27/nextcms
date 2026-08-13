import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { deleteGalleryImageAction } from "@/app/admin/gallery/actions";

// Unallocated images page (no album)
export default async function UnallocatedImagesPage() {
  await requireAuth(["ADMIN"]);

  const images = await prisma.galleryImage.findMany({
    where: { albumId: null },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
            <Link href="/admin/gallery" className="hover:text-primary transition">Gallery</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-text-primary font-medium">No Album</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Unallocated Images</h1>
          <p className="text-text-secondary text-sm mt-1">{images.length} images</p>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-16 text-center text-text-secondary shadow-sm">
          <span className="material-icons-outlined text-5xl mb-3 block opacity-30">photo</span>
          <p>No unallocated images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square bg-bg border border-border rounded-xl overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.title || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-3">
                <span className="text-white text-xs font-medium text-center line-clamp-2">{image.title || "Untitled"}</span>
                <form action={deleteGalleryImageAction.bind(null, image.id)}>
                  <button type="submit" className="px-2 py-1 bg-danger text-white rounded text-xs hover:bg-red-700 transition"
                    onClick={(e) => { if (!confirm("Delete this image?")) e.preventDefault(); }}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
