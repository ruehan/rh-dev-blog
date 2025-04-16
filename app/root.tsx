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
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { cssBundleHref } from "@remix-run/css-bundle";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

import "./tailwind.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Ruehan's Dev Blog" },
    { name: "description", content: "개발 관련 지식과 경험을 공유하는 블로그입니다." },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { name: "theme-color", content: "#ffffff" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Ruehan's Dev Blo" },
    { property: "og:description", content: "개발 관련 지식과 경험을 공유하는 블로그입니다." },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&display=swap", media: "print", onLoad: "this.media='all'" },
  { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css", media: "print", onLoad: "this.media='all'" },
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css", media: "print", onLoad: "this.media='all'" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap", media: "print", onLoad: "this.media='all'" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/manifest.json" },
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

// 오류 폴백 UI
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">문제가 발생했습니다</h1>
      <p className="mb-6 text-red-600">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        새로고침
      </button>
    </div>
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
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen transition-colors duration-300 antialiased">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {children}
        </ErrorBoundary>
        <ScrollRestoration getKey={(location) => {
          // 메인 페이지는 스크롤 위치를 저장/복원하지 않음
          if (location.pathname === "/" || location.pathname === "/home") {
            return location.pathname;
          }
          return location.key;
        }} />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
