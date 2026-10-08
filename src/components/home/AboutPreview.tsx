import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";
import { MoreButton } from "./MoreButton";

/** トップ用の短い自己紹介。詳しい内容は /about にまとめる */
export function AboutPreview() {
  // id="about"：トップのメニューの ABOUT からここへスクロールする
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="About" ink={{ id: "about", color: "mint" }} />
      <Reveal className="pixel-box bg-card p-6 sm:p-8">
        <p className="font-heading text-h3 font-bold text-primary">{profile.affiliation}</p>
        <p className="mt-3 leading-loose">{profile.catchCopy}</p>
        <div className="mt-6">
          <ul className="flex flex-wrap gap-2" aria-label="肩書き">
            {profile.titles.map((t) => (
              <li key={t} className="pixel-chip bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      {/* 右下に、About ページへの「MORE →」 */}
      <MoreButton href="/about" />
    </section>
  );
}
