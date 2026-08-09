"use client";

import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, usePathname } from "next/navigation";
import { type AuthUser } from "@/lib/auth";

export function Header({ user }: { user: AuthUser }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
  }

  // Very basic breadcrumb generation based on pathname
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumb = paths
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" / ");

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="font-semibold text-lg text-text-primary">
        {breadcrumb || "Dashboard"}
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="py-2 pl-9 pr-3 border border-border rounded-full text-sm focus:outline-none focus:border-primary w-64 bg-bg"
          />
        </div>

        <Link href="/admin/profile" className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
          <span className="material-icons-outlined">person</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center text-text-secondary hover:text-danger transition-colors"
          title="Logout"
        >
          <span className="material-icons-outlined">logout</span>
        </button>
      </div>
    </header>
  );
}
