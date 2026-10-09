import { isMicroCMSImage } from "@/lib/works";
import styles from "./WorkRichText.module.css";

/** 本文の中の画像の幅（本文の枠より少し大きめ。高解像度の画面でもぼやけないように） */
const BODY_IMAGE_WIDTH = 1600;

/**
 * microCMS のリッチエディタの HTML を、本文のスタイルに合わせて表示する。
 * - 画像：microCMS の画像 API で幅をそろえた WebP にして、画面に近づいてから読み込む
 * - 外部リンク：新しいタブで開く
 * HTML は自分の microCMS から届くものだけを表示する（外の人が書いた HTML は入らない）。
 */
export function WorkRichText({ html }: { html: string }) {
  const body = html
    // 画像：WebP・幅指定・遅延読み込み
    .replace(/<img\b([^>]*?)\bsrc="([^"]+)"([^>]*)>/g, (_tag, before: string, src: string, after: string) => {
      const optimized = isMicroCMSImage(src)
        ? `${src}${src.includes("?") ? "&" : "?"}w=${BODY_IMAGE_WIDTH}&fm=webp&q=75`
        : src;
      return `<img${before}src="${optimized}" loading="lazy" decoding="async"${after}>`;
    })
    // 外部リンク：新しいタブで開く
    .replace(/<a\b([^>]*?)\bhref="(https?:\/\/[^"]+)"([^>]*)>/g, (tag, before: string, href: string, after: string) =>
      /\btarget=/.test(tag) ? tag : `<a${before}href="${href}" target="_blank" rel="noopener noreferrer"${after}>`,
    );

  return <div className={styles.body} dangerouslySetInnerHTML={{ __html: body }} />;
}
