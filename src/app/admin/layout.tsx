import { AdminShell } from "@/components/admin/admin-shell";
import { getAppearanceSettings } from "@/actions/appearance";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - NextCMS",
  description: "NextCMS Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: appearance } = await getAppearanceSettings();
  const activeTheme = (appearance?.active_theme as string) || "school-profile";

  return <AdminShell activeTheme={activeTheme}>{children}</AdminShell>;
}
