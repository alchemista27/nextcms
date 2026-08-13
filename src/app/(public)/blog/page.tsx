import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Events",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  const [posts, totalPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      include: { author: { include: { sharedUser: true } }, tags: true },
    }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.tag.findMany(), // using tags as categories for now
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <div>
      {/* Page Hero */}
      <section 
        className="py-24 lg:py-36 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">News & Events</h1>
          <p className="text-gray-300 text-lg mb-6">Stay up-to-date with the latest from SMaRT School</p>
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#E3E8E7]">News & Events</span>
          </nav>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="py-20 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Posts Area */}
            <div className="w-full lg:w-2/3">
              {posts.length > 0 ? (
                <>
                  {/* Featured Post (First Post) */}
                  {page === 1 && posts[0] && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8 group hover:shadow-xl transition-shadow duration-300">
                      <div className="relative w-full aspect-video overflow-hidden">
                        <img 
                          src={posts[0].featuredImage || "https://images.unsplash.com/photo-1523580494112-071d38458a4c?ixlib=rb-4.0.3"} 
                          alt="Featured" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-[#0f7f6d] text-white text-xs font-bold rounded">Featured</span>
                      </div>
                      <div className="p-8 relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0f7f6d] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">
                          <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm text-[#0f7f6d]">calendar_today</span> {new Date(posts[0].publishedAt || posts[0].createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm text-[#0f7f6d]">person</span> {posts[0].author.sharedUser?.fullName || "Unknown"}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#454545] mb-4 group-hover:text-[#0f7f6d] transition-colors">
                          <Link href={`/${posts[0].slug}`}>{posts[0].title}</Link>
                        </h2>
                        <p className="text-gray-500 mb-6">
                          {posts[0].excerpt || (posts[0].content || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                        </p>
                        <Link href={`/${posts[0].slug}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0f7f6d] text-white rounded font-semibold hover:bg-[#454545] transition-colors">
                          Read More <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Post Grid (Remaining Posts) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.slice(page === 1 ? 1 : 0).map((post) => (
                      <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                        <div className="relative w-full aspect-video overflow-hidden">
                          <img 
                            src={post.featuredImage || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3"} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                        </div>
                        <div className="p-6 relative">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0f7f6d] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold mb-3">
                            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                            {post.tags.length > 0 && (
                              <>
                                <span>·</span>
                                <span className="text-[#0f7f6d]">{post.tags[0].name}</span>
                              </>
                            )}
                          </div>
                          <h3 className="font-bold text-[#454545] mb-3 group-hover:text-[#0f7f6d] transition-colors line-clamp-2">
                            <Link href={`/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {post.excerpt || (post.content || '').replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'}
                          </p>
                          <Link href={`/${post.slug}`} className="text-[#0f7f6d] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read Article <span className="material-icons-outlined text-sm">arrow_right_alt</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-12">
                      {page > 1 && (
                        <Link href={`/blog?page=${page - 1}`} className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-[#0f7f6d] hover:text-white hover:border-[#0f7f6d] transition-colors">
                          <span className="material-icons-outlined text-sm">chevron_left</span>
                        </Link>
                      )}
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <Link 
                          key={p} 
                          href={`/blog?page=${p}`} 
                          className={`w-10 h-10 flex items-center justify-center rounded border transition-colors ${
                            p === page ? "bg-[#0f7f6d] text-white border-[#0f7f6d]" : "border-gray-200 text-gray-500 hover:bg-[#0f7f6d] hover:text-white hover:border-[#0f7f6d]"
                          }`}
                        >
                          {p}
                        </Link>
                      ))}

                      {page < totalPages && (
                        <Link href={`/blog?page=${page + 1}`} className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-[#0f7f6d] hover:text-white hover:border-[#0f7f6d] transition-colors">
                          <span className="material-icons-outlined text-sm">chevron_right</span>
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">No news available</h3>
                  <p className="text-gray-500">Check back later for updates.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#454545] text-lg mb-4 pb-2 border-b-2 border-[#0f7f6d] inline-block">Search</h3>
                <form className="relative">
                  <input type="text" placeholder="Search news..." className="w-full px-4 py-2.5 bg-[#F7F8F8] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#0f7f6d]" />
                  <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-[#0f7f6d]">
                    <span className="material-icons-outlined text-xl">search</span>
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#454545] text-lg mb-4 pb-2 border-b-2 border-[#0f7f6d] inline-block">Categories</h3>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/blog?category=${cat.slug}`} className="flex items-center justify-between text-gray-500 hover:text-[#0f7f6d] transition-colors">
                        <span className="flex items-center gap-2"><span className="material-icons-outlined text-xs">folder</span> {cat.name}</span>
                      </Link>
                    </li>
                  ))}
                  {categories.length === 0 && (
                    <li className="text-sm text-gray-400 italic">No categories yet</li>
                  )}
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
