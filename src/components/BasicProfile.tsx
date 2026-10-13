import { profile } from "@/data/profile";

/** 名前の下に並べるプロフィールの項目 */
const facts = [
  { label: "大学", value: profile.university },
  { label: "学部学科", value: profile.department },
  { label: "卒業予定年", value: profile.graduationYear },
  { label: "所属", value: profile.club },
  { label: "チーム開発経験", value: profile.teamDevCount },
];

/** 基本プロフィール（名前＋項目）。トップの About と About ページの Profile で共通 */
export function BasicProfile() {
  return (
    <>
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
    </>
  );
}
