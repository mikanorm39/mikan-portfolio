/**
 * About ページの「Skills（使えるツール）」のデータ。
 * ツールを追加・変更するときは、下の skills に1件追記・修正するだけで反映される（並び順は自動）。
 * 書き方は CAREER_GUIDE.md の「使えるツール（Skills）の追加・編集」を参照。
 */
import type { StaticImageData } from "next/image";
// ツールのロゴ（public/images/skills/ の中。入手元は CAREER_GUIDE.md の「ロゴの入手元」）
import claudeCodeLogo from "../../public/images/skills/claude-code.svg";
import flutterLogo from "../../public/images/skills/flutter.svg";
import githubLogo from "../../public/images/skills/github.svg";
import illustratorLogo from "../../public/images/skills/illustrator.svg";
import javascriptLogo from "../../public/images/skills/javascript.svg";
import nextjsLogo from "../../public/images/skills/nextjs.svg";
import phaserLogo from "../../public/images/skills/phaser.png";
import photoshopLogo from "../../public/images/skills/photoshop.svg";
import reactLogo from "../../public/images/skills/react.svg";
import typescriptLogo from "../../public/images/skills/typescript.svg";
import unityLogo from "../../public/images/skills/unity.svg";
import vscodeLogo from "../../public/images/skills/vscode.svg";

/** カテゴリ（表示する順番） */
export const skillCategories = [
  { id: "dev", label: "開発（ゲーム・Web）" },
  { id: "tool", label: "デザイン・制作ツール" },
] as const;

export type SkillCategory = (typeof skillCategories)[number]["id"];

/** 習熟度：3 = よく使う / 2 = 使ったことがある / 1 = 勉強中 */
export type SkillLevel = 1 | 2 | 3;

export const skillLevelLabels: Record<SkillLevel, string> = {
  3: "よく使う",
  2: "使ったことがある",
  1: "勉強中",
};

/** ツールのロゴ（フルカラーの公式ロゴ。形・色・比率は加工しない） */
export type SkillIcon = {
  src: StaticImageData;
  /** true = 黒っぽいロゴなので、後ろに白い角丸の下地を敷いて見えるようにする（ロゴ自体は加工しない） */
  backing?: boolean;
};

export type Skill = {
  name: string;
  /** 公式ロゴ。ロゴが見つからないツールは null（頭文字の四角いアイコンになる） */
  icon: SkillIcon | null;
  category: SkillCategory;
  level: SkillLevel;
  /** ひとことの説明（1行・20字前後） */
  description: string;
};

export const skills: Skill[] = [
  // ===== 開発（ゲーム・Web） =====
  { name: "Unity", icon: { src: unityLogo, backing: true }, category: "dev", level: 2, description: "2Dアクションゲームの制作" },
  { name: "Phaser.js", icon: { src: phaserLogo }, category: "dev", level: 2, description: "ブラウザゲームの制作" },
  { name: "Flutter", icon: { src: flutterLogo }, category: "dev", level: 1, description: "チーム開発でアプリ画面を担当" },
  { name: "React", icon: { src: reactLogo }, category: "dev", level: 2, description: "Webサイトやアプリの画面づくり" },
  { name: "Next.js", icon: { src: nextjsLogo, backing: true }, category: "dev", level: 2, description: "このポートフォリオの制作" },
  { name: "TypeScript", icon: { src: typescriptLogo }, category: "dev", level: 1, description: "型を使った開発の勉強中" },
  { name: "JavaScript", icon: { src: javascriptLogo }, category: "dev", level: 2, description: "ゲームやWebの動きの実装" },

  // ===== デザイン・制作ツール =====
  { name: "VS Code", icon: { src: vscodeLogo }, category: "tool", level: 3, description: "普段の開発環境" },
  { name: "GitHub", icon: { src: githubLogo, backing: true }, category: "tool", level: 3, description: "チーム開発でのコード管理" },
  { name: "Claude Code", icon: { src: claudeCodeLogo }, category: "tool", level: 3, description: "AIと協力した開発" },
  { name: "Illustrator", icon: { src: illustratorLogo }, category: "tool", level: 2, description: "イラストやデザイン素材の制作" },
  { name: "Photoshop", icon: { src: photoshopLogo }, category: "tool", level: 2, description: "画像の加工と書き出し" },
];

/** カテゴリごとに、習熟度の高い順（同じ習熟度は書いた順）に並べる */
export function getSkillsByCategory() {
  return skillCategories.map((category) => ({
    ...category,
    skills: skills.filter((s) => s.category === category.id).sort((a, b) => b.level - a.level),
  }));
}
