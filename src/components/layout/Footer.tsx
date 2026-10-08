import { socialIcons } from "@/components/icons/BrandIcons";
import { profile } from "@/data/profile";
import { ScrollTopButton } from "./ScrollTopButton";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card/60">
      {/* スマホは縦に中央ぞろえ。PC は「左 / 真ん中 / 右」の3列にして、連絡先をページの真ん中にそろえる */}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-6">
        <ul className="flex items-center gap-3 sm:justify-self-start">
          {profile.social.map((s) => {
            const Icon = socialIcons[s.id];
            return (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label}（新しいタブで開く）`}
                  className="group pixel-button inline-flex size-11 items-center justify-center bg-secondary text-secondary-foreground"
                >
                  <Icon className="size-5 group-hover:animate-wiggle" />
                </a>
              </li>
            );
          })}
        </ul>
        {/* 連絡先（中央ぞろえ）。メールアドレスは押すとメールソフトが開く */}
        <div className="text-center">
          {/* タイトル「Mikan Nishioka」と同じ Bello Pro（pixel.css の --title-font）。スマホ 28px 〜 PC 36px */}
          <p className="font-[family-name:var(--title-font)] text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-tight font-normal text-foreground">
            Contact
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-1 inline-block text-base text-muted-foreground sm:text-lg underline-offset-4 transition hover:text-primary hover:underline"
          >
            {profile.email}
          </a>
        </div>
        <div className="sm:justify-self-end">
          <ScrollTopButton />
        </div>
      </div>
    </footer>
  );
}
