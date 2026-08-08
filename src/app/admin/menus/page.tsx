import { getMenus } from "@/actions/menu";
import { getPosts } from "@/actions/post";
import { getCategories } from "@/actions/category";
import MenuBuilderClient from "./menu-builder-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menus - NextCMS Admin",
};

export default async function MenusPage() {
  const [menusRes, postsRes, categoriesRes] = await Promise.all([
    getMenus(),
    getPosts({ page: 1, perPage: 100 }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Menus</h1>
      </div>

      <MenuBuilderClient
        menus={menusRes.success ? menusRes.data || [] : []}
        posts={postsRes.success ? postsRes.data || [] : []}
        categories={categoriesRes.success ? categoriesRes.data || [] : []}
      />
    </div>
  );
}
