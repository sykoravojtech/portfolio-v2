# Portfolio Redesign — Design Spec

**Date:** 2026-04-20
**Repo:** `portfolio-v2` → deploys to `vojtechsykora.com` via GitHub Pages
**Status:** Approved design, ready for implementation plan

---

## 1. Goal

Replace the current `vojtechsykora.com` (a GitHub Pages shell with only `CNAME` + `index.html`) with a recruiter-facing personal portfolio that visually matches the Phthalo Cream hybrid design system used by `projects-web`, and carries a light writing/blog section. Projects are linked out to `projects.vojtechsykora.com` rather than duplicated.

**Primary audience:** recruiters, hiring managers, technical peers reviewing the site before a call.
**Secondary audience:** readers of occasional long-form writing.

**Success looks like:** a recruiter can land on the home page, understand who Vojtěch is and what he does in under 15 seconds, and click into deeper pages (Experience, About) or download the CV without friction.

---

## 2. Approach

**Next.js 15 static export → GitHub Pages.**

- `next.config.ts` sets `output: 'export'`, producing static HTML in `out/`.
- Deployed via GitHub Actions using `actions/deploy-pages`.
- `CNAME` file in the built output preserves `vojtechsykora.com`.
- Same tech as `projects-web` (Next.js + TypeScript + Tailwind + shadcn/ui) so components and design tokens transfer directly.

**Why not Hugo or Astro:** already answered in brainstorm — Next was chosen because (a) existing familiarity, (b) guaranteed visual parity with the projects hub, (c) MDX handles the 2-4 long-form posts per year without needing a blog-first tool.

---

## 3. Navigation & Page Structure

**Hybrid pattern.** Home is a curated teaser (elevator pitch + section previews). Each deep section is its own route.

```
/                    Home — hero + section teasers
/about               About — longer personal intro
/experience          Experience — full work timeline
/education           Education — MSc, BSc, minor, IB
/projects            Projects — teaser grid linking out to projects.vojtechsykora.com
/writing             Writing — blog post list
/writing/[slug]      Individual blog post
```

**Out of nav, but present:**
- **Contact:** footer only (email, GitHub, LinkedIn). No dedicated page, no form.
- **CV:** hero CTA + footer link → `/VojtechSykora_CV_2026.pdf` (static asset).

**No language switch.** Site is English-only. Spoken languages (Czech, English, German) are listed on the home page as a bio data point near the tech stack.

---

## 4. Visual Design — Phthalo Cream Hybrid

Inherit the design system from `projects-web` (`docs/DESIGN_SYSTEM.md`) verbatim. Two layers:

- **Dark chrome:** nav + hero on `--green: #123624` with `--bone: #D8D0C2` body text, `--green-mid: #5C8B73` accents, `--bordeaux: #4A1A23` CTA buttons.
- **Light content:** `--bg: #EDE8DF` page, `--bg2: #F2EDE4` cards, `--text: #123624` headings (phthalo doubles as heading color), `--text-muted: #5a5248` body.

**Typography:** DM Sans via `next/font` (weights 300/400/500/700/900). Display hero uses weight 900, `letter-spacing: -0.035em`. Italic + weight 300 for de-emphasized words in headlines (e.g., "I *build* things").

**Components reused from `projects-web`:**
- shadcn/ui primitives (Button, Input, Card) — copied with identical styling (bordeaux default, phthalo focus ring).
- `globals.css` copied wholesale (same tokens, same Tailwind `@theme inline` wiring).
- Status dots, tag pills, dividers.

**Portfolio-specific components:** `Hero`, `SectionHeader`, `ExperienceItem`, `EducationItem`, `ProjectCard`, `WritingRow`, `Footer`.

---

## 5. Page Specifications

### 5.1 Home — `/`

**Dark phthalo hero:**
- Kicker: `PRAGUE · AI ENGINEER & PRODUCT BUILDER`
- H1 (display 900): "I *build* tools I wish existed." (italic/weight-300 styling on "build")
- Tagline paragraph: 1-2 sentences — focus areas, current role, link to projects hub
- CTAs: `Get in touch` (bordeaux filled) + `Download CV ↓` (green-mid outlined)

**Light content sections (in order):**
1. **About · teaser** — 2-sentence intro, `Read more →` link to `/about`
2. **Experience · latest 3** — compact rows (years, role, company, short desc), `Full timeline →` link
3. **Education · latest 2** — MSc + BSc, `All education →` link to `/education`
4. **Featured projects** — 3 hardcoded cards with tag + title + desc + external link arrow, `All projects →` link to `/projects`
5. **Languages & tech stack** — small section: spoken languages (Czech, English, German) + primary tech (Python, TypeScript, React, PyTorch, FastAPI)
6. **Latest writing** — 2-3 post rows with date + title, `All posts →` link to `/writing`. If zero published posts exist, this section is hidden on home (not shown as "coming soon" — home should never look empty).

### 5.2 About — `/about`

