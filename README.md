# みかんのポートフォリオ

作ることが好きなゲームプランナ―を目指す学生、mikan の個人ポートフォリオサイトです。

- Next.js 16（App Router）+ TypeScript
- Tailwind CSS v4 / shadcn/ui / lucide-react
- Motion（`motion/react`）/ next-themes
- フォント：M PLUS Rounded 1c（見出し・太字）、Zen Maru Gothic（本文）
- 全ページ静的生成（SSG）。作品サムネイル取得用の `/api/og` のみサーバー実行

## ページ

| パス | 内容 |
| --- | --- |
| `/` | ヒーロー / Profile / Vision / 最近の作品 / 最近の活動 / 関連リンク |
| `/projects` | 作品一覧。`?category=web&team=solo` のように URL で絞り込み状態を共有できる |
| `/career` | 経歴タイムライン。`?tag=award` で絞り込み |
| それ以外 | 404 ページ |

## 必要なもの

- Node.js 20.9 以降（npm 付き）

## ローカルで動かす

```bash
npm install
npm run dev      # http://localhost:3000
```

公開前のチェック：

```bash
npm run lint
npm run build
npm run start    # ビルドしたものを http://localhost:3000 で確認
```

## 作品・経歴を追加する

配列に1件足すだけで、トップ・一覧・絞り込みに反映されます（並び順は日付から自動）。

**作品** … `src/data/projects.ts` の `projects` 配列

```ts
{
  slug: "my-game",                // 重複しない英数字
  title: "新しいゲーム",
  description: "ひとことで説明",
  date: "2026-11",                // 年-月
  categories: ["game"],           // web / native / game / graphic / article / lecture / video
  team: "solo",                   // solo / team
  tech: ["Unity", "C#"],
  thumbnail: "/images/projects/my-game.png", // 省略すると links.site の OGP 画像 → 無ければ作品名入りのグラデーション
  links: { site: "https://...", code: "https://github.com/...", article: "https://..." },
},
```

サムネイル画像は `public/images/projects/` に置きます。

**経歴** … `src/data/career.ts` の `career` 配列

```ts
{
  date: "2026-11-03",
  title: "○○ハッカソンで最優秀賞",
  description: "ひとことで説明",
  tags: ["event", "award"],       // academic / community / event / dev / award / intern / license
},
```

`award` タグを付けると 🏆 マークと強調色で表示されます。

**プロフィール・SNS** … `src/data/profile.ts`（`social` の URL は仮の値なので、公開前に自分のものへ書き換えてください）

アバター画像は `public/images/avatar.svg`（仮の図形）を差し替えます。ファイル名を変える場合は `profile.avatar` も変更してください。favicon は `src/app/icon.svg` です。

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

### 環境変数（任意）

| 名前 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 独自ドメインを使う場合に設定（例：`https://mikan.example.com`）。OGP・sitemap・robots の URL に使われます。未設定なら Vercel の本番 URL を自動で使います |

Vercel の **Project → Settings → Environment Variables** で設定し、再デプロイしてください。

### 公開後の確認

- `https://<あなたのURL>/sitemap.xml` と `/robots.txt` が開ける
- SNS にURLを貼ると OGP 画像（`/opengraph-image`）が出る
- [PageSpeed Insights](https://pagespeed.web.dev/) で Performance / Accessibility を確認する

## 仕組みのメモ

- **オープニング**（`src/components/opening/`）：タブで最初に開いたときだけ表示。`sessionStorage` の `opening-shown` で判定し、`<head>` の小さなスクリプトが `<html data-opening="done">` を付けて CSS で最初から隠す。スキップボタンか任意のキーで閉じる。OS の「視差効果を減らす」設定では表示しない
- **出現アニメーション**：設定値は `src/lib/motion.ts` にまとめてある。サーバーの HTML では要素を見える状態で出し（初回はオープニングの幕の下）、ハイドレーション後に隠してからアニメーションする。2回目以降の訪問は CSS で描画前から隠すのでちらつかない
- **ダークモード**：next-themes（選択は `localStorage` に保存）
- **`/api/og`**：作品の `links.site` から `og:image` を取得して 1 日キャッシュ。`projects.ts` に載っている URL 以外は受け付けない

## 注意：OneDrive などの同期フォルダ

このフォルダを OneDrive の同期対象に置いたままだと、`node_modules` や `.next` の大量のファイルが同期され、ビルド時に `EPERM: operation not permitted` で失敗することがあります。その場合は `.next` フォルダを削除してから再ビルドするか、プロジェクトを同期対象外の場所（例：`C:\dev\mikan-portfolio`）へ移してください。
