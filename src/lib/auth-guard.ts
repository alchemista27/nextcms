import { createClient } from "./supabase/server";
import prisma from "./prisma";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;

  // Find the user in Prisma (cms.users) using the Supabase UUID
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { sharedUser: { select: { full_name: true, email: true } } }
  });

  if (!dbUser) return null;

  const { sharedUser, ...rest } = dbUser;
  return {
    ...rest,
    name: sharedUser?.full_name || "Unknown",
    email: sharedUser?.email || "Unknown"
  } as typeof rest & { name: string; email: string };
}

export async function requireAuth() {
  const dbUser = await getCurrentUser();

  if (!dbUser) {
    redirect("/login");
  }

  return dbUser;
}

export async function requireRole(allowedRoles: Role[]) {
  const dbUser = await requireAuth();

  if (!allowedRoles.includes(dbUser.role)) {
    redirect("/admin");
  }

  return dbUser;
}
