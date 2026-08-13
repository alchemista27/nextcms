import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ImageForm } from "../ImageForm";
import { notFound } from "next/navigation";

export default async function NewGalleryImagePage({ params }: { params: Promise<{ albumId: string }> }) {
  await requireAuth(["ADMIN"]);
  const { albumId } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
  if (!album) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Add Image to {album.name}</h1>
      </div>
      <ImageForm albumId={albumId} />
    </div>
  );
}
