import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";

/**
 * 文節ごとに折り返さないかたまり（inline-block）にして並べる。改行は文節と文節の間でだけ起こる。
 * wrap を渡すと、最初と最後の文節の外側に付ける（「～」など。文節と同じかたまりに入れて、それだけで改行されないように）
 */
function Phrases({ phrases, wrap }: { phrases: readonly string[]; wrap?: React.ReactNode }) {
  return phrases.map((p, i) => (
    <span key={p} className="inline-block">
      {i === 0 && wrap}
      {p}
      {i === phrases.length - 1 && wrap}
    </span>
  ));
}

export function Vision() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Vision" ink={{ color: "pink", trigger: "tap" }} />
      <Reveal className="pixel-box holo-border bg-card px-6 py-12 text-center sm:px-10">
        {/* 上に大きく見出し、下に目指していること（どちらも文節の区切りでだけ改行し、行の長さをそろえる） */}
        {/*
          スマホでは見出しを1行に収める：文字数（--title-chars）で画面の幅を割って文字の大きさを決める
          （6rem = セクションと枠の左右の余白。PC・タブレットの大きさ text-h2 を上限にする）
        */}
        <p
          className="font-heading text-h2 leading-relaxed font-extrabold text-balance max-sm:text-[length:min(var(--text-h2),calc((100vw-6rem)/var(--title-chars)))] max-sm:whitespace-nowrap"
          style={{ "--title-chars": profile.visionTitle.join("").length } as React.CSSProperties}
        >
          <span className="text-pop-gradient">
            {/* 両端の「～」は PC・タブレットだけ（スマホでは出さない） */}
            <Phrases
              phrases={profile.visionTitle}
              wrap={
                <span className="hidden sm:inline" aria-hidden="true">
                  ～
                </span>
              }
            />
          </span>
        </p>
        <p className="mt-6 text-lead leading-relaxed font-bold text-balance text-foreground">
          <Phrases phrases={profile.vision} />
        </p>
      </Reveal>
    </section>
  );
}
