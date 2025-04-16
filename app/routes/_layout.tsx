import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Sidebar } from "~/components/Sidebar";
import { getAllCategories, getAllTags, getPopularPosts } from "~/lib/mdx.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const categories = await getAllCategories();
  const allTags = await getAllTags();
  const popularPosts = await getPopularPosts(5);
  
  // 인기 태그는 최대 10개
  const popularTags = allTags.slice(0, 10);
  
  return json({
    categories,
    popularTags,
    popularPosts
  });
}

export default function BlogLayout() {
  const { categories, popularTags, popularPosts } = useLoaderData<typeof loader>();
  
  return (
    <div className="mx-auto max-w-6xl py-12 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="w-full lg:w-2/3">
          <Outlet />
        </main>
        
        <div className="w-full lg:w-1/3">
          <Sidebar 
            categories={categories}
            popularTags={popularTags}
            popularPosts={popularPosts}
          />
        </div>
      </div>
    </div>
  );
} 