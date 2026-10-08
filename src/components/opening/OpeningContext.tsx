"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";

type OpeningState = {
  /** オープニングを今回は出さない（動きを減らす設定） */
  skipped: boolean;
  /** オープニングが終わった（または出さない）ので、ヒーローの出現を始めてよい */
  done: boolean;
  finish: () => void;
};

const OpeningContext = createContext<OpeningState>({ skipped: true, done: true, finish: () => {} });

const subscribe = () => () => {};
// <head> のスクリプトが、動きを減らす設定なら <html data-opening="done"> を付けている
const getSnapshot = () => document.documentElement.dataset.opening === "done";
const getServerSnapshot = () => false;

export function OpeningProvider({ children }: { children: React.ReactNode }) {
  const skipped = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [finished, setFinished] = useState(false);
  const finish = useCallback(() => setFinished(true), []);

  const value = useMemo(() => ({ skipped, done: skipped || finished, finish }), [skipped, finished, finish]);

  return <OpeningContext.Provider value={value}>{children}</OpeningContext.Provider>;
}

export function useOpening() {
  return useContext(OpeningContext);
}

/** サーバー描画とハイドレーション中は false、その後は true */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * 出現アニメーションの開始タイミングをそろえるためのフック。
 *
 * - サーバーの HTML では要素を「見えている状態」で出す（初回はオープニングの幕の下にあるので見えないが、
 *   LCP として早く計測される）。オープニングを出さないときは CSS（[data-reveal]）で描画前に隠しているので、ちらつかない。
 * - ハイドレーション後に一瞬で "hidden" にし、オープニングが終わってから "show" にする。
 */
export function useRevealGate() {
  const hydrated = useHydrated();
  const { done } = useOpening();
  return {
    /** ヒーロー用：オープニングが終わったら順番に出す */
    heroAnimate: !hydrated ? undefined : done ? "show" : "hidden",
    /** スクロール出現用：<motion.* {...reveal}> で使う */
    reveal: {
      initial: false as const,
      animate: hydrated ? "hidden" : undefined,
      whileInView: hydrated && done ? "show" : undefined,
    },
  };
}
