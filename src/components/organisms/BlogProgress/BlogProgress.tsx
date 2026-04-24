"use client";

import { useEffect, useState } from "react";

export const BlogProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (scrolled / height) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-[200] h-[2px] bg-gold-normal transition-[width] duration-100"
      style={{ width: `${progress}%` }}
    />
  );
};
