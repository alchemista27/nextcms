import { getSettings } from "@/actions/settings";
import AppearanceClient from "./appearance-client";
import { Metadata } from "next";
import { requireRole } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Appearance Settings - NextCMS Admin",
};

export default async function AppearancePage() {
  await requireRole(["ADMIN"]);

  const appearanceKeys = [
    "appearance_logo",
    "appearance_favicon",
    "appearance_primary_color",
    "appearance_secondary_color",
    "appearance_font_family",
    "appearance_header_style",
    "appearance_sidebar_position",
    "appearance_footer_text",
    "appearance_custom_css",
    "appearance_custom_header_script",
    "appearance_custom_footer_script",
  ];

  const res = await getSettings(appearanceKeys);
  const settings = res.success && res.data ? res.data : {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Appearance</h1>
        <p className="text-sm text-gray-500 mt-1">Customize the visual presentation of your site.</p>
      </div>

      <AppearanceClient initialSettings={settings} />
    </div>
  );
}
