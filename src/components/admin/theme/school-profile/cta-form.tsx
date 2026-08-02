"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateSchoolProfileSection } from "@/actions/school-profile";

export default function CTASectionForm({ initialData }: { initialData: any }) {
  const [form, setForm] = useState({
    badge: initialData.badge || "Join Our Community",
    title: initialData.title || "Ready to Take the Next Step in Your Education?",
    primaryButtonText: initialData.primaryButtonText || "Enroll Now",
    primaryButtonUrl: initialData.primaryButtonUrl || "#enroll",
    secondaryButtonText: initialData.secondaryButtonText || "Contact Us",
    secondaryButtonUrl: initialData.secondaryButtonUrl || "#contact",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSchoolProfileSection("cta", form);
    if (result.error) toast.error(result.error);
    else toast.success("CTA section updated!");
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
        <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.badge} onChange={e => setForm(p => ({...p, badge: e.target.value}))} placeholder="Join Our Community" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Main Headline</label>
        <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Ready to Take the Next Step..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.primaryButtonText} onChange={e => setForm(p => ({...p, primaryButtonText: e.target.value}))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button URL</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.primaryButtonUrl} onChange={e => setForm(p => ({...p, primaryButtonUrl: e.target.value}))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.secondaryButtonText} onChange={e => setForm(p => ({...p, secondaryButtonText: e.target.value}))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button URL</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.secondaryButtonUrl} onChange={e => setForm(p => ({...p, secondaryButtonUrl: e.target.value}))} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#00704A] text-white text-sm font-semibold rounded-lg hover:bg-[#1E3932] transition disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
