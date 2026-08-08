import Link from "next/link";
import { format } from "date-fns";

export function SchoolProfileHeader({ contact, schoolName, menuItems, cta }: { contact: any, schoolName: string, menuItems: any[], cta: any }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');` }} />
      <div className="bg-[#454545] text-gray-300 py-2 text-sm hidden lg:block">
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#0f7f6d]">phone</span> {contact.phone || "+62 812 3456 7890"}</span>
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#0f7f6d]">email</span> {contact.email || "info@smartschool.edu"}</span>
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#0f7f6d]">location_on</span> {contact.address || "123 Education Lane, Jakarta"}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={contact.facebook || "#"} className="hover:text-white transition-colors">Facebook</a>
            <a href={contact.instagram || "#"} className="hover:text-white transition-colors">Instagram</a>
            <a href={contact.youtube || "#"} className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 w-full z-50 bg-white shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0f7f6d] rounded-lg flex items-center justify-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="material-icons-outlined text-2xl">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-[#454545] leading-none">{schoolName}</span>
              <span className="text-xs font-semibold tracking-widest text-[#0f7f6d] uppercase">School</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
            {menuItems.map((item: any, i: number) => (
              <a key={i} href={item.url} className="hover:text-[#0f7f6d] transition-colors">
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="hidden lg:flex items-center gap-4">
            <Link href={cta.primaryButtonUrl || "#"} className="bg-[#0f7f6d] hover:bg-[#454545] text-white px-6 py-2.5 rounded font-semibold transition-all shadow-md flex items-center gap-2 transform hover:scale-105">
              Apply Now
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export function SchoolProfileFooter({ schoolName, about, contact, menuItems }: { schoolName: string, about: any, contact: any, menuItems: any[] }) {
  return (
    <footer className="bg-[#454545] text-gray-300 pt-20 pb-10 border-t-4 border-[#0f7f6d]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0f7f6d] rounded-lg flex items-center justify-center text-white"><span className="material-icons-outlined text-2xl">school</span></div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white leading-none">{schoolName}</span>
                <span className="text-xs font-semibold tracking-widest text-[#0f7f6d] uppercase">School</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              {about.description || "Empowering students to achieve excellence and become future leaders in a globally competitive world."}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#0f7f6d]">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {menuItems.map((item: any, i: number) => (
                <li key={i}><a href={item.url} className="hover:text-[#0f7f6d] transition-colors flex items-center gap-2"><span className="material-icons-outlined text-xs">chevron_right</span> {item.label}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#0f7f6d]">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3"><span className="material-icons-outlined text-[#0f7f6d]">location_on</span> <span>{contact.address || "123 Education Lane, Knowledge City, Jakarta 12345"}</span></li>
              <li className="flex gap-3"><span className="material-icons-outlined text-[#0f7f6d]">phone</span> <span>{contact.phone || "+62 812 3456 7890"}</span></li>
              <li className="flex gap-3"><span className="material-icons-outlined text-[#0f7f6d]">email</span> <span>{contact.email || "info@smartschool.edu"}</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#0f7f6d]">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to our newsletter to receive the latest updates and news.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your Email Address" className="px-4 py-2.5 bg-[#2A4A41] border border-[#3A5A51] rounded text-white text-sm focus:outline-none focus:border-[#0f7f6d]" />
              <button type="submit" className="px-4 py-2.5 bg-[#0f7f6d] hover:bg-white hover:text-[#454545] rounded text-white text-sm font-bold transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-[#2A4A41] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} {schoolName}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
