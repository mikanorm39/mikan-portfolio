import { cn } from "@/lib/utils";
import { InkSplat } from "./InkSplat";
import type { InkColor } from "./splatConfig";
import styles from "./InkUi.module.css";

/**
 * 文字の真ん中の後ろに付くインク（ホバー・キーボードのフォーカス・選択中に着弾する）。
 * 親（リンク）に class="ink-cursor-host" を付けると、ホバー・:focus-visible・data-selected="true" のときに表示される。
 * 文字の位置は動かない（インクは文字の後ろに重なるだけ）。
 */
export function InkBehind({
  color,
  shape = 0,
  faint = false,
  children,
  className,
}: {
  color: InkColor;
  shape?: number;
  /** true = ナビの選択されていない項目と同じく、小さく半透明で出す（選択中の状態がない外部リンクなど） */
  faint?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(styles.root, styles.wrap, className)}>
      <span className={cn(styles.behind, faint && styles.faint)} aria-hidden="true">
        <InkSplat size="sm" crop stretch shape={shape} color={color} />
      </span>
      {children}
    </span>
  );
}

/**
 * ナビの文字の後ろに付くインク。active のあいだは着弾して残り、外れると縮んで消える。
 * 親の要素には relative と isolate（重なり順をその中に閉じる）、ホバーのプレビュー用にリンクへ class="ink-nav-host" を付ける。
 */
export function NavInk({ color, active, shape = 1 }: { color: InkColor; active: boolean; shape?: number }) {
  return (
    <span className={cn(styles.root, styles.navInk, active && styles.navInkOn)} aria-hidden="true">
      <InkSplat size="sm" crop stretch shape={shape} color={color} />
    </span>
  );
}

/**
 * 文字の下に引くインクのアンダーライン（筆でさっと引いたような線＋小さなしずく）。
 * 文字の幅に合わせて伸びる。見出しを目立たせたいときに使う。
 */
export function InkUnderline({
  color,
  children,
  className,
}: {
  color: InkColor;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative isolate inline-block", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 16"
        preserveAspectRatio="none"
        className="absolute -inset-x-1.5 -bottom-2 -z-10 h-[0.9em] w-[calc(100%+0.75rem)]"
        style={{ fill: `var(--ink-${color})` }}
      >
        {/* 筆の線（左は太く、右へ行くほどかすれて細くなる） */}
        <path d="M1 7.5C6 4 18 3.2 32 3.6 50 4 70 3 86 3.8c6 .3 10 1.2 12.5 2.6.9.6.4 1.6-.8 1.7-5 .5-11 .2-18 .5-16 .6-36 2.6-54 3.8-8 .5-15 .9-19.6.6C.4 11.9-.6 9.3 1 7.5Z" />
        {/* しずく */}
        <ellipse cx="24" cy="14" rx="1.6" ry="1.8" />
        <ellipse cx="91" cy="11" rx="1.1" ry="1.3" />
      </svg>
      {children}
    </span>
  );
}
