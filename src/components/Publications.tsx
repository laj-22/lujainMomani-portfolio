import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, FileText } from 'lucide-react';
import { publications, experience, type Publication } from '@/lib/content';
import { resolveLinks } from '@/lib/links';
import { LinkButtons } from '@/components/LinkButtons';
import RichText, { toRichHtml } from '@/components/RichText';

const Publications = () => {
  const { published } = publications;
  const firstAuthor = published.filter((p) => p.authors.startsWith('Lujain')).length;
  const latestYear = Math.max(...published.map((p) => Number(p.year) || 0));

  const PublicationCard = ({ publication, index }: { publication: Publication; index: number }) => (
    <Card
      className="project-card group flex h-full flex-col p-5 md:p-4 lg:p-6"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge variant="secondary" className="font-mono text-[11px] uppercase tracking-wide">
          {publication.status === 'accepted' ? 'Accepted' : 'Published'}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">{publication.year}</span>
      </div>

      <h3 className="mb-3 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-[0.95rem] lg:text-lg">
        {publication.title}
      </h3>

      <div className="mb-5 flex-1 space-y-2">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="break-words leading-relaxed">{publication.authors}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="break-words">{publication.conference}</span>
        </div>

        {publication.doi && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <a 
              href={publication.doi} 
              target="_blank" 
              rel="noreferrer"
              className="break-all hover:text-primary transition-colors underline"
            >
              DOI: {publication.doi.replace('https://doi.org/', '')}
            </a>
          </div>
        )}
      </div>

      <LinkButtons
        links={resolveLinks(publication, { link: 'paper' })}
        size="sm"
        className="w-full"
      />
    </Card>
  );

  return (
    <>
    <section id="publications" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="section-header mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl">Publications</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Research contributions in telecommunications, machine learning, and cybersecurity
          </p>
        </div>

        <div className="mobile-rail grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-5">
          {published.map((publication, index) => (
            <PublicationCard key={publication.title} publication={publication} index={index} />
          ))}
        </div>

        <dl className="mt-12 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card text-center">
          <div className="p-5">
            <dt className="text-xs text-muted-foreground sm:text-sm">Peer-reviewed papers</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-foreground sm:text-3xl">{published.length}</dd>
          </div>
          <div className="p-5">
            <dt className="text-xs text-muted-foreground sm:text-sm">As first author</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-foreground sm:text-3xl">{firstAuthor}</dd>
          </div>
          <div className="p-5">
            <dt className="text-xs text-muted-foreground sm:text-sm">Latest year</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-foreground sm:text-3xl">{latestYear}</dd>
          </div>
        </dl>
      </div>
    </section>

    {/* Professional Experience (Mini Section) */}
    <section id="experience" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Professional Experience</h3>
        </div>

        <div className="mobile-rail grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {experience.map((item) => (
            <Card key={item.id} className="p-6 border border-border">
              <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
              <div className="text-sm text-muted-foreground mb-2">{item.meta}</div>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                {item.bullets.map((bullet, idx) => (
                  <li key={idx}>
                    <RichText html={toRichHtml(bullet)} className="inline" as="span" />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default Publications;
