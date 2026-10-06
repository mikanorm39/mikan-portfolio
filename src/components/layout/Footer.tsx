import { socialIcons } from "@/components/icons/BrandIcons";
import { profile } from "@/data/profile";
import { ScrollTopButton } from "./ScrollTopButton";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <ul className="flex items-center gap-3">
          {profile.social.map((s) => {
            const Icon = socialIcons[s.id];
            return (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label}（新しいタブで開く）`}
                  className="group inline-flex size-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:-translate-y-0.5 hover:shadow-pop active:scale-95"
                >
                  <Icon className="size-5 group-hover:animate-wiggle" />
                </a>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <ScrollTopButton />
      </div>
    </footer>
  );
}
