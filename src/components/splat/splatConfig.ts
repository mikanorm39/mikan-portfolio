/**
 * 背景のインクと記号の設定。色・形・位置・サイズ・時間はここで調整する。
 *
 * 位置の決め方：
 * - top はページの一番上からの距離（vh。100vh = 画面1枚分）。ページが短ければ、はみ出た分は表示されない
 * - left / right は画面の端からの距離（vw）。マイナスにすると画面の外にはみ出して、端から覗く形になる
 * - mobile: false のものはスマホ（幅 640px 未満）では表示しない（文字に被らないよう数を減らす）
 */

/** インクの色の名前（globals.css の --ink-○○） */
export type InkColor = "yellow" | "pink" | "mint" | "cyan" | "orange";

/** 時間（ミリ秒） */
export const SPLAT_TIMING = {
  /** インクが着弾して広がる時間 */
  hitMs: 380,
  /** 着弾から、周りの水滴が飛び出し始めるまで */
  dropsDelayMs: 60,
  /** 水滴が飛んで止まるまで */
  dropMs: 450,
  /** 水滴1つごとの時間差 */
  dropStaggerMs: 25,
  /** 着弾から、ドリップが垂れ始めるまで */
  dripDelayMs: 450,
  /** ドリップが垂れきるまで */
  dripMs: 1400,
  /** 着弾から、近くの記号がポンッと出るまで */
  symbolDelayMs: 250,
  /** 同時に画面に入ったものを、順番に着弾させる間隔（ファーストビューなど） */
  staggerMs: 140,
} as const;

export type SplatItem = {
  id: string;
  /** 形の番号（0〜5。splatShapes.ts の VARIANTS の順番） */
  shape: number;
  color: InkColor;
  top: string;
  left?: string;
  right?: string;
  /** 横幅。clamp(スマホでの最小, 画面幅に対する割合, 最大) */
  size: string;
  /** 回転（度） */
  rotate: number;
  mobile?: boolean;
};

/** インク（上から順に。近くに置いた2つは重なって見える） */
export const SPLATS: SplatItem[] = [
  // ---- ファーストビュー（ローディングが開けた直後に順番に着弾） ----
  { id: "tl", shape: 0, color: "yellow", top: "-3vh", left: "-10vw", size: "clamp(130px, 30vw, 440px)", rotate: 10, mobile: true },
  { id: "tl2", shape: 3, color: "pink", top: "-4vh", left: "9vw", size: "clamp(80px, 14vw, 210px)", rotate: -20 },
  { id: "tr", shape: 2, color: "mint", top: "-1vh", right: "-8vw", size: "clamp(110px, 20vw, 300px)", rotate: 160, mobile: true },
  { id: "br", shape: 1, color: "cyan", top: "58vh", right: "-11vw", size: "clamp(140px, 30vw, 440px)", rotate: -15, mobile: true },
  { id: "br2", shape: 4, color: "pink", top: "80vh", right: "5vw", size: "clamp(90px, 16vw, 240px)", rotate: 200 },
  { id: "bl", shape: 5, color: "orange", top: "76vh", left: "-9vw", size: "clamp(90px, 18vw, 260px)", rotate: 30 },

  // ---- スクロールすると出てくるもの（左右交互） ----
  { id: "s1", shape: 2, color: "yellow", top: "135vh", right: "-10vw", size: "clamp(120px, 26vw, 380px)", rotate: 40, mobile: true },
  { id: "s2", shape: 5, color: "mint", top: "175vh", left: "-11vw", size: "clamp(110px, 24vw, 340px)", rotate: -30 },
  { id: "s3", shape: 0, color: "pink", top: "218vh", right: "-9vw", size: "clamp(120px, 26vw, 380px)", rotate: 0, mobile: true },
  { id: "s3b", shape: 3, color: "cyan", top: "232vh", right: "10vw", size: "clamp(70px, 12vw, 180px)", rotate: 120 },
  { id: "s4", shape: 3, color: "cyan", top: "262vh", left: "-10vw", size: "clamp(110px, 22vw, 330px)", rotate: 90 },
  { id: "s5", shape: 1, color: "orange", top: "305vh", right: "-10vw", size: "clamp(120px, 24vw, 360px)", rotate: -60, mobile: true },
  { id: "s6", shape: 4, color: "yellow", top: "350vh", left: "-9vw", size: "clamp(110px, 22vw, 330px)", rotate: 15 },
  { id: "s6b", shape: 2, color: "pink", top: "362vh", left: "9vw", size: "clamp(70px, 11vw, 170px)", rotate: -70 },
  { id: "s7", shape: 2, color: "pink", top: "398vh", right: "-10vw", size: "clamp(120px, 24vw, 360px)", rotate: 70, mobile: true },
  { id: "s8", shape: 5, color: "cyan", top: "445vh", left: "-9vw", size: "clamp(110px, 22vw, 330px)", rotate: -10 },
  { id: "s9", shape: 0, color: "mint", top: "492vh", right: "-9vw", size: "clamp(120px, 24vw, 360px)", rotate: 140, mobile: true },
];

