"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

export async function updateUserRole(userId: string, formData: FormData) {
  const user = await requireAuth(["ADMIN"]);
  const role = formData.get("role") as Role;

  if (!role || !["ADMIN", "CONTRIBUTOR", "SUBSCRIBER"].includes(role)) {
    throw new Error("Invalid role selected.");
  }

  const targetUser = await prisma.cmsUser.findUnique({
    where: { id: userId },
  });

  if (!targetUser) {
    throw new Error("User not found.");
  }

  await prisma.cmsUser.update({
    where: { id: userId },
    data: { role },
  });

  redirect("/admin/users");
}
