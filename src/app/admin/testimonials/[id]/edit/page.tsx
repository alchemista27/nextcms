import { requireRole } from "@/lib/auth-guard";
import { getTestimonialById } from "@/actions/testimonial";
import TestimonialFormClient from "../../testimonial-form-client";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Testimonial - NextCMS",
};

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  
  const item = await getTestimonialById(params.id);
  if (!item) notFound();

  return <TestimonialFormClient initialData={item} isEdit={true} />;
}
