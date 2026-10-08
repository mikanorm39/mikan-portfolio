import { CodeXml, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatYearMonth, projectCategoryLabels, projectTeamLabels, type Project } from "@/data/projects";
import { ProjectThumbnail } from "./ProjectThumbnail";

const linkMeta = [
  { key: "site", label: "サイト", Icon: ExternalLink },
  { key: "code", label: "コード", Icon: CodeXml },
  { key: "article", label: "記事", Icon: FileText },
] as const;

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

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {linkMeta.map(({ key, label, Icon }) => {
            const href = project.links[key];
            if (!href) return null;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} の${label}を開く（新しいタブ）`}
                className="pixel-button group/link inline-flex items-center gap-1.5 border px-3.5 py-1.5 text-sm font-bold text-primary hover:bg-secondary"
              >
                <Icon className="size-4 group-hover/link:animate-wiggle" aria-hidden="true" />
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
}
