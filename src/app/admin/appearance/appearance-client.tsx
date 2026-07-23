"use client";

import { useState, useTransition } from "react";
import { saveSettings } from "@/actions/settings";
import MediaPicker from "@/components/admin/media-picker";
import { useRouter } from "next/navigation";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

interface AppearanceClientProps {
  initialSettings: Record<string, string | null>;
}

export default function AppearanceClient({ initialSettings }: AppearanceClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    appearance_logo: initialSettings.appearance_logo || "",
    appearance_favicon: initialSettings.appearance_favicon || "",
    appearance_primary_color: initialSettings.appearance_primary_color || "#00704A",
    appearance_secondary_color: initialSettings.appearance_secondary_color || "#1E3932",
    appearance_font_family: initialSettings.appearance_font_family || "Inter",
    appearance_header_style: initialSettings.appearance_header_style || "CENTERED",
    appearance_sidebar_position: initialSettings.appearance_sidebar_position || "RIGHT",
    appearance_footer_text: initialSettings.appearance_footer_text || "© 2026 Copyright Jauharian.Dev",
    appearance_custom_css: initialSettings.appearance_custom_css || "",
    appearance_custom_header_script: initialSettings.appearance_custom_header_script || "",
    appearance_custom_footer_script: initialSettings.appearance_custom_footer_script || "",
  });

  const [activeMediaTarget, setActiveMediaTarget] = useState<"logo" | "favicon" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaSelect = (url: string) => {
    if (activeMediaTarget === "logo") {
      setFormData(prev => ({ ...prev, appearance_logo: url }));
    } else if (activeMediaTarget === "favicon") {
      setFormData(prev => ({ ...prev, appearance_favicon: url }));
    }
    setActiveMediaTarget(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await saveSettings(formData);
      if (res.success) {
        alert("Appearance settings saved successfully!");
        router.refresh();
      } else {
        alert(res.error || "Failed to save settings");
      }
    });
  };

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Theme Configuration</h2>
          <button 
            onClick={handleSave} 
            disabled={isPending}
            className="px-4 py-2 bg-[#00704A] text-white text-sm font-medium rounded hover:bg-[#1E3932] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Identity */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Site Identity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Logo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Site Logo</label>
                <div className="border border-dashed border-gray-300 rounded p-4 flex flex-col items-center justify-center min-h-[120px]">
                  {formData.appearance_logo ? (
                    <div className="relative group w-full flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.appearance_logo} alt="Logo" className="max-h-20 object-contain" />
                      <button onClick={() => setFormData(p => ({...p, appearance_logo: ""}))} className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center rounded">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setActiveMediaTarget("logo")} className="text-[#00704A] hover:underline text-sm font-medium flex flex-col items-center gap-1">
                      <ImageOutlinedIcon /> Select Logo
                    </button>
                  )}
                </div>
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Favicon (Site Icon)</label>
                <div className="border border-dashed border-gray-300 rounded p-4 flex flex-col items-center justify-center min-h-[120px]">
                  {formData.appearance_favicon ? (
                    <div className="relative group flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.appearance_favicon} alt="Favicon" className="w-12 h-12 object-contain" />
                      <button onClick={() => setFormData(p => ({...p, appearance_favicon: ""}))} className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center rounded">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setActiveMediaTarget("favicon")} className="text-[#00704A] hover:underline text-sm font-medium flex flex-col items-center gap-1">
                      <ImageOutlinedIcon /> Select Favicon
                    </button>
                  )}
                </div>
              </div>

            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Colors & Fonts */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Colors & Typography</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    name="appearance_primary_color" 
                    value={formData.appearance_primary_color}
                    onChange={handleChange}
                    className="h-10 w-12 border border-gray-300 rounded cursor-pointer"
                  />
                  <input 
                    type="text" 
                    name="appearance_primary_color" 
                    value={formData.appearance_primary_color}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded px-3 text-sm focus:outline-none focus:border-[#00704A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    name="appearance_secondary_color" 
                    value={formData.appearance_secondary_color}
                    onChange={handleChange}
                    className="h-10 w-12 border border-gray-300 rounded cursor-pointer"
                  />
                  <input 
                    type="text" 
                    name="appearance_secondary_color" 
                    value={formData.appearance_secondary_color}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded px-3 text-sm focus:outline-none focus:border-[#00704A]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select 
                  name="appearance_font_family"
                  value={formData.appearance_font_family}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]"
                >
                  <option value="Inter">Inter (Sans-serif)</option>
                  <option value="Roboto">Roboto (Sans-serif)</option>
                  <option value="Lora">Lora (Serif)</option>
                  <option value="Merriweather">Merriweather (Serif)</option>
                  <option value="Fira Code">Fira Code (Monospace)</option>
                </select>
              </div>

            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Layout */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Layout Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Header Style</label>
                <div className="space-y-2">
                  {["CENTERED", "LEFT_ALIGNED", "MINIMAL"].map(style => (
                    <label key={style} className="flex items-center gap-2 text-sm">
                      <input 
                        type="radio" 
                        name="appearance_header_style" 
                        value={style} 
                        checked={formData.appearance_header_style === style}
                        onChange={handleChange}
                        className="text-[#00704A] focus:ring-[#00704A]"
                      />
                      {style.replace("_", " ")}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Position</label>
                <div className="space-y-2">
                  {["LEFT", "RIGHT", "NONE"].map(pos => (
                    <label key={pos} className="flex items-center gap-2 text-sm">
                      <input 
                        type="radio" 
                        name="appearance_sidebar_position" 
                        value={pos} 
                        checked={formData.appearance_sidebar_position === pos}
                        onChange={handleChange}
                        className="text-[#00704A] focus:ring-[#00704A]"
                      />
                      {pos}
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Footer */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Footer</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Copyright Text</label>
              <textarea 
                name="appearance_footer_text"
                value={formData.appearance_footer_text}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A]"
              />
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Advanced Scripts */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Advanced (Custom Code)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
                <textarea 
                  name="appearance_custom_css"
                  value={formData.appearance_custom_css}
                  onChange={handleChange}
                  rows={4}
                  placeholder="/* Enter custom CSS here */"
                  className="w-full font-mono border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A] bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Header Scripts (Inside &lt;head&gt;)</label>
                <textarea 
                  name="appearance_custom_header_script"
                  value={formData.appearance_custom_header_script}
                  onChange={handleChange}
                  rows={4}
                  placeholder="<!-- HTML tags allowed -->"
                  className="w-full font-mono border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A] bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Footer Scripts (Before &lt;/body&gt;)</label>
                <textarea 
                  name="appearance_custom_footer_script"
                  value={formData.appearance_custom_footer_script}
                  onChange={handleChange}
                  rows={4}
                  placeholder="<!-- HTML tags allowed -->"
                  className="w-full font-mono border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00704A] bg-gray-50"
                />
              </div>
            </div>
          </section>

        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={isPending}
            className="px-6 py-2 bg-[#00704A] text-white text-sm font-medium rounded hover:bg-[#1E3932] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {activeMediaTarget && (
        <MediaPicker 
          onClose={() => setActiveMediaTarget(null)}
          onSelect={handleMediaSelect}
        />
      )}
    </div>
  );
}
