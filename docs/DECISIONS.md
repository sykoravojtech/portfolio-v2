# Architectural Decisions

Append new decisions here — newest at top. Include date, decision, alternatives considered, and why.

---

## 2026-04-20 — Inherit Phthalo Cream design system from `../projects-web`

**Decision:** Reuse the exact same design tokens, typography, and shadcn primitives as `projects-web` instead of creating a separate portfolio identity.

**Alternatives considered:**
- Custom portfolio palette (dark SaaS, minimalist monochrome, distinct brand).
- Hugo theme with custom styling.

**Why:** (1) The tools hub at `projects.vojtechsykora.com` and the portfolio are two faces of the same personal brand — visual continuity makes both stronger. (2) Zero design work needed; tokens + Button primitive copy straight over. (3) One mental model for future tweaks.

**Cost:** The portfolio is now coupled to `projects-web`'s design evolution. Mitigation: treat `projects-web` as the source of truth; copy files one-way (projects-web → portfolio-v2) when tokens change.

---

## 2026-04-20 — Next.js static export + GitHub Pages (not Hugo, not Astro)

**Decision:** Build the portfolio as a Next.js 16 app with `output: 'export'` and deploy the static output to GitHub Pages.

**Alternatives considered:**
- Hugo + a theme (hugo-profile, hugo-coder).
- Astro with markdown content.

**Why:** (1) Next.js matches the tech stack of `projects-web`, so components and patterns transfer directly. (2) Blog is light (2–4 posts/year per the spec), so Hugo's blog-first ergonomics aren't worth the new-toolchain tax. (3) Hugo's theme customization would mean fighting the theme to match Phthalo Cream — more work than starting from Next.

**Cost:** Next is heavier tooling than needed for a portfolio; build times are seconds not milliseconds. Acceptable.

---

## 2026-04-20 — TypeScript modules for structured content, MDX for blog posts

**Decision:** Bio, experiences, education, certifications, testimonials, projects live in `src/content/*.ts` as typed modules. Blog posts live in `src/content/writing/*.mdx` with frontmatter.

**Alternatives considered:**
- JSON files (as in the legacy `../portfolio` repo's `DATABASE.json`).
- A headless CMS (Sanity, Contentful).

**Why:** (1) TypeScript gives autocomplete and refactor safety; content shape is validated at compile time. (2) No runtime data fetching = simpler static output. (3) MDX for posts preserves the option to embed React components in long-form writing if the cadence ever picks up. (4) Adding a CMS for a site with ~4 posts/year is overkill.
