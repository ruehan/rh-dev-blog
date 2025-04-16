import { Link, useLocation, useSearchParams } from "@remix-run/react";

interface TagFilterProps {
  tags: string[];
  className?: string;
}

export function TagFilter({ tags, className = "" }: TagFilterProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // URL에서 선택된 태그들을 배열로 가져옵니다
  const selectedTags = searchParams.getAll("tags");
  
  // 태그를 토글하는 함수
  const toggleTag = (tag: string) => {
    // 현재 URL 파라미터를 복사
    const params = new URLSearchParams(searchParams);
    
    // 이미 선택된 태그라면 제거, 아니면 추가
    if (selectedTags.includes(tag)) {
      // 해당 태그만 제거
      const values = params.getAll("tags").filter(t => t !== tag);
      params.delete("tags");
      values.forEach(value => params.append("tags", value));
    } else {
      // 태그 추가
      params.append("tags", tag);
    }
    
    return `${location.pathname}?${params.toString()}`;
  };
  
  if (tags.length === 0) return null;
  
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">태그</h2>
      
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          const activeClass = "bg-pastel-blue text-gray-800 dark:bg-blue-600 dark:text-white";
          const inactiveClass = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-pastel-blue/50 dark:hover:bg-gray-600";
          
          return (
            <Link
              key={tag}
              to={toggleTag(tag)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isSelected ? activeClass : inactiveClass}`}
            >
              <span className="flex items-center">
                {isSelected && (
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                )}
                #{tag}
              </span>
            </Link>
          );
        })}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="mt-3">
          <Link
            to={location.pathname}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            모든 태그 초기화
          </Link>
        </div>
      )}
    </div>
  );
} 