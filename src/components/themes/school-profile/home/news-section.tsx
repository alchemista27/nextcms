import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import Link from "next/link";
import { format } from "date-fns";

export default function NewsSection({ posts }: { posts: any[] }) {
  const displayPosts = posts.length > 0 ? posts.slice(0, 3) : [
    {
      id: 1,
      title: "Annual Science Exhibition Brings Innovation to Light",
      excerpt: "Students showcased remarkable projects focusing on renewable energy and robotics at this year's science fair.",
      featuredImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      publishedAt: new Date("2026-10-15"),
      author: { user_metadata: { full_name: "Admin" } },
      categories: [{ name: "Events" }],
      slug: "science-exhibition"
    },
    {
      id: 2,
      title: "New Global Curriculum Standards Implemented",
      excerpt: "Preparing our students for global challenges by integrating international standards into our core subjects.",
      featuredImage: "https://images.unsplash.com/photo-1523580494112-071d38458a4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      publishedAt: new Date("2026-10-10"),
      author: { user_metadata: { full_name: "Principal" } },
      categories: [{ name: "Academic" }],
      slug: "new-curriculum"
    },
    {
      id: 3,
      title: "SMaRT School Wins Regional Basketball Championship",
      excerpt: "A thrilling victory for our varsity team, bringing home the trophy for the third consecutive year.",
      featuredImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      publishedAt: new Date("2026-10-05"),
      author: { user_metadata: { full_name: "Coach" } },
      categories: [{ name: "Sports" }],
      slug: "basketball-championship"
    },
  ];

  return (
    <section id="news" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-schoolPrimary/5 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-schoolAccent/20 rounded-full filter blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 text-schoolPrimary font-semibold mb-2 uppercase tracking-widest text-sm">
              <span className="w-8 h-0.5 bg-schoolPrimary"></span> Stay Updated
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-schoolSecondary">Latest News & Events</h2>
          </div>
          <Link href="/blog" className="text-schoolPrimary font-semibold flex items-center gap-1 mt-4 md:mt-0 hover:gap-2 transition-all">
            Read More News <ArrowRightAltIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative w-full aspect-[3/2] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.featuredImage || "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-schoolPrimary text-white text-center rounded overflow-hidden shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-schoolSecondary px-4 py-1 text-xs font-bold uppercase">{post.publishedAt ? format(new Date(post.publishedAt), 'MMM') : 'MMM'}</div>
                  <div className="px-4 py-1 text-lg font-black">{post.publishedAt ? format(new Date(post.publishedAt), 'dd') : '00'}</div>
                </div>
              </div>
              <div className="p-6 relative">
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-schoolPrimary to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><PersonIcon className="w-4 h-4 text-schoolPrimary" /> {post.author?.user_metadata?.full_name || 'Admin'}</span>
                  {post.categories && post.categories.length > 0 && (
                    <span className="flex items-center gap-1"><FolderIcon className="w-4 h-4 text-schoolPrimary" /> {post.categories[0].name}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-schoolSecondary mb-3 group-hover:text-schoolPrimary transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <Link href={`/${post.slug}`} className="text-schoolPrimary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Article <ArrowRightAltIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
