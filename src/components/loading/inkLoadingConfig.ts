/**
 * インク発射型ローディング（InkLoadingScreen）の設定。発射の数・テンポ・時間・大きさ・色はここで調整する。
 * （どちらのローディングを使うかの切り替えは loadingConfig.ts の LOADING_VARIANT）
 */
import type { InkColor } from "@/components/splat/splatConfig";

/** 発射の数（画面いっぱいに格子状に割り振る）。スマホは少なく、そのぶん1つずつを大きくする */
export const INK_SHOTS = {
  desktop: 12,
  mobile: 7,
  /** 最後に、残った白い部分（四隅・すき間）へ撃つ大きめのインクの数 */
  finaleDesktop: 4,
  finaleMobile: 3,
  /** これより狭い画面はスマホ扱い（px） */
  mobileMaxWidth: 640,
} as const;

/** 時間（ミリ秒） */
export const INK_TIMING = {
  /** 白い画面を出してから最初の発射まで */
  startDelayMs: 250,
  /** 最初の発射から最後の発射まで（通常のインク） */
  launchSpanMs: 1550,
  /**
   * テンポの上がり方（0〜1）。小さいほど「最初はゆっくり、後半は一気に」になる。
   * 発射時刻 = launchSpanMs × (n / 数) ^ tempoCurve
   */
  tempoCurve: 0.5,
  /** インクが飛んでいる時間 */
  flightMs: 300,
  /** 着弾して広がる時間（0 → 1.2 → 1） */
  splatMs: 300,
  /** 最後の大きめのインクを撃ち始めるまでの、通常の最後の発射からの間 */
  finaleGapMs: 120,
  /** 最後の大きめのインク同士の間隔 */
  finaleIntervalMs: 50,
  /** 全部着弾してから、ふち取りや残りの白をフェードアウトし始めるまで */
  holdMs: 120,
  /** フェードアウトの時間（終わったら onComplete） */
  fadeMs: 400,
  /** 動きを減らす設定のとき：白い画面を見せる時間 */
  reducedHoldMs: 300,
} as const;

/** 大きさ */
export const INK_SIZE = {
  /** スプラッシュの大きさ（格子の1マスの対角線の半分に対する倍率） */
  splat: 1.0,
  /** 最後の大きめのインクの大きさ（同じく倍率） */
  finale: 1.8,
  /** 1つずつの大きさのばらつき（±） */
  jitter: 0.15,
  /** 着弾地点を格子の中心からずらす量（マスの大きさに対する割合） */
  scatter: 0.3,
  /** 飛んでいるインクの大きさ（画面の短い辺に対する割合） */
  projectile: 0.03,
  /** 穴のふちに残すインク色のふち取りの太さ（px。0 = なし）。インクの大きさに関係なく細く控えめに */
  rimPx: 0,
  /** ふち取りの濃さ */
  rimAlpha: 0.9,
} as const;

/** 使うインクの色（globals.css の --ink-○○） */
export const INK_COLORS: InkColor[] = ["yellow", "pink", "mint", "cyan", "orange"];
