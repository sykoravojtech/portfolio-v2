import Link from "next/link";
import { bio } from "@/content/bio";

export function Footer() {
  return (
    <footer className="bg-bone text-ink">
      <div className="max-w-[1120px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
        <div>© {new Date().getFullYear()} {bio.name}</div>
        <div className="flex items-center gap-5">
          <a href={bio.github} className="text-bordeaux font-semibold hover:underline" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={bio.linkedin} className="text-bordeaux font-semibold hover:underline" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${bio.email}`} className="text-bordeaux font-semibold hover:underline">
            Email
          </a>
          <Link href="/VojtechSykora_CV_2026.pdf" className="text-bordeaux font-semibold hover:underline" target="_blank">
            CV ↓
          </Link>
        </div>
      </div>
    </footer>
  );
}
