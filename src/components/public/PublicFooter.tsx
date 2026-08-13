"use client";

import Link from "next/link";
import { MenuItem } from "@prisma/client";

interface PublicFooterProps {
  phone?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  siteName?: string;
  siteDescription?: string;
  footerMenus?: MenuItem[];
}

export default function PublicFooter({
  phone,
  email,
  address,
  facebook,
  instagram,
  youtube,
  siteName,
  siteDescription,
  footerMenus,
}: PublicFooterProps) {
  return (
    <footer className="bg-[#454545] text-gray-300 py-16 border-t-4 border-[#0f7f6d]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#0f7f6d] rounded flex items-center justify-center text-white">
                <span className="material-icons-outlined text-xl">school</span>
              </div>
              <span className="font-bold text-xl text-white">
                {siteName || "SMaRT School"}
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed">
              {siteDescription ||
                "Providing high-quality education and nurturing environments that empower students to become leaders of tomorrow."}
            </p>
            <div className="flex gap-4">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0f7f6d] transition-colors"
                >
                  <span className="material-icons-outlined text-sm">facebook</span>
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0f7f6d] transition-colors"
                >
                  <span className="material-icons-outlined text-sm">camera_alt</span>
                </a>
              )}
              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0f7f6d] transition-colors"
                >
                  <span className="material-icons-outlined text-sm">play_arrow</span>
                </a>
              )}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#0f7f6d]">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {footerMenus && footerMenus.length > 0 ? (
                footerMenus
                  .sort((a, b) => a.order - b.order)
                  .map((menu) => (
                    <li key={menu.id}>
                      <Link
                        href={menu.url || "#"}
                        target={menu.target}
                        className="hover:text-[#0f7f6d] transition-colors flex items-center gap-2"
                      >
                        <span className="material-icons-outlined text-xs">
                          chevron_right
                        </span>{" "}
                        {menu.label}
                      </Link>
                    </li>
                  ))
              ) : (
                <>
                  <li>
                    <Link href="/about" className="hover:text-[#0f7f6d] transition-colors flex items-center gap-2">
                      <span className="material-icons-outlined text-xs">chevron_right</span> About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-[#0f7f6d] transition-colors flex items-center gap-2">
                      <span className="material-icons-outlined text-xs">chevron_right</span> Latest News
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#0f7f6d] transition-colors flex items-center gap-2">
                      <span className="material-icons-outlined text-xs">chevron_right</span> Contact Us
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#0f7f6d]">
              Contact Info
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="material-icons-outlined text-[#0f7f6d] mt-0.5">
                  location_on
                </span>
                <span className="whitespace-pre-line">
                  {address || "123 Education Lane,\nJakarta, Indonesia 10110"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-icons-outlined text-[#0f7f6d]">phone</span>
                <span>{phone || "+62 812 3456 7890"}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-icons-outlined text-[#0f7f6d]">email</span>
                <span>{email || "info@smartschool.edu"}</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#0f7f6d]">
              Newsletter
            </h4>
            <p className="mb-4 text-sm">
              Subscribe to our newsletter to get latest updates.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your Email Address"
                className="bg-white/5 border border-white/10 px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#0f7f6d] text-white"
              />
              <button
                type="submit"
                className="bg-[#0f7f6d] hover:bg-white hover:text-[#0f7f6d] transition-colors text-white px-4 py-2.5 rounded text-sm font-bold uppercase tracking-wider"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {siteName || "NextCMS"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
