import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar } from 'lucide-react';
import { thesis } from '@/lib/content';
import { projectSecurity, resolveImage } from '@/lib/images';
import { resolveLinks } from '@/lib/links';
import { LinkButtons } from '@/components/LinkButtons';
import RichText, { toRichHtml } from '@/components/RichText';

const publicBase = import.meta.env.BASE_URL || '/';

interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  github?: string;
  links?: Array<{ type: string; url: string; label?: string }>;
  linkedProjectId?: string;
  tags: string[];
  achievements: string[];
  tech: Array<{ name: string; role: string }>;
  date?: string;
}

const ProjectOfTheMonth = () => {
  const [showDetails, setShowDetails] = useState(false);
  const featuredProject = thesis as FeaturedProject;

  const openProjectDetails = () => {
    const projectId = featuredProject.linkedProjectId || featuredProject.id;
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => {
      const card = document.getElementById(projectId);
      if (card) {
        card.click();
        return;
      }
      // Fallback: match by title (legacy)
      const button = document.querySelector(
        `[data-title="${featuredProject.title}"]`
      ) as HTMLButtonElement | null;
      button?.click();
    }, 450);
  };

  return (
    <section id="featured" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="h-8 w-8 text-secondary fill-secondary" />
            <h2 className="section-header">Graduation Project Spotlight</h2>
            <Star className="h-8 w-8 text-secondary fill-secondary" />
          </div>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8"></div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing my thesis project in AI-driven IoT cybersecurity
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 bg-gradient-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative aspect-[16/9] lg:aspect-[4/3] w-full">
                <img
                  src={resolveImage(featuredProject.image)}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover"
                  data-bases={[
                    `${publicBase}pictures/${featuredProject.title}`,
                    `${publicBase}pictures/${featuredProject.title.replace(/[()]/g, '')}`,
                  ].join('|')}
                  data-eidx="0"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    const exts = ['.jpg', '.jpeg', '.png', '.webp'];
                    const bases = (img.getAttribute('data-bases') || '').split('|').filter(Boolean);
                    let eIdx = Number(img.getAttribute('data-eidx') || '0');
                    eIdx += 1;
                    if (eIdx >= exts.length) {
                      eIdx = 0;
                      bases.shift();
                      img.setAttribute('data-bases', bases.join('|'));
                    }
                    if (bases.length > 0) {
                      img.setAttribute('data-eidx', String(eIdx));
                      img.src = `${bases[0]}${exts[eIdx]}`;
                      return;
                    }
                    img.src = projectSecurity;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent lg:hidden" />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary text-primary-foreground font-semibold text-sm px-3 py-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    {featuredProject.date || '2026'}
                  </Badge>
                </div>
              </div>

              <div className="p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    {featuredProject.title}
                  </h3>
                  <RichText
                    html={toRichHtml(featuredProject.description)}
                    className="text-lg text-muted-foreground leading-relaxed mb-6"
                    as="p"
                  />

                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredProject.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <Button className="btn-hero flex-1 sm:flex-none" onClick={openProjectDetails}>
                    <span className="relative z-10">View Details</span>
                  </Button>
                  <LinkButtons
                    links={resolveLinks(featuredProject)}
                    className="flex-1 sm:flex-none justify-start sm:justify-center"
                  />
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-primary hover:text-primary-glow self-start"
                >
                  {showDetails ? 'Hide Details' : 'Show Technical Details'}
                </Button>
              </div>
            </div>

            {showDetails && (
              <div className="border-t border-border bg-muted/10 p-8 lg:p-12 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-4">Technical Overview</h4>
                    <RichText
                      html={toRichHtml(featuredProject.longDescription)}
                      className="text-muted-foreground leading-relaxed mb-6"
                    />

                    <h5 className="text-lg font-semibold text-foreground mb-3">Key Achievements</h5>
                    <ul className="space-y-2">
                      {featuredProject.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <Star className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-foreground mb-3">Technology Stack</h5>
                    <div className="space-y-3">
                      {featuredProject.tech.map((tech, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-card rounded-lg border border-border"
                        >
                          <span className="font-medium text-foreground">{tech.name}</span>
                          <span className="text-sm text-muted-foreground">{tech.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProjectOfTheMonth;
