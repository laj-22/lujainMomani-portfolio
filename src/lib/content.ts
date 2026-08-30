import projectsData from '@/content/projects.json';
import categoriesData from '@/content/project-categories.json';
import thesisData from '@/content/thesis.json';
import publicationsData from '@/content/publications.json';
import experienceData from '@/content/experience.json';
import activitiesData from '@/content/activities.json';
import skillsData from '@/content/skills.json';
import aboutData from '@/content/about.json';
import siteData from '@/content/site.json';
import { resolveImage } from '@/lib/images';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  image: string;
  links?: Array<{ type: string; url: string; label?: string }>;
  github?: string;
  demo?: string;
  linkedProjectId?: string;
  featured: boolean;
  timeline: string;
  team: string;
  impact: string[];
  gallery: string[];
  startDate?: string;
  endDate?: string;
}

export interface ProjectCategory {
  id: string;
  label: string;
  icon: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  conference: string;
  year: string;
  status: 'published' | 'under-review' | 'in-progress';
  abstract?: string;
  links?: Array<{ type: string; url: string; label?: string }>;
  link?: string;
  doi?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  meta: string;
  bullets: string[];
  order: number;
}

export const projects: Project[] = projectsData as Project[];

type ThesisRecord = {
  id?: string;
  title?: string;
  description?: string;
  longDescription?: string;
  image?: string;
  github?: string;
  links?: Project['links'];
  linkedProjectId?: string;
  tags?: string[];
  achievements?: string[];
  date?: string;
  category?: string;
};

/** Projects shown on the site grid — includes thesis spotlight when its linked card is missing. */
export function getDisplayProjects(): Project[] {
  const list = [...projects];
  const thesis = thesisData as ThesisRecord;
  const thesisId = thesis.linkedProjectId || thesis.id;
  if (!thesisId || !thesis.title) {
    return list;
  }

  const existingIdx = list.findIndex((p) => p.id === thesisId);
  if (existingIdx < 0) {
    return [
      {
        id: thesisId,
        title: thesis.title,
        description: thesis.description || '',
        longDescription: thesis.longDescription || '',
        category: thesis.category || 'security',
        tags: thesis.tags || [],
        image: thesis.image || 'thesis.png',
        github: thesis.github,
        links: thesis.links,
        linkedProjectId: thesis.linkedProjectId || thesisId,
        featured: true,
        timeline: thesis.date ? String(thesis.date) : 'Graduation Thesis',
        team: '1 person',
        impact: thesis.achievements || [],
        gallery: [],
        startDate: '2025-10-01',
        endDate: '2026-04-30',
      },
      ...list,
    ];
  }

  if (!list[existingIdx].featured) {
    const updated = [...list];
    updated[existingIdx] = { ...updated[existingIdx], featured: true };
    return updated;
  }

  return list;
}

export const categories: ProjectCategory[] = categoriesData as ProjectCategory[];

export const thesis = {
  ...(thesisData as Record<string, unknown>),
  image: resolveImage((thesisData as { image?: string }).image),
};

export const publications = publicationsData as {
  published: Publication[];
  underReview: Publication[];
};

export const experience = experienceData as ExperienceItem[];

export const activities = activitiesData as Array<{
  category: string;
  icon: string;
  color: string;
  items: Array<Record<string, unknown>>;
}>;

export const skills = skillsData as {
  categories: Array<{
    title: string;
    icon: string;
    color: string;
    skills: Array<{ name: string; icon: string }>;
  }>;
  relatedProjects: Record<string, string[]>;
};

export const about = aboutData as {
  highlights: Array<{ icon: string; title: string; description: string }>;
  paragraphs: string[];
};

export const site = siteData as {
  name: string;
  title: string;
  linkedin: string;
  links?: Array<{ type: string; url: string; label?: string }>;
  email: string;
  location: string;
  footer: string;
  aboutParagraphs: string[];
  heroImage: string;
  profileImage: string;
  cvPath: string;
};

export function getDerivedCategories(): ProjectCategory[] {
  const fromData = categories.filter((c) => c.id !== 'all' && c.id !== 'featured');
  const used = new Set(projects.map((p) => p.category));
  const existing = new Set(fromData.map((c) => c.id));
  const extras = [...used]
    .filter((id) => !existing.has(id))
    .map((id) => ({
      id,
      label: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      icon: 'Cpu',
    }));
  return [
    { id: 'all', label: 'All Projects', icon: 'Cpu' },
    { id: 'featured', label: 'Featured', icon: 'Star' },
    ...fromData,
    ...extras,
  ];
}
