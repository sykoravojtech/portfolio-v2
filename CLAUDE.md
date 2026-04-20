# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose
Personal portfolio site for Vojtěch Sýkora — deployed statically to `vojtechsykora.com` via GitHub Pages. Recruiter-facing primary, light blog secondary. Projects link out to the tools hub at `projects.vojtechsykora.com` (a separate repo — this site is read-only marketing/bio/writing).

## Architecture
Static export from Next.js 16 → GitHub Pages. No backend, no database, no auth. Structured content lives in TypeScript modules under `src/content/`; blog posts are `.mdx` files. The design system (Phthalo Cream hybrid) is **inherited from the sibling repo `../projects-web`** — the file at `apps/web/src/app/globals.css` in that repo is the source of truth for tokens.

**Key pattern:** code and content are colocated. Zero runtime data layer — everything is baked at build time into static HTML/CSS/JS.

## Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Next.js 16.2.2, React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline`), class-variance-authority, clsx, tailwind-merge |
| UI | radix-ui (scoped exports like `Slot.Root`), lucide-react icons, DM Sans via `next/font` |
| Content | TypeScript modules + MDX (`@next/mdx`, `remark-gfm`, `gray-matter`, `rehype-slug`, `rehype-autolink-headings`) |
| Testing | Vitest |
| Package manager | pnpm 9+ |
| Hosting | GitHub Pages + Cloudflare (domain via CNAME) |
| Design | Phthalo Cream hybrid dark/light ([`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)) — mirrored from `../projects-web` |

## Repository Structure
```
public/             — static assets (CNAME, CV PDF, images)
src/
  app/              — Next.js App Router routes (/, /about, /experience, /education, /projects, /writing, /writing/[slug])
  components/       — Nav, Footer, Hero, SectionHeader, ExperienceItem, etc.
  content/          — bio.ts, experiences.ts, education.ts, certifications.ts, testimonials.ts, projects.ts, writing/*.mdx
  lib/              — utils.ts (cn), dates.ts, mdx.ts, content.ts
tests/              — Vitest unit tests
docs/               — DESIGN_SYSTEM.md, content-source/, superpowers/ (specs + plans)
.github/workflows/  — deploy.yml (Pages deploy)
```

## Commands
```bash
pnpm install                # Install deps
pnpm dev                    # Dev server (port 3200) — projects-web uses 3100
pnpm build                  # Static export into ./out
pnpm lint                   # ESLint
pnpm test                   # Vitest (unit tests)
pnpm test:watch             # Watch mode

# Deploy: push to main → GitHub Actions builds and publishes to Pages
git push origin main
gh run watch                # Follow the deploy
```

## Important — Next.js 16 API drift

Next.js 16 introduces breaking changes versus Next 13/14 that may still dominate training data. **Before writing Next-specific code** (route handlers, `next.config.*`, `next/font`, metadata, async `params`, App Router client APIs), check `node_modules/next/dist/docs/` in this repo for the current API shape. Heed deprecation warnings — they surface real bugs.

(The sibling `../projects-web/apps/web/AGENTS.md` has the same warning and is a good cross-reference.)

## Design system

Phthalo Cream is a two-layer system: **dark chrome** (`--green`, `--green-dark`, `--bone`) for nav + hero + footer, **light content** (`--bg`, `--bg2`, `--text`) for the rest. Single accent is **bordeaux** (`#4A1A23`) for CTAs and active states; wintergreen (`--green-mid`) for links; cedar for dividers.

- **Source of truth:** `../projects-web/apps/web/src/app/globals.css` (CSS variables + Tailwind v4 `@theme inline` mappings).
- **Mirror in this repo:** [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — copied as a read-only reference. If tokens change in projects-web, copy the new file over.
- **shadcn primitives:** ported from `../projects-web/apps/web/src/components/ui/` (only what this site uses — currently Button).

## Key Docs
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — Phthalo Cream tokens, typography, components (mirror from projects-web)
- [`docs/superpowers/specs/2026-04-20-portfolio-redesign-design.md`](docs/superpowers/specs/2026-04-20-portfolio-redesign-design.md) — design spec for this build
- [`docs/superpowers/plans/2026-04-20-portfolio-redesign.md`](docs/superpowers/plans/2026-04-20-portfolio-redesign.md) — task-by-task implementation plan
- [`docs/content-source/linkedin-2026-04.md`](docs/content-source/linkedin-2026-04.md) — authoritative content source (bio, experiences, education, certifications, testimonial)
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — architectural decision log

## Related repos

- `../projects-web` — the projects hub at `projects.vojtechsykora.com`. Authoritative design system and shadcn primitives. Do not modify that repo from this one; copy files one way (projects-web → portfolio-v2).
- `../portfolio` — the legacy ReactJS + Firebase portfolio (sykoravojtech.github.io/portfolio). Source of logo assets (`src/images/experience/*`, `src/images/education/*`). Will be archived once v2 is live.

## Environment

- Node: 20+
- pnpm: 9+
- No runtime env vars needed — the site is fully static.
- Domain `vojtechsykora.com` is pointed at GitHub Pages; `public/CNAME` preserves it on each deploy.

## Infrastructure

- **Local dev:** `pnpm dev` on port 3200 (projects-web uses 3100 — keep them distinct so both can run concurrently)
- **Build output:** `./out/` (static HTML/CSS/JS)
- **Hosting:** GitHub Pages via `actions/deploy-pages`
- **Domain:** `vojtechsykora.com` (CNAME in `public/`)
- **CI:** `.github/workflows/deploy.yml` runs on every push to `main`

## Core Principles
- **Simplicity first** — this is a static marketing site. Don't add a backend, a CMS, or a data layer. If a feature needs any of those, flag it and defer.
- **No laziness** — find root causes, not temporary fixes. Senior developer standards.
- **Minimal impact** — changes should only touch what's necessary. Avoid introducing bugs.
- **Demand elegance (balanced)** — for non-trivial changes, pause and ask "is there a more elegant way?" Skip this for simple, obvious fixes — don't over-engineer.

## Workflow Orchestration

### Plan Before Building
- Use plan mode for any non-trivial task. A phase of the redesign plan counts as non-trivial.
- If something goes sideways, STOP and re-plan immediately — don't keep pushing.
- Write detailed specs upfront to reduce ambiguity.

### Subagent Strategy
- Use subagents to keep main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- One task per subagent for focused execution.

### Verification Before Done
- Never mark a task complete without proving it works.
- For this repo, "proving it works" means: `pnpm build` succeeds, `pnpm dev` shows the change in browser, tests pass (`pnpm test`).
- For a deployed change: open `https://vojtechsykora.com` in a browser after the Pages workflow completes.

## Working Rules
- Prefer editing existing files over creating new ones.
- Keep changes minimal and targeted; do not refactor unrelated areas.
- Preserve existing architecture and naming unless a task explicitly asks for redesign.
- If behavior changes, update affected docs in the same task.
- Keep `docs/DECISIONS.md` updated when making architectural choices.
- Content updates (new experience, new post, new project) are **content edits, not code changes** — touch only the relevant file under `src/content/`.
- After diagnostics or ad-hoc scripts, terminate hanging background processes.

## When Unsure
- Inspect current code paths before assuming behavior.
- Check `../projects-web/apps/web/` for patterns (design tokens, shadcn primitives, component shape).
- Check `node_modules/next/dist/docs/` for Next.js API shape — training data on Next can be stale.
- State assumptions explicitly in PR/summary notes.
- Prefer shipping a small verified fix over a broad speculative change.
- If blocked, re-plan rather than brute-force through.

## Self-Maintenance
- If information changes during work, **update this CLAUDE.md** to stay current.
- After any user correction, capture the lesson in a relevant doc so the mistake isn't repeated.
- Keep `docs/DECISIONS.md` aligned with actual decisions.
- If `../projects-web/apps/web/src/app/globals.css` changes its tokens, re-copy `docs/DESIGN_SYSTEM.md` and update `src/app/globals.css` to match.
