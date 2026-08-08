"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { SchoolProfileHeader, SchoolProfileFooter } from "./shared";

export default function SchoolProfileSinglePost({ settings, post, primaryMenu }: { settings: any; post: any; primaryMenu?: any }) {
  const about = settings?.about || {};
  const contact = settings?.contact || {};
  const schoolName = about.schoolName || "SMaRT School";
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const menuItems = primaryMenu?.items?.filter((item: any) => !item.parentId) || [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/#about" },
    { label: "Academics", url: "/#academics" },
    { label: "Teachers", url: "/#teachers" },
    { label: "Gallery", url: "/#gallery" },
    { label: "News", url: "/blog" }
  ];

  const dateObj = new Date(post.publishedAt || post.createdAt);

  return (
    <div className="font-sans text-gray-700 bg-[#F8F9FA] selection:bg-[#0f7f6d] selection:text-white relative">
      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#0f7f6d] origin-left z-[100]" style={{ scaleX }} />

      <SchoolProfileHeader contact={contact} schoolName={schoolName} menuItems={menuItems} cta={settings?.cta || {}} />

      {/* Page Hero */}
      <section className="py-24 lg:py-36 bg-cover bg-center relative" style={{ backgroundImage: `linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.85)), url(${post.featuredImage || 'https://images.unsplash.com/photo-1523580494112-071d38458a4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'})` }}>
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-2 mb-6">
            {post.categories?.map((cat: any) => (
              <span key={cat.slug} className="px-3 py-1 bg-[#0f7f6d] text-white text-xs font-bold rounded uppercase tracking-wider">{cat.name}</span>
            ))}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-4 text-sm text-gray-300 font-medium">
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#D4E9E2]">calendar_today</span> {format(dateObj, "MMMM dd, yyyy")}</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#D4E9E2]">person</span> {post.author?.name || "Admin"}</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-2"><span className="material-icons-outlined text-sm text-[#D4E9E2]">schedule</span> 5 min read</span>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Article */}
            <article className="w-full lg:w-2/3">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
                {/* Prose content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-[#454545] prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-[#0f7f6d] prose-a:font-semibold prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-[#0f7f6d] prose-blockquote:bg-[#F8F9FA] prose-blockquote:p-4 prose-blockquote:not-italic prose-blockquote:text-lg prose-blockquote:text-[#454545] prose-img:rounded-lg prose-li:marker:text-[#0f7f6d]"
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />

                {/* Share */}
                <div className="flex items-center gap-4 mt-12 pt-6 border-t border-gray-100">
                  <span className="text-sm font-semibold text-[#454545]">Share this article:</span>
                  <a href="#" className="w-9 h-9 rounded-full bg-[#F8F9FA] flex items-center justify-center text-gray-500 hover:bg-[#0f7f6d] hover:text-white transition-colors"><span className="material-icons-outlined text-sm">facebook</span></a>
                  <a href="#" className="w-9 h-9 rounded-full bg-[#F8F9FA] flex items-center justify-center text-gray-500 hover:bg-[#0f7f6d] hover:text-white transition-colors"><span className="material-icons-outlined text-sm">camera_alt</span></a>
                  <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="w-9 h-9 rounded-full bg-[#F8F9FA] flex items-center justify-center text-gray-500 hover:bg-[#0f7f6d] hover:text-white transition-colors"><span className="material-icons-outlined text-sm">link</span></button>
                </div>
              </motion.div>

              {/* Author Box */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {post.author?.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={post.author.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-[#D4E9E2] shrink-0" alt={post.author.name} />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#0f7f6d] text-white flex items-center justify-center text-3xl font-bold border-4 border-[#D4E9E2] shrink-0">
                    {post.author?.name?.charAt(0) || "A"}
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#0f7f6d] font-bold uppercase tracking-wider mb-1">Written by</p>
                  <h4 className="text-xl font-bold text-[#454545] mb-2">{post.author?.name || "Admin"}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Author at {schoolName}. Passionate about sharing knowledge and inspiring students.</p>
                </div>
              </motion.div>
            </article>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-28 space-y-8">
                
                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-[#454545] mb-4 pb-2 border-b border-gray-100">Search</h3>
                  <div className="relative">
                    <input type="text" placeholder="Search news..." className="w-full pl-4 pr-10 py-3 bg-[#F8F9FA] border border-gray-200 rounded focus:outline-none focus:border-[#0f7f6d] focus:bg-white transition-colors text-sm" />
                    <button className="absolute right-3 top-3 text-gray-400 hover:text-[#0f7f6d]"><span className="material-icons-outlined">search</span></button>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-[#454545] mb-4 pb-2 border-b border-gray-100">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: any) => (
                        <span key={tag.slug} className="px-3 py-1 bg-[#F8F9FA] border border-gray-200 text-gray-600 text-xs font-semibold rounded hover:border-[#0f7f6d] hover:text-[#0f7f6d] transition-colors cursor-pointer">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <SchoolProfileFooter schoolName={schoolName} about={about} contact={contact} menuItems={menuItems} />
    </div>
  );
}
