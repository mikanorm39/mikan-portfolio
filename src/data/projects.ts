export type ProjectCategory = "web" | "native" | "game" | "graphic" | "article" | "lecture" | "video";

export type Project = {
  slug: string;
  title: string;
  description: string;
  date: string; // "2026-09"
  categories: ProjectCategory[];
  team: "solo" | "team";
  tech: string[]; // ["Next.js", "Hono", "TypeScript"]
  thumbnail?: string; // 無い場合は links.site の OGP 画像を使う
  links: { site?: string; code?: string; article?: string };
  featured?: boolean;
};

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  web: "Web",
  native: "ネイティブ",
  game: "ゲーム",
  graphic: "グラフィック",
  article: "記事",
  lecture: "講座資料",
  video: "動画",
};

export const projectCategories = Object.keys(projectCategoryLabels) as ProjectCategory[];

export const projectTeamLabels: Record<Project["team"], string> = {
  solo: "個人開発",
  team: "チーム開発",
};

/**
 * 作品を追加するときは、この配列に1件足すだけでOK（並び順は日付で自動ソート）。
 * ↓ここに入っているのはダミーデータです。
 */
export const projects: Project[] = [
  {
    slug: "fluffy-jump",
    title: "ふわふわジャンプ",
    description:
      "雲から雲へ飛び移る、ワンボタンのカジュアルアクション。じょぎのゲームジャムで48時間で制作し、企画とレベルデザインを担当しました。",
    date: "2026-08",
    categories: ["game"],
    team: "team",
    tech: ["Unity", "C#", "Aseprite"],
    thumbnail: "/images/projects/fluffy-jump.svg",
    links: { site: "https://unityroom.com/", code: "https://github.com/your-github-id/fluffy-jump" },
    featured: true,
  },
  {
    slug: "mikan-portfolio",
    title: "Mikan's Portfolio",
    description: "このサイトです。Next.js の App Router と Motion で、ポップで動きのあるポートフォリオを作りました。",
    date: "2026-10",
    categories: ["web"],
    team: "solo",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
    links: { site: "https://nextjs.org/", code: "https://github.com/your-github-id/mikan-portfolio" },
  },
  {
    slug: "planner-note",
    title: "ゲーム企画書の書き方メモ",
    description: "企画書を書くときに気をつけていることを、テンプレート付きでまとめた記事です。",
    date: "2026-06",
    categories: ["article"],
    team: "solo",
    tech: ["企画", "ドキュメント"],
    thumbnail: "/images/projects/planner-note.svg",
    links: { article: "https://qiita.com/" },
  },
  {
    slug: "pixel-garden",
    title: "ドット絵ガーデン",
    description: "ドット絵の素材集と、それを並べて遊べる小さなツール。チームの新入生向け講座でも使いました。",
    date: "2026-04",
    categories: ["graphic", "lecture"],
    team: "solo",
    tech: ["Aseprite", "JavaScript"],
    thumbnail: "/images/projects/pixel-garden.svg",
    links: { site: "https://example.com/", code: "https://github.com/your-github-id/pixel-garden" },
  },
];

/** 新しい順に並べた作品一覧 */
export function getSortedProjects() {
  return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}

/** "2026-09" → "2026.09" */
export function formatYearMonth(date: string) {
  return date.replace("-", ".");
}
