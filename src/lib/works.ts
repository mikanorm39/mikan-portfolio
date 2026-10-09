/**
 * 作品（Work）の型・表示名・画像の URL づくり。
 * データそのものは microCMS から取る（取得は src/lib/getWorks.ts）。このファイルはブラウザ側でも使える。
 */

/** 作品の種類（Work ページの「種類」の絞り込みもこの4つ） */
export type WorkCategory = "game" | "web" | "graphic" | "article";

/** 種類の表示名。microCMS の category の選択肢もこの名前にする。ここに書いた順番が絞り込みボタンの並び順 */
export const workCategoryLabels: Record<WorkCategory, string> = {
  game: "ゲーム",
  web: "Web",
  graphic: "グラフィック",
  article: "記事",
};

export const workCategories = Object.keys(workCategoryLabels) as WorkCategory[];

export type WorkTeam = "solo" | "team";

/** 開発形態の表示名。microCMS の team の選択肢もこの名前にする */
export const workTeamLabels: Record<WorkTeam, string> = {
  solo: "個人開発",
  team: "チーム開発",
};

/** 画像1枚（microCMS の画像。width / height は元の大きさ） */
export type WorkImage = {
  url: string;
  width?: number;
  height?: number;
  /** 読み上げ用の説明 */
  alt: string;
};

/** 外部リンクのボタン */
export type WorkLink = {
  label: string;
  href: string;
  type: "site" | "github" | "article";
};

/** 画面で使う作品の形（microCMS の値を src/lib/getWorks.ts でこの形にそろえる）。空の項目は undefined / 空の配列 */
export type Work = {
  slug: string;
  title: string;
  thumbnail: WorkImage;
  categories: WorkCategory[];
  team?: WorkTeam;
  year?: number;
  period?: string;
  role?: string;
  tools: string[];
  summary?: string;
  /** 説明文（microCMS のリッチエディタの HTML） */
  descriptionHtml?: string;
  images: WorkImage[];
  video?: string;
  links: WorkLink[];
  featured: boolean;
  order?: number;
};

/** microCMS の画像か（images.microcms-assets.io） */
export function isMicroCMSImage(src: string) {
  return src.startsWith("https://images.microcms-assets.io/");
}

/**
 * microCMS の画像 API で、表示する幅に合わせて小さく・WebP にした URL を作る。
 * next/image の loader として使う（next/image が画面の幅に合わせた width を渡してくる）。
 * microCMS 以外の画像は、そのままの URL を返す。
 */
export function microcmsImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!isMicroCMSImage(src)) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("fm", "webp");
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
}
