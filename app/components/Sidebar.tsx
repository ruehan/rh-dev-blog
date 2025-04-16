import { Link } from "@remix-run/react";
import { CategoryFilter } from "./CategoryFilter";
import { TagList } from "./TagList";
import { TagFilter } from "./TagFilter";
import { SearchBox } from "./SearchBox";
import { useState, useEffect, useRef } from "react";

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
  const displayTags = popularTags.slice(0, 6);
  const displayPosts = popularPosts.slice(0, 3);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (!sidebarRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
    // 스크롤 위치에 따라 그라데이션 표시
    setShowTopGradient(scrollTop > 10);
    setShowBottomGradient(scrollHeight - scrollTop - clientHeight > 10);
    
    // 스크롤 위치에 따라 버튼 표시
    setShowTopButton(scrollTop > 100);
    setShowBottomButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  // 초기 그라데이션 상태 설정
  useEffect(() => {
    handleScroll();
    // 창 크기 변경 시 그라데이션 상태 업데이트
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  // 상단으로 스크롤 함수
  const scrollToTop = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  // 하단으로 스크롤 함수
  const scrollToBottom = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: sidebarRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside className={`relative z-30 lg:sticky lg:top-20 pr-4 pb-8 ${className}`}>
      <div className="relative">
        {/* 상단 그라데이션 */}
        {showTopGradient && (
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        )}
        
        {/* 스크롤 가능한 사이드바 내용 */}
        <div 
          ref={sidebarRef}
          className="max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-hide space-y-6"
          onScroll={handleScroll}
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
        >
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
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">인기 태그</h3>
              <TagList tags={displayTags} />
            </div>
          )}
          
          {showPopularPosts && popularPosts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">인기 포스트</h3>
              <div className="space-y-3">
                {displayPosts.map(post => (
                  <div key={post.slug} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors text-sm"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
        </div>
        
        {/* 하단 그라데이션 */}
        {showBottomGradient && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        )}
        
        {/* 상단으로 이동 버튼 */}
        {showTopButton && (
          <button 
            onClick={scrollToTop}
            className="absolute top-1/2 right-1 transform -translate-y-12 w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-600 shadow-md flex items-center justify-center text-white hover:bg-primary-600 dark:hover:bg-primary-700 transition-all opacity-80 hover:opacity-100 z-20"
            aria-label="상단으로 이동"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
        
        {/* 하단으로 이동 버튼 */}
        {showBottomButton && (
          <button 
            onClick={scrollToBottom}
            className="absolute top-1/2 right-1 transform translate-y-12 w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-600 shadow-md flex items-center justify-center text-white hover:bg-primary-600 dark:hover:bg-primary-700 transition-all opacity-80 hover:opacity-100 z-20"
            aria-label="하단으로 이동"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
} 