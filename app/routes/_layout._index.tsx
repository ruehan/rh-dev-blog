import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllPosts, type Post } from "~/lib/mdx.server";
import { PostCard } from "~/components/PostCard";

export const meta: MetaFunction = () => {
  return [
    { title: "개발 블로그" },
    { name: "description", content: "Remix와 TypeScript로 만든 개발 블로그입니다." },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const posts = await getAllPosts();
  
  // 추천 포스트 (featured)
  const featuredPosts = posts.filter(post => post.isFeatured);
  
  return json({ 
    posts,
    featuredPosts
  });
};

export default function Index() {
  const { posts, featuredPosts } = useLoaderData<typeof loader>();

  return (
    <div>
      {featuredPosts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            추천 포스트
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {featuredPosts.slice(0, 2).map((post: Post) => (
              <PostCard key={post.slug} post={post} variant="list" />
            ))}
          </div>
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        최신 포스트
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post: Post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 bg-pastel-blue dark:bg-gray-800 rounded-xl">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            아직 블로그 포스트가 없습니다. 첫 번째 포스트를 작성해보세요!
          </p>
        </div>
      )}
    </div>
  );
} 