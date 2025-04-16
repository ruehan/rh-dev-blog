import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "소개 - 개발 블로그" },
    { name: "description", content: "개발 블로그 소개 페이지입니다." },
  ];
};

export default function About() {
  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">소개</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>
          이 블로그는 Remix와 TypeScript를 사용하여 개발한 개인 기술 블로그입니다.
          최신 웹 개발 트렌드와 프로그래밍 지식을 공유합니다.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">사용 기술</h2>
        <ul>
          <li>Remix - React 기반 풀스택 웹 프레임워크</li>
          <li>TypeScript - 타입 안전성을 제공하는 JavaScript의 상위 집합</li>
          <li>MDX - JSX와 마크다운을 결합한 콘텐츠 포맷</li>
          <li>Tailwind CSS - 유틸리티 우선 CSS 프레임워크</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">연락처</h2>
        <p>
          궁금한 점이나 제안하고 싶은 내용이 있으시면 이메일로 연락해주세요.
        </p>
      </div>
    </div>
  );
} 