import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 旧 URL（作品・経歴ページ）は新しい Work / About に転送する
  redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/career", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
