import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt || (post.content || '').replace(/<[^>]*>?/gm, '').substring(0, 150),
  };
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { include: { sharedUser: true } }, tags: true },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Fetch recent posts for sidebar
  const recentPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED", id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  const categories = await prisma.tag.findMany();

  return (
    <div>
      {/* Page Hero */}
      <section 
        className="py-24 lg:py-36 bg-cover bg-center relative"
        style={{ backgroundImage: `linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('${post.featuredImage || 'https://images.unsplash.com/photo-1523580494112-071d38458a4c?ixlib=rb-4.0.3'}')` }}
      >
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#E3E8E7] mb-6">
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="material-icons-outlined text-sm">calendar_today</span> 
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="material-icons-outlined text-sm">person</span> 
              {post.author.sharedUser?.fullName || "Unknown"}
            </span>
            {post.tags.length > 0 && (
              <span className="flex items-center gap-1 bg-[#0f7f6d]/80 px-3 py-1 rounded-full backdrop-blur-sm">
                <span className="material-icons-outlined text-sm">folder</span> 
                {post.tags[0].name}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <Link href="/blog" className="hover:text-white transition-colors">News</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#E3E8E7] truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="py-20 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
                {post.featuredImage && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden mb-10">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                
                {/* Article Content styled using prose / basic typography */}
                <article 
                  className="prose prose-lg max-w-none prose-headings:text-[#454545] prose-a:text-[#0f7f6d] prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: post.content || '' }}
                />

                <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#454545]">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <Link key={tag.id} href={`/blog?category=${tag.slug}`} className="px-3 py-1 bg-[#F7F8F8] text-gray-500 rounded text-sm hover:bg-[#0f7f6d] hover:text-white transition-colors">
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#454545]">Share:</span>
                    <button className="w-8 h-8 rounded-full bg-[#F7F8F8] flex items-center justify-center text-gray-500 hover:bg-[#0f7f6d] hover:text-white transition-colors"><span className="material-icons-outlined text-sm">facebook</span></button>
                    <button className="w-8 h-8 rounded-full bg-[#F7F8F8] flex items-center justify-center text-gray-500 hover:bg-[#0f7f6d] hover:text-white transition-colors"><span className="material-icons-outlined text-sm">link</span></button>
                  </div>
                </div>
              </div>
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
                <h3 className="font-bold text-[#454545] text-lg mb-6 pb-2 border-b-2 border-[#0f7f6d] inline-block">Recent Posts</h3>
                <div className="space-y-6">
                  {recentPosts.map(rp => (
                    <div key={rp.id} className="flex gap-4 group">
                      <div className="w-20 h-20 shrink-0 rounded overflow-hidden">
                        <img src={rp.featuredImage || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3"} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#454545] group-hover:text-[#0f7f6d] transition-colors line-clamp-2 mb-1">
                          <Link href={`/${rp.slug}`}>{rp.title}</Link>
                        </h4>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><span className="material-icons-outlined text-[10px]">calendar_today</span> {new Date(rp.publishedAt || rp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {recentPosts.length === 0 && <p className="text-sm text-gray-400 italic">No recent posts</p>}
                </div>
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
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
