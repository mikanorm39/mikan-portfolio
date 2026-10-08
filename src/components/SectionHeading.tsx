import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { HeadingInk } from "@/components/splat/HeadingInk";
import type { InkColor } from "@/components/splat/splatConfig";

type Props = {
  title: string;
  description?: string;
  /** 見出しの右側に置くもの（「すべて見る」リンクなど） */
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
  /** 指定すると、見出しが画面に入ったとき（またはトップのメニューから飛んできたとき）に文字の後ろへインクが着弾する。id はセクションの id */
  ink?: { id: string; color: InkColor };
};

/** 章見出し。文字サイズ（text-h1 / text-h2）と下の余白（mb-heading）は globals.css のタイプスケールを使う */
export function SectionHeading({ title, description, action, as: Tag = "h2", className, ink }: Props) {
  return (
    <Reveal className={cn("mb-heading flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <Tag
          className={cn(
            "pixel-heading font-heading leading-tight font-extrabold tracking-wide",
            Tag === "h1" ? "text-h1" : "text-h2",
          )}
        >
          {ink ? (
            // インクを文字の後ろに重ねるための入れ物
            <span className="heading-wobble relative isolate inline-block">
              <HeadingInk id={ink.id} color={ink.color} />
              <span className="ink-heading font-section">{title}</span>
            </span>
          ) : (
            // カーソルを合わせると、時計回り・反時計回りに交互に揺れる（pixel.css の .heading-wobble）
            <span className="heading-wobble ink-heading font-section">{title}</span>
          )}
        </Tag>
        {description && <p className="mt-2 text-on-bg-muted">{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
