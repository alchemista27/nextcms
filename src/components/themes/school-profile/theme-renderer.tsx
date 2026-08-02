"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

// --- Components for Sections ---

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count}</span>;
}

export default function SchoolProfileTheme({ settings, recentPosts, primaryMenu }: { settings: any; recentPosts: any[]; primaryMenu?: any }) {
  // Safe defaults falling back to reference design
  const hero = settings?.hero || {};
  const about = settings?.about || {};
  const stats = settings?.stats || {};
  const teachers = settings?.teachers || [];
  const cta = settings?.cta || {};
  const contact = settings?.contact || {};
  
  // Default values
  const schoolName = about.schoolName || "SMaRT School";
  const heroBg = hero.backgroundImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  // Build menu items
  const menuItems = primaryMenu?.items?.filter((item: any) => !item.parentId) || [
    { label: "Home", url: "#" },
    { label: "About Us", url: "#about" },
    { label: "Academics", url: "#academics" },
    { label: "Teachers", url: "#teachers" },
    { label: "Gallery", url: "#gallery" },
    { label: "News", url: "#news" }
  ];

  return (
    <div className="font-sans text-gray-700 bg-[#F8F9FA] selection:bg-[#00704A] selection:text-white">
      {/* Include material icons just in case it's not in the main layout */}
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');` }} />

      {/* Topbar */}
      <div className="bg-[#1E3932] text-gray-300 py-2 text-sm hidden lg:block">
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#00704A]">phone</span> {contact.phone || "+62 812 3456 7890"}</span>
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#00704A]">email</span> {contact.email || "info@smartschool.edu"}</span>
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#00704A]">location_on</span> {contact.address || "123 Education Lane, Jakarta"}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={contact.facebook || "#"} className="hover:text-white transition-colors">Facebook</a>
            <a href={contact.instagram || "#"} className="hover:text-white transition-colors">Instagram</a>
            <a href={contact.youtube || "#"} className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-white shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00704A] rounded-lg flex items-center justify-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="material-icons-outlined text-2xl">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-[#1E3932] leading-none">{schoolName}</span>
              <span className="text-xs font-semibold tracking-widest text-[#00704A] uppercase">School</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
            {menuItems.map((item: any, i: number) => (
              <a key={i} href={item.url} className={i === 0 ? "text-[#00704A] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#00704A]" : "hover:text-[#00704A] transition-colors"}>
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="hidden lg:flex items-center gap-4">
            <Link href={cta.primaryButtonUrl || "#"} className="bg-[#00704A] hover:bg-[#1E3932] text-white px-6 py-2.5 rounded font-semibold transition-all shadow-md flex items-center gap-2 transform hover:scale-105">
              Apply Now
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-48 lg:pt-40 lg:pb-64">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `linear-gradient(rgba(30, 57, 50, 0.8), rgba(30, 57, 50, 0.85)), url(${heroBg})` }}
        />
        
        {/* Floating Graphics */}
        <motion.div animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 right-[10%] opacity-20 z-10">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><circle cx="12" cy="12" r="10"/></svg>
        </motion.div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center lg:text-left">
          <div className="w-full lg:w-2/3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
              <span className="inline-block px-4 py-1.5 bg-[#00704A]/20 text-[#D4E9E2] font-semibold rounded border border-[#00704A]/30 uppercase tracking-wider text-sm">
                {hero.badge || "Welcome to SMaRT School"}
              </span>
            </motion.div>
            
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.2] mb-6">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <span className="inline-block">{hero.title1 || "Empowering Students"}</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <span className="inline-block">{hero.title2 || "To Achieve Excellence"}
                  <span className="text-[#D4E9E2] relative inline-block">.
                      <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute -bottom-2 w-full h-3 text-[#00704A]" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></motion.svg>
                  </span>
                </span>
              </motion.div>
            </h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0">
              {hero.subtitle || "A premier educational institution committed to academic excellence, character development, and creating future leaders in a globally competitive world."}
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href={hero.primaryButtonUrl || "#about"} className="px-8 py-4 bg-[#00704A] hover:bg-white hover:text-[#00704A] text-white rounded font-bold transition-all shadow-[0_10px_20px_rgba(0,112,74,0.3)] hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] w-full sm:w-auto transform hover:-translate-y-1 text-center">
                {hero.primaryButtonText || "Discover More"}
              </Link>
              <Link href={hero.secondaryButtonUrl || "#academics"} className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white text-white hover:text-[#1E3932] rounded font-bold transition-all w-full sm:w-auto transform hover:-translate-y-1 text-center">
                {hero.secondaryButtonText || "Our Programs"}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OVERLAPPING INFO BOXES */}
      <section className="relative z-20 -mt-24 lg:-mt-32 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-lg border-b-4 border-[#00704A] hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#D4E9E2] text-[#00704A] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00704A] group-hover:text-white group-hover:rotate-12 transition-all">
                <span className="material-icons-outlined text-3xl">menu_book</span>
              </div>
              <h3 className="text-xl font-bold text-[#1E3932] mb-3">Quality Education</h3>
              <p className="text-gray-500 mb-4 line-clamp-3">We provide a comprehensive curriculum designed to challenge and inspire students.</p>
              <a href="#" className="text-[#00704A] font-semibold flex items-center gap-1 hover:gap-2 transition-all">Read More <span className="material-icons-outlined text-sm">arrow_right_alt</span></a>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#00704A] p-8 rounded-lg shadow-xl text-white hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mb-6 group-hover:rotate-12 transition-all">
                <span className="material-icons-outlined text-3xl">psychology</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Teachers</h3>
              <p className="text-[#D4E9E2]/90 mb-4 line-clamp-3">Our faculty consists of highly qualified, dedicated professionals who are passionate.</p>
              <a href="#" className="text-[#D4E9E2] font-semibold flex items-center gap-1 hover:gap-2 transition-all">Read More <span className="material-icons-outlined text-sm">arrow_right_alt</span></a>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-lg shadow-xl border-b-4 border-[#00704A] hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#D4E9E2] text-[#00704A] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00704A] group-hover:text-white group-hover:rotate-12 transition-all">
                <span className="material-icons-outlined text-3xl">emoji_events</span>
              </div>
              <h3 className="text-xl font-bold text-[#1E3932] mb-3">Global Recognition</h3>
              <p className="text-gray-500 mb-4 line-clamp-3">Recognized for academic excellence and outstanding extracurricular achievements.</p>
              <a href="#" className="text-[#00704A] font-semibold flex items-center gap-1 hover:gap-2 transition-all">Read More <span className="material-icons-outlined text-sm">arrow_right_alt</span></a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="py-16 lg:py-24 bg-[#F8F9FA] overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2 relative pb-8 pr-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.mainImage || "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"} alt="About" className="rounded-lg shadow-2xl w-full relative z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.subImage || "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80"} alt="Students" className="absolute bottom-[-30px] right-[-30px] z-20 border-[10px] border-white rounded-lg shadow-2xl w-2/3 max-w-[300px] hidden md:block" />
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 -left-10 bg-[#00704A] text-white p-6 rounded-lg shadow-xl z-20 hidden md:flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{about.yearsExperience || 25}+</span>
                <span className="text-sm font-medium uppercase tracking-widest text-[#D4E9E2]">Years Exp</span>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2">
              <div className="flex items-center gap-2 text-[#00704A] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#00704A]"></span> About Our Institution
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E3932] mb-6 leading-tight">
                We Are Creating Leaders <br/>For Tomorrow&apos;s World
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {about.description || "SMaRT School is a community of learners dedicated to academic excellence..."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {(about.features || ["Modern Infrastructure", "Innovative Curriculum", "Sports & Extracurricular", "Global Partnerships"]).map((feat: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 group cursor-default">
                    <div className="w-6 h-6 rounded-full bg-[#00704A]/10 text-[#00704A] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#00704A] group-hover:text-white transition-colors">
                      <span className="material-icons-outlined text-sm">check</span>
                    </div>
                    <span className="font-medium text-[#1E3932]">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white border-l-4 border-[#00704A] shadow-sm mb-8 flex items-center gap-6 hover:shadow-md transition-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={about.principalImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80"} alt="Principal" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <p className="text-gray-600 italic mb-2">{about.principalQuote || "\"Education is the passport to the future.\""}</p>
                  <h4 className="font-bold text-[#1E3932]">{about.principalName || "Dr. Budi Santoso, M.Pd."}</h4>
                  <p className="text-sm text-[#00704A]">{about.principalTitle || "Principal"}</p>
                </div>
              </div>
              <button className="px-8 py-3.5 bg-[#1E3932] hover:bg-[#00704A] text-white rounded font-semibold transition-all shadow-md transform hover:-translate-y-1">
                More About Us
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-20 relative bg-fixed bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0, 112, 74, 0.9), rgba(0, 112, 74, 0.9)), url(https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80)` }}>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-white/20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center">
              <span className="material-icons-outlined text-5xl text-[#D4E9E2] mb-4">groups</span>
              <h3 className="text-5xl font-bold text-white mb-2"><Counter target={stats.students || 2500} /></h3>
              <p className="text-[#D4E9E2] font-medium uppercase tracking-widest text-sm">Students Enrolled</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
              <span className="material-icons-outlined text-5xl text-[#D4E9E2] mb-4">school</span>
              <h3 className="text-5xl font-bold text-white mb-2"><Counter target={stats.teachers || 150} /></h3>
              <p className="text-[#D4E9E2] font-medium uppercase tracking-widest text-sm">Certified Teachers</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
              <span className="material-icons-outlined text-5xl text-[#D4E9E2] mb-4">emoji_events</span>
              <h3 className="text-5xl font-bold text-white mb-2"><Counter target={stats.awards || 85} /></h3>
              <p className="text-[#D4E9E2] font-medium uppercase tracking-widest text-sm">Awards Won</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
              <span className="material-icons-outlined text-5xl text-[#D4E9E2] mb-4">apartment</span>
              <h3 className="text-5xl font-bold text-white mb-2"><Counter target={stats.classrooms || 45} /></h3>
              <p className="text-[#D4E9E2] font-medium uppercase tracking-widest text-sm">Modern Classrooms</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      <section id="teachers" className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-[#00704A] font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-[#00704A]"></span> Expert Faculty <span className="w-8 h-0.5 bg-[#00704A]"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3932]">Meet Our Dedicated Educators</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(teachers.length ? teachers : [
              { name: "Sarah Jenkins", role: "Head of Science", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
              { name: "Michael Chen", role: "Mathematics Dept.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
              { name: "Dr. Emily Smith", role: "Literature & Arts", image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&q=80" },
              { name: "James Wilson", role: "Physical Education", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
            ]).map((t: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-lg shadow-sm border border-gray-100 relative group overflow-hidden">
                <div className="w-full aspect-square overflow-hidden bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 text-center bg-white relative z-10 transition-transform duration-300 group-hover:-translate-y-4">
                  <h4 className="text-xl font-bold text-[#1E3932] mb-1">{t.name}</h4>
                  <p className="text-[#00704A] text-sm font-medium">{t.role}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-white/95 p-4 flex justify-center gap-4 text-gray-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <a href="#" className="hover:text-[#00704A] hover:-translate-y-1 transition-all"><span className="material-icons-outlined">facebook</span></a>
                    <a href="#" className="hover:text-[#00704A] hover:-translate-y-1 transition-all"><span className="material-icons-outlined">camera_alt</span></a>
                    <a href="#" className="hover:text-[#00704A] hover:-translate-y-1 transition-all"><span className="material-icons-outlined">mail</span></a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section id="news" className="py-20 bg-[#F8F9FA] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00704A]/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4E9E2]/30 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 text-[#00704A] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#00704A]"></span> Stay Updated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E3932]">Latest News & Events</h2>
            </motion.div>
            <motion.a initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} href="#" className="text-[#00704A] font-semibold flex items-center gap-1 mt-4 md:mt-0 hover:gap-2 transition-all">
              Read More News <span className="material-icons-outlined text-sm">arrow_right_alt</span>
            </motion.a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post, i) => {
                const dateObj = new Date(post.createdAt || Date.now());
                const month = format(dateObj, "MMM");
                const day = format(dateObj, "dd");
                return (
                <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.featuredImage || "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-[#00704A] text-white text-center rounded overflow-hidden shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-[#1E3932] px-4 py-1 text-xs font-bold uppercase">{month}</div>
                      <div className="px-4 py-1 text-lg font-black">{day}</div>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#00704A] to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm text-[#00704A]">person</span> {post.author?.name || "Admin"}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3932] mb-3 group-hover:text-[#00704A] transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.excerpt || "No excerpt available."}</p>
                    <Link href={`/${post.slug}`} className="text-[#00704A] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <span className="material-icons-outlined text-sm">arrow_right_alt</span></Link>
                  </div>
                </motion.div>
                );
              })
            ) : (
              // Fallback demo posts
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#1E3932] mb-2">Sample Post {i}</h3>
                  <p className="text-sm text-gray-500">Add posts in the admin dashboard to see them here.</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-[#00704A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute top-0 left-0 w-full h-full animate-[spin_120s_linear_infinite]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-[10%] w-64 h-64 border border-white/20 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 right-[10%] w-96 h-96 border border-white/10 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 bg-white/10 text-[#D4E9E2] font-semibold rounded mb-6 border border-white/20 uppercase tracking-widest text-sm">
              {cta.badge || "Join Our Community"}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight max-w-3xl mx-auto">
              {cta.title || "Ready to Take the Next Step in Your Education?"}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
              <Link href={cta.primaryButtonUrl || "#"} className="group px-8 py-4 bg-white text-[#00704A] hover:bg-[#1E3932] hover:text-white rounded font-bold transition-all shadow-xl hover:shadow-2xl w-full sm:w-auto flex items-center justify-center gap-3 transform hover:-translate-y-2">
                <span className="material-icons-outlined group-hover:rotate-12 transition-transform duration-300">school</span>
                {cta.primaryButtonText || "Enroll Now"}
              </Link>
              <Link href={cta.secondaryButtonUrl || "#"} className="group px-8 py-4 bg-transparent border-2 border-white hover:bg-white text-white hover:text-[#1E3932] rounded font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-3 transform hover:-translate-y-2">
                <span className="material-icons-outlined group-hover:scale-125 transition-transform duration-300">mail_outline</span>
                {cta.secondaryButtonText || "Contact Us"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1E3932] text-gray-300 py-16 border-t-4 border-[#00704A]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#00704A] rounded flex items-center justify-center text-white">
                  <span className="material-icons-outlined text-xl">school</span>
                </div>
                <span className="font-bold text-xl text-white">{schoolName}</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed">{contact.footerTagline || "Providing high-quality education and nurturing environments that empower students to become leaders of tomorrow."}</p>
              <div className="flex gap-4">
                <a href={contact.facebook || "#"} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00704A] transition-colors"><span className="material-icons-outlined text-sm">facebook</span></a>
                <a href={contact.instagram || "#"} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00704A] transition-colors"><span className="material-icons-outlined text-sm">camera_alt</span></a>
                <a href={contact.youtube || "#"} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00704A] transition-colors"><span className="material-icons-outlined text-sm">play_arrow</span></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#00704A]">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {menuItems.map((item: any, i: number) => (
                  <li key={i}><a href={item.url} className="hover:text-[#00704A] transition-colors flex items-center gap-2"><span className="material-icons-outlined text-xs">chevron_right</span> {item.label}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#00704A]">Contact Info</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="material-icons-outlined text-[#00704A] mt-0.5">location_on</span>
                  <span>{contact.address || "123 Education Lane, Jakarta, Indonesia 10110"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-icons-outlined text-[#00704A]">phone</span>
                  <span>{contact.phone || "+62 812 3456 7890"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-icons-outlined text-[#00704A]">email</span>
                  <span>{contact.email || "info@smartschool.edu"}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#00704A]">Newsletter</h4>
              <p className="mb-4 text-sm">Subscribe to our newsletter to get latest updates.</p>
              <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Your Email Address" className="bg-white/5 border border-white/10 px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#00704A] text-white" />
                <button type="submit" className="bg-[#00704A] hover:bg-white hover:text-[#00704A] transition-colors text-white px-4 py-2.5 rounded text-sm font-bold uppercase tracking-wider">Subscribe</button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2026 NextCMS - {schoolName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
