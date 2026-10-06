import type { NextRequest } from "next/server";
import { projects } from "@/data/projects";

const ONE_DAY = 86400;
const TIMEOUT_MS = 5000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// 任意の URL を取りに行く「踏み台」にならないよう、作品データにある URL だけを許可する
const allowedSites = new Set(projects.flatMap((p) => (p.links.site ? [p.links.site] : [])));

/** HTML から og:image（無ければ twitter:image）を探す */
function findOgImage(html: string, baseUrl: string) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const key of ["og:image", "og:image:url", "twitter:image"]) {
    for (const tag of metaTags) {
      const prop = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (prop !== key) continue;
      const content = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1];
      if (content) {
        try {
          return new URL(content.replaceAll("&amp;", "&"), baseUrl).toString();
        } catch {
          // 壊れた URL は無視して次を探す
        }
      }
    }
  }
  return null;
}

function notFound() {
  // クライアント側は失敗を検知して、作品名入りのグラデーション画像に切り替える
  return new Response("OG image not found", {
    status: 404,
    headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !allowedSites.has(url)) {
    return new Response("Bad request", { status: 400 });
  }

  try {
    // ページの HTML は 1 日キャッシュ（Next.js の Data Cache）
    const page = await fetch(url, {
      next: { revalidate: ONE_DAY },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioOgFetcher/1.0)" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!page.ok) return notFound();

    const imageUrl = findOgImage(await page.text(), page.url || url);
    if (!imageUrl || !/^https?:\/\//.test(imageUrl)) return notFound();

    const image = await fetch(imageUrl, {
      next: { revalidate: ONE_DAY },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const contentType = image.headers.get("content-type") ?? "";
    if (!image.ok || !contentType.startsWith("image/")) return notFound();

    const body = await image.arrayBuffer();
    if (body.byteLength > MAX_IMAGE_BYTES) return notFound();

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        // ブラウザと Vercel の CDN にも 1 日キャッシュさせる
        "Cache-Control": `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_DAY}`,
      },
    });
  } catch {
    return notFound();
  }
}
