import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getSortedProjects } from "@/data/projects";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { MoreLink } from "./MoreLink";

/** トップに出す作品の数。これより古いものは /work で見てもらう */
const RECENT_COUNT = 5;

export function RecentProjects() {
  const recent = getSortedProjects().slice(0, RECENT_COUNT);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading title="Work" emoji="🎨" action={<MoreLink href="/work" />} />
      <RevealGroup as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((p) => (
          <RevealItem as="li" key={p.slug}>
            <ProjectCard project={p} />
          </RevealItem>
        ))}
        <RevealItem as="li">
          <Link
            href="/work"
            className="group flex h-full min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-card/50 p-6 text-primary transition duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-pop-lg active:scale-95"
          >
            <span className="bg-pop-gradient inline-flex size-14 items-center justify-center rounded-full shadow-pop">
              <Plus className="size-7 group-hover:animate-wiggle" aria-hidden="true" />
            </span>
            <span className="font-heading text-lg font-extrabold">More</span>
          </Link>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
