import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  direction = "up",
  distance = 30,
  once = true
}: FadeInProps) {
  
  let initialY = 0;
  let initialX = 0;

  switch (direction) {
    case "up":
      initialY = distance;
      break;
    case "down":
      initialY = -distance;
      break;
    case "left":
      initialX = distance;
      break;
    case "right":
      initialX = -distance;
      break;
    default:
      break;
  }

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        y: initialY, 
        x: initialX 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut"
        }
      }}
      viewport={{ once }}
    >
      {children}
    </motion.div>
  );
} 