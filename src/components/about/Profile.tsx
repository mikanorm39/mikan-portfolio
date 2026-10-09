import { Gamepad2, Sparkles, Users } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";

const infoCards = [
  { label: "開発分野", value: profile.fields, Icon: Gamepad2 },
  { label: "所属団体", value: profile.club, Icon: Users },
  { label: "活動", value: profile.activities, Icon: Sparkles },
];

export function Profile() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <SectionHeading title="Profile" ink={{ color: "yellow", trigger: "tap" }} />
      <Reveal className="pixel-box bg-card p-6 sm:p-8">
        <p className="font-heading text-h3 font-bold text-primary">{profile.affiliation}</p>
        <p className="mt-3 leading-loose">{profile.intro}</p>
      </Reveal>
      <RevealGroup as="ul" className="mt-6 grid gap-4 sm:grid-cols-3">
        {infoCards.map(({ label, value, Icon }) => (
          <RevealItem as="li" key={label}>
            <div className="pixel-box group h-full bg-card p-6 transition duration-300 hover:-translate-y-1">
              <span className="pixel-circle bg-pop-gradient inline-flex size-11 items-center justify-center">
                <Icon className="size-5 group-hover:animate-wiggle" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-bold text-muted-foreground">{label}</p>
              <p className="mt-1 font-bold">{value}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
