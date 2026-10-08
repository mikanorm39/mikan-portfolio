"use client";

import { useCallback, useEffect, useState } from "react";
import { useOpening } from "@/components/opening/OpeningContext";
import { InkLoadingScreen } from "./InkLoadingScreen";
import { LoadingScreen } from "./LoadingScreen";
import { LOADING_VARIANT, SHOW_LOADING } from "./loadingConfig";

/**
 * ローディング画面の出し入れ（layout.tsx に置く）。
 * URL を開いたとき・再読み込みしたときに毎回表示し、onComplete で外す（サイト内のページ移動では layout が作り直されないので出ない）。
 *幕が開け始めたらヒーローの出現アニメーションを始める。
 */
export function LoadingGate() {
  const { skipped, finish } = useOpening();
  const [visible, setVisible] = useState(true);

  // ローディングを出さない設定なら、すぐにページ本体の出現アニメーションを始める
  useEffect(() => {
    if (!SHOW_LOADING) finish();
  }, [finish]);

  const handleComplete = useCallback(() => {
    document.documentElement.dataset.opening = "done";
    setVisible(false);
  }, []);

  if (!SHOW_LOADING || skipped || !visible) return null;

  // どちらのローディングも同じ onReveal / onComplete で終わりを伝える（切り替えは loadingConfig.ts の LOADING_VARIANT）
  const Screen = LOADING_VARIANT === "ink" ? InkLoadingScreen : LoadingScreen;
  return <Screen onReveal={finish} onComplete={handleComplete} />;
}
