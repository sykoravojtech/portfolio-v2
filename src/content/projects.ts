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
