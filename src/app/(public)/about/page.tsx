import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div>
      {/* Page Hero */}
      <section 
        className="py-24 lg:py-36 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('https://images.unsplash.com/photo-1523580494112-071d38458a4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">About Us</h1>
          <p className="text-gray-300 text-lg mb-6">Dedicated to excellence in education since 2001</p>
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#E3E8E7]">About Us</span>
          </nav>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative pb-8 pr-8">
              <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Our School" className="rounded-lg shadow-2xl w-full relative z-10" />
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Students" className="hidden md:block absolute bottom-0 right-0 w-56 rounded-lg z-20 border-8 border-white shadow-xl" />
              <div className="absolute top-10 -left-10 bg-[#0f7f6d] text-white p-6 rounded-lg shadow-xl z-20 hidden md:flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">25+</span>
                <span className="text-sm font-medium uppercase tracking-widest text-[#E3E8E7]">Years Exp</span>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#454545] mb-6 leading-tight">Building Excellence for Over Two Decades</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2001, SMaRT School began with a simple yet powerful mission: to provide every student with an education that goes beyond textbooks. What started as a small community school has grown into one of Jakarta's most recognized educational institutions.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our dedicated faculty, innovative programs, and commitment to holistic development have produced thousands of graduates who are making meaningful contributions across industries worldwide.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-[#F7F8F8] rounded-lg text-center border-b-2 border-[#0f7f6d]">
                  <h4 className="text-3xl font-bold text-[#0f7f6d] mb-1">2,500+</h4>
                  <p className="text-sm text-gray-500">Current Students</p>
                </div>
                <div className="p-4 bg-[#F7F8F8] rounded-lg text-center border-b-2 border-[#454545]">
                  <h4 className="text-3xl font-bold text-[#454545] mb-1">12,000+</h4>
                  <p className="text-sm text-gray-500">Alumni Worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Our Direction <span className="w-8 h-0.5 bg-[#0f7f6d]"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#454545]">Vision & Mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-lg shadow-sm border-t-4 border-[#0f7f6d] group hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#E3E8E7] text-[#0f7f6d] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0f7f6d] group-hover:text-white transition-colors duration-300">
                <span className="material-icons-outlined text-3xl">visibility</span>
              </div>
              <h3 className="text-2xl font-bold text-[#454545] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be a globally recognized educational institution that cultivates lifelong learners, critical thinkers, and compassionate leaders who contribute positively to an ever-changing world.
              </p>
            </div>
            <div className="bg-[#454545] p-10 rounded-lg shadow-sm group hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mb-6">
                <span className="material-icons-outlined text-3xl">flag</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <ul className="space-y-3 text-[#E3E8E7]/90">
                <li className="flex items-start gap-3"><span className="material-icons-outlined text-[#0f7f6d] mt-0.5 text-sm">check_circle</span> Deliver high-quality, student-centered education</li>
                <li className="flex items-start gap-3"><span className="material-icons-outlined text-[#0f7f6d] mt-0.5 text-sm">check_circle</span> Foster creativity, innovation, and critical thinking</li>
                <li className="flex items-start gap-3"><span className="material-icons-outlined text-[#0f7f6d] mt-0.5 text-sm">check_circle</span> Build strong moral character and civic responsibility</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
