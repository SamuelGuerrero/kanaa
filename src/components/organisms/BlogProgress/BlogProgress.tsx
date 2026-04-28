"use client";

import { useEffect, useState } from "react";

export const BlogProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (scrolled / height) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden
      className="bg-gold-normal fixed top-0 left-0 z-200 h-0.5 transition-[width] duration-100"
      style={{ width: `${progress}%` }}
    />
  );
};
