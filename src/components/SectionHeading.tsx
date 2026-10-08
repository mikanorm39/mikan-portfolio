import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  title: string;
  description?: string;
  /** 見出しの右側に置くもの（「すべて見る」リンクなど） */
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
};

/** 章見出し。文字サイズ（text-h1 / text-h2）と下の余白（mb-heading）は globals.css のタイプスケールを使う */
export function SectionHeading({ title, description, action, as: Tag = "h2", className }: Props) {
  return (
    <Reveal className={cn("mb-heading flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <Tag
          className={cn(
            "pixel-heading font-heading leading-tight font-extrabold tracking-wide",
            Tag === "h1" ? "text-h1" : "text-h2",
          )}
        >
          <span className="ink-heading font-section">{title}</span>
        </Tag>
        {description && <p className="mt-2 text-on-bg-muted">{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
