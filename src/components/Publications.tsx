import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  Users,
  ExternalLink,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { useState } from 'react';
import { publications, experience, type Publication } from '@/lib/content';
import { resolveLinks } from '@/lib/links';
import { LinkButtons } from '@/components/LinkButtons';
import RichText, { toRichHtml } from '@/components/RichText';

const Publications = () => {
  const [mobileSection, setMobileSection] = useState<'published' | 'under'>('published');
  const { published, underReview } = publications;

    const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'under-review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'under-review':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const PublicationCard = ({ publication, index }: { publication: Publication; index: number }) => (
    <Card
      className="project-card overflow-hidden group p-4 sm:p-6 hover:border-border-hover hover:shadow-card transform hover:scale-[1.02] cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(publication.status)}
          <Badge className={`text-xs ${getStatusColor(publication.status)}`}>
            {publication.status === 'published' ? 'Published' :
             publication.status === 'under-review' ? 'Under Review' : 'In Progress'}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">{publication.year}</span>
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
        {publication.title}
      </h3>

      <div className="space-y-2 sm:space-y-3 mb-4">
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
              className="break-words hover:text-primary transition-colors underline"
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
    <section id="publications" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="section-header mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl">Publications</h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Research contributions in telecommunications, machine learning, and cybersecurity
          </p>
        </div>

        {/* Mobile: Collapsible two sections */}
        <div className="lg:hidden space-y-4">
          <button
            className="w-full flex items-center justify-between p-4 bg-card/60 rounded-lg border border-border cursor-pointer"
            onClick={() => setMobileSection(mobileSection === 'published' ? 'under' : 'published')}
            aria-expanded={mobileSection === 'published'}
            aria-controls="pub-published"
            role="button"
            tabIndex={0}
          >
            <span className="text-left text-xl font-bold text-foreground">Published Research</span>
            <ChevronDown className={`h-6 w-6 text-primary transition-transform ${mobileSection === 'published' ? 'rotate-180' : ''}`}/>
          </button>
          {mobileSection === 'published' && (
            <div id="pub-published" className="space-y-4">
              {published.map((publication, index) => (
                <PublicationCard key={publication.id} publication={publication} index={index} />
              ))}
            </div>
          )}

          <button
            className="mt-6 w-full flex items-center justify-between p-4 bg-card/60 rounded-lg border border-border cursor-pointer"
            onClick={() => setMobileSection(mobileSection === 'under' ? 'published' : 'under')}
            aria-expanded={mobileSection === 'under'}
            aria-controls="pub-under"
            role="button"
            tabIndex={0}
          >
            <span className="text-left text-xl font-bold text-foreground">Under Review & In Progress</span>
            <ChevronDown className={`h-6 w-6 text-primary transition-transform ${mobileSection === 'under' ? 'rotate-180' : ''}`}/>
          </button>
          {mobileSection === 'under' && (
            <div id="pub-under" className="space-y-4">
              {underReview.map((publication, index) => (
                <PublicationCard key={publication.id} publication={publication} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Desktop / Large screens: Side-by-side */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Published Section */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Published Research</h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {published.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Under Review/Work in Progress Section */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Under Review & In Progress</h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {underReview.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
          <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{published.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Published Papers</div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1 sm:mb-2">{underReview.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Under Review</div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border">
            <div className="text-2xl sm:text-3xl font-bold text-secondary mb-1 sm:mb-2">5</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Co-authors</div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border">
            <div className="text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2">2025</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Latest Year</div>
          </div>
        </div>
      </div>
    </section>
    {/* Professional Experience (Mini Section) */}
    <section id="experience" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Professional Experience</h3>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
