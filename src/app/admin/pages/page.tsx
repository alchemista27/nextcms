import { getPages } from "@/actions/page";
import PageListClient from "./page-list-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pages - NextCMS Admin",
};

interface PagesPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function PagesPage({ searchParams }: PagesPageProps) {
  const params = await searchParams;
  const status = params.status || "ALL";
  const search = params.search || "";

  const result = await getPages({ status, search });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Pages</h1>
        <a
          href="/admin/pages/new"
          className="inline-flex items-center px-4 py-2 bg-[#00704A] hover:bg-[#1E3932] text-white text-sm font-medium rounded-md transition-colors"
        >
          + Add New Page
        </a>
      </div>

      <PageListClient
        initialPages={result.success ? result.data || [] : []}
        counts={result.success ? result.counts || {} : {}}
        currentStatus={status}
        currentSearch={search}
      />
    </div>
  );
}
