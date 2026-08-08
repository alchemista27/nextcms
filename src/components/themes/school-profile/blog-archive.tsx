"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { SchoolProfileHeader, SchoolProfileFooter } from "./shared";

export default function SchoolProfileArchive({ settings, posts, primaryMenu }: { settings: any; posts: any[]; primaryMenu?: any }) {
  const about = settings?.about || {};
  const contact = settings?.contact || {};
  const schoolName = about.schoolName || "SMaRT School";

  const menuItems = primaryMenu?.items?.filter((item: any) => !item.parentId) || [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/#about" },
    { label: "Academics", url: "/#academics" },
    { label: "Teachers", url: "/#teachers" },
    { label: "Gallery", url: "/#gallery" },
    { label: "News", url: "/blog" }
  ];

  return (
    <div className="font-sans text-gray-700 bg-[#F8F9FA] selection:bg-[#0f7f6d] selection:text-white">
      <SchoolProfileHeader contact={contact} schoolName={schoolName} menuItems={menuItems} cta={settings?.cta || {}} />

      {/* Page Hero */}
      <section className="py-24 lg:py-36 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}>
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-bold text-white mb-4">News & Events</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-300 text-lg mb-6">Stay up-to-date with the latest from {schoolName}</motion.p>
          <motion.nav initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            <span className="text-[#D4E9E2]">News & Events</span>
          </motion.nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Posts */}
            <div className="w-full lg:w-2/3">
              {posts.map((post, index) => {
                const dateObj = new Date(post.createdAt || Date.now());
                const isFeatured = index === 0;

                return (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8 group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                    {post.featuredImage && (
                      <div className="relative w-full aspect-video overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        {isFeatured && <span className="absolute top-4 left-4 px-3 py-1 bg-[#0f7f6d] text-white text-xs font-bold rounded">Featured</span>}
                      </div>
                    )}
                    <div className="p-8 relative">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0f7f6d] to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">
                        <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm text-[#0f7f6d]">calendar_today</span> {format(dateObj, "MMMM dd, yyyy")}</span>
                        <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm text-[#0f7f6d]">person</span> {post.author?.name || "Admin"}</span>
                        {post.categories?.[0] && (
                          <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm text-[#0f7f6d]">folder</span> {post.categories[0].name}</span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-[#454545] mb-4 group-hover:text-[#0f7f6d] transition-colors">
                        <Link href={`/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                      <Link href={`/${post.slug}`} className="inline-flex items-center gap-2 text-[#0f7f6d] font-bold text-sm hover:gap-3 transition-all">Read Full Article <span className="material-icons-outlined text-sm">arrow_right_alt</span></Link>
                    </div>
                  </motion.div>
                );
              })}

              {posts.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-bold text-gray-400">No posts found</h3>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-28 space-y-8">
                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-[#454545] mb-4 pb-2 border-b border-gray-100">Search</h3>
                  <div className="relative">
                    <input type="text" placeholder="Search news..." className="w-full pl-4 pr-10 py-3 bg-[#F8F9FA] border border-gray-200 rounded focus:outline-none focus:border-[#0f7f6d] focus:bg-white transition-colors" />
                    <button className="absolute right-3 top-3 text-gray-400 hover:text-[#0f7f6d]"><span className="material-icons-outlined">search</span></button>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-[#454545] mb-4 pb-2 border-b border-gray-100">Categories</h3>
                  <ul className="space-y-3">
                    <li><a href="#" className="flex justify-between items-center text-gray-600 hover:text-[#0f7f6d] font-medium transition-colors"><span>Academics</span> <span className="text-xs bg-[#D4E9E2] text-[#0f7f6d] px-2 py-0.5 rounded-full">12</span></a></li>
                    <li><a href="#" className="flex justify-between items-center text-gray-600 hover:text-[#0f7f6d] font-medium transition-colors"><span>Events</span> <span className="text-xs bg-[#D4E9E2] text-[#0f7f6d] px-2 py-0.5 rounded-full">8</span></a></li>
                    <li><a href="#" className="flex justify-between items-center text-gray-600 hover:text-[#0f7f6d] font-medium transition-colors"><span>Achievements</span> <span className="text-xs bg-[#D4E9E2] text-[#0f7f6d] px-2 py-0.5 rounded-full">5</span></a></li>
                    <li><a href="#" className="flex justify-between items-center text-gray-600 hover:text-[#0f7f6d] font-medium transition-colors"><span>Student Life</span> <span className="text-xs bg-[#D4E9E2] text-[#0f7f6d] px-2 py-0.5 rounded-full">14</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SchoolProfileFooter schoolName={schoolName} about={about} contact={contact} menuItems={menuItems} />
    </div>
  );
}
