import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css",
  },
];

// 다크 모드 초기화 스크립트
function ThemeInit() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function() {
          // 로컬 스토리지에서 테마 가져오기
          const theme = localStorage.getItem('theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          
          // dark 클래스 적용
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        })();`,
      }}
    />
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="transition-colors duration-300 scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeInit />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen transition-colors duration-300 antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
