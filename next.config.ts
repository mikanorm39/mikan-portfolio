import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 作品の画像は microCMS（images.microcms-assets.io）から読み込む。
  // 作品の画像は loader（src/lib/works.ts の microcmsImageLoader）で microCMS の画像 API を使って小さくしているが、
  // ほかの使い方をしても表示できるように、ドメインも許可しておく
  images: {
    remotePatterns: [new URL("https://images.microcms-assets.io/**")],
  },
  // 旧 URL（作品・経歴ページ）は新しい Work / About に転送する
  redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/career", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
