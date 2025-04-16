import { Link } from "@remix-run/react";

interface TagListProps {
  tags: string[];
  className?: string;
  linkToTag?: boolean; // 태그 클릭 시 해당 태그 페이지로 이동할지 여부
}

export function TagList({ tags, className = "", linkToTag = true }: TagListProps) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(tag => (
        <Tag key={tag} tag={tag} linkToTag={linkToTag} />
      ))}
    </div>
  );
}

interface TagProps {
  tag: string;
  linkToTag?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Tag({ tag, linkToTag = true, size = "md" }: TagProps) {
  const baseClasses = 
    `inline-flex items-center rounded-full bg-pastel-purple dark:bg-gray-700 
     text-gray-700 dark:text-gray-200 hover:bg-pastel-blue dark:hover:bg-gray-600 
     transition-colors`;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };
  
  const TagContent = () => (
    <span className="flex items-center">
      <span className="text-primary-600 dark:text-primary-400 mr-1">#</span>
      {tag}
    </span>
  );
  
  if (linkToTag) {
    return (
      <Link 
        to={`/tags/${tag}`} 
        className={`${baseClasses} ${sizeClasses[size]}`}
      >
        <TagContent />
      </Link>
    );
  }
  
  return (
    <span className={`${baseClasses} ${sizeClasses[size]}`}>
      <TagContent />
    </span>
  );
} 