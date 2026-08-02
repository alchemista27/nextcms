import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

// Generate static params for all published posts and pages
export async function generateStaticParams() {
  const [posts, pages] = await Promise.all([
    prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } }),
    prisma.page.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } }),
  ]);
  return [...posts, ...pages].map((item) => ({ slug: item.slug }));
}

// Generate metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, metaTitle: true, metaDescription: true, ogImage: true, excerpt: true },
  });

  if (post) {
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      openGraph: { title: post.metaTitle || post.title, images: post.ogImage ? [post.ogImage] : [] },
    };
  }

  const page = await prisma.page.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, metaTitle: true, metaDescription: true, ogImage: true },
  });

  if (page) {
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || "",
      openGraph: { title: page.metaTitle || page.title, images: page.ogImage ? [page.ogImage] : [] },
    };
  }

  return { title: "Not Found" };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  // Try post first
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true, avatar: true } },
      categories: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });

  if (post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#00704A]">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#00704A]">Blog</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="inline-block bg-[#D4E9E2] text-[#00704A] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E3932] mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#00704A] flex items-center justify-center text-white font-bold text-sm">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-gray-800">{post.author.name}</span>
          </div>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 text-sm">
            {format(new Date(post.publishedAt || post.createdAt), "MMMM dd, yyyy")}
          </span>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-72 md:h-[28rem] mb-10 rounded-2xl overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-[#1E3932] prose-a:text-[#00704A] prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="inline-block border border-gray-300 text-gray-600 text-sm px-4 py-1.5 rounded-full hover:border-[#00704A] hover:text-[#00704A] transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Try page
  const page = await prisma.page.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { name: true } } },
  });

  if (page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#00704A]">Home</Link>
          <span>/</span>
          <span className="text-gray-700">{page.title}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-[#1E3932] mb-10">{page.title}</h1>

        <div
          className="prose prose-lg max-w-none prose-headings:text-[#1E3932] prose-a:text-[#00704A]"
          dangerouslySetInnerHTML={{ __html: page.content || "" }}
        />
      </div>
    );
  }

  notFound();
}
