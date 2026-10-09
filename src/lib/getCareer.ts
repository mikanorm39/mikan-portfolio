/**
 * 経歴データの取得（サーバー側・ビルド時だけ）。microCMS の値を、画面で使う形（CareerItem）にそろえる。
 */
import "server-only";
import { cache } from "react";
import { careerTagLabels, careerTags, type CareerItem, type CareerTag } from "./career";
import { getAllCareerContents, type MicroCMSCareer } from "./microcms";

/** 表示名 → 種類のキー（microCMS のセレクトは表示名で届く） */
const tagByLabel = new Map(Object.entries(careerTagLabels).map(([k, v]) => [v, k as CareerTag]));

/** 日本時間で日付を出す（"2026-09-11" の形。sv-SE は年-月-日の順で出る書式） */
const jstDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" });

/** microCMS の日時（世界標準時）→ 日本時間の日付。空なら undefined */
function toJstDate(iso?: string | null) {
  return iso ? jstDate.format(new Date(iso)) : undefined;
}

/** 空文字・空白だけの文字は「なし」にする */
const text = (v?: string | null) => (v && v.trim() ? v.trim() : undefined);

/** microCMS の1件 → 画面で使う形 */
function toCareerItem(raw: MicroCMSCareer): CareerItem {
  const tags = (raw.tags ?? []).flatMap((label) => {
    const key = tagByLabel.get(label);
    if (!key) console.warn(`[microCMS] 経歴「${raw.title}」の種類「${label}」は、サイトの種類にありません（表示しません）`);
    return key ? [key] : [];
  });
  return {
    id: raw.id,
    date: toJstDate(raw.date)!,
    endDate: toJstDate(raw.endDate),
    ongoing: raw.ongoing ?? false,
    title: raw.title,
    description: text(raw.description),
    // microCMS では選んだ順に届くので、いつも「サークル → イベント → 開発 → 受賞 → その他」の順にそろえる
    tags: careerTags.filter((t) => tags.includes(t)),
  };
}

/**
 * 古い順（年表として上から時系列）に並べた経歴一覧。
 * 日付が同じなら order の小さい順（order がなければ microCMS から届いた順）
 */
export const getSortedCareer = cache(async (): Promise<CareerItem[]> => {
  const raws = await getAllCareerContents();
  return raws
    .map((raw, index) => ({ item: toCareerItem(raw), order: raw.order ?? Infinity, index }))
    .sort((a, b) => a.item.date.localeCompare(b.item.date) || a.order - b.order || a.index - b.index)
    .map(({ item }) => item);
});
