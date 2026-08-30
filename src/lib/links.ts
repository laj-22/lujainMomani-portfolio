import type { LucideIcon } from 'lucide-react';
import {
  ExternalLink,
  FileText,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Youtube,
} from 'lucide-react';

export type LinkType =
  | 'github'
  | 'youtube'
  | 'linkedin'
  | 'demo'
  | 'website'
  | 'paper'
  | 'doi'
  | 'twitter'
  | 'instagram'
  | 'email'
  | 'other';

export interface ContentLink {
  type: LinkType;
  url: string;
  label?: string;
}

const DEFAULT_LABELS: Record<LinkType, string> = {
  github: 'View Code',
  youtube: 'Watch Video',
  linkedin: 'LinkedIn',
  demo: 'Live Demo',
  website: 'Visit Site',
  paper: 'Read Paper',
  doi: 'View DOI',
  twitter: 'Twitter',
  instagram: 'Instagram',
  email: 'Email',
  other: 'Open Link',
};

const LINK_ICONS: Record<LinkType, LucideIcon> = {
  github: Github,
  youtube: Youtube,
  linkedin: Linkedin,
  demo: ExternalLink,
  website: Globe,
  paper: FileText,
  doi: FileText,
  twitter: ExternalLink,
  instagram: Instagram,
  email: Mail,
  other: ExternalLink,
};

function inferLinkType(url: string): LinkType {
  const u = url.toLowerCase();
  if (u.startsWith('mailto:')) return 'email';
  if (u.includes('github.com')) return 'github';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('linkedin.com')) return 'linkedin';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('doi.org')) return 'doi';
  return 'website';
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('mailto:')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\//, '')}`;
}

export function getLinkIcon(type: LinkType): LucideIcon {
  return LINK_ICONS[type] ?? ExternalLink;
}

export function getLinkLabel(link: ContentLink): string {
  if (link.label?.trim()) return link.label.trim();
  return DEFAULT_LABELS[link.type] ?? DEFAULT_LABELS.other;
}

export function resolveLinks(
  item: {
    links?: ContentLink[];
    github?: string;
    demo?: string;
    link?: string;
    linkedin?: string;
  },
  legacyMap?: Partial<Record<'github' | 'demo' | 'link' | 'linkedin', LinkType>>,
): ContentLink[] {
  if (Array.isArray(item.links) && item.links.length > 0) {
    return item.links
      .filter((l) => l?.url?.trim())
      .map((l) => ({
        type: (l.type as LinkType) || inferLinkType(l.url),
        url: normalizeUrl(l.url),
        label: l.label,
      }));
  }

  const map = {
    github: 'github' as const,
    demo: 'demo' as const,
    link: 'website' as const,
    linkedin: 'linkedin' as const,
    ...legacyMap,
  };

  const result: ContentLink[] = [];
  (Object.keys(map) as Array<keyof typeof map>).forEach((field) => {
    const raw = item[field];
    if (typeof raw === 'string' && raw.trim()) {
      result.push({
        type: map[field],
        url: normalizeUrl(raw),
      });
    }
  });
  return result;
}

export function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
