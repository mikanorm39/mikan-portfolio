/**
 * 経歴（Career）の型・種類の表示名・日付の書式。
 * データそのものは microCMS から取る（取得は src/lib/getCareer.ts）。このファイルはブラウザ側でも使える。
 */

/** 経歴の種類（About ページの Career の絞り込みもこの5つ） */
export type CareerTag = "circle" | "event" | "dev" | "award" | "other";

/**
 * 種類の表示名。microCMS の tags の選択肢もこの名前にする。
 * ここに書いた順番が、絞り込みボタンとタグの並び順になる（絞り込みの先頭に「すべて」が付く）
 */
export const careerTagLabels: Record<CareerTag, string> = {
  circle: "サークル",
  event: "イベント",
  dev: "開発",
  award: "受賞",
  other: "その他",
};

export const careerTags = Object.keys(careerTagLabels) as CareerTag[];

/** 画面で使う経歴の形（microCMS の値を src/lib/getCareer.ts でこの形にそろえる） */
export type CareerItem = {
  /** microCMS のコンテンツ ID（並べたときの key に使う） */
  id: string;
  /** 日付（日本時間。"2026-09-11"） */
  date: string;
  /** 終了日（日本時間。なければ undefined） */
  endDate?: string;
  /** 現在も継続中（true なら「〜 現在」と表示。endDate より優先） */
  ongoing: boolean;
  title: string;
  /** 説明文（なければ undefined） */
  description?: string;
  /** 種類（careerTagLabels の順に並べてある。どれにも当てはまらなければ空。そのときは「すべて」のときだけ表示される） */
  tags: CareerTag[];
};

/** "2026-09-11" → "2026.09.11" */
export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

/**
 * 経歴の日付の表示。
 * - 継続中：「2025.04.04 〜 現在」
 * - 終了日あり：「2026.09.26 〜 2026.11.28」
 * - どちらもなし：「2026.09.11」
 */
export function formatCareerPeriod(item: Pick<CareerItem, "date" | "endDate" | "ongoing">) {
  if (item.ongoing) return `${formatDate(item.date)} 〜 現在`;
  if (item.endDate) return `${formatDate(item.date)} 〜 ${formatDate(item.endDate)}`;
  return formatDate(item.date);
}
