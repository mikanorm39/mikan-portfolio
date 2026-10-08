/**
 * インクのスプラッシュ形を作る。
 * 中心の丸い塊 ＋ 放射状に伸びる太い枝（先が丸い）＋ 周りの水滴 ＋ 下に垂れるドリップ ＋ 白いツヤ。
 * 乱数は種（seed）から作るので、毎回同じ形になる（サーバーとブラウザで形がずれない）。
 */

export type SplatShape = {
  /** 中心の塊（なめらかな閉じた曲線） */
  core: string;
  /** 中心の塊のまわりのこぶ（形をでこぼこにする） */
  lobes: { cx: number; cy: number; r: number }[];
  /** 枝：根元が太く先が細くなる線（根元の太い部分 bx,by,bw）と、先端の丸い玉 */
  arms: { x2: number; y2: number; w: number; tipR: number; bx: number; by: number; bw: number }[];
  /** 周りに飛び散る水滴（中心から外向きに少し伸びた楕円） */
  drops: { cx: number; cy: number; rx: number; ry: number; rot: number }[];
  /** 下に垂れるドリップ（上端は塊の中から始まる） */
  drips: { x: number; y1: number; y2: number; w: number; bulb: number }[];
  /** 白いツヤ：細い曲線と小さな楕円 */
  shines: { arcs: string[]; dots: { cx: number; cy: number; rx: number; ry: number; rot: number }[] };
};

/** 形のバリエーション（増やすときはここに1行足す） */
type Variant = {
  seed: number;
  /** 枝の本数 [最小, 最大] */
  arms: [number, number];
  /** 枝の長さ（中心の塊の半径に対する倍率） */
  armLen: [number, number];
  /** 枝の太さ */
  armW: [number, number];
  /** 水滴の数 */
  drops: [number, number];
  /** ドリップの本数 */
  drips: number;
};

const VARIANTS: Variant[] = [
  { seed: 11, arms: [6, 7], armLen: [1.2, 1.65], armW: [14, 21], drops: [7, 9], drips: 2 },
  { seed: 27, arms: [5, 6], armLen: [1.3, 1.75], armW: [16, 23], drops: [6, 8], drips: 1 },
  { seed: 43, arms: [7, 8], armLen: [1.15, 1.5], armW: [12, 18], drops: [8, 10], drips: 0 },
  { seed: 58, arms: [5, 7], armLen: [1.25, 1.7], armW: [15, 21], drops: [5, 7], drips: 1 },
  { seed: 71, arms: [6, 7], armLen: [1.2, 1.6], armW: [13, 19], drops: [7, 9], drips: 2 },
  { seed: 96, arms: [4, 5], armLen: [1.35, 1.8], armW: [18, 25], drops: [4, 6], drips: 0 },
];

/** 形の種類の数（splatConfig の shape はこの範囲の番号） */
export const SPLAT_SHAPE_COUNT = VARIANTS.length;

/** SVG の表示範囲（中心は 100,100。枝・水滴・ドリップがはみ出さない広さ） */
export const SPLAT_VIEWBOX = { x: -45, y: -45, w: 290, h: 330 };
/** 中心の塊だけがちょうど収まる表示範囲（小さいインク用。枝や水滴は外にはみ出して見える） */
export const SPLAT_VIEWBOX_CROP = { x: 40, y: 40, w: 120, h: 120 };

const CX = 100;
const CY = 100;
const R = 48; // 中心の塊の半径

// 種から毎回同じ乱数列を作る（mulberry32）
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** 点の列を通るなめらかな閉じた曲線（Catmull-Rom → ベジェ） */
function smoothClosed(pts: [number, number][]) {
  const n = pts.length;
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d + "Z";
}

const polar = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
};

