import { Link } from "@remix-run/react";
import type { Post } from "~/lib/mdx.server";
import { TagList } from "./TagList";

interface PostCardProps {
  post: Post;
  variant?: "grid" | "list";
}

export function PostCard({ post, variant = "grid" }: PostCardProps) {
  const isGrid = variant === "grid";
  
  return (
    <article 
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md 
                 transition-all border border-gray-100 dark:border-gray-700 h-full flex flex-col
                 ${isGrid ? "" : "md:flex-row"}`}
    >
      {post.coverImage && (
        <div className={`${isGrid ? "h-48" : "md:h-auto md:w-1/3"} overflow-hidden bg-pastel-blue dark:bg-gray-700`}>
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      <Link 
        to={`/blog/${post.slug}`} 
        className={`block flex-1 p-6 flex flex-col ${!isGrid && post.coverImage ? "md:w-2/3" : "w-full"}`}
      >
        {post.tags && post.tags.length > 0 && (
          <TagList tags={post.tags} className="mb-2" />
        )}
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {new Date(post.date).toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          {post.category && (
            <span className="ml-2 px-2 py-1 bg-pastel-green dark:bg-gray-700 rounded-full text-xs">
              {post.category}
            </span>
          )}
        </div>
        
        <h2 className={`${isGrid ? "text-xl" : "text-2xl"} font-semibold mb-3 text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}>
          {post.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
          {post.description}
        </p>
        
        <span className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
          더 읽기
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </Link>
    </article>
  );
} 