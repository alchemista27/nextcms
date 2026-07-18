import { AdminShell } from "@/components/admin/admin-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - NextCMS",
  description: "NextCMS Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
