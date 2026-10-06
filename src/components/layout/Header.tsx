"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { navPillTransition } from "@/lib/motion";
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
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 rounded-full transition-transform duration-300 hover:-rotate-1 hover:scale-105"
        >
          <Image
            src={profile.avatar}
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full shadow-pop"
          />
          <span className="text-pop-gradient truncate font-heading text-lg font-extrabold sm:text-xl">
            {profile.siteTitle}
          </span>
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
                        "relative isolate inline-flex items-center rounded-full px-4 py-2 font-bold transition hover:-translate-y-0.5 active:scale-95",
                        active ? "text-pop-foreground" : "text-foreground hover:text-primary",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="bg-pop-gradient absolute inset-0 -z-10 rounded-full shadow-pop"
                          transition={navPillTransition}
                        />
                      )}
                      {item.label}
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
