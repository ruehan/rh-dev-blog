import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AnimatedHeaderProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedHeader({ children, className = "" }: AnimatedHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md' : 'bg-white dark:bg-gray-900'} ${className}`}
      style={{ height: '60px', padding: '0.75rem', boxShadow: '"0 0 0 rgba(0,0,0,0)", "0 4px 10px rgba(0,0,0,0.1)"' }}
    >
      {children}
    </motion.header>
  );
} 