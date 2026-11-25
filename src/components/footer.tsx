import Link from "next/link";
import { bio } from "@/content/bio";
import { EmailCopy } from "./email-copy";
import { Reveal } from "./reveal";

export function Footer() {
  return (
    <footer id="contact" className="mt-20 bg-night text-night-ink scroll-mt-16">
      <div className="max-w-[1120px] mx-auto px-6 pt-16 pb-8">
        <Reveal>
          <p className="kicker text-night-accent">Contact</p>
          <h2 className="mt-3 mb-7 text-[34px] sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.05]">
Get in touch
          </h2>
        </Reveal>
        <div className="flex flex-wrap gap-2.5">
          <EmailCopy label={`${bio.email}  ⧉`} className="press inline-flex items-center h-11 px-4 bg-night-accent text-ink font-semibold text-[14px] cursor-pointer hover:brightness-110" />
          {[
            { href: bio.linkedin, label: "LinkedIn ↗" },
            { href: bio.github, label: "GitHub ↗" },
            { href: bio.medium, label: "Medium ↗" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="press inline-flex items-center h-11 px-4 border border-night-ink/80 font-semibold text-[14px] hover:bg-night-ink hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/VojtechSykora_CV_2026.pdf"
            target="_blank"
            className="press inline-flex items-center h-11 px-4 border border-night-ink/80 font-semibold text-[14px] hover:bg-night-ink hover:text-ink"
          >
            CV ↓
          </Link>
        </div>
        <div className="mt-14 pt-4 border-t border-night-line flex flex-wrap gap-3 font-mono text-[11px] text-night-muted">
          <span>© {new Date().getFullYear()} {bio.name}</span>
        </div>
      </div>
    </footer>
  );
}
