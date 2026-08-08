"use server";

import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { testimonialSchema } from "@/lib/validators/testimonial";

export async function getTestimonials() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  return await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getTestimonialById(id: string) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  return await prisma.testimonial.findUnique({
    where: { id },
  });
}

export async function createTestimonial(data: any) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    const validated = testimonialSchema.parse(data);
    const result = await prisma.testimonial.create({
      data: {
        name: validated.name,
        role: validated.role,
        content: validated.content,
        avatarUrl: validated.avatarUrl || null,
        isPublished: validated.isPublished,
      },
    });
    revalidatePath("/admin/testimonials");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create testimonial" };
  }
}

export async function updateTestimonial(id: string, data: any) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    const validated = testimonialSchema.parse(data);
    const result = await prisma.testimonial.update({
      where: { id },
      data: {
        name: validated.name,
        role: validated.role,
        content: validated.content,
        avatarUrl: validated.avatarUrl || null,
        isPublished: validated.isPublished,
      },
    });
    revalidatePath("/admin/testimonials");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete testimonial" };
  }
}
