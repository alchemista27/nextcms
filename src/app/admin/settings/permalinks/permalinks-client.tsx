"use client";

import { useState } from "react";
import { saveSettings } from "@/actions/settings";
import SaveIcon from "@mui/icons-material/SaveOutlined";

interface PermalinksClientProps {
  initialSettings: Record<string, string | null>;
}

export default function PermalinksClient({ initialSettings }: PermalinksClientProps) {
  const [settings, setSettings] = useState({
    permalink_structure: initialSettings.permalink_structure || "post_name",
    permalink_custom_pattern: initialSettings.permalink_custom_pattern || "/%postname%/",
    permalink_category_base: initialSettings.permalink_category_base || "category",
    permalink_tag_base: initialSettings.permalink_tag_base || "tag",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const structures = [
    { id: "plain", label: "Plain", preview: "/blog/?p=123" },
    { id: "day_name", label: "Day and name", preview: `/blog/${new Date().getFullYear()}/01/01/sample-post` },
    { id: "month_name", label: "Month and name", preview: `/blog/${new Date().getFullYear()}/01/sample-post` },
    { id: "post_name", label: "Post name", preview: "/blog/sample-post" },
    { id: "custom", label: "Custom Structure", preview: settings.permalink_custom_pattern },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-4xl">
      <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
        <div className="p-6 space-y-6">
          {/* Common Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Common Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Select the permalink structure for your posts.</p>
            <div className="space-y-3">
              {structures.map((s) => (
                <div key={s.id} className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      id={`structure-${s.id}`}
                      name="permalink_structure"
                      value={s.id}
                      checked={settings.permalink_structure === s.id}
                      onChange={(e) => setSettings({ ...settings, permalink_structure: e.target.value })}
                      className="w-4 h-4 text-[#0f7f6d] border-gray-300 focus:ring-[#0f7f6d]"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`structure-${s.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                      {s.label}
                    </label>
                    <p className="text-xs text-gray-500 font-mono mt-1 bg-gray-50 p-1.5 rounded w-fit border border-gray-100">
                      {s.preview}
                    </p>
                    
                    {s.id === "custom" && settings.permalink_structure === "custom" && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={settings.permalink_custom_pattern}
                          onChange={(e) => setSettings({ ...settings, permalink_custom_pattern: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#0f7f6d]"
                          placeholder="/%category%/%postname%/"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['%year%', '%monthnum%', '%day%', '%hour%', '%minute%', '%second%', '%post_id%', '%postname%', '%category%', '%author%'].map((tag: any) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setSettings({
                                ...settings,
                                permalink_custom_pattern: settings.permalink_custom_pattern + tag
                              })}
                              className="text-xs bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded px-2 py-1 text-gray-600 font-mono transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Optional */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Optional</h3>
            <p className="text-sm text-gray-500 mb-4">If you like, you may enter custom structures for your category and tag URLs here.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">Category base</label>
                <input
                  type="text"
                  name="permalink_category_base"
                  value={settings.permalink_category_base}
                  onChange={(e) => setSettings({ ...settings, permalink_category_base: e.target.value })}
                  className="flex-1 max-w-xs border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f7f6d]"
                  placeholder="category"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium text-gray-700">Tag base</label>
                <input
                  type="text"
                  name="permalink_tag_base"
                  value={settings.permalink_tag_base}
                  onChange={(e) => setSettings({ ...settings, permalink_tag_base: e.target.value })}
                  className="flex-1 max-w-xs border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f7f6d]"
                  placeholder="tag"
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
            className="flex items-center gap-2 bg-[#0f7f6d] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#454545] transition-colors disabled:opacity-50"
          >
            <SaveIcon fontSize="small" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
