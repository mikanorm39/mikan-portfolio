"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRevealGate } from "@/components/opening/OpeningContext";
import { fadeUp, REVEAL_VIEWPORT } from "@/lib/motion";

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
} as const;

type Props = {
  children: React.ReactNode;
  as?: keyof typeof tags;
  className?: string;
};

/** スクロールして画面に入ったら、下からふわっとフェードイン（1回だけ） */
export function Reveal({ children, as = "div", className }: Props) {
  const reduce = useReducedMotion();
  const { reveal } = useRevealGate();
  const Tag = tags[as];
  return (
    <Tag data-reveal className={className} variants={fadeUp(reduce)} viewport={REVEAL_VIEWPORT} {...reveal}>
      {children}
    </Tag>
  );
}
