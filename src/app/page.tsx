import { AboutPreview } from "@/components/home/AboutPreview";
import { Hero } from "@/components/home/Hero";
import { RecentProjects } from "@/components/home/RecentProjects";

export default function Home() {
  return (
    <>
      <Hero />
      <RecentProjects />
      <AboutPreview />
    </>
  );
}
