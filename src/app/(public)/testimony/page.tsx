import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials - Voices of Our Community",
  description: "Read what our students, parents, and alumni have to say about SMaRT School.",
};

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-[#F7F8F8] antialiased">
      {/* Page Hero */}
      <section className="py-24 lg:py-36 relative bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Testimonials</h1>
          <p className="text-gray-300 text-lg mb-6">What our students, parents, and alumni say about our School</p>
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#E3E8E7]">Testimonials</span>
          </nav>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-[#0f7f6d]">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-white">98%</h3>
            <p className="text-[#E3E8E7] text-sm font-medium mt-1">Parent Satisfaction</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white">4.9</h3>
            <p className="text-[#E3E8E7] text-sm font-medium mt-1">Average Rating</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white">12k+</h3>
            <p className="text-[#E3E8E7] text-sm font-medium mt-1">Alumni Worldwide</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white">25+</h3>
            <p className="text-[#E3E8E7] text-sm font-medium mt-1">Years of Excellence</p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Voices <span className="w-8 h-0.5 bg-[#0f7f6d]"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#454545]">What Our Community Says</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimony, index) => {
              const isDark = index % 3 === 2; // Make every 3rd card dark for visual variety
              const rating = testimony.rating || 5;

              return (
                <div 
                  key={testimony.id} 
                  className={`p-8 rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    isDark 
                      ? 'bg-[#454545] text-white' 
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`material-icons-outlined text-sm ${i < Math.floor(rating) ? 'text-[#FFC107]' : (isDark ? 'text-gray-500' : 'text-gray-300')}`}>
                        {i < Math.floor(rating) ? 'star' : (i < rating ? 'star_half' : 'star_border')}
                      </span>
                    ))}
                  </div>
                  
                  <span className="material-icons-outlined text-5xl text-[#E3E8E7] mb-4">format_quote</span>
                  
                  <p className={`${isDark ? 'text-[#E3E8E7]/90' : 'text-gray-600'} mb-6 italic leading-relaxed`}>
                    "{testimony.content}"
                  </p>
                  
                  <div className={`flex items-center gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <img 
                      src={testimony.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimony.name)}&background=0f7f6d&color=fff`} 
                      className="w-12 h-12 rounded-full object-cover" 
                      alt={testimony.name} 
                    />
                    <div>
                      <h5 className={`font-bold ${isDark ? 'text-white' : 'text-[#454545]'}`}>{testimony.name}</h5>
                      <p className="text-xs text-[#0f7f6d] font-medium">{testimony.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {testimonials.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No testimonials have been published yet.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#454545] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our School Family</h2>
          <p className="text-[#E3E8E7]/80 mb-10 max-w-xl mx-auto">
            Thousands of students, parents, and alumni trust us. We'd love for you to become part of our story.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-[#0f7f6d] hover:bg-white hover:text-[#0f7f6d] text-white rounded font-bold transition-all transform hover:-translate-y-1 shadow-lg">
              Enroll Now
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white hover:bg-white text-white hover:text-[#454545] rounded font-bold transition-all transform hover:-translate-y-1">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
