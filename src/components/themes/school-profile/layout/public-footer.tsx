import Link from "next/link";
import { getAppearanceSettings } from "@/actions/appearance";
import SchoolIcon from "@mui/icons-material/School";

export default async function PublicFooter() {
  const { data: appearance } = await getAppearanceSettings();
  const footerText = appearance?.footer_text || "© 2026 SMaRT School. All rights reserved.";

  return (
    <footer className="bg-schoolSecondary text-white py-12 border-t-4 border-schoolPrimary mt-auto">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SchoolIcon className="w-8 h-8 text-schoolPrimary" />
            <span className="font-bold text-2xl">SMaRT School</span>
          </div>
          <p className="text-gray-400 text-sm">
            Empowering students to achieve excellence and become future leaders in a globalized world.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-schoolAccent">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/" className="hover:text-schoolPrimary">Home</Link></li>
            <li><Link href="#about" className="hover:text-schoolPrimary">About Us</Link></li>
            <li><Link href="#academics" className="hover:text-schoolPrimary">Academics</Link></li>
            <li><Link href="#teachers" className="hover:text-schoolPrimary">Teachers</Link></li>
            <li><Link href="/blog" className="hover:text-schoolPrimary">News & Events</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-schoolAccent">Contact</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Jl. Pendidikan No. 1, Jakarta</li>
            <li>+62 812 3456 7890</li>
            <li>info@smartschool.edu</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-schoolAccent">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Subscribe to get the latest updates.</p>
          <div className="flex">
            <input type="email" placeholder="Your email" className="px-4 py-2 w-full text-black rounded-l outline-none" />
            <button className="bg-schoolPrimary px-4 py-2 rounded-r font-bold hover:bg-schoolPrimary/90">
              Go
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
        {footerText}
      </div>
    </footer>
  );
}
