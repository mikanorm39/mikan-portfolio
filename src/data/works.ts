/**
 * 【移行用・サイトでは使っていません】
 * 作品データは microCMS から取るようになった（src/lib/microcms.ts）。このファイルは microCMS へ登録し直すときの控えとして残している。
 * 登録する値の一覧は WORKS_MIGRATION.md。移行が終わったら、このファイルと public/works/ は削除してよい。
 *
 * （以下は以前の説明）
 * 作品データ（Work）。作品の一覧カード・詳細ページ（/work/作品のslug）・Home の作品紹介は、すべてここから自動で作られる。
 *
 * 作品を追加するときは：
 *   1. 画像を public/works/作品のslug/ に入れる（thumbnail.webp など）
 *   2. 下の works 配列に1件足す
 * 詳しい手順とコピペ用のテンプレートは、プロジェクト直下の WORKS_GUIDE.md にある。
 */

/** 作品の種類（Work ページの「種類」の絞り込みもこの4つ） */
export type WorkCategory = "game" | "web" | "graphic" | "article";

/** 種類の表示名。ここに書いた順番が、Work ページの絞り込みボタンの並び順になる（先頭に「すべて」が付く） */
export const workCategoryLabels: Record<WorkCategory, string> = {
  game: "ゲーム",
  web: "Web",
  graphic: "グラフィック",
  article: "記事",
};

export const workCategories = Object.keys(workCategoryLabels) as WorkCategory[];

export type WorkTeam = "solo" | "team";

export const workTeamLabels: Record<WorkTeam, string> = {
  solo: "個人開発",
  team: "チーム開発",
};

/** 詳細ページのギャラリーの画像1枚 */
export type WorkImage = {
  /** ファイル名（public/works/作品のslug/ の中）。"/" から始めればサイト内のどこでも、"https://" なら外部の画像 */
  src: string;
  /** 画像の説明（読み上げ用。省略すると作品名＋番号になる） */
  alt?: string;
  /** 画像の下に出す一言 */
  caption?: string;
};

/** 外部リンク（作品サイト・GitHub・記事など） */
export type WorkLink = {
  /** ボタンの文字 */
  label: string;
  href: string;
  /** ボタンのアイコン（省略すると "site"） */
  type?: "site" | "github" | "article" | "other";
};

export type Work = {
  /** URL に使う英数字の ID（例："fluffy-jump" → /work/fluffy-jump）。画像フォルダの名前もこれ ※必須 */
  slug: string;
  /** 作品名 ※必須 */
  title: string;
  /** 一覧カード・詳細ページの一番上に出す画像（16:9 推奨） ※必須 */
  thumbnail: string;

  /* ---- ここから下は省略できる（省略した項目は詳細ページに表示しない） ---- */
  /** 種類（複数可） */
  categories?: WorkCategory[];
  /** 制作年 */
  year?: number;
  /** 制作期間（例："48時間"、"2026年4月〜6月"） */
  period?: string;
  /** 担当範囲 */
  role?: string;
  /** 個人開発 / チーム開発（Work ページの「開発形態」の絞り込みに使う） */
  team?: WorkTeam;
  /** 使用ツール（例：["Unity", "C#", "Aseprite"]） */
  tools?: string[];
  /** 一覧カードの短い説明（1〜2行） */
  summary?: string;
  /** 詳細ページの説明文。改行はそのまま改行に、空行で段落が分かれる */
  description?: string;
  /** 詳細ページのギャラリー画像（クリックで拡大） */
  images?: WorkImage[];
  /** 動画（YouTube の URL。普通の URL・youtu.be の短縮 URL・埋め込み URL のどれでも可） */
  video?: string;
  /** 外部リンクのボタン */
  links?: WorkLink[];
  /** true にすると Home の作品紹介に優先して出す */
  featured?: boolean;
  /** 並び順（小さいほど前。省略した作品は、指定した作品のあとに制作年の新しい順で並ぶ） */
  order?: number;
};

/**
 * 作品の一覧。追加するときは、この配列に1件足すだけでOK（並び順は order → 制作年 で自動で整う）。
 * ↓ここに入っているのはダミーデータです。
 */
