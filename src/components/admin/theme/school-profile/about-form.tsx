"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateSchoolProfileSection } from "@/actions/school-profile";
import { MediaPicker } from "@/components/admin/media-picker";

export default function AboutSectionForm({ initialData }: { initialData: any }) {
  const [form, setForm] = useState({
    schoolName: initialData.schoolName || "Our Institution",
    description: initialData.description || "SMaRT School is a community of learners dedicated to academic excellence, personal growth, and global citizenship. We provide a supportive and challenging environment where students are encouraged to explore their passions.",
    principalName: initialData.principalName || "Dr. Budi Santoso, M.Pd.",
    principalTitle: initialData.principalTitle || "Principal",
    principalQuote: initialData.principalQuote || "\"Education is the passport to the future, for tomorrow belongs to those who prepare for it today.\"",
    principalImage: initialData.principalImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    yearsExperience: initialData.yearsExperience || 25,
    mainImage: initialData.mainImage || "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    subImage: initialData.subImage || "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  });
  
  const [features, setFeatures] = useState<string[]>(
    Array.isArray(initialData.features) && initialData.features.length > 0
      ? initialData.features
      : ["Modern Infrastructure", "Innovative Curriculum", "Sports & Extracurricular", "Global Partnerships"]
  );
  
  const [saving, setSaving] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string | null>(null);

  const addFeature = () => setFeatures(p => [...p, ""]);
  const removeFeature = (i: number) => setFeatures(p => p.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) => setFeatures(p => p.map((f, idx) => idx === i ? val : f));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSchoolProfileSection("about", { ...form, features: features.filter(Boolean) });
    if (result.error) toast.error(result.error);
    else toast.success("About section updated!");
    setSaving(false);
  };

  const handleMediaSelect = (media: any) => {
    if (mediaPickerTarget) {
      setForm(p => ({ ...p, [mediaPickerTarget]: media.url }));
    }
    setMediaPickerTarget(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.schoolName} onChange={e => setForm(p => ({...p, schoolName: e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years Experience Badge</label>
            <input type="number" min={0} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.yearsExperience} onChange={e => setForm(p => ({...p, yearsExperience: parseInt(e.target.value) || 0}))} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph</label>
          <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setMediaPickerTarget("mainImage")}>
              {form.mainImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.mainImage} alt="Main" className="h-24 rounded" />
              ) : (
                <span className="text-sm">Click to select image</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Image</label>
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setMediaPickerTarget("subImage")}>
              {form.subImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.subImage} alt="Sub" className="h-24 rounded" />
              ) : (
                <span className="text-sm">Click to select image</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-100 bg-gray-50 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-gray-700">Principal Quote Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#00704A]" value={form.principalName} onChange={e => setForm(p => ({...p, principalName: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#00704A]" value={form.principalTitle} onChange={e => setForm(p => ({...p, principalTitle: e.target.value}))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Quote</label>
            <textarea rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#00704A]" value={form.principalQuote} onChange={e => setForm(p => ({...p, principalQuote: e.target.value}))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
            <div className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-lg bg-white text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setMediaPickerTarget("principalImage")}>
              {form.principalImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.principalImage} alt="Principal" className="h-16 w-16 object-cover rounded-full" />
              ) : (
                <span className="text-xs">Select photo</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Features List (2x2 Grid)</label>
            <button type="button" onClick={addFeature} className="text-xs text-[#00704A] font-semibold hover:underline">+ Add Feature</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#00704A]" value={f} onChange={e => updateFeature(i, e.target.value)} />
                <button type="button" onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#00704A] text-white text-sm font-semibold rounded-lg hover:bg-[#1E3932] transition disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <MediaPicker
        open={mediaPickerTarget !== null}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={handleMediaSelect}
      />
    </>
  );
}
