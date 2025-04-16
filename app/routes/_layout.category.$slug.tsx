import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { TagFilter } from "~/components/TagFilter";
import { PostCard } from "~/components/PostCard";
import { getAllCategories, getAllTags, getPostsByCategory } from "~/lib/mdx.server";
import { FadeIn } from "~/components/animations/FadeIn";
import { motion } from "framer-motion";

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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  if (!slug) throw new Response("카테고리를 찾을 수 없습니다", { status: 404 });

  const url = new URL(request.url);
  const selectedTags = url.searchParams.getAll("tags");

  const categories = await getAllCategories();
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    throw new Response("카테고리를 찾을 수 없습니다", { status: 404 });
  }
  
  let posts = await getPostsByCategory(category.name);
  
  // 선택된 태그가 있으면 포스트 필터링
  if (selectedTags.length > 0) {
    posts = posts.filter(post => {
      // 모든 선택된 태그를 포함하는 포스트만 필터링
      return selectedTags.every(tag => post.tags?.includes(tag));
    });
  }
  
  // 이 카테고리에 있는 포스트에서 사용된 모든 태그 가져오기
  const categoryTags = Array.from(
    new Set(
      posts.flatMap(post => post.tags || [])
    )
  );
  
  // 모든 태그 가져오기
  const allTags = await getAllTags();
  
  return json({
    posts,
    categorySlug: slug,
    categoryName: category.name,
    categories,
    categoryTags,
    allTags,
    selectedTags
  });
};

export default function CategoryPage() {
  const { 
    posts, 
    categoryName, 
    categorySlug, 
    categories, 
    categoryTags,
    selectedTags 
  } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <TagFilter tags={categoryTags} />
        </div>
      </FadeIn>
      
      <motion.h2 
        className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {categoryName} 포스트 {selectedTags.length > 0 ? '(태그 필터링 적용됨)' : ''}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} delay={0.1 + index * 0.05} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <FadeIn direction="up" delay={0.2}>
          <div className="text-center py-16 bg-pastel-blue dark:bg-gray-800 rounded-xl">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {selectedTags.length > 0 
                ? '선택한 필터에 해당하는 포스트가 없습니다.'
                : '이 카테고리에 아직 포스트가 없습니다.'}
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
} 