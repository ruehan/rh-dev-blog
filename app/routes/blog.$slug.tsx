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
    <div className="mx-auto max-w-4xl py-8 px-4">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
        <div className="text-sm text-gray-500 mb-4">
          {new Date(frontmatter.date).toLocaleDateString()}
        </div>
        <p className="text-xl text-gray-700">{frontmatter.description}</p>
      </header>

      <article className="prose prose-lg max-w-none">
        <Component />
      </article>
    </div>
  );
} 