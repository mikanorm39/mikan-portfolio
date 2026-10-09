import { careerTagLabels, type CareerTag } from "@/lib/career";
import { cn } from "@/lib/utils";

export function CareerTagBadge({ tag }: { tag: CareerTag }) {
  return (
    <span
      className={cn(
        "pixel-chip inline-flex px-2.5 py-0.5 text-xs font-bold",
        tag === "award" ? "bg-award text-award-foreground" : "bg-secondary text-secondary-foreground",
      )}
    >
      {/* 種類はハッシュタグの形で表示する（例：#イベント） */}
      #{careerTagLabels[tag]}
    </span>
  );
}
