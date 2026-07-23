"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { bulkAction } from "@/actions/page";
import { formatDate } from "@/lib/utils";
import SearchIcon from "@mui/icons-material/Search";

type PageStatus = "DRAFT" | "PUBLISHED" | "TRASH";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  updatedAt: Date;
  publishedAt: Date | null;
  author: { id: string; name: string; avatar: string | null };
  parent?: { id: string; title: string } | null;
}

const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "PUBLISHED", label: "Published" },
  { key: "DRAFT", label: "Draft" },
  { key: "TRASH", label: "Trash" },
];

const STATUS_BADGE: Record<PageStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "Published", className: "bg-green-100 text-green-700" },
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-600" },
  TRASH: { label: "Trash", className: "bg-red-100 text-red-600" },
};

interface PageListClientProps {
  initialPages: Page[];
  counts: Record<string, number>;
  currentStatus: string;
  currentSearch: string;
}

export default function PageListClient({
  initialPages,
  counts,
  currentStatus,
  currentSearch,
}: PageListClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState(currentSearch);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: search || undefined });
  };

  const handleBulkAction = (action: "publish" | "trash" | "delete") => {
    if (!selectedIds.length) return;
    const msg =
      action === "delete"
        ? `Permanently delete ${selectedIds.length} page(s)? This cannot be undone.`
        : `${action === "publish" ? "Publish" : "Move to trash"} ${selectedIds.length} page(s)?`;
    if (!confirm(msg)) return;

    startTransition(async () => {
      await bulkAction(selectedIds, action);
      setSelectedIds([]);
      router.refresh();
    });
  };

  const columns: ColumnDef<Page, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-gray-300"
        />
      ),
      size: 40,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const page = row.original;
        const isTrash = page.status === "TRASH";
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 flex items-center">
              {page.parent ? <span className="text-gray-400 mr-2">—</span> : null}
              {page.title}
            </div>
            <div className="flex items-center gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {!isTrash ? (
                <>
                  <a href={`/admin/pages/${page.id}/edit`} className="text-[#00704A] hover:underline">Edit</a>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => startTransition(async () => { await bulkAction([page.id], "trash"); router.refresh(); })}
                    disabled={isPending}
                    className="text-red-500 hover:underline"
                  >
                    Trash
                  </button>
                  <span className="text-gray-300">|</span>
                  <a href={`/${page.slug}`} target="_blank" className="text-gray-500 hover:underline">View</a>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startTransition(async () => { await bulkAction([page.id], "publish"); router.refresh(); })}
                    disabled={isPending}
                    className="text-[#00704A] hover:underline"
                  >
                    Restore (Draft)
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => {
                      if (confirm("Delete permanently? This cannot be undone.")) {
                        startTransition(async () => { await bulkAction([page.id], "delete"); router.refresh(); });
                      }
                    }}
                    disabled={isPending}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete Permanently
                  </button>
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#00704A] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {row.original.author.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-600 text-sm">{row.original.author.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const badge = STATUS_BADGE[row.original.status];
        return (
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
            {badge.label}
          </span>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-gray-500 text-xs whitespace-nowrap">{formatDate(row.original.updatedAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-0 -mb-px overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = counts[tab.key] ?? 0;
          const isActive = currentStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => updateParams({ status: tab.key === "ALL" ? undefined : tab.key })}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-[#00704A] text-[#00704A]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <span className="text-sm text-gray-500">{selectedIds.length} selected</span>
              <button
                onClick={() => handleBulkAction("publish")}
                disabled={isPending || currentStatus === "TRASH"}
                className="px-3 py-1.5 text-xs bg-[#00704A] text-white rounded hover:bg-[#1E3932] disabled:opacity-50 transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction("trash")}
                disabled={isPending}
                className="px-3 py-1.5 text-xs bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                Move to Trash
              </button>
              {currentStatus === "TRASH" && (
                <button
                  onClick={() => handleBulkAction("delete")}
                  disabled={isPending}
                  className="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  Delete Permanently
                </button>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A] focus:border-[#00704A] w-56"
            />
          </div>
          <button type="submit" className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={initialPages}
          onRowSelectionChange={setSelectedIds}
        />
      </div>
    </div>
  );
}
