/**
 * ローディング画面の設定。タイミング・揺れの強さ・雷の出発地点はここで調整する。
 * （色は LoadingScreen.module.css の先頭にある CSS 変数で調整）
 */

/** 開発中に待ちたくないときは false にする（ローディングを出さずに本体をすぐ表示） */
export const SHOW_LOADING = true;

/** 時間（ミリ秒） */
export const LOADING_TIMING = {
  /** 表示してから最初の雷が出るまで */
  boltStartDelayMs: 200,
  /** 雷を1つずつ出す間隔 */
  boltIntervalMs: 140,
  /** 雷が画面端から中央に届くまで */
  boltTravelMs: 650,
  /** 雷が届いたときに WiFi マークの色が増える時間 */
  fillStepMs: 220,
  /** 雷が届いたときの揺れ */
  wobbleMs: 300,
  /** 満タンになったときに光る時間（この後に画面が開ける） */
  flashMs: 450,
  /** 波線の境目が下から上へ抜けていく時間 */
  revealMs: 950,
  /** 波が横に1周揺れる時間 */
  waveCycleMs: 1400,
  /** 動きを減らす設定のとき：表示しておく時間とフェードアウトの時間 */
  reducedHoldMs: 500,
  reducedFadeMs: 400,
} as const;

/** 雷が届いたときの揺れ（-角度 → +角度 → -角度/2 → 0 と往復する） */
export const WOBBLE = {
  angleDeg: 6,
  scale: 1.05,
} as const;

/**
 * 雷の出発地点（画面中央からのずれ）。並び順 = 出てくる順。
 * vw / vh で指定しているので、どの画面サイズでも画面の端から出てくる。
 * size は雷の大きさの倍率（1 = 基本の大きさ。基本の大きさは CSS の --ls-bolt-size）。
 */
export const BOLT_STARTS = [
  { x: "-48vw", y: "-46vh", size: 3 }, // 左上
  { x: "52vw", y: "18vh", size: 1 }, // 右
  { x: "0vw", y: "-54vh", size: 2 }, // 上
  { x: "-46vw", y: "48vh", size: 1 }, // 左下
  { x: "48vw", y: "-46vh", size: 1 }, // 右上
  { x: "-54vw", y: "-14vh", size: 2.5 }, // 左
  { x: "46vw", y: "48vh", size: 1.5 }, // 右下
  { x: "0vw", y: "54vh", size: 1 }, // 下
  { x: "54vw", y: "-14vh", size: 1 }, // 右（少し上）
  { x: "-54vw", y: "20vh", size: 3 }, // 左（少し下）
] as const;
