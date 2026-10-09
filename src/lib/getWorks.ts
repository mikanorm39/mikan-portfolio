/**
 * 作品データの取得（サーバー側・ビルド時だけ）。microCMS の値を、画面で使う形（Work）にそろえる。
 * 一覧・詳細ページ・Home・サイトマップは、すべてここの関数を使う。
 */
import "server-only";
import { cache } from "react";
import { getAllWorkContents, getWorkContentBySlug, type MicroCMSWork } from "./microcms";
import {
  workCategoryLabels,
  workTeamLabels,
  type Work,
  type WorkCategory,
  type WorkImage,
  type WorkLink,
  type WorkTeam,
} from "./works";

/** 表示名 → 種類のキー（microCMS のセレクトは表示名で届く） */
const categoryByLabel = new Map(Object.entries(workCategoryLabels).map(([k, v]) => [v, k as WorkCategory]));
const teamByLabel = new Map(Object.entries(workTeamLabels).map(([k, v]) => [v, k as WorkTeam]));

/** 空文字・空白だけの文字は「なし」にする */
const text = (v?: string | null) => (v && v.trim() ? v.trim() : undefined);

/** リッチエディタが空のときは "<p></p>" などが届くので、文字も画像もなければ「なし」とみなす */
function hasContent(html?: string): html is string {
  if (!html) return false;
  if (/<(img|iframe|video|hr|table)/i.test(html)) return true;
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

/** microCMS の1件 → 画面で使う形 */
function toWork(raw: MicroCMSWork): Work {
  const categories = (raw.category ?? []).flatMap((label) => {
    const key = categoryByLabel.get(label);
    if (!key) console.warn(`[microCMS] 作品「${raw.title}」の category「${label}」は、サイトの種類にありません（表示しません）`);
    return key ? [key] : [];
  });
  const team = raw.team?.map((label) => teamByLabel.get(label)).find(Boolean);

  const links: WorkLink[] = [];
  const siteUrl = text(raw.siteUrl);
  const githubUrl = text(raw.githubUrl);
  if (siteUrl) {
    const isArticle = categories.includes("article");
    links.push({ label: isArticle ? "記事を読む" : "作品を見る", href: siteUrl, type: isArticle ? "article" : "site" });
  }
  if (githubUrl) links.push({ label: "GitHub", href: githubUrl, type: "github" });

  const thumbnail: WorkImage = { ...raw.thumbnail, alt: `${raw.title} のサムネイル` };
  const images: WorkImage[] = (raw.images ?? []).map((img, i) => ({ ...img, alt: `${raw.title} の画像 ${i + 1}` }));

  return {
    slug: raw.slug,
    title: raw.title,
    thumbnail,
    categories,
    team,
    year: raw.year ?? undefined,
    period: text(raw.period),
    role: text(raw.role),
    tools: (raw.tools ?? []).filter((t) => t.trim()),
    summary: text(raw.summary),
    descriptionHtml: hasContent(raw.description) ? raw.description : undefined,
    images,
    video: text(raw.video),
    links,
    featured: raw.featured ?? false,
    order: raw.order ?? undefined,
  };
}

/** 並び順：order の小さい順（order のない作品は後ろ）→ 制作年の新しい順 */
export const getSortedWorks = cache(async (): Promise<Work[]> => {
  const works = (await getAllWorkContents()).map(toWork);
  return works
    .map((work, index) => ({ work, index }))
    .sort(
      (a, b) =>
        (a.work.order ?? Infinity) - (b.work.order ?? Infinity) ||
        (b.work.year ?? 0) - (a.work.year ?? 0) ||
        a.index - b.index,
    )
    .map(({ work }) => work);
});

/** Home に出す作品：featured の作品を先に、残りを並び順のとおりに */
export async function getHomeWorks(count: number) {
  const sorted = await getSortedWorks();
  return [...sorted.filter((w) => w.featured), ...sorted.filter((w) => !w.featured)].slice(0, count);
}

/** slug で1件。見つからなければ undefined */
export async function getWork(slug: string) {
  const raw = await getWorkContentBySlug(slug);
  return raw ? toWork(raw) : undefined;
}

/** 詳細ページの「前の作品 / 次の作品」（一覧の並び順で前後。端の作品は片方だけ） */
export async function getAdjacentWorks(slug: string) {
  const sorted = await getSortedWorks();
  const i = sorted.findIndex((w) => w.slug === slug);
  return { prev: i > 0 ? sorted[i - 1] : undefined, next: i >= 0 ? sorted[i + 1] : undefined };
}
