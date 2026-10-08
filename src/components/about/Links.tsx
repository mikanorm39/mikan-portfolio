import { ArrowUpRight } from "lucide-react";
import { socialIcons } from "@/components/icons/BrandIcons";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";

export function Links() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Links" ink={{ id: "links", color: "cyan", trigger: "tap" }} />
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-3">
        {profile.social.map((s) => {
          const Icon = socialIcons[s.id];
          return (
            <RevealItem as="li" key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-box group flex items-center gap-4 bg-card p-5 transition duration-300 hover:-translate-y-1 active:scale-95"
              >
                <span className="pixel-circle bg-pop-gradient inline-flex size-12 shrink-0 items-center justify-center">
                  <Icon className="size-6 group-hover:animate-wiggle" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-h3 font-extrabold">{s.label}</span>
                  <span className="block text-sm text-muted-foreground">{s.note}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="sr-only">（新しいタブで開く）</span>
              </a>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
