"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRevealGate } from "@/components/opening/OpeningContext";
import { fadeUp, REVEAL_VIEWPORT, staggerContainer } from "@/lib/motion";

const groupTags = { div: motion.div, ul: motion.ul, ol: motion.ol } as const;
const itemTags = { div: motion.div, li: motion.li } as const;

type GroupProps = {
  children: React.ReactNode;
  as?: keyof typeof groupTags;
  className?: string;
  stagger?: number;
} & Pick<React.HTMLAttributes<HTMLElement>, "aria-label">;

/** 子の <RevealItem> を少しずつ時間差で出すコンテナ */
export function RevealGroup({ children, as = "div", className, stagger = 0.1, ...rest }: GroupProps) {
  const { reveal } = useRevealGate();
  const Tag = groupTags[as];
  return (
    <Tag className={className} variants={staggerContainer(stagger)} viewport={REVEAL_VIEWPORT} {...reveal} {...rest}>
      {children}
    </Tag>
  );
}

type ItemProps = {
  children: React.ReactNode;
  as?: keyof typeof itemTags;
  className?: string;
};

export function RevealItem({ children, as = "div", className }: ItemProps) {
  const reduce = useReducedMotion();
  const Tag = itemTags[as];
  return (
    <Tag data-reveal className={className} variants={fadeUp(reduce)}>
      {children}
    </Tag>
  );
}
