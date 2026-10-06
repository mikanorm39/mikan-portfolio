"use client";

import { ArrowUp } from "lucide-react";

export function ScrollTopButton() {
  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="pixel-button group inline-flex items-center gap-2 bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground"
    >
      <ArrowUp className="size-4 group-hover:animate-wiggle" aria-hidden="true" />
      トップへ戻る
    </button>
  );
}
