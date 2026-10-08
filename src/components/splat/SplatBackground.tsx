"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useOpening } from "@/components/opening/OpeningContext";
import { cn } from "@/lib/utils";
import { InkSplat } from "./InkSplat";
import { PixelSymbol } from "./PixelSymbol";
import { SPLATS, SPLAT_TIMING as T, SYMBOLS } from "./splatConfig";
import styles from "./Splat.module.css";

/** 時間を CSS 変数で渡す（Splat.module.css が読む） */
const timingVars = {
  "--hit-ms": `${T.hitMs}ms`,
  "--drops-delay": `${T.dropsDelayMs}ms`,
  "--drop-ms": `${T.dropMs}ms`,
  "--drop-stagger": `${T.dropStaggerMs}ms`,
  "--drip-delay": `${T.dripDelayMs}ms`,
  "--drip-ms": `${T.dripMs}ms`,
  "--symbol-delay": `${T.symbolDelayMs}ms`,
} as React.CSSProperties;

/**
 * ページ全体の背景に敷くインクと記号（layout.tsx に置く）。
 * ページを移動したら最初から（key = パス）。各ページでもう一度びちゃっと着弾する。
 */
export function SplatBackground() {
  const pathname = usePathname();
  return <SplatLayer key={pathname} isHome={pathname === "/"} />;
}

function SplatLayer({ isHome }: { isHome: boolean }) {
  // ローディング画面が開けるまでは着弾させない（ファーストビューはその直後に順番に着弾）
  const { done } = useOpening();
  // 着弾したもの（id → 着弾の遅れ ms）。一度着弾したら、上にスクロールし直しても消さない
  const [hits, setHits] = useState<Map<string, number>>(() => new Map());
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = layer.current;
    if (!done || !root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entered = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .map((e) => e.target as HTMLElement);
        if (entered.length === 0) return;
        entered.forEach((el) => io.unobserve(el));
        // 同時に画面に入ったものは、上から順番に少しずつ遅らせて着弾させる
        setHits((prev) => {
          const next = new Map(prev);
          let order = 0;
          for (const el of entered) {
            const id = el.dataset.splatId!;
            if (next.has(id)) continue;
            // インクは上から順に少しずつ遅らせる。記号は近くのインクと同じタイミング
            // （さらに CSS の --symbol-delay だけ遅れて、インクの着弾のあとにポンッと出る）
            if (el.dataset.kind === "symbol") next.set(id, Math.max(0, order - 1) * T.staggerMs);
            else next.set(id, order++ * T.staggerMs);
          }
          return next;
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    root.querySelectorAll<HTMLElement>("[data-splat-id]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [done]);

  const place = (it: { top: string; left?: string; right?: string; size: string }) => ({
    top: it.top,
    left: it.left,
    right: it.right,
    width: it.size,
  });

  return (
    <div ref={layer} className={styles.layer} style={timingVars} aria-hidden="true">
      {SPLATS.filter((s) => (isHome ? !s.subOnly : !s.homeOnly)).map((s) => {
        const delay = hits.get(s.id);
        return (
          <div
            key={s.id}
            data-splat-id={s.id}
            className={cn(styles.slot, !s.mobile && styles.desktopOnly)}
            style={place(s)}
          >
            <div
              className={cn(styles.splat, delay !== undefined && styles.hit)}
              style={{ "--enter-delay": `${delay ?? 0}ms` } as React.CSSProperties}
            >
              <InkSplat shape={s.shape} color={s.color} rotate={s.rotate} />
            </div>
          </div>
        );
      })}

      {SYMBOLS.filter((s) => isHome || !s.homeOnly).map((s) => {
        const delay = hits.get(s.id);
        return (
          <div
            key={s.id}
            data-splat-id={s.id}
            data-kind="symbol"
            className={cn(styles.slot, !s.mobile && styles.desktopOnly)}
            style={place(s)}
          >
            <div
              className={cn(styles.symbol, delay !== undefined && styles.hit)}
              style={{ "--enter-delay": `${delay ?? 0}ms`, "--rot": `${s.rotate}deg` } as React.CSSProperties}
            >
              <PixelSymbol kind={s.kind} color={s.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
