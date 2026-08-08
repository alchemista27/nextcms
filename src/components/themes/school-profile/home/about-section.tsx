import CheckIcon from "@mui/icons-material/Check";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-schoolGraylight overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Composition */}
          <div className="w-full lg:w-1/2 relative pb-8 pr-8 animate-fade-in-up">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="About SMaRT School" className="relative z-10 rounded-lg shadow-2xl w-full" />
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Students studying" className="absolute bottom-[-30px] right-[-30px] z-20 border-[10px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-lg w-2/3 max-w-[300px] hidden md:block" />
            
            {/* Experience Badge */}
            <div className="absolute top-10 -left-10 bg-schoolPrimary text-white p-6 rounded-lg shadow-xl z-20 hidden md:flex flex-col items-center justify-center animate-bounce" style={{ animationDuration: "3s" }}>
              <span className="text-4xl font-bold">25+</span>
              <span className="text-sm font-medium uppercase tracking-widest text-schoolAccent">Years Exp</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 text-schoolPrimary font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-schoolPrimary"></span> About Our Institution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-schoolSecondary mb-6 leading-tight">
              We Are Creating Leaders <br/>For Tomorrow&apos;s World
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              SMaRT School is a community of learners dedicated to academic excellence, personal growth, and global citizenship. We provide a supportive and challenging environment where students are encouraged to explore their passions.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {['Modern Infrastructure', 'Innovative Curriculum', 'Sports & Extracurricular', 'Global Partnerships'].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 group cursor-default">
                  <div className="w-6 h-6 rounded-full bg-schoolPrimary/10 text-schoolPrimary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-schoolPrimary group-hover:text-white transition-colors">
                    <CheckIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-schoolSecondary">{feature}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border-l-4 border-schoolPrimary shadow-sm mb-8 flex items-center gap-6 hover:shadow-md transition-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Principal" className="w-16 h-16 rounded-full object-cover" />
              <div>
                <p className="text-gray-600 italic mb-2">&quot;Education is the passport to the future, for tomorrow belongs to those who prepare for it today.&quot;</p>
                <h4 className="font-bold text-schoolSecondary">Dr. Budi Santoso, M.Pd.</h4>
                <p className="text-sm text-schoolPrimary">Principal</p>
              </div>
            </div>

            <button className="px-8 py-3.5 bg-schoolSecondary hover:bg-schoolPrimary text-white rounded font-semibold transition-all transform hover:-translate-y-1 shadow-md">
              More About Us
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
