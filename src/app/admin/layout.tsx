import { requireAuth } from "@/lib/auth";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";

export const metadata = {
  title: "Admin Dashboard - Alfida CMS",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="flex min-h-screen bg-bg text-text-primary">
      <Sidebar user={user} />
      <div className="flex-1 ml-[260px] flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
