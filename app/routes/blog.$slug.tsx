import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { getPost } from "~/lib/mdx.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "포스트를 찾을 수 없습니다" },
      { name: "description", content: "요청한 블로그 포스트를 찾을 수 없습니다." },
    ];
  }

  return [
    { title: data.frontmatter.title },
    { name: "description", content: data.frontmatter.description },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  if (!slug) throw new Response("포스트를 찾을 수 없습니다", { status: 404 });

  try {
    const post = await getPost(slug);
    return json(post);
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    throw new Response("포스트를 찾을 수 없습니다", { status: 404 });
  }
};

export default function BlogPost() {
  const { code, frontmatter } = useLoaderData<typeof loader>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className="mx-auto max-w-6xl py-12 px-4 lg:px-8">
      <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <header className="p-8 bg-pastel-blue dark:bg-gray-700 transition-colors">
          <h1 className="text-4xl font-bold mb-3 text-gray-800 dark:text-white">{frontmatter.title}</h1>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {new Date(frontmatter.date).toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-200">{frontmatter.description}</p>
        </header>

        <div className="p-8">
          <div className="prose prose-lg lg:prose-xl dark:prose-dark max-w-none">
            <Component />
          </div>
        </div>
      </article>
    </div>
  );
} 