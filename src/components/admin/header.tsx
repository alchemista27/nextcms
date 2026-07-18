"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { clsx } from "clsx";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Simple breadcrumb logic based on pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
    return (
      <span key={segment} className="flex items-center">
        {index > 0 && <span className="mx-2 text-gray-400">/</span>}
        <span className={clsx("text-sm", isLast ? "font-semibold text-gray-800" : "text-gray-500")}>
          {title}
        </span>
      </span>
    );
  });

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <MenuIcon />
        </button>
        <div className="hidden sm:flex items-center">
          {breadcrumbs}
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-5">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center text-sm font-medium text-gray-600 hover:text-[#00704A] transition-colors"
        >
          <span className="mr-1">Visit Site</span>
          <OpenInNewIcon fontSize="small" />
        </Link>

        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00704A] focus:border-[#00704A]"
          />
        </div>

        <button className="relative p-1 text-gray-500 hover:text-gray-700 transition-colors">
          <NotificationsIcon />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center focus:outline-none"
          >
            <AccountCircleIcon className="text-gray-600 w-8 h-8" />
          </button>
          
          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@nextcms.local</p>
                </div>
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
