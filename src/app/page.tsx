import { HomeHero } from "@/components/home/home-hero";
import { NowBlock } from "@/components/home/now-block";
import { SelectedWork } from "@/components/home/selected-work";
import { LabWorkspace } from "@/components/home/lab-workspace";
import { Timeline } from "@/components/home/timeline";
import { WritingCard } from "@/components/home/writing-card";
import { DetailsProvider } from "@/components/home/details";
import fs from "node:fs";
import path from "node:path";
import { labApps } from "@/content/home";

// Screenshots that exist at build time; a missing one shows an empty phone instead of a broken image.
const available = labApps
  .flatMap((a) => a.shots)
  .filter((s) => fs.existsSync(path.join(process.cwd(), "public", s)));

export default function Home() {
  return (
    <DetailsProvider>
      <HomeHero />
      <div className="max-w-[1120px] mx-auto px-6">
        <NowBlock />
        <SelectedWork />
        <LabWorkspace available={available} />
        <Timeline />
        <WritingCard />
      </div>
    </DetailsProvider>
  );
}
