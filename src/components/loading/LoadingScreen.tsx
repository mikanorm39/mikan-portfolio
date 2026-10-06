"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useHydrated } from "@/components/opening/OpeningContext";
import { cn } from "@/lib/utils";
import { BOLT_STARTS, LOADING_TIMING as T, WOBBLE } from "./loadingConfig";
import styles from "./LoadingScreen.module.css";

type Props = {
  /** 幕が開け始めたとき（ページ本体の出現アニメーションを始める合図） */
  onReveal?: () => void;
  /** 完全に開けたとき。呼び出し側でこのコンポーネントを外す */
  onComplete: () => void;
};

const BOLT_COUNT = BOLT_STARTS.length;

// スクロールを起こすキー（ローディング中だけ無効にする）
const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);

// 雷マーク（24×24）
const BOLT_PATH = "M13 2 4 14h7l-1 8 10-13h-7z";

/** WiFi マークの形（扇形3本＋下の点）。下から 点 → 小 → 中 → 大 の順に縦に並ぶ */
function WifiShape() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={13} strokeLinecap="round">
      <path d="M40.2 72.2A28 28 0 0 1 79.8 72.2" />
      <path d="M21.8 53.8A54 54 0 0 1 98.2 53.8" />
      <path d="M3.4 35.4A80 80 0 0 1 116.6 35.4" />
      <circle cx={60} cy={92} r={9} fill="currentColor" stroke="none" />
    </g>
  );
}

export function LoadingScreen({ onReveal, onComplete }: Props) {
  // ハイドレーションが終わってから雷を飛ばす（届いたイベントを取りこぼさないため）
  const hydrated = useHydrated();
  const reduced = useReducedMotion() === true;
  const charging = hydrated && !reduced;

  const [hits, setHits] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const full = reduced || hits >= BOLT_COUNT;
  const fill = reduced ? 1 : Math.min(hits / BOLT_COUNT, 1);

  const wobbleRef = useRef<HTMLDivElement>(null);
  const completed = useRef(false);

  const complete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    onComplete();
  }, [onComplete]);

  // ローディング中はページ本体のスクロールを止める。
  // overflow: hidden だとスクロールバーが消えてレイアウトがずれるので、操作のほうを止める
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // 雷が届くたびに揺らす（class を付け外しして、連続でも毎回最初から再生）
  useEffect(() => {
    const el = wobbleRef.current;
    if (!el || hits === 0 || reduced) return;
    el.classList.remove(styles.wobble);
    void el.offsetWidth; // 再描画させてアニメーションをリセット
    el.classList.add(styles.wobble);
  }, [hits, reduced]);

  // 満タン → 光り終わったら幕を開ける（動きを減らす設定なら少し見せてからフェード）
  useEffect(() => {
    if (!hydrated || !full || revealing) return;
    const timer = window.setTimeout(() => setRevealing(true), reduced ? T.reducedHoldMs : T.flashMs);
    return () => window.clearTimeout(timer);
  }, [hydrated, full, revealing, reduced]);

  useEffect(() => {
    if (revealing) onReveal?.();
  }, [revealing, onReveal]);

  // 念のため：何かでアニメーションの終了が来なくても、必ず閉じる
  useEffect(() => {
    const total =
      T.boltStartDelayMs + T.boltIntervalMs * BOLT_COUNT + T.boltTravelMs + T.flashMs + T.revealMs + 2000;
    const timer = window.setTimeout(complete, total);
    return () => window.clearTimeout(timer);
  }, [complete]);

  // 時間・揺れは CSS 変数として渡す（CSS 側はこの値を読む）
  const vars = {
    "--ls-bolt-travel-ms": `${T.boltTravelMs}ms`,
    "--ls-fill-ms": `${T.fillStepMs}ms`,
    "--ls-wobble-ms": `${T.wobbleMs}ms`,
    "--ls-flash-ms": `${T.flashMs}ms`,
    "--ls-reveal-ms": `${T.revealMs}ms`,
    "--ls-wave-ms": `${T.waveCycleMs}ms`,
    "--ls-reduced-fade-ms": `${T.reducedFadeMs}ms`,
    "--ls-wobble-angle": `${WOBBLE.angleDeg}deg`,
    "--ls-wobble-scale": WOBBLE.scale,
  } as React.CSSProperties;

  return (
    <div
      // 2回目以降は <head> のスクリプト + globals.css で最初から非表示になる
      data-opening-overlay
      role="status"
      aria-label="読み込み中"
      className={cn(styles.root, charging && styles.charging, revealing && styles.revealing, reduced && styles.reduced)}
      style={vars}
      onTransitionEnd={(e) => {
        // 動きを減らす設定のフェードアウトが終わった
        if (reduced && revealing && e.target === e.currentTarget) complete();
      }}
    >
      <div
        className={styles.curtain}
        onAnimationEnd={(e) => {
          // 幕が上に抜けきった
          if (e.target === e.currentTarget) complete();
        }}
      >
        {/* 画面端から飛んでくる雷 */}
        {!reduced &&
          BOLT_STARTS.map((p, i) => (
            <div key={i} className={styles.boltSlot} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className={styles.bolt}
                style={
                  {
                    "--ls-from-x": p.x,
                    "--ls-from-y": p.y,
                    "--ls-bolt-scale": p.size,
                    "--ls-bolt-delay": `${T.boltStartDelayMs + T.boltIntervalMs * i}ms`,
                  } as React.CSSProperties
                }
                onAnimationEnd={() => setHits((h) => h + 1)}
              >
                <path d={BOLT_PATH} />
              </svg>
            </div>
          ))}

        {/* 中央の WiFi マーク：未充填の形の上に、下から伸びる clipPath で切り抜いた塗りを重ねる */}
        <div className={styles.center}>
          <div className={cn(full && !reduced && styles.full)}>
            <div ref={wobbleRef} className={styles.wobbleTarget}>
              <svg viewBox="-6 2 132 102" className={styles.wifi} aria-hidden="true">
                <defs>
                  <clipPath id="ls-wifi-fill">
                    <rect
                      x={-6}
                      y={2}
                      width={132}
                      height={102}
                      className={styles.fillRect}
                      style={{ transform: `scaleY(${fill})` }}
                    />
                  </clipPath>
                </defs>
                <g className={styles.wifiEmpty}>
                  <WifiShape />
                </g>
                <g className={styles.wifiFill} clipPath="url(#ls-wifi-fill)">
                  <WifiShape />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* 幕の下端の波線（横幅 200%・2周期ぶんを繰り返して横に流す） */}
        <svg viewBox="0 0 2400 100" preserveAspectRatio="none" className={styles.wave} aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 0V50Q150 90 300 50T600 50T900 50T1200 50T1500 50T1800 50T2100 50T2400 50V0Z"
          />
        </svg>
      </div>
    </div>
  );
}
