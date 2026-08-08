import { requireRole } from "@/lib/auth-guard";
import { getGalleryImages } from "@/actions/gallery";
import GalleryListClient from "./gallery-list-client";

export const metadata = {
  title: "Gallery - NextCMS",
};

export default async function GalleryPage() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  const images = await getGalleryImages();

  return <GalleryListClient initialData={images} />;
}
