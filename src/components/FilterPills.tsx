"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { navPillTransition } from "@/lib/motion";

export type FilterOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  /** グループ名（スクリーンリーダー用 & layoutId の区別） */
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** 横スクロールできるピル型ボタンの列 */
export function FilterPills<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
      <div className="flex w-max gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "relative isolate shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition hover:-translate-y-0.5 active:scale-95",
                active
                  ? "text-pop-foreground"
                  : "bg-card text-foreground ring-1 ring-border hover:text-primary hover:shadow-pop",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`filter-pill-${label}`}
                  className="bg-pop-gradient absolute inset-0 -z-10 rounded-full shadow-pop"
                  transition={navPillTransition}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
