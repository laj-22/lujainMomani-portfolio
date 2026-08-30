import projectTelemetry from '@/assets/project-telemetry.jpg';
import projectSecurity from '@/assets/project-security.jpg';
import projectRobot from '@/assets/project-robot.jpg';
import projectPitStop from '@/assets/project-pitstop.jpg';
import projectWireless from '@/assets/project-wireless.jpg';
import projectFirewall from '@/assets/project-firewall.jpg';
import thesisImage from '../../thesis.png';

const BUNDLED: Record<string, string> = {
  'thesis.png': thesisImage,
  'src/assets/project-telemetry.jpg': projectTelemetry,
  'src/assets/project-security.jpg': projectSecurity,
  'src/assets/project-robot.jpg': projectRobot,
  'src/assets/project-pitstop.jpg': projectPitStop,
  'src/assets/project-wireless.jpg': projectWireless,
  'src/assets/project-firewall.jpg': projectFirewall,
  '@/assets/project-telemetry.jpg': projectTelemetry,
  '@/assets/project-security.jpg': projectSecurity,
  '@/assets/project-robot.jpg': projectRobot,
  '@/assets/project-pitstop.jpg': projectPitStop,
  '@/assets/project-wireless.jpg': projectWireless,
  '@/assets/project-firewall.jpg': projectFirewall,
};

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

/** Build URL candidates for project image fallback (matches original Projects.tsx). */
export function getTitleBases(title: string, explicitPath?: string): string[] {
  const publicBase = import.meta.env.BASE_URL || '/';
  const candidates: string[] = [];

  if (explicitPath?.trim()) {
    const stripped = explicitPath.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
    if (stripped.startsWith('http') || stripped.includes('/assets/')) {
      candidates.push(stripped);
    } else {
      const rel = stripped.replace(/^\/?(lujainMomani-portfolio\/)?/, '').replace(/^pictures\//, '');
      candidates.push(`${publicBase}pictures/${rel}`);
    }
  }

  const original = title;
  const noParens = title.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
  const noPunct = noParens.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, ' ').trim();
  const variants = [
    `${publicBase}pictures/${original}`,
    `${publicBase}pictures/${noParens}`,
    `${publicBase}pictures/${noPunct}`,
    `${publicBase}pictures/${noPunct.replace(/\s+/g, '-')}`,
    `${publicBase}pictures/${noPunct.replace(/\s+/g, '_')}`,
  ];
  variants.forEach((b) => {
    if (!candidates.includes(b)) candidates.push(b);
  });
  return candidates;
}

/** Resolved browser URL for a project card/modal image. */
export function resolveProjectImageSrc(title: string, path?: string | null): string {
  const publicBase = import.meta.env.BASE_URL || '/';
  const raw = (path || '').trim();

  if (raw && BUNDLED[raw]) return BUNDLED[raw];
  if (raw === 'thesis.png') return thesisImage;
  if (raw.startsWith('src/assets/') && BUNDLED[raw]) return BUNDLED[raw];

  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('pictures/') && /\.(jpg|jpeg|png|webp|gif)$/i.test(raw)) {
    return `${publicBase}${raw}`;
  }

  const bases = getTitleBases(title, raw || undefined);
  if (bases.length === 0) return '';
  const first = bases[0];
  if (first.startsWith('http') || first.includes('/assets/')) return first;
  if (/\.(jpg|jpeg|png|webp|gif)$/i.test(first)) return first;
  return `${first}.jpg`;
}

export function resolveImage(path: string | undefined | null): string {
  if (!path) return '';
  const publicBase = import.meta.env.BASE_URL || '/';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (BUNDLED[path]) return BUNDLED[path];
  if (path.startsWith(publicBase)) return path;
  if (path.startsWith('pictures/')) {
    if (/\.(jpg|jpeg|png|webp|gif)$/i.test(path)) {
      return `${publicBase}${path}`;
    }
    return `${publicBase}${path}.jpg`;
  }
  if (path.startsWith('/')) return `${publicBase}${path.replace(/^\//, '')}`;
  if (path === 'thesis.png') return thesisImage;
  return `${publicBase}${path}`;
}

export { thesisImage, projectSecurity };
