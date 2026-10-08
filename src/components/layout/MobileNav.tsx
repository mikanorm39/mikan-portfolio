"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { InkBehind, NavInk } from "@/components/splat/InkUi";
import { externalLinks } from "./externalLinks";
import { isActivePath, navItems } from "./nav";

export function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          // PC でも表示（外部リンク CLUB / GitHub / SNS はこのメニューの中にある）
          className="pixel-button inline-flex size-10 items-center justify-center bg-secondary text-secondary-foreground"
          aria-label="メニューを開く"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 rounded-l-3xl border-none">
        <SheetHeader className="pt-6">
          <SheetTitle className="text-pop-gradient font-pixel text-xl">{profile.siteTitle}</SheetTitle>
          <SheetDescription className="font-pixel">ページを選んでください</SheetDescription>
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
                      "ink-nav-host font-pixel relative flex items-center px-5 py-3 text-base font-bold transition active:scale-95",
                      active ? "text-pop-foreground" : "text-foreground",
                    )}
                  >
                    {/* 文字の後ろに、選択中だけインクがびちゃっと付く */}
                    <span className="relative isolate">
                      <NavInk color={item.ink} active={active} shape={item.href.length} />
                      {item.menuLabel}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ページの下に、外部リンク（CLUB / GitHub / SNS）をアイコン付きで並べる */}
        <nav aria-label="外部リンク" className="mt-2 border-t border-dashed border-primary/30 px-4 pt-4">
          <ul className="flex flex-col gap-2">
            {externalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ink-cursor-host font-pixel relative flex items-center gap-3 px-5 py-2.5 text-base text-foreground transition active:scale-95"
                >
                  {/* アイコンはインクより手前に出す */}
                  <span className="relative z-10 inline-grid size-7 shrink-0 place-items-center" aria-hidden="true">
                    {link.icon}
                  </span>
                  {/* ホバー・フォーカスで文字の後ろにインクを薄めに出す（上のページ一覧の、選択されていない項目と同じ） */}
                  <InkBehind color={link.ink} faint>
                    {link.label}
                  </InkBehind>
                  <span className="sr-only">（新しいタブで開く）</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
