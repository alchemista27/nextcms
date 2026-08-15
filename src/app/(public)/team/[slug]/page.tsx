import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = await prisma.teamMember.findUnique({
    where: { slug },
  });

  if (!member) return { title: "Teacher Not Found" };

  return {
    title: `${member.name} - Teacher Profile`,
    description: member.bio?.substring(0, 160) || `Profile of ${member.name}, ${member.position}`,
  };
}

export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const member = await prisma.teamMember.findUnique({
    where: { slug },
  });

  if (!member || !member.isActive) {
    notFound();
  }

  // Fetch other members for the "Other Faculty Members" section
  const otherMembers = await prisma.teamMember.findMany({
    where: { 
      isActive: true,
      NOT: { id: member.id }
    },
    take: 3,
    orderBy: { order: "asc" }
  });

  return (
    <div className="bg-[#F7F8F8] antialiased">
      {/* Page Hero */}
      <section className="py-20 relative bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Teacher Profile</h1>
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <Link href="/team" className="hover:text-white">Teachers</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#E3E8E7]">{member.name}</span>
          </nav>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="bg-[#F7F8F8] rounded-lg overflow-hidden shadow-sm border border-gray-100 sticky top-28">
                <img 
                  src={member.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3"} 
                  alt={member.name} 
                  className="w-full aspect-square object-cover" 
                />
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-[#454545] mb-1">{member.name}</h2>
                  <p className="text-[#0f7f6d] font-semibold mb-6">{member.position}</p>
                  
                  <div className="flex gap-3">
                    <Link href="/contact" className="flex-1 text-center py-2.5 bg-[#0f7f6d] text-white rounded font-semibold text-sm hover:bg-[#454545] transition-colors">
                      Send Message
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <div className="flex items-center gap-2 text-[#0f7f6d] font-semibold mb-2 uppercase tracking-widest text-sm">
                <span className="w-8 h-0.5 bg-[#0f7f6d]"></span> About Me
              </div>
              <h2 className="text-3xl font-bold text-[#454545] mb-6">Biography</h2>
              
              {member.bio ? (
                <div 
                  className="prose prose-lg max-w-none text-gray-600 mb-10 prose-headings:text-[#454545] prose-a:text-[#0f7f6d]"
                  dangerouslySetInnerHTML={{ __html: member.bio }}
                />
              ) : (
                <p className="text-gray-600 mb-10 leading-relaxed italic">
                  No biography provided for this staff member yet.
                </p>
              )}

              {/* Other Teachers */}
              {otherMembers.length > 0 && (
                <div className="mt-16 pt-12 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-[#454545] mb-6">Other Faculty Members</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {otherMembers.map(other => (
                      <Link key={other.id} href={`/team/${other.slug}`} className="flex items-center gap-3 p-3 bg-[#F7F8F8] rounded-lg hover:shadow-md transition-shadow group">
                        <img 
                          src={other.photoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3"} 
                          className="w-12 h-12 rounded-full object-cover" 
                          alt={other.name} 
                        />
                        <div>
                          <h5 className="font-bold text-[#454545] text-sm group-hover:text-[#0f7f6d] transition-colors">{other.name}</h5>
                          <p className="text-xs text-gray-500">{other.position}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
