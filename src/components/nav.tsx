"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactMenu } from "./contact-menu";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-green text-bone border-b border-cedar/30 relative">
      <nav className="max-w-[1120px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-black tracking-tight text-base text-bone"
          onClick={() => setOpen(false)}
        >
          vojtech sykora
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-[13px]">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "transition-colors",
                  isActive(l.href)
                    ? "text-green-mid font-bold"
                    : "text-bone/70 hover:text-bone"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <ContactMenu align="end">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-bordeaux text-bone px-3 py-1.5 text-[12px] font-semibold hover:bg-[#5E2230] transition-colors"
              >
                Contact
              </button>
            </ContactMenu>
          </li>
        </ul>

        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-bone"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-cedar/30 bg-green">
          <ul className="max-w-[1120px] mx-auto px-6 py-3 flex flex-col gap-2 text-[14px]">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-1 transition-colors",
                    isActive(l.href)
                      ? "text-green-mid font-bold"
                      : "text-bone/80 hover:text-bone"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <ContactMenu align="start">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-bordeaux text-bone px-3 py-1.5 text-[13px] font-semibold hover:bg-[#5E2230] transition-colors"
                >
                  Contact
                </button>
              </ContactMenu>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
