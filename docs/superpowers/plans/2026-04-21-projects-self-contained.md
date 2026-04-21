# Projects Self-Contained Showcase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `/projects` section on the portfolio site fully self-contained (renders with projects-web offline), add on-site detail pages at `/projects/[slug]`, reorder featured projects to (Video Transformers → Multimodal Schematic Analysis → Urban Traffic Control), and add the master's thesis project.

**Architecture:** Static Next.js 16 export. Project metadata in `src/content/projects.ts`; long-form content in `src/content/projects/[slug].mdx` files rendered via `gray-matter` + `react-markdown` + `remark-gfm` (same pipeline as `writing/`). Detail route `src/app/projects/[slug]/page.tsx` generates one static page per slug where `hasDetail === true`. Hero images copied locally where the legacy `sykoravojtech/portfolio` repo was the source; elsewhere we reference each project's own repo via `raw.githubusercontent.com`.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind v4, `gray-matter`, `react-markdown`, `remark-gfm`, `lucide-react`, Vitest. All deps already in `package.json`.

**Spec:** `docs/superpowers/specs/2026-04-21-projects-self-contained-design.md`

---

## Task 1: Extend the `Project` type

**Files:**
- Modify: `src/content/types.ts` (the `Project` block around lines 71–83)

- [ ] **Step 1: Read the current type**

Open `src/content/types.ts` — the `Project` block to be edited is:

```ts
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
```

- [ ] **Step 2: Replace with the extended type**

Replace the block above with:

```ts
export type Project = {
  id: string;               // stable internal key; equals slug
  slug: string;             // URL segment & MDX filename base
  title: string;
  category: string;
  date?: string;
  description: string;      // short — shown on card
  tags: string[];           // short set (3–4) shown on card
  techStack?: string[];     // longer keyword list shown on detail page
  github?: string;
  webapp?: string;
  paper?: string;
  heroImage?: string;       // local path ("/images/projects/x.png") or external URL
  hasDetail: boolean;       // true ⇒ card links to /projects/[slug]
  featured: boolean;
};
```

Notes:
- `image` removed (not used anywhere — confirmed by `rg "\.image" src/` later).
- `techStack` is optional to avoid breaking test fixtures; a sensible empty default (`[]`) is used at the use site.

- [ ] **Step 3: Verify no other code references `Project.image`**

Run: `rg "\.image" src/`
Expected: no match inside `src/components/` or `src/app/` (only matches should be in `Experience`/`Education`/`bio.avatar`, which are different shapes). If there is a match against `Project`, update it to `heroImage` and re-run.

- [ ] **Step 4: Typecheck**

Run: `pnpm lint`
Expected: passes with no new TypeScript errors. (Existing tests/pages don't use the new fields yet — they'll be wired up in Task 6+.)

- [ ] **Step 5: Commit**

```bash
git add src/content/types.ts
git commit -m "types: extend Project with slug, techStack, heroImage, hasDetail"
```

---

## Task 2: Write the projects MDX loader (with failing test first)

**Files:**
- Create: `src/lib/projects-mdx.ts`
- Create: `tests/projects-mdx.test.ts`
- Test fixture: the test reads real MDX files created in later tasks, so we use a minimal inline fixture by creating `src/content/projects/_fixture.mdx` temporarily.

- [ ] **Step 1: Create the test fixture**

Create `src/content/projects/_fixture.mdx` with:

```markdown
---
title: Fixture project
---

# Fixture body

Hello world.
```

- [ ] **Step 2: Write the failing tests**

Create `tests/projects-mdx.test.ts` with:

```ts
import { describe, it, expect } from "vitest";
import {
  getProjectContent,
  listProjectSlugs,
} from "@/lib/projects-mdx";

describe("projects MDX loader", () => {
  it("lists all MDX slugs in src/content/projects/", () => {
    const slugs = listProjectSlugs();
    expect(slugs).toContain("_fixture");
  });

  it("reads an MDX file by slug and returns body + frontmatter", () => {
    const loaded = getProjectContent("_fixture");
    expect(loaded).not.toBeNull();
    expect(loaded!.frontmatter.title).toBe("Fixture project");
    expect(loaded!.content).toContain("Hello world");
  });

  it("returns null for a missing slug", () => {
    expect(getProjectContent("does-not-exist")).toBeNull();
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `pnpm test tests/projects-mdx.test.ts`
Expected: FAIL — module `@/lib/projects-mdx` does not exist.

- [ ] **Step 4: Implement the loader**

Create `src/lib/projects-mdx.ts` with:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");

export type LoadedProject = {
  frontmatter: Record<string, unknown>;
  content: string;
};

export function listProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getProjectContent(slug: string): LoadedProject | null {
  const file = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data ?? {}, content };
}
```

- [ ] **Step 5: Run tests — pass**