Dedicated page. Longer bio, photo (optional, placeholder if not provided), values, current focus, what Vojtěch is open to. One or two sections max — keep it readable in 60 seconds.

### 5.3 Experience — `/experience`

Full timeline, newest first. Each item:
- Years (left column, ~80px)
- Role + company + location/modality (right column)
- Description paragraph (bullets from DATABASE.json)
- Skill tags (small bordeaux/10 pills)

Bottom: "What I'm looking for" section with contact CTA.

**Initial content** (ported from `/home/vojta/Documents/projects/portfolio/DATABASE.json`):
- 2025 – Present · FZI (Master Thesis — Computer Vision, Karlsruhe, remote)
- 2024 – Present · synthavo (CV Working Student, Stuttgart, hybrid)
- 2023 · CIIRC (ML Researcher, Prague)
- 2020 – 2022 · Charles University (Data Scientist, Prague)
- 2021 – 2022 · US AFRL + CTU FEE AI Center (AI Researcher)
- 2021 · SCILIF / SUNFIBRE (Android Dev)
- 2016 – 2020 · Czech Basketball Federation (Referee)

### 5.4 Education — `/education`

Dedicated page. Each entry:
- School logo (from `public/images/education/*`)
- Degree + school + location
- Dates
- Description bullets
- Grade (if applicable)
- Skills (small pills)
- Optional "Thesis" or "Certificate" link

**Entries (4):**
1. **University of Tübingen** (Sep 2023 – Sep 2025) — MSc Machine Learning. DAAD full scholarship. Deep Learning, Computer Vision. Thesis: Multi-modal Deep Learning for Automated Schematic Analysis.
2. **Czech Technical University in Prague** (Sep 2020 – Jun 2023) — BSc Open Informatics (AI specialization). Thesis: Proximal Policy Optimization for Car Racing with unpredictable Wind.
3. **prg.ai Minor** (2021 – 2023) — Interdisciplinary AI curriculum across Prague universities. Certificate.
4. **PORG** (2018 – 2020) — IB Diploma. Grade 39/45. HL Math/Physics/Econ, SL English/Czech/German. EE: Mathematics (Quaternions).

### 5.5 Projects — `/projects`

Grid of project cards (3 columns desktop, 1 mobile). Each card:
- Category tag (bordeaux/10 pill)
- Title
- Short description
- Tech tags
- Primary link (Live / GitHub / Paper) — opens external URL

Content initially hardcoded in `src/content/projects.ts` (~6–10 entries curated from the old portfolio). Featured flag (`featured: true`) controls which 3 appear on home.

### 5.6 Writing — `/writing` + `/writing/[slug]`

**List page:** reverse-chronological rows: date (mmm yyyy), title, 1-sentence excerpt, reading time.

**Post page:**
- Dark phthalo mini-hero with kicker (`WRITING`), title, date, reading time
- Light content: MDX-rendered body, max-width ~680px, 16px base body size, line-height 1.7
- Footer: back to `/writing`, social share links (X, LinkedIn)

**MDX setup:** `@next/mdx` with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`. Custom components for `h2`, `h3`, `pre`, `code`, `blockquote` styled to Phthalo tokens. Syntax highlighting via `rehype-pretty-code` using a phthalo-tinted theme.

**Empty state:** if there are zero posts, render the list page with "First post coming soon." in muted text. Ship v1 with 0–1 seed posts; don't block launch on writing.

---

## 6. Content Model

**TypeScript modules** for structured data (type-safe, refactorable, colocated):

```
src/content/
  bio.ts              — name, role, email, socials, spoken languages, tech stack
  experiences.ts      — Experience[]
  education.ts        — Education[]
  projects.ts         — Project[] with featured flag
  writing/
    *.mdx             — blog posts with frontmatter
```

**Types defined in** `src/content/types.ts`:

```ts
type Experience = {
  company: string;
  role: string;
  date: string;      // "Mar 2025 – Present"
  location: string;
  modality?: "Remote" | "Hybrid" | "On-site" | "Part-time" | "Contract";
  logo?: string;     // /images/experience/*
  link?: string;
  description: string[];  // bullet lines
  skills: string[];
}

type Education = {
  school: string;
  degree: string;
  date: string;
  location: string;
  logo: string;
  link?: string;
  description: string[];
  skills: string[];
  grade?: string;
  thesis?: string;
  certificateLink?: string;
}

type Project = {
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
  featured: boolean;  // → home page
}

