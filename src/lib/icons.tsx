import {
  Activity,
  Award,
  BookOpen,
  Bot,
  Code,
  Cpu,
  Cog,
  Gauge,
  Medal,
  Radio,
  Shield,
  Star,
  Terminal,
  Trophy,
  Users,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { createElement } from 'react';

/** Lucide icon names allowed in JSON content — keep in sync with portfolio-manager/constants.py */
export const ICON_NAMES = [
  'Activity',
  'Award',
  'BookOpen',
  'Bot',
  'Code',
  'Cog',
  'Cpu',
  'Gauge',
  'Medal',
  'Radio',
  'Shield',
  'Star',
  'Terminal',
  'Trophy',
  'Users',
  'Wifi',
  'Wrench',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

const ICONS: Record<string, LucideIcon> = {
  Activity,
  Award,
  BookOpen,
  Bot,
  Code,
  Cpu,
  Cog,
  Gauge,
  Medal,
  Radio,
  Shield,
  Star,
  Terminal,
  Trophy,
  Users,
  Wifi,
  Wrench,
};

const COLOR_ICON_WRAP: Record<string, string> = {
  primary: 'text-primary bg-primary/10 border-primary/20 group-hover:bg-primary/20',
  secondary: 'text-secondary bg-secondary/10 border-secondary/20 group-hover:bg-secondary/20',
  accent: 'text-accent bg-accent/10 border-accent/20 group-hover:bg-accent/20',
};

const COLOR_ICON_BOX: Record<string, string> = {
  primary: 'text-primary bg-primary/10',
  secondary: 'text-secondary bg-secondary/10',
  accent: 'text-accent bg-accent/10',
};

export function isKnownIcon(name: string | null | undefined): name is IconName {
  return Boolean(name && ICONS[name]);
}

export function getIcon(name: string | null | undefined, className = 'h-4 w-4') {
  if (!name) return null;
  const Icon = ICONS[name];
  if (!Icon) return null;
  return createElement(Icon, { className });
}

export function getCategoryIcon(name: string, className = 'h-4 w-4') {
  return getIcon(name, className) ?? createElement(Cpu, { className });
}

/** Rounded icon badge for activity category headers (Tailwind-safe). */
export function getColorRingClass(color: string | undefined): string {
  return COLOR_ICON_WRAP[color ?? ''] ?? COLOR_ICON_WRAP.primary;
}

/** Square icon badge for skill category headers (Tailwind-safe). */
export function getColorBoxClass(color: string | undefined): string {
  return COLOR_ICON_BOX[color ?? ''] ?? COLOR_ICON_BOX.primary;
}
