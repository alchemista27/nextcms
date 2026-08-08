"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateSchoolProfileSection } from "@/actions/school-profile";

export default function StatsSectionForm({ initialData }: { initialData: any }) {
  const [form, setForm] = useState({
    students: initialData.students ?? 2500,
    teachers: initialData.teachers ?? 150,
    awards: initialData.awards ?? 85,
    classrooms: initialData.classrooms ?? 45,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSchoolProfileSection("stats", form);
    if (result.error) toast.error(result.error);
    else toast.success("Statistics updated!");
    setSaving(false);
  };

  const fields = [
    { key: "students", label: "Students Enrolled" },
    { key: "teachers", label: "Certified Teachers" },
    { key: "awards", label: "Awards Won" },
    { key: "classrooms", label: "Modern Classrooms" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
      <div className="grid grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {f.label}
            </label>
            <input
              type="number"
              min={0}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]"
              value={(form as any)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: parseInt(e.target.value) || 0 }))}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">These numbers animate counting up when the section scrolls into view.</p>
      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0f7f6d] text-white text-sm font-semibold rounded-lg hover:bg-[#454545] transition disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
