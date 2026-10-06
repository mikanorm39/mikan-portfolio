"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRevealGate } from "@/components/opening/OpeningContext";
import type { Project } from "@/data/projects";
import { layoutTransition, listItem, REVEAL_VIEWPORT } from "@/lib/motion";
import { ProjectCard } from "./ProjectCard";

/** 絞り込みを変えると、layout + AnimatePresence でカードがなめらかに並び替わる */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const variants = listItem(reduce);
  const { reveal } = useRevealGate();

  if (projects.length === 0) {
    return (
      <p className="rounded-2xl bg-card p-10 text-center font-bold text-muted-foreground ring-1 ring-border">
        この条件の作品はまだありません 🥲
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {projects.map((p, i) => (
          <motion.li
            key={p.slug}
            layout
            custom={i % 3}
            data-reveal
            variants={variants}
            {...reveal}
            exit="exit"
            viewport={REVEAL_VIEWPORT}
            transition={{ layout: layoutTransition }}
          >
            <ProjectCard project={p} headingLevel="h2" priority={i < 3} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
