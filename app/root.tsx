import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  LiveReload,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { cssBundleHref } from "@remix-run/css-bundle";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";


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
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// 색상 테마 쿠키 이름
const themeKey = "theme";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 쿠키에서 테마 값 읽기
  const cookieHeader = request.headers.get("Cookie");
  const cookieTheme = cookieHeader
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith(`${themeKey}=`))
    ?.split("=")[1];

  return json({
    theme: cookieTheme || "light",
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="transition-colors duration-300 scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen transition-colors duration-300 antialiased">
        {children}
        <ScrollRestoration getKey={(location) => {
          // 메인 페이지는 스크롤 위치를 저장/복원하지 않음
          if (location.pathname === "/" || location.pathname === "/home") {
            return location.pathname;
          }
          return location.key;
        }} />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const { theme: ssrTheme } = useLoaderData<typeof loader>();
  const [theme, setTheme] = useState(ssrTheme);
  const location = useLocation();

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      document.cookie = `${themeKey}=${theme}; path=/; max-age=31536000`;
    }
  }, [theme]);

  // 페이지 로드 시 스크롤을 상단으로 이동
  useEffect(() => {
    // 메인 페이지일 경우 항상 스크롤을 상단으로 이동
    if (location.pathname === "/" || location.pathname === "/home") {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // SSR에서는 클라이언트 쪽 localStorage를 사용할 수 없으므로
  // 클라이언트 렌더링 시에 localStorage 테마를 확인하여 적용
  useEffect(() => {
    const localTheme = localStorage.getItem(themeKey);
    if (localTheme && localTheme !== theme) {
      setTheme(localTheme);
    }
  }, [theme]);

  return (
    <>
      <Navigation />
      <main className="flex-grow pt-16 mt-2">
        <AnimatePresence mode="wait">
          <Outlet context={{ theme, setTheme }} />
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
