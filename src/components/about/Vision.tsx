import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";

export function Vision() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Vision" ink={{ color: "pink", trigger: "tap" }} />
      <Reveal className="pixel-box holo-border bg-card px-6 py-12 text-center sm:px-10">
        <p className="font-heading text-h2 leading-relaxed font-extrabold">
          <span className="text-pop-gradient">{profile.vision}</span>
          <span className="block text-lead text-foreground sm:inline sm:text-h2">を目指しています</span>
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
