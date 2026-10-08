"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { House } from "lucide-react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { NavInk } from "@/components/splat/InkUi";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { isActivePath, navItems } from "./nav";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 bg-white/90 backdrop-blur-md transition-shadow duration-300 dark:bg-background/85",
        scrolled && "shadow-pop",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* 左上のホームボタン（家マーク＋サイト名）。ヘッダーは固定なので、どのページからでも押せばトップに戻れる */}
        <Link
          href="/"
          aria-label={`${profile.siteTitle}（ホームに戻る）`}
          className="group flex min-w-0 items-center gap-2"
        >
          <span
            className="pixel-button inline-flex size-9 shrink-0 items-center justify-center bg-secondary text-secondary-foreground"
            aria-hidden="true"
          >
            <House className="size-5 group-hover:animate-wiggle" />
          </span>
          <span className="text-pop-gradient truncate font-pixel text-lg sm:text-xl">{profile.siteTitle}</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="メインナビゲーション" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "ink-nav-host font-pixel text-nav relative inline-flex items-center px-4 py-2 font-bold transition hover:-translate-y-0.5 active:scale-95",
                        // 選択中はインクの上に濃い紫の文字（インクは明るい色なので読みやすい）
                        active ? "text-pop-foreground" : "text-foreground",
                      )}
                    >
                      {/* 文字の後ろに、選択中だけインクがびちゃっと付く */}
                      <span className="relative isolate">
                        <NavInk color={item.ink} active={active} shape={item.href.length} />
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle />
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
