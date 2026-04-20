# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stub site at `vojtechsykora.com` with a recruiter-facing Next.js portfolio using the Phthalo Cream hybrid design system, covering Home / About / Experience / Education / Projects / Writing, deploying to GitHub Pages via static export.

**Architecture:** Next.js 16.2.2 + React 19 + Tailwind CSS v4 in static-export mode (`output: 'export'`). Phthalo Cream tokens and shadcn primitives ported verbatim from `projects-web`. Structured content in TypeScript modules under `src/content/`; blog posts in `.mdx` under `src/content/writing/` rendered via `@next/mdx`. Deployed through a GitHub Actions workflow to GitHub Pages with custom domain `vojtechsykora.com`.

**Tech Stack:**
- Runtime: Next.js 16.2.2, React 19.2.4, TypeScript 5
- Styling: Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline`), class-variance-authority, clsx, tailwind-merge
- UI primitives: radix-ui (scoped exports like `Slot.Root`), lucide-react icons, DM Sans via `next/font`
- Content: `@next/mdx`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `gray-matter`
- Tooling: pnpm 9+, Node 20, Vitest for unit tests, ESLint with `eslint-config-next`
- Deploy: GitHub Actions + `actions/deploy-pages@v4`

**Spec reference:** [`docs/superpowers/specs/2026-04-20-portfolio-redesign-design.md`](../specs/2026-04-20-portfolio-redesign-design.md)
**Content source:** [`docs/content-source/linkedin-2026-04.md`](../../content-source/linkedin-2026-04.md) — authoritative for experiences, education, certifications, testimonial, projects, bio.
**Design system reference (read-only):** `/home/vojta/Documents/projects/projects-web/docs/DESIGN_SYSTEM.md` and `/home/vojta/Documents/projects/projects-web/apps/web/src/app/globals.css`.

**IMPORTANT — Next.js version hazard:** Next.js 16 has breaking changes from Next 13/14 training data. Before writing Next-specific code (route handlers, `next.config.*`, `next/font`, metadata, async params), check `node_modules/next/dist/docs/` for the current API in this repo. Deprecation warnings surface real bugs.

---

## File Structure

```
portfolio-v2/
  .github/workflows/
    deploy.yml
  public/
    CNAME                        (moved from repo root)
    VojtechSykora_CV_2026.pdf    (moved from repo root)
    images/
      avatar.jpg
      experience/*.{jpeg,png,webp}   (copied from ../portfolio/src/images/experience/)
      education/*.{jpeg,png,webp}    (copied from ../portfolio/src/images/education/)
      projects/*                 (optional, used by ProjectCard)
  src/
    app/
      layout.tsx                 — root layout, DM Sans, nav, footer
      page.tsx                   — Home (hybrid teaser)
      about/page.tsx
      experience/page.tsx
      education/page.tsx
      projects/page.tsx
      writing/
        page.tsx                 — post list
        [slug]/page.tsx          — MDX post page
      globals.css                — Phthalo Cream tokens (ported)
      icon.png                   — favicon
      opengraph-image.png        — default OG
    components/
      nav.tsx
      footer.tsx
      hero.tsx
      section-header.tsx
      tag-pill.tsx
      experience-item.tsx
      education-item.tsx
      certification-card.tsx
      project-card.tsx
      writing-row.tsx
      testimonial.tsx
      ui/
        button.tsx               — shadcn primitive, ported
    content/
      types.ts
      bio.ts
      experiences.ts
      education.ts
      certifications.ts
      testimonials.ts
      projects.ts
      writing/
        _fixture.mdx             (fixture for MDX loader test; `published: false` so it never gets a route)
        hello-world.mdx          (seed post)
    lib/
      utils.ts                   — cn() helper
      mdx.ts                     — MDX loader + frontmatter
      dates.ts                   — date parsing/sorting helpers
  tests/
    mdx.test.ts
    dates.test.ts
    content-helpers.test.ts
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  vitest.config.ts
  postcss.config.mjs
  package.json
  pnpm-lock.yaml
  README.md
```

---

## Milestone overview

- **M0** — Repo prep (move stale files, branch setup)
- **M1** — Next.js scaffold + Tailwind + base config
- **M2** — Design system port + shadcn primitives
- **M3** — Content types + TS modules (migration from content source)
- **M4** — Helpers + tests (dates, sorting, MDX loader)
- **M5** — Chrome (root layout, Nav, Footer)
- **M6** — Reusable components
- **M7** — Pages (Home, About, Experience, Education, Projects)
- **M8** — Writing (MDX pipeline, list page, post page)
- **M9** — Assets (logos, avatar, icons, OG image)
- **M10** — Deploy + verification
- **M11** — Polish (mobile pass, a11y, metadata)

Each milestone ends with the site still buildable (`pnpm build`) and commits every 1-3 tasks. Do not skip `pnpm build` checkpoints — a broken build late in a milestone is much cheaper to catch early.

---

## M0 — Repo prep

### Task 0.1: Reorganise root files and add baseline configs

**Files:**
- Move: `VojtechSykora_CV_2026.pdf` → `public/VojtechSykora_CV_2026.pdf`
- Move: `CNAME` → `public/CNAME`
- Delete: `index.html`
- Create: `public/.gitkeep` (ensure the directory survives git)
- Modify: `.gitignore`
- Create: `README.md`

- [x] **Step 1: Create `public/` and move assets**

```bash
cd /home/vojta/Documents/projects/portfolio-v2
mkdir -p public
git mv CNAME public/CNAME
git mv VojtechSykora_CV_2026.pdf public/VojtechSykora_CV_2026.pdf
git rm index.html
touch public/.gitkeep
```

- [x] **Step 2: Extend `.gitignore`**

Append to `.gitignore`:
```
# Next.js
/.next/
/out/
/build/

# Node
/node_modules/
.pnpm-store/

# Env
.env
.env.local
.env.*.local

# Editors
.vscode/
.idea/
*.swp

# System
.DS_Store
Thumbs.db

# Vitest
/coverage/

# Superpowers brainstorm artifacts (already present)
.superpowers/
```

- [x] **Step 3: Create `README.md`**

```markdown
# portfolio-v2

Personal portfolio for Vojtěch Sýkora, deployed to [vojtechsykora.com](https://vojtechsykora.com) via GitHub Pages.

## Develop

```bash
pnpm install
pnpm dev    # http://localhost:3200
```

## Build

```bash
pnpm build  # static export in ./out
```

## Design system

Phthalo Cream (hybrid dark/light). See `/home/vojta/Documents/projects/projects-web/docs/DESIGN_SYSTEM.md` — design is inherited from `projects-web`.

## Content

Structured content lives in `src/content/*.ts`. Blog posts in `src/content/writing/*.mdx`.
Source of truth for v1 migration: `docs/content-source/linkedin-2026-04.md`.
```

- [x] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: move CV+CNAME into public/, drop stub index.html, add .gitignore+README"
```

---

## M1 — Next.js scaffold + Tailwind

### Task 1.1: Initialize pnpm workspace and install Next.js 16 + Tailwind 4

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml` (generated)
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx` (stub)
- Create: `src/app/page.tsx` (stub)
- Create: `src/app/globals.css` (stub — real content ported in M2)

- [x] **Step 1: Write `package.json`**

```json
{
  "name": "portfolio-v2",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3200",
    "build": "next build",
    "start": "next start --port 3200",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "gray-matter": "^4.0.3",
    "lucide-react": "^1.7.0",
    "next": "16.2.2",
    "radix-ui": "^1.4.3",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-pretty-code": "^0.14.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.1",
    "tailwind-merge": "^3.5.0",
    "@next/mdx": "^16.2.2",
    "@mdx-js/loader": "^3.1.0",
    "@mdx-js/react": "^3.1.0",
    "@types/mdx": "^2.0.13"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.2",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^2.1.0",
    "@vitejs/plugin-react": "^4.3.0"
  },
  "packageManager": "pnpm@9.15.0"
}
```

- [x] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out"]
}
```

- [x] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["remark-gfm", {}]],
    rehypePlugins: [
      ["rehype-slug", {}],
      ["rehype-autolink-headings", { behavior: "wrap" }],
    ],
  },
});

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default withMDX(nextConfig);
```

> **Note:** `rehype-pretty-code` will be wired in M8 (writing pipeline) once a theme is selected. Keeping it out of the MDX options here avoids failures on zero-post builds.

- [x] **Step 4: Write `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [x] **Step 5: Write stub `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vojtěch Sýkora",
  description: "AI Engineer & Product Builder — Prague.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [x] **Step 6: Write stub `src/app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main>
      <h1>Vojtěch Sýkora</h1>
      <p>Portfolio under construction.</p>
    </main>
  );
}
```

- [x] **Step 7: Write stub `src/app/globals.css`**

```css
@import "tailwindcss";
```

- [x] **Step 8: Install dependencies**

```bash
cd /home/vojta/Documents/projects/portfolio-v2
pnpm install
```

Expected: installs successfully. If `radix-ui@1.4.3` or `@next/mdx@16.2.2` version is unavailable, adjust to the latest minor and note the change — do not silently replace with `@radix-ui/react-*`.

- [x] **Step 9: Verify build works**

```bash
pnpm build
```

Expected: builds to `out/` with an index page. If it fails on `trailingSlash` + export, check `node_modules/next/dist/docs/` for static-export guidance in Next 16.

- [x] **Step 10: Verify dev server**

```bash
pnpm dev
```

Expected: http://localhost:3200 serves the stub page. Stop with `Ctrl+C` after confirming.

- [x] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 + Tailwind 4 project (static export)"
```

---

### Task 1.2: Vitest setup

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/smoke.test.ts`

- [x] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [x] **Step 2: Write a smoke test to prove the runner works**

`tests/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("arithmetic", () => {
    expect(2 + 2).toBe(4);
  });
});
```

- [x] **Step 3: Run tests**

```bash
pnpm test
```

Expected: `1 passed`.

- [x] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add vitest with smoke test"
```

---

## M2 — Design system port

### Task 2.1: Port `globals.css` and DM Sans font

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [x] **Step 1: Replace `src/app/globals.css` with the full Phthalo Cream tokens**

Copy the entire contents of `/home/vojta/Documents/projects/projects-web/apps/web/src/app/globals.css` into `src/app/globals.css`. This includes:
- `:root` tokens (green, green-dark, green-mid, bordeaux, cedar, bone, bg, bg2, bg3, text, text-muted, text-dim, border, radius, plus legacy aliases)
- `@theme inline` color mappings for Tailwind v4 utilities
- `body` baseline (DM Sans, 13px body, line-height 1.65)
- `::selection` (bordeaux on bone)
- `.prose-showcase` markdown styles (reused by `/writing/[slug]`)

Do not modify values. If the file in projects-web diverges from what this plan references, prefer the live file.

- [x] **Step 2: Wire DM Sans in `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vojtěch Sýkora — AI Engineer & Product Builder",
  description:
    "AI Engineer & Product Builder in Prague. Building AI products at Miton VC.",
  metadataBase: new URL("https://vojtechsykora.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
```

> **Note on Next.js 16:** confirm `next/font/google` still exports `DM_Sans` by checking `node_modules/next/dist/docs/` (font-optimization guide). If the API has shifted, adjust but keep the `--font-dm-sans` CSS variable name — it's referenced by globals.css.

- [x] **Step 3: Sanity check — a styled stub page**

Edit `src/app/page.tsx` to use Tailwind tokens:

```tsx
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
    </main>
  );
}
```

- [x] **Step 4: Run dev server and eyeball palette**

```bash
pnpm dev
```

Visit http://localhost:3200 — expect cream background, phthalo heading, bordeaux accent, and 8 color swatches rendering. Stop the server.

- [x] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: port Phthalo Cream tokens + DM Sans font from projects-web"
```

---

### Task 2.2: Port shadcn Button primitive and `cn()` helper

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`

- [x] **Step 1: Write `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [x] **Step 2: Port Button from projects-web**

Copy `/home/vojta/Documents/projects/projects-web/apps/web/src/components/ui/button.tsx` verbatim into `src/components/ui/button.tsx`. It uses `radix-ui` → `Slot.Root`, `cva`, `cn` from `@/lib/utils`, and hard-coded Phthalo hex values for robustness — keep all of this.

- [x] **Step 3: Render a Button on the sanity page**

Edit `src/app/page.tsx` — add below the swatches:

```tsx
import { Button } from "@/components/ui/button";

// …
<div className="mt-6 flex gap-3">
  <Button>Default (bordeaux)</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</div>
```

- [x] **Step 4: Dev check**

Run `pnpm dev`, load page, confirm all 5 button variants render with Phthalo styling.

- [x] **Step 5: Build check**

```bash
pnpm build
```

Expected: succeeds, produces `out/index.html`.

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: port Button primitive and cn() from projects-web"
```

---

## M3 — Content types + TS modules

### Task 3.1: Define content types

**Files:**
- Create: `src/content/types.ts`

- [x] **Step 1: Write `src/content/types.ts`**

```ts
export type Bio = {
  name: string;
  role: string;
  location: string;
  tagline: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  avatar?: string;
  spokenLanguages: { name: string; proficiency: string }[];
  techStack: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string;          // ISO year-month e.g. "2025-10"
  end: string | "present";
  dateDisplay: string;    // e.g. "Oct 2025 — Present"
  location: string;
  modality?:
    | "Remote"
    | "Hybrid"
    | "On-site"
    | "Part-time"
    | "Contract"
    | "Full-time";
  logo?: string;
  link?: string;
  description: string[];
  skills: string[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  field?: string;
  start: string;
  end: string;
  dateDisplay: string;
  location: string;
  logo?: string;
  link?: string;
  description: string[];
  skills: string[];
  grade?: string;
  thesis?: string;
  certificateLink?: string;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  credentialId?: string;
  credentialUrl?: string;
};

export type Testimonial = {
  id: string;
  author: string;
  authorRole: string;
  excerpt: string;
  fullText?: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  date?: string;
  description: string;
  tags: string[];
  github?: string;
  webapp?: string;
  paper?: string;
  image?: string;
  featured: boolean;
};

export type WritingMeta = {
  slug: string;
  title: string;
  date: string;      // ISO YYYY-MM-DD
  excerpt: string;
  tags: string[];
  published: boolean;
  readingMinutes: number;
};
```

- [x] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [x] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: define content model types"
```

---

### Task 3.2: Bio module

**Files:**
- Create: `src/content/bio.ts`

- [x] **Step 1: Write `src/content/bio.ts`**

Content drawn from `docs/content-source/linkedin-2026-04.md`.

```ts
import type { Bio } from "./types";

export const bio: Bio = {
  name: "Vojtěch Sýkora",
  role: "AI Engineer & Product Builder",
  location: "Prague, Czechia",
  tagline: "I build tools I wish existed.",
  description:
    "For the past 5 years I have worked with research labs and startups across AI, robotics, transportation, and software. Lately I focused on AI Agents, LLMs and Computer Vision and thrive on solving complex challenges with practical and innovative solutions. Now I'm building AI products from ideas to scale at a VC while guiding with technical due diligence. Beyond the tech I'm a curious, creative problem-solver who loves to travel, play sports and make some delicious food.",
  email: "sykoravojtech01@gmail.com",
  github: "https://github.com/sykoravojtech",
  linkedin: "https://www.linkedin.com/in/sykoravojtech/",
  avatar: "/images/avatar.jpg",
  spokenLanguages: [
    { name: "Czech", proficiency: "Native" },
    { name: "English", proficiency: "Full professional (Cambridge C1)" },
    { name: "German", proficiency: "Limited working" },
  ],
  techStack: [
    "Python",
    "TypeScript",
    "Next.js",
    "React",
    "FastAPI",
    "PostgreSQL",
    "PyTorch",
    "LangChain",
    "Claude Code",
    "MCP",
  ],
};
```

- [x] **Step 2: Typecheck**

```bash
pnpm exec tsc --noEmit
```

- [x] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add bio content module"
```

---

### Task 3.3: Experience module

**Files:**
- Create: `src/content/experiences.ts`

- [x] **Step 1: Write `src/content/experiences.ts`**

Content sourced from `docs/content-source/linkedin-2026-04.md` → Experience section. Order = newest first.

```ts
import type { Experience } from "./types";

export const experiences: Experience[] = [
  {
    id: "miton",
    company: "Miton",
    role: "AI Engineer & Venture Builder",
    start: "2025-10",
    end: "present",
    dateDisplay: "Oct 2025 — Present",
    location: "Prague, Czechia",
    modality: "Full-time",
    logo: "/images/experience/miton.jpeg",
    link: "https://miton.cz",
    description: [
      "Project lead, technical and product — Claude Code, Codex, orchestration, agents.",
      "LLM: OpenAI, structured extraction, intent parsing, summarization.",
      "Data pipelines: multi-source ingestion, enrichment, identity resolution, scoring.",
      "Database: PostgreSQL, pgvector (HNSW), Docker, SQLAlchemy, Alembic.",
      "Backend: FastAPI, MCP server, CLI pipelines. Frontend: Next.js, TypeScript, shadcn/ui.",
      "Auth: JWT, bcrypt, cookie-based sessions, RBAC. Infra: VPS, nginx (local → dev → prod).",
      "Evaluated AI integration opportunities; technical DD, strategy, leading discussions.",
    ],
    skills: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Next.js",
      "TypeScript",
      "LLM",
      "Agents",
      "MCP",
    ],
  },
  {
    id: "stealth-startup",
    company: "Stealth Startup (Robotics & AI)",
    role: "Founder & CEO",
    start: "2025-05",
    end: "2026-01",
    dateDisplay: "May 2025 — Jan 2026",
    location: "Munich, Germany",
    description: [
      "AI, Computer Vision, VLMs; dataset management, crowdfunding and collection; grasping point detection.",
      "Strategy, leadership, pitching, investor communication, organization.",
    ],
    skills: ["Computer Vision", "VLM", "Leadership", "Fundraising"],
  },
  {
    id: "fzi",
    company: "FZI Research Center for Information Technology",
    role: "GenAI & Computer Vision Master's Thesis",
    start: "2025-03",
    end: "2025-09",
    dateDisplay: "Mar 2025 — Sep 2025",
    location: "Karlsruhe, Germany",
    modality: "Remote",
    logo: "/images/experience/fzi.jpeg",
    link: "https://www.fzi.de/en/",
    description: [
      "Enhanced a multi-modal pipeline to extract semantics from schematics, benchmarking against state-of-the-art Visual Language Models (VLMs).",
      "Independently created a comprehensive dataset of Raspberry Pi schematics for computer vision analysis.",
      "Increased object detection (Faster R-CNN) performance by 7.3% mAP.",
    ],
    skills: ["VLM", "Multi-Modal Deep Learning", "Python", "PyTorch", "Object Detection"],
  },
  {
    id: "synthavo",
    company: "synthavo",
    role: "Machine Learning Engineer",
    start: "2024-12",
    end: "2025-07",
    dateDisplay: "Dec 2024 — Jul 2025",
    location: "Stuttgart, Germany",
    modality: "Hybrid",
    logo: "/images/experience/synthavo.jpeg",
    link: "https://www.synthavo.de/en/",
    description: [
      "Lead agile development of an agentic Multimodal LLM prototype using LangChain, LangGraph, ChromaDB, and RAG to create an MVP.",
      "Communicated strategies and presented solutions to tech and business stakeholders.",
    ],
    skills: ["LangChain", "LangGraph", "RAG", "ChromaDB", "PyTorch", "Python"],
  },
  {
    id: "ciirc-researcher",
    company: "Czech Institute of Informatics, Robotics and Cybernetics",
    role: "Machine Learning Researcher",
    start: "2023-03",
    end: "2023-07",
    dateDisplay: "Mar 2023 — Jul 2023",
    location: "Prague, Czechia",
    modality: "Part-time",
    logo: "/images/experience/cvut-ciirc.jpeg",
    link: "https://www.ciirc.cvut.cz/",
    description: [
      "Research on identifying the most congested areas in urban environments (Dublin, Luxembourg).",
      "Adapted gravitational clustering techniques to detect high-traffic regions.",
      "Contributed to centralized traffic routing in SUMO simulation.",
      "Co-authored a paper submitted to Expert Systems with Applications (ESWA), Elsevier.",
    ],
    skills: ["Machine Learning", "Python", "SUMO", "Traffic Simulation", "Clustering"],
  },
  {
    id: "charles",
    company: "Charles University in Prague",
    role: "Data Analyst",
    start: "2020-07",
    end: "2022-12",
    dateDisplay: "Jul 2020 — Dec 2022",
    location: "Prague, Czechia",
    modality: "Contract",
    logo: "/images/experience/charles-uni.png",
    link: "https://cuni.cz/UKEN-1.html",
    description: [
      "Project 1 (2020): Analyzed 600K+ records on internal migration flows in the Czech Republic (MySQL, Python).",
      "Project 2 (2022): Animated choropleth map of allowance-for-living distribution (Python, GeoJSON, NumPy, Pandas, Plotly).",
    ],
    skills: ["Python", "MySQL", "Pandas", "Plotly", "Data Visualization"],
  },
  {
    id: "us-afrl",
    company: "US Air Force Research Lab & CTU FEE AI Center",
    role: "Artificial Intelligence Researcher",
    start: "2021-09",
    end: "2022-07",
    dateDisplay: "Sep 2021 — Jul 2022",
    location: "Prague, Czechia",
    modality: "Part-time",
    logo: "/images/experience/ai-fee-ctu.png",
    link: "https://www.aic.fel.cvut.cz/",
    description: [
      "Contributed to FRAS (Flexible and Resilient Autonomous Systems) research project funded by US Air Force.",
      "Developed Python/PDDL environment generator for single and multi-agent AI planning strategies.",
      "Applied classical planning and game theory for adversarial environments.",
    ],
    skills: ["Classical Planning", "Game Theory", "PDDL", "Python"],
  },
  {
    id: "scilif",
    company: "SCILIF",
    role: "Android App Developer",
    start: "2021-07",
    end: "2021-10",
    dateDisplay: "Jul 2021 — Oct 2021",
    location: "Prague, Czechia",
    modality: "Contract",
    logo: "/images/experience/sunfibre-logo.jpeg",
    link: "https://www.scilif.com/",
    description: [
      "Designed and built an Android app to manage multiple Bluetooth Low Energy devices (Kotlin).",
    ],
    skills: ["Android", "Kotlin", "BLE"],
  },
  {
    id: "cbf",
    company: "Czech Basketball Federation",
    role: "Basketball Referee",
    start: "2016-09",
    end: "2020-06",
    dateDisplay: "Sep 2016 — Jun 2020",
    location: "Prague, Czechia",
    modality: "Part-time",
    logo: "/images/experience/cbf-logo.png",
    link: "https://cbf.cz.basketball/o-cbf/p81",
    description: [
      "Officiated 100+ games across U14, U16, U18, and adult categories.",
      "Developed leadership, teamwork, and decision-making under pressure.",
    ],
    skills: ["Leadership", "Decision-making"],
  },
  {
    id: "ciirc-intern",
    company: "Czech Institute of Informatics, Robotics and Cybernetics",
    role: "Robotics Intern",
    start: "2017-04",
    end: "2019-08",
    dateDisplay: "Apr 2017 — Aug 2019",
    location: "Prague, Czechia",
    logo: "/images/experience/cvut-ciirc.jpeg",
    link: "https://www.ciirc.cvut.cz/",
    description: [
      "Automated 3D printing tasks for ABB YUMI robot at CIIRC.",
      "Developed a scannable coding system to sort printed parts.",
    ],
    skills: ["Robotics", "ABB YUMI"],
  },
  {
    id: "launchx",
    company: "LaunchX Entrepreneurship Program",
    role: "Founder & Winner, MIT Startup Competition",
    start: "2018-09",
    end: "2019-06",
    dateDisplay: "Sep 2018 — Jun 2019",
    location: "Brussels, Belgium",
    logo: "/images/experience/mit-launchx.jpeg",
    description: [
      "Developed a startup connecting visually impaired people with visually healthy people.",
      "Won Brussels Demo Day; invited to MIT (Boston, USA) for further development.",
    ],
    skills: ["Entrepreneurship", "Product"],
  },
];
```

- [x] **Step 2: Typecheck**

```bash
pnpm exec tsc --noEmit
```

- [x] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add experiences content module (11 entries from LinkedIn 2026-04)"
```

---

### Task 3.4: Education, Certifications, Testimonials modules

**Files:**
- Create: `src/content/education.ts`
- Create: `src/content/certifications.ts`
- Create: `src/content/testimonials.ts`

- [x] **Step 1: Write `src/content/education.ts`**

```ts
import type { Education } from "./types";

export const education: Education[] = [
  {
    id: "tuebingen",
    school: "University of Tübingen",
    degree: "Master's degree",
    field: "Machine Learning",
    start: "2023-09",
    end: "2025-09",
    dateDisplay: "Sep 2023 — Sep 2025",
    location: "Tübingen, Germany",
    logo: "/images/education/uni-tue-logo.jpeg",
    link: "https://uni-tuebingen.de/en/study/finding-a-course/degree-programs-available/detail/course/machine-learning-master/",
    description: [
      "Full scholarship from the DAAD German Academic Exchange Service for the whole 2-year program.",
      "Focused on Deep Learning, Computer Vision, and Entrepreneurship.",
      "Thesis: Multi-modal Deep Learning for Automated Schematic Analysis.",
    ],
    skills: ["Python", "AI", "ML", "Deep Learning", "Computer Vision"],
    thesis:
      "Multi-modal Deep Learning for Automated Schematic Analysis (FZI Research Center)",
  },
  {
    id: "ctu",
    school: "Czech Technical University in Prague",
    degree: "Bachelor's degree",
    field: "Open Informatics (specialization Artificial Intelligence)",
    start: "2020-09",
    end: "2023-06",
    dateDisplay: "Sep 2020 — Jun 2023",
    location: "Prague, Czechia",
    logo: "/images/education/ctu-logo-small.png",
    link: "https://fel.cvut.cz/en/study-programs/oi-open-informatics",
    description: [
      "Computer Science studies with a focus on Artificial Intelligence.",
      "Thesis: Proximal Policy Optimization for Car Racing with unpredictable Wind.",
      "Data Structures & Algorithms, C/C++, Java, Python, Parallel Computing.",
    ],
    skills: ["Python", "C++", "AI", "C"],
    thesis:
      "Proximal Policy Optimization for Car Racing with unpredictable Wind",
  },
  {
    id: "prgai",
    school: "prg.ai Minor",
    degree: "Artificial Intelligence",
    start: "2021-09",
    end: "2023-06",
    dateDisplay: "2021 — 2023",
    location: "Prague, Czechia",
    logo: "/images/education/prgai.webp",
    link: "https://prg.ai/en/minor/",
    description: [
      "Interdisciplinary AI curriculum bringing together students, teachers, and researchers from prestigious Prague universities.",
    ],
    skills: ["Neural Networks"],
  },
  {
    id: "porg",
    school: "PORG",
    degree: "International Baccalaureate — Diploma Programme",
    field: "Mathematics",
    start: "2018-09",
    end: "2020-06",
    dateDisplay: "2018 — 2020",
    location: "Prague, Czechia",
    logo: "/images/education/porg.jpeg",
    link: "https://www.porg.cz/en/",
    description: [
      "Higher Level — Mathematics, Physics, Economics.",
      "Standard Level — English, Czech, German.",
      "Extended Essay — Mathematics (Quaternions).",
    ],
    skills: [],
    grade: "39/45",
  },
];
```

- [x] **Step 2: Write `src/content/certifications.ts`**

```ts
import type { Certification } from "./types";

export const certifications: Certification[] = [
  {
    id: "pytorch-segmentation",
    title: "Deep Learning with PyTorch: Image Segmentation",
    issuer: "Coursera",
    issuedAt: "Oct 2024",
    credentialId: "A2WTWT4W3EMZ",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/records/A2WTWT4W3EMZ",
  },
  {
    id: "pytorch-localization",
    title: "Deep Learning with PyTorch: Object Localization",
    issuer: "Coursera",
    issuedAt: "Oct 2024",
    credentialId: "43HNIYEPG9TI",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/records/43HNIYEPG9TI",
  },
  {
    id: "cnn-tensorflow",
    title: "Convolutional Neural Networks in TensorFlow",
    issuer: "Coursera",
    issuedAt: "Jul 2022",
    credentialId: "6GFEFTHP9CZJ",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/certificate/6GFEFTHP9CZJ",
  },
  {
    id: "intro-tensorflow",
    title:
      "Introduction to TensorFlow for Artificial Intelligence, Machine Learning, and Deep Learning",
    issuer: "Coursera",
    issuedAt: "Jul 2022",
    credentialId: "GPYNZXTPH73S",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/certificate/GPYNZXTPH73S",
  },
  {
    id: "nn-deep-learning",
    title: "Neural Networks and Deep Learning",
    issuer: "Coursera",
    issuedAt: "Jun 2022",
    credentialId: "AGTSQFDPRK9T",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/certificate/AGTSQFDPRK9T",
  },
  {
    id: "python-bootcamp",
    title: "The Modern Python 3 Bootcamp",
    issuer: "Udemy",
    issuedAt: "Jul 2021",
  },
  {
    id: "cambridge-cae",
    title: "Certificate in Advanced English (C1)",
    issuer: "Cambridge Assessment English",
    issuedAt: "Jun 2017",
    credentialId: "A4211387",
  },
];
```

- [x] **Step 3: Write `src/content/testimonials.ts`**

```ts
import type { Testimonial } from "./types";

export const testimonials: Testimonial[] = [
  {
    id: "lukas-chrpa",
    author: "Lukas Chrpa",
    authorRole: "Supervisor, CTU FEE AI Center",
    excerpt:
      "Vojtěch is very proactive in learning new knowledge on the subject. He always delivered what he was asked for on time and of very good quality. He can set his own agenda, as he did for his bachelor thesis topic, by investigating related work and available sources. Communication with him was flawless.",
    fullText:
      "I know Vojtěch Sýkora since September 2021 when he started working on a project called 'Flexible and Resilient Autonomous Systems' (funded by Air Force Office of Scientific Research) under my supervision, where he was involved in developing planning domain models and problem instance generators for 2-player domains. From September 2022 to May 2023 he pursued his bachelor thesis under my supervision, where he developed a deep learning algorithm for controlling a racing car in the CarRacing simulator from OpenAI. From March 2023 to July 2023, he worked under my supervision on a project funded by Czech Science Foundation concerning intelligent traffic routing in urban areas, where he designed a method for identifying urban subregions that are prone to traffic congestion. Vojtěch Sýkora is very proactive in learning new knowledge on the subject (e.g. automated planning, machine learning). He always delivered what he was asked for on time and of very good quality. He can set his own agenda such as he did for his bachelor thesis topic, by investigating related work and available sources for the topic of interest. Communication with him was flawless and I am confident that he will manage to effectively communicate with his teammates and other colleagues.",
  },
];
```

- [x] **Step 4: Typecheck**

```bash
pnpm exec tsc --noEmit
```

- [x] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add education, certifications, and testimonials content modules"
```

---

### Task 3.5: Projects module

**Files:**
- Create: `src/content/projects.ts`

- [x] **Step 1: Write `src/content/projects.ts`**

```ts
import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "projects-hub",
    title: "Projects Hub",
    category: "Platform",
    description:
      "Personal tools platform: Next.js + FastAPI gateway, Postgres, JWT auth, per-user permissions, admin dashboard. Hosts several small apps under one login.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "TypeScript", "Python", "shadcn/ui"],
    webapp: "https://projects.vojtechsykora.com",
    featured: true,
  },
  {
    id: "black-forest-hackathon",
    title: "Black Forest Hackathon — Data Decoded",
    category: "Hackathon",
    date: "May 2025",
    description:
      "Enhanced HRI prototype integrating voice commands, gesture control, and human recognition for factory robots. Led a 5-member team over 48 hours.",
    tags: ["MediaPipe", "YOLOv8", "ROS", "Python"],
    featured: true,
  },
  {
    id: "instance-segmentation",
    title: "Instance Segmentation Challenge",
    category: "Computer Vision",
    date: "Oct 2024",
    description:
      "Detectron2 + Mask R-CNN for accurate 2D object segmentation; achieved 46.1 AP on a challenging dataset.",
    tags: ["Detectron2", "Mask R-CNN", "PyTorch"],
    github: "https://github.com/sykoravojtech/instance-segmentation-challenge",
    featured: false,
  },
  {
    id: "video-transformers",
    title: "Video Transformers for Classification & Captioning",
    category: "Deep Learning",
    date: "Mar 2024",
    description:
      "SVT + Video Mamba pipeline on Charades. 29.82 mAP classification; BLEU-1 > 0.22 with GPT-2 captioning decoder.",
    tags: ["Video Mamba", "SVT", "GPT-2", "PyTorch"],
    github:
      "https://github.com/sykoravojtech/VideoMamba_SVT_VideoUnderstanding",
    featured: true,
  },
  {
    id: "utc-framework",
    title: "Urban Traffic Control Framework",
    category: "Research",
    date: "Mar 2023",
    description:
      "Gravitational clustering for congested urban areas (Dublin, Luxembourg). Centralized routing in SUMO. Co-authored paper submitted to ESWA, Elsevier.",
    tags: ["Python", "SUMO", "Clustering", "Research"],
    github: "https://github.com/Matyxus/UTC_Framework",
    featured: false,
  },
  {
    id: "ppo-car-racing",
    title: "PPO for Car Racing",
    category: "Reinforcement Learning",
    date: "Jul 2022",
    description:
      "Bachelor thesis: Proximal Policy Optimization agent in OpenAI CarRacing with custom wind dynamics. Outperformed baseline environments.",
    tags: ["PPO", "Reinforcement Learning", "OpenAI Gym", "Python"],
    featured: false,
  },
];
```

- [x] **Step 2: Typecheck**

```bash
pnpm exec tsc --noEmit
```

- [x] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add projects content module (curated portfolio)"
```

---

## M4 — Helpers + tests

### Task 4.1: Date helpers with TDD

**Files:**
- Create: `src/lib/dates.ts`
- Create: `tests/dates.test.ts`

- [x] **Step 1: Write failing tests first**

`tests/dates.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseStart, compareByStartDesc } from "@/lib/dates";

describe("parseStart", () => {
  it("parses ISO year-month", () => {
    expect(parseStart("2025-10")).toEqual(new Date("2025-10-01T00:00:00Z"));
  });

  it("parses ISO year only as January", () => {
    expect(parseStart("2023")).toEqual(new Date("2023-01-01T00:00:00Z"));
  });
});

describe("compareByStartDesc", () => {
  it("sorts newer first", () => {
    const items = [
      { start: "2020-01" },
      { start: "2025-10" },
      { start: "2023-06" },
    ];
    const sorted = [...items].sort(compareByStartDesc);
    expect(sorted.map((i) => i.start)).toEqual([
      "2025-10",
      "2023-06",
      "2020-01",
    ]);
  });
});
```

- [x] **Step 2: Run tests — expect fail**

```bash
pnpm test
```

Expected: fails on "Cannot find module '@/lib/dates'".

- [x] **Step 3: Implement `src/lib/dates.ts`**

```ts
export function parseStart(value: string): Date {
  if (/^\d{4}$/.test(value)) {
    return new Date(`${value}-01-01T00:00:00Z`);
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    return new Date(`${value}-01T00:00:00Z`);
  }
  return new Date(value);
}

export function compareByStartDesc<T extends { start: string }>(
  a: T,
  b: T
): number {
  return parseStart(b.start).getTime() - parseStart(a.start).getTime();
}
```

- [x] **Step 4: Run tests — expect pass**

```bash
pnpm test
```

- [x] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add date parsing and sort helpers (TDD)"
```

---

### Task 4.2: Content helper functions with TDD

**Files:**
- Create: `src/lib/content.ts`
- Create: `tests/content-helpers.test.ts`

- [x] **Step 1: Write failing tests**

`tests/content-helpers.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  getLatestExperiences,
  getLatestEducation,
  getFeaturedProjects,
} from "@/lib/content";

describe("getLatestExperiences", () => {
  it("returns items sorted newest-first and limited by count", () => {
    const result = getLatestExperiences(3);
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("miton");
  });

  it("returns all when count omitted", () => {
    const result = getLatestExperiences();
    expect(result.length).toBeGreaterThan(5);
  });
});

describe("getLatestEducation", () => {
  it("returns newest first", () => {
    const result = getLatestEducation();
    expect(result[0].id).toBe("tuebingen");
  });
});

describe("getFeaturedProjects", () => {
  it("returns only projects with featured=true", () => {
    const result = getFeaturedProjects();
    expect(result.every((p) => p.featured)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(3);
  });
});
```

- [x] **Step 2: Run — expect fail**

```bash
pnpm test
```

- [x] **Step 3: Implement `src/lib/content.ts`**

```ts
import { experiences } from "@/content/experiences";
import { education } from "@/content/education";
import { projects } from "@/content/projects";
import type { Experience, Education, Project } from "@/content/types";
import { compareByStartDesc } from "@/lib/dates";

export function getLatestExperiences(count?: number): Experience[] {
  const sorted = [...experiences].sort(compareByStartDesc);
  return count == null ? sorted : sorted.slice(0, count);
}

export function getLatestEducation(count?: number): Education[] {
  const sorted = [...education].sort(compareByStartDesc);
  return count == null ? sorted : sorted.slice(0, count);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
```

- [x] **Step 4: Run — expect pass**

```bash
pnpm test
```

- [x] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add content helpers with tests"
```

---

### Task 4.3: MDX loader with TDD

**Files:**
- Create: `src/lib/mdx.ts`
- Create: `src/content/writing/_fixture.mdx` (fixture only)
- Create: `tests/mdx.test.ts`

- [x] **Step 1: Create fixture post**

`src/content/writing/_fixture.mdx`:

```mdx
---
title: "Fixture post"
date: "2026-01-15"
excerpt: "Used by tests only — not published."
tags: ["test"]
published: false
---

# Fixture

Content body.

Second paragraph with **bold** text.
```

- [x] **Step 2: Write failing tests**

`tests/mdx.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  getAllWritingMeta,
  getPublishedWritingMeta,
  getWritingBySlug,
} from "@/lib/mdx";

describe("writing loader", () => {
  it("lists all posts including unpublished", () => {
    const all = getAllWritingMeta();
    expect(all.some((p) => p.slug === "_fixture")).toBe(true);
  });

  it("filters unpublished by default", () => {
    const published = getPublishedWritingMeta();
    expect(published.some((p) => p.slug === "_fixture")).toBe(false);
  });

  it("reads a post body by slug", () => {
    const post = getWritingBySlug("_fixture");
    expect(post).not.toBeNull();
    expect(post!.meta.title).toBe("Fixture post");
    expect(post!.content).toContain("# Fixture");
  });

  it("estimates reading minutes from word count", () => {
    const post = getWritingBySlug("_fixture");
    expect(post!.meta.readingMinutes).toBeGreaterThanOrEqual(1);
  });
});
```

- [x] **Step 3: Run — expect fail**

```bash
pnpm test
```

- [x] **Step 4: Implement `src/lib/mdx.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { WritingMeta } from "@/content/types";

const WRITING_DIR = path.join(process.cwd(), "src", "content", "writing");

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function minutesFromWords(words: number): number {
  return Math.max(1, Math.round(words / 220));
}

function readAllSlugs(): string[] {
  if (!fs.existsSync(WRITING_DIR)) return [];
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export type LoadedWriting = {
  meta: WritingMeta;
  content: string;
};

export function getWritingBySlug(slug: string): LoadedWriting | null {
  const file = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const meta: WritingMeta = {
    slug,
    title: String(data.title ?? "Untitled"),
    date: String(data.date ?? "1970-01-01"),
    excerpt: String(data.excerpt ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    published: Boolean(data.published),
    readingMinutes: minutesFromWords(wordCount(content)),
  };

  return { meta, content };
}

export function getAllWritingMeta(): WritingMeta[] {
  return readAllSlugs()
    .map((slug) => getWritingBySlug(slug)?.meta)
    .filter((m): m is WritingMeta => m != null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPublishedWritingMeta(): WritingMeta[] {
  return getAllWritingMeta().filter((m) => m.published);
}
```

- [x] **Step 5: Run — expect pass**

```bash
pnpm test
```

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: MDX frontmatter loader with reading-time estimate (TDD)"
```

---

## M5 — Chrome (layout, Nav, Footer)

### Task 5.1: Nav component

**Files:**
- Create: `src/components/nav.tsx`

- [x] **Step 1: Write the component**

```tsx
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
```

> **Note:** If `next/navigation` → `usePathname` has shifted in Next 16, check `node_modules/next/dist/docs/` (App Router client APIs). The `"use client"` directive is required because `usePathname` is a client hook.

- [x] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: Nav component with active-link detection"
```

---

### Task 5.2: Footer component

**Files:**
- Create: `src/components/footer.tsx`

- [x] **Step 1: Write the component**

```tsx
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
```

- [x] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: Footer component"
```

---

### Task 5.3: Wire Nav + Footer into root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [x] **Step 1: Update `src/app/layout.tsx`**

Replace the body of the existing layout with:

```tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vojtěch Sýkora — AI Engineer & Product Builder",
  description:
    "AI Engineer & Product Builder in Prague. Building AI products at Miton VC.",
  metadataBase: new URL("https://vojtechsykora.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen flex flex-col bg-bg text-muted">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [x] **Step 2: Build + dev check**

```bash
pnpm build && pnpm dev
```

Visit http://localhost:3200 — expect nav (dark), stub page, footer (bone bg). Stop server.

- [x] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: wire Nav + Footer into root layout"
```

---

## M6 — Reusable components

### Task 6.1: SectionHeader and TagPill

**Files:**
- Create: `src/components/section-header.tsx`
- Create: `src/components/tag-pill.tsx`

- [ ] **Step 1: `src/components/section-header.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function SectionHeader({
  kicker,
  title,
  subtitle,
  className,
}: {
  kicker?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-6", className)}>
      {kicker && (
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-2">
          {kicker}
        </div>
      )}
      {title && (
        <h2 className="text-[22px] sm:text-[28px] font-black tracking-[-0.025em] text-ink">
          {title}
        </h2>
      )}
      {subtitle && <p className="mt-2 text-muted max-w-2xl">{subtitle}</p>}
    </header>
  );
}
```

- [ ] **Step 2: `src/components/tag-pill.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function TagPill({
  children,
  className,
  tone = "bordeaux",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "bordeaux" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-block text-[10px] font-semibold tracking-[0.06em] uppercase px-2 py-1 rounded border",
        tone === "bordeaux"
          ? "text-bordeaux bg-bordeaux/10 border-bordeaux/30"
          : "text-ink bg-bg3 border-border",
        className
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: SectionHeader and TagPill components"
```

---

### Task 6.2: ExperienceItem and EducationItem

**Files:**
- Create: `src/components/experience-item.tsx`
- Create: `src/components/education-item.tsx`

- [ ] **Step 1: `src/components/experience-item.tsx`**

```tsx
import Image from "next/image";
import type { Experience } from "@/content/types";
import { TagPill } from "./tag-pill";

export function ExperienceItem({
  item,
  showSkills = true,
}: {
  item: Experience;
  showSkills?: boolean;
}) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-4 py-4 border-b border-border last:border-b-0">
      <div className="text-[11px] font-semibold text-muted pt-1">
        {item.dateDisplay}
      </div>
      <div>
        <div className="flex items-start gap-3">
          {item.logo && (
            <Image
              src={item.logo}
              alt={item.company}
              width={32}
              height={32}
              className="rounded border border-border bg-bg2 shrink-0"
            />
          )}
          <div>
            <h3 className="text-[15px] font-bold text-ink tracking-[-0.015em]">
              {item.role}
            </h3>
            <p className="text-[12px] text-muted mt-0.5">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-bordeaux"
                >
                  {item.company}
                </a>
              ) : (
                item.company
              )}
              {" · "}
              {item.location}
              {item.modality && ` · ${item.modality}`}
            </p>
          </div>
        </div>
        <ul className="mt-2 list-disc pl-5 marker:text-cedar text-[12px] text-muted space-y-1">
          {item.description.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        {showSkills && item.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.skills.map((s) => (
              <TagPill key={s}>{s}</TagPill>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `src/components/education-item.tsx`**

```tsx
import Image from "next/image";
import type { Education } from "@/content/types";
import { TagPill } from "./tag-pill";

export function EducationItem({ item }: { item: Education }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-4 py-4 border-b border-border last:border-b-0">
      <div className="text-[11px] font-semibold text-muted pt-1">
        {item.dateDisplay}
      </div>
      <div>
        <div className="flex items-start gap-3">
          {item.logo && (
            <Image
              src={item.logo}
              alt={item.school}
              width={36}
              height={36}
              className="rounded border border-border bg-bg2 shrink-0"
            />
          )}
          <div>
            <h3 className="text-[15px] font-bold text-ink tracking-[-0.015em]">
              {item.degree}
              {item.field && <span className="text-muted font-normal"> · {item.field}</span>}
            </h3>
            <p className="text-[12px] text-muted mt-0.5">
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer" className="hover:text-bordeaux">
                  {item.school}
                </a>
              ) : (
                item.school
              )}
              {" · "}
              {item.location}
              {item.grade && ` · Grade: ${item.grade}`}
            </p>
          </div>
        </div>
        <ul className="mt-2 list-disc pl-5 marker:text-cedar text-[12px] text-muted space-y-1">
          {item.description.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        {item.thesis && (
          <p className="mt-2 text-[11px] italic text-muted">
            Thesis: <span className="text-ink not-italic font-semibold">{item.thesis}</span>
          </p>
        )}
        {item.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.skills.map((s) => (
              <TagPill key={s}>{s}</TagPill>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: ExperienceItem and EducationItem components"
```

---

### Task 6.3: CertificationCard, ProjectCard, WritingRow, Testimonial, Hero

**Files:**
- Create: `src/components/certification-card.tsx`
- Create: `src/components/project-card.tsx`
- Create: `src/components/writing-row.tsx`
- Create: `src/components/testimonial.tsx`
- Create: `src/components/hero.tsx`

- [ ] **Step 1: `src/components/certification-card.tsx`**

```tsx
import type { Certification } from "@/content/types";

export function CertificationCard({ item }: { item: Certification }) {
  return (
    <div className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-2">
      <div className="text-[10px] uppercase tracking-[0.12em] text-muted">{item.issuer}</div>
      <div className="text-[13px] font-bold text-ink leading-snug">{item.title}</div>
      <div className="text-[11px] text-muted">{item.issuedAt}</div>
      {item.credentialUrl && (
        <a
          href={item.credentialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-semibold text-green-mid hover:text-bordeaux mt-auto"
        >
          See credential →
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 2: `src/components/project-card.tsx`**

```tsx
import type { Project } from "@/content/types";
import { TagPill } from "./tag-pill";

export function ProjectCard({ item }: { item: Project }) {
  const primaryLink = item.webapp ?? item.github ?? item.paper;
  const primaryLabel = item.webapp
    ? "Live →"
    : item.github
    ? "GitHub →"
    : item.paper
    ? "Paper →"
    : null;

  return (
    <div className="bg-bg2 border border-border rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_16px_rgba(18,54,36,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(18,54,36,0.14)] hover:border-green/25 transition-all duration-[400ms]">
      <TagPill>{item.category}</TagPill>
      <h3 className="text-[18px] font-black tracking-[-0.02em] text-ink">
        {item.title}
      </h3>
      <p className="text-[12px] text-muted leading-relaxed flex-1">
        {item.description}
      </p>
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <TagPill key={t} tone="neutral">
              {t}
            </TagPill>
          ))}
        </div>
      )}
      {primaryLink && primaryLabel && (
        <a
          href={primaryLink}
          target="_blank"
          rel="noreferrer"
          className="text-[12px] font-bold text-green-mid hover:text-bordeaux mt-auto"
        >
          {primaryLabel}
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 3: `src/components/writing-row.tsx`**

```tsx
import Link from "next/link";
import type { WritingMeta } from "@/content/types";

function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

export function WritingRow({ meta }: { meta: WritingMeta }) {
  return (
    <Link
      href={`/writing/${meta.slug}`}
      className="grid grid-cols-[90px_1fr_auto] gap-4 py-3 border-b border-border hover:bg-bg2 transition-colors -mx-2 px-2 rounded"
    >
      <div className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] pt-1">
        {shortDate(meta.date)}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-ink">{meta.title}</div>
        {meta.excerpt && <div className="text-[11px] text-muted mt-0.5">{meta.excerpt}</div>}
      </div>
      <div className="text-[10px] text-muted pt-1 whitespace-nowrap">
        {meta.readingMinutes} min
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: `src/components/testimonial.tsx`**

```tsx
import type { Testimonial as T } from "@/content/types";

export function Testimonial({ item }: { item: T }) {
  return (
    <figure className="border-l-[3px] border-cedar pl-6 py-2">
      <blockquote className="text-[14px] italic text-muted leading-relaxed">
        "{item.excerpt}"
      </blockquote>
      <figcaption className="mt-3 text-[11px]">
        <span className="font-semibold text-ink">{item.author}</span>
        <span className="text-muted"> · {item.authorRole}</span>
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 5: `src/components/hero.tsx`**

```tsx
export function Hero({
  kicker,
  headline,
  tagline,
  ctas,
  compact = false,
}: {
  kicker?: string;
  headline: React.ReactNode;
  tagline?: React.ReactNode;
  ctas?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`bg-green text-bone border-b border-cedar/30`}>
      <div
        className={`max-w-[1120px] mx-auto px-6 ${
          compact ? "py-10 sm:py-14" : "py-14 sm:py-20"
        }`}
      >
        {kicker && (
          <div className="text-[10px] uppercase tracking-[0.16em] text-bone/55 mb-4">
            {kicker}
          </div>
        )}
        <h1
          className={`${
            compact ? "text-[32px] sm:text-[44px]" : "text-[44px] sm:text-[64px]"
          } font-black tracking-[-0.035em] leading-[1.02] text-bone`}
        >
          {headline}
        </h1>
        {tagline && <div className="mt-5 text-bone/70 max-w-[560px] text-[14px] leading-relaxed">{tagline}</div>}
        {ctas && <div className="mt-8 flex flex-wrap gap-3">{ctas}</div>}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Build check**

```bash
pnpm build
```

Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: CertificationCard, ProjectCard, WritingRow, Testimonial, Hero components"
```

---

## M7 — Pages

### Task 7.1: Home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace home page**

```tsx
import Link from "next/link";
import { bio } from "@/content/bio";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/section-header";
import { ExperienceItem } from "@/components/experience-item";
import { EducationItem } from "@/components/education-item";
import { ProjectCard } from "@/components/project-card";
import { WritingRow } from "@/components/writing-row";
import {
  getLatestExperiences,
  getLatestEducation,
  getFeaturedProjects,
} from "@/lib/content";
import { getPublishedWritingMeta } from "@/lib/mdx";

export default function Home() {
  const experiences = getLatestExperiences(3);
  const education = getLatestEducation(2);
  const featured = getFeaturedProjects().slice(0, 3);
  const posts = getPublishedWritingMeta().slice(0, 3);

  return (
    <>
      <Hero
        kicker={`${bio.location} · ${bio.role}`}
        headline={
          <>
            I <em className="font-light italic text-green-mid">build</em> tools I wish existed.
          </>
        }
        tagline={bio.description.split(". ").slice(0, 2).join(". ") + "."}
        ctas={
          <>
            <Button asChild>
              <a href={`mailto:${bio.email}`}>Get in touch</a>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-green-mid text-green-mid hover:bg-green-mid/10">
              <Link href="/VojtechSykora_CV_2026.pdf" target="_blank">Download CV ↓</Link>
            </Button>
          </>
        }
      />

      <div className="max-w-[1120px] mx-auto px-6 py-12 space-y-14">
        {/* About teaser */}
        <section>
          <SectionHeader kicker="About · teaser" />
          <p className="text-[14px] text-muted leading-relaxed max-w-2xl">
            {bio.description.split(". ").slice(0, 2).join(". ")}.
          </p>
          <Link href="/about" className="inline-block mt-3 text-green-mid font-bold text-[12px]">
            Read more →
          </Link>
        </section>

        {/* Experience teaser */}
        <section>
          <SectionHeader kicker="Experience · latest three" />
          <div>
            {experiences.map((e) => (
              <ExperienceItem key={e.id} item={e} showSkills={false} />
            ))}
          </div>
          <Link href="/experience" className="inline-block mt-4 text-green-mid font-bold text-[12px]">
            Full timeline →
          </Link>
        </section>

        {/* Education teaser */}
        <section>
          <SectionHeader kicker="Education · latest two" />
          <div>
            {education.map((e) => (
              <EducationItem key={e.id} item={e} />
            ))}
          </div>
          <Link href="/education" className="inline-block mt-4 text-green-mid font-bold text-[12px]">
            All education →
          </Link>
        </section>

        {/* Featured projects */}
        <section>
          <SectionHeader kicker="Featured projects" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p) => (
              <ProjectCard key={p.id} item={p} />
            ))}
          </div>
          <Link href="/projects" className="inline-block mt-4 text-green-mid font-bold text-[12px]">
            All projects →
          </Link>
        </section>

        {/* Languages & tech stack */}
        <section>
          <SectionHeader kicker="Languages & stack" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-2">Languages</div>
              <ul className="text-[12px] text-muted space-y-1">
                {bio.spokenLanguages.map((l) => (
                  <li key={l.name}>
                    <span className="font-semibold text-ink">{l.name}</span> · {l.proficiency}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-2">Tech I reach for</div>
              <div className="flex flex-wrap gap-1.5">
                {bio.techStack.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-bg3 text-ink border border-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Latest writing (hide when empty) */}
        {posts.length > 0 && (
          <section>
            <SectionHeader kicker="Latest writing" />
            <div>
              {posts.map((p) => (
                <WritingRow key={p.slug} meta={p} />
              ))}
            </div>
            <Link href="/writing" className="inline-block mt-4 text-green-mid font-bold text-[12px]">
              All posts →
            </Link>
          </section>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Build check**

```bash
pnpm build
```

Expected: succeeds (images may warn about missing files — that's fine until M9). If the build hard-fails due to missing images, add `missingImagesAllowed: true` logic or temporarily comment-out the `logo` prop for experiences.

- [ ] **Step 3: Dev check**

```bash
pnpm dev
```

Visit http://localhost:3200. Expect full hybrid home page. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: home page with hero + 6 teaser sections"
```

---

### Task 7.2: About page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Write page**

```tsx
import Image from "next/image";
import { bio } from "@/content/bio";
import { testimonials } from "@/content/testimonials";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { Testimonial } from "@/components/testimonial";

export default function AboutPage() {
  return (
    <>
      <Hero
        compact
        kicker="About"
        headline={
          <>
            The <em className="font-light italic text-green-mid">long</em> version.
          </>
        }
      />
      <div className="max-w-[760px] mx-auto px-6 py-12 space-y-10">
        <section className="flex flex-col sm:flex-row gap-6 items-start">
          {bio.avatar && (
            <Image
              src={bio.avatar}
              alt={bio.name}
              width={120}
              height={120}
              className="rounded-xl border border-border bg-bg2"
            />
          )}
          <div>
            <h2 className="text-[22px] font-black text-ink tracking-[-0.02em]">
              {bio.name}
            </h2>
            <p className="text-[12px] text-muted mb-3">
              {bio.role} · {bio.location}
            </p>
            <p className="text-[14px] leading-relaxed text-muted">{bio.description}</p>
          </div>
        </section>

        <section>
          <SectionHeader kicker="Languages" />
          <ul className="text-[13px] text-muted space-y-1">
            {bio.spokenLanguages.map((l) => (
              <li key={l.name}>
                <span className="font-semibold text-ink">{l.name}</span> — {l.proficiency}
              </li>
            ))}
          </ul>
        </section>

        {testimonials[0] && (
          <section>
            <SectionHeader kicker="What people say" />
            <Testimonial item={testimonials[0]} />
          </section>
        )}

        <section>
          <SectionHeader kicker="Outside the screen" />
          <p className="text-[13px] text-muted leading-relaxed">
            I travel, play sports, and cook a lot. In 2019 I spent a weekend helping renovate an old castle in eastern Czechia — the kind of hands-on work that makes you appreciate a good desk again.
          </p>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Build + dev check**

```bash
pnpm build && pnpm dev
```

Visit http://localhost:3200/about. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: /about page (bio, languages, testimonial, personal flavor)"
```

---

### Task 7.3: Experience page

**Files:**
- Create: `src/app/experience/page.tsx`

- [ ] **Step 1: Write page**

```tsx
import Link from "next/link";
import { bio } from "@/content/bio";
import { getLatestExperiences } from "@/lib/content";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { ExperienceItem } from "@/components/experience-item";
import { Button } from "@/components/ui/button";

export default function ExperiencePage() {
  const items = getLatestExperiences();

  return (
    <>
      <Hero
        compact
        kicker="Experience"
        headline={
          <>
            The <em className="font-light italic text-green-mid">full</em> timeline.
          </>
        }
        tagline="Every role, every stack — newest first."
      />
      <div className="max-w-[900px] mx-auto px-6 py-12 space-y-10">
        <section>
          {items.map((e) => (
            <ExperienceItem key={e.id} item={e} />
          ))}
        </section>
        <section className="bg-bg2 border border-border rounded-xl p-6">
          <SectionHeader kicker="What I'm looking for" title="Teams, problems, technologies" />
          <p className="text-[13px] text-muted leading-relaxed mb-4">
            I'm most energized when engineering meets product: shipping AI-powered tools that real people use, with a small team that ships fast and cares about craft. Open to senior engineering and AI-focused founding roles.
          </p>
          <Button asChild>
            <Link href={`mailto:${bio.email}`}>Get in touch</Link>
          </Button>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Build + dev check**

```bash
pnpm build && pnpm dev
```

Visit http://localhost:3200/experience. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: /experience page"
```

---

### Task 7.4: Education page

**Files:**
- Create: `src/app/education/page.tsx`

- [ ] **Step 1: Write page**

```tsx
import { education } from "@/content/education";
import { certifications } from "@/content/certifications";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { EducationItem } from "@/components/education-item";
import { CertificationCard } from "@/components/certification-card";
import { compareByStartDesc } from "@/lib/dates";

export default function EducationPage() {
  const sorted = [...education].sort(compareByStartDesc);

  return (
    <>
      <Hero
        compact
        kicker="Education"
        headline={
          <>
            Where I <em className="font-light italic text-green-mid">studied</em>.
          </>
        }
        tagline="Degrees and certifications, newest first."
      />
      <div className="max-w-[900px] mx-auto px-6 py-12 space-y-14">
        <section>
          <SectionHeader kicker="Degrees" />
          <div>
            {sorted.map((e) => (
              <EducationItem key={e.id} item={e} />
            ))}
          </div>
          <div className="mt-6 bg-bg2 border border-border rounded-xl p-4 text-[12px] text-muted">
            <span className="font-semibold text-ink">Honor:</span> DAAD Full Scholarship for Master Studies (2023) — full funding for the 2-year MSc at Tübingen, including community events across Germany.
          </div>
        </section>

        <section>
          <SectionHeader kicker="Certifications" subtitle="Coursework, bootcamps, language." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((c) => (
              <CertificationCard key={c.id} item={c} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Build + dev check**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: /education page (degrees + certifications + DAAD honor)"
```

---

### Task 7.5: Projects page

**Files:**
- Create: `src/app/projects/page.tsx`

- [ ] **Step 1: Write page**

```tsx
import { projects } from "@/content/projects";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { ProjectCard } from "@/components/project-card";

export default function ProjectsPage() {
  return (
    <>
      <Hero
        compact
        kicker="Projects"
        headline={
          <>
            Things I've <em className="font-light italic text-green-mid">built</em>.
          </>
        }
        tagline="Selected personal and research projects. Live tools at projects.vojtechsykora.com."
      />
      <div className="max-w-[1120px] mx-auto px-6 py-12 space-y-6">
        <SectionHeader kicker="All projects" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} item={p} />
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Build + dev check**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: /projects page"
```

---

## M8 — Writing (MDX list + post pages)

### Task 8.1: Writing list page

**Files:**
- Create: `src/app/writing/page.tsx`

- [ ] **Step 1: Write page**

```tsx
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { WritingRow } from "@/components/writing-row";
import { getPublishedWritingMeta } from "@/lib/mdx";

export default function WritingPage() {
  const posts = getPublishedWritingMeta();

  return (
    <>
      <Hero
        compact
        kicker="Writing"
        headline={
          <>
            Long-form <em className="font-light italic text-green-mid">notes</em>.
          </>
        }
        tagline="Occasional essays on AI, product, and personal projects."
      />
      <div className="max-w-[760px] mx-auto px-6 py-12">
        <SectionHeader kicker="All posts" />
        {posts.length === 0 ? (
          <p className="text-[13px] italic text-muted">First post coming soon.</p>
        ) : (
          <div>
            {posts.map((p) => (
              <WritingRow key={p.slug} meta={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Build + dev check — confirm empty state renders**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: /writing list page (empty state supported)"
```

---

### Task 8.2: Writing post page (MDX)

**Files:**
- Create: `src/app/writing/[slug]/page.tsx`

- [ ] **Step 1: Write page**

```tsx
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import fs from "node:fs";
import path from "node:path";
import { getWritingBySlug, getPublishedWritingMeta } from "@/lib/mdx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function generateStaticParams() {
  return getPublishedWritingMeta().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getWritingBySlug(slug);
  if (!post || !post.meta.published) notFound();

  return (
    <>
      <Hero
        compact
        kicker={`Writing · ${post.meta.readingMinutes} min read`}
        headline={post.meta.title}
        tagline={new Date(post.meta.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />
      <article className="max-w-[720px] mx-auto px-6 py-12 prose-showcase">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </>
  );
}
```

> **Note on `params`:** Next.js 16 makes route params async. `await params` is required. If your Next version exposes them sync, adjust — but in `next@16.2.2` they are async (confirm via `node_modules/next/dist/docs/app-router/` if behavior changes).

> **Note on MDX rendering:** we use `react-markdown` (already a dep from projects-web) for simplicity. `@next/mdx` is configured in `next.config.ts` but not strictly used here — the loader reads raw MDX text and passes it through react-markdown. JSX-in-MDX is not supported with this approach; upgrade to native MDX if needed later.

- [ ] **Step 2: Install react-markdown**

```bash
pnpm add react-markdown@^10.1.0
```

- [ ] **Step 3: Create seed post to test the page**

`src/content/writing/hello-world.mdx`:

```mdx
---
title: "Hello, world"
date: "2026-04-20"
excerpt: "The inaugural post on the new portfolio."
tags: ["meta"]
published: true
---

# Hello, world

This is the inaugural post on the new portfolio. Expect occasional notes here on AI, product, and the personal projects I build.

## Why this site exists

Short version: I wanted a recruiter-facing home that shares a design language with my [projects hub](https://projects.vojtechsykora.com/). Long version: later.
```

- [ ] **Step 4: Build + dev check**

```bash
pnpm build && pnpm dev
```

Visit:
- http://localhost:3200/writing — should list "Hello, world"
- http://localhost:3200/writing/hello-world — should render the post with prose-showcase styling

Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: /writing/[slug] MDX post page + seed post"
```

---

## M9 — Assets

### Task 9.1: Logos, avatar, icons

**Files:**
- Create: `public/images/experience/*` (copied from `../portfolio/src/images/experience/`)
- Create: `public/images/education/*` (copied from `../portfolio/src/images/education/`)
- Create: `public/images/avatar.jpg` (temporary fallback, real photo added later)
- Create: `src/app/icon.png`
- Create: `src/app/opengraph-image.png`

- [ ] **Step 1: Copy experience logos**

```bash
cd /home/vojta/Documents/projects/portfolio-v2
mkdir -p public/images/experience public/images/education
cp ../portfolio/src/images/experience/*.{jpeg,png,webp} public/images/experience/ 2>/dev/null || true
cp ../portfolio/src/images/education/*.{jpeg,png,webp} public/images/education/ 2>/dev/null || true
ls public/images/experience/
ls public/images/education/
```

- [ ] **Step 2: Rename files to match content modules**

The `experiences.ts` content references paths like `/images/experience/miton.jpeg`. The old portfolio doesn't have a Miton logo — skip rename if file doesn't exist (logo will be optional). For any mismatch where a file is present under a different name, rename:

```bash
cd public/images/experience
# Spot-check these specific mappings used in experiences.ts:
#   miton.jpeg           — NOT in old portfolio; obtain separately or leave missing
#   fzi.jpeg             — present
#   synthavo.jpeg        — present
#   cvut-ciirc.jpeg      — present
#   charles-uni.png      — present
#   ai-fee-ctu.png       — present
#   sunfibre-logo.jpeg   — present
#   cbf-logo.png         — present
#   mit-launchx.jpeg     — present
ls -1
```

If `miton.jpeg` is missing, leave the reference in `experiences.ts` — Next/Image will 404 on it at runtime. Either remove the `logo` field for Miton from `experiences.ts`, or place a downloaded Miton logo at `public/images/experience/miton.jpeg`. Simplest: edit `experiences.ts` and remove the `logo` line for the Miton entry.

- [ ] **Step 3: Avatar placeholder**

Until a real avatar is placed, create a simple 200×200 Phthalo block so the `/about` image tag resolves:

```bash
cd /home/vojta/Documents/projects/portfolio-v2
# Use ImageMagick if available; otherwise write the file separately.
which convert && convert -size 200x200 xc:'#123624' -fill '#D8D0C2' -gravity center -pointsize 90 -annotate 0 'VS' public/images/avatar.jpg || true
ls -la public/images/avatar.jpg 2>/dev/null || echo "No avatar — /about will render without image."
```

If ImageMagick isn't installed, skip this step — the `bio.avatar` field can be set to `undefined` in `src/content/bio.ts`, and `EducationItem`/`AboutPage` already guard against missing logos/avatars.

- [ ] **Step 4: Build check**

```bash
pnpm build
```

Images referenced from content must exist, or `next/image` will complain at build or runtime. Resolve any missing-file complaints by either:
- adding the file to `public/images/...`, or
- removing the `logo` field for that entry in the relevant content module.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: port experience and education logos from legacy portfolio"
```

---

### Task 9.2: Icon + OG image

**Files:**
- Create: `src/app/icon.png` (32×32 favicon)
- Create: `src/app/apple-icon.png` (180×180)
- Create: `src/app/opengraph-image.png` (1200×630 default)

- [ ] **Step 1: Generate simple icons**

Use ImageMagick if available:

```bash
cd /home/vojta/Documents/projects/portfolio-v2
which convert && convert -size 32x32 xc:'#123624' -fill '#D8D0C2' -gravity center -pointsize 18 -annotate 0 'VS' src/app/icon.png || echo "Install ImageMagick or design icon separately"
which convert && convert -size 180x180 xc:'#123624' -fill '#D8D0C2' -gravity center -pointsize 90 -annotate 0 'VS' src/app/apple-icon.png || true
which convert && convert -size 1200x630 xc:'#123624' -fill '#D8D0C2' -gravity center -pointsize 80 -annotate 0 'Vojtech Sykora\nAI Engineer & Product Builder' src/app/opengraph-image.png || true
```

If `convert` is unavailable, create the files manually in Figma/Affinity (1200×630 with `#123624` bg, `#D8D0C2` text) and place in `src/app/`. Next.js App Router picks them up by filename automatically — no additional config needed.

- [ ] **Step 2: Build + inspect**

```bash
pnpm build
ls out | grep -E "(icon|opengraph)"
```

Expected: at least `icon.png` is present in the build output.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add favicon, apple-icon, and default OG image"
```

---

## M10 — Deploy

### Task 10.1: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Confirm repo Pages settings (manual action)**

Write the following reminder in the commit body — it's a one-time manual step:

> After pushing, go to repo Settings → Pages → set Source to "GitHub Actions". Under "Custom domain" confirm `vojtechsykora.com`; enforce HTTPS. The `public/CNAME` file ensures it survives deploys.

- [ ] **Step 3: Commit + push**

```bash
git add -A
git commit -m "ci: GitHub Actions workflow to deploy static export to Pages"
git push origin main
```

- [ ] **Step 4: Watch the deploy**

```bash
gh run watch
```

Expected: build + deploy succeed. The production URL is `https://vojtechsykora.com`.

If the build fails on runner:
- Pin pnpm version in `packageManager` field of `package.json` (already done).
- If `pnpm install --frozen-lockfile` fails, commit an updated `pnpm-lock.yaml` from local.

---

### Task 10.2: Production smoke test

- [ ] **Step 1: Load the site in a real browser**

Visit https://vojtechsykora.com. Check:
- Home hero renders (phthalo bg, bordeaux CTA).
- `/about`, `/experience`, `/education`, `/projects`, `/writing` all load.
- `/VojtechSykora_CV_2026.pdf` downloads.
- Nav active state works across routes.
- Mobile viewport (DevTools responsive mode) renders without horizontal scroll.

- [ ] **Step 2: Check social-share preview**

Paste `https://vojtechsykora.com` into a LinkedIn post draft or use https://www.opengraph.xyz/ — expect the OG image to render.

- [ ] **Step 3: No commit — this is verification only.**

---

## M11 — Polish

### Task 11.1: Mobile + a11y pass

**Files:** may modify any of `nav.tsx`, page files.

- [ ] **Step 1: Mobile nav review**

Open DevTools mobile view (iPhone 13 preset). The nav should either:
- Wrap gracefully (ok for 6 links + Contact + brand on larger phones), or
- Hide the links behind a hamburger on narrow screens.

If links crowd the brand below 500px, gate them behind a hamburger. Minimal change: replace `<ul className="flex items-center gap-6 text-[13px]">` with a flex that wraps + smaller gap, or introduce state. If adding a hamburger, it must remain accessible (keyboard + aria-expanded).

Simplest pass: apply `hidden sm:flex` to the links list and add a mobile menu button using `lucide-react`'s `Menu` icon that toggles a full-screen overlay. Full code:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-green text-bone border-b border-cedar/30 relative">
      <nav className="max-w-[1120px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-black tracking-tight text-base text-bone" onClick={() => setOpen(false)}>
          vojtech sykora
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-[13px]">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "transition-colors",
                  isActive(l.href) ? "text-green-mid font-bold" : "text-bone/70 hover:text-bone"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="mailto:sykoravojtech01@gmail.com"
              className="inline-flex items-center rounded-md bg-bordeaux text-bone px-3 py-1.5 text-[12px] font-semibold hover:bg-[#5E2230]"
            >
              Contact
            </a>
          </li>
        </ul>

        <button
          className="md:hidden p-2 text-bone"
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
                    "block py-1",
                    isActive(l.href) ? "text-green-mid font-bold" : "text-bone/80"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="mailto:sykoravojtech01@gmail.com"
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-md bg-bordeaux text-bone px-3 py-1.5 text-[13px] font-semibold"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Accessibility pass**

- Confirm every nav link has visible text (already does).
- All `<a>` with `target="_blank"` already carry `rel="noreferrer"`.
- The hero decorative `<em>` is semantic emphasis, not a styling hack — ok.
- `<main>` wraps page content (layout.tsx sets this).
- `<header>`, `<footer>`, `<article>` used where appropriate.
- Color contrast: phthalo/bone ≈ 14:1, bordeaux/bone ≈ 8:1, muted on bg ≈ 6:1 — all AA+.

Run a quick Lighthouse audit via Chrome DevTools on the deployed site. Fix any a11y flags (should be 0 by default here).

- [ ] **Step 3: Build + dev verify**

```bash
pnpm build && pnpm dev
```

Resize DevTools from 320px to 1440px — no horizontal scroll, nav collapses to hamburger below `md`.

- [ ] **Step 4: Commit + push**

```bash
git add -A
git commit -m "feat: mobile hamburger nav and a11y pass"
git push origin main
```

The Pages workflow redeploys automatically.

---

## Post-launch (not part of v1 plan, tracked for future)

- Dynamic project list pulled from `projects.vojtechsykora.com`'s public API via build-time fetch.
- Per-post OG images.
- RSS feed at `/writing/rss.xml`.
- Plausible analytics.
- Search.
- Czech language version.

---

## Appendix — Troubleshooting

**`pnpm install` fails on a specific transitive dep:** delete `pnpm-lock.yaml`, re-run. Commit the regenerated lockfile.

**`next build` fails with `Image Optimization using the default loader is not compatible with \`next export\``:** confirmed handled by `images.unoptimized = true` in `next.config.ts`.

**`next/font` complains about network access during GitHub Actions:** not typical — `next/font/google` downloads fonts at build time and caches them in the build output. If the runner is in a network-restricted region, pre-download the font via `@fontsource/dm-sans` as a fallback.

**`Trailing slash` redirects break custom domains:** `trailingSlash: true` produces `/about/index.html` which GitHub Pages serves correctly at both `/about` and `/about/`. Keep it.

**`react-markdown` renders raw `<pre>` blocks unstyled:** the `.prose-showcase` class in `globals.css` carries the styles; confirm the post page wraps content in `className="prose-showcase"`.
