import { ArrowDown } from 'lucide-react';
import mypicNew from '@/assets/mypicNew.jpeg';
import { site } from '@/lib/content';
import { getLinkIcon, openLink, resolveLinks } from '@/lib/links';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative flex min-h-[100dvh] items-center px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="order-2 animate-fade-in-up lg:order-1">
          <p className="eyebrow mb-5">{site.location || 'Dubai, UAE'}</p>

          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {site.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
            {site.title}
          </p>

          {site.honours?.length ? (
            <ul className="mt-8 grid max-w-xl gap-x-8 gap-y-2 border-l-2 border-primary/40 pl-5 sm:grid-cols-2">
              {site.honours.map((honour) => (
                <li key={honour} className="text-sm text-foreground/85">
                  {honour}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-hero px-5 py-2.5 text-sm" onClick={() => scrollToSection('projects')}>
              See my work
            </button>
            <button type="button" className="btn-cyber px-5 py-2.5 text-sm" onClick={() => scrollToSection('contact')}>
              Get in touch
            </button>

            <div className="ml-1 flex items-center gap-1">
              {resolveLinks(site).map((link, index) => {
                const Icon = getLinkIcon(link.type);
                return (
                  <button
                    key={`${link.type}-${link.url}-${index}`}
                    type="button"
                    onClick={() => openLink(link.url)}
                    className="rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={link.label || link.type}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <img
            src={mypicNew}
            alt={`Portrait of ${site.name}`}
            className="aspect-[4/5] w-44 rounded-2xl object-cover object-[50%_15%] shadow-card sm:w-56 lg:w-full lg:max-w-sm"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection('about')}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground md:block"
        aria-label="Scroll to About"
      >
        <ArrowDown size={20} />
      </button>
    </section>
  );
};

export default Hero;
