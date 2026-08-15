import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
};

export default async function NotFoundPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: "general_siteTitle" },
  });
  const siteTitle = settings[0]?.value || "SMaRT School";
  const [firstWord, ...rest] = siteTitle.split(" ");
  const restWords = rest.join(" ");

  return (
    <div className="bg-[#F7F8F8] antialiased min-h-screen flex flex-col">
      {/* Navbar (Simplified) */}
      <header className="w-full z-50 bg-white shadow-sm flex-shrink-0">
        <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0f7f6d] rounded-lg flex items-center justify-center text-white">
              <span className="material-icons-outlined text-2xl">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-[#454545] leading-none">{firstWord}</span>
              {restWords && (
                <span className="text-xs font-semibold tracking-widest text-[#0f7f6d] uppercase">{restWords}</span>
              )}
            </div>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-[#0f7f6d] transition-colors font-semibold flex items-center gap-1">
            <span className="material-icons-outlined text-sm">home</span> Back to Home
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden">
        {/* Background graphics */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#0f7f6d]/5 rounded-full filter blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#E3E8E7]/50 rounded-full filter blur-3xl animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }}></div>

        <div className="container mx-auto px-6 md:px-12 text-center relative z-10 animate-[slideUp_0.8s_ease-out]">
          <h1 className="text-9xl font-black text-[#0f7f6d] mb-4 drop-shadow-lg">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-[#454545] mb-4">Oops! Page Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/" className="px-6 py-3 bg-[#454545] hover:bg-[#0f7f6d] text-white rounded font-bold transition-colors flex items-center gap-2">
              <span className="material-icons-outlined text-sm">arrow_back</span> Return Home
            </Link>
            <Link href="/contact" className="px-6 py-3 bg-white border border-gray-200 hover:border-[#0f7f6d] hover:text-[#0f7f6d] text-gray-600 rounded font-bold transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      {/* Basic Keyframes for float/slideUp (normally in global css or tailwind.config) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float { 
          0% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-20px) rotate(5deg); } 
          100% { transform: translateY(0px) rotate(0deg); } 
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}} />
    </div>
  );
}
