"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuItem } from "@prisma/client";

interface PublicHeaderProps {
  phone?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  siteName?: string;
  menuItems: (MenuItem & { children?: MenuItem[] })[];
}

export default function PublicHeader({
  phone,
  email,
  address,
  facebook,
  instagram,
  youtube,
  siteName,
  menuItems,
}: PublicHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Topbar (Contact info) - Entrance Slide Down */}
      <div className="bg-[#454545] text-gray-300 py-2 text-sm hidden lg:block opacity-0 animate-[slideDown_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {phone && (
              <span className="flex items-center gap-2">
                <span className="material-icons-outlined text-sm text-[#0f7f6d]">phone</span> {phone}
              </span>
            )}
            {email && (
              <span className="flex items-center gap-2">
                <span className="material-icons-outlined text-sm text-[#0f7f6d]">email</span> {email}
              </span>
            )}
            {address && (
              <span className="flex items-center gap-2">
                <span className="material-icons-outlined text-sm text-[#0f7f6d]">location_on</span> {address}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {facebook && (
              <a href={facebook} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                YouTube
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Header / Navbar - Entrance Slide Down with delay */}
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 opacity-0 animate-[slideDown_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards] ${
          isScrolled ? "bg-white shadow-md py-3" : "bg-white shadow-sm py-4"
        }`}
        style={{ animationDelay: "200ms" }}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0f7f6d] rounded-lg flex items-center justify-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="material-icons-outlined text-2xl">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-[#454545] leading-none">
                {siteName?.split(" ")[0] || "SMaRT"}
              </span>
              <span className="text-xs font-semibold tracking-widest text-[#0f7f6d] uppercase">
                {siteName?.split(" ").slice(1).join(" ") || "School"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
            <Link href="/" className="hover:text-[#0f7f6d] transition-colors">Home</Link>
            {menuItems && menuItems.length > 0 ? (
              menuItems
                .filter((item) => !item.parentId)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div key={item.id} className="relative group">
                    <Link
                      href={item.url || "#"}
                      className="hover:text-[#0f7f6d] transition-colors flex items-center gap-1"
                      target={item.target}
                    >
                      {item.label}
                      {item.children && item.children.length > 0 && (
                        <span className="material-icons-outlined text-sm">expand_more</span>
                      )}
                    </Link>
                    {/* Dropdown */}
                    {item.children && item.children.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="py-2">
                          {item.children
                            .sort((a, b) => a.order - b.order)
                            .map((child) => (
                              <Link
                                key={child.id}
                                href={child.url || "#"}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0f7f6d]"
                                target={child.target}
                              >
                                {child.label}
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <>
                <Link href="/about" className="hover:text-[#0f7f6d] transition-colors">About Us</Link>
                <Link href="/team" className="hover:text-[#0f7f6d] transition-colors">Teachers</Link>
                <Link href="/gallery" className="hover:text-[#0f7f6d] transition-colors">Gallery</Link>
                <Link href="/blog" className="hover:text-[#0f7f6d] transition-colors">News</Link>
                <Link href="/contact" className="hover:text-[#0f7f6d] transition-colors">Contact</Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/contact"
              className="bg-[#0f7f6d] hover:bg-[#454545] text-white px-6 py-2.5 rounded font-semibold transition-all shadow-md flex items-center gap-2 transform hover:scale-105"
            >
              Contact Us
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-700 hover:text-[#0f7f6d] focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-icons-outlined text-3xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100">
            <div className="flex flex-col px-6 py-4 space-y-4 font-semibold text-gray-700">
              <Link href="/" className="hover:text-[#0f7f6d]" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              {menuItems && menuItems.length > 0 ? (
                menuItems
                  .filter((item) => !item.parentId)
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <div key={item.id} className="flex flex-col space-y-2">
                      <Link href={item.url || "#"} className="hover:text-[#0f7f6d]" onClick={() => setIsMobileMenuOpen(false)}>
                        {item.label}
                      </Link>
                      {item.children && item.children.length > 0 && (
                        <div className="pl-4 flex flex-col space-y-2 border-l-2 border-gray-100">
                          {item.children
                            .sort((a, b) => a.order - b.order)
                            .map((child) => (
                              <Link
                                key={child.id}
                                href={child.url || "#"}
                                className="text-gray-500 hover:text-[#0f7f6d]"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <>
                  <Link href="/about" className="hover:text-[#0f7f6d]" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                  <Link href="/team" className="hover:text-[#0f7f6d]" onClick={() => setIsMobileMenuOpen(false)}>Teachers</Link>
                  <Link href="/gallery" className="hover:text-[#0f7f6d]" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
                  <Link href="/blog" className="hover:text-[#0f7f6d]" onClick={() => setIsMobileMenuOpen(false)}>News</Link>
                </>
              )}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="bg-[#0f7f6d] text-white text-center block w-full py-3 rounded-md shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
