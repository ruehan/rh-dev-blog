import { Link } from "@remix-run/react";
import type { Post } from "~/lib/mdx.server";
import { TagList } from "./TagList";
import { HoverCard } from "./animations/HoverCard";
import { motion } from "framer-motion";
import { memo } from "react";
import OptimizedImage from "./OptimizedImage";
import { useIntersectionObserver } from "~/lib/hooks";

interface PostCardProps {
  post: Post;
  variant?: "grid" | "list";
  delay?: number;
}

function PostCardComponent({ post, variant = "grid", delay = 0 }: PostCardProps) {
  const isGrid = variant === "grid";
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: '200px',
    threshold: 0.1
  });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      viewport={{ once: true }}
    >
      {isIntersecting && (
        <HoverCard 
          className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm 
                    border border-gray-100 dark:border-gray-700 h-full flex flex-col
                    ${isGrid ? "" : "md:flex-row"}`}
        >
          {post.coverImage && (
            <div className={`${isGrid ? "h-48" : "md:h-auto md:w-1/3"} overflow-hidden bg-pastel-blue dark:bg-gray-700`}>
              <OptimizedImage 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                height={isGrid ? 192 : undefined}
                width={isGrid ? undefined : undefined}
              />
            </div>
          )}
          
          <Link 
            to={`/blog/${post.slug}`} 
            className={`block flex-1 p-6 flex flex-col ${!isGrid && post.coverImage ? "md:w-2/3" : "w-full"}`}
            prefetch="intent"
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
            
            <motion.span 
              className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              더 읽기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.span>
          </Link>
        </HoverCard>
      )}
    </motion.div>
  );
}

// 메모이제이션을 통해 불필요한 리렌더링 방지
export const PostCard = memo(PostCardComponent); 