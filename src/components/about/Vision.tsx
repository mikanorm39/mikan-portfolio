import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";

/** 文節ごとに折り返さないかたまり（inline-block）にして並べる。改行は文節と文節の間でだけ起こる */
function Phrases({ phrases }: { phrases: readonly string[] }) {
  return phrases.map((p) => (
    <span key={p} className="inline-block">
      {p}
    </span>
  ));
}

export function Vision() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Vision" ink={{ color: "pink", trigger: "tap" }} />
      <Reveal className="pixel-box holo-border bg-card px-6 py-12 text-center sm:px-10">
        {/* 上に大きく見出し、下に目指していること（どちらも文節の区切りでだけ改行し、行の長さをそろえる） */}
        <p className="font-heading text-h2 leading-relaxed font-extrabold text-balance">
          <span className="text-pop-gradient">
            <Phrases phrases={profile.visionTitle} />
          </span>
        </p>
        <p className="mt-6 text-lead leading-relaxed font-bold text-balance text-foreground">
          <Phrases phrases={profile.vision} />
        </p>
      </Reveal>
    </section>
  );
}
