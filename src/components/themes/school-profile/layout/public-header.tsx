import Link from "next/link";
import { getAppearanceSettings } from "@/actions/appearance";
import { getMenus } from "@/actions/menu";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default async function PublicHeader() {
  const { data: appearance } = await getAppearanceSettings();
  const menusResponse = await getMenus();
  const menus = menusResponse.success && menusResponse.data ? menusResponse.data : [];
  
  // Find the primary menu or fallback
  const headerMenu = menus.find((m: any) => m.location === "Header") || menus[0];

  return (
    <>
      {/* Topbar */}
      <div className="bg-schoolSecondary text-gray-300 py-2 text-sm hidden lg:block animate-slide-down">
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <LocalPhoneIcon className="w-4 h-4 text-schoolPrimary" /> +62 812 3456 7890
            </span>
            <span className="flex items-center gap-2">
              <EmailIcon className="w-4 h-4 text-schoolPrimary" /> info@smartschool.edu
            </span>
            <span className="flex items-center gap-2">
              <LocationOnIcon className="w-4 h-4 text-schoolPrimary" /> Jl. Pendidikan No. 1, Jakarta
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white transition-colors">YouTube</Link>
          </div>
        </div>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 w-full z-50 bg-white shadow-sm transition-all duration-300 animate-slide-down" style={{ animationDelay: "200ms" }}>
        <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-schoolPrimary rounded-lg flex items-center justify-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <SchoolIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-schoolSecondary leading-none">SMaRT</span>
              <span className="text-xs font-semibold tracking-widest text-schoolPrimary uppercase">School</span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
            <Link href="/" className="hover:text-schoolPrimary transition-colors">Home</Link>
            {headerMenu?.items?.map((item: any) => (
              <Link
                key={item.id}
                href={item.url || "#"}
                target={item.target}
                className="hover:text-schoolPrimary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="bg-schoolPrimary hover:bg-schoolSecondary text-white px-6 py-2.5 rounded font-semibold transition-all shadow-md flex items-center gap-2 transform hover:scale-105">
              Admin Login
              <ArrowForwardIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
