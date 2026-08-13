import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [posts, team, gallery, testimonials] = await Promise.all([
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
  ]);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-48 lg:pt-40 lg:pb-64 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-[-1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(69, 69, 69, 0.8), rgba(69, 69, 69, 0.85)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          }}
        ></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center lg:text-left">
          <div className="w-full lg:w-2/3">
            <span className="inline-block px-4 py-1.5 bg-[#0f7f6d]/20 text-[#E3E8E7] font-semibold rounded border border-[#0f7f6d]/30 uppercase tracking-wider text-sm mb-6">
              Welcome to SMaRT School
            </span>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.2] mb-6">
              Empowering Students <br /> To Achieve <span className="text-[#E3E8E7]">Excellence</span>.
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0">
              A premier educational institution committed to academic excellence,
              character development, and creating future leaders in a globally
              competitive world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/about"
                className="px-8 py-4 bg-[#0f7f6d] hover:bg-white hover:text-[#0f7f6d] text-white rounded font-bold transition-all shadow-lg w-full sm:w-auto text-center"
              >
                Discover More
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-white p-8 rounded-lg border-b-4 border-[#0f7f6d] shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-[#E3E8E7] text-[#0f7f6d] rounded-full flex items-center justify-center mb-6">
                <span className="material-icons-outlined text-3xl">menu_book</span>
              </div>
              <h3 className="text-xl font-bold text-[#454545] mb-3">Quality Education</h3>
              <p className="text-gray-500 mb-4 line-clamp-3">
                We provide a comprehensive curriculum designed to challenge and
                inspire students to reach their full potential.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-[#0f7f6d] p-8 rounded-lg shadow-xl text-white hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mb-6">
                <span className="material-icons-outlined text-3xl">psychology</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Teachers</h3>
              <p className="text-[#E3E8E7]/90 mb-4 line-clamp-3">
                Our faculty consists of highly qualified, dedicated professionals
                who are passionate about teaching.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-8 rounded-lg shadow-xl border-b-4 border-[#0f7f6d] hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-[#E3E8E7] text-[#0f7f6d] rounded-full flex items-center justify-center mb-6">
                <span className="material-icons-outlined text-3xl">emoji_events</span>
              </div>
              <h3 className="text-xl font-bold text-[#454545] mb-3">Global Recognition</h3>
              <p className="text-gray-500 mb-4 line-clamp-3">
                Recognized for academic excellence and outstanding extracurricular
                achievements worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section className="py-16 lg:py-24 bg-[#F7F8F8] overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative pb-8 pr-8">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#454545] mb-6 leading-tight">
                We Are Creating Leaders <br />
                For Tomorrow's World
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                SMaRT School is a community of learners dedicated to academic
                excellence, personal growth, and global citizenship. We provide a
                supportive and challenging environment where students are
                encouraged to explore their passions.
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-white/20">
            <div className="flex flex-col items-center">
              <span className="material-icons-outlined text-5xl text-[#E3E8E7] mb-4">groups</span>
              <h3 className="text-5xl font-bold text-white mb-2">2500</h3>
              <p className="text-[#E3E8E7] font-medium uppercase tracking-widest text-sm">Students Enrolled</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-icons-outlined text-5xl text-[#E3E8E7] mb-4">school</span>
              <h3 className="text-5xl font-bold text-white mb-2">150</h3>
              <p className="text-[#E3E8E7] font-medium uppercase tracking-widest text-sm">Certified Teachers</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-icons-outlined text-5xl text-[#E3E8E7] mb-4">emoji_events</span>
              <h3 className="text-5xl font-bold text-white mb-2">85</h3>
              <p className="text-[#E3E8E7] font-medium uppercase tracking-widest text-sm">Awards Won</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-icons-outlined text-5xl text-[#E3E8E7] mb-4">apartment</span>
              <h3 className="text-5xl font-bold text-white mb-2">45</h3>
              <p className="text-[#E3E8E7] font-medium uppercase tracking-widest text-sm">Modern Classrooms</p>
            </div>
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

      {/* 6. NEWS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
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

    </div>
  );
}