function build(v: Variant): SplatShape {
  const rand = rng(v.seed);
  const between = ([a, b]: [number, number]) => a + rand() * (b - a);

  // 中心の塊：少しでこぼこした丸
  const bumps = 10;
  const core = smoothClosed(
    Array.from({ length: bumps }, (_, i) => polar((360 / bumps) * i, R * (0.86 + rand() * 0.24))),
  );

  // こぶ：塊の縁に大きめの丸を重ねて、ぷっくりでこぼこにする
  const lobeCount = 5 + Math.floor(rand() * 3);
  const lobeBase = rand() * 360;
  const lobes = Array.from({ length: lobeCount }, (_, i) => {
    const [cx, cy] = polar(lobeBase + (360 / lobeCount) * i + (rand() - 0.5) * 25, R * (0.78 + rand() * 0.15));
    return { cx: r1(cx), cy: r1(cy), r: r1(R * (0.3 + rand() * 0.16)) };
  });

  // 枝：ほぼ等間隔に放射状。根元は太く（途中まで太い線を重ねる）、先端は丸い玉
  const armCount = Math.round(between(v.arms));
  const base = rand() * 360;
  const arms = Array.from({ length: armCount }, (_, i) => {
    const deg = base + (360 / armCount) * i + (rand() - 0.5) * 30;
    const len = R * between(v.armLen);
    const [x2, y2] = polar(deg, len);
    const [bx, by] = polar(deg, len * 0.6);
    const w = between(v.armW);
    return {
      x2: r1(x2),
      y2: r1(y2),
      w: r1(w),
      tipR: r1(w * (0.7 + rand() * 0.25)),
      bx: r1(bx),
      by: r1(by),
      bw: r1(w * 1.75),
    };
  });

  // 水滴：塊の外側に大小ばらばらに散らす
  const dropCount = Math.round(between(v.drops));
  const drops = Array.from({ length: dropCount }, () => {
    const deg = rand() * 360;
    const [cx, cy] = polar(deg, R * (1.95 + rand() * 0.85));
    const r = 2.5 + rand() * 6.5;
    return { cx: r1(cx), cy: r1(cy), rx: r1(r * 1.3), ry: r1(r), rot: Math.round(deg) };
  });

  // ドリップ：塊の下側から下へ垂れる
  const drips = Array.from({ length: v.drips }, (_, i) => {
    const x = CX + (i === 0 ? -0.25 : 0.3) * R + (rand() - 0.5) * 12;
    const w = 10 + rand() * 5;
    return { x: r1(x), y1: CY + R * 0.4, y2: r1(CY + R + 26 + rand() * 42), w: r1(w), bulb: r1(w * 0.72) };
  });

  // ツヤ：塊の左上に細い弧、その近くと枝の先に小さな楕円
  const [ax, ay] = polar(200, R * 0.68);
  const [bx, by] = polar(248, R * 0.68);
  const [dx, dy] = polar(268, R * 0.62);
  const arcs = [`M${r1(ax)} ${r1(ay)}A${r1(R * 0.68)} ${r1(R * 0.68)} 0 0 1 ${r1(bx)} ${r1(by)}`];
  const dots = [
    { cx: r1(dx), cy: r1(dy), rx: 4.5, ry: 2.8, rot: -25 },
    ...arms.slice(0, 3).map((a) => ({
      cx: r1(a.x2 - a.tipR * 0.32),
      cy: r1(a.y2 - a.tipR * 0.32),
      rx: r1(a.tipR * 0.34),
      ry: r1(a.tipR * 0.2),
      rot: -35,
    })),
  ];

  return { core, lobes, arms, drops, drips, shines: { arcs, dots } };
}

/** すべての形（モジュール読み込み時に1回だけ作る） */
export const SPLAT_SHAPES: SplatShape[] = VARIANTS.map(build);

/**
 * 小さいインク用の形（カーソルやナビの背景）。枝を少なく太く、水滴も少なくして、小さくてもインクに見えるようにする。
 */
const SMALL_VARIANTS: Variant[] = [
  { seed: 5, arms: [4, 4], armLen: [1.25, 1.5], armW: [20, 26], drops: [3, 3], drips: 0 },
  { seed: 19, arms: [5, 5], armLen: [1.2, 1.45], armW: [18, 24], drops: [3, 4], drips: 0 },
  { seed: 33, arms: [3, 4], armLen: [1.3, 1.55], armW: [22, 28], drops: [2, 3], drips: 0 },
];
export const SPLAT_SHAPES_SM: SplatShape[] = SMALL_VARIANTS.map(build);

export { CX as SPLAT_CX, CY as SPLAT_CY };
