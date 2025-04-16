import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo, useRef } from "react";
import { TableOfContents } from "~/components/TableOfContents";
import { TagList } from "~/components/TagList";
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
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto max-w-6xl py-12 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/5 hidden lg:block">
          <TableOfContents contentRef={contentRef} />
        </aside>
        
        <article className="lg:w-4/5 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          {frontmatter.coverImage && (
            <div className="w-full h-64 md:h-80 lg:h-96 bg-pastel-blue dark:bg-gray-700 overflow-hidden">
              <img 
                src={frontmatter.coverImage} 
                alt={frontmatter.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="p-8 bg-pastel-blue dark:bg-gray-700 transition-colors">
            <div className="flex flex-wrap gap-2 mb-3">
              {frontmatter.category && (
                <Link 
                  to={`/category/${frontmatter.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-block px-3 py-1 bg-white/40 dark:bg-gray-800/40 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  {frontmatter.category}
                </Link>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-3 text-gray-800 dark:text-white">{frontmatter.title}</h1>
            
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {new Date(frontmatter.date).toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {frontmatter.views && (
                <span className="ml-4">
                  <span className="inline-block mr-1">👁️</span>
                  {frontmatter.views} 조회
                </span>
              )}
            </div>
            
            <p className="text-xl text-gray-700 dark:text-gray-200">
              {frontmatter.description}
            </p>
            
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="mt-4">
                <TagList tags={frontmatter.tags} />
              </div>
            )}
          </header>

          <div className="p-8">
            <div className="block lg:hidden mb-8">
              <TableOfContents contentRef={contentRef} />
            </div>
            
            <div className="prose prose-md dark:prose-dark max-w-none" ref={contentRef}>
              <Component />
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between flex-wrap gap-4">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  블로그로 돌아가기
                </Link>
                
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-400 mr-2">태그:</span>
                    <TagList tags={frontmatter.tags} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 