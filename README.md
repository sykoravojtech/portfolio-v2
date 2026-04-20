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
