import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useParams } from "@remix-run/react";
import { Sidebar } from "~/components/Sidebar";
import { getAllCategories, getAllTags, getPopularPosts } from "~/lib/mdx.server";
import { motion } from "framer-motion";
import { PageTransition } from "~/components/animations/PageTransition";
import { useEffect } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const categories = await getAllCategories();
  const allTags = await getAllTags();
  const popularPosts = await getPopularPosts(5);
  
  // 인기 태그는 최대 10개
  const popularTags = allTags.slice(0, 10);
  
  return json({
    categories,
    allTags,
    popularTags,
    popularPosts
  });
}

export default function BlogLayout() {
  const { categories, allTags, popularTags, popularPosts } = useLoaderData<typeof loader>();
  const params = useParams();
  const location = useLocation();
  
  // 현재 카테고리 가져오기 (URL에서 추출)
  const currentCategory = params.slug;
  
  // 레이아웃 마운트 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="mx-auto max-w-6xl py-6 px-4 lg:px-8 mt-8 min-h-[calc(100vh-180px)]">
      <PageTransition>
        <motion.div 
          className="flex flex-col lg:flex-row gap-8 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* 메인 콘텐츠 (왼쪽) */}
          <motion.main 
            className="w-full lg:w-2/3 lg:pr-8"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Outlet />
          </motion.main>
          
          {/* 사이드바 컨테이너 (오른쪽) */}
          <motion.div 
            className="w-full lg:w-1/3"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Sidebar 
              categories={categories}
              allTags={allTags}
              popularTags={popularTags}
              popularPosts={popularPosts}
              currentCategory={currentCategory}
            />
          </motion.div>
        </motion.div>
      </PageTransition>
    </div>
  );
} 