"use client";

import { useMemo } from "react";
import type { CareerItem } from "@/data/career";
import { useQueryState } from "@/lib/useQueryState";
import { CareerFilter, careerFilterValues } from "./CareerFilter";
import { CareerTimeline } from "./CareerTimeline";

export function CareerExplorer({ items }: { items: CareerItem[] }) {
  const [tag, setTag] = useQueryState("tag", careerFilterValues, "all");

  const filtered = useMemo(
    () => (tag === "all" ? items : items.filter((item) => item.tags.includes(tag))),
    [items, tag],
  );

  return (
    <div className="flex flex-col gap-8">
      <CareerFilter value={tag} onChange={setTag} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} 件の活動
      </p>
      <CareerTimeline items={filtered} />
    </div>
  );
}
