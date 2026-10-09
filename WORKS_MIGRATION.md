# 作品データの移行リスト（works.ts → microCMS）

以前 `src/data/works.ts` に書いていた作品を、microCMS に登録し直すための一覧です。
画像は `public/works/作品のslug/` にあるので、microCMS の「画像」欄にアップロードしてください。

> **注意**：この4件は、サイトを作ったときに入れた**ダミーデータ**です（リンク先も仮のものがあります）。
> 本物の作品だけを登録し、ダミーは登録しなくてもかまいません。

- 空欄の項目は、microCMS でも空のままにします
- 「（microCMS にない項目）」は、microCMS に項目がないため登録できない値です

---

## 1. ふわふわジャンプ

| 項目 | 値 |
|---|---|
| slug | `fluffy-jump` |
| title | ふわふわジャンプ |
| thumbnail | `public/works/fluffy-jump/thumbnail.svg` ※SVG は microCMS で変換できないため、PNG か WebP にしてからアップロード |
| category | ゲーム |
| team | チーム開発 |
| year | 2026 |
| period | 48時間（ゲームジャム） |
| role | 企画・レベルデザイン |
| tools | Unity / C# / Aseprite |
| summary | 雲から雲へ飛び移る、ワンボタンのカジュアルアクション。 |
| description | 下の「本文」 |
| images | `public/works/fluffy-jump/screen-1.svg`、`screen-2.svg`（どちらも仮の画像） |
| video | |
| siteUrl | https://unityroom.com/ （仮） |
| githubUrl | https://github.com/your-github-id/fluffy-jump （仮） |
| order | |
| featured | ON |
| （microCMS にない項目） | 画像の説明：「ゲーム画面。タイミングよく押して、次の雲へジャンプ」「リザルト画面。スコアでランキングに挑戦できる」 |

本文（description）：

> 雲から雲へ飛び移る、ワンボタンのカジュアルアクションです。
> じょぎのゲームジャムで、4人のチームで48時間で制作しました。
>
> 私は企画とレベルデザインを担当しました。ボタン1つでも「もう1回！」と遊びたくなるように、雲の間隔と動きを何度も調整しました。

---

## 2. Mikan's Portfolio

| 項目 | 値 |
|---|---|
| slug | `mikan-portfolio` |
| title | Mikan's Portfolio |
| thumbnail | `public/works/mikan-portfolio/thumbnail.webp` |
| category | Web |
| team | 個人開発 |
| year | 2026 |
| period | |
| role | デザイン・実装 |
| tools | Next.js / TypeScript / Tailwind CSS / Motion |
| summary | このサイトです。インクとドット絵で、ゲームのタイトル画面のようなポートフォリオにしました。 |
| description | 下の「本文」 |
| images | |
| video | |
| siteUrl | |
| githubUrl | https://github.com/mikanorm39/mikan-portfolio |
| order | |
| featured | OFF |

本文（description）：

> このサイトです。Next.js の App Router と Motion で、ポップで動きのあるポートフォリオを作りました。
>
> 紫の背景にインクが飛び散るデザインで、見出しやメニューにもインクが「びちゃっ」と着弾します。

---

## 3. ゲーム企画書の書き方メモ

| 項目 | 値 |
|---|---|
| slug | `planner-note` |
| title | ゲーム企画書の書き方メモ |
| thumbnail | `public/works/planner-note/thumbnail.svg` ※PNG か WebP にしてからアップロード |
| category | 記事 |
| team | 個人開発 |
| year | 2026 |
| period | |
| role | |
| tools | 企画 / ドキュメント |
| summary | 企画書を書くときに気をつけていることを、テンプレート付きでまとめた記事です。 |
| description | |
| images | |
| video | |
| siteUrl | https://qiita.com/ （仮。記事の URL を入れると「記事を読む」ボタンになる） |
| githubUrl | |
| order | |
| featured | OFF |

---

## 4. ドット絵ガーデン

| 項目 | 値 |
|---|---|
| slug | `pixel-garden` |
| title | ドット絵ガーデン |
| thumbnail | `public/works/pixel-garden/thumbnail.svg` ※PNG か WebP にしてからアップロード |
| category | グラフィック |
| team | 個人開発 |
| year | 2026 |
| period | |
| role | |
| tools | Aseprite / JavaScript |
| summary | ドット絵の素材集と、それを並べて遊べる小さなツール。 |
| description | 下の「本文」 |
| images | |
| video | |
| siteUrl | |
| githubUrl | |
| order | |
| featured | OFF |

本文（description）：

> ドット絵の素材集と、それを並べて遊べる小さなツールです。
> チームの新入生向け講座でも使いました。

---

## 移行が終わったら

登録が終わったら教えてください。次のものを削除してよいか確認します。

- `src/data/works.ts`（以前の作品データ。今はサイトで使っていません）
- `public/works/`（以前の作品画像）
- このファイル（`WORKS_MIGRATION.md`）
