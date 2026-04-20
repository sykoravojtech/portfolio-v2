"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-green text-bone border-b border-cedar/30">
      <nav className="max-w-[1120px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-black tracking-tight text-base text-bone">
          vojtech sykora
        </Link>
        <ul className="flex items-center gap-6 text-[13px]">
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
            <a
              href="mailto:sykoravojtech01@gmail.com"
              className="inline-flex items-center rounded-md bg-bordeaux text-bone px-3 py-1.5 text-[12px] font-semibold hover:bg-[#5E2230] transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
