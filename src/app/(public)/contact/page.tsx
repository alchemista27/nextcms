import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div>
      {/* Page Hero */}
      <section 
        className="py-24 lg:py-36 bg-cover bg-center relative"
        style={{ backgroundImage: "linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg mb-6">We'd love to hear from you</p>
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#E3E8E7]">Contact</span>
          </nav>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-sm border-b-4 border-[#0f7f6d] text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-[#E3E8E7] text-[#0f7f6d] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-outlined text-3xl">location_on</span>
              </div>
              <h3 className="text-xl font-bold text-[#454545] mb-2">Visit Us</h3>
              <p className="text-gray-500 text-sm whitespace-pre-line">
                123 Education Lane,{"\n"}Jakarta, Indonesia 10110
              </p>
            </div>

            <div className="bg-[#0f7f6d] p-8 rounded-lg shadow-xl text-center text-white hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-outlined text-3xl">phone</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-[#E3E8E7]/90 text-sm mb-1">+62 812 3456 7890</p>
              <p className="text-[#E3E8E7]/90 text-sm">Mon - Fri, 8:00am - 4:00pm</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border-b-4 border-[#0f7f6d] text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-[#E3E8E7] text-[#0f7f6d] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-outlined text-3xl">email</span>
              </div>
              <h3 className="text-xl font-bold text-[#454545] mb-2">Email Us</h3>
              <p className="text-gray-500 text-sm mb-1">info@smartschool.edu</p>
              <p className="text-gray-500 text-sm">admission@smartschool.edu</p>
            </div>
          </div>

          {/* Form & Map */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
            {/* Form */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#454545] mb-2">Send a Message</h2>
                <p className="text-gray-500">Fill out the form below and our team will get back to you shortly.</p>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-[#F7F8F8] border border-gray-200 rounded focus:outline-none focus:border-[#0f7f6d] focus:ring-1 focus:ring-[#0f7f6d] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-[#F7F8F8] border border-gray-200 rounded focus:outline-none focus:border-[#0f7f6d] focus:ring-1 focus:ring-[#0f7f6d] transition-colors" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input type="text" placeholder="How can we help?" className="w-full px-4 py-3 bg-[#F7F8F8] border border-gray-200 rounded focus:outline-none focus:border-[#0f7f6d] focus:ring-1 focus:ring-[#0f7f6d] transition-colors" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea rows={5} placeholder="Your message here..." className="w-full px-4 py-3 bg-[#F7F8F8] border border-gray-200 rounded focus:outline-none focus:border-[#0f7f6d] focus:ring-1 focus:ring-[#0f7f6d] transition-colors resize-none"></textarea>
                </div>
                
                <button type="submit" className="px-8 py-4 bg-[#0f7f6d] hover:bg-[#454545] text-white rounded font-bold transition-colors w-full shadow-md flex items-center justify-center gap-2">
                  <span className="material-icons-outlined text-sm">send</span> Send Message
                </button>
              </form>
            </div>
            
            {/* Map Placeholder */}
            <div className="w-full lg:w-1/2 bg-gray-200 min-h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24009776953!2d106.75874872242095!3d-6.229746499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1689139857973!5m2!1sen!2sus" 
                className="w-full h-full border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
