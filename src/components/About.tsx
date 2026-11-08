import { Download } from 'lucide-react';
import { about, site } from '@/lib/content';
import { getIcon } from '@/lib/icons';
import RichText, { toRichHtml } from '@/components/RichText';

const base = import.meta.env.BASE_URL || '/';

const certificates = [
  {
    src: 'certificates/top-graduate-award.jpg',
    title: 'Top Graduate Award',
    caption: 'University of Wollongong in Dubai, 2026',
  },
  {
    src: 'certificates/first-class-honours.jpg',
    title: 'First Class Honours (Class I)',
    caption: 'Bachelor of Engineering (Honours), 2026',
  },
];

const About = () => {
  const paragraphs = about.paragraphs?.length ? about.paragraphs : site.aboutParagraphs;

  return (
    <section id="about" className="px-4 py-14 sm:py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="section-header mb-10 text-center">About Me</h2>

        <div className="grid items-start gap-10 md:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div className="animate-fade-in-up space-y-5">
            {paragraphs.map((paragraph, index) => (
              <RichText
                key={index}
                html={toRichHtml(paragraph)}
                className="max-w-[65ch] text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem] [&_strong]:font-semibold [&_strong]:text-foreground"
                as="p"
              />
            ))}

            <a
              href={`${base}${site.cvPath}`}
              download={site.cvPath}
              className="btn-hero mt-2 px-5 py-2.5 text-sm"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </div>

          <div>
            <p className="eyebrow mb-4">Credentials</p>
            <div className="grid grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <a
                  key={cert.src}
                  href={`${base}${cert.src}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl border border-border bg-card p-2 transition-[border-color,box-shadow] hover:border-border-hover hover:shadow-card"
                >
                  <img
                    src={`${base}${cert.src}`}
                    alt={`${cert.title} certificate for ${site.name}`}
                    loading="lazy"
                    className="aspect-[3/4] w-full rounded-lg bg-muted object-cover object-top"
                  />
                  <div className="px-1 pb-1 pt-3">
                    <p className="text-sm font-semibold leading-snug text-foreground">{cert.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{cert.caption}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mobile-rail mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 md:grid-cols-3">
          {about.highlights.map((highlight) => (
            <div key={highlight.title} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 inline-flex rounded-lg bg-accent p-2 text-accent-foreground">
                {getIcon(highlight.icon, 'h-5 w-5')}
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-foreground">{highlight.title}</h3>
              <RichText
                html={toRichHtml(highlight.description)}
                className="text-sm leading-relaxed text-muted-foreground"
                as="p"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
