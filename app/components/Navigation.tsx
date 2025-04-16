import { Link } from "@remix-run/react";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatedHeader } from "./animations/AnimatedHeader";
import { motion } from "framer-motion";

export function Navigation() {
  const navItemVariants = {
    hover: { 
      y: -2,
      color: "var(--color-primary-600)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatedHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 flex justify-between items-center h-full">
        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ruehan's Dev Blog
          </motion.span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div variants={navItemVariants} whileHover="hover">
                <Link to="/" className="text-gray-600 dark:text-gray-300 transition-colors">
                  홈
                </Link>
              </motion.div>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div variants={navItemVariants} whileHover="hover">
                <Link to="/about" className="text-gray-600 dark:text-gray-300 transition-colors">
                  소개
                </Link>
              </motion.div>
            </motion.li>
          </ul>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </AnimatedHeader>
  );
} 