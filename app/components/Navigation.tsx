import { Link } from "@remix-run/react";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          개발 블로그
        </Link>
        
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                홈
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                소개
              </Link>
            </li>
          </ul>
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
} 