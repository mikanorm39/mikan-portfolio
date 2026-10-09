"use client";

import { FilterPills, type FilterOption } from "@/components/FilterPills";
import { workCategories, workCategoryLabels, workTeamLabels, type WorkCategory, type WorkTeam } from "@/lib/works";

export type CategoryFilter = WorkCategory | "all";
export type TeamFilter = WorkTeam | "all";

export const categoryFilterValues: CategoryFilter[] = ["all", ...workCategories];
export const teamFilterValues: TeamFilter[] = ["all", "solo", "team"];

const categoryOptions: FilterOption<CategoryFilter>[] = [
  { value: "all", label: "すべて" },
  ...workCategories.map((c) => ({ value: c, label: workCategoryLabels[c] })),
];

const teamOptions: FilterOption<TeamFilter>[] = [
  { value: "all", label: "どちらも" },
  { value: "solo", label: workTeamLabels.solo },
  { value: "team", label: workTeamLabels.team },
];

type Props = {
  category: CategoryFilter;
  team: TeamFilter;
  onCategoryChange: (v: CategoryFilter) => void;
  onTeamChange: (v: TeamFilter) => void;
};

export function WorkFilter({ category, team, onCategoryChange, onTeamChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="shrink-0 text-sm font-bold text-on-bg sm:w-20">種類</span>
        <FilterPills label="種類" options={categoryOptions} value={category} onChange={onCategoryChange} />
      </div>
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="shrink-0 text-sm font-bold text-on-bg sm:w-20">開発形態</span>
        <FilterPills label="開発形態" options={teamOptions} value={team} onChange={onTeamChange} />
      </div>
    </div>
  );
}