/** 記号の種類（PixelSymbol.tsx で形を描く） */
export type SymbolKind = "heart" | "coin" | "chara" | "plus" | "wave" | "zigzag" | "triangle" | "hatch" | "dots";

export type SymbolItem = {
  id: string;
  kind: SymbolKind;
  color: InkColor;
  top: string;
  left?: string;
  right?: string;
  /** 横幅（px など） */
  size: string;
  rotate: number;
  mobile?: boolean;
  /** トップページだけに出す（タイトル画面の配置に合わせたもの。ほかのページでは見出しや文字に被るため） */
  homeOnly?: boolean;
};

/** ゲーム風の記号（インクより控えめに） */
export const SYMBOLS: SymbolItem[] = [
  // ---- トップページのファーストビュー（タイトル画面のまわり） ----
  { id: "y1", kind: "heart", color: "pink", top: "22vh", left: "22vw", size: "34px", rotate: 0, mobile: true, homeOnly: true },
  { id: "y2", kind: "coin", color: "yellow", top: "15vh", right: "22vw", size: "28px", rotate: 0, homeOnly: true },
  { id: "y3", kind: "triangle", color: "yellow", top: "30vh", right: "15vw", size: "44px", rotate: 12, homeOnly: true },
  { id: "y4", kind: "wave", color: "mint", top: "12vh", left: "38vw", size: "52px", rotate: -15, homeOnly: true },
  { id: "y5", kind: "hatch", color: "mint", top: "7vh", right: "33vw", size: "34px", rotate: 0, homeOnly: true },
  { id: "y6", kind: "dots", color: "yellow", top: "38vh", left: "12vw", size: "34px", rotate: 0, homeOnly: true },
  { id: "y7", kind: "zigzag", color: "pink", top: "70vh", left: "11vw", size: "56px", rotate: 20, mobile: true, homeOnly: true },
  { id: "y8", kind: "plus", color: "pink", top: "80vh", left: "33vw", size: "24px", rotate: 0, homeOnly: true },
  { id: "y9", kind: "chara", color: "yellow", top: "82vh", right: "26vw", size: "40px", rotate: 0, mobile: true, homeOnly: true },
  { id: "y10", kind: "plus", color: "cyan", top: "92vh", left: "52vw", size: "20px", rotate: 0, homeOnly: true },

  // ---- スクロールすると出てくるもの（左右の余白に） ----
  { id: "z1", kind: "coin", color: "yellow", top: "150vh", left: "3vw", size: "26px", rotate: 0 },
  { id: "z2", kind: "heart", color: "pink", top: "232vh", right: "3vw", size: "30px", rotate: 0 },
  { id: "z3", kind: "chara", color: "mint", top: "312vh", left: "3vw", size: "34px", rotate: 0 },
  { id: "z4", kind: "triangle", color: "yellow", top: "382vh", right: "3vw", size: "36px", rotate: -10 },
  { id: "z5", kind: "wave", color: "pink", top: "455vh", left: "3vw", size: "44px", rotate: 10 },
];
