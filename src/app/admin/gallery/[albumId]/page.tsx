import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteGalleryImageAction } from "../actions";

export default async function AlbumImagesPage({ params }: { params: Promise<{ albumId: string }> }) {
  await requireAuth(["ADMIN"]);
  const { albumId } = await params;

  const album = await prisma.galleryAlbum.findUnique({
    where: { id: albumId },
    include: { images: { orderBy: [{ order: "asc" }, { createdAt: "desc" }] } },
  });
  if (!album) notFound();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
            <Link href="/admin/gallery" className="hover:text-primary transition">Gallery</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-text-primary font-medium">{album.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{album.name}</h1>
          <p className="text-text-secondary text-sm mt-1">{album.images.length} images</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/gallery/${albumId}/edit`}
            className="px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-bg transition text-sm font-medium"
          >
            Edit Album
          </Link>
          <Link
            href={`/admin/gallery/${albumId}/images/new`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium flex items-center gap-2"
          >
            <span className="material-icons-outlined text-[18px]">add</span>
            Add Image
          </Link>
        </div>
      </div>

      {album.images.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-16 text-center text-text-secondary shadow-sm">
          <span className="material-icons-outlined text-5xl mb-3 block opacity-30">collections</span>
          <p className="mb-4">No images in this album yet.</p>
          <Link
            href={`/admin/gallery/${albumId}/images/new`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium inline-flex items-center gap-2"
          >
            <span className="material-icons-outlined text-[18px]">add</span>
            Add First Image
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {album.images.map((image) => (
            <div key={image.id} className="group relative aspect-square bg-bg border border-border rounded-xl overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.title || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-3">
                <span className="text-white text-xs font-medium text-center line-clamp-2">{image.title || "Untitled"}</span>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/gallery/${albumId}/images/${image.id}/edit`}
                    className="px-2 py-1 bg-white text-text-primary rounded text-xs hover:bg-gray-100 transition"
                  >
                    Edit
                  </Link>
                  <form action={deleteGalleryImageAction.bind(null, image.id)}>
                    <button
                      type="submit"
                      className="px-2 py-1 bg-danger text-white rounded text-xs hover:bg-red-700 transition"
                      onClick={(e) => { if (!confirm("Delete this image?")) e.preventDefault(); }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {/* Add image card */}
          <Link
            href={`/admin/gallery/${albumId}/images/new`}
            className="aspect-square bg-bg border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-text-secondary hover:border-primary/50 hover:text-primary transition gap-2"
          >
            <span className="material-icons-outlined text-3xl">add_photo_alternate</span>
            <span className="text-xs">Add Image</span>
          </Link>
        </div>
      )}
    </div>
  );
}
