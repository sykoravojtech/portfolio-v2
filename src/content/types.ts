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
