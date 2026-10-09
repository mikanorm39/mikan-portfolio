"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InkBehind } from "@/components/splat/InkUi";
import { InkSplat } from "@/components/splat/InkSplat";
import type { InkColor } from "@/components/splat/splatConfig";
import { workCategoryLabels, type Work } from "@/lib/works";
import { WorkThumbnail } from "./WorkThumbnail";
import styles from "./WorkCard.module.css";

/** 押してから詳細ページへ切り替わるまで（インクが広がる時間。WorkCard.module.css の --card-splash-ms と合わせる） */
const SPLASH_MS = 320;

/** カードごとのインクの色（作品ごとに決まった色になる） */
const SPLASH_COLORS: InkColor[] = ["pink", "yellow", "mint", "cyan", "orange"];
const colorOf = (slug: string) => SPLASH_COLORS[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % SPLASH_COLORS.length];

/** headingLevel: 一覧ページでは h1 の直下なので h2、トップでは h2 セクション内なので h3 */
type Props = { work: Work; headingLevel?: "h2" | "h3"; priority?: boolean };

/**
 * 作品カード。カード全体が詳細ページ（/work/作品のslug）へのリンク。
 * - ホバー・キーボードのフォーカスで、枠がホログラムになり、作品名の後ろにインクが付く
 * - 押すとカードにインクが「びちゃっ」と広がってから詳細ページへ（動きを減らす設定・新しいタブで開くときは、すぐ移動）
 */
export function WorkCard({ work, headingLevel = "h3", priority = false }: Props) {
  const Heading = headingLevel;
  const router = useRouter();
  const [splash, setSplash] = useState(false);
  const href = `/work/${work.slug}`;
  const color = colorOf(work.slug);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/⌘ ＋クリック（新しいタブ）などは、ブラウザの普通の動きのまま
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    if (splash) return;
    setSplash(true);
    window.setTimeout(() => router.push(href), SPLASH_MS);
    // 戻るボタンで戻ってきたとき用に、少しあとでインクを消しておく
    window.setTimeout(() => setSplash(false), SPLASH_MS + 800);
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className="ink-cursor-host pixel-box holo-hover group relative flex h-full flex-col overflow-hidden bg-card transition duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <WorkThumbnail work={work} priority={priority} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        {(work.categories.length > 0 || work.year) && (
          <div className="flex flex-wrap items-center gap-2">
            {work.categories.map((c) => (
              <span key={c} className="pixel-chip bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                {workCategoryLabels[c]}
              </span>
            ))}
            {work.year && <span className="text-sm font-bold text-muted-foreground">{work.year}</span>}
          </div>
        )}

        {/* 作品名：ホバー・フォーカスで後ろにインクが付く */}
        <Heading className="font-heading text-h3 font-extrabold">
          <InkBehind color={color}>{work.title}</InkBehind>
        </Heading>
        {work.summary && <p className="text-sm leading-relaxed text-muted-foreground">{work.summary}</p>}
      </div>

      {/* 押したときの「びちゃっ」 */}
      {splash && (
        <span className={styles.splash} aria-hidden="true">
          <InkSplat shape={work.slug.length} color={color} />
        </span>
      )}
    </Link>
  );
}
