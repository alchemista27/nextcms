"use client";

import { useState, useRef } from "react";
import type { Media } from "@prisma/client";
import { deleteMediaAction, updateMediaMetaAction } from "./actions";

// Using a custom type for media to include uploader name
type MediaWithUploader = Media & { uploadedBy: { sharedUser: { fullName: string | null } | null } };

export function MediaLibrary({ initialMedia }: { initialMedia: MediaWithUploader[] }) {
  const [mediaList, setMediaList] = useState<MediaWithUploader[]>(initialMedia);
  const [selectedMedia, setSelectedMedia] = useState<MediaWithUploader | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically add to list (we don't have the uploader's name here easily unless returned by API, 
        // so we'll just do a hard refresh to get the fresh data from server).
        window.location.reload();
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this file?")) return;
    await deleteMediaAction(id);
    setSelectedMedia(null);
    setMediaList(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
      {/* Main Grid */}
      <div className="flex-1 bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-wrap justify-between items-center gap-4 bg-bg/50">
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-border rounded-lg text-sm bg-surface outline-none focus:border-primary">
              <option value="all">All media items</option>
              <option value="images">Images</option>
              <option value="unattached">Unattached</option>
            </select>
            <select className="px-3 py-2 border border-border rounded-lg text-sm bg-surface outline-none focus:border-primary">
              <option value="all">All dates</option>
            </select>
            <button className="px-3 py-2 border border-border rounded-lg text-sm bg-surface hover:bg-bg transition text-text-primary">
              Filter
            </button>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">search</span>
              <input type="text" placeholder="Search media..." className="pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium flex items-center gap-2 disabled:opacity-70"
            >
              <span className="material-icons-outlined text-[18px]">add</span> 
              {isUploading ? "Uploading..." : "Add New"}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 p-5 overflow-y-auto">
          {mediaList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary">
              <span className="material-icons-outlined text-6xl mb-4 opacity-50">collections</span>
              <p>No media files found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaList.map((media) => (
                <div 
                  key={media.id} 
                  onClick={() => setSelectedMedia(media)}
                  className={`relative aspect-square bg-bg rounded-lg border overflow-hidden cursor-pointer group ${selectedMedia?.id === media.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={media.url} alt={media.alt || media.originalName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="material-icons-outlined text-white">visibility</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Panel */}
      {selectedMedia && (
        <div className="w-full lg:w-[320px] bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-border font-semibold text-text-primary flex justify-between items-center bg-bg/50">
            Attachment Details
            <button onClick={() => setSelectedMedia(null)} className="text-text-secondary hover:text-text-primary">
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="aspect-video bg-bg rounded-lg border border-border overflow-hidden flex items-center justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedMedia.url} alt="Preview" className="max-w-full max-h-full object-contain" />
            </div>
            
            <div className="text-sm space-y-1 mb-6 text-text-secondary">
              <div className="font-semibold text-text-primary truncate" title={selectedMedia.originalName}>{selectedMedia.originalName}</div>
              <div>{new Date(selectedMedia.createdAt).toLocaleDateString()}</div>
              <div>{Math.round(selectedMedia.size / 1024)} KB</div>
              <div>Uploaded by: {selectedMedia.uploadedBy?.sharedUser?.fullName || 'Unknown'}</div>
            </div>

            <form action={(formData) => updateMediaMetaAction(selectedMedia.id, formData)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Alternative Text</label>
                <input 
                  type="text" 
                  name="alt"
                  defaultValue={selectedMedia.alt || ""} 
                  className="w-full p-2 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Caption</label>
                <textarea 
                  name="caption"
                  defaultValue={selectedMedia.caption || ""} 
                  className="w-full p-2 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none resize-y min-h-[80px]" 
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">File URL</label>
                <input 
                  type="text" 
                  readOnly 
                  value={selectedMedia.url} 
                  className="w-full p-2 border border-border rounded-lg bg-bg text-sm text-text-secondary" 
                />
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => handleDelete(selectedMedia.id)} 
                  className="py-2 px-3 text-danger border border-danger/30 rounded-lg text-sm hover:bg-danger/5 transition"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
