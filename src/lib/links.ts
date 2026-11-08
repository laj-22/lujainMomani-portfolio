import type { ComponentType } from 'react';
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
import OrcidIcon from '@/lib/OrcidIcon';

type LinkIcon = ComponentType<{ size?: number | string; className?: string }>;

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
  | 'orcid'
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
  orcid: 'ORCID',
  other: 'Open Link',
};

const LINK_ICONS: Record<LinkType, LinkIcon> = {
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
  orcid: OrcidIcon,
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
  if (u.includes('orcid.org')) return 'orcid';
  return 'website';
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('mailto:')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Site-local file (e.g. certificates/x.jpg): first path segment has no dot, unlike a domain
  if (!trimmed.split('/')[0].includes('.')) {
    return `${import.meta.env.BASE_URL || '/'}${trimmed.replace(/^\//, '')}`;
  }
  return `https://${trimmed.replace(/^\//, '')}`;
}

export function getLinkIcon(type: LinkType): LinkIcon {
  return LINK_ICONS[type] ?? ExternalLink;
}

export function getLinkLabel(link: ContentLink): string {
  if (link.label?.trim()) return link.label.trim();
  return DEFAULT_LABELS[link.type] ?? DEFAULT_LABELS.other;
}

export function resolveLinks(
  item: {
    // content JSON stores the type as plain text; it is normalised below
    links?: Array<{ type?: string; url: string; label?: string }>;
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
        // an orcid.org URL always gets the ORCID mark, whatever type the content file says
        type: /orcid\.org/i.test(l.url) ? 'orcid' : (l.type as LinkType) || inferLinkType(l.url),
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
