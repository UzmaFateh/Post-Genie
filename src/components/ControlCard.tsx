import { motion } from "framer-motion";
import React from "react";

export default function ControlCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-[var(--card)] shadow-sm hover:shadow-md transition-shadow"
    >
      {title && <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-indigo-700 dark:text-indigo-300">{title}</h3>}
      {children}
    </motion.div>
  );
}
