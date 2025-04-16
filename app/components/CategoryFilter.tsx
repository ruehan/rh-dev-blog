import { Link, useLocation } from "@remix-run/react";

interface Category {
  name: string;
  count?: number;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  currentCategory?: string;
  basePath?: string;
  className?: string;
}

export function CategoryFilter({ 
  categories, 
  currentCategory, 
  basePath = "/category", 
  className = "" 
}: CategoryFilterProps) {
  const location = useLocation();
  const isAllActive = !currentCategory || currentCategory === "all";

  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">카테고리</h2>
      
      <div className="flex flex-wrap gap-2">
        <CategoryButton 
          isActive={isAllActive}
          to="/"
          name="전체"
          count={categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
        />
        
        {categories.map(category => (
          <CategoryButton 
            key={category.slug}
            isActive={category.slug === currentCategory}
            to={`${basePath}/${category.slug}`}
            name={category.name}
            count={category.count}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryButtonProps {
  isActive: boolean;
  to: string;
  name: string;
  count?: number;
}

function CategoryButton({ isActive, to, name, count }: CategoryButtonProps) {
  const activeClass = "bg-pastel-blue text-gray-800 dark:bg-blue-600 dark:text-white";
  const inactiveClass = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-pastel-blue/50 dark:hover:bg-gray-600";
  
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? activeClass : inactiveClass}`}
    >
      <span className="flex items-center">
        {isActive && (
          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
        )}
        {name}
        {count !== undefined && (
          <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-gray-200 dark:bg-gray-600"}`}>
            {count}
          </span>
        )}
      </span>
    </Link>
  );
} 