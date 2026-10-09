"use client";

import { useEffect, useRef, useState } from "react";
import { useOpening } from "@/components/opening/OpeningContext";
import { NavInk } from "./InkUi";
import type { InkColor } from "./splatConfig";

/**
 * 見出しの文字の後ろに付くインク。
 * - スクロールで見出しが画面に入ったら（ページを開いたときに最初から見えていれば、すぐに）着弾して、そのまま残る
 * - ローディング画面が出ているあいだは待ち、開けてから着弾する
 * - trigger="tap" のときは、画面に入っても着弾せず、見出しをタップ（クリック）したときに着弾する（もう一度押すと着弾し直す）
 * 親の要素には relative と isolate を付ける（インクを文字の後ろに重ねるため）。
 */
/** すでにインクがある見出しをもう一度押したとき、いったん縮めてからもう一度着弾するまでの間（ms） */
const RETAP_MS = 90;

export function HeadingInk({
  color,
  trigger = "view",
}: {
  color: InkColor;
  /** "view" = 画面に入ったら着弾 / "tap" = 見出しを押したら着弾 */
  trigger?: "view" | "tap";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hit, setHit] = useState(false);
  // ローディング画面が開けたか（開けるまでは着弾させない）
  const { done } = useOpening();

  // スクロールで見出しが画面に入ったら着弾（画面の上下の端ぎりぎりではなく、少し内側に入ったとき）
  useEffect(() => {
    const el = ref.current;
    if (!el || !done || trigger !== "view") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setHit(true);
      },
      { rootMargin: "-15% 0px -25% 0px", threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [done, trigger]);

  // タップで着弾：見出し（このインクの親の要素）を押した瞬間に着弾する（離すのを待たない）
  // まだインクがなければすぐ着弾、すでにあれば少しだけ縮めてからもう一度着弾
  const hitRef = useRef(false);
  useEffect(() => {
    hitRef.current = hit;
  }, [hit]);
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || trigger !== "tap") return;
    let timer = 0;
    const onTap = (e: PointerEvent) => {
      if (e.button !== 0) return; // 左クリック・タップだけ
      window.clearTimeout(timer);
      if (!hitRef.current) {
        setHit(true);
        return;
      }
      setHit(false);
      timer = window.setTimeout(() => setHit(true), RETAP_MS);
    };
    host.addEventListener("pointerdown", onTap);
    return () => {
      window.clearTimeout(timer);
      host.removeEventListener("pointerdown", onTap);
    };
  }, [trigger]);

  return (
    <span ref={ref} className="absolute inset-0 -z-10" aria-hidden="true">
      <NavInk color={color} active={hit} shape={2} />
    </span>
  );
}
