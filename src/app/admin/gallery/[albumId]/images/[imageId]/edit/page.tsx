import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ImageForm } from "../../ImageForm";
import { notFound } from "next/navigation";

export default async function EditGalleryImagePage({ params }: { params: Promise<{ albumId: string; imageId: string }> }) {
  await requireAuth(["ADMIN"]);
  const { albumId, imageId } = await params;
  const image = await prisma.galleryImage.findUnique({ where: { id: imageId } });
  if (!image) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Image</h1>
      </div>
      <ImageForm albumId={albumId} initialData={image} />
    </div>
  );
}
