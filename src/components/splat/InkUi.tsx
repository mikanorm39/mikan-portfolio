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
  children,
  className,
}: {
  color: InkColor;
  shape?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(styles.root, styles.wrap, className)}>
      <span className={styles.behind} aria-hidden="true">
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
