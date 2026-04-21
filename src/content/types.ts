export type Bio = {
  name: string;
  role: string;
  location: string;
  tagline: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  medium: string;
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
  dateDisplay: string;    // e.g. "Oct 2025 - Present"
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
  thesisLink?: string;
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

export type WritingMeta = {
  slug: string;
  title: string;
  date: string;      // ISO YYYY-MM-DD
  excerpt: string;
  tags: string[];
  published: boolean;
  readingMinutes: number;
};
