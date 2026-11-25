import { HomeHero } from "@/components/home/home-hero";
import { NowBlock } from "@/components/home/now-block";
import { SelectedWork } from "@/components/home/selected-work";
import { LabWorkspace } from "@/components/home/lab-workspace";
import { Timeline } from "@/components/home/timeline";
import { WritingCard } from "@/components/home/writing-card";
import { DetailsProvider } from "@/components/home/details";

export default function Home() {
  return (
    <DetailsProvider>
      <HomeHero />
      <div className="max-w-[1120px] mx-auto px-6">
        <NowBlock />
        <SelectedWork />
        <LabWorkspace />
        <Timeline />
        <WritingCard />
      </div>
    </DetailsProvider>
  );
}
