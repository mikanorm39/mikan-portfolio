/**
 * インク発射型ローディングの Canvas 描画まわり。
 * スプラッシュの形は背景のインク（splatShapes.ts）と同じデータを Canvas 用の Path2D に変換して使う。
 */
import { SPLAT_CX, SPLAT_CY, SPLAT_SHAPES } from "@/components/splat/splatShapes";
import { INK_COLORS, INK_SHOTS, INK_SIZE, INK_TIMING as T } from "./inkLoadingConfig";

/** Canvas 用に変換したスプラッシュの形 */
export type CanvasSplat = {
  /** 中心の塊・こぶ・枝の先の玉・水滴（塗りつぶし） */
  fill: Path2D;
  /** 枝（太さごとに線で描く） */
  strokes: { path: Path2D; width: number }[];
};

/** 形の中心の塊の半径（splatShapes.ts の R）。大きさの計算に使う */
const SHAPE_R = 48;

/** 背景のインクの形データ → Canvas の Path2D（ブラウザでだけ作る） */
export function buildCanvasSplats(): CanvasSplat[] {
  return SPLAT_SHAPES.map((s) => {
    const fill = new Path2D(s.core);
    // どの部品も同じ向き（時計回り）で足すので、重なっても穴にならず1つの形になる
    for (const l of s.lobes) {
      fill.moveTo(l.cx + l.r, l.cy);
      fill.arc(l.cx, l.cy, l.r, 0, Math.PI * 2);
    }
    for (const a of s.arms) {
      fill.moveTo(a.x2 + a.tipR, a.y2);
      fill.arc(a.x2, a.y2, a.tipR, 0, Math.PI * 2);
    }
    for (const d of s.drops) {
      const rot = (d.rot * Math.PI) / 180;
      fill.moveTo(d.cx + d.rx * Math.cos(rot), d.cy + d.rx * Math.sin(rot));
      fill.ellipse(d.cx, d.cy, d.rx, d.ry, rot, 0, Math.PI * 2);
    }
    const strokes = s.arms.flatMap((a) => {
      const base = new Path2D();
      base.moveTo(SPLAT_CX, SPLAT_CY);
      base.lineTo(a.bx, a.by);
      const arm = new Path2D();
      arm.moveTo(SPLAT_CX, SPLAT_CY);
      arm.lineTo(a.x2, a.y2);
      return [
        { path: base, width: a.bw },
        { path: arm, width: a.w },
      ];
    });
    return { fill, strokes };
  });
}

