/** 経歴の種類（About ページの Career の絞り込みもこの5つ） */
export type CareerTag = "circle" | "event" | "dev" | "award" | "other";

export type CareerItem = {
  date: string; // "2026-09-11"
  title: string;
  /** 説明文（なければ省略できる） */
  description?: string;
  /** 種類（どれにも当てはまらなければ空でよい。そのときは「すべて」のときだけ表示される） */
  tags: CareerTag[];
};

/** 種類の表示名。ここに書いた順番が、絞り込みボタンの並び順になる（先頭に「すべて」が付く） */
export const careerTagLabels: Record<CareerTag, string> = {
  circle: "サークル",
  event: "イベント",
  dev: "開発",
  award: "受賞",
  other: "その他",
};

export const careerTags = Object.keys(careerTagLabels) as CareerTag[];

/**
 * 経歴を追加するときは、この配列に1件足すだけでOK（並び順は日付で自動ソート）。
 * description（説明文）は書かなくてもよい。tags は "circle" / "event" / "dev" / "award" / "other" から選ぶ。
 * ターミナルで `npm run career` を実行すると、質問に答えるだけで1件追加できる（scripts/add-career.mjs）。
 * VS Code では、配列の中で「career」と打って Tab を押すとひな形が出る（.vscode/career.code-snippets）。
 */
export const career: CareerItem[] = [
  {
    date: "2025-04-01",
    title: "福岡工業大学 情報工学部 入学",
    tags: ["event"],
  },
  {
    date: "2025-04-04",
    title: "情報技術研究部（じょぎ） 入部",
    description: "サークルに入部しました。",
    tags: ["circle"],
  },
  {
    date: "2025-05-09",
    title: "部内ハッカソン 参加",
    description: "サークル主催2日間開催のハッカソンに参加しました。",
    tags: ["circle", "event", "dev"],
  },
  {
    date: "2025-06-21",
    title: "ハックツハッカソン（ギガノトカップ） 参加",
    description:
      "ハックツ主催、2日間開催のハッカソンに参加しました。企業賞（ヌーラボ賞）受賞しました。",
    tags: ["event", "dev", "award"],
  },
  {
    date: "2025-09-11",
    title: "技育博 参加",
    description: "東京で行われる、作品紹介を行うイベントに参加しました。",
    tags: ["event"],
  },
  {
    date: "2025-10-26",
    title: "ITパスポート 取得",
    tags: ["other"],
  },
  {
    date: "2025-12-20",
    title: "ハックツハッカソン（プテラカップ） 参加",
    description: "ハックツ主催、2日間開催のハッカソンに参加しました。",
    tags: ["event", "dev"],
  },
  {
    date: "2026-01-17",
    title: "技育キャンプ 参加",
    description:
      "サポーターズ主催、2日間開催、オンラインのハッカソンに参加しました。",
    tags: ["event", "dev"],
  },
  {
    date: "2026-02-16",
    title: "部内ハッカソン（トライ） 参加",
    description: "サークル主催、3日間開催のハッカソンに参加しました。",
    tags: ["circle", "event", "dev"],
  },
  {
    date: "2026-02-25",
    title: "ハックツハッカソン（Nulabカップ） 参加",
    description:
      "ハックツ主催、2日間開催のハッカソンに参加しました。ヌーラボメンバーに挑戦し、勝利賞を受賞しました。",
    tags: ["event", "dev", "award"],
  },
  {
    date: "2026-05-23",
    title: "部内ハッカソン（DDD） 参加",
    description:
      "サークル主催、2日間開催のハッカソンに参加しました。初心者部門最優秀賞を受賞しました。",
    tags: ["circle", "event", "dev", "award"],
  },
  {
    date: "2026-06-20",
    title: "技育祭 参加",
    description: "サポーターズ主催、テックカンファレンスに参加しました。",
    tags: ["event"],
  },
  {
    date: "2026-08-29",
    title: "ゲームジャム 初参加",
    description: "福岡市主催、2日間開催のFUKUOKA GAME SPRINTに参加しました。",
    tags: ["event", "dev"],
  },
  {
    date: "2026-09-11",
    title: "じょぎ湯布院ハッカソン 参加",
    description: "サークル主催、3日間開催のハッカソンに参加しました。",
    tags: ["circle", "dev"],
  },
  {
    date: "2026-09-26",
    title: "KitaQDXミライバトンラボ 参加",
    description:
      "北九州市主催、9.26～11.28開催のDXリーダー育成プログラムに参加しました。",
    tags: ["event"],
  },
];

/** 古い順（年表として上から時系列）に並べた経歴一覧。新しい順にしたいときは a と b を入れ替える */
export function getSortedCareer() {
  return [...career].sort((a, b) => a.date.localeCompare(b.date));
}

/** "2026-09-11" → "2026.09.11" */
export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}
