"use client";

import { useCallback, useEffect, useRef } from "react";
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
      {/* 部分ごとの class は、充填の色をインクの色で塗り分けるため */}
      <path className={styles.segSmall} d="M40.2 72.2A28 28 0 0 1 79.8 72.2" />
      <path className={styles.segMid} d="M21.8 53.8A54 54 0 0 1 98.2 53.8" />
      <path className={styles.segBig} d="M3.4 35.4A80 80 0 0 1 116.6 35.4" />
      <circle className={styles.segDot} cx={60} cy={92} r={9} fill="currentColor" stroke="none" />
    </g>
  );
}

/** 雷が中央に届く時刻（表示を始めてから。1つ目と最後） */
const FIRST_HIT_MS = T.boltStartDelayMs + T.boltTravelMs;
const LAST_HIT_MS = FIRST_HIT_MS + T.boltIntervalMs * (BOLT_COUNT - 1);
/** 幕が開け始める時刻（最後の雷が届いて、光り終わったら） */
const REVEAL_AT_MS = LAST_HIT_MS + T.flashMs;

/**
 * 動き（雷・WiFi の充填・揺れ・光る・幕が開く）はすべて CSS のアニメーションで、時刻を決めて流している。
 * ページの JS の読み込み（ハイドレーション）を待たずに、画面に出た瞬間から動き出すので、
 * 読み込みが遅いときでも止まって見えない。JS は「いつ幕が開け始めたか・開けきったか」を知るためだけに使う。
 */
export function LoadingScreen({ onReveal, onComplete }: Props) {
  const curtainRef = useRef<HTMLDivElement>(null);
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

  // JS が動き出した時点で、幕のアニメーションがどこまで進んでいるかを見て
  // 「開け始め（onReveal）」と「開けきり（onComplete）」の時刻を合わせる。
  // 読み込みが遅くて、すでに開けきっていれば、すぐに両方を呼ぶ。
  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;
    const timers: number[] = [];
    const anim = curtain.getAnimations()[0];
    if (anim) {
      const elapsed = Number(anim.currentTime ?? 0);
      timers.push(window.setTimeout(() => onReveal?.(), Math.max(0, REVEAL_AT_MS - elapsed)));
      anim.finished.then(complete, complete);
    } else {
      // 動きを減らす設定などでアニメーションがないとき：少し見せてから閉じる
      onReveal?.();
      timers.push(window.setTimeout(complete, T.reducedHoldMs));
    }
    // 念のため：何かでアニメーションの終了が来なくても、必ず閉じる
    timers.push(window.setTimeout(complete, REVEAL_AT_MS + T.revealMs + 2000));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onReveal, complete]);

  // 時間・揺れは CSS 変数として渡す（CSS 側はこの値を読む）
  const vars = {
    "--ls-bolt-travel-ms": `${T.boltTravelMs}ms`,
    "--ls-first-hit-ms": `${FIRST_HIT_MS}ms`,
    "--ls-last-hit-ms": `${LAST_HIT_MS}ms`,
    "--ls-reveal-at-ms": `${REVEAL_AT_MS}ms`,
    "--ls-bolt-interval-ms": `${T.boltIntervalMs}ms`,
    "--ls-bolt-count": BOLT_COUNT,
    "--ls-flash-ms": `${T.flashMs}ms`,
    "--ls-reveal-ms": `${T.revealMs}ms`,
    "--ls-wave-ms": `${T.waveCycleMs}ms`,
    "--ls-wobble-angle": `${WOBBLE.angleDeg}deg`,
    "--ls-wobble-scale": WOBBLE.scale,
  } as React.CSSProperties;

  return (
    <div
      // 動きを減らす設定なら <head> のスクリプト + globals.css で最初から非表示になる
      data-opening-overlay
      role="status"
      aria-label="読み込み中"
      className={styles.root}
      style={vars}
    >
      <div ref={curtainRef} className={styles.curtain}>
        {/* 画面端から飛んでくる雷 */}
        {BOLT_STARTS.map((p, i) => (
            <div key={i} className={styles.boltSlot} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className={styles.bolt}
                style={
                  {
                    "--ls-from-x": p.x,
                    "--ls-from-y": p.y,
                    "--ls-bolt-scale": p.size,
                    "--ls-bolt-color": `var(--ink-${p.color})`,
                    "--ls-bolt-delay": `${T.boltStartDelayMs + T.boltIntervalMs * i}ms`,
                  } as React.CSSProperties
                }
              >
                <path d={BOLT_PATH} />
              </svg>
            </div>
          ))}

        {/* 中央の WiFi マーク：未充填の形の上に、下から伸びる clipPath で切り抜いた塗りを重ねる */}
        <div className={styles.center}>
          <div className={styles.full}>
            <div className={styles.wobbleTarget}>
              <svg viewBox="-6 2 132 102" className={styles.wifi} aria-hidden="true">
                <defs>
                  <clipPath id="ls-wifi-fill">
                    <rect
                      x={-6}
                      y={2}
                      width={132}
                      height={102}
                      className={styles.fillRect}
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
