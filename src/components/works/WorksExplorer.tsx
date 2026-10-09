"use client";

import { useMemo } from "react";
import type { Work } from "@/lib/works";
import { useQueryState } from "@/lib/useQueryState";
import { categoryFilterValues, teamFilterValues, WorkFilter } from "./WorkFilter";
import { WorkGrid } from "./WorkGrid";

export function WorksExplorer({ works }: { works: Work[] }) {
  const [category, setCategory] = useQueryState("category", categoryFilterValues, "all");
  const [team, setTeam] = useQueryState("team", teamFilterValues, "all");

  const filtered = useMemo(
    () =>
      works.filter(
        (w) => (category === "all" || w.categories.includes(category)) && (team === "all" || w.team === team),
      ),
    [works, category, team],
  );

  return (
    <div className="flex flex-col gap-8">
      <WorkFilter category={category} team={team} onCategoryChange={setCategory} onTeamChange={setTeam} />
      <p className="text-sm text-on-bg-muted" aria-live="polite">
        {filtered.length} 件の作品
      </p>
      <WorkGrid works={filtered} />
    </div>
  );
}
