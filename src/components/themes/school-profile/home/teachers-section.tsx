import FacebookIcon from "@mui/icons-material/Facebook";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EmailIcon from "@mui/icons-material/Email";

export default function TeachersSection({ teachers }: { teachers: any[] }) {
  // If no teachers from DB, use placeholders (for development/preview)
  const displayTeachers = teachers.length > 0 ? teachers.slice(0, 4) : [
    { id: 1, name: "Sarah Jenkins", position: "Head of Science", photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Michael Chen", position: "Mathematics Dept.", photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Dr. Emily Smith", position: "Literature & Arts", photoUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "James Wilson", position: "Physical Education", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <section id="teachers" className="py-20 bg-schoolGraylight">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 text-schoolPrimary font-semibold mb-2 uppercase tracking-widest text-sm">
            <span className="w-8 h-0.5 bg-schoolPrimary"></span> Expert Faculty <span className="w-8 h-0.5 bg-schoolPrimary"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-schoolSecondary">Meet Our Dedicated Educators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayTeachers.map((teacher, index) => (
            <div key={teacher.id} className="bg-white rounded-lg shadow-sm border border-gray-100 relative group animate-fade-in-up overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-full aspect-square overflow-hidden bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={teacher.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} alt={teacher.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6 text-center bg-white relative z-10">
                <h4 className="text-xl font-bold text-schoolSecondary mb-1">{teacher.name}</h4>
                <p className="text-schoolPrimary text-sm font-medium">{teacher.position}</p>
              </div>
              {/* Hover Socials */}
              <div className="absolute bottom-[-50px] left-0 w-full bg-white/95 p-4 transition-all duration-300 opacity-0 group-hover:bottom-0 group-hover:opacity-100 flex justify-center gap-4 text-gray-400 z-20">
                <a href="#" className="hover:text-schoolPrimary transition-transform hover:-translate-y-1"><FacebookIcon className="w-5 h-5" /></a>
                <a href="#" className="hover:text-schoolPrimary transition-transform hover:-translate-y-1"><CameraAltIcon className="w-5 h-5" /></a>
                <a href="#" className="hover:text-schoolPrimary transition-transform hover:-translate-y-1"><EmailIcon className="w-5 h-5" /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
