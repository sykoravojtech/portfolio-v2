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
