import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getSkillsByCategory, skillLevelLabels, type SkillIcon, type SkillLevel } from "@/data/skills";
import styles from "./Skills.module.css";

// ===== ドット絵の星 =====
/** 星の形（# = 塗るマス）。9×9 マス */
const STAR_MAP = [
  "....#....",
  "...###...",
  "...###...",
  "#########",
  ".#######.",
  "..#####..",
  "..##.##..",
  ".##...##.",
  "##.....##",
];
const STAR_SIZE = STAR_MAP.length;
const isStar = (x: number, y: number) => STAR_MAP[y]?.[x] === "#";

/** 塗りつぶしの星：形のマスすべて */
const FILLED_CELLS = STAR_MAP.flatMap((row, y) => [...row].flatMap((c, x) => (c === "#" ? [[x, y]] : [])));
/** 空の星：形のふちのマスだけ（上下左右のどれかが形の外） */
const EMPTY_CELLS = FILLED_CELLS.filter(
  ([x, y]) => !isStar(x - 1, y) || !isStar(x + 1, y) || !isStar(x, y - 1) || !isStar(x, y + 1),
);
/** マスの一覧 → 1本の path（四角を並べる） */
const toPath = (cells: number[][]) => cells.map(([x, y]) => `M${x} ${y}h1v1h-1z`).join("");
const FILLED_PATH = toPath(FILLED_CELLS);
const EMPTY_PATH = toPath(EMPTY_CELLS);

function PixelStar({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${STAR_SIZE} ${STAR_SIZE}`}
      className={`size-4 shrink-0 ${styles.star}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      // 輪郭線と硬い影は Skills.module.css（黄色のインクの上でも形が分かるように）
      style={{ fill: "var(--ink-yellow)" }}
    >
      <path d={filled ? FILLED_PATH : EMPTY_PATH} />
    </svg>
  );
}

/** 習熟度の星3つ。読み上げでは「習熟度：よく使う」と読む */
function LevelStars({ level }: { level: SkillLevel }) {
  return (
    <span role="img" aria-label={`習熟度：${skillLevelLabels[level]}`} className="inline-flex shrink-0 gap-0.5">
      {[1, 2, 3].map((n) => (
        <PixelStar key={n} filled={n <= level} />
      ))}
    </span>
  );
}

/** 星の意味（凡例）。見出しの「使えるツール」の横に出す */
function LevelLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-on-bg-muted" aria-label="習熟度の見方">
      {([3, 2, 1] as const).map((level) => (
        <li key={level} className="flex items-center gap-2">
          <LevelStars level={level} />
          <span className={styles.text} aria-hidden="true">{skillLevelLabels[level]}</span>
        </li>
      ))}
    </ul>
  );
}

// ===== ツールのアイコン =====
/**
 * フルカラーの公式ロゴ。ロゴ自体には縁取り・影などの加工をしない。
 * どのアイコンも同じ大きさの枠（36px）に、ロゴを同じ大きさ（28px・比率はそのまま）で入れる。
 * 黒っぽいロゴ（backing）は、後ろに白い角丸の下地を敷いて見えるようにする。
 * ホバーしたら、どのアイコンも少しだけ大きくなる（動きを減らす設定では大きくならない）。
 */
function ToolIcon({ name, icon }: { name: string; icon: SkillIcon | null }) {
  return (
    <span
      className={`inline-grid size-9 shrink-0 place-items-center rounded-md transition-transform duration-200 motion-safe:group-hover:scale-110 ${icon?.backing ? "bg-white" : ""}`}
      aria-hidden="true"
    >
      {icon ? (
        <Image src={icon.src} alt="" width={28} height={28} className="size-7 object-contain" />
      ) : (
        // ロゴが見つからないツールは、頭文字の四角で代用する（ロゴは自作しない）
        <span
          className={`${styles.fallbackIcon} inline-grid size-7 place-items-center rounded-[3px] border-2 border-current font-heading text-sm leading-none font-extrabold text-on-bg`}
        >
          {name[0]}
        </span>
      )}
    </span>
  );
}

export function Skills() {
  const categories = getSkillsByCategory();

  return (
    <section className={`${styles.root} mx-auto max-w-6xl px-4 py-section sm:px-6`}>
      {/* セクションの後ろに敷く、半透明の濃い紫の下地（ピクセル角） */}
      <div className={styles.plate} aria-hidden="true" />

      {/* 文字のエリア。背景のインクはここに重ならないよう、左右の端へよける（SplatBackground.tsx） */}
      <div data-ink-avoid>
        {/* 小見出し「使えるツール」の横に、星の意味（凡例）を並べる */}
        <SectionHeading
          title="Skills"
          description="使えるツール"
          descriptionAside={<LevelLegend />}
          ink={{ color: "yellow", trigger: "tap" }}
        />
  
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.id}>
              {/* カテゴリ名（小さめの見出し）＋右へのびる点線 */}
              <Reveal className="flex items-center gap-4">
                <h3 className={`${styles.text} font-heading text-h3 font-bold text-on-bg`}>{category.label}</h3>
                <span className="h-0 flex-1 border-t-2 border-dashed border-white/30" aria-hidden="true" />
              </Reveal>
  
              {/* ツールの行（PC は2列、スマホは1列）。行が順番にふわっと出る */}
              <RevealGroup as="ul" stagger={0.06} className="mt-2 grid md:grid-cols-2 md:gap-x-12">
                {category.skills.map((skill) => (
                  <RevealItem
                    as="li"
                    key={skill.name}
                    className="group flex items-start gap-4 border-b border-dashed border-white/25 py-4"
                  >
                    <ToolIcon name={skill.name} icon={skill.icon} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`${styles.text} text-lg leading-tight font-bold text-on-bg`}>{skill.name}</span>
                        <LevelStars level={skill.level} />
                      </div>
                      <p className={`${styles.text} mt-1 text-sm text-on-bg-muted`}>{skill.description}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
