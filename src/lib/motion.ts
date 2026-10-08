import type { Transition, Variants } from "motion/react";

/**
 * アニメーションの設定値はここに集約する。
 * 動かすのは transform（x / y / scale）と opacity だけ。
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2,
  page: 0.35,
  reveal: 0.6,
} as const;

// ---------- ① ローディング（本体は components/loading） ----------

// ---------- ② ヒーロー ----------
export const HERO_STAGGER = 0.12;

export function heroContainer(): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: HERO_STAGGER } },
  };
}

/** ヒーローの各要素。開始値をキーフレームで明示し、どの状態からでも下からふわっと出す */
export function heroItem(reduce: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 24, transition: { duration: 0 } },
    show: {
      opacity: [0, 1],
      y: reduce ? 0 : [24, 0],
      transition: { duration: reduce ? DURATION.fast : DURATION.reveal, ease: EASE_OUT },
    },
  };
}

// ---------- ③ スクロール出現（＋ヒーロー各要素） ----------
/**
 * 下からフェードイン。reduce のときは移動なしでフェードのみ。
 * hidden は幕の下や描画前にしか使わないので一瞬で切り替える。
 */
export function fadeUp(reduce: boolean | null, distance = 24): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : distance, transition: { duration: 0 } },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? DURATION.fast : DURATION.reveal, ease: EASE_OUT },
    },
  };
}

export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

export const REVEAL_VIEWPORT = { once: true, margin: "-80px" } as const;

// ---------- ④ ページ遷移 ----------
export function pageTransition(reduce: boolean | null) {
  return {
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.page, ease: EASE_OUT },
  };
}

export const navPillTransition: Transition = { type: "spring", stiffness: 420, damping: 34 };

// ---------- 絞り込みできる一覧（作品カード・タイムライン） ----------
/**
 * 画面に入ったら下からフェードイン（同じ行のものは custom=列番号 で少しずつずらす）。
 * 絞り込みで消えるときは exit で縮みながらフェードアウト。
 */
export function listItem(reduce: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 24, transition: { duration: 0 } },
    show: (col: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? DURATION.fast : DURATION.reveal,
        ease: EASE_OUT,
        delay: reduce ? 0 : col * 0.1,
      },
    }),
    exit: {
      opacity: 0,
      scale: reduce ? 1 : 0.94,
      transition: { duration: 0.25, ease: EASE_OUT },
    },
  };
}

export const layoutTransition: Transition = { duration: 0.4, ease: EASE_OUT };
