"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PublicHeaderProps {
  phone?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  siteName?: string;
}

export default function PublicHeader({
  phone,
  email,
  address,
  facebook,
  instagram,
  youtube,
  siteName,
}: PublicHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Academics", href: "/academics" },
    { label: "Teachers", href: "/team" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Topbar (Contact info) - Entrance Slide Down */}
      <div className="bg-[#454545] text-gray-300 py-2 text-sm hidden lg:block">
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
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-3" : "bg-white shadow-sm py-4"
        }`}
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? "text-[#0f7f6d] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#0f7f6d]"
                      : "hover:text-[#0f7f6d] transition-colors"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/contact"
              className="bg-[#0f7f6d] hover:bg-[#454545] text-white px-6 py-2.5 rounded font-semibold transition-all shadow-md flex items-center gap-2 transform hover:scale-105"
            >
              Apply Now
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
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={isActive ? "text-[#0f7f6d]" : "hover:text-[#0f7f6d]"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="bg-[#0f7f6d] text-white text-center block w-full py-3 rounded-md shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
