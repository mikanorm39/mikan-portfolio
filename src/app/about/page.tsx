import type { Metadata } from "next";
import { Suspense } from "react";
import { Links } from "@/components/about/Links";
import { Profile } from "@/components/about/Profile";
import { Vision } from "@/components/about/Vision";
import { CareerExplorer } from "@/components/career/CareerExplorer";
import { CareerTimeline } from "@/components/career/CareerTimeline";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getSortedCareer } from "@/data/career";

const description = "プロフィール・目指していること・これまでの活動をまとめています。";
/** ページに表示する紹介文（句点なし） */
const intro = "プロフィール・目指していること・これまでの活動をまとめています";

export const metadata: Metadata = {
  title: "About",
  description,
  openGraph: { title: "About", description, url: "/about" },
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const items = getSortedCareer();

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-section sm:px-6">
        {/* ページを開いたら、大見出しにミントのインクが着弾する */}
        <SectionHeading as="h1" title="About" ink={{ id: "about-page", color: "mint" }} />
        {/* 紹介文は、ほかのセクションと同じ白い枠の中に（大きめ・太字） */}
        <Reveal className="pixel-box bg-card p-6 sm:p-8">
          <p className="text-lg font-bold sm:text-xl">{intro}</p>
        </Reveal>
      </div>
      <Profile />
      <Vision />
      {/* 見出しの左端をほかのセクションとそろえ、タイムラインは読みやすい幅にする */}
      <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
        {/* About ページの章見出しは、タップするとインクが着弾する */}
        <SectionHeading
          title="Career"
          description="サークル・イベント・開発・受賞などを時系列で。"
          ink={{ id: "career", color: "mint", trigger: "tap" }}
        />
        {/* クエリ（?tag=）を読むのはクライアント側。静的生成時は全件を出しておく */}
        <div className="max-w-4xl">
          <Suspense fallback={<CareerTimeline items={items} />}>
            <CareerExplorer items={items} />
          </Suspense>
        </div>
      </section>
      <Links />
    </>
  );
}
