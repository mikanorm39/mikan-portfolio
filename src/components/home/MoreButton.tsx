import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * セクションの右下に置く、目立つ黄色の「MORE →」ボタン。
 * 矢印は線を太くして、太字に見えるようにしている。
 */
export function MoreButton({ href, className }: { href: string; className?: string }) {
  return (
    // className：置き場所に合わせた余白など（指定がなければ、セクションの右下に置く）
    <div className={className ?? "mt-heading flex justify-end"}>
      <Link
        href={href}
        // 文字はスマホ 22px 〜 PC 28px。矢印は文字の大きさに合わせて大きくなる
        className="pixel-button bg-pop-gradient font-pixel group inline-flex items-center gap-2.5 px-9 py-4 text-[clamp(1.375rem,1.1rem+1vw,1.75rem)]"
      >
        MORE
        <ArrowRight className="size-[1.1em] group-hover:animate-wiggle" strokeWidth={3.25} aria-hidden="true" />
      </Link>
    </div>
  );
}
