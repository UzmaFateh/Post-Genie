import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="w-full max-w-6xl mx-auto bg-[var(--card)] rounded-2xl shadow-xl p-6">
        {children}
      </div>
    </div>
  );
}
