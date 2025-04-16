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
  tags?: string[];
  category?: string;
  coverImage?: string;
  isFeatured?: boolean;
  views?: number;  // 조회수
  [key: string]: any;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
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

export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts();
  return posts.filter(post => post.category === category);
}

export async function getPostsByTag(tag: string) {
  const posts = await getAllPosts();
  return posts.filter(post => post.tags?.includes(tag));
}

export async function getAllCategories(): Promise<Category[]> {
  const posts = await getAllPosts();
  const categoryCounts: Record<string, number> = {};
  const categoryNames: Record<string, string> = {};
  
  posts.forEach(post => {
    if (post.category) {
      const categorySlug = post.category.toLowerCase().replace(/\s+/g, '-');
      categoryCounts[categorySlug] = (categoryCounts[categorySlug] || 0) + 1;
      categoryNames[categorySlug] = post.category;
    }
  });
  
  return Object.keys(categoryCounts).map(slug => ({
    slug,
    name: categoryNames[slug],
    count: categoryCounts[slug]
  }));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  
  posts.forEach(post => {
    post.tags?.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet);
}

export async function getPopularPosts(limit = 5): Promise<Post[]> {
  const posts = await getAllPosts();
  
  // 조회수 기준으로 정렬 (없으면 최신순)
  return posts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
} 