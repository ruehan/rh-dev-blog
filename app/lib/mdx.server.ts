import path from 'path';
import fs from 'fs/promises';
import { bundleMDX } from 'mdx-bundler';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const rootDirectory = process.cwd();
const contentDirectory = path.join(rootDirectory, 'content');

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  [key: string]: any;
}

export async function getPost(slug: string) {
  const fullPath = path.join(contentDirectory, 'blog', `${slug}.mdx`);
  const source = await fs.readFile(fullPath, 'utf8');

  const { code, frontmatter } = await bundleMDX({
    source,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeHighlight,
      ];
      return options;
    },
  });

  return {
    code,
    frontmatter: {
      slug,
      ...frontmatter,
    } as Post,
  };
}

export async function getAllPosts() {
  const postsPath = path.join(contentDirectory, 'blog');
  const dir = await fs.readdir(postsPath);
  
  const posts = await Promise.all(
    dir
      .filter(file => path.extname(file) === '.mdx')
      .map(async filename => {
        const file = await fs.readFile(
          path.join(postsPath, filename),
          'utf8'
        );
        
        const { frontmatter } = await bundleMDX({
          source: file,
        });

        return {
          slug: filename.replace(/\.mdx$/, ''),
          ...frontmatter,
        } as Post;
      })
  );

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
} 