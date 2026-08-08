import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ApartmentIcon from "@mui/icons-material/Apartment";

export default function StatsSection() {
  return (
    <section className="py-20 relative bg-fixed bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0, 112, 74, 0.9), rgba(0, 112, 74, 0.9)), url('https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-white/20">
          
          <div className="animate-fade-in-up flex flex-col items-center">
            <GroupsIcon className="w-12 h-12 text-schoolAccent mb-4" />
            <h3 className="text-5xl font-bold text-white mb-2">2500</h3>
            <p className="text-schoolAccent font-medium uppercase tracking-widest text-sm">Students Enrolled</p>
          </div>
          
          <div className="animate-fade-in-up flex flex-col items-center" style={{ animationDelay: "100ms" }}>
            <SchoolIcon className="w-12 h-12 text-schoolAccent mb-4" />
            <h3 className="text-5xl font-bold text-white mb-2">150</h3>
            <p className="text-schoolAccent font-medium uppercase tracking-widest text-sm">Certified Teachers</p>
          </div>
          
          <div className="animate-fade-in-up flex flex-col items-center" style={{ animationDelay: "200ms" }}>
            <EmojiEventsIcon className="w-12 h-12 text-schoolAccent mb-4" />
            <h3 className="text-5xl font-bold text-white mb-2">85</h3>
            <p className="text-schoolAccent font-medium uppercase tracking-widest text-sm">Awards Won</p>
          </div>
          
          <div className="animate-fade-in-up flex flex-col items-center" style={{ animationDelay: "300ms" }}>
            <ApartmentIcon className="w-12 h-12 text-schoolAccent mb-4" />
            <h3 className="text-5xl font-bold text-white mb-2">45</h3>
            <p className="text-schoolAccent font-medium uppercase tracking-widest text-sm">Modern Classrooms</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
