"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * トップの作品紹介：作品を横一列に並べて、横スクロールで見る。
 * - 一度に見える数：PC 3つ・タブレット 2つ・スマホ 1つ（次のカードが少し覗く）
 * - 動かした位置でそのまま止まる（カードの端に吸い付かせない）
 * - 下のスクロールバー、スワイプ、トラックパッド、Shift＋ホイール、キーボードの ←→ で動かせる
 * - マウスでカードの上を押したまま（右クリックでも左クリックでも）横にドラッグして動かせる
 * - カードを普通にクリック（ドラッグしないで押して離す）すると cardHref（作品一覧ページ）へ移動する。
 *   カードの中のリンク（サイト・コードなど）は、そのリンク先を開く
 * - moreHref を渡すと、一番最後に「＋ MORE」のカード（一覧ページへのリンク）を置く
 * - footer（MORE ボタンなど）は一覧の下の右側に置く
 */
export function ProjectCarousel({
  projects,
  moreHref,
  cardHref,
  footer,
}: {
  projects: Project[];
  moreHref?: string;
  /** カードを普通にクリックしたときの移動先 */
  cardHref?: string;
  footer?: React.ReactNode;
}) {
  const list = useRef<HTMLUListElement>(null);
  const router = useRouter();
  useDragScroll(list);

  // カードの何もない所をクリック → 作品一覧ページへ（カードの中のリンクやボタンを押したときは、そちらを優先）
  // ドラッグしたあとのクリックは useDragScroll が止めるので、ここには来ない
  const openCard = (e: React.MouseEvent) => {
    if (!cardHref || (e.target as Element).closest("a, button")) return;
    router.push(cardHref);
  };

  // 1枚の幅（スマホ 1つ・タブレット 2つ・PC 3つが見える幅）
  const item = "w-[85%] shrink-0 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]";
  return (
    <Reveal>
      <ul
        ref={list}
        // キーボードでもフォーカスして ←→ で動かせるように
        tabIndex={0}
        // リンクや画像を掴んだときのブラウザ標準のドラッグ（ゴースト画像）を出さない
        onDragStart={(e) => e.preventDefault()}
        aria-label="作品（横にスクロールできます）"
        className={cn(
          "flex gap-6 overflow-x-auto overscroll-x-contain",
          // カードのホバーで浮く分だけ上下に余白（切れないように）
          "-my-2 py-2 [scrollbar-width:thin]",
          // マウスで掴めることがわかるカーソル（ドラッグ中は data-dragging で「掴んでいる」形）
          "cursor-grab data-[dragging=true]:cursor-grabbing data-[dragging=true]:select-none",
        )}
      >
        {projects.map((p) => (
          <li key={p.slug} className={item} onClick={openCard}>
            <ProjectCard project={p} />
          </li>
        ))}
        {/* 一番最後：作品一覧ページへの「＋ MORE」カード（高さはほかのカードにそろう） */}
        {moreHref && (
          <li className={item}>
            <Link
              href={moreHref}
              className="group flex h-full min-h-56 flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/40 bg-card/50 p-6 text-primary transition duration-300 hover:-translate-y-1 hover:bg-card active:scale-95"
            >
              <span className="pixel-circle bg-pop-gradient inline-flex size-14 items-center justify-center">
                <Plus className="size-7 group-hover:animate-wiggle" strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="font-pixel text-h3">MORE</span>
            </Link>
          </li>
        )}
      </ul>

      {footer && <div className="mt-heading flex justify-end">{footer}</div>}
    </Reveal>
  );
}

/** これ以上動かしたら「ドラッグ」とみなす距離（px）。それより小さければ普通のクリック */
const DRAG_THRESHOLD = 6;

/**
 * マウスで押したまま横にドラッグしてスクロールする（右ボタン・左ボタンどちらでも）。
 * - 離した位置でそのまま止まる
 * - ドラッグしたあとは、リンクのクリックと右クリックのメニューを出さない（押して離しただけなら普通に動く）
 * - タッチ操作はブラウザ標準のスワイプのまま（ここではマウスだけ扱う）
 */
function useDragScroll(ref: React.RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pressed = false;
    let dragging = false;
    let justDragged = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || (e.button !== 0 && e.button !== 2)) return;
      pressed = true;
      dragging = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };

    const onMove = (e: PointerEvent) => {
      if (!pressed) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) < DRAG_THRESHOLD) return;
      if (!dragging) {
        dragging = true;
        el.dataset.dragging = "true";
      }
      el.scrollLeft = startScroll - dx;
    };

    const onUp = () => {
      if (!pressed) return;
      pressed = false;
      if (!dragging) return;
      dragging = false;
      justDragged = true;
      delete el.dataset.dragging;
      // このあとに来るクリック・右クリックメニューは止める（次の操作には影響させない）
      window.setTimeout(() => {
        justDragged = false;
      }, 0);
    };

    // ドラッグしたあとのクリック（リンクが開く）と右クリックメニューを止める
    const stopIfDragged = (e: Event) => {
      if (!justDragged) return;
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", stopIfDragged, true);
    el.addEventListener("contextmenu", stopIfDragged, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", stopIfDragged, true);
      el.removeEventListener("contextmenu", stopIfDragged, true);
    };
  }, [ref]);
}
