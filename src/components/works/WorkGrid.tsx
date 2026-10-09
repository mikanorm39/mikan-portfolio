"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRevealGate } from "@/components/opening/OpeningContext";
import type { Work } from "@/lib/works";
import { layoutTransition, listItem, REVEAL_VIEWPORT } from "@/lib/motion";
import { WorkCard } from "./WorkCard";

/** 絞り込みを変えると、layout + AnimatePresence でカードがなめらかに並び替わる */
export function WorkGrid({ works }: { works: Work[] }) {
  const reduce = useReducedMotion();
  const variants = listItem(reduce);
  const { reveal } = useRevealGate();

  if (works.length === 0) {
    return (
      <p className="pixel-box bg-card p-10 text-center font-bold text-muted-foreground">
        この条件の作品はまだありません 🥲
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {works.map((w, i) => (
          <motion.li
            key={w.slug}
            layout
            custom={i % 3}
            data-reveal
            variants={variants}
            {...reveal}
            exit="exit"
            viewport={REVEAL_VIEWPORT}
            transition={{ layout: layoutTransition }}
          >
            <WorkCard work={w} headingLevel="h2" priority={i < 3} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
