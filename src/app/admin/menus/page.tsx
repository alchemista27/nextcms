import { getMenus } from "@/actions/menu";
import { getPages } from "@/actions/page";
import { getPosts } from "@/actions/post";
import { getCategories } from "@/actions/category";
import MenuBuilderClient from "./menu-builder-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menus - NextCMS Admin",
};

export default async function MenusPage() {
  const [menusRes, pagesRes, postsRes, categoriesRes] = await Promise.all([
    getMenus(),
    getPages(1, 100), // Get a bunch for selection
    getPosts(1, 100),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Menus</h1>
      </div>

      <MenuBuilderClient
        menus={menusRes.success ? menusRes.data || [] : []}
        pages={pagesRes.success ? pagesRes.data || [] : []}
        posts={postsRes.success ? postsRes.data || [] : []}
        categories={categoriesRes.success ? categoriesRes.data || [] : []}
      />
    </div>
  );
}
