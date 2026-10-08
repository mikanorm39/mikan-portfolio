import { SectionHeading } from "@/components/SectionHeading";
import { getSortedProjects } from "@/data/projects";
import { MoreButton } from "./MoreButton";
import { ProjectCarousel } from "./ProjectCarousel";

/** トップに出す作品の数。これより古いものは /work で見てもらう */
const RECENT_COUNT = 5;

export function RecentProjects() {
  const recent = getSortedProjects().slice(0, RECENT_COUNT);

  // id="work"：トップのメニューの WORK からここへスクロールする
  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Work" ink={{ id: "work", color: "pink" }} />
      {/* 作品は横スクロールで見る（最後に「＋ MORE」カード）。右下に、作品一覧ページへの「MORE →」 */}
      <ProjectCarousel projects={recent} moreHref="/work" cardHref="/work" footer={<MoreButton href="/work" className="flex" />} />
    </section>
  );
}
