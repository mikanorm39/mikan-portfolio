import Image from "next/image";
import { GitHubIcon, XIcon } from "@/components/icons/BrandIcons";
import type { InkColor } from "@/components/splat/splatConfig";
// 所属サークルのアイコン画像（public 内）。import で読み込むと、画像を差し替えたときに自動で新しい画像が表示される
import clubIcon from "../../../public/images/club/jyogi_sky.png";

// ===== 書き換え用の定数（メニュー ☰ に出す外部リンク） =====
/** 所属サークル（表示名とリンク先）。URL は仮 */
const CLUB_NAME = "CLUB";
const CLUB_URL = "https://example.com/";
const GITHUB_URL = "https://github.com/mikanorm39";
/** X のリンク先（仮） */
const X_URL = "https://x.com/your-x-id";

/** メニュー（☰）の外部リンク。icon は文字の左に出すアイコン（どれも同じ大きさの枠に入れる）、ink はカーソルのインクの色 */
export const externalLinks: { label: string; href: string; icon: React.ReactNode; ink: InkColor }[] = [
  {
    label: CLUB_NAME,
    href: CLUB_URL,
    // 表示サイズに合わせて next/image が縮小して配信する
    icon: <Image src={clubIcon} alt="" width={28} height={28} className="size-7 object-contain" />,
    ink: "cyan",
  },
  { label: "GitHub", href: GITHUB_URL, icon: <GitHubIcon className="size-6" />, ink: "orange" },
  { label: "SNS", href: X_URL, icon: <XIcon className="size-6" />, ink: "pink" },
];
