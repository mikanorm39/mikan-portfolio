export type SocialLink = {
  id: "github" | "qiita" | "x";
  label: string;
  href: string;
  /** ボタンに添える短い説明 */
  note: string;
};

export const profile = {
  name: "mikan",
  /** 本名（トップの About に表示） */
  fullName: "西岡 未栞",
  /** 本名のふりがな（姓・名ごとに漢字の上へ振る） */
  fullNameRuby: [
    { text: "西岡", ruby: "にしおか" },
    { text: "未栞", ruby: "みかん" },
  ],
  university: "福岡工業大学",
  department: "情報工学部 情報工学科",
  graduationYear: "2029年",
  teamDevCount: "9回",
  /** トップの About の「一言」 */
  oneLiner: "「このゲーム面白そう」をもらえるゲームプランナーを目指しています！",
  /** 連絡先（フッターの Contact に表示） */
  email: "mikanorm@outlook.jp",
  displayName: "Mikan",
  siteTitle: "Mikan's Portfolio",
  catchCopy: "作ることが好きなゲームプランナ―を目指す学生です",
  affiliation: "情報工業大学 情報学部 2年",
  club: "情報技術研究部（通称じょぎ）",
  intro:
    "情報工業大学 情報学部の2年生です。情報技術研究部（じょぎ）に所属し、仲間とゲームを作ったりゲームジャムに参加したりしています。アイデアを形にして、遊んだ人の反応を見るのがいちばんの楽しみです。",
  fields: "ゲームがメイン。Web も少し",
  activities: "ゲーム制作・ゲームジャム参加・Web 制作",
  vision: "顧客にうけるゲームを作れるプランナー",
  titles: ["ゲームプランナー見習い", "ゲーム開発", "Web もちょっと"],
  avatar: "/images/avatar.svg",
  social: [
    { id: "github", label: "GitHub", href: "https://github.com/mikanorm39", note: "コードを公開しています" },
    { id: "qiita", label: "Qiita", href: "https://qiita.com/your-qiita-id", note: "技術記事を書いています" },
    { id: "x", label: "X", href: "https://x.com/your-x-id", note: "日々の制作ログ" },
  ] satisfies SocialLink[],
} as const;

/** 本番の URL。Vercel の環境変数 NEXT_PUBLIC_SITE_URL で上書きできる */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
