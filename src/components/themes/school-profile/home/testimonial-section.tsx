import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

export default function TestimonialSection({ testimonials }: { testimonials: any[] }) {
  const displayTestimonials = testimonials.length > 0 ? testimonials.slice(0, 3) : [
    {
      id: 1,
      name: "John Doe",
      role: "Alumni 2020",
      content: "SMaRT School has provided me with the foundation I needed to succeed in my university studies. The teachers are incredible.",
      avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Parent",
      content: "I have seen a remarkable transformation in my child's confidence and academic performance since joining this school.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 3,
      name: "Michael Johnson",
      role: "Alumni 2018",
      content: "The extracurricular programs and global partnerships opened doors for me that I never thought possible.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <section className="py-20 bg-schoolGraylight">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-schoolPrimary font-semibold mb-2 uppercase tracking-widest text-sm">
            <span className="w-8 h-0.5 bg-schoolPrimary"></span> Testimonials <span className="w-8 h-0.5 bg-schoolPrimary"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-schoolSecondary">What People Say About Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative group hover:shadow-xl transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <FormatQuoteIcon className="absolute top-4 right-4 text-schoolAccent/50 w-12 h-12 rotate-180" />
              <p className="text-gray-600 mb-6 relative z-10 italic">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-schoolPrimary/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={testimonial.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-schoolSecondary leading-tight">{testimonial.name}</h4>
                  <p className="text-sm text-schoolPrimary font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
