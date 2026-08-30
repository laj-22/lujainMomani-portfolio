import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

interface RichTextProps {
  html: string;
  className?: string;
  as?: 'div' | 'p' | 'span';
}

/** Renders sanitized HTML from structured content JSON. */
export default function RichText({ html, className, as: Tag = 'div' }: RichTextProps) {
  if (!html?.trim()) return null;
  const plain = html.replace(/<[^>]+>/g, '').trim();
  if (!plain) return null;

  const safe = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'span',
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });

  return (
    <Tag
      className={cn(
        'rich-text prose prose-sm dark:prose-invert max-w-none',
        '[&_strong]:text-primary [&_em]:italic [&_u]:underline',
        '[&_a]:text-primary [&_a]:underline',
        className
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

export function toRichHtml(text: string): string {
  if (!text) return '';
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return text
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
