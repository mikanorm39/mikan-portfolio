"use client";

import { useEffect } from "react";

// スクロールを起こすキー（ローディング中だけ無効にする）
const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);

/**
 * ローディング中はページのスクロールを止める（アンマウントで必ず元に戻る）。
 * overflow: hidden だとスクロールバーが消えてレイアウトがずれるので、操作のほうを止める。
 */
export function useLockScroll() {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
}
