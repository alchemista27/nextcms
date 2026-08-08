"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { SchoolProfileHeader, SchoolProfileFooter } from "./shared";
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
    <div className="font-sans text-gray-700 bg-[#F8F9FA] selection:bg-[#0f7f6d] selection:text-white">
      <SchoolProfileHeader contact={contact} schoolName={schoolName} menuItems={menuItems} cta={cta} />

      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#454545]/90 to-[#0f7f6d]/80 z-10"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroBg} alt="Campus" className="w-full h-full object-cover animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-sm font-semibold tracking-wider mb-6 backdrop-blur-sm border border-white/30">
              {hero.badge || "Welcome to SMaRT School"}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {hero.title1 || "Empowering Students"}<br/><span className="text-[#D4E9E2]">{hero.title2 || "To Achieve Excellence"}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {hero.subtitle || "A premier educational institution committed to academic excellence, character development, and creating future leaders in a globally competitive world."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={hero.primaryButtonUrl || "#about"} className="w-full sm:w-auto bg-[#0f7f6d] hover:bg-white hover:text-[#454545] text-white px-8 py-4 rounded font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                {hero.primaryButtonText || "Discover More"}
              </Link>
              <Link href={hero.secondaryButtonUrl || "#academics"} className="w-full sm:w-auto bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded font-bold transition-all">
                {hero.secondaryButtonText || "Our Programs"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F8F9FA] rounded-bl-[100px] -z-10"></div>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2 relative pb-8 pr-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.mainImage || "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"} alt="About" className="rounded-lg shadow-2xl w-full relative z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.subImage || "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80"} alt="Students" className="absolute bottom-[-30px] right-[-30px] z-20 border-[10px] border-white rounded-lg shadow-2xl w-2/3 max-w-[300px] hidden md:block" />
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 -left-10 bg-[#0f7f6d] text-white p-6 rounded-lg shadow-xl z-20 hidden md:flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{about.yearsExperience || 25}+</span>
                <span className="text-sm font-semibold uppercase tracking-widest mt-1">Years</span>
                <span className="text-xs">Experience</span>
              </motion.div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2">
              <div className="flex items-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> About Our Institution
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#454545] mb-6 leading-tight">
                We Are Creating Leaders <br/>For Tomorrow&apos;s World
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {about.description || "SMaRT School is a community of learners dedicated to academic excellence..."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {(about.features || ["Modern Infrastructure", "Innovative Curriculum", "Sports & Extracurriculars", "Global Partnerships"]).map((feat: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4E9E2] flex items-center justify-center text-[#0f7f6d]"><span className="material-icons-outlined text-sm">check</span></div>
                    <span className="font-medium text-[#454545]">{feat}</span>
                  </div>
                ))}
              </div>
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
            <div className="flex items-center justify-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Expert Faculty <span className="w-8 h-0.5 bg-[#0f7f6d]"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#454545]">Meet Our Dedicated Educators</h2>
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
                  <h4 className="text-xl font-bold text-[#454545] mb-1">{t.name}</h4>
                  <p className="text-[#0f7f6d] text-sm font-semibold">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section id="news" className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Stay Updated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#454545]">Latest News & Events</h2>
            </motion.div>
            <motion.a initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} href="/blog" className="text-[#0f7f6d] font-semibold flex items-center gap-1 mt-4 md:mt-0 hover:gap-2 transition-all">
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
                    <div className="absolute top-4 left-4 bg-[#0f7f6d] text-white text-center rounded overflow-hidden shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-[#454545] px-4 py-1 text-xs font-bold uppercase">{month}</div>
                      <div className="px-4 py-1 text-lg font-black">{day}</div>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm text-[#0f7f6d]">person</span> {post.author?.name || "Admin"}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#454545] mb-3 group-hover:text-[#0f7f6d] transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.excerpt || "No excerpt available."}</p>
                    <Link href={`/${post.slug}`} className="text-[#0f7f6d] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <span className="material-icons-outlined text-sm">arrow_right_alt</span></Link>
                  </div>
                </motion.div>
                );
              })
            ) : (
              [1, 2, 3].map((i: any) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#454545] mb-2">Sample Post {i}</h3>
                  <p className="text-sm text-gray-500">Add posts in the admin dashboard to see them here.</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-[#454545] relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 border-[40px] border-[#0f7f6d] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 border-[60px] border-[#0f7f6d] rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{cta.title || "Ready to Join Our Community?"}</h2>
            <p className="text-xl text-gray-300 mb-10 font-light">{cta.subtitle || "Enrollments for the upcoming academic year are now open. Take the first step towards a brighter future."}</p>
            <Link href={cta.buttonUrl || "#"} className="inline-block bg-[#0f7f6d] hover:bg-white hover:text-[#454545] text-white px-10 py-4 rounded font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg">
              {cta.buttonText || "Apply for Admission"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#454545] text-gray-300 py-16 border-t-4 border-[#0f7f6d]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#0f7f6d] rounded flex items-center justify-center text-white">
                  <span className="material-icons-outlined text-xl">school</span>
                </div>
                <span className="font-bold text-xl text-white">{schoolName}</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed">{contact.footerTagline || "Providing high-quality education and nurturing environments that empower students to become leaders of tomorrow."}</p>
              <div className="flex gap-4">
                <a href={contact.facebook || "#"} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0f7f6d] transition-colors"><span className="material-icons-outlined text-sm">facebook</span></a>
                <a href={contact.instagram || "#"} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0f7f6d] transition-colors"><span className="material-icons-outlined text-sm">camera_alt</span></a>
                <a href={contact.youtube || "#"} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0f7f6d] transition-colors"><span className="material-icons-outlined text-sm">play_arrow</span></a>
              </div>
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
              <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#0f7f6d]">Contact Info</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="material-icons-outlined text-[#0f7f6d] mt-0.5">location_on</span>
                  <span>{contact.address || "123 Education Lane, Jakarta, Indonesia 10110"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-icons-outlined text-[#0f7f6d]">phone</span>
                  <span>{contact.phone || "+62 812 3456 7890"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-icons-outlined text-[#0f7f6d]">email</span>
                  <span>{contact.email || "info@smartschool.edu"}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#0f7f6d]">Newsletter</h4>
              <p className="mb-4 text-sm">Subscribe to our newsletter to get latest updates.</p>
              <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Your Email Address" className="bg-white/5 border border-white/10 px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#0f7f6d] text-white" />
                <button type="submit" className="bg-[#0f7f6d] hover:bg-white hover:text-[#0f7f6d] transition-colors text-white px-4 py-2.5 rounded text-sm font-bold uppercase tracking-wider">Subscribe</button>
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
