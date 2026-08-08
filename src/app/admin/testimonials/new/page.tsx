import { requireRole } from "@/lib/auth-guard";
import TestimonialFormClient from "../testimonial-form-client";

export const metadata = {
  title: "Add New Testimonial - NextCMS",
};

export default async function NewTestimonialPage() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);

  return <TestimonialFormClient />;
}
