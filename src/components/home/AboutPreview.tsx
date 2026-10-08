import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";
import { MoreButton } from "./MoreButton";

/** 名前の下に並べるプロフィールの項目 */
const facts = [
  { label: "大学", value: profile.university },
  { label: "学部学科", value: profile.department },
  { label: "卒業予定年", value: profile.graduationYear },
  { label: "所属", value: profile.club },
  { label: "チーム開発経験", value: profile.teamDevCount },
];

/** トップ用の短い自己紹介。詳しい内容は /about にまとめる */
export function AboutPreview() {
  // id="about"：トップのメニューの ABOUT からここへスクロールする
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="About" ink={{ id: "about", color: "mint" }} />
      <Reveal className="pixel-box bg-card p-6 sm:p-8">
        {/* 名前（姓・名それぞれの上にふりがな） */}
        <p className="font-heading text-h2 font-bold text-primary">
          {/* 読み上げでは「西岡 未栞」とまとめて読む（ふりがなを重ねて読まないように） */}
          <span className="sr-only">{profile.fullName}</span>
          {profile.fullNameRuby.map(({ text, ruby }, i) => (
            <span key={text} aria-hidden="true">
              {i > 0 && " "}
              <ruby>
                {text}
                <rt className="text-[0.4em] font-bold tracking-widest">{ruby}</rt>
              </ruby>
            </span>
          ))}
        </p>

        {/* 項目名と内容（スマホでは縦に、PC では横に並べる） */}
        <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
          {facts.map(({ label, value }) => (
            <div key={label} className="grid gap-y-1 sm:col-span-2 sm:grid-cols-subgrid sm:items-baseline">
              <dt className="text-sm font-bold text-muted-foreground">{label}</dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
        </dl>

        {/* 一言 */}
        <div className="mt-6 border-t-2 border-dashed border-primary/30 pt-5">
          <p className="text-lg leading-relaxed font-bold text-primary sm:text-xl">{profile.oneLiner}</p>
        </div>
      </Reveal>
      {/* 右下に、About ページへの「MORE →」 */}
      <MoreButton href="/about" />
    </section>
  );
}
