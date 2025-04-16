import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  transition?: {
    duration?: number;
    ease?: string;
  };
}

export function HoverCard({ 
  children, 
  className = "", 
  hoverScale = 1.03,
  transition = { duration: 0.3, ease: "easeOut" }
}: HoverCardProps) {
  return (
    <motion.div
      className={`${className}`}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        y: -5
      }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
} 