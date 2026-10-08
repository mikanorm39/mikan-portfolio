import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InkBehind } from "@/components/splat/InkUi";

/** セクション見出しの右に置く「MORE」リンク */
export function MoreLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="ink-cursor-host pixel-chip font-pixel group relative inline-flex items-center gap-1 px-3 py-1.5 font-bold text-on-bg transition hover:-translate-y-0.5 hover:text-pop-foreground focus-visible:text-pop-foreground active:scale-95"
    >
      {/* ホバー・フォーカスで文字の後ろに黄色のインクが着弾（文字は濃い紫に変わって読みやすく） */}
      <InkBehind color="yellow">MORE</InkBehind>
      <ArrowRight className="size-4 group-hover:animate-wiggle" aria-hidden="true" />
    </Link>
  );
}
