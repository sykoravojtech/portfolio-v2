"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "./mark";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "/#now", label: "Now" },
  { href: "/#work", label: "Work" },
  { href: "/#lab", label: "Lab" },
  { href: "/projects/", label: "Projects" },
  { href: "/writing/", label: "Writing" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const isActive = (href: string) => !href.startsWith("/#") && pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-card/90 backdrop-blur border-b transition-[border-color,box-shadow] duration-200",
        scrolled ? "border-rule shadow-[0_6px_20px_#15171A0d]" : "border-line",
      )}
    >
      <nav className="max-w-[1120px] mx-auto px-6 h-16 flex items-center gap-5" aria-label="Main">
        <Link href="/" className="group flex items-center gap-2.5 font-semibold text-[16px]" onClick={() => setOpen(false)}>
          <Mark cell={3.5} />
          Vojtěch Sýkora
        </Link>

        <ul className="hidden md:flex items-center gap-1 ml-auto text-[14px] font-medium">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "relative px-3 py-2.5 hover:text-accent-text transition-colors",
                  isActive(l.href) && "text-accent-text",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeToggle className="ml-auto md:ml-0" />
        <Link
          href="/#contact"
          className="press hidden md:inline-flex items-center h-10 px-4 bg-ink text-paper text-[13px] font-semibold hover:bg-accent hover:text-on-accent"
        >
          Get in touch
        </Link>

        <button
          type="button"
          className="md:hidden size-10 grid place-items-center border border-line"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-line bg-card swap">
          <ul className="max-w-[1120px] mx-auto px-6 py-2 flex flex-col">
            {[...LINKS, { href: "/#contact", label: "Get in touch" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="flex items-center h-12 font-medium border-b border-line">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
