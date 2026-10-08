import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  title: string;
  emoji?: string;
  description?: string;
  /** 見出しの右側に置くもの（「すべて見る」リンクなど） */
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ title, emoji, description, action, as: Tag = "h2", className }: Props) {
  return (
    <Reveal className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <Tag
          className={cn(
            "pixel-heading font-heading font-extrabold tracking-wide",
            Tag === "h1" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          )}
        >
          <span className="ink-heading font-section">{title}</span>
          {emoji && (
            <span className="ml-2 inline-block hover:animate-wiggle" aria-hidden="true">
              {emoji}
            </span>
          )}
        </Tag>
        {description && <p className="mt-2 text-on-bg-muted">{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
