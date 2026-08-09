import { createClient } from "./supabase/server";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

export type AuthUser = {
  id: string;       // shared user ID = cms user ID
  email: string;
  name: string | null;
  role: Role;
};

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email) return null;

  try {
    // 1. Ensure SharedUser exists (from the shared schema)
    let sharedUser = await prisma.sharedUser.findUnique({
      where: { id: user.id },
    });

    if (!sharedUser) {
      sharedUser = await prisma.sharedUser.create({
        data: {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email.split("@")[0],
        },
      });
    }

    // 2. Ensure CmsUser exists (same UUID as shared user)
    let cmsUser = await prisma.cmsUser.findUnique({
      where: { id: user.id },
    });

    if (!cmsUser) {
      // First cms user becomes ADMIN, rest CONTRIBUTOR
      const count = await prisma.cmsUser.count();
      cmsUser = await prisma.cmsUser.create({
        data: {
          id: user.id,  // same UUID as supabase / shared user
          role: count === 0 ? "ADMIN" : "CONTRIBUTOR",
        },
      });
    }

    return {
      id: user.id,
      email: sharedUser.email,
      name: sharedUser.fullName ?? null,
      role: cmsUser.role,
    };
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
}

export async function requireAuth(allowedRoles?: Role[]): Promise<AuthUser> {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/admin");
  }

  return user;
}
