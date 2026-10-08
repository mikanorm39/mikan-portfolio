import type { InkColor, SymbolKind } from "./splatConfig";
import styles from "./Splat.module.css";

/**
 * ゲーム風の小さな記号。濃い紫の硬い影（右下にずらした同じ形）を後ろに敷く。
 * ドット絵の記号は1マス＝1の格子で描き、くっきり見せる（shape-rendering: crispEdges）。
 */

// ドット絵の格子（X = 記号の色、o = オレンジ、w = 白、D = 濃い紫、. = 空き）
const PIXEL_ART: Partial<Record<SymbolKind, string[]>> = {
  heart: [
    ".XX.XX.",
    "XwXXXXX",
    "XXXXXXX",
    "XXXXXXX",
    ".XXXXX.",
    "..XXX..",
    "...X...",
  ],
  coin: [
    "..XXXX..",
    ".XwXXXX.",
    "XwXooXXX",
    "XXXooXXX",
    "XXXooXXX",
    "XXXooXXX",
    ".XXXXXX.",
    "..XXXX..",
  ],
  // オリジナルのキャラ（丸い頭にアンテナ、足が2本）
  chara: [
    "...X..X...",
    "....XX....",
    "..XXXXXX..",
    ".XXXXXXXX.",
    "XXwDXXwDXX",
    "XXXXXXXXXX",
    "XXXooooXXX",
    ".XXXXXXXX.",
    ".XX....XX.",
  ],
};

const SHADOW = "var(--ink-deep)";

function PixelArt({ rows, color }: { rows: string[]; color: string }) {
  const w = rows[0].length;
  const h = rows.length;
  const fillOf = (c: string) =>
    c === "X" ? color : c === "o" ? "var(--ink-orange)" : c === "w" ? "var(--ink-highlight)" : SHADOW;
  const cells = rows.flatMap((row, y) => [...row].map((c, x) => ({ c, x, y })).filter((p) => p.c !== "."));
  return (
    <svg viewBox={`0 0 ${w + 1} ${h + 1}`} className={styles.symbolSvg} shapeRendering="crispEdges">
      {/* 硬い影：右下に1マスずらす */}
      {cells.map((p) => (
        <rect key={`s${p.x}-${p.y}`} x={p.x + 1} y={p.y + 1} width={1.02} height={1.02} fill={SHADOW} />
      ))}
      {cells.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1.02} height={1.02} fill={fillOf(p.c)} />
      ))}
    </svg>
  );
}

/** 線や形の記号：同じ形を影の色で右下にずらして重ねる */
function Vector({ viewBox, children }: { viewBox: string; children: (color: string) => React.ReactNode }) {
  return (
    <svg viewBox={viewBox} className={styles.symbolSvg}>
      <g transform="translate(2.5 2.5)">{children(SHADOW)}</g>
      {children("currentColor")}
    </svg>
  );
}

export function PixelSymbol({ kind, color }: { kind: SymbolKind; color: InkColor }) {
  const ink = `var(--ink-${color})`;
  const art = PIXEL_ART[kind];
  if (art) return <PixelArt rows={art} color={ink} />;

  return (
    <span style={{ color: ink, display: "block" }}>
      {kind === "plus" && (
        <Vector viewBox="0 0 26 26">
          {(c) => <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" fill={c} />}
        </Vector>
      )}
      {kind === "wave" && (
        <Vector viewBox="0 0 60 26">
          {(c) => (
            <path d="M4 14q6-10 12 0t12 0t12 0t12 0" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
          )}
        </Vector>
      )}
      {kind === "zigzag" && (
        <Vector viewBox="0 0 60 30">
          {(c) => (
            <path d="M4 22L14 6L24 22L34 6L44 22L54 6" fill="none" stroke={c} strokeWidth={5} strokeLinejoin="miter" />
          )}
        </Vector>
      )}
      {kind === "triangle" && (
        <Vector viewBox="0 0 46 44">
          {(c) => (
            <g>
              <path d="M23 3L43 39H3z" fill={c} />
              {/* 中の細かい模様（影の色のときは描かない） */}
              {c !== SHADOW && (
                <g stroke={SHADOW} strokeWidth={1.4} strokeLinecap="round">
                  <path d="M20 18l3 3M26 24l2-3M15 30l4 1M28 32l3 2M22 28l-2 3M31 26l3-1" />
                </g>
              )}
            </g>
          )}
        </Vector>
      )}
      {kind === "hatch" && (
        <Vector viewBox="0 0 36 36">
          {(c) => (
            <path d="M4 20L20 4M4 28L28 4M8 32L32 8M16 32L32 16" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" />
          )}
        </Vector>
      )}
      {kind === "dots" && (
        <Vector viewBox="0 0 40 20">
          {(c) => (
            <g fill="none" stroke={c} strokeWidth={4}>
              <circle cx={9} cy={10} r={5} />
              <circle cx={29} cy={10} r={5} />
            </g>
          )}
        </Vector>
      )}
    </span>
  );
}
