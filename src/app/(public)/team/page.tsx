import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teachers & Staff",
};

export default async function TeamPage() {
  const teamMembers = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      {/* Page Hero */}
      <section 
        className="py-24 lg:py-36 bg-cover bg-center relative"
        style={{ backgroundImage: "linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Our Teachers</h1>
          <p className="text-gray-300 text-lg mb-6">Meet the dedicated professionals shaping the future.</p>
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#E3E8E7]">Teachers</span>
          </nav>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-20 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12">
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={member.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3"} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#454545]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
                      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0f7f6d] hover:bg-[#0f7f6d] hover:text-white transition-colors"><span className="material-icons-outlined text-[1rem]">email</span></button>
                      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0f7f6d] hover:bg-[#0f7f6d] hover:text-white transition-colors"><span className="material-icons-outlined text-[1rem]">link</span></button>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-[#454545] mb-1">{member.name}</h3>
                    <p className="text-sm font-semibold text-[#0f7f6d]">{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No teachers found</h3>
              <p className="text-gray-500">Teacher profiles will appear here once added to the CMS.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
