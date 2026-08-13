import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TestimonialForm } from "../../TestimonialForm";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth(["ADMIN"]);
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Testimonial</h1>
        <p className="text-text-secondary text-sm mt-1">{testimonial.name}</p>
      </div>
      <TestimonialForm initialData={testimonial} />
    </div>
  );
}
