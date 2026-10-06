"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";

const SIZES = "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw";

/**
 * 1. thumbnail があればそれを表示
 * 2. 無ければ links.site の OGP 画像を /api/og 経由で表示
 * 3. どちらも無い・取得に失敗したら、作品名入りのグラデーション画像を表示
 */
export function ProjectThumbnail({ project, priority = false }: { project: Project; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src =
    project.thumbnail ?? (project.links.site ? `/api/og?url=${encodeURIComponent(project.links.site)}` : undefined);

  return (
    <div className="relative aspect-video overflow-hidden bg-secondary">
      {src && !failed ? (
        <Image
          src={src}
          alt={`${project.title} のサムネイル`}
          fill
          sizes={SIZES}
          // 一覧の1行目は最初に見える（LCP になりやすい）ので遅延読み込みしない
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          // OGP 画像は外部サイトのものなので最適化せずそのまま表示する
          unoptimized={!project.thumbnail}
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          role="img"
          aria-label={`${project.title} のサムネイル`}
          className="bg-pop-gradient flex size-full items-center justify-center p-6 transition-transform duration-500 group-hover:scale-105"
        >
          <span className="text-center font-heading text-xl font-extrabold leading-snug" aria-hidden="true">
            {project.title}
          </span>
        </div>
      )}
    </div>
  );
}
