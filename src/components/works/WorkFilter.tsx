"use client";

import { FilterPills, type FilterOption } from "@/components/FilterPills";
import { projectCategories, projectCategoryLabels, projectTeamLabels, type ProjectCategory } from "@/data/projects";

export type CategoryFilter = ProjectCategory | "all";
export type TeamFilter = "solo" | "team" | "all";

export const categoryFilterValues: CategoryFilter[] = ["all", ...projectCategories];
export const teamFilterValues: TeamFilter[] = ["all", "solo", "team"];

const categoryOptions: FilterOption<CategoryFilter>[] = [
  { value: "all", label: "すべて" },
  ...projectCategories.map((c) => ({ value: c, label: projectCategoryLabels[c] })),
];

const teamOptions: FilterOption<TeamFilter>[] = [
  { value: "all", label: "どちらも" },
  { value: "solo", label: projectTeamLabels.solo },
  { value: "team", label: projectTeamLabels.team },
];

type Props = {
  category: CategoryFilter;
  team: TeamFilter;
  onCategoryChange: (v: CategoryFilter) => void;
  onTeamChange: (v: TeamFilter) => void;
};

export function ProjectFilter({ category, team, onCategoryChange, onTeamChange }: Props) {
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
