import Link from "next/link";
import { InkBehind } from "@/components/splat/InkUi";
import type { Work } from "@/lib/works";
import { cn } from "@/lib/utils";
import { WorkThumbnail } from "../WorkThumbnail";

/** 詳細ページの一番下：「前の作品 / 次の作品」（一覧の並び順で前後。端の作品は片方だけ） */
export function WorkPager({ prev, next }: { prev?: Work; next?: Work }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="ほかの作品" className="grid gap-4 sm:grid-cols-2">
      {prev ? <PagerLink work={prev} dir="prev" /> : <span className="hidden sm:block" />}
      {next && <PagerLink work={next} dir="next" />}
    </nav>
  );
}

function PagerLink({ work, dir }: { work: Work; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  return (
    <Link
      href={`/work/${work.slug}`}
      className={cn(
        "ink-cursor-host pixel-box holo-hover group flex items-center gap-4 bg-card p-4 transition duration-300 hover:-translate-y-1 focus-visible:-translate-y-1",
        isNext && "flex-row-reverse text-right",
      )}
    >
      <WorkThumbnail work={work} sizes="128px" className="w-24 shrink-0 sm:w-32" />
      <span className="min-w-0 flex-1">
        {/* ゲームのメニュー風に ◀ ▶ */}
        <span className="block font-pixel text-sm text-primary">{isNext ? "NEXT ▶" : "◀ PREV"}</span>
        <span className="mt-1 block font-heading font-extrabold">
          <InkBehind color={isNext ? "cyan" : "pink"}>{work.title}</InkBehind>
        </span>
      </span>
    </Link>
  );
}
