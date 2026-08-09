import Link from "next/link";
import { type AuthUser } from "@/lib/auth";

export function Sidebar({ user }: { user: AuthUser }) {
  return (
    <aside className="w-[260px] bg-primary-dark text-white fixed top-0 bottom-0 left-0 flex flex-col z-40">
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3 text-white text-xl font-bold">
          <span className="material-icons-outlined text-primary">hub</span>
          NextCMS
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <Link href="/admin" className="flex items-center px-5 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-all gap-3 border-l-3 border-transparent hover:border-primary text-[15px]">
          <span className="material-icons-outlined text-[20px]">dashboard</span>
          Dashboard
        </Link>
        <Link href="/admin/posts" className="flex items-center px-5 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-all gap-3 border-l-3 border-transparent hover:border-primary text-[15px]">
          <span className="material-icons-outlined text-[20px]">article</span>
          Posts
        </Link>
        <Link href="/admin/media" className="flex items-center px-5 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-all gap-3 border-l-3 border-transparent hover:border-primary text-[15px]">
          <span className="material-icons-outlined text-[20px]">perm_media</span>
          Media Library
        </Link>
        <Link href="/admin/team" className="flex items-center px-5 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-all gap-3 border-l-3 border-transparent hover:border-primary text-[15px]">
          <span className="material-icons-outlined text-[20px]">badge</span>
          Team Members
        </Link>
        <Link href="/admin/gallery" className="flex items-center px-5 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-all gap-3 border-l-3 border-transparent hover:border-primary text-[15px]">
          <span className="material-icons-outlined text-[20px]">photo_library</span>
          Gallery
        </Link>
        <Link href="/admin/users" className="flex items-center px-5 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-all gap-3 border-l-3 border-transparent hover:border-primary text-[15px]">
          <span className="material-icons-outlined text-[20px]">group</span>
          Users
        </Link>
        <Link href="/admin/settings/general" className="flex items-center px-5 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-all gap-3 border-l-3 border-transparent hover:border-primary text-[15px]">
          <span className="material-icons-outlined text-[20px]">settings</span>
          Settings
        </Link>
      </nav>

      <div className="p-5 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-white uppercase overflow-hidden">
          {user.name?.charAt(0) || user.email.charAt(0)}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{user.name || "Admin User"}</div>
          <div className="text-xs text-white/50 truncate">{user.role}</div>
        </div>
      </div>
    </aside>
  );
}
