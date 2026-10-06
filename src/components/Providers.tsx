"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { OpeningProvider } from "@/components/opening/OpeningContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // next-themes が選択を localStorage に保存し、描画前のスクリプトでちらつきを防ぐ
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* OS の「視差効果を減らす」設定を Motion 全体に反映 */}
      <MotionConfig reducedMotion="user">
        <OpeningProvider>{children}</OpeningProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
