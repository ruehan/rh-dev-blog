import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getAllPosts, type Post } from "~/lib/mdx.server";
import { PostCard } from "~/components/PostCard";
import { FadeIn } from "~/components/animations/FadeIn";
import { motion } from "framer-motion";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "검색 결과" },
      { name: "description", content: "블로그 검색 결과입니다." },
    ];
  }
  
  return [
    { title: `"${data.query}" 검색 결과 - 개발 블로그` },
    { name: "description", content: `"${data.query}" 검색 결과입니다.` },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  
  const posts = await getAllPosts();
  
  // 검색어가 있으면 포스트 필터링
  let searchResults: Post[] = [];
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    
    searchResults = posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      (post.description?.toLowerCase().includes(lowerQuery)) ||
      (post.category?.toLowerCase().includes(lowerQuery)) ||
      (post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }
  
  return json({
    posts: searchResults,
    query
  });
};

export default function SearchResults() {
  const { posts, query } = useLoaderData<typeof loader>();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <FadeIn className="mb-8">
        <motion.h1 
          className="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {query ? `"${query}" 검색 결과` : '검색 결과'}
        </motion.h1>
        
        {query ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">"{query}"</span>에 대한 검색 결과 {posts.length}개를 찾았습니다.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              검색어를 입력하세요. 사이드바의 검색창을 이용해주세요.
            </p>
          </div>
        )}
      </FadeIn>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <FadeIn key={post.slug} delay={0.1 + index * 0.05}>
              <PostCard post={post} />
            </FadeIn>
          ))}
        </div>
      ) : query ? (
        <FadeIn>
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              검색 결과가 없습니다. 다른 검색어로 시도해 보세요.
            </p>
          </div>
        </FadeIn>
      ) : null}
    </motion.div>
  );
} 