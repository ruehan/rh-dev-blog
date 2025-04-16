export function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-gray-600">
          © {new Date().getFullYear()} 개발 블로그 - Remix와 TypeScript로 제작되었습니다.
        </p>
      </div>
    </footer>
  );
} 