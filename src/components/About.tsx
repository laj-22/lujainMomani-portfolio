import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { about, site } from '@/lib/content';
import { getIcon } from '@/lib/icons';
import RichText, { toRichHtml } from '@/components/RichText';

const About = () => {
  const paragraphs = about.paragraphs?.length ? about.paragraphs : site.aboutParagraphs;

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">About Me</h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up space-y-6 sm:space-y-8">
            {paragraphs.map((paragraph, index) => (
              <RichText
                key={index}
                html={toRichHtml(paragraph)}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed"
                as="p"
              />
            ))}

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`${import.meta.env.BASE_URL || '/'}${site.cvPath}`} download={site.cvPath}>
                <Button size="lg" className="btn-hero">
                  <Download className="h-5 w-5 mr-2" />
                  <span className="relative z-10">Download CV</span>
                </Button>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 animate-slide-in-right">
            {about.highlights.map((highlight, index) => (
              <Card
                key={highlight.title}
                className="project-card p-6 border-l-4 border-l-primary"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-primary">{getIcon(highlight.icon, 'h-8 w-8')}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{highlight.title}</h3>
                    <RichText
                      html={toRichHtml(highlight.description)}
                      className="text-muted-foreground"
                      as="p"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
