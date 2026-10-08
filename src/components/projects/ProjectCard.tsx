import { Badge } from "@/components/ui/badge";
import { formatYearMonth, projectCategoryLabels, projectTeamLabels, type Project } from "@/data/projects";
import { ProjectThumbnail } from "./ProjectThumbnail";

/** headingLevel: 一覧ページでは h1 の直下なので h2、トップでは h2 セクション内なので h3 */
type Props = { project: Project; headingLevel?: "h2" | "h3"; priority?: boolean };

export function ProjectCard({ project, headingLevel = "h3", priority = false }: Props) {
  const Heading = headingLevel;
  return (
    <article className="pixel-box holo-hover group flex h-full flex-col overflow-hidden bg-card transition duration-300 hover:-translate-y-1">
      <ProjectThumbnail project={project} priority={priority} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <time dateTime={project.date} className="text-sm font-bold text-muted-foreground">
            {formatYearMonth(project.date)}
          </time>
          {project.categories.map((c) => (
            <Badge key={c} className="pixel-chip rounded-none bg-primary px-2.5 text-primary-foreground">
              {projectCategoryLabels[c]}
            </Badge>
          ))}
          <Badge variant="secondary" className="pixel-chip rounded-none px-2.5">
            {projectTeamLabels[project.team]}
          </Badge>
        </div>

        <Heading className="font-heading text-h3 font-extrabold">{project.title}</Heading>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <ul className="flex flex-wrap gap-1.5" aria-label="使った技術">
          {project.tech.map((t) => (
            <li key={t} className="pixel-chip bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
