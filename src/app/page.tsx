import { AboutPreview } from "@/components/home/AboutPreview";
import { Hero } from "@/components/home/Hero";
import { RecentWorks } from "@/components/home/RecentWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <RecentWorks />
      <AboutPreview />
    </>
  );
}
