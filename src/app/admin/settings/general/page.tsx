import { getSettings } from "@/actions/settings";
import GeneralSettingsClient from "./general-settings-client";
import { Metadata } from "next";
import { requireRole } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "General Settings - NextCMS Admin",
};

export default async function GeneralSettingsPage() {
  await requireRole(["ADMIN"]);

  const keys = [
    "site_title",
    "site_tagline",
    "site_url",
    "admin_email",
    "language",
    "timezone",
    "date_format",
    "time_format",
    "posts_per_page",
    "registration_open",
    "default_role",
  ];

  const res = await getSettings(keys);
  const settings = res.success && res.data ? res.data : {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">General Settings</h1>
      </div>

      <GeneralSettingsClient initialSettings={settings} />
    </div>
  );
}
