"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateSchoolProfileSection } from "@/actions/school-profile";
import { MediaPicker } from "@/components/admin/media-picker";

export default function HeroSectionForm({ initialData }: { initialData: any }) {
  const [form, setForm] = useState({
    badge: initialData.badge || "Welcome to SMaRT School",
    title1: initialData.title1 || "Empowering Students",
    title2: initialData.title2 || "To Achieve Excellence",
    subtitle: initialData.subtitle || "A premier educational institution committed to academic excellence, character development, and creating future leaders in a globally competitive world.",
    primaryButtonText: initialData.primaryButtonText || "Discover More",
    secondaryButtonText: initialData.secondaryButtonText || "Our Programs",
    primaryButtonUrl: initialData.primaryButtonUrl || "#about",
    secondaryButtonUrl: initialData.secondaryButtonUrl || "#academics",
    backgroundImage: initialData.backgroundImage || "",
  });
  const [saving, setSaving] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSchoolProfileSection("hero", form);
    if (result.error) toast.error(result.error);
    else toast.success("Hero section updated!");
    setSaving(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.badge} onChange={e => setForm(p => ({...p, badge: e.target.value}))} placeholder="Welcome to SMaRT School" />
          <p className="text-xs text-gray-400 mt-1">Small badge label above the main title</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Headline Line 1</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.title1} onChange={e => setForm(p => ({...p, title1: e.target.value}))} placeholder="Empowering Students" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Headline Line 2</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.title2} onChange={e => setForm(p => ({...p, title2: e.target.value}))} placeholder="To Achieve Excellence" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
          <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.subtitle} onChange={e => setForm(p => ({...p, subtitle: e.target.value}))} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.primaryButtonText} onChange={e => setForm(p => ({...p, primaryButtonText: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button URL</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.primaryButtonUrl} onChange={e => setForm(p => ({...p, primaryButtonUrl: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.secondaryButtonText} onChange={e => setForm(p => ({...p, secondaryButtonText: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button URL</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]" value={form.secondaryButtonUrl} onChange={e => setForm(p => ({...p, secondaryButtonUrl: e.target.value}))} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Image <span className="text-gray-400 font-normal">(optional)</span></label>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer" onClick={() => setIsMediaPickerOpen(true)}>
            {form.backgroundImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.backgroundImage} alt="Featured" className="max-h-48 rounded" />
            ) : (
              <>
                <span className="material-icons-outlined text-4xl mb-2 text-gray-400">image</span>
                <span className="text-sm">Click to select image</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">Will overlay with a dark green gradient. Leave empty to use default.</p>
          {form.backgroundImage && (
            <button type="button" onClick={() => setForm(p => ({...p, backgroundImage: ""}))} className="text-xs text-red-500 mt-1 hover:underline">
              Remove Image
            </button>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0f7f6d] text-white text-sm font-semibold rounded-lg hover:bg-[#454545] transition disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      
      <MediaPicker
        open={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media) => {
          setForm(p => ({...p, backgroundImage: media.url}));
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
}
