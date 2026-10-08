"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  buildCanvasSplats,
  cellRadius,
  drawProjectile,
  drawSplat,
  planShots,
  radiusToScale,
  splatCurve,
  type Shot,
} from "./inkCanvas";
import { INK_SIZE, INK_TIMING as T } from "./inkLoadingConfig";
import { useLockScroll } from "./useLockScroll";
import styles from "./InkLoadingScreen.module.css";

type Props = {
  /** 演出が始まったとき（後ろのページの出現アニメーションを始める合図。穴から見えるように最初に呼ぶ） */
  onReveal?: () => void;
  /** 全部消えたとき。呼び出し側でこのコンポーネントを外す */
  onComplete: () => void;
};

/** CSS 変数の色を読む（インクの色はサイト共通の --ink-○○） */
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * インク発射型のローディング画面。
 * 白い画面に、画面の外からインクが飛んできて「びちゃっ」と着弾し、その形に穴が空いて後ろのページが見えていく。
 * 白い画面と穴は Canvas に毎フレーム描き直す（白で塗る → 着弾したスプラッシュの形を destination-out で消す）。
 */
export function InkLoadingScreen({ onReveal, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);
  const completed = useRef(false);
  // 親から渡された関数は ref に入れておく（演出の途中で親が再描画されても、演出をやり直さない）
  const callbacks = useRef({ onReveal, onComplete });
  useEffect(() => {
    callbacks.current = { onReveal, onComplete };
  });

  useLockScroll();

  // 最後のフェードが終わったら（または念のための時間が過ぎたら）完了。2回は呼ばない
  const complete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    callbacks.current.onComplete();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      complete();
      return;
    }

    // 後ろのページは最初から描いておく（穴から見えるように、出現アニメーションをすぐ始める）
    callbacks.current.onReveal?.();

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const white = cssVar("--ink-highlight") || "#ffffff";
    const colors = Object.fromEntries(
      ["yellow", "pink", "mint", "cyan", "orange"].map((c) => [c, cssVar(`--ink-${c}`)]),
    ) as Record<Shot["color"], string>;

    // 画面サイズと解像度（リサイズにも追従）
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
    };
    resize();
    window.addEventListener("resize", resize);

    const timers: number[] = [];
    const fadeOut = () => {
      setFading(true);
      // 念のため：transitionend が来なくても必ず閉じる
      timers.push(window.setTimeout(complete, T.fadeMs + 300));
    };

    // 白で塗っておき、次のフレームで（キャンバスの白に切り替えて）入れ物の白を外す
    ctx.fillStyle = white;
    ctx.fillRect(0, 0, w, h);
    const readyRaf = requestAnimationFrame(() => setReady(true));

    // 動きを減らす設定：発射しないで、白を短くフェードアウトするだけ
    if (reduced) {
      timers.push(window.setTimeout(fadeOut, T.reducedHoldMs));
      return () => {
        cancelAnimationFrame(readyRaf);
        timers.forEach(clearTimeout);
        window.removeEventListener("resize", resize);
      };
    }

    const splats = buildCanvasSplats();
    const plan = planShots(w, h);
    const start = performance.now();
    let raf = 0;
    let faded = false;

    const frame = (now: number) => {
      const t = now - start;
      const base = cellRadius(w, h, plan.cols, plan.rows);
      const projR = Math.min(w, h) * INK_SIZE.projectile;

      // 1. 白で塗る
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = white;
      ctx.fillRect(0, 0, w, h);

      // 2. 着弾したインク：ふち取り（少し大きくインク色で）→ その形で白を消す（穴）
      for (const s of plan.shots) {
        const landAt = s.launchAt + T.flightMs;
        if (t < landAt) continue;
        const k = splatCurve((t - landAt) / T.splatMs);
        const radius = base * s.size * k;
        const scale = radiusToScale(radius);
        const x = s.to.x * w;
        const y = s.to.y * h;
        // ふち取り（rimPx が 0 のときは描かない＝インクの色を残さず、穴だけ）
        if (INK_SIZE.rimPx > 0) {
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = INK_SIZE.rimAlpha;
          ctx.fillStyle = colors[s.color];
          ctx.strokeStyle = colors[s.color];
          drawSplat(ctx, splats[s.shape % splats.length], x, y, scale * (1 + INK_SIZE.rimPx / Math.max(1, radius)), s.rotate);
        }
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#000";
        drawSplat(ctx, splats[s.shape % splats.length], x, y, scale, s.rotate);
      }

      // 3. 飛んでいるインク（画面の外 → 着弾地点。少し加速しながら）
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (const s of plan.shots) {
        const p = (t - s.launchAt) / T.flightMs;
        if (p < 0 || p >= 1) continue;
        const e = p * p * 0.4 + p * 0.6;
        const fx = s.from.x * w;
        const fy = s.from.y * h;
        const tx = s.to.x * w;
        const ty = s.to.y * h;
        drawProjectile(ctx, fx + (tx - fx) * e, fy + (ty - fy) * e, Math.atan2(ty - fy, tx - fx), projR, colors[s.color], white);
      }

      // 4. 全部着弾したら、ふち取りや残った白をふわっと消す（白が細かく残っても、ここで必ず消える）
      if (!faded && t > plan.endsAt + T.holdMs) {
        faded = true;
        fadeOut();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(readyRaf);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", resize);
    };
  }, [complete]);

  return (
    <div
      // 2回目以降は <head> のスクリプト + globals.css で最初から非表示になる（既存のローディングと同じ仕組み）
      data-opening-overlay
      role="status"
      aria-label="読み込み中"
      className={cn(styles.root, ready && styles.ready, fading && styles.fading)}
      style={{ "--ink-fade-ms": `${T.fadeMs}ms` } as React.CSSProperties}
      onTransitionEnd={(e) => {
        if (fading && e.target === e.currentTarget) complete();
      }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
