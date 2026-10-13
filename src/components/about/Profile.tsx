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

      {/* 使用したことのあるソフト */}
      <Reveal className="pixel-box mt-6 bg-card p-6 sm:p-8">
        <h3 className="font-heading text-h3 font-bold text-primary">使用したことのあるソフト</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {profile.software.map((name) => (
            <li key={name} className="pixel-chip bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">
              {name}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
