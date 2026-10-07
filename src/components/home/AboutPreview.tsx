import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";
import { MoreLink } from "./MoreLink";

/** トップ用の短い自己紹介。詳しい内容は /about にまとめる */
export function AboutPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading title="About" emoji="😺" action={<MoreLink href="/about" />} />
      <Reveal className="pixel-box bg-card p-6 sm:p-8">
        <p className="font-heading text-lg font-bold text-primary">{profile.affiliation}</p>
        <p className="mt-3 leading-loose">{profile.catchCopy}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2" aria-label="肩書き">
            {profile.titles.map((t) => (
              <li key={t} className="pixel-chip bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground">
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="pixel-button bg-pop-gradient font-pixel group inline-flex items-center gap-2 px-6 py-3"
          >
            MORE
            <ArrowRight className="size-4 group-hover:animate-wiggle" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
