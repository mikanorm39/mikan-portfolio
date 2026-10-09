"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { microcmsImageLoader, type WorkImage } from "@/lib/works";

/**
 * 詳細ページの画像ギャラリー。画像を押すと拡大表示（ブラウザ標準の <dialog> を使うので、ライブラリは不要）。
 * 拡大中は ← → で前後の画像、Esc・背景のクリック・× で閉じる。
 * 画像は microCMS の画像 API で、表示する幅に合わせた WebP を配る。
 */
export function WorkGallery({ images }: { images: WorkImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  // current が決まったら開く（閉じたら、押した画像にフォーカスを戻すのはブラウザがやってくれる）
  useEffect(() => {
    const dialog = dialogRef.current;
    if (current !== null && dialog && !dialog.open) dialog.showModal();
  }, [current]);

  const close = () => dialogRef.current?.close();
  const move = (step: number) => setCurrent((i) => (i === null ? i : (i + step + images.length) % images.length));

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2">
        {images.map((img, i) => (
          <li key={`${i}-${img.url}`}>
            <button
              type="button"
              onClick={() => setCurrent(i)}
              className="pixel-box holo-hover group relative block aspect-video w-full cursor-zoom-in overflow-hidden bg-secondary"
              aria-label={`${img.alt}（拡大して見る）`}
            >
              <Image
                loader={microcmsImageLoader}
                src={img.url}
                alt=""
                fill
                // ギャラリーの1枚の幅（PC は2列）
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* 拡大表示 */}
      <dialog
        ref={dialogRef}
        aria-label="画像の拡大表示"
        onClose={() => setCurrent(null)}
        // 画像の外（背景）を押したら閉じる
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") move(-1);
          if (e.key === "ArrowRight") move(1);
        }}
        className="m-auto size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-[#140a2a]/85"
      >
        {current !== null && (
          <div className="pointer-events-none flex size-full flex-col items-center justify-center gap-3 p-4 sm:p-10">
            <div className="relative h-[75vh] w-full max-w-6xl">
              <Image
                loader={microcmsImageLoader}
                src={images[current].url}
                alt={images[current].alt}
                fill
                sizes="100vw"
                className="pointer-events-auto object-contain"
              />
            </div>
            {images.length > 1 && (
              <p className="text-sm font-bold text-white opacity-80" aria-live="polite">
                {current + 1} / {images.length}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={close}
          aria-label="閉じる"
          className="pixel-button bg-pop-gradient fixed top-4 right-4 inline-flex size-12 items-center justify-center"
        >
          <X className="size-6" strokeWidth={3} aria-hidden="true" />
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="前の画像"
              className="pixel-button bg-pop-gradient fixed top-1/2 left-3 inline-flex size-12 -translate-y-1/2 items-center justify-center"
            >
              <ChevronLeft className="size-7" strokeWidth={3} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="次の画像"
              className="pixel-button bg-pop-gradient fixed top-1/2 right-3 inline-flex size-12 -translate-y-1/2 items-center justify-center"
            >
              <ChevronRight className="size-7" strokeWidth={3} aria-hidden="true" />
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
