export type SocialLink = {
  id: "github" | "qiita" | "x";
  label: string;
  href: string;
  /** ボタンに添える短い説明 */
  note: string;
};

export const profile = {
  name: "mikan",
  displayName: "Mikan",
  siteTitle: "Mikan's Portfolio",
  catchCopy: "作ることが好きなゲームプランナ―を目指す学生です",
  greeting:
    "はじめまして、みかんです！ゲームを中心に、ときどき Web も作っています。遊んだ人が「もう一回！」と言いたくなるものを目指して、企画から実装までコツコツ手を動かしています。",
  affiliation: "情報工業大学 情報学部 2年",
  club: "情報技術研究部（通称：じょぎ）",
  intro:
    "情報工業大学 情報学部の2年生です。情報技術研究部（じょぎ）に所属し、仲間とゲームを作ったりゲームジャムに参加したりしています。アイデアを形にして、遊んだ人の反応を見るのがいちばんの楽しみです。",
  fields: "ゲームがメイン。Web も少し",
  activities: "ゲーム制作・ゲームジャム参加・Web 制作",
  vision: "顧客にうけるゲームを作れるプランナー",
  titles: ["ゲームプランナー見習い", "ゲーム開発", "Web もちょっと"],
  avatar: "/images/avatar.svg",
  social: [
    { id: "github", label: "GitHub", href: "https://github.com/your-github-id", note: "コードを公開しています" },
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
