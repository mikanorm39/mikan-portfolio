"use client";

import { useCallback, useEffect, useState } from "react";
import { useOpening } from "@/components/opening/OpeningContext";
import { OPENING } from "@/lib/motion";
import { LoadingScreen } from "./LoadingScreen";
import { SHOW_LOADING } from "./loadingConfig";

/**
 * ローディング画面の出し入れ（layout.tsx に置く）。
 * タブごとに初回だけ表示し、onComplete で外す。幕が開け始めたらヒーローの出現アニメーションを始める。
 */
export function LoadingGate() {
  const { skipped, finish } = useOpening();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // ローディングを出さない設定なら、すぐにページ本体の出現アニメーションを始める
    if (!SHOW_LOADING) {
      finish();
      return;
    }
    if (skipped) return;
    try {
      sessionStorage.setItem(OPENING.storageKey, "1");
    } catch {
      // プライベートモードなどで保存できなくても表示は続ける
    }
  }, [skipped, finish]);

  const handleComplete = useCallback(() => {
    document.documentElement.dataset.opening = "done";
    setVisible(false);
  }, []);

  if (!SHOW_LOADING || skipped || !visible) return null;

  return <LoadingScreen onReveal={finish} onComplete={handleComplete} />;
}
