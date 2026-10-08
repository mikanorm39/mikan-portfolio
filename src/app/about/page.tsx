import type { Metadata } from "next";
import { Suspense } from "react";
import { Links } from "@/components/about/Links";
import { Profile } from "@/components/about/Profile";
import { Vision } from "@/components/about/Vision";
import { CareerExplorer } from "@/components/career/CareerExplorer";
import { CareerTimeline } from "@/components/career/CareerTimeline";
import { SectionHeading } from "@/components/SectionHeading";
import { getSortedCareer } from "@/data/career";

const description = "プロフィール・目指していること・これまでの活動をまとめています。";

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
        <SectionHeading as="h1" title="About" description={description} className="mb-0" />
      </div>
      <Profile />
      <Vision />
      {/* 見出しの左端をほかのセクションとそろえ、タイムラインは読みやすい幅にする */}
      <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
        <SectionHeading title="Career" description="学業・コミュニティ・イベント・受賞などを時系列で。" />
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
