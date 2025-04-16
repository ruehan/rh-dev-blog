import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getAllPosts, type Post } from "~/lib/mdx.server";
import { PostCard } from "~/components/PostCard";

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

  return (
    <div>
      {selectedTags.length > 0 && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            필터 적용됨
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">태그:</span>
            {selectedTags.map(tag => (
              <span key={tag} className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm">
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
      )}
      
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
        {selectedTags.length > 0 ? '필터링된 포스트' : '최신 포스트'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post: Post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 bg-pastel-blue dark:bg-gray-800 rounded-xl">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {selectedTags.length > 0 
              ? '선택한 태그에 해당하는 포스트가 없습니다.'
              : '아직 블로그 포스트가 없습니다. 첫 번째 포스트를 작성해보세요!'}
          </p>
        </div>
      )}
    </div>
  );
} 