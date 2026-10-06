"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { navPillTransition } from "@/lib/motion";
import { isActivePath, navItems } from "./nav";

export function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="pixel-button inline-flex size-10 items-center justify-center bg-secondary text-secondary-foreground md:hidden"
          aria-label="メニューを開く"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 rounded-l-3xl border-none">
        <SheetHeader className="pt-6">
          <SheetTitle className="text-pop-gradient font-pixel text-xl">{profile.siteTitle}</SheetTitle>
          <SheetDescription>ページを選んでください</SheetDescription>
        </SheetHeader>
        <nav aria-label="モバイルナビゲーション" className="px-4">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "menu-cursor pixel-chip font-pixel relative isolate flex items-center px-5 py-3 text-base font-bold transition active:scale-95",
                      active ? "text-pop-foreground" : "text-foreground hover:bg-secondary",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="mobile-nav-pill"
                        className="pixel-chip bg-pop-gradient absolute inset-0 -z-10"
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
      </SheetContent>
    </Sheet>
  );
}
