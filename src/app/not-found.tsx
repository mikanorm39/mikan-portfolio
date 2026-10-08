import type { Metadata } from "next";
import Link from "next/link";
import { House } from "lucide-react";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは見つかりませんでした。",
  robots: { index: false },
};

/** 迷子になったみかんのキャラクター（仮のイラスト） */
function LostMikan() {
  return (
    <svg viewBox="0 0 240 220" className="h-auto w-56 sm:w-64" role="img" aria-label="迷子になって首をかしげるみかんのキャラクター">
      <ellipse cx="120" cy="204" rx="70" ry="10" className="fill-primary/15" />
      <g transform="rotate(-8 120 120)">
        <circle cx="120" cy="122" r="76" fill="#ff9f1c" />
        <circle cx="96" cy="96" r="22" fill="#ffd27a" opacity="0.6" />
        <path d="M120 48c-2-14 5-24 14-28" stroke="#4d7c0f" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M125 40c12-17 38-17 48-7-12 14-34 17-48 7z" fill="#65a30d" />
        {/* ぐるぐる目 */}
        <path d="M88 118a8 8 0 1 1 8 8a4 4 0 1 1 4-4" stroke="#0f2342" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M140 118a8 8 0 1 1 8 8a4 4 0 1 1 4-4" stroke="#0f2342" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="78" cy="142" rx="10" ry="6" fill="#fb7185" opacity="0.55" />
        <ellipse cx="166" cy="142" rx="10" ry="6" fill="#fb7185" opacity="0.55" />
        <path d="M108 154q12 -8 24 0" stroke="#0f2342" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* 汗 */}
        <path d="M190 84q8 12 0 18q-8 -6 0 -18z" fill="#7dd3fc" />
      </g>
      <text x="206" y="52" fontSize="44" fontWeight="800" className="fill-primary">
        ?
      </text>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="animate-float">
        <LostMikan />
      </div>
      <p className="ink-heading mt-8 font-pixel text-6xl">404</p>
      <h1 className="text-on-bg mt-3 font-heading text-2xl font-extrabold sm:text-3xl">ページが見つかりませんでした</h1>
      <p className="mt-3 text-on-bg-muted">
        URL が間違っているか、ページが移動・削除されたのかもしれません。
      </p>
      <Link
        href="/"
        className="pixel-button bg-pop-gradient group mt-8 inline-flex items-center gap-2 px-6 py-3 font-bold"
      >
        <House className="size-4 group-hover:animate-wiggle" aria-hidden="true" />
        トップへ戻る
      </Link>
    </div>
  );
}
