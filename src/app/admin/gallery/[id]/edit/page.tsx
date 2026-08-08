import { requireRole } from "@/lib/auth-guard";
import { getGalleryImageById } from "@/actions/gallery";
import GalleryFormClient from "../../gallery-form-client";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Gallery Image - NextCMS",
};

export default async function EditGalleryImagePage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  
  const image = await getGalleryImageById(params.id);
  if (!image) notFound();

  return <GalleryFormClient initialData={image} isEdit={true} />;
}
