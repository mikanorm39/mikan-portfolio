import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkGallery } from "@/components/works/detail/WorkGallery";
import { WorkLinks } from "@/components/works/detail/WorkLinks";
import { WorkPager } from "@/components/works/detail/WorkPager";
import { WorkRichText } from "@/components/works/detail/WorkRichText";
import { WorkVideo } from "@/components/works/detail/WorkVideo";
import { WorkThumbnail } from "@/components/works/WorkThumbnail";
import { getAdjacentWorks, getSortedWorks, getWork } from "@/lib/getWorks";
import { workCategoryLabels, workTeamLabels } from "@/lib/works";

/** microCMS にある作品だけ、ビルド時に詳細ページを作っておく（静的生成） */
export async function generateStaticParams() {
  return (await getSortedWorks()).map((w) => ({ slug: w.slug }));
}

/** microCMS にない slug は 404（ページが見つかりません）にする（作品を追加したら、再ビルドで反映される） */
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const work = await getWork((await params).slug);
  if (!work) return {};
  const description = work.summary ?? `${work.title} の作品紹介です。`;
  const url = `/work/${work.slug}`;
  return {
    title: work.title,
    description,
    // SNS で共有したときの画像：microCMS の画像 API で 1200×630 に切り抜く
    openGraph: {
      title: work.title,
      description,
      url,
      images: [{ url: `${work.thumbnail.url}?w=1200&h=630&fit=crop&fm=jpg`, width: 1200, height: 630 }],
    },
    alternates: { canonical: url },
  };
}

export default async function WorkDetailPage({ params }: PageProps<"/work/[slug]">) {
  const work = await getWork((await params).slug);
  if (!work) notFound();
  const { prev, next } = await getAdjacentWorks(work.slug);

  // 情報ボックスに出す項目（書いてある項目だけ）
  const info = [
    { label: "担当", value: work.role },
    { label: "期間", value: work.period },
    { label: "開発形態", value: work.team && workTeamLabels[work.team] },
  ].filter((i): i is { label: string; value: string } => Boolean(i.value));
  const hasInfo = info.length > 0 || work.tools.length > 0;

  return (
    <article className="mx-auto max-w-5xl px-4 pt-8 pb-section sm:px-6">
      {/* 1. 戻るボタン（ゲームのメニュー風） */}
      <Link
        href="/work"
        className="pixel-button bg-pop-gradient font-pixel group inline-flex items-center gap-2 px-5 py-2.5 text-lg"
      >
        <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">
          ◀
        </span>
        Work一覧へ
      </Link>

      {/* 2. タイトル・種類・制作年（ページを開いたら、作品名にピンクのインクが着弾する） */}
      <header className="mt-heading">
        <SectionHeading as="h1" title={work.title} ink={{ color: "pink" }} className="mb-4" />
        {(work.categories.length > 0 || work.year) && (
          <div className="flex flex-wrap items-center gap-2">
            {work.categories.map((c) => (
              <span key={c} className="pixel-chip bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                {workCategoryLabels[c]}
              </span>
            ))}
            {work.year && <span className="font-bold text-on-bg">{work.year}年</span>}
          </div>
        )}
      </header>

      {/* 3. メイン画像（大きく。最初に見える画像なので、すぐ読み込む） */}
      <WorkThumbnail
        work={work}
        priority
        zoomOnHover={false}
        sizes="(min-width: 1024px) 976px, 100vw"
        className="pixel-box mt-heading"
      />

      {/* 4. 情報ボックス（担当・期間・開発形態・使用ツール） */}
      {hasInfo && (
        <Reveal className="pixel-box holo-border mt-6 bg-card p-6 sm:p-8">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
            {info.map(({ label, value }) => (
              <div key={label} className="grid gap-y-1 sm:col-span-2 sm:grid-cols-subgrid sm:items-baseline">
                <dt className="text-sm font-bold text-muted-foreground">{label}</dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
            {work.tools.length > 0 && (
              <div className="grid gap-y-1 sm:col-span-2 sm:grid-cols-subgrid sm:items-baseline">
                <dt className="text-sm font-bold text-muted-foreground">使用ツール</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5" aria-label="使用ツール">
                    {work.tools.map((t) => (
                      <li key={t} className="pixel-chip bg-accent px-2.5 py-0.5 text-sm font-bold text-accent-foreground">
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      )}

      {/* 5. 説明文（microCMS のリッチエディタ） */}
      {work.descriptionHtml && (
        <section className="mt-section">
          <SectionHeading title="Story" ink={{ color: "yellow", trigger: "tap" }} />
          <Reveal className="pixel-box bg-card p-6 sm:p-8">
            <WorkRichText html={work.descriptionHtml} />
          </Reveal>
        </section>
      )}

      {/* 6. 画像ギャラリー（押すと拡大） */}
      {work.images.length > 0 && (
        <section className="mt-section">
          <SectionHeading title="Gallery" ink={{ color: "mint", trigger: "tap" }} />
          <WorkGallery images={work.images} />
        </section>
      )}

      {/* 7. 動画（押されてから読み込む） */}
      {work.video && (
        <section className="mt-section">
          <SectionHeading title="Movie" ink={{ color: "orange", trigger: "tap" }} />
          <WorkVideo url={work.video} title={work.title} />
        </section>
      )}

      {/* 8. 外部リンク */}
      {work.links.length > 0 && (
        <section className="mt-section">
          <SectionHeading title="Links" ink={{ color: "cyan", trigger: "tap" }} />
          <WorkLinks links={work.links} />
        </section>
      )}

      {/* 9. 前の作品 / 次の作品 */}
      <div className="mt-section">
        <WorkPager prev={prev} next={next} />
      </div>
    </article>
  );
}
