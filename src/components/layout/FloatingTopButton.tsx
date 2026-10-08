"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** これより下へスクロールしたらボタンを出す（px） */
const SHOW_AFTER = 300;

/**
 * 画面の右下に固定する「↑」ボタン。押すとページの一番上へ戻る。
 * ページの一番上にいるあいだは隠しておき、少しスクロールしたら現れる。
 */
export function FloatingTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="ページの一番上へ戻る"
      // 隠れているあいだは押せず、キーボードのフォーカスも当たらない
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "pixel-button bg-pop-gradient group fixed right-4 bottom-4 z-30 inline-flex size-12 items-center justify-center sm:right-6 sm:bottom-6 sm:size-14",
        // 出る・隠れるときはふわっと（下から少し上がる）
        "transition-[opacity,translate] duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {/* 矢印は線を太くして太字に見せる（ほかのボタンの矢印と同じ太さ） */}
      <ArrowUp className="size-6 group-hover:animate-wiggle sm:size-7" strokeWidth={3.25} aria-hidden="true" />
    </button>
  );
}
