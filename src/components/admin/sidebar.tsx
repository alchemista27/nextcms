"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import ArticleIcon from "@mui/icons-material/ArticleOutlined";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import StyleIcon from "@mui/icons-material/StyleOutlined";
import PermMediaIcon from "@mui/icons-material/PermMediaOutlined";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import GroupIcon from "@mui/icons-material/GroupOutlined";
import PaletteIcon from "@mui/icons-material/PaletteOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { clsx } from "clsx";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: DashboardIcon },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: ArticleIcon,
    submenu: [
      { name: "All Posts", href: "/admin/posts" },
      { name: "Add New", href: "/admin/posts/new" },
    ],
  },
  {
    name: "Pages",
    href: "/admin/pages",
    icon: DescriptionIcon,
    submenu: [
      { name: "All Pages", href: "/admin/pages" },
      { name: "Add New", href: "/admin/pages/new" },
    ],
  },
  { name: "Categories", href: "/admin/categories", icon: CategoryIcon },
  { name: "Tags", href: "/admin/tags", icon: StyleIcon },
  { name: "Media", href: "/admin/media", icon: PermMediaIcon },
  { name: "Menus", href: "/admin/menus", icon: MenuIcon },
  { name: "Users", href: "/admin/users", icon: GroupIcon },
  { name: "Appearance", href: "/admin/appearance", icon: PaletteIcon },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: SettingsIcon,
    submenu: [
      { name: "General", href: "/admin/settings/general" },
      { name: "Reading", href: "/admin/settings/reading" },
    ],
  },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (name: string) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#1E3932] text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-center h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-[#00704A] font-bold text-xl leading-none">N</span>
            </div>
            <span className="text-xl font-bold tracking-wide">NextCMS</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            const Icon = item.icon;
            const hasSubmenu = !!item.submenu;
            const isExpanded = expandedMenus[item.name];

            return (
              <div key={item.name}>
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                      isActive ? "bg-[#00704A] text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ExpandMoreIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                      isActive ? "bg-[#00704A] text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <div className="mt-1 space-y-1 pl-11 pr-2">
                    {item.submenu!.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={clsx(
                            "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                            isSubActive ? "text-white font-medium" : "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="border-t border-white/10 p-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#00704A] flex items-center justify-center text-sm font-bold border border-white/20">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-white/60 truncate bg-[#00704A] px-1.5 py-0.5 rounded inline-block mt-0.5">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
