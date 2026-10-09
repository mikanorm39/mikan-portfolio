/**
 * microCMS との接続（サーバー側・ビルド時だけで使う）。
 * API キーをブラウザに出さないため、"server-only" を付けている（クライアントコンポーネントから読み込むとビルドエラーになる）。
 *
 * 接続情報は環境変数から読む（NEXT_PUBLIC_ は付けない）：
 *   MICROCMS_SERVICE_DOMAIN … サービスのドメイン（https://〇〇.microcms.io の 〇〇 の部分）
 *   MICROCMS_API_KEY        … API キー
 * ローカルでは .env.local、Vercel では Settings → Environment Variables に設定する。
 */
import "server-only";
import { cache } from "react";
import { createClient, type MicroCMSImage, type MicroCMSListContent } from "microcms-js-sdk";

/** microCMS の works（リスト形式）の1件。空の項目は、項目ごと届かないことがある */
export type MicroCMSWork = MicroCMSListContent & {
  slug: string;
  title: string;
  thumbnail: MicroCMSImage;
  /** セレクト（"ゲーム" / "Web" / "グラフィック" / "記事"） */
  category?: string[];
  /** セレクト（"個人開発" / "チーム開発"） */
  team?: string[];
  year?: number | null;
  period?: string;
  role?: string;
  /** 複数選択 */
  tools?: string[];
  summary?: string;
  /** リッチエディタ（HTML） */
  description?: string;
  /** 複数画像 */
  images?: MicroCMSImage[];
  /** YouTube の URL */
  video?: string;
  siteUrl?: string;
  githubUrl?: string;
  order?: number | null;
  featured?: boolean;
};

const ENDPOINT = "works";

/** クライアントは最初に使うときに1回だけ作る（環境変数がなければ、わかりやすいエラーを出す） */
let client: ReturnType<typeof createClient> | undefined;
function getClient() {
  if (client) return client;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!serviceDomain || !apiKey) {
    const missing = [!serviceDomain && "MICROCMS_SERVICE_DOMAIN", !apiKey && "MICROCMS_API_KEY"].filter(Boolean);
    throw new Error(
      `[microCMS] 環境変数 ${missing.join(" と ")} が設定されていません。` +
        "ローカルでは .env.local に、Vercel では Settings → Environment Variables に設定してください。",
    );
  }
  client = createClient({ serviceDomain, apiKey });
  return client;
}

/**
 * 作品を全件取得する（order の昇順）。
 * 開発中（npm run dev）はページを開くたびに最新を取り、本番ではビルド時に1回だけ取る（Next.js の fetch の標準の動き）。
 * cache()：同じ描画の中で何度呼んでも、取りに行くのは1回だけにする
 */
export const getAllWorkContents = cache(async (): Promise<MicroCMSWork[]> => {
  return getClient().getAllContents<MicroCMSWork>({ endpoint: ENDPOINT, queries: { orders: "order" } });
});

/** microCMS の career（リスト形式）の1件。空の項目は、項目ごと届かないことがある */
export type MicroCMSCareer = MicroCMSListContent & {
  title: string;
  /** 日時（日付のみ）。世界標準時で届く（日本時間の 0:00 → 前の日の 15:00Z） */
  date: string;
  /** 日時（日付のみ） */
  endDate?: string | null;
  /** 真偽値 */
  ongoing?: boolean;
  /** テキストエリア */
  description?: string;
  /** セレクト・複数選択（"サークル" / "イベント" / "開発" / "受賞" / "その他"） */
  tags?: string[];
  /** 同じ日付の経歴の並び順の調整 */
  order?: number | null;
};

/** 経歴を全件取得する（date の古い順）。取りに行くタイミングは作品と同じ */
export const getAllCareerContents = cache(async (): Promise<MicroCMSCareer[]> => {
  return getClient().getAllContents<MicroCMSCareer>({ endpoint: "career", queries: { orders: "date" } });
});

/** slug で1件取得する。見つからなければ undefined */
export const getWorkContentBySlug = cache(async (slug: string): Promise<MicroCMSWork | undefined> => {
  // slug は英数字とハイフンだけ（それ以外の文字が来たら、問い合わせずに「見つからない」にする）
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) return undefined;
  const res = await getClient().getList<MicroCMSWork>({
    endpoint: ENDPOINT,
    queries: { filters: `slug[equals]${slug}`, limit: 1 },
  });
  return res.contents[0];
});
