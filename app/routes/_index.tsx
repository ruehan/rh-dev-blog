import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAllPosts, type Post } from "~/lib/mdx.server";

export const meta: MetaFunction = () => {
  return [
    { title: "개발 블로그" },
    { name: "description", content: "Remix와 TypeScript로 만든 개발 블로그입니다." },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const posts = await getAllPosts();
  return json({ posts });
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">개발 블로그</h1>
      
      <div className="space-y-8">
        {posts.map((post: Post) => (
          <article key={post.slug} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link to={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <div className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleDateString()}</div>
            <p className="text-gray-700">{post.description}</p>
            <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:underline mt-2 inline-block">
              더 읽기 →
            </Link>
          </article>
        ))}

        {posts.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            아직 블로그 포스트가 없습니다. 첫 번째 포스트를 작성해보세요!
          </p>
        )}
      </div>
    </div>
  );
}
