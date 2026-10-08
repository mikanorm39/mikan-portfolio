/**
 * ドット絵の記号がインクと重ならないように、記号をずらす量を計算する。
 * 記号もインクも画面の幅・高さに合わせて位置と大きさが変わるので、表示したあとに実際の位置で計算する。
 */
import { SPLAT_CX, SPLAT_CY, SPLAT_VIEWBOX as VB } from "./splatShapes";

/** インクの範囲（形データの単位。中心の塊＋枝＋まわりの水滴まで含めたおおよその半径） */
const INK_REACH = 115;
/** インクとの間にあける余白（px） */
const GAP = 8;
/** 画面の左右の端から記号を離す距離（px） */
const EDGE = 8;

/** 記号ごとのずらす量（px）。null は「どこに動かしても重なるので出さない」 */
export type Nudges = Record<string, { x: number; y: number } | null>;

type Circle = { x: number; y: number; r: number };

/** インクの置き場所（要素の四角）→ インクの範囲の円 */
function inkCircle(rect: DOMRect): Circle {
  const ux = rect.width / VB.w; // 形データ1単位あたりの px
  return {
    x: rect.left + (SPLAT_CX - VB.x) * ux,
    y: rect.top + (SPLAT_CY - VB.y) * (rect.height / VB.h),
    r: INK_REACH * ux,
  };
}

/**
 * layer の中のインク（data-splat-id）と記号（data-kind="symbol"）の位置から、記号をずらす量を求める。
 * current は今ずらしている量（計算のときは元の位置に戻して考える）。
 */
export function computeNudges(layer: HTMLElement, current: Nudges): Nudges {
  const visible = (el: HTMLElement) => el.offsetParent !== null; // スマホで非表示のものは除く
  const inks = [...layer.querySelectorAll<HTMLElement>("[data-splat-id]:not([data-kind])")]
    .filter(visible)
    .map((el) => inkCircle(el.getBoundingClientRect()));
  const width = layer.clientWidth;
  const result: Nudges = {};

  for (const el of layer.querySelectorAll<HTMLElement>('[data-kind="symbol"]')) {
    if (!visible(el)) continue;
    const id = el.dataset.splatId!;
    const rect = el.getBoundingClientRect();
    const prev = current[id] ?? { x: 0, y: 0 };
    // 元の位置（今のずらしを戻した位置）の中心と、記号の外接円の半径
    const baseX = rect.left + rect.width / 2 - prev.x;
    const baseY = rect.top + rect.height / 2 - prev.y;
    const half = Math.hypot(rect.width, rect.height) / 2;
    const left = layer.getBoundingClientRect().left;

    let x = baseX;
    let y = baseY;
    const overlaps = () => inks.some((k) => Math.hypot(x - k.x, y - k.y) < k.r + half + GAP);

    // 重なっているインクから離れる方向へ押し出す（押し出した先で別のインクに当たることもあるので数回くり返す）
    for (let i = 0; i < 8 && overlaps(); i++) {
      for (const k of inks) {
        const need = k.r + half + GAP;
        const d = Math.hypot(x - k.x, y - k.y);
        if (d >= need) continue;
        const dx = d < 1 ? 0 : (x - k.x) / d;
        const dy = d < 1 ? 1 : (y - k.y) / d;
        x = k.x + dx * need;
        y = k.y + dy * need;
      }
      // 画面の外に出ないように
      x = Math.min(Math.max(x, left + EDGE + half), left + width - EDGE - half);
    }

    result[id] = overlaps() ? null : { x: Math.round(x - baseX), y: Math.round(y - baseY) };
  }
  return result;
}
