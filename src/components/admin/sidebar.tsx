import Link from "next/link";
import { type AuthUser } from "@/lib/auth";

const navItems = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/posts", icon: "article", label: "Posts" },
  { href: "/admin/media", icon: "perm_media", label: "Media Library" },
  { href: "/admin/categories", icon: "folder", label: "Categories" },
  { href: "/admin/tags", icon: "local_offer", label: "Tags" },
  { href: "/admin/team", icon: "badge", label: "Team Members" },
  { href: "/admin/gallery", icon: "photo_library", label: "Gallery" },
  { href: "/admin/testimonials", icon: "format_quote", label: "Testimonials" },
  { href: "/admin/appearance", icon: "palette", label: "Appearance" },
  { href: "/admin/users", icon: "group", label: "Users" },
  { href: "/admin/settings/general", icon: "settings", label: "Settings" },
];

export function Sidebar({ user }: { user: AuthUser }) {
  return (
    <aside className="w-[260px] bg-primary-dark text-white fixed top-0 bottom-0 left-0 flex flex-col z-40">
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3 text-white text-xl font-bold">
          <span className="material-icons-outlined text-primary">hub</span>
          NextCMS
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center px-5 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-all gap-3 border-l-3 border-transparent hover:border-primary text-[15px]"
          >
            <span className="material-icons-outlined text-[20px]">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-5 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-white uppercase overflow-hidden shrink-0">
          {user.name?.charAt(0) || user.email.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{user.name || "Admin User"}</div>
          <div className="text-xs text-white/50 truncate">{user.role}</div>
        </div>
        <Link href="/admin/profile" className="text-white/50 hover:text-white transition shrink-0">
          <span className="material-icons-outlined text-[18px]">account_circle</span>
        </Link>
      </div>
    </aside>
  );
}
