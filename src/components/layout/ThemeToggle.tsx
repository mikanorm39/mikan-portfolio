"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // アイコンの出し分けは .dark クラスで行うので、マウント前でもちらつかない
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "group pixel-button inline-flex size-10 items-center justify-center bg-secondary text-secondary-foreground",
        className,
      )}
      aria-label="ライトモードとダークモードを切り替える"
    >
      <Sun className="size-5 group-hover:animate-wiggle dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-5 group-hover:animate-wiggle dark:block" aria-hidden="true" />
    </button>
  );
}
