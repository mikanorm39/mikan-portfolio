import { BasicProfile } from "@/components/BasicProfile";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";

export function Profile() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Profile" ink={{ color: "yellow", trigger: "tap" }} />
      <Reveal className="pixel-box bg-card p-6 sm:p-8">
        {/* 上に基本プロフィール（トップの About と同じ） */}
        <BasicProfile />
        <p className="mt-6 border-t-2 border-dashed border-primary/30 pt-5 leading-loose">{profile.intro}</p>
      </Reveal>
    </section>
  );
}
