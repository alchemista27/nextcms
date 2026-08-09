"use client";

import { useState, useEffect, useRef } from "react";
import type { Media } from "@prisma/client";
import { getMediaAction } from "@/app/admin/media/actions";

export function MediaPicker({ 
  onSelect, 
  onClose 
}: { 
  onSelect: (media: Media) => void; 
  onClose: () => void; 
}) {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const data = await getMediaAction();
      setMediaList(data);
      setLoading(false);
    }
    load();
  }, []);

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
        // Refresh list
        const newData = await getMediaAction();
        setMediaList(newData);
        // Auto select the new one
        const newest = newData.find((m: Media) => m.id === data.media.id);
        if (newest) setSelectedMedia(newest);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg/50">
          <h2 className="text-xl font-semibold text-text-primary">Select Media</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          
          {/* Main Area */}
          <div className="flex-1 flex flex-col border-r border-border">
            {/* Toolbar */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface">
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
                className="px-4 py-2 bg-bg border border-border text-text-primary rounded-lg hover:bg-surface transition text-sm font-medium disabled:opacity-70"
              >
                {isUploading ? "Uploading..." : "Upload New"}
              </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="h-full flex items-center justify-center text-text-secondary">Loading...</div>
              ) : mediaList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                  <span className="material-icons-outlined text-4xl mb-2 opacity-50">collections</span>
                  <p>No media files found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {mediaList.map(media => (
                    <div 
                      key={media.id} 
                      onClick={() => setSelectedMedia(media)}
                      className={`relative aspect-square bg-bg rounded-lg border overflow-hidden cursor-pointer group ${selectedMedia?.id === media.id ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary/50'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={media.url} alt={media.alt || media.originalName} className="w-full h-full object-cover" />
                      {selectedMedia?.id === media.id && (
                        <div className="absolute top-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <span className="material-icons-outlined text-[16px]">check</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[300px] bg-bg flex flex-col shrink-0">
            {selectedMedia ? (
              <div className="p-5 flex-1 overflow-y-auto">
                <h3 className="font-semibold text-text-primary mb-4">Attachment Details</h3>
                <div className="aspect-video bg-surface rounded-lg border border-border overflow-hidden flex items-center justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedMedia.url} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-sm space-y-1 mb-6 text-text-secondary">
                  <div className="font-medium text-text-primary truncate" title={selectedMedia.originalName}>{selectedMedia.originalName}</div>
                  <div>{new Date(selectedMedia.createdAt).toLocaleDateString()}</div>
                  <div>{Math.round(selectedMedia.size / 1024)} KB</div>
                </div>
              </div>
            ) : (
              <div className="p-5 h-full flex items-center justify-center text-text-secondary text-sm text-center">
                Select an image to view details
              </div>
            )}
            
            <div className="p-4 border-t border-border bg-surface flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg text-sm text-text-primary hover:bg-bg transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => selectedMedia && onSelect(selectedMedia)}
                disabled={!selectedMedia}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
