import { requireAuth } from "@/lib/auth";
import { TestimonialForm } from "../TestimonialForm";

export default async function NewTestimonialPage() {
  await requireAuth(["ADMIN"]);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Add Testimonial</h1>
      </div>
      <TestimonialForm />
    </div>
  );
}
