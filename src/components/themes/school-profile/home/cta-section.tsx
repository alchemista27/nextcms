import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export default function CtaSection() {
  return (
    <section className="py-24 bg-schoolPrimary relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute top-0 left-0 w-full h-full animate-[spin_120s_linear_infinite]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="absolute top-1/2 left-[10%] w-64 h-64 border border-white/20 rounded-full animate-ping" style={{ animationDuration: "4s" }}></div>
      <div className="absolute top-1/2 right-[10%] w-96 h-96 border border-white/10 rounded-full animate-pulse" style={{ animationDuration: "5s" }}></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <div className="animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-schoolAccent font-semibold rounded mb-6 border border-white/20 uppercase tracking-widest text-sm">
            Join Our Community
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight max-w-3xl mx-auto">
            Ready to Take the Next Step in Your Education?
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            <button className="group px-8 py-4 bg-white text-schoolPrimary hover:bg-schoolSecondary hover:text-white rounded font-bold transition-all shadow-xl hover:shadow-2xl w-full sm:w-auto flex items-center justify-center gap-3 transform hover:-translate-y-2">
              Apply for Admission
              <ArrowRightAltIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white text-white hover:text-schoolPrimary rounded font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-3 transform hover:-translate-y-2">
              Contact Admissions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
