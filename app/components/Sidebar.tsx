import { Link } from "@remix-run/react";
import { CategoryFilter } from "./CategoryFilter";
import { TagList } from "./TagList";
import { TagFilter } from "./TagFilter";
import { SearchBox } from "./SearchBox";

// 임시 인기 포스트 타입
interface PopularPost {
  title: string;
  slug: string;
  date: string;
}

interface SidebarProps {
  categories: { name: string; slug: string; count?: number }[];
  popularTags?: string[];
  allTags?: string[];
  popularPosts?: PopularPost[];
  currentCategory?: string;
  showCategories?: boolean;
  showTagFilter?: boolean;
  showPopularTags?: boolean;
  showPopularPosts?: boolean;
  showSearch?: boolean;
  className?: string;
}

export function Sidebar({
  categories,
  popularTags = [],
  allTags = [],
  popularPosts = [],
  currentCategory,
  showCategories = true,
  showTagFilter = true,
  showPopularTags = true,
  showPopularPosts = true,
  showSearch = true,
  className = ""
}: SidebarProps) {
  return (
    <aside className={`space-y-8 ${className}`}>
      {showSearch && (
        <div className="mb-8">
          <SearchBox placeholder="블로그 검색..." />
        </div>
      )}
      
      {showCategories && categories.length > 0 && (
        <div>
          <CategoryFilter 
            categories={categories} 
            currentCategory={currentCategory} 
          />
        </div>
      )}

      {showTagFilter && allTags.length > 0 && (
        <div>
          <TagFilter tags={allTags} />
        </div>
      )}
      
      {showPopularTags && popularTags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">인기 태그</h3>
          <TagList tags={popularTags} />
        </div>
      )}
      
      {showPopularPosts && popularPosts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">인기 포스트</h3>
          <div className="space-y-4">
            {popularPosts.map(post => (
              <div key={post.slug} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                <Link 
                  to={`/blog/${post.slug}`}
                  className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(post.date).toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
} 