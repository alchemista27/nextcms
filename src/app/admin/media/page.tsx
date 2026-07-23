import { getMedia } from "@/actions/media";
import MediaListClient from "./media-list-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Library - NextCMS Admin",
};

interface MediaPageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1");

  const result = await getMedia(page, 30, search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Media Library</h1>
      </div>

      <MediaListClient
        initialMedia={result.success ? result.data || [] : []}
        total={result.success ? result.total || 0 : 0}
        totalPages={result.success ? result.totalPages || 1 : 1}
        currentSearch={search}
        currentPage={page}
      />
    </div>
  );
}
