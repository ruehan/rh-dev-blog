import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";

interface SearchBoxProps {
  placeholder?: string;
  showButton?: boolean;
  darkMode?: boolean;
  className?: string;
}

export function SearchBox({ 
  placeholder = "검색...", 
  showButton = false,
  darkMode = false,
  className = "" 
}: SearchBoxProps) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    submit(formRef.current);
  };

  return (
    <Form
      ref={formRef}
      method="get"
      action="/search"
      className={`relative ${className}`}
      onSubmit={handleSearch}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2.5 pl-10 text-sm text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
          placeholder={placeholder}
          required
        />
        {showButton && (
          <button
            type="submit"
            className="absolute right-1 bottom-1 top-1 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            검색
          </button>
        )}
      </div>
    </Form>
  );
} 