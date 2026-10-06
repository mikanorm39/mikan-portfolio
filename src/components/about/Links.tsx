import { ArrowUpRight } from "lucide-react";
import { socialIcons } from "@/components/icons/BrandIcons";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";

export function Links() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading title="Links" emoji="🔗" />
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-3">
        {profile.social.map((s) => {
          const Icon = socialIcons[s.id];
          return (
            <RevealItem as="li" key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl bg-card p-5 shadow-pop ring-1 ring-border transition duration-300 hover:-translate-y-1 hover:shadow-pop-lg active:scale-95"
              >
                <span className="bg-pop-gradient inline-flex size-12 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-6 group-hover:animate-wiggle" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-lg font-extrabold">{s.label}</span>
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
