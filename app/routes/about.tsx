import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "소개 - 개발 블로그" },
    { name: "description", content: "개발 블로그 소개 페이지입니다." },
  ];
};

export default function About() {
  return (
    <div className="mx-auto max-w-6xl py-12 px-4 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="p-8 bg-pastel-purple dark:bg-gray-700 transition-colors">
          <h1 className="text-4xl font-bold mb-3 text-gray-800 dark:text-white">소개</h1>
          <p className="text-xl text-gray-700 dark:text-gray-200">
            개발 블로그를 찾아주셔서 감사합니다. 이곳에서 웹 개발 경험과 지식을 공유합니다.
          </p>
        </div>
        
        <div className="p-8">
          <div className="prose prose-md dark:prose-dark max-w-none">
            <p>
              이 블로그는 Remix와 TypeScript를 사용하여 개발한 개인 기술 블로그입니다.
              최신 웹 개발 트렌드와 프로그래밍 지식을 공유하고 있습니다.
            </p>
            
            <h2 className="mt-10 mb-4">사용 기술</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-pastel-blue dark:bg-gray-700 p-4 rounded-xl transition-colors">
                <h3 className="text-lg font-semibold mb-2">Remix</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  React 기반 풀스택 웹 프레임워크로, 서버 사이드 렌더링과 클라이언트 하이드레이션을 모두 지원합니다.
                </p>
              </div>
              
              <div className="bg-pastel-green dark:bg-gray-700 p-4 rounded-xl transition-colors">
                <h3 className="text-lg font-semibold mb-2">TypeScript</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  타입 안전성을 제공하는 JavaScript의 상위 집합으로, 개발 경험과 코드 품질을 향상시킵니다.
                </p>
              </div>
              
              <div className="bg-pastel-pink dark:bg-gray-700 p-4 rounded-xl transition-colors">
                <h3 className="text-lg font-semibold mb-2">MDX</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  마크다운과 JSX를 결합한 콘텐츠 포맷으로, 블로그 포스트 내에 React 컴포넌트를 사용할 수 있습니다.
                </p>
              </div>
              
              <div className="bg-pastel-yellow dark:bg-gray-700 p-4 rounded-xl transition-colors">
                <h3 className="text-lg font-semibold mb-2">Tailwind CSS</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  유틸리티 우선 CSS 프레임워크로, 빠르게 반응형 디자인을 구현할 수 있습니다.
                </p>
              </div>
            </div>
            
            <h2 className="mt-10 mb-4">연락처</h2>
            <p>
              궁금한 점이나 제안하고 싶은 내용이 있으시면 이메일 또는 소셜 미디어로 연락해주세요.
              언제나 새로운 협업과 의견 교환을 환영합니다.
            </p>
            
            <div className="mt-6 bg-pastel-coral dark:bg-gray-700 p-6 rounded-xl transition-colors">
              <h3 className="text-lg font-semibold mb-2">블로그를 더 발전시킬 계획</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>태그 시스템 추가</li>
                <li>댓글 기능 구현</li>
                <li>검색 기능 추가</li>
                <li>소셜 미디어 공유 기능</li>
                <li>뉴스레터 구독 옵션</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 