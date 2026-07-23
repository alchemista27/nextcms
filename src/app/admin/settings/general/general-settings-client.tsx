"use client";

import { useState, useTransition } from "react";
import { saveSettings } from "@/actions/settings";
import { generalSettingsSchema } from "@/lib/validators/settings";
import { useRouter } from "next/navigation";

interface GeneralSettingsClientProps {
  initialSettings: Record<string, string | null>;
}

export default function GeneralSettingsClient({ initialSettings }: GeneralSettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    site_title: initialSettings.site_title || "NextCMS",
    site_tagline: initialSettings.site_tagline || "Just another NextCMS site",
    site_url: initialSettings.site_url || "http://localhost:3000",
    admin_email: initialSettings.admin_email || "",
    language: initialSettings.language || "en",
    timezone: initialSettings.timezone || "UTC",
    date_format: initialSettings.date_format || "MM/DD/YYYY",
    time_format: initialSettings.time_format || "HH:mm",
    posts_per_page: initialSettings.posts_per_page || "10",
    registration_open: initialSettings.registration_open || "true",
    default_role: initialSettings.default_role || "SUBSCRIBER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked ? "true" : "false" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        const validated = generalSettingsSchema.parse(formData);
        const res = await saveSettings(validated);
        
        if (res.success) {
          alert("Settings saved successfully!");
          router.refresh();
        } else {
          setError(res.error || "Failed to save settings");
        }
      } catch (err: any) {
        setError(err.errors?.[0]?.message || "Validation failed");
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-4xl">
      <div className="p-6 space-y-8">
        
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Site Title</h3>
            <p className="text-xs text-gray-500 mt-1">The name of your site.</p>
          </div>
          <div className="md:col-span-2">
            <input 
              type="text" 
              name="site_title"
              value={formData.site_title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]"
            />
          </div>
        </div>
        
        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Tagline</h3>
            <p className="text-xs text-gray-500 mt-1">In a few words, explain what this site is about.</p>
          </div>
          <div className="md:col-span-2">
            <input 
              type="text" 
              name="site_tagline"
              value={formData.site_tagline}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Site Address (URL)</h3>
          </div>
          <div className="md:col-span-2">
            <input 
              type="url" 
              name="site_url"
              value={formData.site_url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Administration Email Address</h3>
            <p className="text-xs text-gray-500 mt-1">This address is used for admin purposes.</p>
          </div>
          <div className="md:col-span-2">
            <input 
              type="email" 
              name="admin_email"
              value={formData.admin_email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Membership</h3>
          </div>
          <div className="md:col-span-2 space-y-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input 
                type="checkbox" 
                name="registration_open"
                checked={formData.registration_open === "true"}
                onChange={handleChange}
                className="text-[#00704A] focus:ring-[#00704A] rounded"
              />
              Anyone can register
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New User Default Role</label>
              <select 
                name="default_role"
                value={formData.default_role}
                onChange={handleChange}
                className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]"
              >
                <option value="SUBSCRIBER">Subscriber</option>
                <option value="AUTHOR">Author</option>
                <option value="EDITOR">Editor</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Reading Settings</h3>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Blog pages show at most</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                name="posts_per_page"
                value={formData.posts_per_page}
                onChange={handleChange}
                min="1"
                className="w-20 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]"
              />
              <span className="text-sm text-gray-600">posts</span>
            </div>
          </div>
        </div>

      </div>
      
      <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-lg">
        <button 
          onClick={handleSave} 
          disabled={isPending}
          className="px-6 py-2 bg-[#00704A] text-white text-sm font-medium rounded hover:bg-[#1E3932] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
