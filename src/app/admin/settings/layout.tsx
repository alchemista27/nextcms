import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  await requireAuth(["ADMIN"]);
  
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "/admin/settings/general";

  const tabs = [
    { href: "/admin/settings/general", label: "General" },
    { href: "/admin/settings/seo", label: "SEO" },
    { href: "/admin/settings/permalinks", label: "Permalinks" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-48 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    isActive ? "bg-primary text-white" : "text-text-secondary hover:bg-bg hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