type Bio = {
  name: string;              // "Vojtěch Sýkora"
  role: string;              // "AI Engineer & Product Builder"
  location: string;          // "Prague"
  tagline: string;
  description: string;
  email: string;             // sykoravojtech01@gmail.com
  github: string;            // https://github.com/sykoravojtech
  linkedin: string;          // https://www.linkedin.com/in/sykoravojtech/
  spokenLanguages: string[]; // ["Czech", "English", "German"]
  techStack: string[];
}
```

**Blog post frontmatter:**

```yaml
---
title: "..."
date: "2026-04-15"
excerpt: "..."
tags: ["..."]
published: true
---
```

**Migration from old portfolio:** a one-off migration step (manual or scripted) copies text from `/home/vojta/Documents/projects/portfolio/DATABASE.json` into the new TS modules, plus logos from `src/images/` into `public/images/`. User will edit text afterwards — the migration carries outdated content on purpose (per user instruction: "those info are a little older but add them for now").

---

## 7. Repo / File Structure

```
portfolio-v2/
  .github/workflows/
    deploy.yml              — build + deploy to GitHub Pages
  public/
    CNAME                   — vojtechsykora.com (moved from repo root into public/ so it ships in the static export)
    VojtechSykora_CV_2026.pdf
    images/
      experience/*
      education/*
      projects/*
      avatar.jpg            — optional
  src/
    app/
      layout.tsx            — root layout, DM Sans, nav, footer
      page.tsx              — home
      about/page.tsx
      experience/page.tsx
      education/page.tsx
      projects/page.tsx
      writing/
        page.tsx            — list
        [slug]/page.tsx     — MDX post
      globals.css           — Phthalo Cream tokens (copied from projects-web)
    components/
      nav.tsx
      footer.tsx
      hero.tsx
      section-header.tsx
      experience-item.tsx
      education-item.tsx
      project-card.tsx
      writing-row.tsx
      ui/                   — shadcn button, card, etc. (copied from projects-web)
    content/
      types.ts
      bio.ts
      experiences.ts
      education.ts
      projects.ts
      writing/
        *.mdx
    lib/
      mdx.ts                — MDX loading + frontmatter parsing
      utils.ts              — cn() helper (from shadcn)
  docs/
    superpowers/specs/      — this spec lives here
  next.config.ts            — output: 'export', MDX config
  tailwind.config.ts        — inherits token mapping from projects-web
  tsconfig.json
  package.json
  pnpm-lock.yaml
  README.md
```

**Existing files at portfolio-v2 root:** `CNAME`, `index.html`, `VojtechSykora_CV_2026.pdf`. The scaffolded Next project replaces `index.html`; `CNAME` moves to `public/` (so it lands in the static export); the CV moves to `public/`.

---

## 8. Build & Deploy

**Build:**
```bash
pnpm install
pnpm dev        # local dev on port 3200 (projects-web already uses 3100)
pnpm build      # next build → static export in out/
```

**GitHub Actions workflow (`.github/workflows/deploy.yml`):**
1. Trigger on push to `main`.
2. Setup Node 20, pnpm.
3. `pnpm install --frozen-lockfile`.
4. `pnpm build`.
5. Upload `out/` as artifact.
6. Deploy via `actions/deploy-pages@v4` to the Pages environment.

**Pages settings (manual, one-time):** repo Settings → Pages → Source: "GitHub Actions". Custom domain: `vojtechsykora.com`. Enforce HTTPS: on.

**DNS:** already configured (user has the site live on GH Pages at this domain). No DNS changes needed.

---

## 9. Out of Scope (v1)

- i18n (no Czech or German versions)
- CMS (content is code)
- Dynamic fetch from `projects.vojtechsykora.com` (hardcoded `featured` flag for now)
- Analytics (add later if desired — Plausible or similar)
- Contact form (mailto link only)
- Search (blog is small enough)
- Dark-mode toggle (site already has a dark layer by design)
- Comments on blog posts
- RSS feed (add later if writing cadence picks up)

---

## 10. Open Questions / Assumptions

- **Avatar photo:** not provided yet. Pages that could use one (About hero) render a phthalo/bordeaux initial block fallback until a `public/images/avatar.jpg` is added.
- **First blog post:** launch can ship with 0 posts; `/writing` shows "First post coming soon." Adding posts is a content edit, not a code change.
- **Open Graph images:** v1 ships with a single default OG image (simple phthalo background with name + role). Per-post OG images can be added later.
- **Favicon:** generate from VS monogram on phthalo background. Include in `app/icon.png` + `apple-icon.png`.

---

## 11. Implementation Sequence (high level)

The detailed plan will live in a separate implementation plan doc. Rough phasing:

1. **Scaffold** Next.js 15 + TS + Tailwind + shadcn in `portfolio-v2`. Port `globals.css` and base UI primitives from `projects-web`. Remove the old `index.html`.
2. **Chrome** — `Nav` + `Footer` + root layout with DM Sans. Dark phthalo nav, bone footer.
3. **Home** — Hero + static teaser sections wired to TS content modules.
4. **Deep pages** — `/about`, `/experience`, `/education`, `/projects` with content ported from DATABASE.json.
5. **Writing** — MDX pipeline, list page, post template. Ship with 0–1 seed posts.
6. **Content migration script** (or manual) to move logos from old portfolio into `public/images/`.
7. **Deploy workflow** + first production deploy. Verify `vojtechsykora.com` serves the new site. Verify CV link works.
8. **Polish** — OG image, favicon, transitions, mobile pass.
