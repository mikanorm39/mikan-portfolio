import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";

export function Vision() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Vision" ink={{ color: "pink", trigger: "tap" }} />
      <Reveal className="pixel-box holo-border bg-card px-6 py-12 text-center sm:px-10">
        {/* 上に大きく見出し、下に目指していること */}
        <p className="font-heading text-h2 leading-relaxed font-extrabold">
          <span className="text-pop-gradient">{profile.visionTitle}</span>
        </p>
        <p className="mt-6 text-lead leading-relaxed font-bold text-foreground">{profile.vision}</p>
      </Reveal>
    </section>
  );
}
