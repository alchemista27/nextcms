import { requireRole } from "@/lib/auth-guard";
import { getTestimonials } from "@/actions/testimonial";
import TestimonialListClient from "./testimonial-list-client";

export const metadata = {
  title: "Testimonials - NextCMS",
};

export default async function TestimonialsPage() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  const testimonials = await getTestimonials();

  return <TestimonialListClient initialData={testimonials} />;
}
