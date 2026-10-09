import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkGrid } from "@/components/works/WorkGrid";
import { WorksExplorer } from "@/components/works/WorksExplorer";
import { SectionHeading } from "@/components/SectionHeading";
import { getSortedWorks } from "@/lib/getWorks";

const description = "これまでに作ったゲーム・Web・グラフィック・記事などの作品一覧です。種類や開発形態で絞り込めます。";

export const metadata: Metadata = {
  title: "Work",
  description,
  openGraph: { title: "Work", description, url: "/work" },
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  // 作品は microCMS から取得（ビルド時）
  const works = await getSortedWorks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      {/* ページを開いたら、大見出しにピンクのインクが着弾する */}
      <SectionHeading as="h1" title="Work" description={description} ink={{ color: "pink" }} />
      {/* クエリ（?category=）を読むのはクライアント側。静的生成時は全件を出しておく */}
      <Suspense fallback={<WorkGrid works={works} />}>
        <WorksExplorer works={works} />
      </Suspense>
    </div>
  );
}
