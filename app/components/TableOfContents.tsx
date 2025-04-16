import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";

export interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export function TableOfContents({ contentRef, className = "" }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // 목차 항목 추출
  useEffect(() => {
    if (!contentRef.current) return;

    const headings = Array.from(
      contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ).filter(el => el.id);

    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id;
      const title = heading.textContent || "";
      const level = parseInt(heading.tagName.substring(1));

      items.push({ id, title, level });
    });

    setTocItems(items);
  }, [contentRef]);

  // Intersection Observer를 사용하여 활성 목차 항목 업데이트
  useEffect(() => {
    if (!contentRef.current) return;

    const headingElements = Array.from(
      contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ).filter(el => el.id);

    if (headingElements.length === 0) return;

    const headingMap = new Map<string, HTMLElement>();
    headingElements.forEach(el => {
      headingMap.set(el.id, el as HTMLElement);
    });

    const callback: IntersectionObserverCallback = (entries) => {
      // 화면에 보이는 헤딩 엘리먼트들
      const visibleHeadings = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target.id);

      if (visibleHeadings.length === 0) return;

      // 페이지 상단에 가장 가까운 헤딩 선택
      let closestHeadingId = visibleHeadings[0];
      let closestDistance = Infinity;

      visibleHeadings.forEach(id => {
        const element = headingMap.get(id);
        if (!element) return;
        
        const { top } = element.getBoundingClientRect();
        const distance = Math.abs(top);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestHeadingId = id;
        }
      });

      setActiveId(closestHeadingId);
    };

    // 옵션 설정: 상단에서 10% 지점에 진입하면 활성화
    const options = {
      rootMargin: "-10% 0px -85% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver(callback, options);
    headingElements.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, [contentRef, tocItems]);

  if (tocItems.length === 0) {
    return null;
  }

  const getIndent = (level: number) => {
    // 기본 h1 = 0, h2 = 1, h3 = 2 등의 인덴트 레벨 계산
    const baseLevel = Math.min(...tocItems.map(item => item.level));
    return `ml-${(level - baseLevel) * 4}`;
  };

  return (
    <div className={`toc sticky top-24 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">목차</h2>
      <nav>
        <ul className="space-y-2 text-sm">
          {tocItems.map((item) => (
            <li key={item.id} className={getIndent(item.level)}>
              <Link
                to={`#${item.id}`}
                className={`block hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1 border-l-2 pl-3 ${
                  activeId === item.id
                    ? "border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-medium"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    setActiveId(item.id);
                    window.scrollTo({
                      top: element.offsetTop - 100,
                      behavior: "smooth"
                    });
                  }
                }}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 