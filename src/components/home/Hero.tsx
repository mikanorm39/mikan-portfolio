"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useRevealGate } from "@/components/opening/OpeningContext";
import { navItems } from "@/components/layout/nav";
import { heroContainer, heroItem } from "@/lib/motion";
import styles from "./Hero.module.css";

// ===== 書き換え用の定数（タイトル・サブタイトル） =====
/** タイトル。単語ごとに分けておくと、スマホで入りきらないときに単語の区切りで2行になる */
const TITLE_WORDS = ["Mikan", "Nishioka"];
const SUBTITLE = "Portfolio";

/** メニュー：ヘッダーと同じページのうち、今いるトップ以外（Work / About）。外部リンク（CLUB など）はヘッダーのメニュー ☰ の中 */
const MENU = navItems.filter((item) => item.href !== "/");

/** トップのファーストビュー。ゲームのタイトル画面風に、タイトル → サブタイトル → メニューを中央に並べる */
export function Hero() {
  const { heroAnimate } = useRevealGate();
  const reduce = useReducedMotion();
  const item = heroItem(reduce);

  // 選択中のメニュー（ホバー・フォーカス・↑↓キーで変わる）。スマホ用に最初は一番上を選んでおく
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
          <span className={styles.chevron} aria-hidden="true">
            &gt;
          </span>{" "}
          {SUBTITLE}{" "}
          <span className={styles.chevron} aria-hidden="true">
            &lt;
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
                  className={`pixel-chip ${styles.item}`}
                  data-selected={selected === i}
                  onPointerEnter={() => setSelected(i)}
                  onPointerDown={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
                >
                  <span className={styles.cursor} aria-hidden="true">
                    ➤
                  </span>
                  <span className={styles.label}>{m.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>
    </section>
  );
}
