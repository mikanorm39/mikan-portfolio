"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useRevealGate } from "@/components/opening/OpeningContext";
import { profile } from "@/data/profile";
import { heroContainer, heroItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const sparkles = [
  { className: "left-[6%] top-[14%] size-5", delay: "0s", Icon: Star },
  { className: "left-[44%] top-[8%] size-4", delay: "0.6s", Icon: Sparkles },
  { className: "right-[8%] top-[18%] size-6", delay: "1.2s", Icon: Sparkles },
  { className: "left-[12%] bottom-[16%] size-4", delay: "1.8s", Icon: Sparkles },
  { className: "right-[30%] bottom-[10%] size-5", delay: "0.9s", Icon: Star },
  { className: "right-[4%] bottom-[34%] size-3", delay: "2.1s", Icon: Star },
] as const;

export function Hero() {
  const { heroAnimate } = useRevealGate();
  const reduce = useReducedMotion();
  const item = heroItem(reduce);
  const [floating, setFloating] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-primary/60">
        {sparkles.map(({ className, delay, Icon }, i) => (
          <Icon key={i} className={`absolute animate-sparkle ${className}`} style={{ animationDelay: delay }} />
        ))}
      </div>

      {/* オープニングが終わったら、タイトル1行目 → 2行目 → 挨拶文 → ボタン → 画像 の順に出す */}
      <motion.div
        className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 md:grid-cols-[1fr_auto] md:pt-20 md:pb-24"
        variants={heroContainer()}
        initial={false}
        animate={heroAnimate}
      >
        <div>
          <h1 className="font-pixel text-4xl leading-tight font-extrabold sm:text-6xl">
            <motion.span data-reveal className="block" variants={item}>
              <span className="text-pop-gradient">{profile.displayName}</span>&apos;s
            </motion.span>
            <motion.span data-reveal className="block" variants={item}>
              Portfolio
            </motion.span>
          </h1>
          <motion.p
            data-reveal
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            variants={item}
          >
            {profile.greeting}
          </motion.p>
          <motion.div data-reveal className="mt-8 flex flex-wrap gap-3" variants={item}>
            <Link
              href="/work"
              className="pixel-button bg-pop-gradient group inline-flex items-center gap-2 px-6 py-3 font-bold"
            >
              View Work
              <ArrowRight className="size-4 group-hover:animate-wiggle" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className="pixel-button inline-flex items-center gap-2 border-2 bg-card px-6 py-3 font-bold text-primary"
            >
              About Me
            </Link>
          </motion.div>
        </div>

        <motion.div
          data-reveal
          className="mx-auto"
          variants={item}
          onAnimationComplete={(definition) => {
            if (definition === "show") setFloating(true);
          }}
        >
          {/* 出現し終わったらふわふわ浮かせる */}
          <div className={cn(floating && "animate-float")}>
            <Image
              src={profile.avatar}
              alt={`${profile.displayName}'s avatar`}
              width={256}
              height={256}
              loading="eager"
              fetchPriority="high"
              className="size-48 rounded-full shadow-pop-lg sm:size-64"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
