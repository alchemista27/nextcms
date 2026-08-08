import { requireRole } from "@/lib/auth-guard";
import GalleryFormClient from "../gallery-form-client";

export const metadata = {
  title: "Add New Gallery Image - NextCMS",
};

export default async function NewGalleryImagePage() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);

  return <GalleryFormClient />;
}
