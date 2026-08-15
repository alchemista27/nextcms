"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TestimonialFormSchema } from "@/lib/validations/sprint5";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function saveTestimonialAction(id: string | null, formData: FormData) {
  await requireAuth(["ADMIN"]);

  const rawData = {
    name: formData.get("name") as string,
    role: formData.get("role") as string || undefined,
    content: formData.get("content") as string,
    photoUrl: formData.get("photoUrl") as string || undefined,
    rating: formData.get("rating") as string,
    isActive: formData.get("isActive") === "true",
    order: formData.get("order") as string,
  };

  const parsed = TestimonialFormSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  if (id) {
    await prisma.testimonial.update({ where: { id }, data });
  } else {
    await prisma.testimonial.create({ data: { ...data, id: crypto.randomUUID() } });
  }

  revalidatePath('/', 'layout');
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonialAction(id: string) {
  await requireAuth(["ADMIN"]);
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath('/', 'layout');
  revalidatePath("/admin/testimonials");
}
