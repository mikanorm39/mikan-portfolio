"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRevealGate } from "@/components/opening/OpeningContext";
import { formatDate, type CareerItem } from "@/data/career";
import { layoutTransition, listItem, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CareerTagBadge } from "./CareerTagBadge";

/** 縦のタイムライン（左に日付と線、右にカード） */
export function CareerTimeline({ items }: { items: CareerItem[] }) {
  const reduce = useReducedMotion();
  const variants = listItem(reduce);
  const { reveal } = useRevealGate();

  if (items.length === 0) {
    return (
      <p className="pixel-box bg-card p-10 text-center font-bold text-muted-foreground">
        この条件の活動はまだありません 🥲
      </p>
    );
  }

  return (
    <ol className="relative">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => {
          const award = item.tags.includes("award");
          const last = i === items.length - 1;
          return (
            <motion.li
              key={`${item.date}-${item.title}`}
              layout
              data-reveal
              variants={variants}
              {...reveal}
              exit="exit"
              viewport={REVEAL_VIEWPORT}
              transition={{ layout: layoutTransition }}
              className="grid grid-cols-[2rem_1fr] gap-x-3 sm:grid-cols-[7rem_2.5rem_1fr] sm:gap-x-4"
            >
              {/* 日付（sm 以上は左の列に表示） */}
              <time
                dateTime={item.date}
                className="hidden pt-5 text-right text-sm font-bold text-on-bg sm:block"
              >
                {formatDate(item.date)}
              </time>

              {/* 線とドット */}
              <div className="relative flex justify-center" aria-hidden="true">
                <span className={cn("absolute top-0 w-0.5 bg-white/50", last ? "h-6" : "h-full")} />
                <span
                  className={cn(
                    "pixel-circle relative mt-4 inline-flex items-center justify-center",
                    award ? "size-8 bg-award text-base" : "bg-pop-gradient size-4 mt-6",
                  )}
                >
                  {award && "🏆"}
                </span>
              </div>

              {/* カード */}
              <article
                className={cn(
                  "pixel-box mb-6 bg-card p-5 transition duration-300 hover:-translate-y-1 sm:p-6",
                  award && "holo-border bg-linear-to-br from-award/70 to-card",
                )}
              >
                <time dateTime={item.date} className="text-sm font-bold text-muted-foreground sm:hidden">
                  {formatDate(item.date)}
                </time>
                <h2 className="font-heading text-h3 font-extrabold">
                  {award && (
                    <span className="mr-1" role="img" aria-label="受賞">
                      🏆
                    </span>
                  )}
                  {item.title}
                </h2>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                )}
                {/* 種類がない経歴は、タグの行ごと出さない（余白が空かないように） */}
                {item.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="タグ">
                    {item.tags.map((t) => (
                      <li key={t}>
                        <CareerTagBadge tag={t} />
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
}
