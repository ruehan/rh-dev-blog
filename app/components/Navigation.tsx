import { Link } from "@remix-run/react";

export function Navigation() {
  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="mx-auto max-w-4xl px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">개발 블로그</Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-gray-300">홈</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-300">소개</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
} 