import type { Metadata, Viewport } from "next";
import { M_PLUS_Rounded_1c, Zen_Maru_Gothic } from "next/font/google";
import { FloatingTopButton } from "@/components/layout/FloatingTopButton";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LoadingGate } from "@/components/loading/LoadingGate";
import { SplatBackground } from "@/components/splat/SplatBackground";
import { Providers } from "@/components/Providers";
import { profile, siteUrl } from "@/data/profile";
import { OPENING } from "@/lib/motion";
import { typekitScript } from "@/lib/typekit";
import "./globals.css";
// ゲーム風のドット装飾（共通クラスと調整用の CSS 変数）
import "./pixel.css";

const mplusRounded = M_PLUS_Rounded_1c({
  variable: "--font-mplus-rounded",
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
  // 日本語フォントは文字ごとに 100 個以上のファイルに分かれている。全部 preload すると
  // 数 MB を先読みして表示が大幅に遅れるので、ページで使う文字の分だけ読み込ませる。
  // （太字も見出し用のこのフォントで表示する → globals.css）
  preload: false,
});

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  // 本文用は 400 のみ。ウェイトを増やすとファイル数が 120 個ずつ増え、表示が遅くなる
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: profile.siteTitle,
    template: `%s | ${profile.siteTitle}`,
  },
  description: profile.catchCopy,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: profile.siteTitle,
    title: profile.siteTitle,
    description: profile.catchCopy,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#a066ee" },
    { media: "(prefers-color-scheme: dark)", color: "#2a1650" },
  ],
};

// 描画前に実行し、表示済み（または動きを減らす設定）なら <html data-opening="done"> を付ける。
// CSS がそれを見てオープニングを最初から非表示にするので、2回目以降に一瞬映ることがない。
const openingScript = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("${OPENING.storageKey}")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.opening="done"}catch(e){d.dataset.opening="done"}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${mplusRounded.variable} ${zenMaru.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: openingScript }} />
        {/* Adobe Fonts（タイトル：Bello Pro、見出し・ナビ：Bello Caps、本文：M PLUS Rounded 1c）。接続を先に始めて読み込みを早める */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: typekitScript }} />
        <noscript>
          <style>{`[data-opening-overlay]{display:none}`}</style>
        </noscript>
      </head>
      {/* 背景の点の模様を戻すときは className に "pixel-bg" を足す（pixel.css） */}
      <body className="relative flex min-h-dvh flex-col">
        <Providers>
          <a
            href="#main"
            className="sr-only z-50 rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            本文へスキップ
          </a>
          {/* ページを開いたときのローディング（ON/OFF は components/loading/loadingConfig.ts） */}
          <LoadingGate />
          {/* 背景のインクと記号（コンテンツの後ろ。スクロールで画面に入るとびちゃっと着弾） */}
          <SplatBackground />
          <Header />
          <main id="main" className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          {/* 画面右下の「↑」ボタン（スクロールしたら現れ、押すと一番上へ戻る） */}
          <FloatingTopButton />
        </Providers>
      </body>
    </html>
  );
}
