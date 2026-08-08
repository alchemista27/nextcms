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
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TuneIcon from "@mui/icons-material/TuneOutlined";
import CollectionsIcon from "@mui/icons-material/CollectionsOutlined";
import ChatIcon from "@mui/icons-material/ChatOutlined";
import { clsx } from "clsx";

// Theme-specific menu definitions
const themeMenus: Record<
  string,
  { name: string; icon: any; submenu: { name: string; href: string }[] }
> = {
  "school-profile": {
    name: "School Profile",
    icon: SchoolIcon,
    submenu: [
      { name: "Hero Section", href: "/admin/theme/school-profile/hero" },
      { name: "About & Features", href: "/admin/theme/school-profile/about" },
      { name: "Statistics", href: "/admin/theme/school-profile/stats" },
      { name: "Teachers", href: "/admin/theme/school-profile/teachers" },
      { name: "Vision & Mission", href: "/admin/theme/school-profile/vision" },
      { name: "CTA Section", href: "/admin/theme/school-profile/cta" },
      { name: "Contact Info", href: "/admin/theme/school-profile/contact" },
    ],
  },
};

const staticMenuItems = [
  { name: "Dashboard", href: "/admin", icon: DashboardIcon },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: ArticleIcon,
    submenu: [
      { name: "All Posts", href: "/admin/posts" },
      { name: "Add New Post", href: "/admin/posts/new" },
      { name: "Categories", href: "/admin/posts/categories" },
      { name: "Tags", href: "/admin/posts/tags" },
    ],
  },
  { name: "Team & Staff", href: "/admin/team", icon: GroupIcon },
  { name: "Gallery", href: "/admin/gallery", icon: CollectionsIcon },
  { name: "Testimonials", href: "/admin/testimonials", icon: ChatIcon },
  { name: "Media", href: "/admin/media", icon: PermMediaIcon },
  { name: "Menus", href: "/admin/menus", icon: MenuIcon },
  { name: "Users", href: "/admin/users", icon: GroupIcon },
  { name: "Appearance", href: "/admin/appearance", icon: PaletteIcon },
];

const appearanceMenu = {
  name: "Appearance",
  href: "/admin/appearance",
  icon: PaletteIcon,
  submenu: [
    { name: "Select Theme", href: "/admin/appearance" },
  ],
};

const settingsMenu = {
  name: "Settings",
  href: "/admin/settings",
  icon: SettingsIcon,
  submenu: [
    { name: "General", href: "/admin/settings/general" },
    { name: "SEO", href: "/admin/settings/seo" },
    { name: "Permalinks", href: "/admin/settings/permalinks" },
  ],
};

export function Sidebar({
  isOpen,
  setIsOpen,
  activeTheme,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  activeTheme?: string;
}) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSubMenu = (name: string) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const themeMenu = activeTheme ? themeMenus[activeTheme] : null;

  const allMenuItems = [
    ...staticMenuItems,
    appearanceMenu,
    ...(themeMenu ? [{ ...themeMenu, href: `/admin/theme/${activeTheme}` }] : []),
    settingsMenu,
  ];

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
          "fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-center h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-primary font-bold text-xl leading-none">
                A
              </span>
            </div>
            <span className="text-xl font-bold tracking-wide">AlfidaCMS</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3 custom-scrollbar">
          {/* Active theme badge if set */}
          {themeMenu && (
            <div className="mb-3 px-3 py-1.5 rounded-md bg-tertiary/20 border border-tertiary/30">
              <div className="flex items-center gap-2">
                <TuneIcon className="w-3.5 h-3.5 text-tertiary" />
                <span className="text-[10px] font-semibold text-tertiary uppercase tracking-widest">
                  Active Theme
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium mt-0.5 ml-5">
                {themeMenu.name}
              </p>
            </div>
          )}

          {allMenuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            const hasSubmenu = !!(item as any).submenu;
            const isExpanded = expandedMenus[item.name];
            const isThemeItem = activeTheme && item.href === `/admin/theme/${activeTheme}`;

            return (
              <div key={item.name}>
                {/* Divider before theme menu */}
                {isThemeItem && (
                  <div className="my-2 border-t border-white/10 pt-2">
                    <p className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                      Theme Settings
                    </p>
                  </div>
                )}

                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                      isActive
                        ? "bg-tertiary text-white"
                        : isThemeItem
                        ? "text-tertiary hover:bg-white/10 hover:text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
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
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive
                          ? "bg-tertiary/10 text-tertiary font-medium border-l-4 border-tertiary"
                          : "text-gray-300 hover:bg-primary/20 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <div className="mt-1 space-y-1 pl-11 pr-2">
                    {(item as any).submenu.map((sub: any) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={clsx(
                            "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                            isSubActive
                              ? "text-white font-medium"
                              : "text-white/70 hover:text-white hover:bg-white/5"
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
            <div className="w-9 h-9 rounded-full bg-[#0f7f6d] flex items-center justify-center text-sm font-bold border border-white/20">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-white/60 truncate bg-[#0f7f6d] px-1.5 py-0.5 rounded inline-block mt-0.5">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
