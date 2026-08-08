"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteGalleryImage } from "@/actions/gallery";
import { toast } from "sonner";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function GalleryListClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    const res = await deleteGalleryImage(id);
    if (res.success) {
      toast.success("Image deleted");
      setData((prev) => prev.filter((item) => item.id !== id));
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#454545]">Gallery</h1>
        <Link
          href="/admin/gallery/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#0f7f6d] text-white rounded hover:bg-[#0f7f6d]/90 transition-colors"
        >
          <AddIcon className="w-5 h-5" />
          Add Image
        </Link>
      </div>

      <div className="bg-white border border-[#E3E8E7] rounded-lg shadow-sm">
        <div className="p-4 border-b border-[#E3E8E7] flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#E3E8E7] rounded w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
            />
          </div>
        </div>

        <div className="p-6">
          {filteredData.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No gallery images found.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredData.map((item) => (
                <div key={item.id} className="group relative rounded-lg border border-[#E3E8E7] overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    {item.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded px-1 py-1 shadow-sm">
                      <Link
                        href={`/admin/gallery/${item.id}/edit`}
                        className="p-1 text-gray-600 hover:text-[#0f7f6d] transition-colors"
                        title="Edit"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 text-sm border-t border-[#E3E8E7] flex-1 flex flex-col justify-between">
                    <div className="font-semibold text-[#454545] truncate" title={item.title}>
                      {item.title}
                    </div>
                    {item.category && (
                      <div className="text-xs text-gray-500 mt-1 bg-gray-100 rounded px-2 py-0.5 w-fit">
                        {item.category}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
