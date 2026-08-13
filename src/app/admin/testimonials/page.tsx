import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { deleteTestimonialAction } from "./actions";

export default async function TestimonialsPage() {
  await requireAuth(["ADMIN"]);

  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  function Stars({ rating }: { rating: number }) {
    return (
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} className={`material-icons-outlined text-base ${s <= rating ? "text-yellow-400" : "text-border"}`}>
            star
          </span>
        ))}
      </span>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Testimonials</h1>
          <p className="text-text-secondary text-sm mt-1">{testimonials.length} testimonials</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium flex items-center gap-2"
        >
          <span className="material-icons-outlined text-[18px]">add</span>
          Add Testimonial
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50">
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border w-14">Photo</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Name</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Content</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Rating</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-center">Status</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-bg/50">
                  <td className="px-5 py-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-bg border border-border overflow-hidden flex items-center justify-center">
                      {t.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-icons-outlined text-text-secondary text-xl">person</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-border">
                    <div className="font-medium text-text-primary">{t.name}</div>
                    {t.role && <div className="text-xs text-text-secondary">{t.role}</div>}
                  </td>
                  <td className="px-5 py-3 border-b border-border max-w-xs">
                    <p className="text-sm text-text-secondary line-clamp-2">{t.content}</p>
                  </td>
                  <td className="px-5 py-3 border-b border-border">
                    <Stars rating={t.rating} />
                  </td>
                  <td className="px-5 py-3 border-b border-border text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${t.isActive ? "bg-[#D1FAE5] text-[#065F46]" : "bg-bg text-text-secondary"}`}>
                      {t.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3 border-b border-border text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/testimonials/${t.id}/edit`}
                        className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-bg text-text-primary transition">
                        Edit
                      </Link>
                      <form action={deleteTestimonialAction.bind(null, t.id)}>
                        <button type="submit"
                          className="px-3 py-1.5 text-xs border border-danger/30 rounded-md hover:bg-danger/5 text-danger transition"
                          onClick={(e) => { if (!confirm(`Delete testimonial from ${t.name}?`)) e.preventDefault(); }}>
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-text-secondary">
                    <span className="material-icons-outlined text-4xl mb-2 block opacity-40">format_quote</span>
                    No testimonials yet.{" "}
                    <Link href="/admin/testimonials/new" className="text-primary hover:underline">Add one</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
