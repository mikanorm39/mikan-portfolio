import { ArrowUpRight, FileText, Globe } from "lucide-react";
import { GitHubIcon } from "@/components/icons/BrandIcons";
import type { WorkLink } from "@/lib/works";

/** リンクの種類ごとのアイコン */
const icons = {
  site: Globe,
  github: GitHubIcon,
  article: FileText,
} as const;

/** 外部リンクのボタン（作品サイト・GitHub・記事など）。新しいタブで開く */
export function WorkLinks({ links }: { links: WorkLink[] }) {
  return (
    <ul className="flex flex-wrap gap-4">
      {links.map((l) => {
        const Icon = icons[l.type];
        return (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-button bg-pop-gradient group inline-flex items-center gap-2.5 px-6 py-3 font-bold"
            >
              <Icon className="size-5 group-hover:animate-wiggle" aria-hidden="true" />
              {l.label}
              <ArrowUpRight className="size-4" strokeWidth={3} aria-hidden="true" />
              <span className="sr-only">（新しいタブで開く）</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