export const works: Work[] = [
  {
    slug: "fluffy-jump",
    title: "ふわふわジャンプ",
    thumbnail: "thumbnail.svg",
    categories: ["game"],
    year: 2026,
    period: "48時間（ゲームジャム）",
    role: "企画・レベルデザイン",
    team: "team",
    tools: ["Unity", "C#", "Aseprite"],
    summary: "雲から雲へ飛び移る、ワンボタンのカジュアルアクション。",
    description:
      "雲から雲へ飛び移る、ワンボタンのカジュアルアクションです。\nじょぎのゲームジャムで、4人のチームで48時間で制作しました。\n\n私は企画とレベルデザインを担当しました。ボタン1つでも「もう1回！」と遊びたくなるように、雲の間隔と動きを何度も調整しました。",
    images: [
      { src: "screen-1.svg", caption: "ゲーム画面。タイミングよく押して、次の雲へジャンプ" },
      { src: "screen-2.svg", caption: "リザルト画面。スコアでランキングに挑戦できる" },
    ],
    links: [
      { label: "遊んでみる", href: "https://unityroom.com/", type: "site" },
      { label: "GitHub", href: "https://github.com/your-github-id/fluffy-jump", type: "github" },
    ],
    featured: true,
  },
  {
    slug: "mikan-portfolio",
    title: "Mikan's Portfolio",
    thumbnail: "thumbnail.webp",
    categories: ["web"],
    year: 2026,
    role: "デザイン・実装",
    team: "solo",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
    summary: "このサイトです。インクとドット絵で、ゲームのタイトル画面のようなポートフォリオにしました。",
    description:
      "このサイトです。Next.js の App Router と Motion で、ポップで動きのあるポートフォリオを作りました。\n\n紫の背景にインクが飛び散るデザインで、見出しやメニューにもインクが「びちゃっ」と着弾します。",
    links: [{ label: "GitHub", href: "https://github.com/mikanorm39/mikan-portfolio", type: "github" }],
  },
  {
    slug: "planner-note",
    title: "ゲーム企画書の書き方メモ",
    thumbnail: "thumbnail.svg",
    categories: ["article"],
    year: 2026,
    team: "solo",
    tools: ["企画", "ドキュメント"],
    summary: "企画書を書くときに気をつけていることを、テンプレート付きでまとめた記事です。",
    links: [{ label: "記事を読む", href: "https://qiita.com/", type: "article" }],
  },
  {
    slug: "pixel-garden",
    title: "ドット絵ガーデン",
    thumbnail: "thumbnail.svg",
    categories: ["graphic"],
    year: 2026,
    team: "solo",
    tools: ["Aseprite", "JavaScript"],
    summary: "ドット絵の素材集と、それを並べて遊べる小さなツール。",
    description: "ドット絵の素材集と、それを並べて遊べる小さなツールです。\nチームの新入生向け講座でも使いました。",
  },
];

/**
 * 画像のパスを、実際に表示する URL にする。
 * "thumbnail.webp" のようにファイル名だけなら public/works/作品のslug/ の中の画像として扱う。
 */
export function workAsset(work: Pick<Work, "slug">, src: string) {
  return src.startsWith("/") || isExternal(src) ? src : `/works/${work.slug}/${src}`;
}

/** 外部サイトの画像か（"https://" などから始まる） */
export function isExternal(src: string) {
  return /^https?:\/\//.test(src);
}

/** 並び順：order の小さい順 → 制作年の新しい順 → works に書いた順 */
export function getSortedWorks() {
  return works
    .map((work, index) => ({ work, index }))
    .sort(
      (a, b) =>
        (a.work.order ?? Infinity) - (b.work.order ?? Infinity) ||
        (b.work.year ?? 0) - (a.work.year ?? 0) ||
        a.index - b.index,
    )
    .map(({ work }) => work);
}

/** Home に出す作品：featured の作品を先に、残りを並び順のとおりに */
export function getHomeWorks(count: number) {
  const sorted = getSortedWorks();
  return [...sorted.filter((w) => w.featured), ...sorted.filter((w) => !w.featured)].slice(0, count);
}

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug);
}

/** 詳細ページの「前の作品 / 次の作品」（一覧の並び順で前後。端の作品は片方だけ） */
export function getAdjacentWorks(slug: string) {
  const sorted = getSortedWorks();
  const i = sorted.findIndex((w) => w.slug === slug);
  return { prev: i > 0 ? sorted[i - 1] : undefined, next: i >= 0 ? sorted[i + 1] : undefined };
}
