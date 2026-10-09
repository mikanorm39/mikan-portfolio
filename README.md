# みかんのポートフォリオ

作ることが好きなゲームプランナ―を目指す学生、mikan の個人ポートフォリオサイトです。

- Next.js 16（App Router）+ TypeScript
- Tailwind CSS v4 / shadcn/ui / lucide-react
- Motion（`motion/react`）/ next-themes
- フォント：M PLUS Rounded 1c（見出し・太字）、Zen Maru Gothic（本文）
- 作品・経歴は microCMS で管理（`microcms-js-sdk`）
- 全ページ静的生成（SSG）。microCMS のデータはビルド時に取得

## ページ

| パス | 内容 |
| --- | --- |
| `/` | タイトル画面 / Work（作品の横スクロール）/ About（自己紹介） |
| `/work` | 作品一覧。`?category=web&team=solo` のように URL で絞り込み状態を共有できる |
| `/work/作品のslug` | 作品の詳細ページ |
| `/about` | プロフィール / Vision / Career（経歴タイムライン。`?tag=award` で絞り込み）/ 関連リンク |
| それ以外 | 404 ページ |

## 必要なもの

- Node.js 20.9 以降（npm 付き）

## ローカルで動かす

```bash
npm install
npm run dev      # http://localhost:3000
```

作品・経歴は microCMS から読むので、プロジェクト直下に `.env.local` を作り、接続情報を書いておきます（GitHub には上がりません）。

```bash
MICROCMS_SERVICE_DOMAIN=サービスのドメイン   # https://〇〇.microcms.io の 〇〇
MICROCMS_API_KEY=APIキー
```

公開前のチェック：

```bash
npm run lint
npm run build
npm run start    # ビルドしたものを http://localhost:3000 で確認
```

## 作品・経歴を追加する

作品・経歴は **microCMS** の管理画面から追加・編集します（コードの変更は不要）。

- **作品** … microCMS の `works`。手順は [WORKS_GUIDE.md](WORKS_GUIDE.md)
- **経歴** … microCMS の `career`。手順は [CAREER_GUIDE.md](CAREER_GUIDE.md)、API の設計は [CAREER_SCHEMA.md](CAREER_SCHEMA.md)

公開中のサイトには、Vercel の再デプロイで反映されます。`npm run dev` ではページを再読み込みするとすぐ反映されます。

**プロフィール・SNS** … `src/data/profile.ts`（`social` の URL は仮の値なので、公開前に自分のものへ書き換えてください）

アバター画像は `public/images/avatar.svg`（仮の図形）を差し替えます。ファイル名を変える場合は `profile.avatar` も変更してください。

## Vercel にデプロイする

1. GitHub に新しいリポジトリを作り、このフォルダを push する

   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/<あなたのID>/<リポジトリ名>.git
   git push -u origin main
   ```

2. [vercel.com](https://vercel.com/) に GitHub アカウントでログインし、**Add New… → Project** からリポジトリを **Import**
3. Framework Preset が **Next.js** になっていることを確認して **Deploy**（ビルド設定は既定のままで OK）
4. 公開後、`main` ブランチに push するたびに自動で再デプロイされます。ほかのブランチやプルリクエストにはプレビュー URL が発行されます

### 環境変数

| 名前 | 用途 |
| --- | --- |
| `MICROCMS_SERVICE_DOMAIN` | **必須**。microCMS のサービスのドメイン |
| `MICROCMS_API_KEY` | **必須**。microCMS の API キー（`NEXT_PUBLIC_` は付けない。ブラウザには出ない）。未設定だとビルドがエラーで止まる |
| `NEXT_PUBLIC_SITE_URL` | 任意。独自ドメインを使う場合に設定（例：`https://mikan.example.com`）。OGP・sitemap・robots の URL に使われます。未設定なら Vercel の本番 URL を自動で使います |

Vercel の **Project → Settings → Environment Variables** で設定し、再デプロイしてください。

### 公開後の確認

- `https://<あなたのURL>/sitemap.xml` と `/robots.txt` が開ける
- SNS にURLを貼ると OGP 画像（`/opengraph-image`）が出る
- [PageSpeed Insights](https://pagespeed.web.dev/) で Performance / Accessibility を確認する

## 仕組みのメモ

- **ローディング**（`src/components/loading/`）：URL を開いたとき・再読み込みしたときに毎回表示（サイト内のページ移動では出ない）。動きは CSS だけで流すので、JS の読み込みが遅くても止まらない。OS の「視差効果を減らす」設定では表示しない
- **出現アニメーション**：設定値は `src/lib/motion.ts` にまとめてある。サーバーの HTML では要素を見える状態で出し（初回はオープニングの幕の下）、ハイドレーション後に隠してからアニメーションする。2回目以降の訪問は CSS で描画前から隠すのでちらつかない
- **ダークモード**：next-themes（選択は `localStorage` に保存）
- **microCMS**（`src/lib/microcms.ts`）：作品・経歴をビルド時に取得。画像は microCMS の画像 API で表示サイズに合わせた WebP にして配る

## 注意：OneDrive などの同期フォルダ

このフォルダを OneDrive の同期対象に置いたままだと、`node_modules` や `.next` の大量のファイルが同期され、ビルド時に `EPERM: operation not permitted` で失敗することがあります。その場合は `.next` フォルダを削除してから再ビルドするか、プロジェクトを同期対象外の場所（例：`C:\dev\mikan-portfolio`）へ移してください。