/** スプラッシュを1つ描く（塗り or 穴あけは呼ぶ側の globalCompositeOperation で決まる） */
export function drawSplat(
  ctx: CanvasRenderingContext2D,
  shape: CanvasSplat,
  x: number,
  y: number,
  scale: number,
  rotate: number,
) {
  if (scale <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.scale(scale, scale);
  ctx.translate(-SPLAT_CX, -SPLAT_CY);
  ctx.fill(shape.fill, "nonzero");
  for (const s of shape.strokes) {
    ctx.lineWidth = s.width;
    ctx.stroke(s.path);
  }
  ctx.restore();
}

/** 飛んでいるインク：進行方向に引き伸ばしたしずく形＋小さなツヤ */
export function drawProjectile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  r: number,
  color: string,
  shine: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  // 先端は丸く、後ろに向かって細くなる
  ctx.ellipse(0, 0, r * 1.25, r, 0, 0, Math.PI * 2);
  ctx.moveTo(-r * 0.4, -r * 0.75);
  ctx.quadraticCurveTo(-r * 2.6, 0, -r * 0.4, r * 0.75);
  ctx.fill();
  ctx.fillStyle = shine;
  ctx.beginPath();
  ctx.ellipse(r * 0.35, -r * 0.4, r * 0.35, r * 0.18, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 着弾して広がる大きさの変化：0 → 1.2 → 1（u は 0〜1） */
export function splatCurve(u: number) {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  const peak = 0.55;
  if (u < peak) {
    const t = u / peak;
    return 1.2 * (1 - (1 - t) * (1 - t)); // 勢いよく広がる
  }
  const t = (u - peak) / (1 - peak);
  return 1.2 - 0.2 * (t * t * (3 - 2 * t)); // 少し戻る
}

/** 1発分の予定。位置は画面に対する割合（0〜1、外は画面外）なので、リサイズしても同じ場所に着弾する */
export type Shot = {
  launchAt: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** 大きさ（格子の1マスの対角線の半分に対する倍率） */
  size: number;
  color: (typeof INK_COLORS)[number];
  shape: number;
  rotate: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

/** 画面の外（上下左右・斜め）の発射地点 */
function offscreenStart(): { x: number; y: number } {
  const side = Math.floor(Math.random() * 8);
  const out = rand(0.12, 0.2);
  const along = rand(0, 1);
  switch (side) {
    case 0: return { x: along, y: -out }; // 上
    case 1: return { x: along, y: 1 + out }; // 下
    case 2: return { x: -out, y: along }; // 左
    case 3: return { x: 1 + out, y: along }; // 右
    case 4: return { x: -out, y: -out }; // 左上
    case 5: return { x: 1 + out, y: -out }; // 右上
    case 6: return { x: -out, y: 1 + out }; // 左下
    default: return { x: 1 + out, y: 1 + out }; // 右下
  }
}

/** 格子の列数・行数（画面の縦横比に合わせて、だいたい正方形のマスにする） */
export function gridFor(width: number, height: number, count: number) {
  const aspect = width / Math.max(1, height);
  const cols = Math.max(2, Math.round(Math.sqrt(count * aspect)));
  const rows = Math.max(2, Math.ceil(count / cols));
  return { cols, rows };
}

/** 1マスの対角線の半分（px）→ スプラッシュの大きさの基準 */
export function cellRadius(width: number, height: number, cols: number, rows: number) {
  return Math.hypot(width / cols, height / rows) / 2;
}

/** 形の倍率（px の半径 → 形データの倍率） */
export const radiusToScale = (radiusPx: number) => radiusPx / SHAPE_R;

/**
 * 発射の予定を作る。
 * - 通常のインク：格子の各マスの中心付近（少しずらす）を、ランダムな順番で
 * - 最後の大きめのインク：四隅と格子の交点（白が残りやすい場所）へ
 * - 発射の間隔は最初は長く、だんだん短くなる（テンポが上がる）
 */
export function planShots(width: number, height: number) {
  const mobile = width < INK_SHOTS.mobileMaxWidth;
  const count = mobile ? INK_SHOTS.mobile : INK_SHOTS.desktop;
  const finale = mobile ? INK_SHOTS.finaleMobile : INK_SHOTS.finaleDesktop;
  const { cols, rows } = gridFor(width, height, count);

  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: (c + 0.5 + rand(-INK_SIZE.scatter, INK_SIZE.scatter)) / cols,
        y: (r + 0.5 + rand(-INK_SIZE.scatter, INK_SIZE.scatter)) / rows,
      });
    }
  }
  cells.sort(() => Math.random() - 0.5);

  const shots: Shot[] = cells.map((to, i) => ({
    launchAt: T.startDelayMs + T.launchSpanMs * Math.pow(i / cells.length, T.tempoCurve),
    from: offscreenStart(),
    to,
    size: INK_SIZE.splat * (1 + rand(-INK_SIZE.jitter, INK_SIZE.jitter)),
    color: pick(INK_COLORS),
    shape: Math.floor(Math.random() * 6),
    rotate: rand(0, Math.PI * 2),
  }));

  // 最後の大きめのインク：四隅を優先し、残りは格子の交点からランダムに
  const corners = [
    { x: 0.04, y: 0.04 },
    { x: 0.96, y: 0.04 },
    { x: 0.04, y: 0.96 },
    { x: 0.96, y: 0.96 },
  ];
  const joints: { x: number; y: number }[] = [];
  for (let r = 1; r < rows; r++) for (let c = 1; c < cols; c++) joints.push({ x: c / cols, y: r / rows });
  joints.sort(() => Math.random() - 0.5);
  const finaleTargets = [...corners, ...joints].slice(0, finale);
  const lastLaunch = shots.reduce((m, s) => Math.max(m, s.launchAt), 0);
  finaleTargets.forEach((to, i) => {
    shots.push({
      launchAt: lastLaunch + T.finaleGapMs + i * T.finaleIntervalMs,
      from: offscreenStart(),
      to,
      size: INK_SIZE.finale * (1 + rand(-INK_SIZE.jitter, INK_SIZE.jitter)),
      color: pick(INK_COLORS),
      shape: Math.floor(Math.random() * 6),
      rotate: rand(0, Math.PI * 2),
    });
  });

  const endsAt = shots.reduce((m, s) => Math.max(m, s.launchAt), 0) + T.flightMs + T.splatMs;
  return { shots, cols, rows, endsAt };
}
