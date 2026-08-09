import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { MediaLibrary } from "./MediaLibrary";

export default async function MediaPage() {
  const user = await requireAuth();

  const whereClause = user.role === "ADMIN" ? {} : { uploadedById: user.id };

  const media = await prisma.media.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: {
        include: {
          sharedUser: {
            select: { fullName: true }
          }
        }
      }
    }
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Media Library</h1>
      </div>
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
