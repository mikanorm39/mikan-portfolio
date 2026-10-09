"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useRevealGate } from "@/components/opening/OpeningContext";
import { navItems } from "@/components/layout/nav";
import { InkBehind } from "@/components/splat/InkUi";
import { heroContainer, heroItem } from "@/lib/motion";
import styles from "./Hero.module.css";

// ===== 書き換え用の定数（タイトル・サブタイトル） =====
/** タイトル。単語ごとに分けておくと、スマホで入りきらないときに単語の区切りで2行になる */
const TITLE_WORDS = ["Mikan", "Nishioka"];
const SUBTITLE = "Portfolio";

/**
 * メニュー：Work / About（表示名・色・移動先はヘッダーと同じ）。
 * 押すとそれぞれの専用ページ（/work・/about）へ移動する（移動先のページを開くと、大見出しにインクが着弾する）。
 * 外部リンク（CLUB など）はヘッダーのメニュー ☰ の中。
 */
const MENU = navItems.filter((item) => item.href !== "/");

/** トップのファーストビュー。ゲームのタイトル画面風に、タイトル → サブタイトル → メニューを中央に並べる */
export function Hero() {
  const { heroAnimate } = useRevealGate();
  const reduce = useReducedMotion();
  const item = heroItem(reduce);

  // ↑↓キーで移動するための、今フォーカスしているメニューの番号（インクはホバー・フォーカス・押した瞬間だけ出る）
  const [selected, setSelected] = useState(0);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);

  // ↑↓キーで選択を移動（メニューにフォーカスがあるとき）。Enter はリンク本来の動きで決定になる
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (selected + (e.key === "ArrowDown" ? 1 : -1) + MENU.length) % MENU.length;
    setSelected(next);
    links.current[next]?.focus();
  };

  return (
    <section className={styles.hero}>
      {/* ローディングが終わったら、タイトル → サブタイトル → メニュー の順に出す */}
      <motion.div variants={heroContainer()} initial={false} animate={heroAnimate}>
        <motion.h1 data-reveal variants={item} className={styles.title}>
          {/* 文字（Bello Pro）に水色の縦グラデーションをかける */}
          <span className={styles.titleText}>
            {TITLE_WORDS.map((w, i) => (
              <span key={w}>
                {i > 0 && " "}
                <span className={styles.word}>{w}</span>
              </span>
            ))}
          </span>
        </motion.h1>

        <motion.p data-reveal variants={item} className={styles.subtitle}>
          <span className={styles.subtitleText}>
            {SUBTITLE}
            {/* 文字の下に、筆でサッと引いたようなインクのアンダーバー（ドリップ・水滴・白いツヤ付き） */}
            <svg viewBox="0 0 200 34" className={styles.underline} aria-hidden="true">
              <g fill="var(--hero-underline-color)">
                <path d="M4 9C30 2 62 12 100 7S168 2 196 8C200 13 197 21 189 20C152 17 121 24 90 21S32 24 9 21C1 20 0 13 4 9Z" />
                {/* ドリップ（下に垂れる） */}
                <path d="M64 18h6v9a3 3 0 0 1-6 0z" />
                <circle cx={67} cy={28} r={3.6} />
                <path d="M145 17h5v5a2.5 2.5 0 0 1-5 0z" />
                <circle cx={147.5} cy={23} r={2.9} />
                {/* 周りの水滴 */}
                <circle cx={186} cy={28} r={2.3} />
                <circle cx={16} cy={28} r={1.8} />
                <circle cx={112} cy={29} r={1.5} />
              </g>
              {/* 白いツヤ */}
              <path d="M15 10.5Q42 6.5 74 9" fill="none" stroke="var(--ink-highlight)" strokeWidth={2} strokeLinecap="round" opacity={0.85} />
              <ellipse cx={65.8} cy={26.8} rx={1.2} ry={0.7} fill="var(--ink-highlight)" />
            </svg>
          </span>
        </motion.p>

        <motion.nav data-reveal variants={item} aria-label="ページ">
          <ul className={styles.menu} onKeyDown={onKeyDown}>
            {MENU.map((m, i) => (
              <li key={m.href}>
                <Link
                  ref={(el) => {
                    links.current[i] = el;
                  }}
                  href={m.href}
                  className={`ink-cursor-host ${styles.item}`}
                  onFocus={() => setSelected(i)}
                >
                  {/* カーソルを合わせている間・キーボードで選んだとき・押した瞬間だけ、文字の後ろへインクがぴちゃっと着弾する */}
                  <InkBehind color={m.ink}>
                    <span className={styles.label}>{m.label}</span>
                  </InkBehind>
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>
    </section>
  );
}
