"use client";

import { useMemo } from "react";
import type { Project } from "@/data/projects";
import { useQueryState } from "@/lib/useQueryState";
import { categoryFilterValues, ProjectFilter, teamFilterValues } from "./ProjectFilter";
import { ProjectGrid } from "./ProjectGrid";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useQueryState("category", categoryFilterValues, "all");
  const [team, setTeam] = useQueryState("team", teamFilterValues, "all");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) => (category === "all" || p.categories.includes(category)) && (team === "all" || p.team === team),
      ),
    [projects, category, team],
  );

  return (
    <div className="flex flex-col gap-8">
      <ProjectFilter category={category} team={team} onCategoryChange={setCategory} onTeamChange={setTeam} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} 件の作品
      </p>
      <ProjectGrid projects={filtered} />
    </div>
  );
}
