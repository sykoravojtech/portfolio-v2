// Copy for the homepage. The RapidSOS text is public on purpose: no product names,
// no customers, no numbers. Check every sentence with Vojta before changing it.

export const now = {
  kicker: "RapidSOS / since Jul 2026",
  title: "One AI platform for the whole company",
  body: [
    "I lead the largest AI and technology transformation in the company's history: one platform that everyone in the company works in.",
    "It started with internal operations. It is built to carry customer-facing work as well.",
  ],
  layers: [
    { label: "People", text: "Every team, every role" },
    { label: "Product", text: "One place, one UX" },
    { label: "Platform", text: "Login, permissions, AI gateway", hot: true },
    { label: "Foundation", text: "Backend, data, security" },
  ],
  pillars: [
    { label: "Build", text: "Platform, backend, frontend, the AI gateway" },
    { label: "Trust", text: "Security, permissions, UX and UI" },
    { label: "Steer", text: "AI strategy with leadership. Turning requests from across the company into one roadmap." },
  ],
};

/** Big past projects. `experienceId` opens that job's details in the sheet. */
export const selectedWork = [
  {
    experienceId: "miton",
    kicker: "Miton / 2025–2026 / sole engineer",
    title: "A data intelligence platform, built alone",
    text: "Semantic search over 150K+ records, data from 5+ external APIs, identity resolution across sources, the backend, the frontend, the MCP server and the infrastructure.",
    stats: [
      { value: "150K+", label: "records searched" },
      { value: "<1 s", label: "query time" },
    ],
  },
  {
    experienceId: "stealth-startup",
    kicker: "Robotics startup / 2025 / founder and CEO",
    title: "Robots that restock supermarket shelves",
    text: "Product recognition, VLM grasp points for pick-and-place, a dataset pipeline built for international rollout. Pitched investors, won letters of intent, and negotiated with REWE Digital.",
    stats: [{ value: "94.5%", label: "mAP50, shelf products" }],
  },
  {
    experienceId: "fzi",
    kicker: "Research / 2021–2025",
    title: "Vision and language, from labs to a thesis",
    text: "Reading electronic schematics with multimodal models at FZI (my master's thesis), video transformers during my master's in Tübingen, AI research with the US Air Force Research Lab.",
    stats: [{ value: "+7.3%", label: "mAP, detection" }],
  },
];

export type LabApp = {
  id: string;
  name: string;
  host: string;
  url?: string;
  text: string;
  stack: string;
  /** Screenshot under /public/images/lab/. Missing = a labelled empty frame. */
  shot?: string;
};

export const labApps: LabApp[] = [
  { id: "lab", name: "Lab", host: "lab.vojtechsykora.com", text: "The control room: automation results, integrations, costs and one login for every other app.", stack: "Next.js · FastAPI · Flutter" },
  { id: "games", name: "Games", host: "games.vojtechsykora.com", url: "https://games.vojtechsykora.com", text: "Daily geography and estimation games, with a Czech mode built on all 77 districts.", stack: "Flutter · Android + web" },
  { id: "tv", name: "TV", host: "tv.vojtechsykora.com", text: "What I watch and what is next, with years of imported history.", stack: "FastAPI · Postgres · Flutter" },
  { id: "books", name: "Books", host: "books.vojtechsykora.com", text: "Reading tracker with editions, shelves and stats.", stack: "FastAPI · Postgres · Flutter" },
  { id: "maps", name: "Maps", host: "maps.vojtechsykora.com", text: "Hiking places and routes on my own OpenStreetMap data.", stack: "Flutter · PostGIS" },
  { id: "split", name: "Split", host: "split.vojtechsykora.com", text: "Shared trip expenses. Friends join as guests, no account needed.", stack: "Flutter · Android + web" },
];
