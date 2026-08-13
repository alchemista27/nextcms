import { requireAuth } from "@/lib/auth";
import { AlbumForm } from "../AlbumForm";

export default async function NewAlbumPage() {
  await requireAuth(["ADMIN"]);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Create Album</h1>
      </div>
      <AlbumForm />
    </div>
  );
}
