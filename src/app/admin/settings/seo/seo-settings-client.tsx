"use client";

import { useState } from "react";
import { saveSettings } from "@/actions/settings";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import { MediaPicker } from "@/components/admin/media-picker";

interface SeoSettingsClientProps {
  initialSettings: Record<string, string | null>;
}

export default function SeoSettingsClient({ initialSettings }: SeoSettingsClientProps) {
  const [settings, setSettings] = useState({
    seo_title_template: initialSettings.seo_title_template || "%title% - %sitename%",
    seo_default_description: initialSettings.seo_default_description || "",
    seo_og_image: initialSettings.seo_og_image || "",
    seo_facebook_url: initialSettings.seo_facebook_url || "",
    seo_twitter_url: initialSettings.seo_twitter_url || "",
    seo_instagram_url: initialSettings.seo_instagram_url || "",
    seo_ga_id: initialSettings.seo_ga_id || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await saveSettings(settings);

    setIsSaving(false);
    if (result.success) {
      setMessage({ type: "success", text: "Settings saved successfully." });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save settings." });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-4xl">
      <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
        <div className="p-6 space-y-6">
          {/* General SEO */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">General SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title Template
                </label>
                <input
                  type="text"
                  name="seo_title_template"
                  value={settings.seo_title_template}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                  placeholder="%title% - %sitename%"
                />
                <p className="text-xs text-gray-500 mt-1">Available tags: %title%, %sitename%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Meta Description
                </label>
                <textarea
                  name="seo_default_description"
                  value={settings.seo_default_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A] resize-none"
                  placeholder="Used when a page/post doesn't have a specific description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Open Graph Image
                </label>
                <div 
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer w-64"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  {settings.seo_og_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={settings.seo_og_image} alt="OG Image" className="w-full h-auto rounded" />
                  ) : (
                    <>
                      <ImageIcon className="text-gray-400 mb-2" />
                      <span className="text-sm font-medium">Select Image</span>
                    </>
                  )}
                </div>
                {settings.seo_og_image && (
                  <button 
                    type="button"
                    onClick={() => setSettings(prev => ({...prev, seo_og_image: ""}))}
                    className="text-sm text-red-600 hover:underline mt-2 block"
                  >
                    Remove image
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1">Used when sharing pages on social media if no specific image is set.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Social Profiles */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Profiles</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  name="seo_facebook_url"
                  value={settings.seo_facebook_url}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                <input
                  type="url"
                  name="seo_twitter_url"
                  value={settings.seo_twitter_url}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  name="seo_instagram_url"
                  value={settings.seo_instagram_url}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Analytics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics Measurement ID</label>
                <input
                  type="text"
                  name="seo_ga_id"
                  value={settings.seo_ga_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex items-center justify-between rounded-b-lg">
          <div>
            {message && (
              <span className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {message.text}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#00704A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#1E3932] transition-colors disabled:opacity-50"
          >
            <SaveIcon fontSize="small" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      <MediaPicker
        open={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media) => {
          setSettings(prev => ({...prev, seo_og_image: media.url}));
        }}
      />
    </div>
  );
}
