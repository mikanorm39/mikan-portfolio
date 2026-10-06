import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";

export function Vision() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading title="Vision" emoji="🚀" />
      <Reveal className="pixel-box holo-border bg-card px-6 py-12 text-center sm:px-10">
        <p className="font-heading text-2xl leading-relaxed font-extrabold sm:text-4xl">
          <span className="text-pop-gradient">{profile.vision}</span>
          <span className="block text-lg text-foreground sm:inline sm:text-4xl">を目指しています</span>
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label="肩書き">
          {profile.titles.map((t) => (
            <li key={t} className="pixel-chip bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground">
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
