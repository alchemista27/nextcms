import { getSettings } from "@/actions/settings";
import SeoSettingsClient from "./seo-settings-client";

export default async function SeoSettingsPage() {
  const seoKeys = [
    "seo_title_template",
    "seo_default_description",
    "seo_og_image",
    "seo_facebook_url",
    "seo_twitter_url",
    "seo_instagram_url",
    "seo_ga_id",
  ];
  
  const res = await getSettings(seoKeys);
  const initialSettings = res.data || {};

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure global search engine optimization and social sharing defaults.
        </p>
      </div>
      <SeoSettingsClient initialSettings={initialSettings} />
    </div>
  );
}
