import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getAllPosts, type Post } from "~/lib/mdx.server";
import { PostCard } from "~/components/PostCard";
import { FadeIn } from "~/components/animations/FadeIn";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "개발 블로그" },
    { name: "description", content: "Remix와 TypeScript로 만든 개발 블로그입니다." },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const selectedTags = url.searchParams.getAll("tags");
  
  const posts = await getAllPosts();
  
  // 선택된 태그가 있으면 포스트 필터링
  let filteredPosts = posts;
  if (selectedTags.length > 0) {
    filteredPosts = posts.filter(post => {
      // 모든 선택된 태그를 포함하는 포스트만 필터링
      return selectedTags.every(tag => post.tags?.includes(tag));
    });
  }
  
  // 추천 포스트 (featured)
  const featuredPosts = filteredPosts.filter(post => post.isFeatured);
  
  return json({ 
    posts: filteredPosts,
    featuredPosts,
    selectedTags
  });
};

export default function Index() {
  const { posts, featuredPosts, selectedTags } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

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
      {selectedTags.length > 0 && (
        <FadeIn className="mb-8" delay={0.1}>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              필터 적용됨
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-600 dark:text-gray-300">태그:</span>
              {selectedTags.map(tag => (
                <span key={tag} className="bg-pastel-blue text-gray-800 dark:bg-blue-600 dark:text-white px-3 py-1 rounded-md text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-2">
              <span className="text-gray-600 dark:text-gray-300">
                {posts.length}개의 포스트를 찾았습니다
              </span>
            </div>
          </div>
        </FadeIn>
      )}
      
      {featuredPosts.length > 0 && (
        <FadeIn className="mb-10" delay={0.2}>
          <motion.h2 
            className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            추천 포스트
          </motion.h2>
          <div className="grid grid-cols-1 gap-6">
            {featuredPosts.slice(0, 2).map((post: Post, index) => (
              <PostCard key={post.slug} post={post} variant="list" delay={0.2 + index * 0.1} />
            ))}
          </div>
        </FadeIn>
      )}
      
      <FadeIn delay={0.3}>
        <motion.h2 
          className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {selectedTags.length > 0 ? '필터링된 포스트' : '최신 포스트'}
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: Post, index) => (
            <PostCard key={post.slug} post={post} delay={0.3 + index * 0.05} />
          ))}
        </div>

        {posts.length === 0 && (
          <motion.div 
            className="text-center py-16 bg-pastel-blue dark:bg-gray-800 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {selectedTags.length > 0 
                ? '선택한 태그에 해당하는 포스트가 없습니다.'
                : '아직 블로그 포스트가 없습니다. 첫 번째 포스트를 작성해보세요!'}
            </p>
          </motion.div>
        )}
      </FadeIn>
    </motion.div>
  );
} 