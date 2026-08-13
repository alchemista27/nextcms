import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { deleteAlbumAction } from "./actions";

export default async function GalleryPage() {
  await requireAuth(["ADMIN"]);

  const albums = await prisma.galleryAlbum.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { images: true } } },
  });

  // Images without album
  const unallocatedCount = await prisma.galleryImage.count({ where: { albumId: null } });

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gallery</h1>
          <p className="text-text-secondary text-sm mt-1">{albums.length} albums</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium flex items-center gap-2"
        >
          <span className="material-icons-outlined text-[18px]">add</span>
          Add Album
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {albums.map((album) => (
          <div key={album.id} className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden group">
            <div className="aspect-video bg-bg flex items-center justify-center overflow-hidden border-b border-border relative">
              {album.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-icons-outlined text-5xl text-text-secondary/30">photo_library</span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <Link
                  href={`/admin/gallery/${album.id}`}
                  className="px-3 py-1.5 bg-white text-text-primary rounded-md text-xs font-medium hover:bg-gray-100 transition"
                >
                  Manage Images
                </Link>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-text-primary truncate">{album.name}</h3>
                <span className="text-xs text-text-secondary ml-2 shrink-0">{album._count.images} images</span>
              </div>
              {album.description && (
                <p className="text-xs text-text-secondary truncate mb-3">{album.description}</p>
              )}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Link
                  href={`/admin/gallery/${album.id}`}
                  className="flex-1 py-1.5 text-xs text-center border border-border rounded-md hover:bg-bg text-text-primary transition"
                >
                  View Images
                </Link>
                <Link
                  href={`/admin/gallery/${album.id}/edit`}
                  className="flex-1 py-1.5 text-xs text-center border border-border rounded-md hover:bg-bg text-text-primary transition"
                >
                  Edit Album
                </Link>
                <form action={deleteAlbumAction.bind(null, album.id)}>
                  <button
                    type="submit"
                    className="py-1.5 px-3 text-xs border border-danger/30 rounded-md hover:bg-danger/5 text-danger transition"
                    onClick={(e) => { if (!confirm(`Delete album "${album.name}"?`)) e.preventDefault(); }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {/* Unallocated images card */}
        <Link href="/admin/gallery/unallocated" className="bg-surface border border-dashed border-border rounded-xl p-5 shadow-sm flex flex-col items-center justify-center gap-3 text-text-secondary hover:border-primary/50 transition min-h-[180px]">
          <span className="material-icons-outlined text-3xl">photo</span>
          <div className="text-center">
            <div className="font-medium text-text-primary text-sm">No Album</div>
            <div className="text-xs mt-1">{unallocatedCount} unallocated images</div>
          </div>
        </Link>

        {albums.length === 0 && (
          <div className="col-span-full py-16 text-center text-text-secondary">
            <span className="material-icons-outlined text-5xl mb-3 block opacity-30">photo_library</span>
            <p>No albums yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
