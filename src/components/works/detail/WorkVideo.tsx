"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

/** YouTube の URL（普通の URL・youtu.be・埋め込み・ショート）から動画の ID を取り出す */
function youtubeId(url: string) {
  return url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1];
}

/**
 * 動画。最初はサムネイルと ▶ だけを表示し、押されてから YouTube の埋め込みを読み込む（ページを重くしない）。
 * YouTube 以外の URL は、押されたらその URL をそのまま埋め込む。
 */
export function WorkVideo({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  // 広告用の Cookie を使わない埋め込み
  const embed = id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : url;

  return (
    <div className="pixel-box relative aspect-video overflow-hidden bg-secondary">
      {playing ? (
        <iframe
          src={embed}
          title={`${title} の動画`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={`${title} の動画を再生する`}
        >
          {id ? (
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              // YouTube のサムネイルはもともと軽いので、変換せずにそのまま使う
              unoptimized
              className="object-cover"
            />
          ) : (
            <span className="bg-pop-gradient absolute inset-0" aria-hidden="true" />
          )}
          <span className="pixel-circle bg-pop-gradient relative inline-flex size-20 items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-1 size-9 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
