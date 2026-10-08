import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** セクション見出しの右に置く「MORE」リンク */
export function MoreLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="menu-cursor pixel-chip font-pixel group inline-flex items-center gap-1 px-3 py-1.5 font-bold text-on-bg transition hover:-translate-y-0.5 hover:bg-white/15 active:scale-95"
    >
      MORE
      <ArrowRight className="size-4 group-hover:animate-wiggle" aria-hidden="true" />
    </Link>
  );
}
