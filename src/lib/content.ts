import { experiences } from "@/content/experiences";
import { education } from "@/content/education";
import { projects } from "@/content/projects";
import type { Experience, Education, Project } from "@/content/types";
import { compareByStartDesc } from "@/lib/dates";

export function getLatestExperiences(count?: number): Experience[] {
  const sorted = [...experiences].sort(compareByStartDesc);
  return count == null ? sorted : sorted.slice(0, count);
}

export function getLatestEducation(count?: number): Education[] {
  const sorted = [...education].sort(compareByStartDesc);
  return count == null ? sorted : sorted.slice(0, count);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
