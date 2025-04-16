import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderSize?: number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderSize = 10,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [placeholder, setPlaceholder] = useState<string | null>(null);

  useEffect(() => {
    const generatePlaceholder = async () => {
      try {
        const imgPath = src.startsWith('http') ? src : `/${src}`;
        setPlaceholder(`${imgPath}?w=${placeholderSize}`);
      } catch (error) {
        console.error('Failed to generate placeholder:', error);
      }
    };

    generatePlaceholder();
  }, [src, placeholderSize]);

  // 이미지 로딩 완료 핸들러
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {placeholder && !loaded && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 transition-opacity"
          style={{ opacity: loaded ? 0 : 1 }}
          width={width}
          height={height}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${!loaded ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoaded}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
      />
    </div>
  );
} 