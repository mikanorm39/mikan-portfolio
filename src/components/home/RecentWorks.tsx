import { SectionHeading } from "@/components/SectionHeading";
import { getHomeWorks } from "@/lib/getWorks";
import { MoreButton } from "./MoreButton";
import { WorkCarousel } from "./WorkCarousel";

/** トップに出す作品の数（featured の作品が先）。残りは /work で見てもらう */
const RECENT_COUNT = 5;

export async function RecentWorks() {
  // 作品は microCMS から取得（ビルド時）
  const recent = await getHomeWorks(RECENT_COUNT);

  // id="work"：トップのメニューの WORK からここへスクロールする
  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Work" ink={{ id: "work", color: "pink" }} />
      {/* 作品は横スクロールで見る（カードを押すと詳細ページ、最後に「＋ MORE」カード）。右下に、作品一覧ページへの「MORE →」 */}
      <WorkCarousel works={recent} moreHref="/work" footer={<MoreButton href="/work" className="flex" />} />
    </section>
  );
}
