"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateSchoolProfileSection } from "@/actions/school-profile";

export default function VisionMissionForm({ initialData }: { initialData: any }) {
  const [vision, setVision] = useState(initialData.vision || "To be a world-class educational institution that develops students into excellent, faithful, and independent individuals.");
  const [missions, setMissions] = useState<string[]>(
    Array.isArray(initialData.missions) && initialData.missions.length > 0
      ? initialData.missions
      : [
          "Provide quality education based on noble values and global competencies.",
          "Create an innovative and student-centered learning environment.",
          "Build strong partnerships with parents, communities, and industry.",
          "Develop creative, critical, and entrepreneurial students.",
        ]
  );
  const [saving, setSaving] = useState(false);

  const addMission = () => setMissions(p => [...p, ""]);
  const removeMission = (i: number) => setMissions(p => p.filter((_, idx) => idx !== i));
  const updateMission = (i: number, val: string) => setMissions(p => p.map((m, idx) => idx === i ? val : m));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSchoolProfileSection("visionMission", { vision, missions: missions.filter(Boolean) });
    if (result.error) toast.error(result.error);
    else toast.success("Vision & Mission updated!");
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vision Statement</label>
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]"
          value={vision}
          onChange={e => setVision(e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Mission Items</label>
          <button type="button" onClick={addMission} className="text-xs px-3 py-1.5 bg-[#D4E9E2] text-[#454545] font-semibold rounded-lg hover:bg-[#0f7f6d] hover:text-white transition">
            + Add Mission
          </button>
        </div>
        <div className="space-y-2">
          {missions.map((m, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-xs text-gray-400 font-mono w-5 text-right">{i + 1}.</span>
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f7f6d]"
                value={m}
                onChange={e => updateMission(i, e.target.value)}
                placeholder={`Mission ${i + 1}`}
              />
              <button type="button" onClick={() => removeMission(i)} className="text-red-400 hover:text-red-600 text-lg leading-none px-1">×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0f7f6d] text-white text-sm font-semibold rounded-lg hover:bg-[#454545] transition disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
