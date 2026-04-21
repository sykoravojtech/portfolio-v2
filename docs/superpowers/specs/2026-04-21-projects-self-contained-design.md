# Projects — Self-Contained Showcase (Design Spec)

**Date:** 2026-04-21
**Status:** Approved, ready for implementation planning
**Scope:** Make the `/projects` showcase on this portfolio fully self-contained so
it does not depend on `projects.vojtechsykora.com` (projects-web) being online.
Add on-site detail pages with rich content, reorder the featured set, and
introduce the master's thesis project.

## Goals

1. The `/projects` section renders correctly when projects-web is offline.
2. Every featured project has an on-site detail page (`/projects/[slug]`) with
   markdown long-form content and a hero image.
3. Top-of-mind work is surfaced first: **Video Transformers**, **Multimodal
   Schematic Analysis** (master's thesis), **Urban Traffic Control** are the
   three home-page featured cards.
4. Legacy `sykoravojtech/portfolio` repo is not referenced anywhere (that repo
   is being archived).

## Non-goals

- Dynamic CMS, runtime API, or database. Content stays baked into the static
  export.
- Image optimization via `next/image` (we're a static export — plain `<img>`
  is fine and simpler for external raw.githubusercontent references).
- Porting every project from projects-web. Three projects are intentionally
  excluded (Projects Hub, BioVis Food, legacy Portfolio Website).

## Final project set

| # | Slug | Title | Detail page? | Featured (home)? |
|---|------|-------|--------------|------------------|
| 1 | `video-transformers` | Video Transformers for Classification & Captioning | yes | yes |
| 2 | `multimodal-schematic-analysis` | Multimodal Deep Learning for Automated Schematic Analysis | yes | yes |
| 3 | `urban-traffic-control` | Urban Traffic Control Framework | yes | yes |
| 4 | `ppo-car-racing` | Proximal Policy Optimization for Car Racing | yes | no |
| 5 | `instance-segmentation` | Instance Segmentation Challenge | yes | no |
| 6 | `ihd-germany` | Ischemic Heart Disease Analysis in Germany | yes | no |
| 7 | `black-forest-hackathon` | Black Forest Hackathon — Data Decoded | no (list-only) | no |
| 8 | `geojson-map-animation` | GeoJSON Map Animation | yes | no |

**Removed from current `src/content/projects.ts`:**
- `projects-hub` — was a link to projects-web (offline most of the time).
- (No current entry for Portfolio Website or BioVis Food — both explicitly
  excluded from the port.)

## Content model

Extend the `Project` type in `src/content/types.ts`:

```ts
export type Project = {
  id: string;               // stable internal key (== slug)
  slug: string;             // NEW — URL segment & MDX filename base
  title: string;
  category: string;
  date?: string;            // "Jul 2025", "2025", etc.
  description: string;      // short — shown on card
  tags: string[];           // short set (3–4) shown on card
  techStack: string[];      // NEW — longer keyword list shown on detail page
  github?: string;
  webapp?: string;          // live site (rare for showcase projects)
  paper?: string;           // PDF URL
  heroImage?: string;       // local path ("/images/projects/x.png") or external URL
  hasDetail: boolean;       // NEW — true ⇒ card links to /projects/[slug]
  featured: boolean;
};
```

Rules:
- `id === slug` for consistency. `slug` is the authoritative URL segment.
- `hasDetail: false` ⇒ no MDX file required; card links to the primary
  external URL as before. Used for Black Forest Hackathon.
- `techStack` and `tags` serve different purposes: `tags` is the card's
  short pill row; `techStack` is the long keyword list on the detail page
  (mirrors projects-web's `keywords` field).
- `heroImage` accepts local (`/images/projects/...`) or external URLs. Missing
  ⇒ card shows a muted-gradient placeholder built from existing Phthalo Cream
  tokens.

## File layout

```
src/content/
  projects.ts                           # metadata index (array of Project)
  projects/
    video-transformers.mdx
    multimodal-schematic-analysis.mdx   # NEW — master's thesis (drafted below)
    urban-traffic-control.mdx
    ppo-car-racing.mdx
    instance-segmentation.mdx
    ihd-germany.mdx
    geojson-map-animation.mdx

src/app/projects/[slug]/page.tsx        # NEW — detail page route

src/lib/projects-mdx.ts                 # NEW — slug → {meta, content} loader

public/images/projects/                 # NEW directory
  video-transformers.jpeg               # copied from ../portfolio
  utc-framework.png                     # copied from ../portfolio
  ihd-germany.png                       # copied from ../portfolio
```

## Rendering pipeline (aligned with existing writing/)

Use the existing stack — **no new dependencies**:

- `gray-matter` to split frontmatter from body.
- `react-markdown` + `remark-gfm` to render markdown.
- `.prose-showcase` CSS class (already defined in `src/app/globals.css`,
  lines 86–174) for typography. Images in markdown (`![](...)`) render via
  plain `<img>` tags styled by `.prose-showcase img`.

New `src/lib/projects-mdx.ts` mirrors `src/lib/mdx.ts`:

```ts
export type LoadedProject = { frontmatter: Record<string, unknown>; content: string };

export function getProjectContent(slug: string): LoadedProject | null;
export function listProjectSlugs(): string[]; // for generateStaticParams
```

MDX frontmatter is optional — the card metadata comes from `projects.ts`, not
the MDX file. Frontmatter may carry overrides (e.g., a detail-page–only
subtitle), but Phase 1 keeps MDX files body-only.

## Detail page layout — `/projects/[slug]/page.tsx`

```
[Nav]

<article class="mx-auto max-w-[860px] px-6 py-12">
  <div class="mb-8">
    {category}                           <!-- kicker, 10px uppercase -->
    <h1>{title}</h1>
    <p class="text-muted">{description}</p>

    <div class="flex gap-1.5 flex-wrap mt-4">
      {tags.map(...)}                    <!-- bordeaux-outlined pills -->
    </div>
    <div class="flex gap-1.5 flex-wrap mt-3">
      {techStack.map(...)}               <!-- muted, smaller -->
    </div>

    <div class="flex gap-2 mt-5">
      {github && <LinkButton href={github} icon={<FileCode2 />}>GitHub</LinkButton>}
      {paper  && <LinkButton href={paper}  icon={<FileText />}>Paper</LinkButton>}
      {webapp && <LinkButton href={webapp} icon={<Globe />}>Live site</LinkButton>}
    </div>
  </div>

  {heroImage && <img src={heroImage} alt={title} class="rounded-xl mb-8" />}

  <div class="prose-showcase">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </div>
</article>

[Footer]
```

Notes:
- Layout styling mirrors projects-web's `ShowcaseView`, adapted to this repo's
  idioms.
- `LinkButton` is a local helper in the page file; bordeaux background, bone
  text, matches the existing CTA treatment.
- `generateStaticParams()` returns slugs where `hasDetail === true`, so no
  page is generated for `black-forest-hackathon`.
- Unknown slugs → `notFound()`.

## ProjectCard redesign — `src/components/project-card.tsx`

Add a hero thumbnail and internal routing:

```
┌─────────────────────────────┐
│   [Hero image thumb]        │   aspect-[16/9], object-cover, overflow-hidden
├─────────────────────────────┤
│  CATEGORY     (kicker)      │
│  Title                      │
│  Short description          │
│  [tag] [tag] [tag]          │
│  View project →   ← or ext  │
└─────────────────────────────┘
```

Behavior:
- Entire card wrapped in `<Link>`.
- `hasDetail: true`:
  - `href = /projects/${slug}`
  - CTA label: **"View project →"**
- `hasDetail: false`:
  - `href =` current priority (`webapp ?? github ?? paper`)
  - CTA label: current logic (`"Live →" | "GitHub →" | "Paper →"`)
  - `target="_blank" rel="noreferrer"` for external
- If `heroImage` missing ⇒ render a 16:9 gradient placeholder using
  `bg-gradient-to-br from-bg3 to-bg2 border-b border-border`.
- Hover: existing `-translate-y-1` and shadow lift preserved. Image gets
  `scale-105` on `group-hover`. Transition duration unchanged (400ms).

## Image asset plan

**Copy these three** from `../portfolio/src/images/projects/` into
`public/images/projects/` (rename as noted):

| Source (../portfolio) | Destination (this repo) |
|----|----|
| `self-supervised-video-transformer.jpeg` | `public/images/projects/video-transformers.jpeg` |
| `utc-framework.png` | `public/images/projects/utc-framework.png` |
| `ihd-germany.png` | `public/images/projects/ihd-germany.png` |

**Reference each project's own repo** (raw.githubusercontent URLs are allowed
because the project's repo is the canonical home for that asset):

| Slug | Hero image URL |
|----|----|
| `instance-segmentation` | `https://raw.githubusercontent.com/sykoravojtech/instance-segmentation-challenge/main/assets/rcnn.png` |
| `ppo-car-racing` | `https://raw.githubusercontent.com/sykoravojtech/PPOCarRacing/main/car-driving.gif` |
| `geojson-map-animation` | `https://raw.githubusercontent.com/sykoravojtech/geojson-map-animation/main/orp.gif` |
| `multimodal-schematic-analysis` | **TBR during implementation** — fetch `od-symbol` repo README, pick a suitable figure (prediction or dataset sample). If nothing obvious is available, pause and ask before falling back to the placeholder. |

**No hero image:**
- `black-forest-hackathon` (placeholder gradient). No `hasDetail`, so this
  doesn't matter for detail-page rendering — card only.

**Hard rule:** no URL in the codebase may point at
`raw.githubusercontent.com/sykoravojtech/portfolio/...`. If a migrated
long-description contains such a URL, either (a) copy the asset into
`public/images/projects/` and rewrite the URL, or (b) drop the image from the
long-description.

## Long-form content plan (MDX files)

Each of the seven detail-page slugs needs a markdown file. For the six ported
from projects-web, content comes from the `projects` table's `long_description`
column in the local `projects_web` Postgres DB. The implementation step queries:

```sql
SELECT slug, long_description FROM projects WHERE is_public = true;
```

and writes each `long_description` to `src/content/projects/[slug].mdx` with
these transformations applied:

1. **Sanitize URLs:** any `raw.githubusercontent.com/sykoravojtech/portfolio/...`
   URL either points at a locally-copied image (rewrite to `/images/projects/...`)
   or gets removed if the image isn't being copied.
2. **Slug remap:** the projects-web slugs are verbose. Map them to the short
   slugs used in this repo:

   | projects-web slug | this repo slug |
   |----|----|
   | `video-transformers-for-classification-and-captioning` | `video-transformers` |
   | `instance-segmentation-challenge` | `instance-segmentation` |
   | `proximal-policy-optimization-for-car-racing` | `ppo-car-racing` |
   | `ischemic-heart-disease-analysis-in-germany` | `ihd-germany` |
   | `geojson-map-animation` | `geojson-map-animation` |
   | `urban-traffic-control-framework` | `urban-traffic-control` |

### Multimodal Schematic Analysis — draft

Since this project is not in projects-web, draft the MDX inline. Initial body
(editable during implementation):

```markdown
## What it does

Object detection for electrical schematics — given an image of a circuit
diagram, find every symbol and box it. The research question: can a carefully
modified specialist detector beat a pretrained vision-language model at this
task?

## The problem

Two issues dominate automated schematic analysis. **Severe class imbalance**
(some symbols appear thousands of times more often than others) and a
**scarcity of good training data**, which forces a large domain shift between
messy handwritten schematics and clean computer-generated ones.

## Contributions

- **A new dataset.** The **Raspberry Pi (RPi) dataset**: 22 high-resolution
  CAD schematics, 1,675 annotated symbols. Designed to test cross-domain
  adaptation from the hand-drawn CGHD dataset (3,137 images, ~246k
  annotations).
- **A tuned Faster R-CNN.** Enhanced the detector from the Modular Graph
  Extraction pipeline with Focal + GIoU losses, architectural changes,
  hyperparameter tuning, and targeted image transformations. Lift over a
  strong baseline: **+7.3% mAP on CGHD**, **+3.7% on the RPi dataset**.
- **A VLM comparison.** Benchmarked Molmo-7B-D, a pretrained VLM, on the same
  object detection task. Result: **17.5% accuracy vs. Faster R-CNN's 32.0%** —
  a carefully modified specialist still beats a general-purpose VLM for
  symbol detection. The VLM shows basic task understanding but isn't close.

## Why it matters

Releasing the RPi dataset gives the community a clean-schematic benchmark for
cross-domain work, and the Focal + GIoU + tuning recipe is a drop-in lift for
anyone using the MGE pipeline on similar data.

---

*Master's thesis, University of Tübingen, submitted July 2025.
Supervisors: Prof. Dr. Oliver Bringmann (Tübingen), Prof. Dr.-Ing. Cristóbal
Curio (Reutlingen). Graduate Advisor: M.Sc. Tobias Hald (FZI
Forschungszentrum Informatik).*
```

Card metadata:

```ts
{
  id: "multimodal-schematic-analysis",
  slug: "multimodal-schematic-analysis",
  title: "Multimodal Deep Learning for Automated Schematic Analysis",
  category: "Deep Learning",
  date: "Jul 2025",
  description:
    "Master's thesis. Beating a pretrained VLM at electrical-schematic symbol detection with a tuned Faster R-CNN. Introduces a new high-resolution CAD dataset and a +7.3% mAP lift over a strong baseline.",
  tags: ["Object Detection", "Thesis", "VLM"],
  techStack: [
    "Faster R-CNN", "Focal Loss", "GIoU Loss", "Molmo-7B-D",
    "PyTorch", "Domain Adaptation", "Object Detection"
  ],
  github: "https://github.com/sykoravojtech/od-symbol",
  paper:
    "https://github.com/sykoravojtech/od-symbol/blob/main/assets/VojtechSykora_MasterThesis.pdf",
  heroImage: undefined, // to be set during implementation
  hasDetail: true,
  featured: true,
}
```

## Ordering

**Home `/` featured (first 3 of `getFeaturedProjects()`):**
1. Video Transformers
2. Multimodal Schematic Analysis
3. Urban Traffic Control Framework

**Full `/projects` listing (array order in `projects.ts`):**
1. Video Transformers *(featured)*
2. Multimodal Schematic Analysis *(featured)*
3. Urban Traffic Control Framework *(featured)*
4. PPO for Car Racing
5. Instance Segmentation Challenge
6. Ischemic Heart Disease Analysis in Germany
7. Black Forest Hackathon — Data Decoded *(no detail page; card-only)*
8. GeoJSON Map Animation

## Page copy updates

`src/app/projects/page.tsx` currently says:

> "Selected personal and research projects. Live tools at
> projects.vojtechsykora.com."

Drop the second sentence (projects-web will be down most of the time, and this
page is no longer a gateway to it):

> "Selected personal and research projects."

## Testing checklist

Implementation is not done until all of the following pass:

- `pnpm lint` — clean.
- `pnpm build` — static export succeeds; `/out/projects/[slug]/index.html`
  exists for each of the seven `hasDetail: true` slugs.
- `pnpm test` — all existing tests still pass. Add at minimum:
  - A test that every entry in `projects.ts` with `hasDetail: true` has a
    corresponding `src/content/projects/[slug].mdx` file.
  - A test that no MDX file under `src/content/projects/` and no `heroImage`
    field in `projects.ts` references the string
    `raw.githubusercontent.com/sykoravojtech/portfolio`.
- `pnpm dev` smoke test (human): open `/`, confirm three hero-image cards in
  order; click each → lands on the right detail page; the hero image
  displays; the markdown body renders with correct typography; GitHub/Paper
  buttons work; Black Forest Hackathon card on `/projects` has no broken
  thumb and still exists as a card.
- `pnpm build` and serve `/out` to confirm detail pages work in static export
  mode (not just dev).

## Out of scope / explicitly deferred

- Porting BioVis Food, legacy Portfolio Website, or Projects Hub back in.
- Filtering, search, or category chips on `/projects`.
- Comments or analytics on detail pages.
- `next/image` optimization.
- Rewriting `docs/DESIGN_SYSTEM.md`; the card design changes are small enough
  to live in the spec alone until confirmed in the browser.

## Risks & open items

- **od-symbol hero image.** The repo may not contain a figure ready for use
  as a card thumbnail. If nothing obvious exists after fetching the README,
  pause for user input rather than shipping the placeholder silently on a
  featured card.
- **Markdown hygiene from projects-web.** `long_description` fields may
  contain raw relative links, emoji, or HTML that renders awkwardly in
  `.prose-showcase`. Proofread each during migration; tweak in place rather
  than globally.
- **Black Forest Hackathon card-only layout.** Without a hero image or a
  primary link, the CTA slot collapses. Solution: display a muted
  "48-hour team sprint, May 2025" date line in place of the CTA, so the
  card still has a bottom row.
