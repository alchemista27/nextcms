"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateSchoolProfileSection } from "@/actions/school-profile";
import { MediaPicker } from "@/components/admin/media-picker";

const DEFAULT_TEACHERS = [
  { name: "Sarah Jenkins", role: "Head of Science", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Michael Chen", role: "Mathematics Dept.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Dr. Emily Smith", role: "Literature & Arts", image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&q=80" },
  { name: "James Wilson", role: "Physical Education", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
];

export default function TeachersForm({ initialData }: { initialData: any[] }) {
  const [teachers, setTeachers] = useState<{ name: string; role: string; image: string }[]>(
    initialData.length > 0 ? initialData : DEFAULT_TEACHERS
  );
  const [saving, setSaving] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<number | null>(null);

  const add = () => setTeachers(p => [...p, { name: "", role: "", image: "" }]);
  const remove = (i: number) => setTeachers(p => p.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: string) =>
    setTeachers(p => p.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSchoolProfileSection("teachers", teachers);
    if (result.error) toast.error(result.error);
    else toast.success("Teachers updated!");
    setSaving(false);
  };

  const handleMediaSelect = (media: any) => {
    if (mediaPickerTarget !== null) {
      update(mediaPickerTarget, "image", media.url);
    }
    setMediaPickerTarget(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
        {teachers.map((t, i) => (
          <div key={i} className="p-4 border border-gray-100 rounded-lg bg-gray-50 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Teacher {i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#0f7f6d]" value={t.name} onChange={e => update(i, "name", e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role / Department</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#0f7f6d]" value={t.role} onChange={e => update(i, "role", e.target.value)} placeholder="e.g. Head of Science" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 cursor-pointer" onClick={() => setMediaPickerTarget(i)}>
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><span className="material-icons-outlined text-sm">image</span></div>
                  )}
                </div>
                <button type="button" onClick={() => setMediaPickerTarget(i)} className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Choose Image
                </button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={add} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg text-sm hover:border-[#0f7f6d] hover:text-[#0f7f6d] transition">
          + Add Teacher
        </button>
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0f7f6d] text-white text-sm font-semibold rounded-lg hover:bg-[#454545] transition disabled:opacity-50">
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