Run: `pnpm test tests/projects-mdx.test.ts`
Expected: PASS (all 3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/projects-mdx.ts tests/projects-mdx.test.ts src/content/projects/_fixture.mdx
git commit -m "feat(projects): gray-matter + fs loader for project MDX content"
```

---

## Task 3: Copy the three legacy hero images into `/public/images/projects/`

**Files:**
- Create: `public/images/projects/video-transformers.jpeg`
- Create: `public/images/projects/utc-framework.png`
- Create: `public/images/projects/ihd-germany.png`

- [ ] **Step 1: Create destination directory**

Run: `mkdir -p public/images/projects`

- [ ] **Step 2: Copy the three images from the legacy portfolio repo**

Run:

```bash
cp ../portfolio/src/images/projects/self-supervised-video-transformer.jpeg public/images/projects/video-transformers.jpeg
cp ../portfolio/src/images/projects/utc-framework.png                        public/images/projects/utc-framework.png
cp ../portfolio/src/images/projects/ihd-germany.png                          public/images/projects/ihd-germany.png
```

- [ ] **Step 3: Verify**

Run: `ls -lh public/images/projects/`
Expected output contains the three files with non-zero sizes.

- [ ] **Step 4: Commit**

```bash
git add public/images/projects/
git commit -m "assets: copy project hero images from legacy portfolio repo"
```

---

## Task 4: Write six migrated project MDX files

These bodies were originally authored for `projects-web`; they are reproduced inline below and must be copied **verbatim** into MDX files on disk. **Implementation does not read from, connect to, or depend on any database.** The built site is fully static — GitHub Pages only serves the files produced by `pnpm build`, which reads local `.mdx` via `fs.readFileSync` (same as the existing `writing/` pipeline). No `pg`, no API, no network at build time or runtime.

**Files:**
- Create: `src/content/projects/video-transformers.mdx`
- Create: `src/content/projects/urban-traffic-control.mdx`
- Create: `src/content/projects/ppo-car-racing.mdx`
- Create: `src/content/projects/instance-segmentation.mdx`
- Create: `src/content/projects/ihd-germany.mdx`
- Create: `src/content/projects/geojson-map-animation.mdx`

Each file has no frontmatter (card metadata lives in `projects.ts`). Use the literal markdown below.

- [ ] **Step 1: Create `video-transformers.mdx`**

```markdown
## What it does

Given a video clip, the system tags what's happening (action classification) and writes a short caption describing the scene. Trained on **Charades**, a dataset of everyday household activities filmed from multiple angles.

## The experiment

Two very different video backbones are compared under identical training conditions:

- **SVT**: Self-supervised Video Transformer, a standard attention-based architecture.
- **Video Mamba**: a newer state-space model that scales linearly with video length.

Both encoders are frozen. Only a lightweight task head is trained on top, which makes the comparison cheap and keeps the study focused on how much useful signal lives in each pretrained representation.

![architecture](https://raw.githubusercontent.com/sykoravojtech/VideoMamba_SVT_VideoUnderstanding/main/assets/class_diagram.jpg)

## Result

Video Mamba wins, reaching **22.7% mAP** on Charades classification versus **16.5% mAP** for SVT under the same head-only protocol. Both backbones are then extended to a GPT-2 captioning head for natural-language video descriptions.

![sample clip](https://raw.githubusercontent.com/sykoravojtech/VideoMamba_SVT_VideoUnderstanding/main/assets/sample_ufc101.gif)

Master's group project at the University of Tübingen. Code, checkpoints and the technical report are on GitHub.
```

- [ ] **Step 2: Create `urban-traffic-control.mdx`**

```markdown
## The problem

Classical AI planners (PDDL-based) can find excellent vehicle routes, but they don't scale: throwing them at a city-sized road network is computationally hopeless. This project makes them practical by only running them where it matters.

![framework](https://raw.githubusercontent.com/Matyxus/UTC_Framework/main/Images/FrameworkUTC.png)

## The pipeline

1. **Detect hotspots.** Gravitational clustering, similarity clustering and DBSCAN find which sub-regions of the network are actually congested.
2. **Prune the graph.** **TopKA\*** extracts the k shortest paths through each hotspot, so the planner sees a small, focused road graph instead of the whole city.
3. **Plan.** Off-the-shelf PDDL planners (Mercury, IPC-format) compute vehicle routes inside that sub-region.
4. **Simulate.** SUMO (via TraCI) runs the resulting routes in a full traffic simulation to measure whether it actually helped.
5. **Utilities.** OSM to SUMO NET.XML conversion, so any OpenStreetMap city can be imported.

## Results

Runs in `results_timeout/` cover full **Dublin** and **Luxembourg** scenarios, with timing tables and routed scenario bundles. The combination of edge-simplification plus TopKA\* plus DBSCAN is what makes it tractable; stock PDDL planners can't handle the unreduced graphs.

Research collaboration with CTU Prague; co-authored paper submitted to *Expert Systems with Applications*.
```

- [ ] **Step 3: Create `ppo-car-racing.mdx`**

```markdown
## What it does

A reinforcement-learning agent learns to drive a car around a top-down race track from raw pixels. The twist: the environment is modified with **custom wind dynamics** that push the car sideways with variable strength and direction, making it a harder test than vanilla CarRacing.

![driving agent](https://raw.githubusercontent.com/sykoravojtech/PPOCarRacing/main/car-driving.gif)

## How it's trained

- **Environment:** OpenAI Gym CarRacing-v2 wrapped with a wind action modifier.
- **Algorithm:** Proximal Policy Optimization (PPO). Actor/critic architecture with a deep CNN policy.
- **Hyperparameters:** horizon 2,250 steps, mini-batches of 1,024, γ = 0.99, learning rate 2.5e-4.

![ppo algorithm](https://raw.githubusercontent.com/sykoravojtech/PPOthesis/main/images/ppo-alg.jpg)

## The finding

Agents pre-trained on the wind-free track and then fine-tuned on wind generalise much better than agents trained from scratch on wind. In both cases the final policy **consistently scores 900+**, which OpenAI sets as the threshold for "solving" CarRacing.

Bachelor's thesis at CTU Prague. Full write-up in the linked PDF.
```

- [ ] **Step 4: Create `instance-segmentation.mdx`**

```markdown
## What it does

Instance segmentation: for every object in an image, the model outputs both a bounding box and a **pixel-level mask**, the exact shape of the object, not just a rectangle around it.

![prediction](https://raw.githubusercontent.com/sykoravojtech/instance-segmentation-challenge/main/assets/prediction1.png)

## How it's built

- **Mask R-CNN** (ResNet-50 + Feature Pyramid Network) from Facebook's **Detectron2** library: 44M parameters, pretrained on COCO.
- Custom dataset loaders and augmentation pipeline in `dataset_utils.py`.
- Training and evaluation notebook in `main.ipynb`; model regressed with Smooth L1 loss on the boxes.

![architecture](https://raw.githubusercontent.com/sykoravojtech/instance-segmentation-challenge/main/assets/rcnn.png)

## Scores

| Metric | Value |
|---|---|
| AP (overall) | **46.1** |
| AP @ IoU=0.5 | 59.9 |
| AP @ IoU=0.75 | 50.5 |
| AP large objects | 82.4 |
| AP medium objects | 46.5 |
| AP small objects | 10.0 |

Strong on anything big enough to see clearly, weak on tiny objects, which is the classic Mask R-CNN failure mode.
```

- [ ] **Step 5: Create `ihd-germany.mdx`**

```markdown
## The question

Germany has persistently higher ischemic heart disease (IHD) mortality than most other developed countries. Using 1990 to 2019 WHO and OECD data, this project asks: which lifestyle and policy factors actually drive the gap?

![CVD rate over time](https://raw.githubusercontent.com/sykoravojtech/IHD_germany_2024/main/doc/IHD_germany_2024/fig/fig_cardiovascular_disease_rate.jpg)

## Method

- **Permutation tests** to check that Germany's elevated IHD rate isn't just noise.
- **Random Forest regression** predicting IHD mortality from healthcare spend, alcohol consumption, fat consumption and median age.
- **SHAP values** to explain what the model is actually keying on per country and per age bracket.

![SHAP summary](https://raw.githubusercontent.com/sykoravojtech/IHD_germany_2024/main/doc/IHD_germany_2024/fig/fig_shap_values_summary.jpg)

## Findings

- IHD is the dominant cause of cardiovascular death in Germany across the whole 30-year window.
- **Median age** and **alcohol consumption** are the two strongest predictors of mortality.
- **Healthcare expenditure** matters, but with diminishing returns; more spend doesn't linearly translate to lower deaths.
- **Fat consumption** turns out to be a weak and inconclusive predictor on this data.

Done as part of a Data Literacy course; full report is in the linked PDF.
```

- [ ] **Step 6: Create `geojson-map-animation.mdx`**

```markdown
## What it shows

An interactive animated choropleth of **Czech citizen migration** between ORP (municipal) districts from 2015 through 2020, based on official government microdata.

![ORP animation](https://raw.githubusercontent.com/sykoravojtech/geojson-map-animation/main/orp.gif)

## How it's built

Three tools, one Jupyter notebook:

- **`geopandas`** loads the ORP boundary GeoJSON and joins it to the migration table.
- **`numpy`** aggregates annual net-migration counts per district.
- **`plotly.express`** renders the animated choropleth with a year slider and a continuous diverging colour scale.

## What it reveals

- Consistent **in-migration to Prague and Brno** year over year.
- **Out-migration from peripheral districts**, especially in northern Bohemia and border regions.
- The animation makes these patterns visible at a glance in a way that static maps can't.

Built for Charles University coursework.
```

- [ ] **Step 7: Sanity check — no legacy portfolio URLs made it in**

Run: `rg "sykoravojtech/portfolio" src/content/projects/`
Expected: no matches.

- [ ] **Step 8: Commit**

```bash
git add src/content/projects/
git commit -m "content(projects): migrate 6 long-form project pages from projects-web"
```

---

## Task 5: Draft the master's thesis MDX

**Files:**
- Create: `src/content/projects/multimodal-schematic-analysis.mdx`

- [ ] **Step 1: Create the MDX file with the drafted body**

```markdown
## What it does

Object detection for electrical schematics — given an image of a circuit diagram, find every symbol and box it. The research question: can a carefully modified specialist detector beat a pretrained vision-language model at this task?

## The problem

Two issues dominate automated schematic analysis. **Severe class imbalance** (some symbols appear thousands of times more often than others) and a **scarcity of good training data**, which forces a large domain shift between messy handwritten schematics and clean computer-generated ones.

## Contributions

- **A new dataset.** The **Raspberry Pi (RPi) dataset**: 22 high-resolution CAD schematics, 1,675 annotated symbols. Designed to test cross-domain adaptation from the hand-drawn CGHD dataset (3,137 images, ~246k annotations).
- **A tuned Faster R-CNN.** Enhanced the detector from the Modular Graph Extraction pipeline with Focal + GIoU losses, architectural changes, hyperparameter tuning, and targeted image transformations. Lift over a strong baseline: **+7.3% mAP on CGHD**, **+3.7% on the RPi dataset**.
- **A VLM comparison.** Benchmarked Molmo-7B-D, a pretrained VLM, on the same object detection task. Result: **17.5% accuracy vs. Faster R-CNN's 32.0%** — a carefully modified specialist still beats a general-purpose VLM for symbol detection. The VLM shows basic task understanding but isn't close.

## Why it matters

Releasing the RPi dataset gives the community a clean-schematic benchmark for cross-domain work, and the Focal + GIoU + tuning recipe is a drop-in lift for anyone using the MGE pipeline on similar data.

---

*Master's thesis, University of Tübingen, submitted July 2025. Supervisors: Prof. Dr. Oliver Bringmann (Tübingen), Prof. Dr.-Ing. Cristóbal Curio (Reutlingen). Graduate Advisor: M.Sc. Tobias Hald (FZI Forschungszentrum Informatik).*
```

- [ ] **Step 2: Commit**

```bash
git add src/content/projects/multimodal-schematic-analysis.mdx
git commit -m "content(projects): add master's thesis long-form"
```

---

## Task 6: Rewrite `src/content/projects.ts` with new ordering and schema

**Files:**
- Modify: `src/content/projects.ts` (full rewrite)

- [ ] **Step 1: Replace the entire file**

Overwrite `src/content/projects.ts` with:

```ts
import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "video-transformers",
    slug: "video-transformers",
    title: "Video Transformers for Classification & Captioning",
    category: "Deep Learning",
    date: "Mar 2024",
    description:
      "SVT vs. Video Mamba on Charades action classification, then both extended with a GPT-2 captioning head. Master's group project at Uni Tübingen.",
    tags: ["Video Mamba", "SVT", "GPT-2"],
    techStack: [
      "Captioning",
      "Charades Dataset",
      "OpenCV",
      "PyTorch",
      "PyTorch Lightning",
      "Scikit-learn",
      "Self-supervised Learning",
      "Transformer",
      "Video Classification",
      "Weights & Biases",
    ],
    github:
      "https://github.com/sykoravojtech/VideoMamba_SVT_VideoUnderstanding",
    paper:
      "https://github.com/sykoravojtech/VideoMamba_SVT_VideoUnderstanding/blob/main/doc/ML_Practical_LENSV7.pdf",
    heroImage: "/images/projects/video-transformers.jpeg",
    hasDetail: true,
    featured: true,
  },
  {
    id: "multimodal-schematic-analysis",
    slug: "multimodal-schematic-analysis",
    title: "Multimodal Deep Learning for Automated Schematic Analysis",
    category: "Deep Learning",
    date: "Jul 2025",
    description:
      "Master's thesis. Beating a pretrained VLM at electrical-schematic symbol detection with a tuned Faster R-CNN. Introduces a new CAD dataset and a +7.3% mAP lift.",
    tags: ["Object Detection", "Thesis", "VLM"],
    techStack: [
      "Faster R-CNN",
      "Focal Loss",
      "GIoU Loss",
      "Molmo-7B-D",
      "PyTorch",
      "Domain Adaptation",
      "Object Detection",
    ],
    github: "https://github.com/sykoravojtech/od-symbol",
    paper:
      "https://github.com/sykoravojtech/od-symbol/blob/main/assets/VojtechSykora_MasterThesis.pdf",
    // heroImage set in a later task (requires fetching from the od-symbol repo)
    hasDetail: true,
    featured: true,
  },
  {
    id: "urban-traffic-control",
    slug: "urban-traffic-control",
    title: "Urban Traffic Control Framework",
    category: "Research",
    date: "Mar 2023",
    description:
      "Making PDDL planners tractable on city-scale road networks. Gravitational clustering picks the hotspots; TopKA* prunes the graph. Runs on Dublin and Luxembourg.",
    tags: ["Python", "SUMO", "Research"],
    techStack: [
      "Automated Planning",
      "Gravitational Clustering",
      "PDDL",
      "Python",
      "SUMO",
      "Traffic Simulation",
      "Vehicle Routing",
    ],
    github: "https://github.com/Matyxus/UTC_Framework",
    heroImage: "/images/projects/utc-framework.png",
    hasDetail: true,
    featured: true,
  },
  {
    id: "ppo-car-racing",
    slug: "ppo-car-racing",
    title: "Proximal Policy Optimization for Car Racing",
    category: "Reinforcement Learning",
    date: "Jul 2022",
    description:
      "Bachelor's thesis at CTU Prague. PPO agent in OpenAI CarRacing with custom wind dynamics; consistently solves the env at 900+.",
    tags: ["PPO", "Reinforcement Learning", "OpenAI Gym"],
    techStack: [
      "Autonomous Driving",
      "OpenAI Gym",
      "PPO",
      "Reinforcement Learning",
    ],
    github: "https://github.com/sykoravojtech/PPOthesis/tree/main",
    paper:
      "https://raw.githubusercontent.com/sykoravojtech/PPOthesis/main/PPO_Thesis_Sykora.pdf",
    heroImage:
      "https://raw.githubusercontent.com/sykoravojtech/PPOCarRacing/main/car-driving.gif",
    hasDetail: true,
    featured: false,
  },
  {
    id: "instance-segmentation",
    slug: "instance-segmentation",
    title: "Instance Segmentation Challenge",
    category: "Computer Vision",
    date: "Oct 2024",
    description:
      "Detectron2 + Mask R-CNN for pixel-level object masks. 46.1 AP overall; classic Mask R-CNN failure mode on tiny objects.",
    tags: ["Detectron2", "Mask R-CNN", "PyTorch"],
    techStack: [
      "Detectron2",
      "Instance Segmentation",
      "Mask R-CNN",
      "PyTorch",
    ],
    github:
      "https://github.com/sykoravojtech/instance-segmentation-challenge",
    heroImage:
      "https://raw.githubusercontent.com/sykoravojtech/instance-segmentation-challenge/main/assets/rcnn.png",
    hasDetail: true,
    featured: false,
  },
  {
    id: "ihd-germany",
    slug: "ihd-germany",
    title: "Ischemic Heart Disease Analysis in Germany",
    category: "Machine Learning",
    date: "Jul 2024",
    description:
      "Why is heart disease worse in Germany than in other rich countries? Random forest + SHAP on 30 years of WHO/OECD data point at age and alcohol.",
    tags: ["Random Forest", "SHAP", "Pandas"],
    techStack: [
      "Cardiovascular Disease",
      "Machine Learning",
      "Matplotlib",
      "NumPy",
      "Pandas",
      "Random Forest",
      "SHAP Analysis",
    ],
    github: "https://github.com/sykoravojtech/IHD_germany_2024",
    paper:
      "https://raw.githubusercontent.com/sykoravojtech/IHD_germany_2024/main/doc/IHD_germany_2024/DataLit_report_2024.pdf",
    heroImage: "/images/projects/ihd-germany.png",
    hasDetail: true,
    featured: false,
  },
  {
    id: "black-forest-hackathon",
    slug: "black-forest-hackathon",
    title: "Black Forest Hackathon — Data Decoded",
    category: "Hackathon",
    date: "May 2025",
    description:
      "48-hour team sprint. Enhanced HRI prototype: voice commands, gesture control, and human recognition for factory robots. Led a 5-member team.",
    tags: ["MediaPipe", "YOLOv8", "ROS", "Python"],
    hasDetail: false,
    featured: false,
  },
  {
    id: "geojson-map-animation",
    slug: "geojson-map-animation",
    title: "GeoJSON Map Animation",
    category: "Data Viz",
    date: "2023",
    description:
      "Animated choropleth of Czech internal migration 2015 to 2020. Drag the slider and watch Prague and Brno swallow the periphery.",
    tags: ["Plotly", "GeoPandas", "Python"],
    techStack: [
      "Animation",
      "GeoJSON",
      "GeoPandas",
      "Plotly",
      "Python",
    ],
    github: "https://github.com/sykoravojtech/geojson-map-animation",
    heroImage:
      "https://raw.githubusercontent.com/sykoravojtech/geojson-map-animation/main/orp.gif",
    hasDetail: true,
    featured: false,
  },
];
```

- [ ] **Step 2: Update the `content-helpers` test expectation**

Modify `tests/content-helpers.test.ts` — replace the `getFeaturedProjects` block with a more specific check that the order is correct:

Old:
```ts
describe("getFeaturedProjects", () => {
  it("returns only projects with featured=true", () => {
    const result = getFeaturedProjects();
    expect(result.every((p) => p.featured)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(3);
  });
});
```

New:
```ts
describe("getFeaturedProjects", () => {
  it("returns only projects with featured=true", () => {
    const result = getFeaturedProjects();
    expect(result.every((p) => p.featured)).toBe(true);
  });

  it("returns the expected three, in priority order", () => {
    const ids = getFeaturedProjects().map((p) => p.id);
    expect(ids).toEqual([
      "video-transformers",
      "multimodal-schematic-analysis",
      "urban-traffic-control",
    ]);
  });
});
```

- [ ] **Step 3: Run all tests**

Run: `pnpm test`
Expected: PASS. If TypeScript complains that `hasDetail` is missing anywhere, check your rewrite.

- [ ] **Step 4: Run lint**

Run: `pnpm lint`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/content/projects.ts tests/content-helpers.test.ts
git commit -m "feat(projects): rewrite projects.ts with new ordering + schema"
```

---

## Task 7: Create the `/projects/[slug]` detail page route

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`
- Create: `tests/projects-route.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/projects-route.test.ts` with:

```ts
import { describe, it, expect } from "vitest";
import { projects } from "@/content/projects";
import { listProjectSlugs, getProjectContent } from "@/lib/projects-mdx";

describe("projects route data integrity", () => {
  it("every project with hasDetail=true has an MDX file", () => {
    const slugs = new Set(listProjectSlugs());
    const missing = projects
      .filter((p) => p.hasDetail)
      .filter((p) => !slugs.has(p.slug))
      .map((p) => p.slug);
    expect(missing).toEqual([]);
  });

  it("every hasDetail project loads non-empty content", () => {
    for (const p of projects.filter((p) => p.hasDetail)) {
      const loaded = getProjectContent(p.slug);
      expect(loaded, `slug ${p.slug}`).not.toBeNull();
      expect(loaded!.content.length).toBeGreaterThan(20);
    }
  });
});
```

- [ ] **Step 2: Run — it should pass**

Run: `pnpm test tests/projects-route.test.ts`
Expected: PASS (all detail slugs have MDX from Tasks 4 + 5).

If any slug fails, the MDX file for it wasn't created correctly in Task 4 or 5. Fix the filename and re-run.

- [ ] **Step 3: Create the route page**

Create `src/app/projects/[slug]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileCode2, FileText, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { projects } from "@/content/projects";
import { getProjectContent } from "@/lib/projects-mdx";
import { TagPill } from "@/components/tag-pill";

export function generateStaticParams() {
  return projects
    .filter((p) => p.hasDetail)
    .map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && p.hasDetail);
  if (!project) notFound();

  const loaded = getProjectContent(slug);
  if (!loaded) notFound();

  return (
    <article className="mx-auto max-w-[860px] px-6 py-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted mb-2">
          {project.category}
          {project.date ? ` · ${project.date}` : ""}
        </p>
        <h1 className="text-[32px] sm:text-[40px] font-black tracking-[-0.035em] text-ink mb-3">
          {project.title}
        </h1>
        <p className="text-[15px] text-muted leading-relaxed max-w-2xl">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-4">
            {project.tags.map((t) => (
              <TagPill key={t}>{t}</TagPill>
            ))}
          </div>
        )}

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-3">
            {project.techStack.map((kw) => (
              <span
                key={kw}
                className="text-[11px] text-muted bg-bg3 border border-border px-2 py-0.5 rounded-md"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-5">
          {project.github && (
            <LinkButton href={project.github} icon={<FileCode2 className="w-3.5 h-3.5" />} label="GitHub" />
          )}
          {project.paper && (
            <LinkButton href={project.paper} icon={<FileText className="w-3.5 h-3.5" />} label="Paper" />
          )}
          {project.webapp && (
            <LinkButton href={project.webapp} icon={<Globe className="w-3.5 h-3.5" />} label="Live site" />
          )}
        </div>
      </div>

      {project.heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.heroImage}
          alt={project.title}
          className="w-full rounded-xl border border-border mb-8"
        />
      )}

      <div className="prose-showcase">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{loaded.content}</ReactMarkdown>
      </div>

      <div className="mt-12">
        <Link href="/projects" className="text-green-mid font-bold text-[12px]">
          ← All projects
        </Link>
      </div>
    </article>
  );
}

function LinkButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-bone bg-bordeaux px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
    >
      {icon}
      {label}
    </a>
  );
}
```

- [ ] **Step 4: Run lint + tests**

Run: `pnpm lint && pnpm test`
Expected: clean, all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/projects/\[slug\]/page.tsx tests/projects-route.test.ts
git commit -m "feat(projects): add /projects/[slug] detail page route"
```

---

## Task 8: Redesign `ProjectCard` with hero thumb + internal routing

**Files:**
- Modify: `src/components/project-card.tsx` (full rewrite)

- [ ] **Step 1: Replace the component**

Overwrite `src/components/project-card.tsx` with:

```tsx
import Link from "next/link";
import type { Project } from "@/content/types";
import { TagPill } from "./tag-pill";

export function ProjectCard({ item }: { item: Project }) {
  // Resolve primary href + CTA label
  const externalPrimary = item.webapp ?? item.github ?? item.paper;
  const externalLabel = item.webapp
    ? "Live →"
    : item.github
    ? "GitHub →"
    : item.paper
    ? "Paper →"
    : null;

  const useInternal = item.hasDetail;
  const href = useInternal ? `/projects/${item.slug}` : externalPrimary;
  const ctaLabel = useInternal ? "View project →" : externalLabel;
  const isExternal = !useInternal && externalPrimary != null;

  // Card body (reused whether the card is a link or a plain div)
  const body = (
    <div className="flex flex-col h-full">
      {/* Hero thumbnail */}
      <div className="aspect-[16/9] overflow-hidden rounded-t-xl bg-gradient-to-br from-bg3 to-bg2 border-b border-border">
        {item.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.heroImage}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
              {item.category}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
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
        {ctaLabel && (
          <span className="text-[12px] font-bold text-green-mid group-hover:text-bordeaux mt-auto transition-colors">
            {ctaLabel}
          </span>
        )}
      </div>
    </div>
  );

  const cardClass =
    "group block bg-bg2 border border-border rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(18,54,36,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(18,54,36,0.14)] hover:border-green/25 transition-all duration-[400ms]";

  // No link at all (Black Forest Hackathon has no external primary + no detail page)
  if (!href) {
    return <div className={cardClass}>{body}</div>;
  }

  // Internal link
  if (!isExternal) {
    return (
      <Link href={href} className={cardClass}>
        {body}
      </Link>
    );
  }

  // External link
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cardClass}
    >
      {body}
    </a>
  );
}
```

- [ ] **Step 2: Lint + tests**

Run: `pnpm lint && pnpm test`
Expected: all clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/project-card.tsx
git commit -m "feat(projects): card hero thumb + internal routing for detail pages"
```

---

## Task 9: Update `/projects` page copy

**Files:**
- Modify: `src/app/projects/page.tsx`

- [ ] **Step 1: Update the tagline**

In `src/app/projects/page.tsx`, find:

```tsx
tagline="Selected personal and research projects. Live tools at projects.vojtechsykora.com."
```

Replace with:

```tsx
tagline="Selected personal and research projects."
```

- [ ] **Step 2: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "copy(projects): drop reference to projects-web tool hub"
```

---

## Task 10: Add guard test — no legacy portfolio URL in content or metadata

**Files:**
- Create: `tests/no-legacy-portfolio-refs.test.ts`

- [ ] **Step 1: Write the test**

Create `tests/no-legacy-portfolio-refs.test.ts` with:

```ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { projects } from "@/content/projects";

const LEGACY = "raw.githubusercontent.com/sykoravojtech/portfolio";

describe("no legacy portfolio URL references", () => {
  it("no project metadata points at sykoravojtech/portfolio raw URLs", () => {
    for (const p of projects) {
      for (const field of [p.heroImage, p.github, p.paper, p.webapp]) {
        if (!field) continue;
        expect(field, `project ${p.slug}: ${field}`).not.toContain(LEGACY);
      }
    }
  });

  it("no MDX file under src/content/projects/ references it", () => {
    const dir = path.join(process.cwd(), "src", "content", "projects");
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const f of files) {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      expect(raw, `file ${f}`).not.toContain(LEGACY);
    }
  });
});
```

- [ ] **Step 2: Run — should pass**

Run: `pnpm test tests/no-legacy-portfolio-refs.test.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/no-legacy-portfolio-refs.test.ts
git commit -m "test(projects): guard against legacy portfolio repo URLs"
```

---

## Task 11: Delete the fixture and confirm build

**Files:**
- Delete: `src/content/projects/_fixture.mdx`
- Modify: `tests/projects-mdx.test.ts` (remove the fixture reference OR replace with a real slug)

- [ ] **Step 1: Delete the fixture**

Run: `rm src/content/projects/_fixture.mdx`

- [ ] **Step 2: Rewrite the loader test to use a real slug**

Replace `tests/projects-mdx.test.ts` contents with:

```ts
import { describe, it, expect } from "vitest";
import {
  getProjectContent,
  listProjectSlugs,
} from "@/lib/projects-mdx";

describe("projects MDX loader", () => {
  it("lists all MDX slugs in src/content/projects/", () => {
    const slugs = listProjectSlugs();
    expect(slugs).toContain("video-transformers");
    expect(slugs).toContain("multimodal-schematic-analysis");
  });

  it("reads a real MDX file by slug", () => {
    const loaded = getProjectContent("video-transformers");
    expect(loaded).not.toBeNull();
    expect(loaded!.content).toContain("Charades");
  });

  it("returns null for a missing slug", () => {
    expect(getProjectContent("does-not-exist")).toBeNull();
  });
});
```

- [ ] **Step 3: Run all tests**

Run: `pnpm test`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/content/projects/ tests/projects-mdx.test.ts
git commit -m "test(projects): use real slug in loader test, remove fixture"
```

---

## Task 12: Fetch od-symbol hero image (manual step)

The spec requires a hero image for the master's thesis card & detail page. It's the only one that must be decided at implementation time.

- [ ] **Step 1: Browse the od-symbol repo**

Open `https://github.com/sykoravojtech/od-symbol` and look for a suitable figure in the `assets/` or `images/` directory. Good candidates:
- A dataset sample schematic (clean CAD or hand-drawn).
- A prediction visualization (boxes on a schematic).
- The thesis title-page figure if it's standalone and presentable.

- [ ] **Step 2: Update `projects.ts` with the chosen URL**

In `src/content/projects.ts`, find the `multimodal-schematic-analysis` entry and add a `heroImage` field. Use the raw URL form:

```
https://raw.githubusercontent.com/sykoravojtech/od-symbol/main/<path>
```

Replace the placeholder comment line `// heroImage set in a later task...` with the actual `heroImage: "..."` line.

- [ ] **Step 3: Verify image loads**

Run `pnpm dev`, open `http://localhost:3200/projects/multimodal-schematic-analysis`, confirm the hero image renders (not a broken-image icon).

- [ ] **Step 4: Commit**

```bash
git add src/content/projects.ts
git commit -m "assets(projects): set hero image for master's thesis card"
```

**If no image in the repo is suitable:** stop and ask the user before shipping. The featured card should not silently fall back to the placeholder.

---

## Task 13: Full smoke test + deploy prep

- [ ] **Step 1: Full local verification**

Run all of these in order:

```bash
pnpm lint
pnpm test
pnpm build
```

Expected:
- lint clean
- all tests pass
- `pnpm build` succeeds and `out/projects/video-transformers/index.html` exists (same for all other `hasDetail: true` slugs), and `out/projects/black-forest-hackathon/index.html` does **not** exist.

Verify with:

```bash
ls out/projects/
```

- [ ] **Step 2: Browser smoke test**

Run: `pnpm dev`

Open `http://localhost:3200/` and verify:
- Three featured project cards render in order: Video Transformers → Multimodal Schematic Analysis → Urban Traffic Control.
- Each card shows its hero image thumbnail.
- Clicking a card lands on `/projects/[slug]` with correct title, category, tags, techStack, link buttons, hero image, and markdown body.

Open `http://localhost:3200/projects` and verify:
- All 8 cards render in the order declared in `projects.ts`.
- Black Forest Hackathon card has no hero image (placeholder instead) and no CTA label.
- Tagline reads "Selected personal and research projects." (no mention of projects-web).

- [ ] **Step 3: Kill any stray dev processes**

Hit Ctrl-C in the dev shell. Confirm with `lsof -i :3200` that port 3200 is free.

- [ ] **Step 4: Final commit if anything was fixed during smoke testing**

```bash
git status
git add <any fixed files>
git commit -m "fix(projects): smoke-test follow-ups"
```

- [ ] **Step 5: Push when user approves**

Tell the user the plan is executed and the local build+smoke is green. Do **not** push without an explicit OK — pushing to `main` deploys to production (`vojtechsykora.com`) via GitHub Actions.

---

## Spec-coverage checklist (plan self-review)

- ✅ Extended Project type (slug, techStack, heroImage, hasDetail) → Task 1
- ✅ `src/content/projects/*.mdx` files for 7 detail-page slugs → Tasks 4, 5
- ✅ `src/lib/projects-mdx.ts` loader → Task 2
- ✅ `/projects/[slug]/page.tsx` route with generateStaticParams → Task 7
- ✅ ProjectCard hero thumb + internal routing → Task 8
- ✅ Three legacy hero images copied locally → Task 3
- ✅ projects.ts rewritten with new order and removals → Task 6
- ✅ `/projects` page tagline updated → Task 9
- ✅ Guard test banning legacy portfolio URLs → Task 10
- ✅ od-symbol hero image resolution → Task 12
- ✅ Black Forest Hackathon handled as card-only with no CTA → covered by Task 8 logic + Task 6 data (no `hasDetail`, no external links)
