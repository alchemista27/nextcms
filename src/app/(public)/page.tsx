import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [posts, team, gallery, testimonials, appearanceData] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { author: true },
    }),
    prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
    }),
    prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.appearance.findMany({
      where: {
        key: {
          in: ["theme:hero", "theme:features", "theme:chairman", "theme:about", "theme:stats", "theme:cta"],
        },
      },
    }),
  ]);

  const configMap = appearanceData.reduce((acc, curr) => {
    acc[curr.key] = curr.value as Record<string, any>;
    return acc;
  }, {} as Record<string, Record<string, any>>);

  const hero = configMap["theme:hero"] || {};
  const features = configMap["theme:features"] || {};
  const about = configMap["theme:about"] || {};
  const stats = configMap["theme:stats"] || {};
  const cta = configMap["theme:cta"] || {};

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-48 lg:pt-40 lg:pb-64 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-[-1]"
          style={{
            backgroundImage: `linear-gradient(rgba(69, 69, 69, 0.8), rgba(69, 69, 69, 0.85)), url('${hero.backgroundImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}')`,
          }}
        ></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center lg:text-left">
          <div className="w-full lg:w-2/3">
            <span className="inline-block px-4 py-1.5 bg-[#0f7f6d]/20 text-[#E3E8E7] font-semibold rounded border border-[#0f7f6d]/30 uppercase tracking-wider text-sm mb-6">
              {hero.subheading || "Welcome to SMaRT School"}
            </span>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.2] mb-6">
              {hero.heading || (
                <>
                  Empowering Students <br /> To Achieve <span className="text-[#E3E8E7]">Excellence</span>.
                </>
              )}
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0">
              A premier educational institution committed to academic excellence,
              character development, and creating future leaders in a globally
              competitive world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href={hero.ctaLink || "/about"}
                className="px-8 py-4 bg-[#0f7f6d] hover:bg-white hover:text-[#0f7f6d] text-white rounded font-bold transition-all shadow-lg w-full sm:w-auto text-center"
              >
                {hero.ctaText || "Discover More"}
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white text-white hover:text-[#454545] rounded font-bold transition-all w-full sm:w-auto text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OVERLAPPING INFO BOXES */}
      <section className="relative z-20 -mt-24 lg:-mt-32 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className={`grid grid-cols-1 gap-6 ${
            (features.items?.length || 3) === 1 ? "md:grid-cols-1" :
            (features.items?.length || 3) === 2 ? "md:grid-cols-2" :
            "md:grid-cols-3"
          }`}>
            {(features.items && features.items.length > 0 ? features.items : [
              { icon: "menu_book", label: "Quality Education", value: "We provide a comprehensive curriculum designed to challenge and inspire students to reach their full potential." },
              { icon: "psychology", label: "Expert Teachers", value: "Our faculty consists of highly qualified, dedicated professionals who are passionate about teaching." },
              { icon: "emoji_events", label: "Global Recognition", value: "Recognized for academic excellence and outstanding extracurricular achievements worldwide." }
            ]).map((feature: any, i: number) => {
              const isMiddle = i % 3 === 1; // Middle box gets the dark theme
              return (
                <div key={i} className={`${isMiddle ? 'bg-[#0f7f6d] text-white shadow-xl' : 'bg-white text-[#454545] border-b-4 border-[#0f7f6d] shadow-lg'} p-8 rounded-lg hover:-translate-y-2 transition-transform`}>
                  <div className={`w-16 h-16 ${isMiddle ? 'bg-white/20 text-white' : 'bg-[#E3E8E7] text-[#0f7f6d]'} rounded-full flex items-center justify-center mb-6`}>
                    <span className="material-icons-outlined text-3xl">{feature.icon || "star"}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.label}</h3>
                  <p className={`${isMiddle ? 'text-[#E3E8E7]/90' : 'text-gray-500'} mb-4 line-clamp-3`}>
                    {feature.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SAMBUTAN KETUA YAYASAN */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Image Side */}
            <div className="w-full lg:w-5/12">
              <div className="relative">
                <div className="absolute inset-0 bg-[#0f7f6d] translate-x-4 translate-y-4 rounded-xl -z-10"></div>
                <img
                  src={configMap["theme:chairman"]?.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt="Ketua Yayasan"
                  className="rounded-xl w-full h-auto object-cover shadow-lg aspect-[3/4]"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl border border-gray-100 hidden md:block">
                  <p className="font-bold text-[#454545] text-lg">{configMap["theme:chairman"]?.name || "Bpk. H. Ahmad Fulan, M.Pd"}</p>
                  <p className="text-[#0f7f6d] font-medium text-sm">Ketua Yayasan Alfida</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-7/12">
              <div className="flex items-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Sambutan <span className="w-8 h-0.5 bg-[#0f7f6d]"></span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#454545] mb-6 leading-tight">
                {configMap["theme:chairman"]?.heading || "Membangun Generasi Rabbani yang Cerdas dan Berakhlak Mulia"}
              </h2>
              
              <div className="relative">
                <span className="absolute -top-4 -left-6 text-6xl text-gray-200 material-icons-outlined opacity-50 font-serif">format_quote</span>
                <div className="text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap relative z-10 pl-6 text-lg italic">
                  {configMap["theme:chairman"]?.message || "Bismillahirrohmanirrohim. Puji syukur ke hadirat Allah SWT, Yayasan Alfida terus berkomitmen untuk memberikan layanan pendidikan terbaik. Kami percaya bahwa pendidikan sejati tidak hanya mengasah kecerdasan intelektual, tetapi juga membangun karakter dan akhlak mulia. Melalui unit-unit pendidikan di lingkungan Yayasan Alfida, kami bertekad melahirkan generasi yang tidak hanya siap menghadapi tantangan global, tetapi juga teguh memegang nilai-nilai agama."}
                </div>
              </div>

              <div className="md:hidden mt-6 pb-2 border-b border-gray-100 inline-block">
                <p className="font-bold text-[#454545] text-lg">{configMap["theme:chairman"]?.name || "Bpk. H. Ahmad Fulan, M.Pd"}</p>
                <p className="text-[#0f7f6d] font-medium text-sm">Ketua Yayasan Alfida</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section className="py-16 lg:py-24 bg-[#F7F8F8] overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative pb-8 pr-8">
              <img
                src={about.imageUrl || "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                alt="About SMaRT School"
                className="rounded-lg shadow-2xl w-full relative z-10"
              />
              <div className="absolute top-10 -left-10 bg-[#0f7f6d] text-white p-6 rounded-lg shadow-xl z-20 hidden md:flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">25+</span>
                <span className="text-sm font-medium uppercase tracking-widest text-[#E3E8E7]">
                  Years Exp
                </span>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> About Our Institution
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#454545] mb-6 leading-tight whitespace-pre-wrap">
                {about.heading || "We Are Creating Leaders\nFor Tomorrow's World"}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">
                {about.content || "SMaRT School is a community of learners dedicated to academic excellence, personal growth, and global citizenship. We provide a supportive and challenging environment where students are encouraged to explore their passions."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0f7f6d]/10 text-[#0f7f6d] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-icons-outlined text-sm">check</span>
                  </div>
                  <span className="font-medium text-[#454545]">Modern Infrastructure</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0f7f6d]/10 text-[#0f7f6d] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-icons-outlined text-sm">check</span>
                  </div>
                  <span className="font-medium text-[#454545]">Innovative Curriculum</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0f7f6d]/10 text-[#0f7f6d] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-icons-outlined text-sm">check</span>
                  </div>
                  <span className="font-medium text-[#454545]">Sports & Extracurricular</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0f7f6d]/10 text-[#0f7f6d] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-icons-outlined text-sm">check</span>
                  </div>
                  <span className="font-medium text-[#454545]">Global Partnerships</span>
                </div>
              </div>

              <Link
                href="/about"
                className="px-8 py-3.5 bg-[#454545] hover:bg-[#0f7f6d] text-white rounded font-semibold transition-all shadow-md inline-block"
              >
                More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="py-20 relative bg-fixed bg-center bg-cover" style={{ backgroundImage: "linear-gradient(rgba(15, 127, 109, 0.9), rgba(15, 127, 109, 0.9)), url('https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3')" }}>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className={`grid grid-cols-2 gap-8 text-center divide-x-0 md:divide-x divide-white/20 ${
            (stats.items?.length || 4) === 1 ? "md:grid-cols-1" :
            (stats.items?.length || 4) === 2 ? "md:grid-cols-2" :
            (stats.items?.length || 4) === 3 ? "md:grid-cols-3" :
            "md:grid-cols-4"
          }`}>
            {(stats.items && stats.items.length > 0 ? stats.items : [
              { icon: "groups", value: "2500", label: "Students Enrolled" },
              { icon: "school", value: "150", label: "Certified Teachers" },
              { icon: "emoji_events", value: "85", label: "Awards Won" },
              { icon: "apartment", value: "45", label: "Modern Classrooms" },
            ]).map((stat: any, i: number) => (
              <div key={i} className="flex flex-col items-center">
                <span className="material-icons-outlined text-5xl text-[#E3E8E7] mb-4">{stat.icon || "star"}</span>
                <h3 className="text-5xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-[#E3E8E7] font-medium uppercase tracking-widest text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TEACHERS / TEAM SECTION */}
      <section className="py-20 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Expert Faculty <span className="w-8 h-0.5 bg-[#0f7f6d]"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#454545]">Meet Our Dedicated Educators</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-100 relative group overflow-hidden">
                <div className="w-full aspect-square bg-gray-200">
                  <img
                    src={member.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center bg-white relative z-10">
                  <h4 className="text-xl font-bold text-[#454545] mb-1">{member.name}</h4>
                  <p className="text-[#0f7f6d] text-sm font-medium">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <Link href="/team" className="px-8 py-3 bg-white border border-gray-200 text-[#454545] hover:bg-gray-50 rounded font-semibold transition-colors shadow-sm inline-block">
                 View All Teachers
             </Link>
          </div>
        </div>
      </section>

      {/* 6. GALLERY & ACHIEVEMENTS */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Campus Life
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#454545]">Photo Gallery & Achievements</h2>
            </div>
            <Link href="/gallery" className="text-[#0f7f6d] font-semibold flex items-center gap-1 mt-4 md:mt-0 hover:gap-2 transition-all">
              View All Gallery <span className="material-icons-outlined text-sm">arrow_right_alt</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((image) => (
              <div key={image.id} className="relative rounded-lg overflow-hidden group cursor-pointer aspect-video">
                <img src={image.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={image.title || ""} />
                <div className="absolute inset-0 bg-[#454545]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                  <span className="material-icons-outlined text-4xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">add_circle_outline</span>
                  <h4 className="text-lg font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{image.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST NEWS & EVENTS */}
      <section className="py-20 bg-[#F7F8F8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f7f6d]/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E3E8E7]/50 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> Latest News <span className="w-8 h-0.5 bg-[#0f7f6d]"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#454545]">Stay Updated With Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full aspect-[3/2] overflow-hidden">
                  <img
                    src={post.featuredImage || "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm text-[#0f7f6d]">calendar_today</span> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#454545] mb-3 group-hover:text-[#0f7f6d] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                    {post.excerpt || (post.content || '').replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'}
                  </p>
                  <Link href={`/${post.slug}`} className="text-[#0f7f6d] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Article <span className="material-icons-outlined text-sm">arrow_right_alt</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
            <div className="text-center mt-12">
               <Link href="/blog" className="px-8 py-3 bg-white border border-gray-200 text-[#454545] hover:bg-gray-50 rounded font-semibold transition-colors shadow-sm inline-block">
                   More News & Articles
               </Link>
            </div>
          </div>
        </section>

      {/* 8. CTA SECTION */}
      <section className="py-24 bg-[#0f7f6d] relative overflow-hidden">
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
        
        <div className="absolute top-1/2 left-[10%] w-64 h-64 border border-white/20 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 right-[10%] w-96 h-96 border border-white/10 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-white/10 text-[#E3E8E7] font-semibold rounded mb-6 border border-white/20 uppercase tracking-widest text-sm">
              Join Our Community
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight max-w-3xl mx-auto">
              {cta.heading || "Ready to Take the Next Step in Your Education?"}
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
              <Link href={cta.button1_link || "/contact"} className="group px-8 py-4 bg-white text-[#0f7f6d] hover:bg-[#454545] hover:text-white rounded font-bold transition-all shadow-xl hover:shadow-2xl w-full sm:w-auto flex items-center justify-center gap-3 transform hover:-translate-y-2">
                <span className="material-icons-outlined group-hover:rotate-12 transition-transform duration-300">school</span>
                {cta.button1_text || "Enroll Now"}
              </Link>
              <Link href={cta.button2_link || "/contact"} className="group px-8 py-4 bg-transparent border-2 border-white hover:bg-white text-white hover:text-[#454545] rounded font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-3 transform hover:-translate-y-2">
                <span className="material-icons-outlined group-hover:scale-125 transition-transform duration-300">mail_outline</span>
                {cta.button2_text || "Contact Us"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
