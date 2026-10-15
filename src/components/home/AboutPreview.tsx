import Link from "next/link";
import { BasicProfile } from "@/components/BasicProfile";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";
import { MoreButton } from "./MoreButton";

/** トップ用の短い自己紹介。詳しい内容は /about にまとめる */
export function AboutPreview() {
  // id="about"：/#about でこのセクションを直接開ける目印
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="About" ink={{ color: "mint" }} />
      <Reveal>
        {/* カード全体を押しても About ページへ移動する（作品カードと同じく、ホバーで少し浮いて枠がホログラムになる） */}
        <Link
          href="/about"
          className="pixel-box holo-hover block bg-card p-6 transition duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 active:scale-[0.99] sm:p-8"
        >
          <BasicProfile />

          {/* 一言 */}
          <div className="mt-6 border-t-2 border-dashed border-primary/30 pt-5">
            <p className="text-lg leading-relaxed font-bold text-primary sm:text-xl">{profile.oneLiner}</p>
          </div>
        </Link>
      </Reveal>
      {/* 右下に、About ページへの「MORE →」 */}
      <MoreButton href="/about" />
    </section>
  );
}
