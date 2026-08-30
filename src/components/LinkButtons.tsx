import { Button } from '@/components/ui/button';
import { getLinkIcon, getLinkLabel, openLink, type ContentLink } from '@/lib/links';

type LinkButtonsProps = {
  links: ContentLink[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  iconOnly?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: 'h-8 w-8 p-0',
  md: 'btn-hero',
  lg: 'btn-hero px-8 py-3 text-lg',
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-5 w-5',
};

export function LinkIconButtons({
  links,
  size = 'sm',
  className = '',
}: Pick<LinkButtonsProps, 'links' | 'size' | 'className'>) {
  if (!links.length) return null;

  return (
    <div className={`flex space-x-2 ${className}`}>
      {links.map((link, index) => {
        const Icon = getLinkIcon(link.type);
        return (
          <Button
            key={`${link.type}-${link.url}-${index}`}
            size="sm"
            variant="ghost"
            className={sizeClasses[size]}
            onClick={(e) => {
              e.stopPropagation();
              openLink(link.url);
            }}
            aria-label={getLinkLabel(link)}
          >
            <Icon className={iconSizes[size]} />
          </Button>
        );
      })}
    </div>
  );
}

export function LinkButtons({
  links,
  size = 'md',
  variant = 'default',
  iconOnly = false,
  className = '',
}: LinkButtonsProps) {
  if (!links.length) return null;

  if (iconOnly) {
    return <LinkIconButtons links={links} size={size === 'lg' ? 'md' : 'sm'} className={className} />;
  }

  return (
    <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
      {links.map((link, index) => {
        const Icon = getLinkIcon(link.type);
        const isPrimary = index === 0 && variant === 'default';
        return (
          <Button
            key={`${link.type}-${link.url}-${index}`}
            className={isPrimary ? 'btn-hero' : 'btn-cyber'}
            variant={isPrimary ? 'default' : 'outline'}
            size={size === 'lg' ? 'lg' : 'default'}
            onClick={() => openLink(link.url)}
          >
            <Icon className={`${iconSizes[size === 'sm' ? 'sm' : 'md']} mr-2`} />
            <span className="relative z-10">{getLinkLabel(link)}</span>
          </Button>
        );
      })}
    </div>
  );
}

export function LinkPill({
  link,
  className = '',
}: {
  link: ContentLink;
  className?: string;
}) {
  const Icon = getLinkIcon(link.type);
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span>{getLinkLabel(link)}</span>
    </a>
  );
}
