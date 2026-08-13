import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { AlbumForm } from "../../AlbumForm";
import { notFound } from "next/navigation";

export default async function EditAlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  await requireAuth(["ADMIN"]);
  const { albumId } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
  if (!album) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Album</h1>
        <p className="text-text-secondary text-sm mt-1">{album.name}</p>
      </div>
      <AlbumForm initialData={album} />
    </div>
  );
}
