export default function HeroSection() {
  return (
    <section className="hero-container pt-32 pb-48 lg:pt-40 lg:pb-64 relative overflow-hidden">
      {/* Cinematic Background Zoom Out */}
      <div 
        className="absolute inset-0 bg-cover bg-center animate-zoom-out-bg z-[-1]"
        style={{
          backgroundImage: "linear-gradient(rgba(30, 57, 50, 0.8), rgba(30, 57, 50, 0.85)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
        }}
      ></div>
      
      {/* Floating Graphic Elements for motion */}
      <div className="absolute top-1/4 right-[10%] opacity-20 animate-float-slow">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <div className="absolute bottom-1/3 left-[5%] opacity-10 animate-float-slow" style={{ animationDelay: "-4s" }}>
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><path d="M12 2L2 22h20L12 2z"/></svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center lg:text-left">
        <div className="w-full lg:w-2/3">
          <div className="overflow-hidden inline-block align-top mb-6">
            <span className="inline-block px-4 py-1.5 bg-schoolPrimary/20 text-schoolAccent font-semibold rounded border border-schoolPrimary/30 uppercase tracking-wider text-sm animate-reveal-text" style={{ animationDelay: "500ms" }}>
              Welcome to SMaRT School
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.2] mb-6">
            <div className="overflow-hidden w-full">
              <span className="inline-block animate-reveal-text" style={{ animationDelay: "700ms" }}>Empowering Students</span>
            </div>
            <div className="overflow-hidden w-full">
              <span className="inline-block animate-reveal-text" style={{ animationDelay: "900ms" }}>
                To Achieve <span className="text-schoolAccent relative inline-block">Excellence
                <svg className="absolute -bottom-2 w-full h-3 text-schoolPrimary opacity-0 animate-fade-in-up" style={{ animationDelay: "1500ms" }} viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
                </span>.
              </span>
            </div>
          </h1>
          
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-in-up" style={{ animationDelay: "1300ms" }}>
            A premier educational institution committed to academic excellence, character development, and creating future leaders in a globally competitive world.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "1500ms" }}>
            <button className="px-8 py-4 bg-schoolPrimary hover:bg-white hover:text-schoolPrimary text-white rounded font-bold transition-all shadow-[0_10px_20px_rgba(0,112,74,0.3)] hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] w-full sm:w-auto transform hover:-translate-y-1">
              Discover More
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white text-white hover:text-schoolSecondary rounded font-bold transition-all w-full sm:w-auto transform hover:-translate-y-1">
              Our Programs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
