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
          className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:-translate-y-0.5 hover:shadow-pop active:scale-95 md:hidden"
          aria-label="メニューを開く"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 rounded-l-3xl border-none">
        <SheetHeader className="pt-6">
          <SheetTitle className="text-pop-gradient text-xl font-extrabold">{profile.siteTitle}</SheetTitle>
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
                      "relative isolate flex items-center rounded-full px-5 py-3 text-base font-bold transition active:scale-95",
                      active ? "text-pop-foreground" : "text-foreground hover:bg-secondary",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="mobile-nav-pill"
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
      </SheetContent>
    </Sheet>
  );
}
