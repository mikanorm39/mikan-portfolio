"use client";

import Image from "next/image";
import { microcmsImageLoader, type Work } from "@/lib/works";
import { cn } from "@/lib/utils";

/** 一覧カードの幅に合わせた大きさ（カードより大きい画像は読み込まない） */
const CARD_SIZES = "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 85vw";

/**
 * 作品のサムネイル（16:9 の枠に収める。枠の大きさが先に決まるので、読み込み中にレイアウトがずれない）。
 * microCMS の画像 API で、表示する幅に合わせて小さくした WebP を配る（sizes を変えると大きい表示にも使える）。
 * loader（関数）を next/image に渡すため、クライアントコンポーネントにしている。
 */
export function WorkThumbnail({
  work,
  priority = false,
  sizes = CARD_SIZES,
  zoomOnHover = true,
  className,
}: {
  work: Pick<Work, "thumbnail">;
  /** 最初に見える画像（LCP になりやすい）は遅延読み込みしない */
  priority?: boolean;
  sizes?: string;
  /** カードのホバーで少し拡大する */
  zoomOnHover?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-video overflow-hidden bg-secondary", className)}>
      <Image
        loader={microcmsImageLoader}
        src={work.thumbnail.url}
        alt={work.thumbnail.alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("object-cover", zoomOnHover && "transition-transform duration-500 group-hover:scale-105")}
      />
    </div>
  );
}
