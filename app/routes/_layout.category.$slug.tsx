import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CategoryFilter } from "~/components/CategoryFilter";
import { PostCard } from "~/components/PostCard";
import { getAllCategories, getPostsByCategory } from "~/lib/mdx.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "카테고리를 찾을 수 없습니다" },
      { name: "description", content: "요청한 카테고리를 찾을 수 없습니다." },
    ];
  }
  
  return [
    { title: `${data.categoryName} - 개발 블로그` },
    { name: "description", content: `개발 블로그의 ${data.categoryName} 카테고리 포스트 목록입니다.` },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  if (!slug) throw new Response("카테고리를 찾을 수 없습니다", { status: 404 });

  const categories = await getAllCategories();
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    throw new Response("카테고리를 찾을 수 없습니다", { status: 404 });
  }
  
  const posts = await getPostsByCategory(category.name);
  
  return json({
    posts,
    categorySlug: slug,
    categoryName: category.name,
    categories
  });
};

export default function CategoryPage() {
  const { posts, categoryName, categorySlug, categories } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          {categoryName}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {categoryName} 카테고리의 포스트 ({posts.length}개)
        </p>
        
        <CategoryFilter 
          categories={categories}
          currentCategory={categorySlug} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-16 bg-pastel-blue dark:bg-gray-800 rounded-xl">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            이 카테고리에 아직 포스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
} 