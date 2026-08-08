"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateSchoolProfileSection } from "@/actions/school-profile";

export default function ContactInfoForm({ initialData }: { initialData: any }) {
  const [form, setForm] = useState({
    address: initialData.address || "123 Education Lane, Jakarta, Indonesia 10110",
    phone: initialData.phone || "+62 812 3456 7890",
    email: initialData.email || "info@smartschool.edu",
    facebook: initialData.facebook || "https://facebook.com",
    instagram: initialData.instagram || "https://instagram.com",
    youtube: initialData.youtube || "https://youtube.com",
    footerTagline: initialData.footerTagline || "Providing high-quality education and nurturing environments that empower students to become leaders of tomorrow.",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSchoolProfileSection("contact", form);
    if (result.error) toast.error(result.error);
    else toast.success("Contact info updated!");
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Contact Details</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Social Links</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.facebook} onChange={e => setForm(p => ({...p, facebook: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.instagram} onChange={e => setForm(p => ({...p, instagram: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.youtube} onChange={e => setForm(p => ({...p, youtube: e.target.value}))} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Footer Details</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Footer Tagline</label>
          <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.footerTagline} onChange={e => setForm(p => ({...p, footerTagline: e.target.value}))} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0f7f6d] text-white text-sm font-semibold rounded-lg hover:bg-[#454545] transition disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
