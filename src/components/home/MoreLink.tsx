import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** セクション見出しの右に置く「More」リンク */
export function MoreLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="menu-cursor pixel-chip group inline-flex items-center gap-1 px-3 py-1.5 font-bold text-primary transition hover:-translate-y-0.5 hover:bg-secondary active:scale-95"
    >
      More
      <ArrowRight className="size-4 group-hover:animate-wiggle" aria-hidden="true" />
    </Link>
  );
}
