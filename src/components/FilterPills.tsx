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
    // 横スクロールの入れ物は上下のはみ出しも隠すので、ホバーで浮いた分（2px）が切れないよう上に余白（pt-1）を足し、
    // 同じ分だけ上にずらして（-mt-1）配置は変えない
    <div role="group" aria-label={label} className="-mx-4 -mt-1 overflow-x-auto px-4 pt-1 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
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
                "pixel-button shrink-0 px-4 py-2 text-sm font-bold whitespace-nowrap",
                active
                  ? "text-pop-foreground"
                  : "bg-card text-foreground hover:text-primary",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`filter-pill-${label}`}
                  className="pixel-chip bg-pop-gradient absolute inset-0 -z-10"
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
