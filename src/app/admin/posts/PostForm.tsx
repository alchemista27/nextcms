"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { savePostAction } from "./actions";

const TipTapEditor = dynamic(() => import("@/components/editor/TipTapEditor").then(m => m.TipTapEditor), { ssr: false, loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl border border-gray-200 flex items-center justify-center text-gray-400">Loading Editor...</div> });
const MediaPicker = dynamic(() => import("@/components/admin/media-picker").then(m => m.MediaPicker), { ssr: false });
import Link from "next/link";
import type { Post } from "@prisma/client";

interface PostFormProps {
  initialData?: Partial<Post>;
}

export function PostForm({ initialData }: PostFormProps) {
  const isEdit = !!initialData?.id;
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  
  const [slugError, setSlugError] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Auto-generate slug from title if it's not manually edited yet
  const [slugEdited, setSlugEdited] = useState(isEdit);

  useEffect(() => {
    if (!slugEdited && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  }, [title, slugEdited]);

  useEffect(() => {
    const checkSlug = async () => {
      if (!slug) return;
      setIsCheckingSlug(true);
      try {
        const res = await fetch(`/api/posts/check-slug?slug=${slug}${isEdit ? `&excludeId=${initialData.id}` : ""}`);
        const data = await res.json();
        if (data.isAvailable === false) {
          setSlugError("Slug is already taken");
        } else {
          setSlugError("");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsCheckingSlug(false);
      }
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [slug, isEdit, initialData?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (slugError) return;

    setIsPending(true);
    setFormError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    formData.append("excerpt", excerpt);
    formData.append("status", status);
    formData.append("featuredImage", featuredImage);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    try {
      const result = await savePostAction(initialData?.id || null, formData);
      if (result?.error) {
        setFormError(result.error);
        setIsPending(false);
      }
    } catch (err) {
      setFormError("An unexpected error occurred.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        {formError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            {formError}
          </div>
        )}

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            className="w-full text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-secondary font-medium">Permalink / Slug:</label>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary bg-bg px-3 py-2 rounded border border-border">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              className={`flex-1 p-2 border rounded focus:outline-none focus:border-primary ${slugError ? "border-red-500" : "border-border"}`}
              required
            />
            {isCheckingSlug && <span className="text-xs text-text-secondary">Checking...</span>}
          </div>
          {slugError && <span className="text-xs text-red-500">{slugError}</span>}
        </div>

        <div>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Excerpt</h3>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full h-24 p-3 border border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="Write a brief summary of the post..."
            maxLength={500}
          />
          <p className="text-xs text-text-secondary text-right mt-1">{excerpt.length}/500</p>
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="w-full lg:w-[320px] flex flex-col gap-6">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-text-primary mb-4 pb-2 border-b border-border">Publish</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2.5 border border-border rounded-lg bg-bg focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="PENDING">Pending Review</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-border mt-4">
            <button
              type="submit"
              disabled={isPending || !!slugError || !title}
              className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50"
            >
              {isPending ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
            </button>
            <Link
              href="/admin/posts"
              className="w-full py-2.5 bg-bg text-text-primary border border-border rounded-lg hover:bg-gray-100 transition text-center font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-text-primary mb-4 pb-2 border-b border-border">Featured Image</h3>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg bg-bg hover:bg-gray-50 transition cursor-pointer" onClick={() => setShowMediaPicker(true)}>
            {featuredImage ? (
              <img src={featuredImage} alt="Featured" className="w-full h-auto rounded" />
            ) : (
              <>
                <span className="material-icons-outlined text-4xl text-text-secondary mb-2">image</span>
                <span className="text-sm text-text-secondary">Click to set image</span>
              </>
            )}
          </div>
          {featuredImage && (
            <button type="button" onClick={() => setFeaturedImage("")} className="text-xs text-red-500 mt-2 hover:underline">
              Remove image
            </button>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Search Engine Optimization</h3>
          
          <div className="mb-6 bg-white border border-gray-200 rounded p-4 shadow-sm">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Google Preview</h4>
            <div className="flex flex-col">
              <span className="text-sm text-green-700 truncate">{typeof window !== "undefined" ? window.location.origin : "https://smartschool.edu"}/blog/{slug || "post-slug"}</span>
              <span className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">{metaTitle || title || "Please add a title"}</span>
              <span className="text-sm text-[#4d5156] line-clamp-2 mt-1">{metaDescription || excerpt || "Please provide a meta description or excerpt for this post. It helps users understand what your content is about before clicking."}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label className="text-sm text-text-secondary font-medium">Meta Title</label>
                <span className={`text-xs ${metaTitle.length > 60 ? "text-red-500" : (metaTitle.length > 40 ? "text-green-500" : "text-gray-400")}`}>{metaTitle.length}/60</span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full p-2 border border-border rounded focus:outline-none focus:border-primary"
                placeholder="SEO optimized title..."
              />
              <div className="h-1 w-full bg-gray-200 rounded mt-1 overflow-hidden">
                <div className={`h-full ${metaTitle.length > 60 ? "bg-red-500" : (metaTitle.length > 40 ? "bg-green-500" : "bg-yellow-400")}`} style={{ width: `${Math.min(metaTitle.length / 60 * 100, 100)}%` }}></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label className="text-sm text-text-secondary font-medium">Meta Description</label>
                <span className={`text-xs ${metaDescription.length > 160 ? "text-red-500" : (metaDescription.length > 120 ? "text-green-500" : "text-gray-400")}`}>{metaDescription.length}/160</span>
              </div>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full p-2 border border-border rounded focus:outline-none focus:border-primary"
                placeholder="Brief description for search results..."
                rows={3}
              />
              <div className="h-1 w-full bg-gray-200 rounded mt-1 overflow-hidden">
                <div className={`h-full ${metaDescription.length > 160 ? "bg-red-500" : (metaDescription.length > 120 ? "bg-green-500" : "bg-yellow-400")}`} style={{ width: `${Math.min(metaDescription.length / 160 * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showMediaPicker && (
        <MediaPicker 
          onSelect={(media) => {
            setFeaturedImage(media.url);
            setShowMediaPicker(false);
          }} 
          onClose={() => setShowMediaPicker(false)} 
        />
      )}
    </form>
  );
}
