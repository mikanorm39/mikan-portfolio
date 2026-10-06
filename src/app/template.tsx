"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { pageTransition } from "@/lib/motion";

// 最初の表示（サーバーから届いた HTML）はそのまま見せ、2回目以降のページ遷移だけアニメーションさせる。
// こうすると初回表示で中身が透明のまま待たされず、LCP も悪化しない。
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const { initial, animate, transition } = pageTransition(reduce);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div initial={hasNavigated ? initial : false} animate={animate} transition={transition}>
      {children}
    </motion.div>
  );
}
