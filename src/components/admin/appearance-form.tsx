"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appearanceSchema, type AppearanceInput } from "@/lib/validators/appearance";
import { updateAppearanceSettings } from "@/actions/appearance";
import { toast } from "sonner";
// Import icons if needed, using simple text for now to avoid dependencies issues

export default function AppearanceForm({ initialData }: { initialData: Partial<AppearanceInput> }) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Set default values combining initialData and our empty defaults
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AppearanceInput>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      active_theme: initialData.active_theme || "school-profile",
      theme_school_profile: {
        hero: initialData.theme_school_profile?.hero || { title: "", subtitle: "", backgroundImage: "" },
        visionMission: initialData.theme_school_profile?.visionMission || { vision: "", missions: [] },
        principal: initialData.theme_school_profile?.principal || { name: "", message: "", image: "" },
        stats: initialData.theme_school_profile?.stats || { students: 0, teachers: 0, awards: 0 },
        cta: initialData.theme_school_profile?.cta || { title: "", subtitle: "", buttonText: "", buttonUrl: "" }
      },
      logo: initialData.logo || "",
      favicon: initialData.favicon || "",
      primary_color: initialData.primary_color || "#00704A",
      secondary_color: initialData.secondary_color || "#1E3932",
      font_family: initialData.font_family || "Inter",
      header_style: initialData.header_style || "left-aligned",
      sidebar_position: initialData.sidebar_position || "right",
      footer_text: initialData.footer_text || "© 2026 NextCMS. All rights reserved.",
      custom_css: initialData.custom_css || "",
      custom_head: initialData.custom_head || "",
      custom_footer: initialData.custom_footer || "",
    }
  });

  const activeTheme = watch("active_theme");

  const onSubmit = async (data: AppearanceInput) => {
    setIsSaving(true);
    
    // Convert comma separated string to array if needed for missions
    if (typeof data.theme_school_profile?.visionMission?.missions === 'string') {
       data.theme_school_profile.visionMission.missions = (data.theme_school_profile.visionMission.missions as string).split(',').map(m => m.trim());
    }

    try {
      const result = await updateAppearanceSettings(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Appearance settings saved successfully!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-12">

      {/* General Settings Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">General Appearance</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Active Theme</label>
            <select 
              {...register("active_theme")}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
            >
              <option value="school-profile">School Profile</option>
              <option value="company-profile">Company Profile (Coming Soon)</option>
              <option value="news-portal">News Portal (Coming Soon)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Primary Color</label>
            <input 
              type="color" 
              {...register("primary_color")}
              className="h-10 w-full rounded-md border border-gray-300 p-1 cursor-pointer"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Footer Text</label>
            <input 
              type="text" 
              {...register("footer_text")}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
            />
          </div>

        </div>
      </div>

      {/* Theme Specific Settings */}
      {activeTheme === "school-profile" && (
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">School Profile: Hero Section</h2>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Hero Title</label>
                <input 
                  type="text" 
                  {...register("theme_school_profile.hero.title")}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
                  placeholder="e.g. Welcome to SMA Antigravity"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Hero Subtitle</label>
                <textarea 
                  {...register("theme_school_profile.hero.subtitle")}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
                  placeholder="e.g. Building the future leaders of tomorrow."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Vision Mission */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">School Profile: Vision & Mission</h2>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Vision</label>
                <textarea 
                  {...register("theme_school_profile.visionMission.vision")}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Missions (Comma separated)</label>
                <textarea 
                  {...register("theme_school_profile.visionMission.missions")}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
                  placeholder="Mission 1, Mission 2, Mission 3"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">School Profile: Statistics</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Total Students</label>
                <input 
                  type="number" 
                  {...register("theme_school_profile.stats.students", { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Total Teachers</label>
                <input 
                  type="number" 
                  {...register("theme_school_profile.stats.teachers", { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Total Awards</label>
                <input 
                  type="number" 
                  {...register("theme_school_profile.stats.awards", { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A] sm:text-sm"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isSaving}
          className="inline-flex justify-center rounded-md border border-transparent bg-[#00704A] py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-[#1E3932] focus:outline-none focus:ring-2 focus:ring-[#00704A] focus:ring-offset-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </form>
  );
}
