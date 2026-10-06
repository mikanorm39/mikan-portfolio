export type CareerTag = "academic" | "community" | "event" | "dev" | "award" | "intern" | "license";

export type CareerItem = {
  date: string; // "2026-09-11"
  title: string;
  description: string;
  tags: CareerTag[];
};

export const careerTagLabels: Record<CareerTag, string> = {
  academic: "学業",
  community: "コミュニティ",
  event: "イベント",
  dev: "開発",
  award: "受賞",
  intern: "インターン",
  license: "資格",
};

export const careerTags = Object.keys(careerTagLabels) as CareerTag[];

/**
 * 経歴を追加するときは、この配列に1件足すだけでOK（並び順は日付で自動ソート）。
 * ↓ここに入っているのはダミーデータです。
 */
export const career: CareerItem[] = [
  {
    date: "2025-04-01",
    title: "情報工業大学 情報学部 入学",
    description: "ゲーム制作を本格的に学びたくて入学しました。",
    tags: ["academic"],
  },
  {
    date: "2025-05-10",
    title: "情報技術研究部（じょぎ）に入部",
    description: "ゲーム班に所属し、先輩と一緒に初めてのチーム開発を経験しました。",
    tags: ["community"],
  },
  {
    date: "2026-08-24",
    title: "学内ゲームジャム 2026 で「企画賞」を受賞",
    description: "「ふわふわジャンプ」で企画とレベルデザインを担当。ワンボタンでも気持ちよく遊べる点が評価されました。",
    tags: ["event", "award", "dev"],
  },
  {
    date: "2026-09-11",
    title: "ゲーム会社のサマーインターンに参加",
    description: "プランナー職として、既存タイトルのイベント企画を3日間で提案しました。",
    tags: ["intern"],
  },
  {
    date: "2026-03-15",
    title: "基本情報技術者試験 合格",
    description: "春休みに勉強して合格しました。",
    tags: ["license"],
  },
];

/** 新しい順に並べた経歴一覧 */
export function getSortedCareer() {
  return [...career].sort((a, b) => b.date.localeCompare(a.date));
}

/** "2026-09-11" → "2026.09.11" */
export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}
