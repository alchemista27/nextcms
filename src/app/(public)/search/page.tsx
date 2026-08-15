import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawQ = params.q;
  const q = typeof rawQ === "string" ? rawQ : "";

  // Search posts
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: { publishedAt: "desc" },
    include: { categories: true },
  });

  // Search team members
  const teamMembers = await prisma.teamMember.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { position: { contains: q, mode: "insensitive" } },
        { bio: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 10,
  });

  const totalResults = posts.length + teamMembers.length;

  return (
    <div className="bg-[#F7F8F8] antialiased flex flex-col min-h-screen">
      {/* Header / Search Bar */}
      <section className="bg-[#454545] py-12">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <h1 className="text-3xl font-bold text-white mb-6">
            Search Results for: &quot;{q}&quot;
          </h1>
          <form action="/search" method="GET" className="flex w-full">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search..."
              className="flex-1 border-0 rounded-l px-6 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f7f6d] text-lg"
            />
            <button
              type="submit"
              className="bg-[#0f7f6d] text-white px-8 rounded-r hover:bg-[#005e3e] transition-colors"
            >
              <span className="material-icons-outlined text-xl">search</span>
            </button>
          </form>
          <p className="text-[#E3E8E7] mt-4 text-sm">Found {totalResults} results</p>
        </div>
      </section>

      {/* Results List */}
      <main className="flex-grow py-16 bg-[#F7F8F8]">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div
                key={`post-${post.id}`}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {post.featuredImage ? (
                  <div className="relative w-full md:w-48 h-32 flex-shrink-0">
                    <Image
                      src={post.featuredImage}
                      alt={post.title || ""}
                      fill
                      sizes="(max-width: 768px) 100vw, 200px"
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-48 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    <span className="material-icons-outlined text-4xl">description</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex gap-2 mb-2 items-center">
                    <span className="text-xs bg-[#0f7f6d]/10 text-[#0f7f6d] px-2 py-0.5 rounded font-semibold">
                      News & Events
                    </span>
                    {post.publishedAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#454545] mb-2 hover:text-[#0f7f6d] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {post.excerpt || post.content?.replace(/<[^>]+>/g, "").substring(0, 150)}
                  </p>
                </div>
              </div>
            ))}

            {teamMembers.map((member, index) => (
              <div
                key={`team-${member.id}`}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
                style={{ animationDelay: `${(posts.length + index) * 100}ms` }}
              >
                {member.photoUrl ? (
                  <div className="relative w-full md:w-48 h-32 flex-shrink-0">
                    <Image
                      src={member.photoUrl}
                      alt={member.name || ""}
                      fill
                      sizes="(max-width: 768px) 100vw, 200px"
                      className="object-cover rounded object-top"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-48 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    <span className="material-icons-outlined text-4xl">person</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex gap-2 mb-2 items-center">
                    <span className="text-xs bg-[#454545]/10 text-[#454545] px-2 py-0.5 rounded font-semibold">
                      Teacher Profile
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#454545] mb-2 hover:text-[#0f7f6d] transition-colors">
                    <Link href={`/team/${member.slug}`}>
                      {member.name} - {member.position}
                    </Link>
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {member.bio?.replace(/<[^>]+>/g, "").substring(0, 150) || "Profile of " + member.name}
                  </p>
                </div>
              </div>
            ))}

            {totalResults === 0 && (
              <div className="text-center py-12">
                <span className="material-icons-outlined text-6xl text-gray-300 mb-4 block">search_off</span>
                <h3 className="text-xl font-bold text-[#454545] mb-2">No results found</h3>
                <p className="text-gray-500">
                  We couldn&apos;t find anything matching &quot;{q}&quot;. Try different keywords.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
