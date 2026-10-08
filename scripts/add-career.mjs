/**
 * ターミナルで質問に答えるだけで、Career（経歴）を1件追加する。
 *   npm run career
 * 入力した内容は src/data/career.ts の career 配列の最後に書き足される（表示の並び順は日付で自動に整う）。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline";

const FILE = new URL("../src/data/career.ts", import.meta.url);

/** 種類（src/data/career.ts の careerTagLabels と同じ順番） */
const TAGS = [
  ["circle", "サークル"],
  ["event", "イベント"],
  ["dev", "開発"],
  ["award", "受賞"],
  ["other", "その他"],
];

const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** "2026-9-1" や "2026/09/01" も "2026-09-01" にそろえる。日付として正しくなければ null */
const normalizeDate = (text) => {
  const m = text.trim().match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const date = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  const check = new Date(`${date}T00:00:00`);
  return check.getMonth() + 1 === Number(mo) && check.getDate() === Number(d) ? date : null;
};

const rl = createInterface({ input, output });
// 1行ずつ読む（貼り付けたときに先の行まで届いても取りこぼさないように、行を順番に受け取る）
const lineReader = rl[Symbol.asyncIterator]();
const ask = async (question) => {
  output.write(question);
  const { value, done } = await lineReader.next();
  if (done) throw new Error("入力が途中で終わりました");
  return value;
};

try {
  console.log("\n🍊 Career（経歴）を1件追加します（やめるときは Ctrl+C）\n");

  // 日付（そのまま Enter で今日）
  let date = null;
  while (!date) {
    const answer = await ask(`日付 [${today()}]: `);
    date = answer.trim() === "" ? today() : normalizeDate(answer);
    if (!date) console.log("  → 2026-09-11 のような形で入力してください");
  }

  // タイトル（必須）
  let title = "";
  while (!title) {
    title = (await ask("タイトル: ")).trim();
    if (!title) console.log("  → タイトルは必ず入力してください");
  }

  // 説明文（なければ Enter）
  const description = (await ask("説明文（なければそのまま Enter）: ")).trim();

  // 種類（番号をスペース区切りで。なければ Enter）
  console.log("種類:  " + TAGS.map(([, label], i) => `${i + 1}.${label}`).join("  "));
  let tags = null;
  while (!tags) {
    const answer = (await ask("番号をスペース区切りで（例: 2 3）: ")).trim();
    const nums = answer === "" ? [] : answer.split(/[\s,、]+/).map(Number);
    if (nums.every((n) => Number.isInteger(n) && n >= 1 && n <= TAGS.length)) {
      tags = [...new Set(nums)].sort().map((n) => TAGS[n - 1][0]);
    } else {
      console.log(`  → 1〜${TAGS.length} の番号で入力してください`);
    }
  }

  // 書き足す内容（career.ts のほかの項目と同じ書き方）
  const lines = [
    "  {",
    `    date: ${JSON.stringify(date)},`,
    `    title: ${JSON.stringify(title)},`,
    ...(description ? [`    description: ${JSON.stringify(description)},`] : []),
    `    tags: [${tags.map((t) => JSON.stringify(t)).join(", ")}],`,
    "  },",
  ];

  console.log("\n追加する内容:\n" + lines.join("\n") + "\n");
  const ok = (await ask("これで追加しますか？ [Y/n]: ")).trim().toLowerCase();
  if (ok !== "" && ok !== "y" && ok !== "yes") {
    console.log("追加しませんでした");
  } else {
    // career 配列の終わり（"export const career" のあとに最初に出てくる行頭の "];"）の直前に入れる
    const source = readFileSync(FILE, "utf8");
    const eol = source.includes("\r\n") ? "\r\n" : "\n";
    const start = source.indexOf("export const career");
    const end = source.indexOf(`${eol}];`, start);
    if (start === -1 || end === -1) throw new Error("career.ts の中に career 配列が見つかりませんでした");
    writeFileSync(FILE, source.slice(0, end) + eol + lines.join(eol) + source.slice(end));
    console.log("✅ src/data/career.ts に追加しました");
  }
} finally {
  rl.close();
}
