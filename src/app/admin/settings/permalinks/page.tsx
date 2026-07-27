import { getSettings } from "@/actions/settings";
import PermalinksClient from "./permalinks-client";

export default async function PermalinksPage() {
  const keys = [
    "permalink_structure",
    "permalink_custom_pattern",
    "permalink_category_base",
    "permalink_tag_base",
  ];
  const res = await getSettings(keys);
  const initialSettings = res.data || {};

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Permalink Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure the URL structure for your posts and pages.
        </p>
      </div>
      <PermalinksClient initialSettings={initialSettings} />
    </div>
  );
}
