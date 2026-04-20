import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-muted p-12">
      <h1 className="text-ink text-4xl font-black tracking-tight">
        Vojtěch Sýkora
      </h1>
      <p className="mt-4">
        Phthalo Cream is wired. <span className="text-bordeaux font-bold">CTA color</span>.
        <span className="text-green-mid"> Link color</span>.
      </p>
      <div className="mt-6 flex gap-3">
        <div className="h-8 w-8 rounded bg-green" />
        <div className="h-8 w-8 rounded bg-green-dark" />
        <div className="h-8 w-8 rounded bg-green-mid" />
        <div className="h-8 w-8 rounded bg-bordeaux" />
        <div className="h-8 w-8 rounded bg-cedar" />
        <div className="h-8 w-8 rounded bg-bone" />
        <div className="h-8 w-8 rounded bg-bg2 border border-border" />
        <div className="h-8 w-8 rounded bg-bg3" />
      </div>
      <div className="mt-6 flex gap-3">
        <Button>Default (bordeaux)</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </main>
  );
}
