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
    <div className="mx-auto max-w-6xl py-12 px-4 lg:px-8">
      <div className="text-center mb-12 bg-pastel-yellow dark:bg-gray-800 p-8 rounded-2xl shadow-sm transition-colors">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">개발 블로그</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Remix와 TypeScript로 만든 개발 블로그입니다. 웹 개발, 프로그래밍, 그리고 기술 관련 이야기를 공유합니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: Post) => (
          <article 
            key={post.slug} 
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 h-full flex flex-col"
          >
            <Link to={`/blog/${post.slug}`} className="block flex-1 p-6 flex flex-col">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {new Date(post.date).toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{post.description}</p>
              <span className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                더 읽기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-pastel-blue dark:bg-gray-800 rounded-xl">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              아직 블로그 포스트가 없습니다. 첫 번째 포스트를 작성해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
