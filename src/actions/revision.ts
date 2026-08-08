"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function getRevisions(entityType: string, entityId: string) {
  try {
    const revisions = await prisma.revision.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, avatar: true, sharedUser: { select: { full_name: true } } } } },
    });
    
    const mappedRevisions = revisions.map((r: any) => {
      const { author, ...rest } = r;
      return {
        ...rest,
        author: {
          id: author.id,
          avatar: author.avatar,
          name: author.sharedUser?.full_name || "Unknown"
        }
      };
    });
    
    return { success: true, data: mappedRevisions };
  } catch (error) {
    console.error("Failed to fetch revisions:", error);
    return { success: false, error: "Failed to fetch revisions" };
  }
}

export async function getRevisionById(id: string) {
  try {
    const revision = await prisma.revision.findUnique({
      where: { id },
      include: { author: { select: { id: true, avatar: true, sharedUser: { select: { full_name: true } } } } },
    });
    if (!revision) return { success: false, error: "Not found" };
    
    const { author, ...rest } = revision;
    const mappedRevision = {
      ...rest,
      author: {
        id: author.id,
        avatar: author.avatar,
        name: author.sharedUser?.full_name || "Unknown"
      }
    };
    
    return { success: true, data: mappedRevision };
  } catch (error) {
    console.error("Failed to fetch revision:", error);
    return { success: false, error: "Failed to fetch revision" };
  }
}

export async function getRevisionCount(entityType: string, entityId: string) {
  try {
    const count = await prisma.revision.count({
      where: { entityType, entityId },
    });
    return count;
  } catch (error) {
    return 0;
  }
}

export async function restoreRevision(id: string, authorId: string) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    const revision = await prisma.revision.findUnique({ where: { id } });
    if (!revision) return { success: false, error: "Revision not found" };

    if (revision.entityType === "post") {
      await prisma.post.update({
        where: { id: revision.entityId },
        data: {
          title: revision.title,
          content: revision.content,
        },
      });
      
      // Auto-create snapshot of the restored version
      await prisma.revision.create({
        data: {
          entityType: "post",
          entityId: revision.entityId,
          title: revision.title,
          content: revision.content,
          authorId,
          metadata: { note: `Restored from revision ${id}` },
        },
      });

      revalidatePath(`/admin/posts/${revision.entityId}/edit`);
    }

    // Auto-cleanup: keep only latest 25
    const latestRevisions = await prisma.revision.findMany({
      where: { entityType: revision.entityType, entityId: revision.entityId },
      orderBy: { createdAt: "desc" },
      skip: 25,
      select: { id: true },
    });

    if (latestRevisions.length > 0) {
      await prisma.revision.deleteMany({
        where: { id: { in: latestRevisions.map((r: any) => r.id) } },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to restore revision:", error);
    return { success: false, error: "Failed to restore revision" };
  }
}
