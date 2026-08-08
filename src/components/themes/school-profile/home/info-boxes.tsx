import MenuBookIcon from "@mui/icons-material/MenuBook";
import PsychologyIcon from "@mui/icons-material/Psychology";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export default function InfoBoxesSection() {
  return (
    <section className="relative z-20 -mt-24 lg:-mt-32 pb-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1 */}
          <div className="group bg-white p-8 rounded-lg border-b-4 border-schoolPrimary shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-4 animate-bounce-up" style={{ animationDelay: "1700ms" }}>
            <div className="w-16 h-16 bg-schoolAccent text-schoolPrimary rounded-full flex items-center justify-center mb-6 transition-all duration-400 group-hover:bg-schoolPrimary group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
              <MenuBookIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-schoolSecondary mb-3">Quality Education</h3>
            <p className="text-gray-500 mb-4 line-clamp-3">We provide a comprehensive curriculum designed to challenge and inspire students to reach their full potential.</p>
            <a href="#" className="text-schoolPrimary font-semibold flex items-center gap-1 hover:gap-2 transition-all">Read More <ArrowRightAltIcon className="w-5 h-5" /></a>
          </div>
          
          {/* Box 2 */}
          <div className="group bg-schoolPrimary p-8 rounded-lg shadow-xl text-white transition-all duration-400 hover:-translate-y-4 animate-bounce-up" style={{ animationDelay: "1900ms" }}>
            <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mb-6 transition-all duration-400 group-hover:bg-white group-hover:text-schoolPrimary group-hover:scale-110 group-hover:rotate-6">
              <PsychologyIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Expert Teachers</h3>
            <p className="text-schoolAccent/90 mb-4 line-clamp-3">Our faculty consists of highly qualified, dedicated professionals who are passionate about teaching.</p>
            <a href="#" className="text-schoolAccent font-semibold flex items-center gap-1 hover:gap-2 transition-all">Read More <ArrowRightAltIcon className="w-5 h-5" /></a>
          </div>
          
          {/* Box 3 */}
          <div className="group bg-white p-8 rounded-lg border-b-4 border-schoolPrimary shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-4 animate-bounce-up" style={{ animationDelay: "2100ms" }}>
            <div className="w-16 h-16 bg-schoolAccent text-schoolPrimary rounded-full flex items-center justify-center mb-6 transition-all duration-400 group-hover:bg-schoolPrimary group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
              <EmojiEventsIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-schoolSecondary mb-3">Global Recognition</h3>
            <p className="text-gray-500 mb-4 line-clamp-3">Recognized for academic excellence and outstanding extracurricular achievements worldwide.</p>
            <a href="#" className="text-schoolPrimary font-semibold flex items-center gap-1 hover:gap-2 transition-all">Read More <ArrowRightAltIcon className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
