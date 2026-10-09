import Link from "next/link";
import { InkBehind } from "@/components/splat/InkUi";
import type { InkColor } from "@/components/splat/splatConfig";
import { workCategoryLabels, type Work } from "@/lib/works";
import { WorkThumbnail } from "./WorkThumbnail";

/** 作品名の後ろに付くインクの色（作品ごとに決まった色になる） */
const INK_COLORS: InkColor[] = ["pink", "yellow", "mint", "cyan", "orange"];
const colorOf = (slug: string) => INK_COLORS[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % INK_COLORS.length];

/** headingLevel: 一覧ページでは h1 の直下なので h2、トップでは h2 セクション内なので h3 */
type Props = { work: Work; headingLevel?: "h2" | "h3"; priority?: boolean };

/**
 * 作品カード。カード全体が詳細ページ（/work/作品のslug）へのリンク。
 * - ホバー・キーボードのフォーカスで、枠がホログラムになり、作品名の後ろにインクが付く
 */
export function WorkCard({ work, headingLevel = "h3", priority = false }: Props) {
  const Heading = headingLevel;
  const color = colorOf(work.slug);

  return (
    <Link
      href={`/work/${work.slug}`}
      className="ink-cursor-host pixel-box holo-hover group flex h-full flex-col overflow-hidden bg-card transition duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
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
    </Link>
  );
}
