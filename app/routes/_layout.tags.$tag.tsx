import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PostCard } from "~/components/PostCard";
import { Tag } from "~/components/TagList";
import { getAllTags, getPostsByTag } from "~/lib/mdx.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "태그를 찾을 수 없습니다" },
      { name: "description", content: "요청한 태그를 찾을 수 없습니다." },
    ];
  }
  
  return [
    { title: `#${data.tag} - 개발 블로그` },
    { name: "description", content: `개발 블로그의 ${data.tag} 태그 포스트 목록입니다.` },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const tag = params.tag;
  if (!tag) throw new Response("태그를 찾을 수 없습니다", { status: 404 });

  const allTags = await getAllTags();
  
  if (!allTags.includes(tag)) {
    throw new Response("태그를 찾을 수 없습니다", { status: 404 });
  }
  
  const posts = await getPostsByTag(tag);
  const relatedTags = Array.from(
    new Set(
      posts.flatMap(post => post.tags || [])
        .filter(t => t !== tag)
    )
  ).slice(0, 10);
  
  return json({
    posts,
    tag,
    relatedTags
  });
};

export default function TagPage() {
  const { posts, tag, relatedTags } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            <Tag tag={tag} size="lg" linkToTag={false} />
          </h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          #{tag} 태그의 포스트 ({posts.length}개)
        </p>
        
        {relatedTags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              관련 태그
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map(relatedTag => (
                <Tag key={relatedTag} tag={relatedTag} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-16 bg-pastel-blue dark:bg-gray-800 rounded-xl">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            이 태그에 아직 포스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
} 