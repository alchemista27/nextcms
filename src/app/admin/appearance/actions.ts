"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import crypto from "crypto";

export async function saveAppearanceAction(key: string, data: any): Promise<{ success?: boolean; error?: string }> {
  await requireAuth(["ADMIN"]);

  // We ensure the data is parsed as JSON before saving
  const value = JSON.parse(JSON.stringify(data));

  await prisma.appearance.upsert({
    where: { key },
    update: { value },
    create: { id: crypto.randomUUID(), key, value },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
