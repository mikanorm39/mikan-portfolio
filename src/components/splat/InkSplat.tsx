import type { InkColor } from "./splatConfig";
import { SPLAT_CX, SPLAT_CY, SPLAT_SHAPES, SPLAT_SHAPES_SM, SPLAT_VIEWBOX, SPLAT_VIEWBOX_CROP } from "./splatShapes";
import styles from "./Splat.module.css";

type Props = {
  /** 形の番号（splatShapes.ts） */
  shape: number;
  color: InkColor;
  rotate?: number;
  /** "sm" = 小さいインク用の形（枝が少なく太い。カーソル・ナビの背景用） */
  size?: "md" | "sm";
  /** true = 中心の塊がちょうど収まる範囲で表示（枝や水滴は外にはみ出す） */
  crop?: boolean;
  /** true = 縦横の比率を無視して入れ物いっぱいに伸ばす（横長の文字の背景用） */
  stretch?: boolean;
};

const toViewBox = (v: { x: number; y: number; w: number; h: number }) => `${v.x} ${v.y} ${v.w} ${v.h}`;
const VB = toViewBox(SPLAT_VIEWBOX);
const VB_CROP = toViewBox(SPLAT_VIEWBOX_CROP);

/**
 * インク1つ分の SVG。ベタ塗り＋白いツヤ。
 * 水滴（.drop）とドリップ（.drip）は、親に .hit が付いたときに飛び出す／垂れるアニメーションをする（Splat.module.css）。
 */
export function InkSplat({ shape, color, rotate = 0, size = "md", crop = false, stretch = false }: Props) {
  const shapes = size === "sm" ? SPLAT_SHAPES_SM : SPLAT_SHAPES;
  const s = shapes[shape % shapes.length];
  const fill = `var(--ink-${color})`;

  return (
    <svg
      viewBox={crop ? VB_CROP : VB}
      preserveAspectRatio={stretch ? "none" : undefined}
      className={crop ? styles.svgCrop : styles.svg}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
      aria-hidden="true"
    >
      {/* 本体：中心の塊＋枝（同じ色なのでつながって1つのインクに見える） */}
      <g fill={fill}>
        <path d={s.core} />
        {s.lobes.map((l, i) => (
          <circle key={i} cx={l.cx} cy={l.cy} r={l.r} />
        ))}
        {s.arms.map((a, i) => (
          <g key={i}>
            {/* 根元の太い部分 → 先端までの細い部分 → 先端の玉 */}
            <line x1={SPLAT_CX} y1={SPLAT_CY} x2={a.bx} y2={a.by} stroke={fill} strokeWidth={a.bw} strokeLinecap="round" />
            <line x1={SPLAT_CX} y1={SPLAT_CY} x2={a.x2} y2={a.y2} stroke={fill} strokeWidth={a.w} strokeLinecap="round" />
            <circle cx={a.x2} cy={a.y2} r={a.tipR} />
          </g>
        ))}
      </g>

      {/* ドリップ：上端から下へ伸びる */}
      {s.drips.map((d, i) => (
        <g key={i} className={styles.drip} fill={fill}>
          <line x1={d.x} y1={d.y1} x2={d.x} y2={d.y2} stroke={fill} strokeWidth={d.w} strokeLinecap="round" />
          <circle cx={d.x} cy={d.y2} r={d.bulb} />
          <ellipse cx={d.x - d.bulb * 0.3} cy={d.y2 - d.bulb * 0.3} rx={d.bulb * 0.3} ry={d.bulb * 0.18} fill="var(--ink-highlight)" />
        </g>
      ))}

      {/* 白いツヤ（ぷっくり濡れた感じ） */}
      <g fill="var(--ink-highlight)">
        {s.shines.arcs.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="var(--ink-highlight)" strokeWidth={4.5} strokeLinecap="round" />
        ))}
        {s.shines.dots.map((d, i) => (
          <ellipse key={i} cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry} transform={`rotate(${d.rot} ${d.cx} ${d.cy})`} />
        ))}
      </g>

      {/* 水滴：着弾と同時に中心から外へ飛び出して止まる（--dx/--dy = 中心側へ戻した位置） */}
      {s.drops.map((d, i) => (
        <g
          key={i}
          className={styles.drop}
          // 小さいインク（カーソル・ナビ）でも水滴を飛ばすための目印（InkUi.module.css）
          data-ink-drop=""
          style={
            {
              "--dx": `${Math.round((SPLAT_CX - d.cx) * 0.85)}px`,
              "--dy": `${Math.round((SPLAT_CY - d.cy) * 0.85)}px`,
              "--i": i,
            } as React.CSSProperties
          }
        >
          <ellipse cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry} fill={fill} transform={`rotate(${d.rot} ${d.cx} ${d.cy})`} />
          {d.rx > 5 && (
            <ellipse cx={d.cx - d.rx * 0.3} cy={d.cy - d.ry * 0.35} rx={d.rx * 0.28} ry={d.ry * 0.2} fill="var(--ink-highlight)" />
          )}
        </g>
      ))}
    </svg>
  );
}
